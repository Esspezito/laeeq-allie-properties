const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const AGENT_URL = 'https://www.greeff.co.za/results/agent/25192/';
const PROPERTIES_FILE = 'laeeq-allie-greeff-properties.json';
const UPDATE_LOG_FILE = 'property-update-log.json';

function getPropertyId(url) {
  const matches = url.match(/\/(\d+)\//);
  return matches ? matches[1] : url.split('/').pop();
}

function getPropertyType(url, title) {
  if (url.includes('studio-apartment') || title?.toLowerCase().includes('studio')) {
    return 'Studio';
  } else if (url.includes('penthouse') || title?.toLowerCase().includes('penthouse')) {
    return 'Penthouse';
  } else if (url.includes('apartment') || url.includes('flat')) {
    return 'Apartment';
  } else if (url.includes('house')) {
    return 'House';
  } else {
    return 'Property';
  }
}

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
    console.log(`   🔍 Scraping: ${url}`);

    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    await new Promise(resolve => setTimeout(resolve, 3000));

    const propertyData = await page.evaluate(() => {
      const titleElement = document.querySelector('h1') ||
                          document.querySelector('.property-title') ||
                          document.querySelector('[class*="title"]') ||
                          document.querySelector('title');
      let title = titleElement ? titleElement.textContent.trim() : '';

      if (title.includes(' - ')) {
        title = title.split(' - ')[0].trim();
      }

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

      let bedrooms, bathrooms, area;

      const detailElements = document.querySelectorAll('*');
      for (const el of detailElements) {
        const text = el.textContent.toLowerCase();

        if (text.includes('bed') && !bedrooms) {
          const match = text.match(/(\d+)\s*bed/);
          if (match) bedrooms = parseInt(match[1]);
        }

        if (text.includes('bath') && !bathrooms) {
          const match = text.match(/(\d+(?:\.\d+)?)\s*bath/);
          if (match) bathrooms = parseFloat(match[1]);
        }

        if ((text.includes('m²') || text.includes('sqm')) && !area) {
          const match = text.match(/(\d+(?:\.\d+)?)\s*(?:m²|sqm)/);
          if (match) area = `${match[1]} m²`;
        }
      }

      const images = [];

      // Priority 1: Look for gallery/carousel images first (these are the main property photos)
      const gallerySelectors = [
        '.gallery img',
        '.carousel img',
        '.slider img',
        '.swiper img',
        '.property-gallery img',
        '.image-gallery img'
      ];

      for (const selector of gallerySelectors) {
        const imgs = document.querySelectorAll(selector);
        imgs.forEach(img => {
          let src = img.src || img.dataset.src || img.dataset.original;
          if (src &&
              (src.includes('cloudfront') || src.includes('greeff')) &&
              src.includes('/residential/') && // Only residential property images
              !src.includes('logo') &&
              !src.includes('theme-settings') &&
              !images.includes(src)) {

            // Ensure high quality image
            if (src.includes('cloudfront') && !src.includes('_t_w_1440_h_900')) {
              src = src.replace(/_t_w_\d+_h_\d+/, '_t_w_1440_h_900');
            }
            images.push(src);
          }
        });
      }

      // Priority 2: If no gallery images found, look for other property images
      if (images.length === 0) {
        const otherSelectors = [
          'img[src*="cloudfront"]',
          'img[src*="greeff"]',
          '.property-image img',
          '.image-container img',
          '[class*="image"] img',
          '[class*="photo"] img'
        ];

        for (const selector of otherSelectors) {
          const imgs = document.querySelectorAll(selector);
          imgs.forEach(img => {
            let src = img.src || img.dataset.src || img.dataset.original;
            if (src &&
                (src.includes('cloudfront') || src.includes('greeff')) &&
                src.includes('/residential/') && // Only residential property images
                !src.includes('logo') &&
                !src.includes('theme-settings') &&
                !images.includes(src)) {

              // Ensure high quality image
              if (src.includes('cloudfront') && !src.includes('_t_w_1440_h_900')) {
                src = src.replace(/_t_w_\d+_h_\d+/, '_t_w_1440_h_900');
              }
              images.push(src);
            }
          });
        }
      }

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
        images: images.slice(0, 50),
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
      status: 'available',
      images: propertyData.images.length > 0 ? propertyData.images : [`https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop`],
      description: propertyData.description,
      source: 'greeff',
      sourceUrl: url,
      lastUpdated: new Date().toISOString()
    };

    console.log(`      ✅ Scraped: ${property.title}`);
    return property;

  } catch (error) {
    console.error(`      ❌ Error: ${error.message}`);

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
      error: error.message,
      lastUpdated: new Date().toISOString()
    };
  }
}

async function fetchAgentListings(page) {
  console.log('📋 Fetching agent listings page...');

  await page.goto(AGENT_URL, {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  await new Promise(resolve => setTimeout(resolve, 3000));

  const propertyUrls = await page.evaluate(() => {
    const urls = [];

    const linkSelectors = [
      'a[href*="/results/residential/"]',
      '.property-link',
      '.listing-link',
      'a[href*="/for-sale/"]'
    ];

    linkSelectors.forEach(selector => {
      const links = document.querySelectorAll(selector);
      links.forEach(link => {
        const href = link.href;
        if (href &&
            href.includes('greeff.co.za/results/residential/') &&
            !urls.includes(href) &&
            !href.includes('/agent/')) {
          urls.push(href);
        }
      });
    });

    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
      const href = link.href;
      if (href &&
          href.includes('greeff.co.za/results/residential/for-sale/') &&
          href.match(/\/\d+\/$/) &&
          !urls.includes(href)) {
        urls.push(href);
      }
    });

    return [...new Set(urls)];
  });

  console.log(`✅ Found ${propertyUrls.length} active listings\n`);
  return propertyUrls;
}

async function updateProperties() {
  console.log('🚀 Starting automatic property update...');
  console.log(`⏰ Update time: ${new Date().toISOString()}\n`);

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  try {
    const currentListingUrls = await fetchAgentListings(page);

    let existingData = { properties: [], timestamp: '', agent: 'Laeeq Allie' };
    if (fs.existsSync(PROPERTIES_FILE)) {
      existingData = JSON.parse(fs.readFileSync(PROPERTIES_FILE, 'utf8'));
    }

    const existingMap = new Map(existingData.properties.map(p => [p.sourceUrl, p]));
    const existingUrls = Array.from(existingMap.keys());

    const newUrls = currentListingUrls.filter(url => !existingUrls.includes(url));
    const removedUrls = existingUrls.filter(url => !currentListingUrls.includes(url));
    const existingActiveUrls = currentListingUrls.filter(url => existingUrls.includes(url));

    console.log('📊 Update Summary:');
    console.log(`   🆕 New listings: ${newUrls.length}`);
    console.log(`   ⚡ Existing active: ${existingActiveUrls.length}`);
    console.log(`   🔴 Removed/Sold: ${removedUrls.length}\n`);

    const updatedProperties = [];

    if (existingActiveUrls.length > 0) {
      console.log('📍 Keeping existing active properties...');
      existingActiveUrls.forEach(url => {
        const existing = existingMap.get(url);
        if (existing) {
          updatedProperties.push({
            ...existing,
            status: 'available',
            lastChecked: new Date().toISOString()
          });
        }
      });
    }

    if (newUrls.length > 0) {
      console.log('\n🆕 Scraping new listings:');
      for (const url of newUrls) {
        const property = await scrapePropertyDetails(page, url);
        property.isNew = true;
        property.addedDate = new Date().toISOString();
        updatedProperties.push(property);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    if (removedUrls.length > 0) {
      console.log('\n🔴 Marking removed properties as sold:');
      removedUrls.forEach(url => {
        const existing = existingMap.get(url);
        if (existing) {
          console.log(`   - ${existing.title}`);
          updatedProperties.push({
            ...existing,
            status: 'sold',
            soldDate: new Date().toISOString(),
            lastChecked: new Date().toISOString()
          });
        }
      });
    }

    const updateResult = {
      timestamp: new Date().toISOString(),
      agent: 'Laeeq Allie',
      totalProperties: updatedProperties.length,
      activeProperties: updatedProperties.filter(p => p.status === 'available').length,
      soldProperties: updatedProperties.filter(p => p.status === 'sold').length,
      newProperties: updatedProperties.filter(p => p.isNew).length,
      properties: updatedProperties
    };

    fs.writeFileSync(PROPERTIES_FILE, JSON.stringify(updateResult, null, 2));

    const updateLog = {
      timestamp: new Date().toISOString(),
      newListings: newUrls.length,
      removedListings: removedUrls.length,
      totalActive: updatedProperties.filter(p => p.status === 'available').length,
      totalSold: updatedProperties.filter(p => p.status === 'sold').length,
      newPropertyIds: newUrls.map(url => getPropertyId(url)),
      removedPropertyIds: removedUrls.map(url => getPropertyId(url))
    };

    let logs = [];
    if (fs.existsSync(UPDATE_LOG_FILE)) {
      logs = JSON.parse(fs.readFileSync(UPDATE_LOG_FILE, 'utf8'));
    }
    logs.unshift(updateLog);
    logs = logs.slice(0, 50);
    fs.writeFileSync(UPDATE_LOG_FILE, JSON.stringify(logs, null, 2));

    console.log('\n✅ Update Complete!');
    console.log(`📁 Properties saved to: ${PROPERTIES_FILE}`);
    console.log(`📋 Update log saved to: ${UPDATE_LOG_FILE}`);
    console.log(`\n📊 Final Statistics:`);
    console.log(`   Total properties: ${updateResult.totalProperties}`);
    console.log(`   Active listings: ${updateResult.activeProperties}`);
    console.log(`   Sold properties: ${updateResult.soldProperties}`);
    console.log(`   New this update: ${updateResult.newProperties}`);

    await browser.close();
    return updateResult;

  } catch (error) {
    console.error('❌ Update failed:', error);
    await browser.close();
    throw error;
  }
}

if (require.main === module) {
  updateProperties().catch(console.error);
}

module.exports = { updateProperties };