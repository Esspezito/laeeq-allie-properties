const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeAgentListingsPage(agentUrl = 'https://www.greeff.co.za/results/agent/25192/') {
  console.log('🚀 Starting agent listings page scraper...');
  console.log(`📍 Agent URL: ${agentUrl}\n`);

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  try {
    console.log('📋 Loading agent listings page...');
    await page.goto(agentUrl, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    await new Promise(resolve => setTimeout(resolve, 3000));

    const propertyUrls = await page.evaluate(() => {
      const urls = [];

      const linkSelectors = [
        'a[href*="/results/residential/"]',
        '.property-link',
        '.listing-link',
        'a[href*="/for-sale/"]',
        'a[href*="/apartment/"]',
        'a[href*="/house/"]',
        'a[href*="/studio-apartment/"]',
        'a[href*="/penthouse/"]'
      ];

      linkSelectors.forEach(selector => {
        const links = document.querySelectorAll(selector);
        links.forEach(link => {
          const href = link.href;
          if (href &&
              href.includes('greeff.co.za/results/residential/') &&
              !urls.includes(href) &&
              !href.includes('/agent/')) {
            urls.push(href);
          }
        });
      });

      const allLinks = document.querySelectorAll('a');
      allLinks.forEach(link => {
        const href = link.href;
        if (href &&
            href.includes('greeff.co.za/results/residential/for-sale/') &&
            href.match(/\/\d+\/$/) &&
            !urls.includes(href)) {
          urls.push(href);
        }
      });

      return [...new Set(urls)];
    });

    console.log(`✅ Found ${propertyUrls.length} property listings\n`);

    await browser.close();

    const result = {
      timestamp: new Date().toISOString(),
      agentUrl: agentUrl,
      totalProperties: propertyUrls.length,
      propertyUrls: propertyUrls
    };

    fs.writeFileSync('agent-property-urls.json', JSON.stringify(result, null, 2));
    console.log('📁 Property URLs saved to: agent-property-urls.json');

    return result;

  } catch (error) {
    console.error('❌ Error scraping agent page:', error.message);
    await browser.close();
    throw error;
  }
}

async function compareWithExisting() {
  console.log('\n📊 Comparing with existing properties...\n');

  let existingProperties = [];
  if (fs.existsSync('laeeq-allie-greeff-properties.json')) {
    const data = JSON.parse(fs.readFileSync('laeeq-allie-greeff-properties.json', 'utf8'));
    existingProperties = data.properties.map(p => p.sourceUrl);
  }

  let currentUrls = [];
  if (fs.existsSync('agent-property-urls.json')) {
    const data = JSON.parse(fs.readFileSync('agent-property-urls.json', 'utf8'));
    currentUrls = data.propertyUrls;
  }

  const newProperties = currentUrls.filter(url => !existingProperties.includes(url));
  const removedProperties = existingProperties.filter(url => !currentUrls.includes(url));

  console.log(`🆕 New properties found: ${newProperties.length}`);
  if (newProperties.length > 0) {
    console.log('New property URLs:');
    newProperties.forEach(url => console.log(`  - ${url}`));
  }

  console.log(`\n🔴 Properties no longer listed: ${removedProperties.length}`);
  if (removedProperties.length > 0) {
    console.log('Removed property URLs:');
    removedProperties.forEach(url => console.log(`  - ${url}`));
  }

  return {
    new: newProperties,
    removed: removedProperties,
    existing: currentUrls.filter(url => existingProperties.includes(url))
  };
}

if (require.main === module) {
  scrapeAgentListingsPage()
    .then(() => compareWithExisting())
    .catch(console.error);
}

module.exports = { scrapeAgentListingsPage, compareWithExisting };