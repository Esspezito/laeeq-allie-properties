const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');

puppeteer.use(StealthPlugin());

async function capturePropertyImagesProperlyProperly() {
  console.log('🎯 Properly capturing first property image from each La\'eeq listing...');
  console.log('📋 This will capture ONLY the actual property photos, not page elements');

  const imagesDir = path.join(__dirname, 'public', 'property-images');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1920,1080'
    ],
    defaultViewport: { width: 1920, height: 1080 }
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  // All La'eeq property URLs from both pages
  const propertyUrls = [
    // Page 1 properties
    "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116455279",
    "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116455489",
    "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116455093",
    "https://www.property24.com/for-sale/gardens/cape-town/western-cape/9145/116439140",
    "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116441627",
    "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116441202",
    "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116441599",
    "https://www.property24.com/for-sale/gardens/cape-town/western-cape/9145/116338371",
    "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116280718",
    "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116281167",
    "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116383759",
    "https://www.property24.com/for-sale/woodstock/cape-town/western-cape/10164/116282958",
    "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116281209",
    "https://www.property24.com/for-sale/gardens/cape-town/western-cape/9145/116296190",
    "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116280871",
    "https://www.property24.com/for-sale/gardens/cape-town/western-cape/9145/116226593",
    "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116220646",
    "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116283204",
    "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116200162",
    "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116216202",
    "https://www.property24.com/for-sale/woodstock/cape-town/western-cape/10164/116155994",
    // Page 2 properties (from previous scraping)
    "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115943244",
    "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115843150",
    "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115629416",
    "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115437832",
    "https://www.property24.com/for-sale/gardens/cape-town/western-cape/9145/115285887",
    "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115488888",
    "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116151599",
    "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115311090"
  ];

  const allProperties = [];

  try {
    for (let i = 0; i < propertyUrls.length; i++) {
      const url = propertyUrls[i];
      const propertyId = url.split('/').pop();

      console.log(`\n[${i + 1}/${propertyUrls.length}] Processing property ${propertyId}...`);

      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        await new Promise(resolve => setTimeout(resolve, 4000));

        // Check if page loaded properly
        const pageStatus = await page.evaluate(() => {
          const bodyText = document.body.textContent.toLowerCase();
          return {
            isError: bodyText.includes('server unavailable') ||
                    bodyText.includes('listing not found') ||
                    bodyText.includes('error'),
            hasGallery: document.querySelector('.p24_gallery, [class*="gallery"], img[src*="prop24.com"]') !== null
          };
        });

        if (pageStatus.isError) {
          console.log(`   ⚠️  Property unavailable/expired`);

          // Use placeholder for unavailable properties
          allProperties.push({
            id: propertyId,
            url: url,
            status: 'unavailable',
            imagePath: null
          });
          continue;
        }

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

        // Wait for images to load
        await page.waitForSelector('img[src*="prop24.com"], .p24_gallery img, [class*="gallery"] img', { timeout: 10000 }).catch(() => {});

        // Get the first property image URL directly
        const imageUrl = await page.evaluate(() => {
          // Try different selectors for the main image
          const selectors = [
            '.p24_galleryContainer img:first-child',
            '.p24_heroImage img',
            '.js-galleryMainImage',
            '[class*="gallery-main"] img',
            '[class*="hero"] img',
            '.p24_gallery img:first-child',
            'img[src*="prop24.com"]:first-of-type'
          ];

          for (const selector of selectors) {
            const img = document.querySelector(selector);
            if (img && img.src && img.src.includes('prop24.com')) {
              return img.src;
            }
          }

          // Fallback: get first Property24 image
          const allImages = document.querySelectorAll('img[src*="prop24.com"]');
          if (allImages.length > 0) {
            return allImages[0].src;
          }

          return null;
        });

        if (imageUrl) {
          console.log(`   Found image URL: ${imageUrl.substring(0, 50)}...`);

          // Navigate directly to the image URL
          await page.goto(imageUrl, { waitUntil: 'networkidle2' });
          await new Promise(resolve => setTimeout(resolve, 2000));

          // Take a screenshot of the full page (which should just be the image)
          const imagePath = path.join(imagesDir, `${propertyId}.jpg`);
          await page.screenshot({
            path: imagePath,
            quality: 95,
            fullPage: false
          });

          console.log(`   ✅ Property image captured`);

          allProperties.push({
            id: propertyId,
            url: url,
            ...propertyDetails,
            status: 'available',
            imagePath: `/property-images/${propertyId}.jpg`
          });
        } else {
          console.log(`   ❌ No property image found`);

          allProperties.push({
            id: propertyId,
            url: url,
            ...propertyDetails,
            status: 'no-image',
            imagePath: null
          });
        }

      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);

        allProperties.push({
          id: propertyId,
          url: url,
          status: 'error',
          imagePath: null
        });
      }

      // Delay between requests
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // Save results
    const results = {
      timestamp: new Date().toISOString(),
      agent: "La'eeq Allie",
      agency: "Greeff Christie's International Real Estate",
      totalProperties: allProperties.length,
      propertiesWithImages: allProperties.filter(p => p.imagePath).length,
      properties: allProperties
    };

    fs.writeFileSync('laeeq-29-properties-final.json', JSON.stringify(results, null, 2));

    console.log('\n✅ Property image capture complete!');
    console.log(`📊 Total properties: ${allProperties.length}`);
    console.log(`📸 Properties with images: ${allProperties.filter(p => p.imagePath).length}`);
    console.log(`⚠️  Unavailable properties: ${allProperties.filter(p => p.status === 'unavailable').length}`);
    console.log(`📁 Images saved to: ${imagesDir}`);

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
  capturePropertyImagesProperlyProperly()
    .then(results => {
      console.log(`\n🎉 Successfully processed ${results.totalProperties} La'eeq properties!`);
      console.log(`📸 ${results.propertiesWithImages} property images captured!`);
      console.log('🚀 Ready to update allierealty.com with actual property images');
    })
    .catch(console.error);
}

module.exports = { capturePropertyImagesProperlyProperly };