const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');

// Use stealth plugin
puppeteer.use(StealthPlugin());

async function captureCleanPropertyImages() {
  console.log('🎯 Capturing clean property images from La\'eeq\'s Property24 agent page...');

  // Create directory for clean images
  const imagesDir = path.join(__dirname, 'public', 'property-images');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
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

  const results = [];

  try {
    // Go to La'eeq's agent page first
    console.log('📋 Loading La\'eeq\'s Property24 agent page...');
    await page.goto('https://www.property24.com/for-sale/agency/greeff-christies-international-real-estate-head-office/laeeq-allie/430283', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    await new Promise(resolve => setTimeout(resolve, 5000));

    // Get all property links from the agent page
    const propertyLinks = await page.evaluate(() => {
      const links = [];
      const propertyElements = document.querySelectorAll('a[href*="/for-sale/"]');

      propertyElements.forEach(link => {
        const href = link.href;
        if (href && href.includes('/for-sale/') && href.includes('property24.com')) {
          // Extract property details from the listing card
          const card = link.closest('.js-resultsCard, [class*="listing"], [class*="property"]');
          let title = 'Property';
          let price = 'POA';

          if (card) {
            const titleEl = card.querySelector('h2, h3, .js-resultsCardTitle, [class*="title"]');
            const priceEl = card.querySelector('.js-resultsCardPrice, [class*="price"]');

            if (titleEl) title = titleEl.textContent.trim();
            if (priceEl) price = priceEl.textContent.trim();
          }

          links.push({
            url: href,
            title: title,
            price: price
          });
        }
      });

      return links;
    });

    console.log(`📊 Found ${propertyLinks.length} properties on La'eeq's agent page`);

    // Process each property
    for (let i = 0; i < propertyLinks.length; i++) {
      const property = propertyLinks[i];
      const propertyId = property.url.split('/').pop();

      console.log(`\n[${i + 1}/${propertyLinks.length}] Processing ${propertyId}...`);
      console.log(`   Title: ${property.title.substring(0, 60)}...`);
      console.log(`   Price: ${property.price}`);

      try {
        // Navigate to individual property page
        await page.goto(property.url, {
          waitUntil: 'networkidle2',
          timeout: 60000
        });

        await new Promise(resolve => setTimeout(resolve, 3000));

        // Find and screenshot ONLY the main property image
        const imageSelectors = [
          '.p24_galleryContainer img:first-child',
          '.p24_mainImage img',
          '.js-galleryMainImage',
          '[class*="gallery"] img:first-child',
          '[class*="main-image"] img',
          'img[src*="prop24.com"]:first-of-type'
        ];

        let imageFound = false;

        for (const selector of imageSelectors) {
          try {
            const imageElement = await page.$(selector);
            if (imageElement) {
              // Wait for image to load
              await page.waitForSelector(selector, { timeout: 5000 });

              // Screenshot ONLY the image element
              const imagePath = path.join(imagesDir, `property_${propertyId}.jpg`);
              await imageElement.screenshot({
                path: imagePath,
                quality: 95
              });

              results.push({
                id: propertyId,
                url: property.url,
                title: property.title,
                price: property.price,
                imagePath: `/property-images/property_${propertyId}.jpg`
              });

              console.log(`   ✅ Clean image captured`);
              imageFound = true;
              break;
            }
          } catch (e) {
            // Try next selector
          }
        }

        if (!imageFound) {
          console.log(`   ❌ No image found for property ${propertyId}`);
        }

      } catch (error) {
        console.log(`   ❌ Error processing property: ${error.message}`);
      }

      // Delay between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Save results
    fs.writeFileSync('laeeq-properties-clean-images.json', JSON.stringify(results, null, 2));

    console.log('\n✅ Clean property image capture complete!');
    console.log(`📊 Total properties processed: ${propertyLinks.length}`);
    console.log(`📸 Clean images captured: ${results.length}`);
    console.log(`📁 Images saved to: ${imagesDir}`);

    await browser.close();
    return results;

  } catch (error) {
    console.error('❌ Error during image capture:', error);
    await browser.close();
    throw error;
  }
}

// Run the capture
if (require.main === module) {
  captureCleanPropertyImages()
    .then(result => {
      console.log('\n🎉 Successfully captured La\'eeq\'s clean property images!');
      console.log('🚀 Ready to update mockData.ts with clean property images');
    })
    .catch(console.error);
}

module.exports = { captureCleanPropertyImages };