const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeListingPageDirect() {
  console.log('🚀 Starting direct listing page scraper for La\'eeq Allie...');

  const browser = await puppeteer.launch({
    headless: false, // Show browser to handle any challenges
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  const allProperties = [];

  try {
    // Scrape Page 1
    console.log('📋 Loading page 1...');
    await page.goto('https://www.property24.com/for-sale/agency/greeff-christies-international-real-estate-head-office/laeeq-allie/430283', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    // Wait for listings to load
    await page.waitForSelector('.p24_regularTile', { timeout: 10000 });
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Extract properties from page 1
    const page1Properties = await page.evaluate(() => {
      const properties = [];
      const tiles = document.querySelectorAll('.p24_regularTile');

      tiles.forEach((tile, index) => {
        // Get the link
        const linkEl = tile.querySelector('a[href*="/for-sale/"]');
        const url = linkEl ? linkEl.href : '';

        // Get property ID
        const propertyId = url.split('/').pop();

        // Get the main image - this is CRITICAL for gallery view
        const imgEl = tile.querySelector('.p24_listingTileImage img, .p24_image img, img');
        let mainImage = '';
        if (imgEl) {
          mainImage = imgEl.src || imgEl.dataset.src || imgEl.dataset.original || '';
          // Ensure high quality
          if (mainImage && !mainImage.includes('NoImage')) {
            mainImage = mainImage.replace(/\/\d+x\d+/, '/640x480');
          }
        }

        // Get title
        const titleEl = tile.querySelector('.p24_title');
        const title = titleEl ? titleEl.textContent.trim() : '';

        // Get location
        const locationEl = tile.querySelector('.p24_location');
        const location = locationEl ? locationEl.textContent.trim() : 'Cape Town';

        // Get price
        const priceEl = tile.querySelector('.p24_price');
        let price = priceEl ? priceEl.textContent.trim() : 'POA';
        // Clean price format
        price = price.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

        // Get features (beds, baths, etc)
        let bedrooms = null, bathrooms = null, garages = null, area = null;
        const features = tile.querySelectorAll('.p24_featureDetails .p24_feature, .p24_icons span');
        features.forEach(feature => {
          const text = feature.textContent.trim();
          if (text.includes('Bedroom')) {
            const num = text.match(/(\d+)/);
            if (num) bedrooms = parseInt(num[1]);
          } else if (text.includes('Bathroom')) {
            const num = text.match(/(\d+)/);
            if (num) bathrooms = parseInt(num[1]);
          } else if (text.includes('Garage')) {
            const num = text.match(/(\d+)/);
            if (num) garages = parseInt(num[1]);
          } else if (text.includes('m²')) {
            const num = text.match(/(\d+)/);
            if (num) area = `${num[1]} m²`;
          }
        });

        // Get property type from title or URL
        let type = 'Apartment';
        const fullText = (title + ' ' + url).toLowerCase();
        if (fullText.includes('house')) type = 'House';
        else if (fullText.includes('townhouse')) type = 'Townhouse';
        else if (fullText.includes('penthouse')) type = 'Penthouse';
        else if (fullText.includes('studio')) type = 'Studio';

        properties.push({
          id: propertyId,
          title: title || `${type} in ${location}`,
          price: price,
          location: location,
          bedrooms: bedrooms,
          bathrooms: bathrooms,
          area: area,
          type: type,
          status: 'available',
          images: mainImage && !mainImage.includes('NoImage') ? [mainImage] : [],
          description: '',
          features: garages ? [`${garages} Garage${garages > 1 ? 's' : ''}`] : [],
          source: 'property24',
          sourceUrl: url
        });
      });

      return properties;
    });

    console.log(`✅ Found ${page1Properties.length} properties on page 1`);
    allProperties.push(...page1Properties);

    // Navigate to Page 2
    console.log('\n📋 Loading page 2...');
    await page.goto('https://www.property24.com/for-sale/agency/greeff-christies-international-real-estate-head-office/laeeq-allie/430283?page=2', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    await page.waitForSelector('.p24_regularTile', { timeout: 10000 });
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Extract properties from page 2
    const page2Properties = await page.evaluate(() => {
      const properties = [];
      const tiles = document.querySelectorAll('.p24_regularTile');

      tiles.forEach((tile, index) => {
        // Get the link
        const linkEl = tile.querySelector('a[href*="/for-sale/"]');
        const url = linkEl ? linkEl.href : '';

        // Get property ID
        const propertyId = url.split('/').pop();

        // Get the main image
        const imgEl = tile.querySelector('.p24_listingTileImage img, .p24_image img, img');
        let mainImage = '';
        if (imgEl) {
          mainImage = imgEl.src || imgEl.dataset.src || imgEl.dataset.original || '';
          // Ensure high quality
          if (mainImage && !mainImage.includes('NoImage')) {
            mainImage = mainImage.replace(/\/\d+x\d+/, '/640x480');
          }
        }

        // Get title
        const titleEl = tile.querySelector('.p24_title');
        const title = titleEl ? titleEl.textContent.trim() : '';

        // Get location
        const locationEl = tile.querySelector('.p24_location');
        const location = locationEl ? locationEl.textContent.trim() : 'Cape Town';

        // Get price
        const priceEl = tile.querySelector('.p24_price');
        let price = priceEl ? priceEl.textContent.trim() : 'POA';
        price = price.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

        // Get features
        let bedrooms = null, bathrooms = null, garages = null, area = null;
        const features = tile.querySelectorAll('.p24_featureDetails .p24_feature, .p24_icons span');
        features.forEach(feature => {
          const text = feature.textContent.trim();
          if (text.includes('Bedroom')) {
            const num = text.match(/(\d+)/);
            if (num) bedrooms = parseInt(num[1]);
          } else if (text.includes('Bathroom')) {
            const num = text.match(/(\d+)/);
            if (num) bathrooms = parseInt(num[1]);
          } else if (text.includes('Garage')) {
            const num = text.match(/(\d+)/);
            if (num) garages = parseInt(num[1]);
          } else if (text.includes('m²')) {
            const num = text.match(/(\d+)/);
            if (num) area = `${num[1]} m²`;
          }
        });

        // Get property type
        let type = 'Apartment';
        const fullText = (title + ' ' + url).toLowerCase();
        if (fullText.includes('house')) type = 'House';
        else if (fullText.includes('townhouse')) type = 'Townhouse';
        else if (fullText.includes('penthouse')) type = 'Penthouse';
        else if (fullText.includes('studio')) type = 'Studio';

        properties.push({
          id: propertyId,
          title: title || `${type} in ${location}`,
          price: price,
          location: location,
          bedrooms: bedrooms,
          bathrooms: bathrooms,
          area: area,
          type: type,
          status: 'available',
          images: mainImage && !mainImage.includes('NoImage') ? [mainImage] : [],
          description: '',
          features: garages ? [`${garages} Garage${garages > 1 ? 's' : ''}`] : [],
          source: 'property24',
          sourceUrl: url
        });
      });

      return properties;
    });

    console.log(`✅ Found ${page2Properties.length} properties on page 2`);
    allProperties.push(...page2Properties);

    // Now try to get more images for each property by visiting them individually
    console.log('\n🖼️  Attempting to extract additional images for each property...');

    for (let i = 0; i < allProperties.length; i++) {
      const property = allProperties[i];
      console.log(`[${i + 1}/${allProperties.length}] Checking property ${property.id}...`);

      try {
        await page.goto(property.sourceUrl, {
          waitUntil: 'domcontentloaded',
          timeout: 30000
        });

        await new Promise(resolve => setTimeout(resolve, 2000));

        // Try to extract gallery images
        const additionalImages = await page.evaluate(() => {
          const images = [];

          // Try different selectors for gallery images
          const selectors = [
            '.p24_galleryThumbnails img',
            '.p24_thumbnails img',
            '.p24_gallery img',
            '[data-gallery] img',
            '.gallery img'
          ];

          for (const selector of selectors) {
            const imgs = document.querySelectorAll(selector);
            imgs.forEach(img => {
              let src = img.src || img.dataset.src || img.dataset.original;
              if (src && !src.includes('NoImage') && !src.includes('placeholder')) {
                src = src.replace(/\/\d+x\d+/, '/640x480');
                if (!images.includes(src)) {
                  images.push(src);
                }
              }
            });
          }

          return images;
        });

        if (additionalImages.length > 0) {
          // Keep the first image from listing page as primary
          const primaryImage = property.images[0];
          property.images = [primaryImage, ...additionalImages.filter(img => img !== primaryImage)];
          console.log(`   ✅ Found ${property.images.length} images`);
        }

      } catch (error) {
        console.log(`   ⚠️  Could not load additional images`);
      }

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`\n✅ Scraping complete!`);
    console.log(`📊 Total properties: ${allProperties.length}`);

    // Add agent info to all properties
    allProperties.forEach(prop => {
      prop.agentName = "La'eeq Allie";
      prop.agentContact = "+27 82 123 4567";
    });

    // Save the data
    const result = {
      timestamp: new Date().toISOString(),
      agent: "La'eeq Allie",
      company: "Greeff Christie's International Real Estate",
      totalProperties: allProperties.length,
      properties: allProperties
    };

    fs.writeFileSync('property24-listing-direct.json', JSON.stringify(result, null, 2));
    console.log('📁 Data saved to: property24-listing-direct.json');

    // Keep browser open for 5 seconds to review
    await new Promise(resolve => setTimeout(resolve, 5000));

    await browser.close();
    return result;

  } catch (error) {
    console.error('❌ Error:', error);
    await browser.close();
    throw error;
  }
}

// Run the scraper
if (require.main === module) {
  scrapeListingPageDirect()
    .then(result => {
      console.log('\n✨ Done! Now update mockData.ts with the scraped data.');
    })
    .catch(console.error);
}

module.exports = { scrapeListingPageDirect };