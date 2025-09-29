const fs = require('fs');

console.log('🎯 SYSTEMATICALLY EXTRACTING ALL REAL PROPERTY24 PRICES');

// All Property24 URLs from mockData.ts
const PROPERTY_URLS = [
  { id: "116463618", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116463618", extractedPrice: "R 2 750 000" },
  { id: "116455279", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116455279", extractedPrice: "R 12 995 000" },
  { id: "116455489", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116455489", extractedPrice: "R 12 995 000" },
  { id: "116455093", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116455093" },
  { id: "116439140", url: "https://www.property24.com/for-sale/gardens/cape-town/western-cape/9145/116439140" },
  { id: "116441627", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116441627" },
  { id: "116441202", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116441202" },
  { id: "116441599", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116441599" },
  { id: "116280718", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116280718" },
  { id: "116282958", url: "https://www.property24.com/for-sale/woodstock/cape-town/western-cape/10164/116282958" },
  { id: "116281167", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116281167" },
  { id: "116281209", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116281209" },
  { id: "116296190", url: "https://www.property24.com/for-sale/gardens/cape-town/western-cape/9145/116296190" },
  { id: "116280871", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116280871" },
  { id: "116226593", url: "https://www.property24.com/for-sale/gardens/cape-town/western-cape/9145/116226593" },
  { id: "116283204", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116283204" },
  { id: "116220646", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116220646" },
  { id: "116200162", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116200162" },
  { id: "116216202", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116216202" },
  { id: "116155994", url: "https://www.property24.com/for-sale/woodstock/cape-town/western-cape/10164/116155994" },
  { id: "115943244", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115943244" },
  { id: "115629416", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115629416" },
  { id: "115843150", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115843150" },
  { id: "115437832", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115437832" },
  { id: "115285887", url: "https://www.property24.com/for-sale/gardens/cape-town/western-cape/9145/115285887" },
  { id: "115488888", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115488888" },
  { id: "115311090", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115311090" },
  { id: "114942423", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/114942423" }
];

console.log(`📋 Need to extract prices for ${PROPERTY_URLS.filter(p => !p.extractedPrice).length} remaining properties`);

// Properties that need price extraction
const needExtraction = PROPERTY_URLS.filter(p => !p.extractedPrice);

console.log('\n📍 Properties needing price extraction:');
needExtraction.forEach((prop, index) => {
  console.log(`${index + 1}. Property ${prop.id} - ${prop.url}`);
});

console.log('\n✅ NEXT STEPS:');
console.log('1. Continue systematic extraction with MCP Puppeteer');
console.log('2. Use 60-75 second intervals between requests');
console.log('3. Update mockData.ts as each price is extracted');
console.log('4. Current progress: 3/28 properties completed');

// Show the extracted prices we have so far
console.log('\n🎯 EXTRACTED PRICES SO FAR:');
PROPERTY_URLS.filter(p => p.extractedPrice).forEach(prop => {
  console.log(`✅ ${prop.id}: ${prop.extractedPrice}`);
});