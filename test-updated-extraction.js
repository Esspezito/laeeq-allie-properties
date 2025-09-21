const puppeteer = require('puppeteer');

async function testUpdatedImageExtraction() {
  console.log('🔍 Testing UPDATED image extraction from Greeff property...');

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1920, height: 1080 }
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  // Test with a sample property
  const testUrl = 'https://www.greeff.co.za/results/residential/for-sale/cape-town/cape-town-city-centre/penthouse/2906252/';

  try {
    console.log(`📋 Loading: ${testUrl}`);
    await page.goto(testUrl, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('\n📸 Testing NEW image extraction logic...');

    const extractedImages = await page.evaluate(() => {
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

      return images.slice(0, 10); // Return first 10 for testing
    });

    console.log('\n✅ UPDATED Image Extraction Results:');
    console.log(`Total images extracted: ${extractedImages.length}`);

    if (extractedImages.length > 0) {
      console.log('\n🎯 First 5 Images (these should be property photos, not logos):');
      extractedImages.slice(0, 5).forEach((img, i) => {
        console.log(`  ${i + 1}. ${img}`);
        console.log(`     - Has /residential/: ${img.includes('/residential/')}`);
        console.log(`     - Has logo: ${img.includes('logo')}`);
        console.log(`     - Has theme-settings: ${img.includes('theme-settings')}`);
      });

      console.log('\n🌟 FIRST IMAGE (main property photo):');
      console.log(`${extractedImages[0]}`);
    } else {
      console.log('❌ No images extracted with new logic!');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

testUpdatedImageExtraction().catch(console.error);