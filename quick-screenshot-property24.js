const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');

puppeteer.use(StealthPlugin());

// First 6 properties with actual images
const PROPERTY_URLS = [
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116455279",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116455489",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116455093",
  "https://www.property24.com/for-sale/gardens/cape-town/western-cape/9145/116439140",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116441627",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116441202"
];

async function captureProperty24Screenshots() {
  console.log('📸 Quick screenshot capture of La\'eeq\'s Property24 listings...');

  const screenshotsDir = path.join(__dirname, 'public', 'property24-screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1920, height: 1080 }
  });

  const page = await browser.newPage();
  const results = [];

  for (let i = 0; i < PROPERTY_URLS.length; i++) {
    const url = PROPERTY_URLS[i];
    const propertyId = url.split('/').pop();

    console.log(`[${i + 1}/${PROPERTY_URLS.length}] Capturing ${propertyId}...`);

    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Take full screenshot
      const screenshotPath = `/property24-screenshots/property_${propertyId}.jpg`;
      const fullPath = path.join(screenshotsDir, `property_${propertyId}.jpg`);

      await page.screenshot({
        path: fullPath,
        quality: 90,
        clip: { x: 0, y: 200, width: 1920, height: 800 }
      });

      results.push({
        id: propertyId,
        screenshot: screenshotPath
      });

      console.log(`   ✅ Screenshot saved`);

    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  fs.writeFileSync('property24-screenshots-quick.json', JSON.stringify(results, null, 2));
  console.log(`\n✅ Captured ${results.length} screenshots`);

  await browser.close();
}

captureProperty24Screenshots().catch(console.error);