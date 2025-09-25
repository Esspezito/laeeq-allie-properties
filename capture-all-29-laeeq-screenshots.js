const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');

puppeteer.use(StealthPlugin());

async function captureAll29LaeeqScreenshots() {
  console.log('🎯 Capturing screenshots from ALL 29 La\'eeq listings on Property24...');
  console.log('📋 Page 1: https://www.property24.com/for-sale/agency/greeff-christies-international-real-estate-head-office/laeeq-allie/430283');
  console.log('📋 Page 2: https://www.property24.com/for-sale/agency/greeff-christies-international-real-estate-head-office/laeeq-allie/430283/p2');

  const screenshotsDir = path.join(__dirname, 'public', 'laeeq-property-screenshots');
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

  const allProperties = [];

  try {
    // Process both pages
    const agentPageUrls = [
      'https://www.property24.com/for-sale/agency/greeff-christies-international-real-estate-head-office/laeeq-allie/430283',
      'https://www.property24.com/for-sale/agency/greeff-christies-international-real-estate-head-office/laeeq-allie/430283/p2'
    ];

    for (let pageNum = 0; pageNum < agentPageUrls.length; pageNum++) {
      const agentPageUrl = agentPageUrls[pageNum];
      console.log(`\n📄 Processing Page ${pageNum + 1}...`);

      await page.goto(agentPageUrl, { waitUntil: 'networkidle2', timeout: 60000 });
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Close any popups
      try {
        const closeButton = await page.$('[aria-label="Close"]');
        if (closeButton) {
          await closeButton.click();
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (e) {}

      // Scroll to load all listings
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Extract property URLs from this page
      const propertyUrls = await page.evaluate(() => {
        const links = new Set();

        // Find all property links on the page
        const propertyCards = document.querySelectorAll('.p24_propertyTile, .js-propertyTile, [data-testid="property-card"]');

        propertyCards.forEach(card => {
          const link = card.querySelector('a[href*="/for-sale/"]');
          if (link && link.href.includes('/for-sale/') && !link.href.includes('/agency/')) {
            links.add(link.href);
          }
        });

        // Also check for any other property links
        const allLinks = document.querySelectorAll('a[href*="/for-sale/"]');
        allLinks.forEach(link => {
          const href = link.href;
          if (href.includes('/for-sale/') &&
              !href.includes('/agency/') &&
              !href.includes('/search/') &&
              href.match(/\/\d{8,}$/)) {
            links.add(href);
          }
        });

        return Array.from(links);
      });

      console.log(`   Found ${propertyUrls.length} properties on page ${pageNum + 1}`);

      // Visit each property and capture first image
      for (let i = 0; i < propertyUrls.length; i++) {
        const url = propertyUrls[i];
        const propertyId = url.split('/').pop();
        const overallIndex = allProperties.length + i + 1;

        console.log(`\n[${overallIndex}/29] Processing property ${propertyId}...`);

        try {
          await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
          await new Promise(resolve => setTimeout(resolve, 3000));

          // Extract property details
          const propertyDetails = await page.evaluate(() => {
            const priceEl = document.querySelector('.p24_price, [class*="price"]');
            const titleEl = document.querySelector('h1, .p24_title');
            const locationEl = document.querySelector('.p24_location, [class*="location"]');

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

          console.log(`   Title: ${propertyDetails.title.substring(0, 50)}...`);
          console.log(`   Price: ${propertyDetails.price}`);
          console.log(`   Location: ${propertyDetails.location}`);

          // Find and screenshot the FIRST property image
          let screenshotCaptured = false;
          const screenshotPath = path.join(screenshotsDir, `${propertyId}.jpg`);

          // Strategy 1: Try to find and click on the main image to get full view
          try {
            const mainImage = await page.$('.p24_galleryContainer img:first-child, .p24_heroImage img:first-child, [class*="gallery"] img:first-child');
            if (mainImage) {
              await mainImage.click();
              await new Promise(resolve => setTimeout(resolve, 2000));

              // Now screenshot the enlarged image
              const enlargedImage = await page.$('.p24_lightbox img, .modal img, [class*="lightbox"] img, [class*="modal"] img');
              if (enlargedImage) {
                await enlargedImage.screenshot({
                  path: screenshotPath,
                  quality: 95
                });
                console.log(`   ✅ Screenshot captured (enlarged view)`);
                screenshotCaptured = true;
              }

              // Close the lightbox
              const closeButton = await page.$('.p24_lightbox_close, .modal-close, [aria-label="Close"]');
              if (closeButton) {
                await closeButton.click();
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
            }
          } catch (e) {}

          // Strategy 2: If no enlarged view, screenshot the main image directly
          if (!screenshotCaptured) {
            const imageSelectors = [
              '.p24_galleryContainer img:first-child',
              '.p24_heroImage img:first-child',
              '[class*="gallery"] img:first-child',
              '[class*="hero"] img:first-child',
              'main img:first-of-type',
              '.content img:first-of-type',
              'img[src*="prop24.com"]:first-of-type'
            ];

            for (const selector of imageSelectors) {
              try {
                const imageElement = await page.$(selector);
                if (imageElement) {
                  // Check if element is visible and has reasonable dimensions
                  const bounds = await imageElement.boundingBox();
                  if (bounds && bounds.width > 200 && bounds.height > 150) {
                    await imageElement.screenshot({
                      path: screenshotPath,
                      quality: 95
                    });
                    console.log(`   ✅ Screenshot captured (direct)`);
                    screenshotCaptured = true;
                    break;
                  }
                }
              } catch (e) {
                // Try next selector
              }
            }
          }

          // Strategy 3: If still no screenshot, take a viewport screenshot of the image area
          if (!screenshotCaptured) {
            try {
              // Scroll to image area
              await page.evaluate(() => {
                const gallery = document.querySelector('.p24_gallery, [class*="gallery"], .property-images');
                if (gallery) {
                  gallery.scrollIntoView();
                }
              });
              await new Promise(resolve => setTimeout(resolve, 1000));

              // Take viewport screenshot
              const viewportPath = path.join(screenshotsDir, `${propertyId}_viewport.jpg`);
              await page.screenshot({
                path: viewportPath,
                quality: 95,
                clip: { x: 50, y: 200, width: 800, height: 600 }
              });
              console.log(`   ⚠️  Viewport screenshot captured`);
              screenshotCaptured = true;
            } catch (e) {
              console.log(`   ❌ Could not capture screenshot`);
            }
          }

          allProperties.push({
            id: propertyId,
            url: url,
            ...propertyDetails,
            screenshotPath: screenshotCaptured ? `/laeeq-property-screenshots/${propertyId}.jpg` : null,
            hasScreenshot: screenshotCaptured
          });

        } catch (error) {
          console.log(`   ❌ Error processing property: ${error.message}`);
        }

        // Human-like delay between requests
        await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
      }
    }

    // Save results
    const results = {
      timestamp: new Date().toISOString(),
      agent: "La'eeq Allie",
      agency: "Greeff Christie's International Real Estate",
      sourceUrl: "https://www.property24.com/for-sale/agency/greeff-christies-international-real-estate-head-office/laeeq-allie/430283",
      totalProperties: allProperties.length,
      screenshotsCaptured: allProperties.filter(p => p.hasScreenshot).length,
      properties: allProperties
    };

    fs.writeFileSync('all-29-laeeq-properties.json', JSON.stringify(results, null, 2));

    console.log('\n✅ Screenshot capture complete!');
    console.log(`📊 Total properties processed: ${allProperties.length}`);
    console.log(`📸 Screenshots captured: ${allProperties.filter(p => p.hasScreenshot).length}`);
    console.log(`📁 Screenshots saved to: ${screenshotsDir}`);
    console.log('🔗 All properties from La\'eeq\'s Property24 agent page captured!');

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
  captureAll29LaeeqScreenshots()
    .then(results => {
      console.log(`\n🎉 Successfully captured ${results.totalProperties} La'eeq properties!`);
      console.log('🚀 Ready to update allierealty.com with actual screenshots');
    })
    .catch(console.error);
}

module.exports = { captureAll29LaeeqScreenshots };