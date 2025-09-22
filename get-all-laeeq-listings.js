const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');

puppeteer.use(StealthPlugin());

async function getAllLaeeqListings() {
  console.log('🎯 Getting ALL La\'eeq listings from Property24 agent page...');
  console.log('📋 Source: https://www.property24.com/for-sale/agency/greeff-christies-international-real-estate-head-office/laeeq-allie/430283');

  const imagesDir = path.join(__dirname, 'public', 'laeeq-property-images');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080'],
    defaultViewport: { width: 1920, height: 1080 }
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  try {
    // Step 1: Go to La'eeq's agent page and get ALL property URLs
    console.log('\n📋 Step 1: Loading La\'eeq\'s agent page...');
    await page.goto('https://www.property24.com/for-sale/agency/greeff-christies-international-real-estate-head-office/laeeq-allie/430283', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    // Close any popups
    try {
      await page.click('button');
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (e) {}

    // Scroll to load all listings
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Extract ALL property links
    const propertyUrls = await page.evaluate(() => {
      const links = new Set();

      // Find all links that go to individual property pages
      const allLinks = document.querySelectorAll('a[href*="/for-sale/"]');

      allLinks.forEach(link => {
        const href = link.href;
        // Must be a property URL with an ID at the end, not an agent or search URL
        if (href.includes('/for-sale/') &&
            !href.includes('/agency/') &&
            !href.includes('/search/') &&
            href.match(/\/\d{8,}$/)) {
          links.add(href);
        }
      });

      return Array.from(links);
    });

    console.log(`📊 Found ${propertyUrls.length} property URLs on agent page`);

    if (propertyUrls.length === 0) {
      console.log('❌ No property URLs found. Let me check the page structure...');

      // Debug: take screenshot and check what's on the page
      await page.screenshot({ path: 'debug-agent-page.png' });

      const pageContent = await page.evaluate(() => {
        const links = document.querySelectorAll('a');
        return Array.from(links).slice(0, 20).map(link => link.href).filter(href => href.includes('property24.com'));
      });

      console.log('Sample links found:', pageContent);
      await browser.close();
      return;
    }

    // Step 2: Visit each property and capture FIRST IMAGE
    console.log('\n📸 Step 2: Capturing first image from each property...');
    const results = [];

    for (let i = 0; i < propertyUrls.length; i++) {
      const url = propertyUrls[i];
      const propertyId = url.split('/').pop();

      console.log(`\n[${i + 1}/${propertyUrls.length}] Processing ${propertyId}...`);

      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Extract property details
        const propertyInfo = await page.evaluate(() => {
          const priceEl = document.querySelector('.p24_price, [class*="price"]');
          const titleEl = document.querySelector('h1, .p24_title');
          const locationEl = document.querySelector('.p24_location, [class*="location"]');

          // Extract from page content
          const bodyText = document.body.textContent;
          const bedroomMatch = bodyText.match(/(\d+)\s+bedroom/i);
          const bathroomMatch = bodyText.match(/(\d+)\s+bathroom/i);
          const areaMatch = bodyText.match(/(\d+(?:\.\d+)?)\s*m²/i);

          return {
            price: priceEl ? priceEl.textContent.trim() : 'POA',
            title: titleEl ? titleEl.textContent.trim() : '',
            location: locationEl ? locationEl.textContent.trim() : '',
            bedrooms: bedroomMatch ? parseInt(bedroomMatch[1]) : null,
            bathrooms: bathroomMatch ? parseInt(bathroomMatch[1]) : null,
            area: areaMatch ? `${areaMatch[1]} m²` : null
          };
        });

        console.log(`   Title: ${propertyInfo.title}`);
        console.log(`   Price: ${propertyInfo.price}`);

        // Find and screenshot the FIRST/MAIN property image only
        const imageSelectors = [
          '.p24_galleryContainer img:first-child',
          '.p24_heroImage img:first-child',
          '.js-galleryMainImage',
          '[class*="gallery-main"] img:first-child',
          '[class*="hero-image"] img:first-child',
          'img[src*="prop24.com"][alt]:first-of-type'
        ];

        let imageCaptured = false;

        for (const selector of imageSelectors) {
          try {
            const imageElement = await page.$(selector);
            if (imageElement) {
              const imagePath = path.join(imagesDir, `${propertyId}.jpg`);

              await imageElement.screenshot({
                path: imagePath,
                quality: 95
              });

              console.log(`   ✅ First image captured`);
              imageCaptured = true;

              results.push({
                id: propertyId,
                url: url,
                ...propertyInfo,
                imagePath: `/laeeq-property-images/${propertyId}.jpg`,
                hasImage: true
              });

              break;
            }
          } catch (e) {
            // Try next selector
          }
        }

        if (!imageCaptured) {
          console.log(`   ⚠️  No image captured, adding property data only`);
          results.push({
            id: propertyId,
            url: url,
            ...propertyInfo,
            imagePath: null,
            hasImage: false
          });
        }

      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);

        // Still add the property to maintain count
        results.push({
          id: propertyId,
          url: url,
          title: 'Property listing',
          price: 'POA',
          location: '',
          bedrooms: null,
          bathrooms: null,
          area: null,
          imagePath: null,
          hasImage: false
        });
      }

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Save results
    fs.writeFileSync('all-laeeq-listings.json', JSON.stringify({
      timestamp: new Date().toISOString(),
      agent: "La'eeq Allie",
      totalProperties: results.length,
      propertiesWithImages: results.filter(p => p.hasImage).length,
      sourceUrl: 'https://www.property24.com/for-sale/agency/greeff-christies-international-real-estate-head-office/laeeq-allie/430283',
      properties: results
    }, null, 2));

    console.log('\n✅ Complete La\'eeq listing extraction finished!');
    console.log(`📊 Total properties found: ${results.length}`);
    console.log(`📸 Properties with captured images: ${results.filter(p => p.hasImage).length}`);
    console.log(`💰 Properties with prices: ${results.filter(p => p.price !== 'POA').length}`);
    console.log(`📁 Images saved to: ${imagesDir}`);

    await browser.close();
    return results;

  } catch (error) {
    console.error('❌ Error:', error);
    await browser.close();
    throw error;
  }
}

// Run the extraction
if (require.main === module) {
  getAllLaeeqListings()
    .then(results => {
      console.log('\n🎉 All La\'eeq Property24 listings extracted successfully!');
      console.log(`📋 Ready to update mockData.ts with ${results.length} actual listings`);
    })
    .catch(console.error);
}

module.exports = { getAllLaeeqListings };