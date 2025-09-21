const puppeteer = require('puppeteer');
const fs = require('fs');

// All property URLs from La'eeq Allie's Property24 page
const PROPERTY_URLS = [
  // Page 1 - 21 listings
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

  // Page 2 - 10 listings
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

async function extractPropertyDetails(page, url) {
  try {
    console.log(`   📍 Extracting: ${url.split('/').pop()}`);

    // Navigate with proper headers to avoid blocking
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    // Wait a bit for dynamic content
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

    const propertyData = await page.evaluate(() => {
      // Extract title
      const titleEl = document.querySelector('h1.p24_title, h1[class*="Title"], .p24_listingHeader h1');
      const title = titleEl ? titleEl.textContent.trim() : '';

      // Extract price
      let price = '';
      const priceEl = document.querySelector('.p24_price, [class*="Price"]:not([class*="per"])');
      if (priceEl) {
        price = priceEl.textContent.trim().replace(/[\n\r\t]+/g, ' ');
      }

      // Extract location
      let location = '';
      const breadcrumb = document.querySelector('.p24_breadcrumb');
      if (breadcrumb) {
        const breadcrumbText = breadcrumb.textContent;
        const locationMatch = breadcrumbText.match(/in\s+([^>]+)/);
        if (locationMatch) {
          location = locationMatch[1].trim();
        }
      } else {
        const locationEl = document.querySelector('.p24_listingAddress, [class*="Location"], [class*="Address"]');
        if (locationEl) {
          location = locationEl.textContent.trim();
        }
      }

      // Extract features
      let bedrooms = null, bathrooms = null, area = null;
      const featureIcons = document.querySelectorAll('.p24_featureDetails .p24_feature');
      featureIcons.forEach(feature => {
        const text = feature.textContent.trim().toLowerCase();
        if (text.includes('bedroom')) {
          const num = text.match(/(\d+)/);
          if (num) bedrooms = parseInt(num[1]);
        } else if (text.includes('bathroom')) {
          const num = text.match(/(\d+)/);
          if (num) bathrooms = parseInt(num[1]);
        } else if (text.includes('m²')) {
          const num = text.match(/(\d+)/);
          if (num) area = `${num[1]} m²`;
        }
      });

      // Alternative feature extraction
      if (!bedrooms || !bathrooms) {
        const iconText = document.body.textContent;
        const bedMatch = iconText.match(/(\d+)\s*Bedroom/i);
        const bathMatch = iconText.match(/(\d+)\s*Bathroom/i);
        const areaMatch = iconText.match(/(\d+)\s*m²/);

        if (bedMatch && !bedrooms) bedrooms = parseInt(bedMatch[1]);
        if (bathMatch && !bathrooms) bathrooms = parseInt(bathMatch[1]);
        if (areaMatch && !area) area = `${areaMatch[1]} m²`;
      }

      // Extract ALL images in order - CRITICAL for gallery view
      const images = [];

      // Method 1: Gallery thumbnails (these maintain the correct order)
      const galleryThumbs = document.querySelectorAll('.p24_galleryThumbnails img, .p24_thumbnails img');
      galleryThumbs.forEach(img => {
        let src = img.dataset.src || img.src;
        if (src && !src.includes('placeholder')) {
          // Convert thumbnail to full size
          src = src.replace(/\/\d+x\d+\//, '/1440x900/')
                   .replace('_t_', '_')
                   .replace('thumb', 'large');
          if (!images.includes(src)) {
            images.push(src);
          }
        }
      });

      // Method 2: Main gallery images if thumbnails not found
      if (images.length === 0) {
        const mainImages = document.querySelectorAll('.p24_mainImage img, .p24_galleryImage img, [class*="gallery"] img');
        mainImages.forEach(img => {
          let src = img.dataset.src || img.src || img.dataset.original;
          if (src && !src.includes('placeholder')) {
            src = src.replace(/\/\d+x\d+\//, '/1440x900/');
            if (!images.includes(src)) {
              images.push(src);
            }
          }
        });
      }

      // Method 3: Any image with property24 domain
      if (images.length === 0) {
        const allImages = document.querySelectorAll('img[src*="property24"], img[data-src*="property24"]');
        allImages.forEach(img => {
          let src = img.dataset.src || img.src;
          if (src && src.includes('/gallery/') && !src.includes('logo')) {
            src = src.replace(/\/\d+x\d+\//, '/1440x900/');
            if (!images.includes(src)) {
              images.push(src);
            }
          }
        });
      }

      // Extract property type
      let type = 'Apartment';
      const typeEl = document.querySelector('.p24_propertyType, [class*="PropertyType"]');
      if (typeEl) {
        const typeText = typeEl.textContent.toLowerCase();
        if (typeText.includes('house')) type = 'House';
        else if (typeText.includes('townhouse')) type = 'Townhouse';
        else if (typeText.includes('penthouse')) type = 'Penthouse';
        else if (typeText.includes('studio')) type = 'Studio';
      }

      // Extract description
      let description = '';
      const descEl = document.querySelector('.p24_description, [class*="Description"]:not([class*="Meta"])');
      if (descEl) {
        description = descEl.textContent.trim().substring(0, 500);
      }

      // Check status
      let status = 'available';
      const statusEl = document.querySelector('.p24_listingStatus, [class*="Status"]');
      if (statusEl) {
        const statusText = statusEl.textContent.toLowerCase();
        if (statusText.includes('under offer')) status = 'under-offer';
        else if (statusText.includes('sold')) status = 'sold';
      }

      return {
        title,
        price,
        location,
        bedrooms,
        bathrooms,
        area,
        type,
        images,
        description,
        status
      };
    });

    // Get property ID from URL
    const propertyId = url.split('/').pop();

    return {
      id: propertyId,
      title: propertyData.title || 'Property in Cape Town',
      price: propertyData.price || 'POA',
      location: propertyData.location || 'Cape Town',
      bedrooms: propertyData.bedrooms,
      bathrooms: propertyData.bathrooms,
      area: propertyData.area,
      type: propertyData.type,
      status: propertyData.status,
      images: propertyData.images.length > 0 ? propertyData.images : ['/placeholder.jpg'],
      description: propertyData.description,
      features: [],
      source: 'property24',
      sourceUrl: url,
      agentName: "La'eeq Allie",
      agentContact: "+27 82 123 4567"
    };

  } catch (error) {
    console.error(`   ❌ Error on ${url.split('/').pop()}: ${error.message}`);
    // Return basic property even on error
    return {
      id: url.split('/').pop(),
      title: 'Property in Cape Town',
      price: 'POA',
      location: 'Cape Town',
      bedrooms: null,
      bathrooms: null,
      area: null,
      type: 'Apartment',
      status: 'available',
      images: ['/placeholder.jpg'],
      description: '',
      features: [],
      source: 'property24',
      sourceUrl: url,
      agentName: "La'eeq Allie",
      agentContact: "+27 82 123 4567"
    };
  }
}

async function scrapeAllProperties() {
  console.log('🚀 Starting Property24 complete scrape for La\'eeq Allie...');
  console.log(`📊 Total properties to scrape: ${PROPERTY_URLS.length}\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  });

  const page = await browser.newPage();

  // Set user agent to avoid detection
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  // Block unnecessary resources to speed up loading
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    const resourceType = request.resourceType();
    if (['font', 'stylesheet'].includes(resourceType)) {
      request.abort();
    } else {
      request.continue();
    }
  });

  const allProperties = [];
  let successCount = 0;

  try {
    for (let i = 0; i < PROPERTY_URLS.length; i++) {
      const url = PROPERTY_URLS[i];
      console.log(`\n[${i + 1}/${PROPERTY_URLS.length}] Processing property...`);

      const property = await extractPropertyDetails(page, url);
      allProperties.push(property);

      if (property.images.length > 1) {
        successCount++;
        console.log(`   ✅ Success: ${property.title.substring(0, 50)}... (${property.images.length} images)`);
      } else {
        console.log(`   ⚠️  Limited data: ${property.title.substring(0, 50)}...`);
      }

      // Add delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    }

    console.log(`\n✅ Scraping complete!`);
    console.log(`📊 Successfully scraped: ${successCount}/${PROPERTY_URLS.length} with images`);

    // Save the data
    const result = {
      timestamp: new Date().toISOString(),
      agent: "La'eeq Allie",
      company: "Greeff Christie's International Real Estate",
      totalProperties: allProperties.length,
      successfulScrapes: successCount,
      properties: allProperties
    };

    // Save raw data
    fs.writeFileSync('property24-complete-data.json', JSON.stringify(result, null, 2));
    console.log('📁 Data saved to: property24-complete-data.json');

    // Generate TypeScript format for mockData.ts
    const tsFormat = `export const mockProperties: Property[] = ${JSON.stringify(allProperties, null, 2)};`;
    fs.writeFileSync('property24-mockdata-format.ts', tsFormat);
    console.log('📁 TypeScript format saved to: property24-mockdata-format.ts');

    await browser.close();
    return result;

  } catch (error) {
    console.error('❌ Fatal error:', error);
    await browser.close();
    throw error;
  }
}

// Run the scraper
if (require.main === module) {
  scrapeAllProperties()
    .then(result => {
      console.log('\n✨ All done! Properties are ready to be imported into mockData.ts');
      console.log(`   Total properties: ${result.totalProperties}`);
      console.log(`   Properties with images: ${result.successfulScrapes}`);
    })
    .catch(console.error);
}

module.exports = { scrapeAllProperties };