const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');

puppeteer.use(StealthPlugin());

// La'eeq's actual Property24 listings from his agent page
const LAEEQ_PROPERTIES = [
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

async function captureCleanImagesOnly() {
  console.log('📸 Capturing ONLY clean property images from La\'eeq\'s 29 listings...');
  console.log('🎯 Focus: Pure property images without any borders or page elements');

  const imagesDir = path.join(__dirname, 'public', 'property-images-clean');
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

  const results = [];

  try {
    for (let i = 0; i < LAEEQ_PROPERTIES.length; i++) {
      const url = LAEEQ_PROPERTIES[i];
      const propertyId = url.split('/').pop();

      console.log(`\n[${i + 1}/${LAEEQ_PROPERTIES.length}] Processing ${propertyId}...`);

      try {
        // Navigate to property page
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Extract property details from the page
        const propertyDetails = await page.evaluate(() => {
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

        console.log(`   Price: ${propertyDetails.price}`);
        console.log(`   Title: ${propertyDetails.title.substring(0, 50)}...`);

        // Try multiple strategies to find and capture ONLY the property image
        const imageStrategies = [
          // Strategy 1: Main gallery image
          async () => {
            const img = await page.$('.p24_galleryContainer img:first-child');
            if (img) {
              console.log('   🎯 Found main gallery image');
              return img;
            }
            return null;
          },

          // Strategy 2: Hero image
          async () => {
            const img = await page.$('.p24_heroImage img, [class*="hero"] img');
            if (img) {
              console.log('   🎯 Found hero image');
              return img;
            }
            return null;
          },

          // Strategy 3: First large Property24 image
          async () => {
            const images = await page.$$('img[src*="prop24.com"]');
            for (const img of images) {
              const src = await img.evaluate(el => el.src);
              if (src.includes('Crop') || src.includes('1440') || src.includes('900')) {
                console.log('   🎯 Found large Property24 image');
                return img;
              }
            }
            return null;
          },

          // Strategy 4: Main content image
          async () => {
            const img = await page.$('main img:first-child, .content img:first-child');
            if (img) {
              console.log('   🎯 Found main content image');
              return img;
            }
            return null;
          }
        ];

        let imageElement = null;

        // Try each strategy
        for (const strategy of imageStrategies) {
          imageElement = await strategy();
          if (imageElement) break;
        }

        if (imageElement) {
          // Screenshot ONLY the image element (pure image, no borders)
          const imagePath = path.join(imagesDir, `${propertyId}.jpg`);

          await imageElement.screenshot({
            path: imagePath,
            quality: 100, // Maximum quality
            omitBackground: true // Remove any background
          });

          console.log(`   ✅ Clean image captured`);

          results.push({
            id: propertyId,
            url: url, // Direct Property24 link
            ...propertyDetails,
            imagePath: `/property-images-clean/${propertyId}.jpg`
          });

        } else {
          console.log(`   ❌ No suitable image found`);

          // Add property without image
          results.push({
            id: propertyId,
            url: url,
            ...propertyDetails,
            imagePath: null
          });
        }

      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }

      // Delay between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Save results
    fs.writeFileSync('laeeq-clean-images.json', JSON.stringify({
      timestamp: new Date().toISOString(),
      agent: "La'eeq Allie",
      agency: "Greeff Christie's International Real Estate",
      description: "Clean property images without borders or page elements",
      properties: results
    }, null, 2));

    console.log('\n✅ Clean image capture complete!');
    console.log(`📊 Properties processed: ${results.length}`);
    console.log(`📸 Clean images captured: ${results.filter(p => p.imagePath).length}`);
    console.log(`📁 Images saved to: ${imagesDir}`);
    console.log(`🔗 All properties link to actual Property24 listings`);

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
  captureCleanImagesOnly()
    .then(result => {
      console.log('\n🎉 Successfully captured clean property images!');
      console.log('🚀 Ready to update mockData.ts with pure property images');
    })
    .catch(console.error);
}

module.exports = { captureCleanImagesOnly };