const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const UserAgent = require('user-agents');
const fs = require('fs');

// Enable stealth plugin
puppeteer.use(StealthPlugin());

const AGENT_URL = 'https://www.property24.com/for-sale/agency/greeff-christies-international-real-estate-head-office/laeeq-allie/430283';

async function scrapeProperty24WithStealth() {
  console.log('🥷 Starting Property24 stealth scraper for La\'eeq Allie...');

  const browser = await puppeteer.launch({
    headless: false, // Show browser for debugging
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-features=VizDisplayCompositor',
      '--disable-web-security',
      '--disable-features=site-per-process',
      '--disable-dev-shm-usage',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-default-apps'
    ],
    defaultViewport: {
      width: 1366 + Math.floor(Math.random() * 100),
      height: 768 + Math.floor(Math.random() * 100)
    }
  });

  const page = await browser.newPage();

  // Set realistic user agent
  const userAgent = new UserAgent();
  await page.setUserAgent(userAgent.toString());

  // Set additional headers
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
  });

  // Override webdriver property and other automation indicators
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', {
      get: () => undefined,
    });

    Object.defineProperty(navigator, 'plugins', {
      get: () => [1, 2, 3, 4, 5],
    });

    Object.defineProperty(navigator, 'languages', {
      get: () => ['en-US', 'en'],
    });

    // Override chrome runtime
    window.chrome = {
      runtime: {}
    };

    // Override permissions API
    const originalQuery = window.navigator.permissions.query;
    window.navigator.permissions.query = (parameters) => (
      parameters.name === 'notifications' ?
        Promise.resolve({ state: Notification.permission }) :
        originalQuery(parameters)
    );
  });

  const allProperties = [];

  try {
    // Navigate to page 1
    console.log('📋 Loading page 1...');
    await page.goto(AGENT_URL, {
      waitUntil: 'networkidle2',
      timeout: 45000
    });

    // Wait for potential Cloudflare challenge
    await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));

    // Check if we hit Cloudflare challenge
    const title = await page.title();
    console.log('Page title:', title);

    if (title.includes('Just a moment') || title.includes('Cloudflare') || title.includes('Security check')) {
      console.log('⏳ Cloudflare challenge detected, waiting...');
      await new Promise(resolve => setTimeout(resolve, 15000));
      await page.reload({ waitUntil: 'networkidle2' });
    }

    // Add some human-like behavior
    await page.mouse.move(100 + Math.random() * 200, 100 + Math.random() * 200);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Extract properties from page 1
    console.log('🔍 Extracting properties from page 1...');
    const page1Properties = await page.evaluate(() => {
      const properties = [];

      // Try multiple selectors to find property tiles
      let tiles = document.querySelectorAll('.p24_regularTile');
      if (tiles.length === 0) {
        tiles = document.querySelectorAll('.property-card, .listing-card, .property-item, [class*="tile"], [class*="listing"]');
      }

      console.log(`Found ${tiles.length} property tiles`);

      tiles.forEach((tile, index) => {
        try {
          // Get the property link
          const linkEl = tile.querySelector('a[href*="/for-sale/"]');
          const url = linkEl ? linkEl.href : '';
          const propertyId = url.split('/').pop();

          // Get the main image - CRITICAL for gallery view
          let mainImage = '';
          const imgSelectors = [
            '.p24_listingTileImage img',
            '.p24_image img',
            '.property-image img',
            'img[src*="property24"]',
            'img'
          ];

          for (const selector of imgSelectors) {
            const imgEl = tile.querySelector(selector);
            if (imgEl) {
              mainImage = imgEl.src || imgEl.dataset.src || imgEl.dataset.original || '';
              if (mainImage && !mainImage.includes('NoImage') && !mainImage.includes('placeholder')) {
                // Ensure high quality
                mainImage = mainImage.replace(/\/\d+x\d+/, '/640x480');
                break;
              }
            }
          }

          // Get title
          const titleSelectors = ['.p24_title', '.property-title', '.listing-title', 'h3', 'h4'];
          let title = '';
          for (const selector of titleSelectors) {
            const titleEl = tile.querySelector(selector);
            if (titleEl) {
              title = titleEl.textContent.trim();
              break;
            }
          }

          // Get location
          const locationSelectors = ['.p24_location', '.property-location', '.location', '.address'];
          let location = 'Cape Town';
          for (const selector of locationSelectors) {
            const locationEl = tile.querySelector(selector);
            if (locationEl) {
              location = locationEl.textContent.trim();
              break;
            }
          }

          // Get price
          const priceSelectors = ['.p24_price', '.property-price', '.listing-price', '.price'];
          let price = 'POA';
          for (const selector of priceSelectors) {
            const priceEl = tile.querySelector(selector);
            if (priceEl) {
              price = priceEl.textContent.trim().replace(/\\n/g, ' ').replace(/\\s+/g, ' ');
              break;
            }
          }

          // Get features (beds, baths, size)
          let bedrooms = null, bathrooms = null, garages = null, area = null;
          const featureSelectors = [
            '.p24_featureDetails .p24_feature',
            '.p24_icons span',
            '.property-features span',
            '.features span'
          ];

          for (const selector of featureSelectors) {
            const features = tile.querySelectorAll(selector);
            features.forEach(feature => {
              const text = feature.textContent.trim();
              if (text.includes('Bedroom') && !bedrooms) {
                const num = text.match(/(\\d+)/);
                if (num) bedrooms = parseInt(num[1]);
              } else if (text.includes('Bathroom') && !bathrooms) {
                const num = text.match(/(\\d+)/);
                if (num) bathrooms = parseInt(num[1]);
              } else if (text.includes('Garage') && !garages) {
                const num = text.match(/(\\d+)/);
                if (num) garages = parseInt(num[1]);
              } else if (text.includes('m²') && !area) {
                const num = text.match(/(\\d+)/);
                if (num) area = `${num[1]} m²`;
              }
            });
          }

          // Determine property type
          let type = 'Apartment';
          const fullText = (title + ' ' + url).toLowerCase();
          if (fullText.includes('house')) type = 'House';
          else if (fullText.includes('townhouse')) type = 'Townhouse';
          else if (fullText.includes('penthouse')) type = 'Penthouse';
          else if (fullText.includes('studio')) type = 'Studio';

          if (propertyId && title) {
            properties.push({
              id: propertyId,
              title: title,
              price: price,
              location: location,
              bedrooms: bedrooms,
              bathrooms: bathrooms,
              area: area,
              type: type,
              status: 'available',
              images: mainImage ? [mainImage] : [],
              description: '',
              features: garages ? [`${garages} Garage${garages > 1 ? 's' : ''}`] : [],
              source: 'property24',
              sourceUrl: url,
              agentName: "La'eeq Allie",
              agentContact: "+27 82 123 4567"
            });
          }
        } catch (error) {
          console.error('Error extracting property:', error);
        }
      });

      return properties;
    });

    console.log(`✅ Found ${page1Properties.length} properties on page 1`);
    allProperties.push(...page1Properties);

    // Navigate to page 2
    console.log('\\n📋 Loading page 2...');
    await page.goto(`${AGENT_URL}?page=2`, {
      waitUntil: 'networkidle2',
      timeout: 45000
    });

    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

    // Extract properties from page 2
    console.log('🔍 Extracting properties from page 2...');
    const page2Properties = await page.evaluate(() => {
      const properties = [];

      let tiles = document.querySelectorAll('.p24_regularTile');
      if (tiles.length === 0) {
        tiles = document.querySelectorAll('.property-card, .listing-card, .property-item, [class*="tile"], [class*="listing"]');
      }

      console.log(`Found ${tiles.length} property tiles on page 2`);

      tiles.forEach((tile, index) => {
        try {
          const linkEl = tile.querySelector('a[href*="/for-sale/"]');
          const url = linkEl ? linkEl.href : '';
          const propertyId = url.split('/').pop();

          let mainImage = '';
          const imgSelectors = ['.p24_listingTileImage img', '.p24_image img', 'img'];
          for (const selector of imgSelectors) {
            const imgEl = tile.querySelector(selector);
            if (imgEl) {
              mainImage = imgEl.src || imgEl.dataset.src || imgEl.dataset.original || '';
              if (mainImage && !mainImage.includes('NoImage')) {
                mainImage = mainImage.replace(/\/\d+x\d+/, '/640x480');
                break;
              }
            }
          }

          const titleEl = tile.querySelector('.p24_title, .property-title, h3, h4');
          const title = titleEl ? titleEl.textContent.trim() : '';

          const locationEl = tile.querySelector('.p24_location, .location');
          const location = locationEl ? locationEl.textContent.trim() : 'Cape Town';

          const priceEl = tile.querySelector('.p24_price, .price');
          const price = priceEl ? priceEl.textContent.trim() : 'POA';

          if (propertyId && title) {
            properties.push({
              id: propertyId,
              title: title,
              price: price,
              location: location,
              bedrooms: null,
              bathrooms: null,
              area: null,
              type: 'Apartment',
              status: 'available',
              images: mainImage ? [mainImage] : [],
              description: '',
              features: [],
              source: 'property24',
              sourceUrl: url,
              agentName: "La'eeq Allie",
              agentContact: "+27 82 123 4567"
            });
          }
        } catch (error) {
          console.error('Error extracting property:', error);
        }
      });

      return properties;
    });

    console.log(`✅ Found ${page2Properties.length} properties on page 2`);
    allProperties.push(...page2Properties);

    console.log(`\\n🎉 Scraping complete!`);
    console.log(`📊 Total properties scraped: ${allProperties.length}`);

    // Save the data
    const result = {
      timestamp: new Date().toISOString(),
      agent: "La'eeq Allie",
      company: "Greeff Christie's International Real Estate",
      totalProperties: allProperties.length,
      properties: allProperties
    };

    fs.writeFileSync('property24-stealth-data.json', JSON.stringify(result, null, 2));
    console.log('📁 Data saved to: property24-stealth-data.json');

    await browser.close();
    return result;

  } catch (error) {
    console.error('❌ Error during scraping:', error);
    await browser.close();
    throw error;
  }
}

// Run the stealth scraper
if (require.main === module) {
  scrapeProperty24WithStealth()
    .then(result => {
      console.log('\\n✨ All done! Properties are ready to be imported into mockData.ts');
      console.log(`   Total properties: ${result.totalProperties}`);
    })
    .catch(console.error);
}

module.exports = { scrapeProperty24WithStealth };