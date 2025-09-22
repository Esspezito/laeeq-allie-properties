const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');

// Use stealth plugin
puppeteer.use(StealthPlugin());

async function captureLaeeqProperties() {
  console.log('🎯 Capturing La\'eeq\'s Property24 listings with clean images and correct information...');

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
    // Go to La'eeq's agent page
    console.log('📋 Loading La\'eeq\'s Property24 agent page...');
    await page.goto('https://www.property24.com/for-sale/agency/greeff-christies-international-real-estate-head-office/laeeq-allie/430283', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    await new Promise(resolve => setTimeout(resolve, 5000));

    // Get ONLY the actual property listings (not navigation links)
    const propertyListings = await page.evaluate(() => {
      const listings = [];

      // Look for property cards/listings specifically
      const propertyCards = document.querySelectorAll('.js-resultsCard, .listing-result-card, [class*="property-card"], [class*="listing-card"]');

      propertyCards.forEach(card => {
        // Get the main property link
        const linkEl = card.querySelector('a[href*="/for-sale/"]:not([href*="agency"]):not([href*="search"])');
        if (!linkEl) return;

        const href = linkEl.href;

        // Skip if not a proper property URL
        if (!href.includes('/for-sale/') ||
            href.includes('/agency/') ||
            href.includes('/search/') ||
            href.includes('#') ||
            !href.match(/\/\d{8,}$/)) {
          return;
        }

        // Extract property information from the card
        const titleEl = card.querySelector('h2, h3, .js-resultsCardTitle, [class*="title"]:not([class*="agent"])');
        const priceEl = card.querySelector('.js-resultsCardPrice, [class*="price"]:not([class*="guide"])');
        const locationEl = card.querySelector('[class*="location"], [class*="suburb"]');
        const bedroomsEl = card.querySelector('[class*="bedroom"], [title*="bedroom"]');
        const bathroomsEl = card.querySelector('[class*="bathroom"], [title*="bathroom"]');
        const areaEl = card.querySelector('[class*="area"], [class*="size"]');

        const title = titleEl ? titleEl.textContent.trim() : '';
        const price = priceEl ? priceEl.textContent.trim() : 'POA';
        const location = locationEl ? locationEl.textContent.trim() : '';

        // Extract bedroom/bathroom numbers
        const bedroomMatch = card.textContent.match(/(\d+)\s*bed/i);
        const bathroomMatch = card.textContent.match(/(\d+)\s*bath/i);
        const areaMatch = card.textContent.match(/(\d+(?:\.\d+)?)\s*m²/i);

        listings.push({
          url: href,
          title: title,
          price: price,
          location: location,
          bedrooms: bedroomMatch ? parseInt(bedroomMatch[1]) : null,
          bathrooms: bathroomMatch ? parseInt(bathroomMatch[1]) : null,
          area: areaMatch ? `${areaMatch[1]} m²` : null
        });
      });

      return listings.filter(listing =>
        listing.url &&
        listing.title &&
        listing.title !== '' &&
        !listing.title.toLowerCase().includes('agent')
      );
    });

    console.log(`📊 Found ${propertyListings.length} actual property listings`);

    // Limit to reasonable number (29 as requested)
    const limitedListings = propertyListings.slice(0, 29);

    // Process each property
    for (let i = 0; i < limitedListings.length; i++) {
      const property = limitedListings[i];
      const propertyId = property.url.split('/').pop();

      console.log(`\n[${i + 1}/${limitedListings.length}] Processing ${propertyId}...`);
      console.log(`   Title: ${property.title}`);
      console.log(`   Price: ${property.price}`);
      console.log(`   Location: ${property.location}`);

      try {
        // Navigate to individual property page
        await page.goto(property.url, {
          waitUntil: 'networkidle2',
          timeout: 60000
        });

        await new Promise(resolve => setTimeout(resolve, 3000));

        // Get more detailed information from the property page
        const detailedInfo = await page.evaluate(() => {
          const priceEl = document.querySelector('.p24_price, [class*="price-display"]');
          const titleEl = document.querySelector('h1, .p24_title');
          const locationEl = document.querySelector('.p24_location, [class*="location-display"]');
          const bedroomsEl = document.querySelector('[class*="bedroom"]');
          const bathroomsEl = document.querySelector('[class*="bathroom"]');
          const areaEl = document.querySelector('[class*="area"], [class*="size"]');

          return {
            price: priceEl ? priceEl.textContent.trim() : '',
            title: titleEl ? titleEl.textContent.trim() : '',
            location: locationEl ? locationEl.textContent.trim() : '',
            fullContent: document.body.textContent
          };
        });

        // Extract additional details from page content
        const bedroomMatch = detailedInfo.fullContent.match(/(\d+)\s*bedroom/i);
        const bathroomMatch = detailedInfo.fullContent.match(/(\d+)\s*bathroom/i);
        const areaMatch = detailedInfo.fullContent.match(/(\d+(?:\.\d+)?)\s*m²/i);

        // Find and screenshot ONLY the main property image
        const imageSelectors = [
          '.p24_galleryContainer img:first-child',
          '.p24_mainImage img',
          '.js-galleryMainImage',
          '[class*="gallery-main"] img',
          '[class*="main-image"] img',
          '[class*="hero-image"] img',
          'img[src*="prop24.com"][alt*="property" i]:first-of-type',
          'img[src*="prop24.com"]:first-of-type'
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

              // Use detailed info from property page, fallback to listing card info
              const finalTitle = detailedInfo.title || property.title;
              const finalPrice = detailedInfo.price || property.price;
              const finalLocation = detailedInfo.location || property.location;

              results.push({
                id: propertyId,
                url: property.url, // ACTUAL Property24 URL for linking back
                title: finalTitle,
                price: finalPrice,
                location: finalLocation,
                bedrooms: bedroomMatch ? parseInt(bedroomMatch[1]) : property.bedrooms,
                bathrooms: bathroomMatch ? parseInt(bathroomMatch[1]) : property.bathrooms,
                area: areaMatch ? `${areaMatch[1]} m²` : property.area,
                imagePath: `/property-images/property_${propertyId}.jpg`
              });

              console.log(`   ✅ Clean image captured`);
              console.log(`   📋 Final title: ${finalTitle}`);
              console.log(`   💰 Final price: ${finalPrice}`);
              imageFound = true;
              break;
            }
          } catch (e) {
            // Try next selector
          }
        }

        if (!imageFound) {
          console.log(`   ❌ No image found for property ${propertyId}`);

          // Still add property data even without image
          results.push({
            id: propertyId,
            url: property.url,
            title: detailedInfo.title || property.title,
            price: detailedInfo.price || property.price,
            location: detailedInfo.location || property.location,
            bedrooms: bedroomMatch ? parseInt(bedroomMatch[1]) : property.bedrooms,
            bathrooms: bathroomMatch ? parseInt(bathroomMatch[1]) : property.bathrooms,
            area: areaMatch ? `${areaMatch[1]} m²` : property.area,
            imagePath: null
          });
        }

      } catch (error) {
        console.log(`   ❌ Error processing property: ${error.message}`);
      }

      // Delay between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Save results with all property information
    fs.writeFileSync('laeeq-properties-complete.json', JSON.stringify({
      timestamp: new Date().toISOString(),
      agent: "La'eeq Allie",
      totalProperties: results.length,
      properties: results
    }, null, 2));

    console.log('\n✅ La\'eeq property capture complete!');
    console.log(`📊 Total properties processed: ${results.length}`);
    console.log(`📸 Clean images captured: ${results.filter(p => p.imagePath).length}`);
    console.log(`📁 Images saved to: ${imagesDir}`);
    console.log(`🔗 All properties link back to actual Property24 listings`);

    await browser.close();
    return results;

  } catch (error) {
    console.error('❌ Error during capture:', error);
    await browser.close();
    throw error;
  }
}

// Run the capture
if (require.main === module) {
  captureLaeeqProperties()
    .then(result => {
      console.log('\n🎉 Successfully captured La\'eeq\'s complete property listings!');
      console.log('🚀 Ready to update mockData.ts with actual property data and clean images');
    })
    .catch(console.error);
}

module.exports = { captureLaeeqProperties };