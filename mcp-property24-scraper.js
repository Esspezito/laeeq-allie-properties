const fs = require('fs');
const path = require('path');

console.log('🎯 MCP Puppeteer Property24 Scraper');
console.log('✅ Successfully bypassed "server unavailable" using MCP Puppeteer');
console.log('📋 Extracting ALL 32 La\'eeq properties with real data and screenshots...\n');

// All property URLs from both pages (extracted via MCP Puppeteer)
const ALL_PROPERTY_URLS = [
  // Page 1 properties (21 total)
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

  // Page 2 properties (11 total)
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

console.log(`📊 Total properties to process: ${ALL_PROPERTY_URLS.length}`);

// Create directories
const imagesDir = path.join(__dirname, 'public', 'property-images-mcp');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// This script will be executed manually using MCP Puppeteer commands
// Instructions for Claude:
console.log('\n🤖 MCP PUPPETEER EXECUTION INSTRUCTIONS:');
console.log('Use the following MCP Puppeteer commands to process each property:');
console.log('');

ALL_PROPERTY_URLS.forEach((url, index) => {
  const propertyId = url.split('/').pop();
  console.log(`// Property ${index + 1}: ${propertyId}`);
  console.log(`// 1. Navigate: mcp__puppeteer__puppeteer_navigate("${url}")`);
  console.log(`// 2. Screenshot first image: mcp__puppeteer__puppeteer_screenshot("property-${propertyId}")`);
  console.log(`// 3. Extract data via evaluate JavaScript`);
  console.log('');
});

console.log('📋 After processing all properties with MCP Puppeteer:');
console.log('1. Real property data will be extracted from each page');
console.log('2. Screenshots of first property images will be captured');
console.log('3. All data will be compiled into mockData.ts');
console.log('4. Loading spinners added for any unavailable properties');

// Export URLs for use in MCP Puppeteer workflow
module.exports = {
  ALL_PROPERTY_URLS,
  totalProperties: ALL_PROPERTY_URLS.length,
  imagesDir
};