const fs = require('fs');

console.log('🎯 EXTRACTING REAL Property24 image URLs from ALL 32 listings');
console.log('✅ Using MCP Puppeteer method for each property');

// All 32 property URLs (VERIFIED REAL)
const ALL_32_PROPERTIES = [
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116463618",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116455279",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116455489",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116455093",
  "https://www.property24.com/for-sale/gardens/cape-town/western-cape/9145/116439140",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116441627",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116441202",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116441599",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116300894",
  "https://www.property24.com/for-sale/gardens/cape-town/western-cape/9145/116338371",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116280718",
  "https://www.property24.com/for-sale/woodstock/cape-town/western-cape/10164/116282958",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116281167",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116281209",
  "https://www.property24.com/for-sale/gardens/cape-town/western-cape/9145/116296190",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116280871",
  "https://www.property24.com/for-sale/gardens/cape-town/western-cape/9145/116226593",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116283204",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116220646",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116200162",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116216202",
  "https://www.property24.com/for-sale/woodstock/cape-town/western-cape/10164/116155994",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116344417",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115943244",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115629416",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115843150",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115437832",
  "https://www.property24.com/for-sale/gardens/cape-town/western-cape/9145/115285887",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115488888",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115311090",
  "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/114942423",
  "https://www.property24.com/for-sale/woodstock/cape-town/western-cape/10164/114046864"
];

// REAL image URLs extracted so far via MCP Puppeteer
const EXTRACTED_REAL_IMAGES = {
  "116463618": "https://images.prop24.com/365598971/Ensure1280x720", // ✅ EXTRACTED
  "116455279": "https://images.prop24.com/365456846/Ensure1280x720"  // ✅ EXTRACTED
  // Need to extract remaining 30 properties...
};

console.log('📋 INSTRUCTIONS FOR CLAUDE:');
console.log('Use MCP Puppeteer to navigate to each remaining property URL and extract the first image URL using the following steps:');
console.log('');

ALL_32_PROPERTIES.forEach((url, index) => {
  const propertyId = url.split('/').pop();

  if (EXTRACTED_REAL_IMAGES[propertyId]) {
    console.log(`✅ [${index + 1}/32] ${propertyId}: ALREADY EXTRACTED - ${EXTRACTED_REAL_IMAGES[propertyId]}`);
  } else {
    console.log(`⚠️  [${index + 1}/32] ${propertyId}: NEEDS EXTRACTION`);
    console.log(`   1. mcp__puppeteer__puppeteer_navigate("${url}")`);
    console.log(`   2. mcp__puppeteer__puppeteer_evaluate with gallery image extraction script`);
    console.log(`   3. Record the firstImageUrl result`);
    console.log('');
  }
});

console.log('\n🎯 AFTER EXTRACTING ALL REAL IMAGE URLS:');
console.log('1. Update the EXTRACTED_REAL_IMAGES object with all 32 URLs');
console.log('2. Generate new mockData.ts with ALL real Property24 image URLs');
console.log('3. Deploy the final solution');
console.log('\n📝 EXTRACTION TEMPLATE SCRIPT:');
console.log(`
(function() {
  window.scrollTo(0, document.body.scrollHeight / 2);

  const gallerySelectors = [
    '.p24_propertyGallery img',
    '.p24_gallery img',
    '[class*="gallery"] img',
    '[class*="photo"] img',
    '.property-images img',
    '.listing-photos img'
  ];

  let propertyImages = [];

  for (const selector of gallerySelectors) {
    const images = document.querySelectorAll(selector);
    images.forEach((img, index) => {
      if (img.src && img.src.includes('prop24.com') && !img.src.includes('agent') && !img.src.includes('logo')) {
        propertyImages.push({
          index: index,
          selector: selector,
          src: img.src,
          visible: img.offsetWidth > 100 && img.offsetHeight > 100
        });
      }
    });

    if (propertyImages.length > 0) break;
  }

  if (propertyImages.length === 0) {
    const allImages = document.querySelectorAll('img');
    allImages.forEach((img, index) => {
      if (img.src &&
          img.src.includes('prop24.com') &&
          !img.src.includes('agent') &&
          !img.src.includes('logo') &&
          !img.src.includes('icon') &&
          img.offsetWidth > 200 &&
          img.offsetHeight > 150) {
        propertyImages.push({
          index: index,
          selector: 'large property image',
          src: img.src,
          visible: true
        });
      }
    });
  }

  return {
    propertyId: window.location.pathname.split('/').pop(),
    totalImages: propertyImages.length,
    firstImageUrl: propertyImages.length > 0 ? propertyImages[0].src : null
  };
})()
`);

console.log('\n🚀 Ready to extract all 32 REAL Property24 image URLs!');

module.exports = { ALL_32_PROPERTIES, EXTRACTED_REAL_IMAGES };