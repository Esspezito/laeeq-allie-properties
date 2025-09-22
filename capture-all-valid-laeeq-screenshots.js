const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');

puppeteer.use(StealthPlugin());

// ALL La'eeq's Property24 URLs (29 listings from capture-clean-images-only.js)
const ALL_LAEEQ_URLS = [
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116455279",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116455489",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116455093",
  "https://www.property24.com/for-sale/gardens/cape-town/western-cape/9145/116439140",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116441627",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116441202",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116223544",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116441599",
  "https://www.property24.com/for-sale/gardens/cape-town/western-cape/9145/116338371",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116280718",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116281167",
  "https://www.property24.com/for-sale/woodstock/cape-town/western-cape/10164/116282958",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116281209",
  "https://www.property24.com/for-sale/gardens/cape-town/western-cape/9145/116296190",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116280871",
  "https://www.property24.com/for-sale/gardens/cape-town/western-cape/9145/116226593",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116283204",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116220646",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116200162",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116216202",
  "https://www.property24.com/for-sale/woodstock/cape-town/western-cape/10164/116155994",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115943244",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115843150",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115629416",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115437832",
  "https://www.property24.com/for-sale/gardens/cape-town/western-cape/9145/115285887",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115488888",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116151599",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115311090"
];

async function captureAllValidLaeeqScreenshots() {
  console.log(`🎯 Capturing screenshots from ALL ${ALL_LAEEQ_URLS.length} La'eeq Property24 listings...`);
  console.log('📸 Focus: ONLY first property images, no borders or page elements');

  const screenshotsDir = path.join(__dirname, 'public', 'laeeq-screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1920,1080',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ],
    defaultViewport: { width: 1920, height: 1080 }
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  const validProperties = [];
  const failedProperties = [];

  try {
    for (let i = 0; i < ALL_LAEEQ_URLS.length; i++) {
      const url = ALL_LAEEQ_URLS[i];
      const propertyId = url.split('/').pop();

      console.log(`\n[${i + 1}/${ALL_LAEEQ_URLS.length}] Processing ${propertyId}...`);

      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Check if page shows "Server unavailable" or similar error
        const isErrorPage = await page.evaluate(() => {
          const bodyText = document.body.textContent.toLowerCase();
          return bodyText.includes('server unavailable') ||
                 bodyText.includes('not found') ||
                 bodyText.includes('error') ||
                 document.title.toLowerCase().includes('error');
        });

        if (isErrorPage) {
          console.log(`   ❌ Listing unavailable (server error)`);
          failedProperties.push({ id: propertyId, url, reason: 'Server unavailable' });
          continue;
        }

        // Extract property details
        const propertyDetails = await page.evaluate(() => {
          // Try multiple selectors for price
          const priceSelectors = [
            '.p24_price',
            '[class*="price"]',
            '.listing-price',
            '.property-price',
            '[data-testid*="price"]'
          ];

          let priceEl = null;
          for (const selector of priceSelectors) {
            priceEl = document.querySelector(selector);
            if (priceEl) break;
          }

          // Try multiple selectors for title
          const titleSelectors = [
            'h1',
            '.p24_title',
            '.listing-title',
            '.property-title',
            '[data-testid*="title"]'
          ];

          let titleEl = null;
          for (const selector of titleSelectors) {
            titleEl = document.querySelector(selector);
            if (titleEl) break;
          }

          // Try multiple selectors for location
          const locationSelectors = [
            '.p24_location',
            '[class*="location"]',
            '.listing-location',
            '.property-location'
          ];

          let locationEl = null;
          for (const selector of locationSelectors) {
            locationEl = document.querySelector(selector);
            if (locationEl) break;
          }

          // Extract bedroom/bathroom/area from page text
          const bodyText = document.body.textContent;
          const bedroomMatch = bodyText.match(/(\d+)\s+bedroom/i);
          const bathroomMatch = bodyText.match(/(\d+)\s+bathroom/i);
          const areaMatch = bodyText.match(/(\d+(?:\.\d+)?)\s*m²/i);

          return {
            price: priceEl ? priceEl.textContent.trim() : 'POA',
            title: titleEl ? titleEl.textContent.trim() : 'Property Listing',
            location: locationEl ? locationEl.textContent.trim() : '',
            bedrooms: bedroomMatch ? parseInt(bedroomMatch[1]) : null,
            bathrooms: bathroomMatch ? parseInt(bathroomMatch[1]) : null,
            area: areaMatch ? `${areaMatch[1]} m²` : null
          };
        });

        console.log(`   Title: ${propertyDetails.title.substring(0, 60)}...`);
        console.log(`   Price: ${propertyDetails.price}`);

        // Try to find and screenshot the main property image
        const imageStrategies = [
          // Strategy 1: Main gallery image
          '.p24_galleryContainer img:first-child',
          // Strategy 2: Hero image
          '.p24_heroImage img:first-child',
          // Strategy 3: Any gallery main image
          '[class*="gallery"] img:first-child',
          '[class*="hero"] img:first-child',
          // Strategy 4: Main content images
          'main img:first-of-type',
          '.content img:first-of-type',
          // Strategy 5: Any Property24 image
          'img[src*="prop24.com"]:first-of-type',
          // Strategy 6: Any large image
          'img[width="1440"], img[height="900"]'
        ];

        let imageElement = null;
        let usedStrategy = '';

        for (let j = 0; j < imageStrategies.length; j++) {
          try {
            imageElement = await page.$(imageStrategies[j]);
            if (imageElement) {
              // Check if element is visible and has reasonable dimensions
              const bounds = await imageElement.boundingBox();
              if (bounds && bounds.width > 200 && bounds.height > 150) {
                usedStrategy = imageStrategies[j];
                console.log(`   🎯 Found image using: ${usedStrategy}`);
                break;
              }
            }
          } catch (e) {
            // Try next strategy
          }
        }

        if (imageElement) {
          try {
            const screenshotPath = path.join(screenshotsDir, `${propertyId}.jpg`);

            await imageElement.screenshot({
              path: screenshotPath,
              quality: 95
            });

            console.log(`   ✅ Screenshot captured successfully`);

            validProperties.push({
              id: propertyId,
              url: url,
              ...propertyDetails,
              screenshotPath: `/laeeq-screenshots/${propertyId}.jpg`,
              hasScreenshot: true,
              strategy: usedStrategy
            });

          } catch (screenshotError) {
            console.log(`   ❌ Screenshot failed: ${screenshotError.message}`);

            // Add without screenshot
            validProperties.push({
              id: propertyId,
              url: url,
              ...propertyDetails,
              screenshotPath: null,
              hasScreenshot: false
            });
          }
        } else {
          console.log(`   ⚠️  No suitable image found`);

          // Add without screenshot
          validProperties.push({
            id: propertyId,
            url: url,
            ...propertyDetails,
            screenshotPath: null,
            hasScreenshot: false
          });
        }

      } catch (error) {
        console.log(`   ❌ Error processing ${propertyId}: ${error.message}`);
        failedProperties.push({ id: propertyId, url, reason: error.message });
      }

      // Delay between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Save results
    const results = {
      timestamp: new Date().toISOString(),
      agent: "La'eeq Allie",
      agency: "Greeff Christie's International Real Estate",
      totalAttempted: ALL_LAEEQ_URLS.length,
      validProperties: validProperties.length,
      failedProperties: failedProperties.length,
      screenshotsCaptured: validProperties.filter(p => p.hasScreenshot).length,
      properties: validProperties,
      failed: failedProperties
    };

    fs.writeFileSync('all-laeeq-screenshots.json', JSON.stringify(results, null, 2));

    console.log('\n✅ Screenshot capture complete!');
    console.log(`📊 Total URLs processed: ${ALL_LAEEQ_URLS.length}`);
    console.log(`✅ Valid properties: ${validProperties.length}`);
    console.log(`❌ Failed properties: ${failedProperties.length}`);
    console.log(`📸 Screenshots captured: ${validProperties.filter(p => p.hasScreenshot).length}`);
    console.log(`📁 Screenshots saved to: ${screenshotsDir}`);

    await browser.close();
    return results;

  } catch (error) {
    console.error('❌ Error:', error);
    await browser.close();
    throw error;
  }
}

// Run the capture
if (require.main === module) {
  captureAllValidLaeeqScreenshots()
    .then(results => {
      console.log(`\n🎉 Successfully processed ${results.validProperties} La'eeq properties!`);
      console.log(`📸 ${results.screenshotsCaptured} actual property screenshots captured!`);
      console.log('🚀 Ready to update mockData.ts with ALL La\'eeq listings');
    })
    .catch(console.error);
}

module.exports = { captureAllValidLaeeqScreenshots };