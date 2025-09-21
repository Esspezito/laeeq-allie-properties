const puppeteer = require('puppeteer');
const fs = require('fs');

const AGENT_URL = 'https://www.property24.com/for-sale/agency/greeff-christies-international-real-estate-head-office/laeeq-allie/430283';

async function extractPropertyData(page, url) {
  try {
    console.log(`   🔍 Extracting data from: ${url}`);

    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    const propertyData = await page.evaluate(() => {
      // Extract title
      const titleElement = document.querySelector('h1') ||
                          document.querySelector('[class*="title"]') ||
                          document.querySelector('.p24_title');
      const title = titleElement ? titleElement.textContent.trim() : '';

      // Extract price
      let price = '';
      const priceElement = document.querySelector('[class*="price"]') ||
                          document.querySelector('.p24_price') ||
                          document.querySelector('[class*="amount"]');
      if (priceElement) {
        price = priceElement.textContent.trim();
        // Clean up price format
        if (!price.startsWith('R')) {
          price = 'R' + price;
        }
      }

      // Extract location
      let location = '';
      const locationElement = document.querySelector('[class*="location"]') ||
                            document.querySelector('[class*="address"]') ||
                            document.querySelector('.p24_location');
      if (locationElement) {
        location = locationElement.textContent.trim();
      }

      // Extract bedrooms, bathrooms, area
      let bedrooms = null;
      let bathrooms = null;
      let area = null;

      // Look for property features/icons
      const featureElements = document.querySelectorAll('[class*="feature"], [class*="icon"], [class*="spec"]');
      featureElements.forEach(el => {
        const text = el.textContent.toLowerCase();
        if (text.includes('bed') && !bedrooms) {
          const match = text.match(/(\d+)/);
          if (match) bedrooms = parseInt(match[1]);
        }
        if (text.includes('bath') && !bathrooms) {
          const match = text.match(/(\d+)/);
          if (match) bathrooms = parseInt(match[1]);
        }
        if ((text.includes('m²') || text.includes('sqm')) && !area) {
          const match = text.match(/(\d+(?:\.\d+)?)/);
          if (match) area = `${match[1]} m²`;
        }
      });

      // Extract ALL images with emphasis on correct order
      const images = [];

      // Priority 1: Main gallery images (these maintain the correct order)
      const galleryImages = document.querySelectorAll('.p24_galleryCarousel img, .p24_gallery img, [class*="gallery"] img, [class*="carousel"] img');
      galleryImages.forEach(img => {
        let src = img.src || img.dataset.src || img.dataset.original || img.getAttribute('data-lazy-src');
        if (src && !src.includes('placeholder') && !src.includes('logo')) {
          // Get highest quality version
          src = src.replace(/\/\d+x\d+\//, '/1440x900/');
          if (!images.includes(src)) {
            images.push(src);
          }
        }
      });

      // Priority 2: Swiper/slider images if gallery not found
      if (images.length === 0) {
        const swiperImages = document.querySelectorAll('.swiper-slide img, .slider img');
        swiperImages.forEach(img => {
          let src = img.src || img.dataset.src || img.dataset.original;
          if (src && !src.includes('placeholder') && !src.includes('logo')) {
            src = src.replace(/\/\d+x\d+\//, '/1440x900/');
            if (!images.includes(src)) {
              images.push(src);
            }
          }
        });
      }

      // Priority 3: Any property images
      if (images.length === 0) {
        const allImages = document.querySelectorAll('img[src*="property24"], img[src*="p24"]');
        allImages.forEach(img => {
          let src = img.src;
          if (src && src.includes('/property/') && !src.includes('logo')) {
            src = src.replace(/\/\d+x\d+\//, '/1440x900/');
            if (!images.includes(src)) {
              images.push(src);
            }
          }
        });
      }

      // Extract property type
      let type = 'Property';
      const typeElement = document.querySelector('[class*="property-type"], [class*="propertyType"]');
      if (typeElement) {
        const typeText = typeElement.textContent.toLowerCase();
        if (typeText.includes('apartment') || typeText.includes('flat')) {
          type = 'Apartment';
        } else if (typeText.includes('house')) {
          type = 'House';
        } else if (typeText.includes('townhouse')) {
          type = 'Townhouse';
        }
      }

      // Extract description
      let description = '';
      const descElement = document.querySelector('[class*="description"], .p24_description');
      if (descElement) {
        description = descElement.textContent.trim().substring(0, 500);
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
        description
      };
    });

    // Get property ID from URL
    const idMatch = url.match(/\/(\d+)$/);
    const propertyId = idMatch ? idMatch[1] : url.split('/').pop();

    return {
      id: propertyId,
      title: propertyData.title || 'Property in Cape Town',
      price: propertyData.price || 'POA',
      location: propertyData.location || 'Cape Town',
      bedrooms: propertyData.bedrooms,
      bathrooms: propertyData.bathrooms,
      area: propertyData.area,
      type: propertyData.type,
      status: 'available',
      images: propertyData.images.length > 0 ? propertyData.images : ['/placeholder.jpg'],
      description: propertyData.description,
      source: 'property24',
      sourceUrl: url
    };

  } catch (error) {
    console.error(`   ❌ Error extracting property data: ${error.message}`);
    return null;
  }
}

async function scrapeProperty24Listings() {
  console.log('🚀 Starting Property24 scraper for La\'eeq Allie...');
  console.log(`📍 Agent URL: ${AGENT_URL}\n`);

  const browser = await puppeteer.launch({
    headless: true, // Run in headless mode
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  try {
    const allProperties = [];
    let currentPage = 1;
    let hasNextPage = true;

    while (hasNextPage) {
      const pageUrl = currentPage === 1 ? AGENT_URL : `${AGENT_URL}?page=${currentPage}`;
      console.log(`📋 Loading page ${currentPage}: ${pageUrl}`);

      await page.goto(pageUrl, {
        waitUntil: 'networkidle2',
        timeout: 60000
      });

      // Wait for listings to load
      await page.waitForSelector('a[href*="/for-sale/"]', { timeout: 10000 }).catch(() => {});
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Extract property URLs from the listing page
      const propertyUrls = await page.evaluate(() => {
        const urls = [];

        // Find all property listing links - specifically La'eeq's listings
        const listingLinks = document.querySelectorAll('.p24_listing a, .p24_listingTileWrapper a, [class*="listing"] a');
        listingLinks.forEach(link => {
          const href = link.href;
          // Filter to only include actual property listings
          if (href &&
              href.includes('/for-sale/') &&
              href.match(/\/\d{8,}$/) && // Ends with property ID (8+ digits)
              !href.includes('/agency/') &&
              !href.includes('/agent/') &&
              !href.includes('/gauteng/') && // Exclude other provinces
              !href.includes('/kwazulu-natal/')) {
            urls.push(href);
          }
        });

        return [...new Set(urls)]; // Remove duplicates
      });

      console.log(`   Found ${propertyUrls.length} properties on page ${currentPage}`);

      // Extract data for each property on this page
      for (const propertyUrl of propertyUrls) {
        const propertyData = await extractPropertyData(page, propertyUrl);
        if (propertyData) {
          allProperties.push(propertyData);
          console.log(`   ✅ Scraped: ${propertyData.title}`);
        }

        // Add delay between requests
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Check if there's a next page
      const nextPageExists = await page.evaluate(() => {
        // Look for next page button or pagination
        const nextButtons = document.querySelectorAll('a[rel="next"], [class*="pagination"] a, [class*="next"]');
        for (const btn of nextButtons) {
          if (btn.textContent && btn.textContent.toLowerCase().includes('next')) {
            return !btn.classList.contains('disabled');
          }
        }
        // Also check for page 2 link if on page 1
        const page2Link = document.querySelector('a[href*="page=2"]');
        return !!page2Link;
      });

      if (nextPageExists && currentPage < 3) { // Limit to 3 pages max for safety
        currentPage++;
      } else {
        hasNextPage = false;
      }
    }

    console.log(`\n✅ Scraping complete!`);
    console.log(`📊 Total properties scraped: ${allProperties.length}`);

    // Save the raw scraped data
    const result = {
      timestamp: new Date().toISOString(),
      agent: "La'eeq Allie",
      totalProperties: allProperties.length,
      properties: allProperties
    };

    fs.writeFileSync('property24-laeeq-listings.json', JSON.stringify(result, null, 2));
    console.log('📁 Properties saved to: property24-laeeq-listings.json');

    await browser.close();
    return result;

  } catch (error) {
    console.error('❌ Error during scraping:', error);
    await browser.close();
    throw error;
  }
}

// Function to convert Property24 data to the app's format
function convertToAppFormat(property24Data) {
  const mockProperties = property24Data.properties.map((prop, index) => {
    // Ensure status is correct
    let status = 'available';
    if (prop.title && prop.title.toLowerCase().includes('under offer')) {
      status = 'under-offer';
    } else if (prop.title && prop.title.toLowerCase().includes('sold')) {
      status = 'sold';
    }

    return {
      id: prop.id || `p24-${index}`,
      title: prop.title,
      price: prop.price,
      location: prop.location,
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      area: prop.area,
      type: prop.type,
      status: status,
      images: prop.images,
      description: prop.description,
      features: [], // Can be populated if needed
      source: 'property24',
      sourceUrl: prop.sourceUrl,
      agentName: "La'eeq Allie",
      agentContact: "+27 82 123 4567"
    };
  });

  return mockProperties;
}

// Main execution
if (require.main === module) {
  scrapeProperty24Listings()
    .then(result => {
      console.log('\n🔄 Converting to app format...');
      const appFormatData = convertToAppFormat(result);

      // Save converted data
      fs.writeFileSync('property24-app-format.json', JSON.stringify(appFormatData, null, 2));
      console.log('📁 App format data saved to: property24-app-format.json');

      console.log('\n✨ All done! Now update mockData.ts with the scraped data.');
    })
    .catch(console.error);
}

module.exports = { scrapeProperty24Listings, convertToAppFormat };