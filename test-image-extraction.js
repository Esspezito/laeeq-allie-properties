const puppeteer = require('puppeteer');

async function testImageExtraction() {
  console.log('🔍 Testing image extraction from Greeff property...');

  const browser = await puppeteer.launch({
    headless: false, // Show browser to see what we're extracting
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

    await new Promise(resolve => setTimeout(resolve, 5000));

    console.log('\n📸 Analyzing image structure...');

    const imageAnalysis = await page.evaluate(() => {
      // Find all images
      const allImages = document.querySelectorAll('img');
      const imageData = [];

      allImages.forEach((img, index) => {
        const src = img.src || img.dataset.src || img.dataset.original;
        const alt = img.alt;
        const className = img.className;
        const parentClass = img.parentElement ? img.parentElement.className : '';
        const isPropertyImage = src && (src.includes('cloudfront') || src.includes('greeff'));

        if (isPropertyImage) {
          imageData.push({
            index,
            src,
            alt,
            className,
            parentClass,
            position: img.getBoundingClientRect(),
            isVisible: img.offsetWidth > 0 && img.offsetHeight > 0
          });
        }
      });

      // Look for main/hero image specifically
      const heroSelectors = [
        '.hero-image img',
        '.main-image img',
        '.property-hero img',
        '.gallery-main img',
        '.featured-image img',
        '.primary-image img'
      ];

      let heroImage = null;
      for (const selector of heroSelectors) {
        const img = document.querySelector(selector);
        if (img && (img.src.includes('cloudfront') || img.src.includes('greeff'))) {
          heroImage = {
            src: img.src,
            selector,
            alt: img.alt,
            className: img.className
          };
          break;
        }
      }

      // Check for carousel or slider
      const carouselImages = [];
      const carouselSelectors = [
        '.carousel img',
        '.slider img',
        '.swiper img',
        '.gallery img'
      ];

      carouselSelectors.forEach(selector => {
        const imgs = document.querySelectorAll(selector);
        imgs.forEach(img => {
          const src = img.src || img.dataset.src;
          if (src && (src.includes('cloudfront') || src.includes('greeff'))) {
            carouselImages.push({
              src,
              selector,
              alt: img.alt
            });
          }
        });
      });

      return {
        totalPropertyImages: imageData.length,
        firstImage: imageData[0],
        heroImage,
        carouselImages: carouselImages.slice(0, 5),
        allImages: imageData.slice(0, 10) // First 10 for analysis
      };
    });

    console.log('\n📊 Image Analysis Results:');
    console.log(`Total property images found: ${imageAnalysis.totalPropertyImages}`);

    if (imageAnalysis.firstImage) {
      console.log('\n🎯 First Property Image:');
      console.log(`  URL: ${imageAnalysis.firstImage.src}`);
      console.log(`  Alt: ${imageAnalysis.firstImage.alt}`);
      console.log(`  Class: ${imageAnalysis.firstImage.className}`);
      console.log(`  Parent Class: ${imageAnalysis.firstImage.parentClass}`);
      console.log(`  Visible: ${imageAnalysis.firstImage.isVisible}`);
    }

    if (imageAnalysis.heroImage) {
      console.log('\n🌟 Hero/Main Image:');
      console.log(`  URL: ${imageAnalysis.heroImage.src}`);
      console.log(`  Selector: ${imageAnalysis.heroImage.selector}`);
      console.log(`  Alt: ${imageAnalysis.heroImage.alt}`);
    }

    if (imageAnalysis.carouselImages.length > 0) {
      console.log('\n🎠 Carousel/Gallery Images:');
      imageAnalysis.carouselImages.forEach((img, i) => {
        console.log(`  ${i + 1}. ${img.src}`);
      });
    }

    console.log('\n📝 All Property Images (first 10):');
    imageAnalysis.allImages.forEach((img, i) => {
      console.log(`  ${i + 1}. ${img.src.substring(0, 80)}...`);
    });

    // Wait a bit so we can see the page
    console.log('\n⏸️  Browser will stay open for 10 seconds for visual inspection...');
    await new Promise(resolve => setTimeout(resolve, 10000));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

testImageExtraction().catch(console.error);