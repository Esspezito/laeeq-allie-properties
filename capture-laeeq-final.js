const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');

puppeteer.use(StealthPlugin());

async function captureLaeeqFinal() {
  console.log('🎯 Capturing La\'eeq\'s Property24 listings with correct selectors...');

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

  const results = [];

  try {
    // Navigate to La'eeq's agent page
    console.log('📋 Loading La\'eeq\'s Property24 agent page...');
    await page.goto('https://www.property24.com/for-sale/agency/greeff-christies-international-real-estate-head-office/laeeq-allie/430283', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    // Close cookie notice if present
    try {
      await page.click('button:contains("Close")');
    } catch (e) {
      try {
        await page.click('button');
      } catch (e) {}
    }

    await new Promise(resolve => setTimeout(resolve, 3000));

    // Scroll to load all properties
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Extract property listings using the correct Property24 structure
    const propertyListings = await page.evaluate(() => {
      const listings = [];

      // Look for the actual property listing containers
      const propertyContainers = document.querySelectorAll('.tile_container, [class*="listing-result"], .p24_regularTile');

      console.log(`Found ${propertyContainers.length} property containers`);

      propertyContainers.forEach((container, index) => {
        try {
          // Get the main link to the property
          const linkEl = container.querySelector('a[href*="/for-sale/"]:not([href*="agency"])');
          if (!linkEl) return;

          const href = linkEl.href;

          // Skip invalid URLs
          if (!href.includes('/for-sale/') || href.includes('/agency/') || !href.match(/\/\d{8,}$/)) {
            return;
          }

          // Extract price (blue text)
          const priceEl = container.querySelector('.p24_price, [class*="price"]');
          const price = priceEl ? priceEl.textContent.trim() : 'POA';

          // Extract property type and bedroom info
          const typeEl = container.querySelector('.p24_propertyType, [class*="property-type"]');
          const typeText = typeEl ? typeEl.textContent.trim() : '';

          // Extract location
          const locationEl = container.querySelector('.p24_location, [class*="location"]');
          const location = locationEl ? locationEl.textContent.trim() : '';

          // Extract bedroom and bathroom info from the icons
          const bedroomEl = container.querySelector('[title*="bedroom"], .p24_featureBed');
          const bathroomEl = container.querySelector('[title*="bathroom"], .p24_featureBath');
          const areaEl = container.querySelector('[title*="m²"], .p24_featureSize');

          const bedroomText = bedroomEl ? bedroomEl.textContent.trim() : '';
          const bathroomText = bathroomEl ? bathroomEl.textContent.trim() : '';
          const areaText = areaEl ? areaEl.textContent.trim() : '';

          // Parse numbers
          const bedrooms = bedroomText.match(/\d+/) ? parseInt(bedroomText.match(/\d+/)[0]) : null;
          const bathrooms = bathroomText.match(/\d+/) ? parseInt(bathroomText.match(/\d+/)[0]) : null;
          const area = areaText.includes('m²') ? areaText : null;

          listings.push({
            url: href,
            title: typeText,
            price: price,
            location: location,
            bedrooms: bedrooms,
            bathrooms: bathrooms,
            area: area
          });

          console.log(`Property ${index + 1}: ${price} - ${typeText} in ${location}`);

        } catch (error) {
          console.log(`Error processing container ${index}: ${error.message}`);
        }
      });

      return listings.filter(listing =>
        listing.url &&
        listing.price &&
        listing.price !== 'POA' &&
        listing.title
      );
    });

    console.log(`📊 Found ${propertyListings.length} valid property listings`);

    // Limit to 29 properties as requested
    const limitedListings = propertyListings.slice(0, 29);

    // Process each property to get clean images
    for (let i = 0; i < limitedListings.length; i++) {
      const property = limitedListings[i];
      const propertyId = property.url.split('/').pop();

      console.log(`\n[${i + 1}/${limitedListings.length}] Processing ${propertyId}...`);
      console.log(`   Price: ${property.price}`);
      console.log(`   Title: ${property.title}`);
      console.log(`   Location: ${property.location}`);

      try {
        // Navigate to individual property page
        await page.goto(property.url, {
          waitUntil: 'networkidle2',
          timeout: 60000
        });

        await new Promise(resolve => setTimeout(resolve, 2000));

        // Find the main property image and capture it cleanly
        const imageSelectors = [
          '.p24_galleryContainer img:first-child',
          '.p24_heroImage img',
          '.js-galleryMainImage',
          '[class*="hero-image"] img',
          '[class*="main-image"] img',
          '.tile_image img'
        ];

        let imageFound = false;

        for (const selector of imageSelectors) {
          try {
            const imageElement = await page.$(selector);
            if (imageElement) {
              // Screenshot ONLY the image element (clean, no borders)
              const imagePath = path.join(imagesDir, `property_${propertyId}.jpg`);

              await imageElement.screenshot({
                path: imagePath,
                quality: 95
              });

              results.push({
                id: propertyId,
                url: property.url, // Direct link back to Property24
                title: property.title,
                price: property.price,
                location: property.location,
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,
                area: property.area,
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
          console.log(`   ⚠️  No image found, adding property data without image`);
          results.push({
            id: propertyId,
            url: property.url,
            title: property.title,
            price: property.price,
            location: property.location,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            area: property.area,
            imagePath: null
          });
        }

      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }

      // Delay between requests
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Save results
    fs.writeFileSync('laeeq-properties-final.json', JSON.stringify({
      timestamp: new Date().toISOString(),
      agent: "La'eeq Allie",
      agency: "Greeff Christie's International Real Estate",
      totalProperties: results.length,
      properties: results
    }, null, 2));

    console.log('\n✅ La\'eeq property capture complete!');
    console.log(`📊 Properties captured: ${results.length}`);
    console.log(`📸 Clean images: ${results.filter(p => p.imagePath).length}`);
    console.log(`🔗 All properties link back to actual Property24 listings`);

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
  captureLaeeqFinal()
    .then(result => {
      console.log('\n🎉 Successfully captured La\'eeq\'s properties with clean images!');
      console.log('🚀 Ready to update mockData.ts with real data and clean images');
    })
    .catch(console.error);
}

module.exports = { captureLaeeqFinal };