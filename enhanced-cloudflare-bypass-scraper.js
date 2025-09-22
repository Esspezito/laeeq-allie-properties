const puppeteer = require('rebrowser-puppeteer');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');

// Use rebrowser-puppeteer with stealth plugin for maximum Cloudflare bypass
const puppeteerExtra = require('puppeteer-extra');
puppeteerExtra.use(StealthPlugin());

// La'eeq's Property24 URLs that were previously showing "server unavailable"
const BLOCKED_PROPERTY_URLS = [
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116223544",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116441599",
  "https://www.property24.com/for-sale/gardens/cape-town/western-cape/9145/116338371",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116280718",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116281167"
];

async function bypassCloudflareAndScrape() {
  console.log('🚀 Starting enhanced Cloudflare bypass scraper with rebrowser-puppeteer...');
  console.log('🎯 Targeting Property24 listings that were showing "server unavailable"');

  const browser = await puppeteer.launch({
    headless: false, // Important: Cloudflare bypass works better in headful mode
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
      '--window-size=1920,1080',
      '--disable-blink-features=AutomationControlled',
      '--disable-background-networking',
      '--disable-background-timer-throttling',
      '--disable-renderer-backgrounding'
    ],
    defaultViewport: { width: 1920, height: 1080 }
  });

  const page = await browser.newPage();

  // Enhanced anti-detection measures
  await page.evaluateOnNewDocument(() => {
    // Remove webdriver property
    delete navigator.webdriver;

    // Mock plugins
    Object.defineProperty(navigator, 'plugins', {
      get: () => [1, 2, 3, 4, 5].map(() => ({ name: 'Chrome PDF Plugin' })),
    });

    // Mock languages
    Object.defineProperty(navigator, 'languages', {
      get: () => ['en-US', 'en'],
    });
  });

  // Set realistic user agent
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  // Set additional headers to appear more human
  await page.setExtraHTTPHeaders({
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Cache-Control': 'max-age=0'
  });

  const results = [];

  try {
    for (let i = 0; i < BLOCKED_PROPERTY_URLS.length; i++) {
      const url = BLOCKED_PROPERTY_URLS[i];
      const propertyId = url.split('/').pop();

      console.log(`\\n[${i + 1}/${BLOCKED_PROPERTY_URLS.length}] Testing previously blocked property ${propertyId}...`);

      try {
        // Navigate with longer timeout for Cloudflare challenges
        console.log('   🌐 Loading page...');
        await page.goto(url, {
          waitUntil: 'networkidle2',
          timeout: 120000 // 2 minutes for Cloudflare challenges
        });

        // Wait for potential Cloudflare challenge to complete
        console.log('   ⏳ Waiting for Cloudflare challenge...');
        await new Promise(resolve => setTimeout(resolve, 10000));

        // Check if we're still on a Cloudflare challenge page
        const isCloudflareChallenge = await page.evaluate(() => {
          const title = document.title.toLowerCase();
          const bodyText = document.body.textContent.toLowerCase();
          return title.includes('cloudflare') ||
                 title.includes('checking') ||
                 bodyText.includes('checking your browser') ||
                 bodyText.includes('cloudflare') ||
                 bodyText.includes('ddos protection');
        });

        if (isCloudflareChallenge) {
          console.log('   🔄 Still on Cloudflare challenge page, waiting longer...');
          await new Promise(resolve => setTimeout(resolve, 15000));
        }

        // Check final page status
        const pageStatus = await page.evaluate(() => {
          const title = document.title;
          const bodyText = document.body.textContent;

          return {
            title: title,
            hasServerUnavailable: bodyText.toLowerCase().includes('server unavailable'),
            hasListingNotFound: bodyText.toLowerCase().includes('listing not found'),
            hasCloudflare: bodyText.toLowerCase().includes('cloudflare'),
            hasActualContent: document.querySelector('h1, .p24_title, [class*="title"]') !== null,
            bodySnippet: bodyText.substring(0, 200)
          };
        });

        console.log(`   📄 Page title: ${pageStatus.title}`);
        console.log(`   📋 Status: ${pageStatus.hasServerUnavailable ? 'Server Unavailable' :
                                      pageStatus.hasListingNotFound ? 'Listing Not Found' :
                                      pageStatus.hasCloudflare ? 'Cloudflare Challenge' :
                                      pageStatus.hasActualContent ? 'Success!' : 'Unknown'}`);

        if (!pageStatus.hasServerUnavailable && !pageStatus.hasListingNotFound && !pageStatus.hasCloudflare && pageStatus.hasActualContent) {
          console.log('   ✅ Successfully bypassed! Extracting data...');

          // Extract property details
          const propertyData = await page.evaluate(() => {
            const priceEl = document.querySelector('.p24_price, [class*="price"]');
            const titleEl = document.querySelector('h1, .p24_title');
            const locationEl = document.querySelector('.p24_location, [class*="location"]');

            const bodyText = document.body.textContent;
            const bedroomMatch = bodyText.match(/(\\d+)\\s+bedroom/i);
            const bathroomMatch = bodyText.match(/(\\d+)\\s+bathroom/i);
            const areaMatch = bodyText.match(/(\\d+(?:\\.\\d+)?)\\s*m²/i);

            return {
              price: priceEl ? priceEl.textContent.trim() : 'POA',
              title: titleEl ? titleEl.textContent.trim() : 'Property Listing',
              location: locationEl ? locationEl.textContent.trim() : '',
              bedrooms: bedroomMatch ? parseInt(bedroomMatch[1]) : null,
              bathrooms: bathroomMatch ? parseInt(bathroomMatch[1]) : null,
              area: areaMatch ? `${areaMatch[1]} m²` : null
            };
          });

          results.push({
            id: propertyId,
            url: url,
            status: 'success',
            ...propertyData
          });

          console.log(`   💰 Price: ${propertyData.price}`);
          console.log(`   🏠 Title: ${propertyData.title.substring(0, 50)}...`);

        } else {
          results.push({
            id: propertyId,
            url: url,
            status: pageStatus.hasServerUnavailable ? 'server_unavailable' :
                    pageStatus.hasListingNotFound ? 'listing_not_found' :
                    pageStatus.hasCloudflare ? 'cloudflare_blocked' : 'unknown_error',
            title: pageStatus.title,
            bodySnippet: pageStatus.bodySnippet
          });
        }

      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        results.push({
          id: propertyId,
          url: url,
          status: 'error',
          error: error.message
        });
      }

      // Human-like delay between requests
      const delay = Math.random() * 10000 + 15000; // 15-25 seconds
      console.log(`   ⏱️  Waiting ${Math.round(delay/1000)}s before next request...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    // Save results
    fs.writeFileSync('cloudflare-bypass-test-results.json', JSON.stringify({
      timestamp: new Date().toISOString(),
      testDescription: 'Testing rebrowser-puppeteer Cloudflare bypass on Property24',
      totalTested: BLOCKED_PROPERTY_URLS.length,
      successful: results.filter(r => r.status === 'success').length,
      stillBlocked: results.filter(r => r.status !== 'success').length,
      results: results
    }, null, 2));

    const successful = results.filter(r => r.status === 'success').length;

    console.log('\\n✅ Cloudflare bypass test complete!');
    console.log(`📊 Results: ${successful}/${BLOCKED_PROPERTY_URLS.length} properties successfully accessed`);
    console.log(`🎯 Success rate: ${Math.round((successful/BLOCKED_PROPERTY_URLS.length)*100)}%`);

    if (successful > 0) {
      console.log('🎉 rebrowser-puppeteer successfully bypassed Cloudflare protection!');
    } else {
      console.log('❌ Still experiencing blocks - may need additional techniques');
    }

    await browser.close();
    return results;

  } catch (error) {
    console.error('❌ Error:', error);
    await browser.close();
    throw error;
  }
}

// Run the enhanced bypass test
if (require.main === module) {
  bypassCloudflareAndScrape()
    .then(results => {
      const successful = results.filter(r => r.status === 'success').length;
      console.log(`\\n🎯 Final Result: ${successful > 0 ? 'Cloudflare bypass WORKING!' : 'Still blocked - need more advanced techniques'}`);
    })
    .catch(console.error);
}

module.exports = { bypassCloudflareAndScrape };