const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');

// Use stealth plugin
puppeteer.use(StealthPlugin());

// All 31 Property24 URLs from La'eeq Allie's listings
const PROPERTY_URLS = [
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
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115311090",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/114942423",
  "https://www.property24.com/for-sale/woodstock/cape-town/western-cape/10164/114046864"
];

async function screenshotProperty24Images() {
  console.log('📸 Starting Property24 image screenshot capture...');
  console.log('🎯 This will capture ACTUAL images from La\'eeq\'s listings');

  // Create directory for screenshots
  const screenshotsDir = path.join(__dirname, 'public', 'property24-screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--window-size=1920,1080'
    ],
    defaultViewport: { width: 1920, height: 1080 }
  });

  const page = await browser.newPage();

  // Enhanced stealth configuration
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
  });

  const results = [];

  try {
    for (let i = 0; i < PROPERTY_URLS.length; i++) {
      const url = PROPERTY_URLS[i];
      const propertyId = url.split('/').pop();

      console.log(`\n[${i + 1}/${PROPERTY_URLS.length}] Processing property ${propertyId}...`);

      const propertyImages = [];

      try {
        await page.goto(url, {
          waitUntil: 'networkidle2',
          timeout: 60000
        });

        // Wait for images to load
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Try to click on the main image to open gallery
        try {
          await page.click('.p24_galleryContainer img, .p24_mainImage, [class*="gallery"] img', { timeout: 5000 });
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (e) {
          console.log('   ⚠️  No gallery to open, capturing main view');
        }

        // Capture main listing image
        const mainImagePath = `/property24-screenshots/property_${propertyId}_main.jpg`;
        const mainImageFullPath = path.join(screenshotsDir, `property_${propertyId}_main.jpg`);

        // Screenshot the main image area
        try {
          const mainImageElement = await page.$('.p24_galleryContainer, .p24_mainImage, [class*="gallery"], [class*="image-container"]');
          if (mainImageElement) {
            await mainImageElement.screenshot({ path: mainImageFullPath, quality: 90 });
            propertyImages.push(mainImagePath);
            console.log(`   ✅ Captured main image`);
          } else {
            // Take full page screenshot as fallback
            await page.screenshot({ path: mainImageFullPath, quality: 90, fullPage: false });
            propertyImages.push(mainImagePath);
            console.log(`   ✅ Captured page screenshot`);
          }
        } catch (e) {
          console.log(`   ❌ Failed to capture main image: ${e.message}`);
        }

        // Try to navigate through gallery images
        const nextButtonSelectors = [
          'button[aria-label="Next image"]',
          '.p24_arrowButton--next',
          '[class*="next"]',
          '[class*="arrow-right"]',
          '.slick-next'
        ];

        let galleryIndex = 0;
        let maxGalleryImages = 10; // Capture up to 10 images per property

        for (let j = 0; j < maxGalleryImages; j++) {
          try {
            // Try to click next button
            let clicked = false;
            for (const selector of nextButtonSelectors) {
              try {
                await page.click(selector, { timeout: 1000 });
                clicked = true;
                break;
              } catch (e) {
                // Try next selector
              }
            }

            if (!clicked) break;

            await new Promise(resolve => setTimeout(resolve, 1500));

            // Capture gallery image
            galleryIndex++;
            const galleryImagePath = `/property24-screenshots/property_${propertyId}_gallery_${galleryIndex}.jpg`;
            const galleryImageFullPath = path.join(screenshotsDir, `property_${propertyId}_gallery_${galleryIndex}.jpg`);

            const galleryElement = await page.$('.p24_galleryContainer, .p24_mainImage, [class*="gallery"], [class*="modal"] img');
            if (galleryElement) {
              await galleryElement.screenshot({ path: galleryImageFullPath, quality: 90 });
              propertyImages.push(galleryImagePath);
              console.log(`   ✅ Captured gallery image ${galleryIndex}`);
            }
          } catch (e) {
            // No more images in gallery
            break;
          }
        }

        // Also try to capture thumbnail images
        try {
          const thumbnails = await page.$$('.p24_thumbnail img, [class*="thumb"] img');
          for (let t = 0; t < Math.min(thumbnails.length, 5); t++) {
            const thumbPath = `/property24-screenshots/property_${propertyId}_thumb_${t}.jpg`;
            const thumbFullPath = path.join(screenshotsDir, `property_${propertyId}_thumb_${t}.jpg`);

            await thumbnails[t].screenshot({ path: thumbFullPath, quality: 85 });
            propertyImages.push(thumbPath);
            console.log(`   ✅ Captured thumbnail ${t + 1}`);
          }
        } catch (e) {
          console.log('   ℹ️  No thumbnails to capture');
        }

        // Extract property details
        const propertyData = await page.evaluate(() => {
          const priceEl = document.querySelector('.p24_price, [class*="price"]');
          const titleEl = document.querySelector('h1, .p24_title');
          const locationEl = document.querySelector('.p24_location, [class*="location"]');

          return {
            price: priceEl ? priceEl.textContent.trim() : 'POA',
            title: titleEl ? titleEl.textContent.trim() : '',
            location: locationEl ? locationEl.textContent.trim() : ''
          };
        });

        const location = url.includes('gardens') ? 'Gardens' :
                        url.includes('woodstock') ? 'Woodstock' :
                        'Cape Town City Centre';

        results.push({
          id: propertyId,
          url: url,
          images: propertyImages,
          ...propertyData,
          location: location
        });

        console.log(`   📊 Property ${propertyId}: ${propertyImages.length} screenshots captured`);

      } catch (error) {
        console.log(`   ❌ Error processing property: ${error.message}`);
        results.push({
          id: propertyId,
          url: url,
          images: [],
          price: 'POA',
          title: 'Property in Cape Town',
          location: 'Cape Town'
        });
      }

      // Delay between properties
      if (i < PROPERTY_URLS.length - 1) {
        const delay = 2000 + Math.random() * 2000;
        console.log(`   ⏱️  Waiting ${Math.round(delay/1000)}s...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // Save results
    const outputData = {
      timestamp: new Date().toISOString(),
      agent: "La'eeq Allie",
      totalProperties: results.length,
      totalScreenshots: results.reduce((sum, p) => sum + p.images.length, 0),
      properties: results
    };

    fs.writeFileSync('property24-screenshots.json', JSON.stringify(outputData, null, 2));

    console.log('\n✅ Screenshot capture complete!');
    console.log(`📊 Total properties: ${results.length}`);
    console.log(`📸 Total screenshots: ${outputData.totalScreenshots}`);
    console.log(`📁 Screenshots saved to: ${screenshotsDir}`);
    console.log('📄 Data saved to: property24-screenshots.json');

    await browser.close();
    return outputData;

  } catch (error) {
    console.error('❌ Error during screenshot capture:', error);
    await browser.close();
    throw error;
  }
}

// Run the screenshot capture
if (require.main === module) {
  screenshotProperty24Images()
    .then(result => {
      console.log('\n🎉 Successfully captured La\'eeq\'s ACTUAL Property24 listing images!');
      console.log('🚀 Ready to update mockData.ts with real screenshot paths');
    })
    .catch(console.error);
}

module.exports = { screenshotProperty24Images };