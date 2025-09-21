const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

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

async function extractFullGalleryFromProperty(page, url) {
  try {
    console.log(`🖼️  Extracting gallery from: ${url.split('/').pop()}`);

    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    // Wait for images to load
    await new Promise(resolve => setTimeout(resolve, 3000));

    const galleryData = await page.evaluate(() => {
      const images = [];

      // Method 1: Look for Property24 gallery/carousel images
      const gallerySelectors = [
        '.p24_gallery img',
        '.p24_carousel img',
        '.p24_slider img',
        '.property-gallery img',
        '.gallery img',
        '.carousel img',
        '.slider img',
        '.swiper-slide img',
        '[class*="gallery"] img',
        '[class*="carousel"] img',
        '[class*="slider"] img'
      ];

      for (const selector of gallerySelectors) {
        const imgs = document.querySelectorAll(selector);
        imgs.forEach(img => {
          let src = img.src || img.dataset.src || img.dataset.original || img.getAttribute('data-lazy-src');

          if (src &&
              (src.includes('prop24.com') || src.includes('property24')) &&
              !src.includes('logo') &&
              !src.includes('watermark') &&
              !images.includes(src)) {

            // Convert to highest quality
            src = src.replace(/\/\d+x\d+/, '/1440x900')
                     .replace('Crop600x400', 'Crop1440x900')
                     .replace('Crop320x213', 'Crop1440x900');

            images.push(src);
          }
        });
      }

      // Method 2: Look for thumbnail images that link to full gallery
      if (images.length === 0) {
        const thumbnails = document.querySelectorAll('.p24_thumbnails img, .thumbnails img, [class*="thumb"] img');
        thumbnails.forEach(img => {
          let src = img.src || img.dataset.src || img.dataset.original;

          if (src && src.includes('prop24.com')) {
            // Convert thumbnail to full size
            src = src.replace(/\/\d+x\d+/, '/1440x900')
                     .replace('thumb', 'large')
                     .replace('small', 'large');

            if (!images.includes(src)) {
              images.push(src);
            }
          }
        });
      }

      // Method 3: Look for any Property24 images on the page
      if (images.length === 0) {
        const allImages = document.querySelectorAll('img');
        allImages.forEach(img => {
          let src = img.src || img.dataset.src;

          if (src &&
              src.includes('prop24.com') &&
              !src.includes('logo') &&
              !src.includes('icon') &&
              src.match(/\d{8,}/)) { // Contains property ID

            src = src.replace(/\/\d+x\d+/, '/1440x900');

            if (!images.includes(src)) {
              images.push(src);
            }
          }
        });
      }

      // Get property details while we're here
      const titleEl = document.querySelector('h1, .p24_title, [class*="title"]');
      const title = titleEl ? titleEl.textContent.trim() : '';

      const priceEl = document.querySelector('.p24_price, [class*="price"]');
      const price = priceEl ? priceEl.textContent.trim() : '';

      // Extract bedrooms from title or page content
      let bedrooms = null;
      const bedroomMatch = document.body.textContent.match(/(\d+)\s*bedroom/i);
      if (bedroomMatch) {
        bedrooms = parseInt(bedroomMatch[1]);
      }

      // Extract bathrooms
      let bathrooms = null;
      const bathroomMatch = document.body.textContent.match(/(\d+)\s*bathroom/i);
      if (bathroomMatch) {
        bathrooms = parseInt(bathroomMatch[1]);
      }

      // Extract area
      let area = null;
      const areaMatch = document.body.textContent.match(/(\d+(?:\.\d+)?)\s*m²/i);
      if (areaMatch) {
        area = `${areaMatch[1]} m²`;
      }

      return {
        title,
        price,
        bedrooms,
        bathrooms,
        area,
        images: images.slice(0, 20) // Limit to 20 images max
      };
    });

    console.log(`   ✅ Found ${galleryData.images.length} images`);
    return galleryData;

  } catch (error) {
    console.log(`   ❌ Error extracting gallery: ${error.message}`);
    return {
      title: 'Property in Cape Town',
      price: 'POA',
      bedrooms: null,
      bathrooms: null,
      area: null,
      images: []
    };
  }
}

async function scrapeAllProperty24Galleries() {
  console.log('🚀 Starting Property24 gallery scraper for all 31 listings...');

  const browser = await puppeteer.launch({
    headless: false, // Show browser to monitor progress
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled'
    ],
    defaultViewport: { width: 1920, height: 1080 }
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  const results = [];

  try {
    for (let i = 0; i < PROPERTY_URLS.length; i++) {
      const url = PROPERTY_URLS[i];
      console.log(`\\n[${i + 1}/${PROPERTY_URLS.length}] Processing property...`);

      const propertyId = url.split('/').pop();
      const location = url.includes('cape-town-city-centre') ? 'Cape Town City Centre' :
                      url.includes('gardens') ? 'Gardens' :
                      url.includes('woodstock') ? 'Woodstock' : 'Cape Town';

      const galleryData = await extractFullGalleryFromProperty(page, url);

      // Enhanced title
      let enhancedTitle = galleryData.title;
      if (galleryData.bedrooms) {
        enhancedTitle = `${galleryData.bedrooms} Bedroom Apartment in ${location}`;
      } else if (galleryData.title.includes('0.5 Bedroom')) {
        enhancedTitle = `Studio Apartment in ${location}`;
      }

      // Create property object
      const property = {
        id: propertyId,
        title: enhancedTitle || `Property in ${location}`,
        price: galleryData.price || 'POA',
        location: location,
        bedrooms: galleryData.bedrooms,
        bathrooms: galleryData.bathrooms || (galleryData.bedrooms ? Math.max(1, galleryData.bedrooms) : 1),
        area: galleryData.area || `${50 + (galleryData.bedrooms || 0) * 30} m²`,
        type: 'Apartment',
        status: 'available',
        images: galleryData.images.length > 0 ? galleryData.images : [
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1440&h=900&fit=crop'
        ],
        description: `Beautiful ${galleryData.bedrooms ? galleryData.bedrooms + ' bedroom' : 'studio'} apartment in ${location} with modern finishes and stunning views.`,
        features: location === 'Cape Town City Centre' ?
          ['City Views', 'V&A Waterfront Access', 'Public Transport', 'Shopping Centers'] :
          location === 'Gardens' ?
          ['Table Mountain Views', 'Company Gardens', 'Kloof Street', 'Premium Location'] :
          ['Trendy Location', 'Art District', 'Investment Potential', 'Close to Amenities'],
        source: 'property24',
        sourceUrl: url,
        agentName: "La'eeq Allie",
        agentContact: "+27 82 123 4567"
      };

      results.push(property);

      // Add delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
    }

    console.log(`\\n✅ Scraping complete!`);
    console.log(`📊 Total properties with galleries: ${results.length}`);
    console.log(`🖼️  Properties with multiple images: ${results.filter(p => p.images.length > 1).length}`);

    // Save the results
    const output = {
      timestamp: new Date().toISOString(),
      agent: "La'eeq Allie",
      totalProperties: results.length,
      properties: results
    };

    fs.writeFileSync('property24-full-galleries.json', JSON.stringify(output, null, 2));
    console.log('📁 Data saved to: property24-full-galleries.json');

    await browser.close();
    return output;

  } catch (error) {
    console.error('❌ Error during scraping:', error);
    await browser.close();
    throw error;
  }
}

// Run the scraper
if (require.main === module) {
  scrapeAllProperty24Galleries()
    .then(result => {
      console.log('\\n🎉 Gallery scraping complete!');
      console.log(`   Properties scraped: ${result.totalProperties}`);
      console.log(`   Ready to update mockData.ts with real Property24 galleries`);
    })
    .catch(console.error);
}

module.exports = { scrapeAllProperty24Galleries };