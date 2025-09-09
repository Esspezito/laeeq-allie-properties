const puppeteer = require('puppeteer');
const fs = require('fs');

// All 45 Greeff property URLs for Laeeq Allie
const propertyUrls = [
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/cape-town-city-centre/apartment/2746474/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/woodstock/apartment/2404200/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/cape-town-city-centre/studio-apartment/2390974/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/cape-town-city-centre/apartment/2382248/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/cape-town-city-centre/apartment/2366805/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/cape-town-city-centre/apartment/2339889/2109-16-on-bree-16-bree-street/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/cape-town-city-centre/apartment/2332226/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/woodstock/apartment/2276694/1-the-iron-works-3-armadale-street/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/cape-town-city-centre/apartment/2248683/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/cape-town-city-centre/studio-apartment/2248308/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/cape-town-city-centre/studio-apartment/2202928/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/cape-town-city-centre/apartment/2193469/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/cape-town-city-centre/studio-apartment/1864536/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/gardens/apartment/1862964/205-mount-essex-6-camp-street/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/gardens/house/1859007/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/woodstock/apartment/1835983/714-wex-1-85-albert-road/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/cape-town-city-centre/studio-apartment/1765073/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/cape-town-city-centre/apartment/1760587/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/cape-town-city-centre/apartment/1739766/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/cape-town-city-centre/apartment/1658851/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/woodstock/apartment/1547128/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/cape-town-city-centre/studio-apartment/1460188/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/cape-town-city-centre/apartment/1267313/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/woodstock/studio-apartment/1255913/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/cape-town-city-centre/apartment/1222763/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/woodstock/apartment/826622/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/woodstock/studio-apartment/808545/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/gardens/flat/806404/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/cape-town-city-centre/flat/806857/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/cape-town-city-centre/flat/806514/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/gardens/apartment/2830725/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/gardens/apartment/2795967/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/cape-town-city-centre/studio-apartment/2790285/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/woodstock/house/2791159/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/cape-town-city-centre/apartment/2791327/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/cape-town-city-centre/apartment/2791318/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/cape-town-city-centre/penthouse/2791429/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/cape-town-city-centre/studio-apartment/2790248/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/gardens/apartment/2755111/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/cape-town-city-centre/studio-apartment/2753059/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/cape-town-city-centre/apartment/2741335/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/woodstock/house/2726188/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/woodstock/apartment/2449393/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/cape-town-city-centre/apartment/2445991/',
  'https://www.greeff.co.za/results/residential/for-sale/cape-town/cape-town-city-centre/studio-apartment/2427021/'
];

// Helper function to extract property ID from URL
function getPropertyId(url) {
  const matches = url.match(/\/(\d+)\//);
  return matches ? matches[1] : url.split('/').pop();
}

// Helper function to determine property type from URL
function getPropertyType(url, title) {
  if (url.includes('studio-apartment') || title.toLowerCase().includes('studio')) {
    return 'Studio';
  } else if (url.includes('penthouse') || title.toLowerCase().includes('penthouse')) {
    return 'Penthouse';
  } else if (url.includes('apartment') || url.includes('flat')) {
    return 'Apartment';
  } else if (url.includes('house')) {
    return 'House';
  } else {
    return 'Property';
  }
}

// Helper function to extract area/location from URL
function getLocationFromUrl(url) {
  if (url.includes('cape-town-city-centre')) {
    return 'Cape Town City Centre';
  } else if (url.includes('woodstock')) {
    return 'Woodstock';
  } else if (url.includes('gardens')) {
    return 'Gardens';
  } else {
    return 'Cape Town';
  }
}

async function scrapePropertyDetails(page, url) {
  try {
    console.log(`\n🔍 Scraping: ${url}`);
    
    await page.goto(url, { 
      waitUntil: 'networkidle2',
      timeout: 60000 
    });

    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 3000));

    const propertyData = await page.evaluate(() => {
      // Extract title
      const titleElement = document.querySelector('h1') || 
                          document.querySelector('.property-title') || 
                          document.querySelector('[class*="title"]') ||
                          document.querySelector('title');
      let title = titleElement ? titleElement.textContent.trim() : '';
      
      // Clean up title
      if (title.includes(' - ')) {
        title = title.split(' - ')[0].trim();
      }
      
      // Extract price
      const priceSelectors = [
        '.price', '.property-price', '[class*="price"]',
        'span:contains("R")', 'div:contains("R")'
      ];
      
      let price = '';
      for (const selector of priceSelectors) {
        const elements = document.querySelectorAll(selector);
        for (const el of elements) {
          const text = el.textContent.trim();
          if (text.includes('R') && (text.includes('million') || text.includes('Million') || text.match(/R[\s\d,]+/))) {
            price = text;
            break;
          }
        }
        if (price) break;
      }
      
      // Extract property details
      let bedrooms, bathrooms, area;
      
      // Look for bed/bath/area info
      const detailElements = document.querySelectorAll('*');
      for (const el of detailElements) {
        const text = el.textContent.toLowerCase();
        
        // Bedrooms
        if (text.includes('bed') && !bedrooms) {
          const match = text.match(/(\d+)\s*bed/);
          if (match) bedrooms = parseInt(match[1]);
        }
        
        // Bathrooms  
        if (text.includes('bath') && !bathrooms) {
          const match = text.match(/(\d+(?:\.\d+)?)\s*bath/);
          if (match) bathrooms = parseFloat(match[1]);
        }
        
        // Area
        if ((text.includes('m²') || text.includes('sqm')) && !area) {
          const match = text.match(/(\d+(?:\.\d+)?)\s*(?:m²|sqm)/);
          if (match) area = `${match[1]} m²`;
        }
      }

      // Extract images - comprehensive search
      const images = [];
      const imageSelectors = [
        'img[src*="cloudfront"]',
        'img[src*="greeff"]',
        '.property-image img',
        '.gallery img',
        '.slider img',
        '.image-container img',
        '[class*="image"] img',
        '[class*="photo"] img'
      ];

      for (const selector of imageSelectors) {
        const imgs = document.querySelectorAll(selector);
        imgs.forEach(img => {
          let src = img.src || img.dataset.src || img.dataset.original;
          if (src && (src.includes('cloudfront') || src.includes('greeff')) && !images.includes(src)) {
            // Ensure high quality image
            if (src.includes('cloudfront') && !src.includes('_t_w_1440_h_900')) {
              src = src.replace(/_t_w_\d+_h_\d+/, '_t_w_1440_h_900');
            }
            images.push(src);
          }
        });
      }

      // Extract description
      let description = '';
      const descSelectors = [
        '.description', '.property-description', '.property-details',
        '[class*="description"]', '[class*="detail"]'
      ];
      
      for (const selector of descSelectors) {
        const descEl = document.querySelector(selector);
        if (descEl && descEl.textContent.trim().length > 50) {
          description = descEl.textContent.trim();
          break;
        }
      }

      return {
        title,
        price,
        bedrooms,
        bathrooms,
        area,
        images: images.slice(0, 50), // Limit to 50 images max
        description
      };
    });

    const propertyId = getPropertyId(url);
    const location = getLocationFromUrl(url);
    const type = getPropertyType(url, propertyData.title);

    const property = {
      id: propertyId,
      title: propertyData.title || `${type} in ${location}`,
      price: propertyData.price || 'Price on application',
      location: location,
      bedrooms: propertyData.bedrooms || null,
      bathrooms: propertyData.bathrooms || null,
      area: propertyData.area || null,
      type: type,
      status: 'available', // Will be updated later with real status
      images: propertyData.images.length > 0 ? propertyData.images : [`https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop`],
      description: propertyData.description,
      source: 'greeff',
      sourceUrl: url
    };

    console.log(`   ✅ ${property.title}`);
    console.log(`   💰 ${property.price}`);
    console.log(`   🏠 ${property.bedrooms ? property.bedrooms + ' bed, ' : ''}${property.bathrooms ? property.bathrooms + ' bath' : ''}`);
    console.log(`   📐 ${property.area || 'Area not specified'}`);
    console.log(`   📸 ${property.images.length} images extracted`);

    return property;

  } catch (error) {
    console.error(`❌ Error scraping ${url}:`, error.message);
    
    // Return basic property info even on error
    const propertyId = getPropertyId(url);
    const location = getLocationFromUrl(url);
    const type = getPropertyType(url, '');
    
    return {
      id: propertyId,
      title: `${type} in ${location}`,
      price: 'Price on application',
      location: location,
      bedrooms: null,
      bathrooms: null,
      area: null,
      type: type,
      status: 'available',
      images: [`https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop`],
      description: `Beautiful ${type.toLowerCase()} located in ${location}`,
      source: 'greeff',
      sourceUrl: url,
      error: error.message
    };
  }
}

async function scrapeAllProperties() {
  console.log('🚀 Starting comprehensive Laeeq Allie Greeff property scraper...');
  console.log(`📊 Total properties to scrape: ${propertyUrls.length}\n`);
  
  const browser = await puppeteer.launch({ 
    headless: true,
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Set realistic user agent
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  const properties = [];
  const batchSize = 5; // Process in batches to avoid overwhelming the server
  
  for (let i = 0; i < propertyUrls.length; i += batchSize) {
    const batch = propertyUrls.slice(i, i + batchSize);
    console.log(`\n📍 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(propertyUrls.length/batchSize)} (${batch.length} properties)`);
    
    for (const url of batch) {
      const property = await scrapePropertyDetails(page, url);
      properties.push(property);
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Longer delay between batches
    if (i + batchSize < propertyUrls.length) {
      console.log('⏸️  Waiting 10 seconds before next batch...');
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }

  await browser.close();

  // Save results
  const results = {
    timestamp: new Date().toISOString(),
    agent: 'Laeeq Allie',
    totalProperties: properties.length,
    successfulScrapes: properties.filter(p => !p.error).length,
    errors: properties.filter(p => p.error).length,
    totalImages: properties.reduce((sum, p) => sum + p.images.length, 0),
    properties: properties
  };

  fs.writeFileSync('laeeq-allie-greeff-properties.json', JSON.stringify(results, null, 2));
  
  console.log('\n🎉 LAEEQ ALLIE PROPERTY SCRAPING COMPLETE!');
  console.log(`📁 Results saved to: laeeq-allie-greeff-properties.json`);
  console.log(`\n--- SCRAPING SUMMARY ---`);
  console.log(`✅ Successful scrapes: ${results.successfulScrapes}/${results.totalProperties}`);
  console.log(`❌ Errors: ${results.errors}`);
  console.log(`📸 Total images extracted: ${results.totalImages}`);
  console.log(`📊 Average images per property: ${(results.totalImages / results.totalProperties).toFixed(1)}`);
  
  return results;
}

// Run the scraper
scrapeAllProperties().catch(console.error);