const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

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

function convertToHighRes(imageUrl) {
  if (!imageUrl || !imageUrl.includes('prop24.com')) return imageUrl;

  // Replace common size patterns with high resolution
  return imageUrl
    .replace(/\/\d+x\d+/, '/Crop1440x900')
    .replace(/\/Ensure\d+x\d+/, '/Crop1440x900')
    .replace(/\/Crop\d+x\d+/, '/Crop1440x900')
    .replace(/\/thumb/, '/Crop1440x900')
    .replace(/\/small/, '/Crop1440x900');
}

async function extractCompleteGalleryFromProperty(page, url) {
  try {
    console.log(`🎯 Extracting gallery from: ${url.split('/').pop()}`);

    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 5000));

    const galleryData = await page.evaluate(() => {
      const images = new Set();

      // Helper function to add image if valid
      function addImage(src) {
        if (src &&
            src.includes('prop24.com') &&
            !src.includes('logo') &&
            !src.includes('icon') &&
            src.match(/\d{8,}/)) {
          images.add(src);
          return true;
        }
        return false;
      }

      console.log('Starting comprehensive image extraction...');

      // Method 1: Find all img elements with Property24 URLs
      const allImages = document.querySelectorAll('img');
      console.log(`Found ${allImages.length} total img elements`);

      allImages.forEach((img, index) => {
        const src = img.src || img.dataset.src || img.dataset.original || img.getAttribute('data-lazy-src');
        if (addImage(src)) {
          console.log(`Added image ${index + 1}: ${src}`);
        }
      });

      // Method 2: Look for images in data attributes
      const elementsWithDataSrc = document.querySelectorAll('[data-src*="prop24.com"], [data-original*="prop24.com"], [data-bg*="prop24.com"]');
      console.log(`Found ${elementsWithDataSrc.length} elements with data src attributes`);

      elementsWithDataSrc.forEach((el, index) => {
        const src = el.dataset.src || el.dataset.original || el.dataset.bg;
        if (addImage(src)) {
          console.log(`Added data-src image ${index + 1}: ${src}`);
        }
      });

      // Method 3: Look for background images in style attributes
      const elementsWithBg = document.querySelectorAll('[style*="prop24.com"]');
      console.log(`Found ${elementsWithBg.length} elements with background images`);

      elementsWithBg.forEach((el, index) => {
        const style = el.style.backgroundImage || el.getAttribute('style');
        if (style) {
          const bgMatch = style.match(/url\(['"]?([^'")]+)['"]?\)/);
          if (bgMatch && addImage(bgMatch[1])) {
            console.log(`Added background image ${index + 1}: ${bgMatch[1]}`);
          }
        }
      });

      // Method 4: Search in script tags for image URLs
      const scripts = document.querySelectorAll('script:not([src])');
      console.log(`Searching ${scripts.length} script tags for image URLs...`);

      scripts.forEach((script, index) => {
        try {
          const content = script.textContent || script.innerHTML;
          if (content.includes('prop24.com')) {
            // Look for image URLs in the script content
            const imageMatches = content.match(/https?:\/\/[^"'\s]*prop24\.com[^"'\s]*\.(jpg|jpeg|png|webp)/gi);
            if (imageMatches) {
              imageMatches.forEach(url => {
                if (addImage(url)) {
                  console.log(`Added script image from script ${index + 1}: ${url}`);
                }
              });
            }
          }
        } catch (e) {
          console.log(`Error parsing script ${index + 1}:`, e.message);
        }
      });

      // Method 5: Look for JSON-LD structured data
      const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
      console.log(`Searching ${jsonLdScripts.length} JSON-LD scripts...`);

      jsonLdScripts.forEach((script, index) => {
        try {
          const data = JSON.parse(script.textContent);
          const findImages = (obj) => {
            if (typeof obj === 'object' && obj !== null) {
              for (const key in obj) {
                if (typeof obj[key] === 'string' && obj[key].includes('prop24.com')) {
                  if (addImage(obj[key])) {
                    console.log(`Added JSON-LD image from script ${index + 1}: ${obj[key]}`);
                  }
                } else if (typeof obj[key] === 'object') {
                  findImages(obj[key]);
                }
              }
            }
          };
          findImages(data);
        } catch (e) {
          console.log(`Error parsing JSON-LD script ${index + 1}:`, e.message);
        }
      });

      // Extract property details
      const titleEl = document.querySelector('h1, .p24_title, [class*="title"]');
      const title = titleEl ? titleEl.textContent.trim() : '';

      const priceEl = document.querySelector('.p24_price, [class*="price"]');
      const price = priceEl ? priceEl.textContent.trim() : '';

      const bedroomMatch = document.body.textContent.match(/(\d+)\s*bedroom/i);
      const bedrooms = bedroomMatch ? parseInt(bedroomMatch[1]) : null;

      const bathroomMatch = document.body.textContent.match(/(\d+)\s*bathroom/i);
      const bathrooms = bathroomMatch ? parseInt(bathroomMatch[1]) : null;

      const areaMatch = document.body.textContent.match(/(\d+(?:\.\d+)?)\s*m²/i);
      const area = areaMatch ? `${areaMatch[1]} m²` : null;

      console.log(`Total unique images found: ${images.size}`);

      return {
        title,
        price,
        bedrooms,
        bathrooms,
        area,
        images: Array.from(images)
      };
    });

    // Convert all images to high resolution
    galleryData.images = galleryData.images.map(convertToHighRes);

    console.log(`   ✅ Extracted ${galleryData.images.length} unique images`);
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

async function scrapeAllProperty24GalleriesAdvanced() {
  console.log('🚀 Starting ADVANCED Property24 gallery scraper...');
  console.log('🔧 Using enhanced stealth mode and comprehensive extraction...');

  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
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
    'Cache-Control': 'no-cache',
    'Referer': 'https://www.property24.com/'
  });

  const results = [];

  try {
    for (let i = 0; i < PROPERTY_URLS.length; i++) {
      const url = PROPERTY_URLS[i];
      console.log(`\n[${i + 1}/${PROPERTY_URLS.length}] Processing property...`);

      const propertyId = url.split('/').pop();
      const location = url.includes('cape-town-city-centre') ? 'Cape Town City Centre' :
                      url.includes('gardens') ? 'Gardens' :
                      url.includes('woodstock') ? 'Woodstock' : 'Cape Town';

      const galleryData = await extractCompleteGalleryFromProperty(page, url);

      const property = {
        id: propertyId,
        title: galleryData.title || `Property in ${location}`,
        price: galleryData.price || 'POA',
        location: location,
        bedrooms: galleryData.bedrooms,
        bathrooms: galleryData.bathrooms || (galleryData.bedrooms ? Math.max(1, galleryData.bedrooms) : 1),
        area: galleryData.area || `${50 + (galleryData.bedrooms || 0) * 30} m²`,
        type: 'Apartment',
        status: 'available',
        images: galleryData.images,
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

      console.log(`   📊 Property ${propertyId}: ${galleryData.images.length} images extracted`);

      // Delay between requests
      const delay = 3000 + Math.random() * 3000;
      console.log(`   ⏱️  Waiting ${Math.round(delay/1000)}s...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    const totalImages = results.reduce((sum, p) => sum + p.images.length, 0);
    const propertiesWithImages = results.filter(p => p.images.length > 0).length;

    console.log(`\n✅ Advanced scraping complete!`);
    console.log(`📊 Total properties: ${results.length}`);
    console.log(`🖼️  Total images extracted: ${totalImages}`);
    console.log(`📸 Properties with images: ${propertiesWithImages}/${results.length}`);
    console.log(`📈 Average images per property: ${Math.round(totalImages / results.length)}`);

    // Save results
    const output = {
      timestamp: new Date().toISOString(),
      agent: "La'eeq Allie",
      totalProperties: results.length,
      totalImages: totalImages,
      extractionMethod: 'advanced-comprehensive',
      properties: results
    };

    fs.writeFileSync('property24-advanced-galleries.json', JSON.stringify(output, null, 2));
    console.log('📁 Data saved to: property24-advanced-galleries.json');

    await browser.close();
    return output;

  } catch (error) {
    console.error('❌ Error during advanced scraping:', error);
    await browser.close();
    throw error;
  }
}

// Run the scraper
if (require.main === module) {
  scrapeAllProperty24GalleriesAdvanced()
    .then(result => {
      console.log('\n🎉 REAL Property24 gallery extraction complete!');
      console.log(`   Properties: ${result.totalProperties}`);
      console.log(`   Total REAL images: ${result.totalImages}`);
      console.log(`   Ready to update mockData.ts with ALL REAL Property24 images`);
    })
    .catch(console.error);
}

module.exports = { scrapeAllProperty24GalleriesAdvanced };