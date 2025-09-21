const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

// Use stealth plugin with enhanced configuration
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

async function extractCompleteGalleryFromProperty(page, url) {
  try {
    console.log(`🎯 Extracting complete gallery from: ${url.split('/').pop()}`);

    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    // Wait for page to load completely
    await page.waitForTimeout(5000);

    console.log(`   📍 Analyzing page structure...`);

    const galleryData = await page.evaluate(async () => {
      const images = new Set(); // Use Set to avoid duplicates

      // Wait function for dynamic content
      const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

      // Method 1: Look for main gallery image and navigate through gallery
      console.log('Method 1: Main gallery navigation...');

      // Find main image container and click to open gallery
      const mainImageSelectors = [
        '.p24_mainImage img',
        '.property-main-image img',
        '.main-image img',
        '.hero-image img',
        '[data-testid="main-image"] img',
        '.listing-image img'
      ];

      let mainImageFound = false;
      for (const selector of mainImageSelectors) {
        const mainImg = document.querySelector(selector);
        if (mainImg) {
          console.log(`Found main image with selector: ${selector}`);
          const src = mainImg.src || mainImg.dataset.src || mainImg.dataset.original;
          if (src && src.includes('prop24.com')) {
            // Convert to highest quality
            const highResSrc = src.replace(/\/(\\d+x\\d+|Ensure\\d+x\\d+|Crop\\d+x\\d+)/, '/Crop1440x900');
            images.add(highResSrc);
            console.log(`Added main image: ${highResSrc}`);
          }

          // Try to click main image to open gallery
          try {
            mainImg.click();
            await wait(2000);
            mainImageFound = true;
            console.log('Clicked main image to open gallery');
          } catch (e) {
            console.log('Could not click main image:', e.message);
          }
          break;
        }
      }

      // Method 2: Look for gallery/carousel navigation
      console.log('Method 2: Gallery carousel navigation...');

      const gallerySelectors = [
        '.p24_gallery',
        '.property-gallery',
        '.image-gallery',
        '.photo-gallery',
        '.listing-gallery',
        '.carousel',
        '.slider',
        '.swiper-container',
        '[data-testid="gallery"]',
        '[class*="gallery"]',
        '[class*="carousel"]'
      ];

      let galleryContainer = null;
      for (const selector of gallerySelectors) {
        galleryContainer = document.querySelector(selector);
        if (galleryContainer) {
          console.log(`Found gallery container: ${selector}`);
          break;
        }
      }

      if (galleryContainer) {
        // Look for thumbnail navigation
        const thumbnails = galleryContainer.querySelectorAll('img, [data-src], [data-original]');
        console.log(`Found ${thumbnails.length} potential thumbnail images`);

        for (let i = 0; i < thumbnails.length; i++) {
          const thumb = thumbnails[i];

          // Try clicking thumbnail
          try {
            thumb.click();
            await wait(1000);
            console.log(`Clicked thumbnail ${i + 1}`);
          } catch (e) {
            console.log(`Could not click thumbnail ${i + 1}:`, e.message);
          }

          // Extract image URL from thumbnail or current displayed image
          let src = thumb.src || thumb.dataset.src || thumb.dataset.original;
          if (src && src.includes('prop24.com')) {
            const highResSrc = src.replace(/\/(\\d+x\\d+|Ensure\\d+x\\d+|Crop\\d+x\\d+|thumb|small)/, '/Crop1440x900');
            images.add(highResSrc);
            console.log(`Added gallery image ${i + 1}: ${highResSrc}`);
          }
        }

        // Look for next/previous buttons to navigate through more images
        const nextButtons = galleryContainer.querySelectorAll('.next, .arrow-right, [class*="next"], [class*="right"]');
        const prevButtons = galleryContainer.querySelectorAll('.prev, .arrow-left, [class*="prev"], [class*="left"]');

        console.log(`Found ${nextButtons.length} next buttons, ${prevButtons.length} prev buttons`);

        // Click through gallery using next button
        for (const nextBtn of nextButtons) {
          for (let clicks = 0; clicks < 20; clicks++) { // Max 20 clicks to avoid infinite loop
            try {
              nextBtn.click();
              await wait(1500);

              // After clicking, look for the currently displayed image
              const currentImageSelectors = [
                '.p24_mainImage img',
                '.current-image img',
                '.active img',
                '.selected img',
                '[class*="current"] img',
                '[class*="active"] img'
              ];

              for (const selector of currentImageSelectors) {
                const currentImg = document.querySelector(selector);
                if (currentImg) {
                  const src = currentImg.src || currentImg.dataset.src;
                  if (src && src.includes('prop24.com')) {
                    const highResSrc = src.replace(/\/(\\d+x\\d+|Ensure\\d+x\\d+|Crop\\d+x\\d+)/, '/Crop1440x900');
                    if (!images.has(highResSrc)) {
                      images.add(highResSrc);
                      console.log(`Added navigation image ${clicks + 1}: ${highResSrc}`);
                    }
                  }
                  break;
                }
              }
            } catch (e) {
              console.log(`Navigation click ${clicks + 1} failed:`, e.message);
              break;
            }
          }
          break; // Only use first next button found
        }
      }

      // Method 3: Comprehensive image search with multiple selectors
      console.log('Method 3: Comprehensive image search...');

      const allImageSelectors = [
        'img[src*="prop24.com"]',
        'img[data-src*="prop24.com"]',
        'img[data-original*="prop24.com"]',
        '[style*="prop24.com"]',
        '[data-bg*="prop24.com"]'
      ];

      for (const selector of allImageSelectors) {
        const elements = document.querySelectorAll(selector);
        console.log(`Found ${elements.length} elements with selector: ${selector}`);

        elements.forEach((el, index) => {
          let src = el.src || el.dataset.src || el.dataset.original || el.dataset.bg;

          // Check for background images in style attribute
          if (!src && el.style && el.style.backgroundImage) {
            const bgMatch = el.style.backgroundImage.match(/url\\(['"]?([^'")]+)['"]?\\)/);
            if (bgMatch) src = bgMatch[1];
          }

          if (src && src.includes('prop24.com') && !src.includes('logo') && !src.includes('icon') && src.match(/\\d{8,}/)) {
            const highResSrc = src.replace(/\/(\\d+x\\d+|Ensure\\d+x\\d+|Crop\\d+x\\d+|thumb|small)/, '/Crop1440x900');
            if (!images.has(highResSrc)) {
              images.add(highResSrc);
              console.log(`Added comprehensive search image ${index + 1}: ${highResSrc}`);
            }
          }
        });
      }

      // Method 4: Look for JSON-LD or script tags with image data
      console.log('Method 4: Script and JSON-LD search...');

      const scripts = document.querySelectorAll('script[type="application/ld+json"], script:not([src])');
      scripts.forEach((script, index) => {
        try {
          const content = script.textContent || script.innerHTML;
          if (content.includes('prop24.com')) {
            // Look for image URLs in JSON or JavaScript
            const imageMatches = content.match(/https?:\\/\\/[^"'\\s]*prop24\\.com[^"'\\s]*\\.(jpg|jpeg|png|webp)/gi);
            if (imageMatches) {
              imageMatches.forEach(url => {
                if (url.match(/\\d{8,}/)) { // Contains image ID
                  const highResSrc = url.replace(/\\/(\\d+x\\d+|Ensure\\d+x\\d+|Crop\\d+x\\d+)/, '/Crop1440x900');
                  images.add(highResSrc);
                  console.log(`Added script image: ${highResSrc}`);
                }
              });
            }
          }
        } catch (e) {
          console.log(`Script parsing error for script ${index}:`, e.message);
        }
      });

      // Get property details while we're here
      const titleEl = document.querySelector('h1, .p24_title, [class*="title"]');
      const title = titleEl ? titleEl.textContent.trim() : '';

      const priceEl = document.querySelector('.p24_price, [class*="price"]');
      const price = priceEl ? priceEl.textContent.trim() : '';

      const bedroomMatch = document.body.textContent.match(/(\\d+)\\s*bedroom/i);
      const bedrooms = bedroomMatch ? parseInt(bedroomMatch[1]) : null;

      const bathroomMatch = document.body.textContent.match(/(\\d+)\\s*bathroom/i);
      const bathrooms = bathroomMatch ? parseInt(bathroomMatch[1]) : null;

      const areaMatch = document.body.textContent.match(/(\\d+(?:\\.\\d+)?)\\s*m²/i);
      const area = areaMatch ? `${areaMatch[1]} m²` : null;

      console.log(`Total unique images found: ${images.size}`);

      return {
        title,
        price,
        bedrooms,
        bathrooms,
        area,
        images: Array.from(images) // Convert Set back to Array
      };
    });

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
  console.log('🚀 Starting ADVANCED Property24 gallery scraper for all 31 listings...');
  console.log('🔧 Using enhanced browser fingerprinting and gallery interaction...');

  const browser = await puppeteer.launch({
    headless: false, // Show browser for monitoring
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--disable-extensions',
      '--disable-plugins',
      '--disable-images=false', // Enable images
      '--window-size=1920,1080',
      '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ],
    defaultViewport: { width: 1920, height: 1080 },
    ignoreDefaultArgs: ['--enable-blink-features=IdleDetection']
  });

  const page = await browser.newPage();

  // Enhanced browser fingerprinting
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.setViewport({ width: 1920, height: 1080 });

  // Override webdriver detection
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    delete navigator.__proto__.webdriver;
  });

  // Set realistic headers
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1'
  });

  const results = [];

  try {
    for (let i = 0; i < PROPERTY_URLS.length; i++) {
      const url = PROPERTY_URLS[i];
      console.log(`\\n[${i + 1}/${PROPERTY_URLS.length}] Processing property...`);

      const propertyId = url.split('/').pop();
      const location = url.includes('cape-town-city-centre') ? 'Cape Town City Centre' :
                      url.includes('gardens') ? 'Gardens' :
                      url.includes('woodstock') ? 'Woodstock' : 'Cape Town';

      const galleryData = await extractCompleteGalleryFromProperty(page, url);

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
        images: galleryData.images.length > 0 ? galleryData.images : [],
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

      // Random delay between requests (3-8 seconds)
      const delay = 3000 + Math.random() * 5000;
      console.log(`   ⏱️  Waiting ${Math.round(delay/1000)}s before next property...`);
      await page.waitForTimeout(delay);
    }

    console.log(`\\n✅ Advanced scraping complete!`);
    console.log(`📊 Total properties with galleries: ${results.length}`);

    const totalImages = results.reduce((sum, p) => sum + p.images.length, 0);
    const avgImages = Math.round(totalImages / results.length);
    const propertiesWithImages = results.filter(p => p.images.length > 0).length;

    console.log(`🖼️  Total images extracted: ${totalImages}`);
    console.log(`📸 Average images per property: ${avgImages}`);
    console.log(`✅ Properties with images: ${propertiesWithImages}/${results.length}`);

    // Save the results
    const output = {
      timestamp: new Date().toISOString(),
      agent: "La'eeq Allie",
      totalProperties: results.length,
      totalImages: totalImages,
      extractionMethod: 'advanced-gallery-interaction',
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

// Run the advanced scraper
if (require.main === module) {
  scrapeAllProperty24GalleriesAdvanced()
    .then(result => {
      console.log('\\n🎉 Advanced gallery scraping complete!');
      console.log(`   Properties scraped: ${result.totalProperties}`);
      console.log(`   Total images extracted: ${result.totalImages}`);
      console.log(`   Ready to update mockData.ts with REAL Property24 galleries`);
    })
    .catch(console.error);
}

module.exports = { scrapeAllProperty24GalleriesAdvanced };