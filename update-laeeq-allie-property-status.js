const puppeteer = require('puppeteer');
const fs = require('fs');

console.log('🔄 UPDATING PROPERTY STATUSES FROM GREEFF WEBSITE...\n');

async function updatePropertyStatuses() {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor'
    ]
  });

  // Read current properties
  const mockDataContent = fs.readFileSync('src/lib/mockData.ts', 'utf8');
  
  // First, let's extract just the sourceUrls to check statuses
  const sourceUrlMatches = mockDataContent.match(/\"sourceUrl\": \"(https:\/\/www\.greeff\.co\.za[^\"]+)\"/g);
  
  if (!sourceUrlMatches) {
    console.log('❌ Could not find sourceUrls in mockData.ts');
    return;
  }

  console.log(`📋 Found ${sourceUrlMatches.length} properties to check status for`);
  
  const updates = [];

  // For each property, get the sourceUrl and check status  
  let updatedCount = 0;
  let availableCount = 0;
  let underOfferCount = 0;
  let soldCount = 0;

  for (let i = 0; i < sourceUrlMatches.length; i++) {
    const sourceUrlMatch = sourceUrlMatches[i];
    
    // Extract the actual URL from the match
    const urlMatch = sourceUrlMatch.match(/\"sourceUrl\": \"(.*?)\"/);
    if (!urlMatch) continue;
    
    const sourceUrl = urlMatch[1];
    
    console.log(`\n🏠 Checking status for property ${i + 1}/17`);
    console.log(`🔗 URL: ${sourceUrl}`);
    
    try {
      const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      
      await page.goto(sourceUrl, { 
        waitUntil: 'networkidle2', 
        timeout: 30000 
      });

      // Wait for page to load
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check for various status indicators on Greeff website
      let status = 'available'; // default

      // Check if property is sold
      const soldIndicators = await page.evaluate(() => {
        const bodyText = document.body.innerText.toLowerCase();
        const soldKeywords = ['sold', 'verkoop', 'withdrawn', 'off the market'];
        return soldKeywords.some(keyword => bodyText.includes(keyword));
      });

      // Check if property is under offer
      const underOfferIndicators = await page.evaluate(() => {
        const bodyText = document.body.innerText.toLowerCase();
        const underOfferKeywords = ['under offer', 'onder aanbod', 'pending', 'conditional sale'];
        return underOfferKeywords.some(keyword => bodyText.includes(keyword));
      });

      // Check for specific status badges or elements
      const statusElements = await page.evaluate(() => {
        // Look for common status indicators
        const statusSelectors = [
          '[class*="status"]',
          '[class*="badge"]',
          '[class*="label"]',
          '.property-status',
          '.listing-status'
        ];
        
        for (const selector of statusSelectors) {
          const elements = document.querySelectorAll(selector);
          for (const el of elements) {
            const text = el.textContent.toLowerCase();
            if (text.includes('sold') || text.includes('verkoop')) return 'sold';
            if (text.includes('under offer') || text.includes('onder aanbod')) return 'under-offer';
            if (text.includes('pending') || text.includes('conditional')) return 'under-offer';
          }
        }
        return null;
      });

      // Determine final status
      if (soldIndicators || statusElements === 'sold') {
        status = 'sold';
        soldCount++;
      } else if (underOfferIndicators || statusElements === 'under-offer') {
        status = 'under-offer';
        underOfferCount++;
      } else {
        status = 'available';
        availableCount++;
      }

      console.log(`   ✅ Status: ${status.toUpperCase()}`);

      // Store the update
      updates.push({
        sourceUrl: sourceUrl,
        newStatus: status
      });

      updatedCount++;

      await page.close();
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log(`   ⚠️  Could not check status: ${error.message}`);
      // Keep original status or default to available
      updates.push({
        sourceUrl: sourceUrl,
        newStatus: 'available'
      });
      availableCount++; // Assume available if we can't check
    }
  }

  await browser.close();

  // Apply all the status updates to the mockData file
  let updatedMockDataContent = mockDataContent;
  
  for (const update of updates) {
    // Find and replace the status for this specific sourceUrl
    const regex = new RegExp(`(\"sourceUrl\": \"${update.sourceUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\",?[\\s\\S]*?\"status\": \")([^\"]+)(\")`);
    updatedMockDataContent = updatedMockDataContent.replace(regex, `$1${update.newStatus}$3`);
  }

  fs.writeFileSync('src/lib/mockData.ts', updatedMockDataContent);

  console.log('\n🎉 STATUS UPDATE COMPLETE!');
  console.log(`\n📊 Final Status Breakdown:`);
  console.log(`   ✅ Available: ${availableCount} properties`);
  console.log(`   ⏳ Under Offer: ${underOfferCount} properties`);
  console.log(`   🔴 Sold: ${soldCount} properties`);
  console.log(`   📝 Total Updated: ${updatedCount} properties`);
  console.log('\n📁 Updated: src/lib/mockData.ts');
}

updatePropertyStatuses().catch(console.error);