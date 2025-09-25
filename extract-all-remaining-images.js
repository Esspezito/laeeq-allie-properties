const fs = require('fs');

console.log('🎯 EXTRACTING ALL REAL Property24 IMAGE URLS');
console.log('📋 Progress so far:');

// Extracted so far via MCP Puppeteer
const EXTRACTED_REAL_IMAGES = {
  "116463618": "https://images.prop24.com/365598971/Ensure1280x720", // ✅ EXTRACTED
  "116455279": "https://images.prop24.com/365456846/Ensure1280x720", // ✅ EXTRACTED
  "116455489": "https://images.prop24.com/365668291/Ensure1280x720", // ✅ EXTRACTED
  "116455093": "https://images.prop24.com/365453847/Ensure1280x720", // ✅ EXTRACTED
  "116439140": "https://images.prop24.com/365167323/Ensure1280x720", // ✅ EXTRACTED
  "116441627": "https://images.prop24.com/365215817/Ensure1280x720", // ✅ EXTRACTED
  "116441202": "https://images.prop24.com/365208392/Ensure1280x720", // ✅ EXTRACTED
};

// ALL 32 property URLs (VERIFIED REAL)
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

console.log(`📊 PROGRESS: ${Object.keys(EXTRACTED_REAL_IMAGES).length}/32 properties extracted`);
console.log('✅ EXTRACTED SO FAR:');
Object.entries(EXTRACTED_REAL_IMAGES).forEach(([id, url]) => {
  console.log(`   ${id}: ${url}`);
});

console.log('\n📋 REMAINING PROPERTIES TO EXTRACT:');
const remainingProperties = ALL_32_PROPERTIES.filter(url => {
  const propertyId = url.split('/').pop();
  return !EXTRACTED_REAL_IMAGES[propertyId];
});

console.log(`🔄 NEED TO EXTRACT: ${remainingProperties.length} remaining properties`);

remainingProperties.forEach((url, index) => {
  const propertyId = url.split('/').pop();
  console.log(`⚠️  [${index + 1}/${remainingProperties.length}] ${propertyId}: ${url}`);
});

console.log('\n📝 NEXT STEPS FOR CLAUDE:');
console.log('1. Use MCP Puppeteer to navigate to each remaining property URL');
console.log('2. Extract first image URL using the gallery extraction script');
console.log('3. Record each result in EXTRACTED_REAL_IMAGES object');
console.log('4. Update mockData.ts with ALL 32 real image URLs');
console.log('5. Deploy final solution');

module.exports = { EXTRACTED_REAL_IMAGES, remainingProperties };