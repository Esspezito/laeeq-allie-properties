// Remaining properties to extract prices for
const REMAINING_PROPERTIES = [
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

console.log('📋 REMAINING PROPERTY EXTRACTION');
console.log('================================');
console.log(`Total remaining: ${REMAINING_PROPERTIES.length} properties`);
console.log('\n📍 Properties to extract:');

REMAINING_PROPERTIES.forEach((prop, index) => {
  console.log(`${index + 1}. Property ${prop.id}`);
  console.log(`   URL: ${prop.url}`);
});

console.log('\n⏱️ Extraction Plan:');
console.log('- Use 45-60 second intervals between requests');
console.log('- Continue with MCP Puppeteer extraction');
console.log('- Update mockData.ts after each price extracted');
console.log(`- Estimated time: ~${Math.round(REMAINING_PROPERTIES.length * 1)} minutes`);

console.log('\n✅ ALREADY EXTRACTED (9/28):');
const extractedPrices = [
  { id: "116463618", price: "R 2 750 000" },
  { id: "116455279", price: "R 12 995 000" },
  { id: "116455489", price: "R 12 995 000" },
  { id: "116455093", price: "R 4 500 000" },
  { id: "116439140", price: "R 6 250 000" },
  { id: "116441627", price: "R 3 300 000" },
  { id: "116441202", price: "R 2 375 000" },
  { id: "116441599", price: "R 3 300 000" },
  { id: "116280718", price: "R 2 995 000" }
];

extractedPrices.forEach(prop => {
  console.log(`✅ ${prop.id}: ${prop.price}`);
});