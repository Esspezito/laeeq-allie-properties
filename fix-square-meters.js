const fs = require('fs');

console.log('🏠 FIXING SQUARE METERS FROM PROPERTY24 LISTINGS');
console.log('=' .repeat(70));

// Correct square meters extracted from Property24 screenshots
const CORRECT_AREAS = {
  // From screenshot - exact values from Property24
  "116463618": "91 m²",   // R 2 750 000 - 2 Bedroom Apartment Cape Town City Centre
  "116455279": "173 m²",  // R 12 995 000 - 3 Bedroom Apartment Cape Town City Centre
  "116455489": "172 m²",  // R 12 995 000 - 3 Bedroom Apartment Cape Town City Centre
  "116455093": "88 m²",   // R 4 500 000 - 2 Bedroom Apartment Cape Town City Centre
  "116439140": "92 m²",   // R 6 250 000 - 2 Bedroom Apartment Gardens
  "116441627": "52 m²",   // R 3 300 000 - 0.5 Bedroom Apartment Cape Town City Centre
  "116441202": "39 m²",   // R 2 375 000 - 0.5 Bedroom Apartment Cape Town City Centre
  "116441599": "44 m²",   // R 3 300 000 - 0.5 Bedroom Apartment Cape Town City Centre
  "116280718": "Not specified", // R 2 995 000 - Cape Town City Centre
  "116282958": "145 m²",  // R 2 695 000 - 2 Bedroom House Woodstock
  "116281167": "49 m²",   // R 3 995 000 - 1 Bedroom Apartment Cape Town City Centre
  "116281209": "47 m²",   // R 3 995 000 - 1 Bedroom Apartment Cape Town City Centre
  "116296190": "49 m²",   // R 2 199 999 - 1 Bedroom Apartment Gardens (UNDER OFFER)
  "116280871": "63 m²",   // R 6 950 000 - 2 Bedroom Apartment Cape Town City Centre
  "116226593": "89 m²",   // R 4 195 000 - 2 Bedroom Apartment Gardens
  "116283204": "25 m²",   // R 1 950 000 - 0.5 Bedroom Apartment Cape Town City Centre
  "116220646": "42 m²",   // R 1 699 999 - 1 Bedroom Apartment Cape Town City Centre
  "116200162": "53 m²",   // R 1 799 999 - 1 Bedroom Apartment Cape Town City Centre
  "116216202": "61 m²",   // R 1 850 000 - 1 Bedroom Apartment Cape Town City Centre (UNDER OFFER)

  // Additional properties that may be on page 2
  "116155994": "Not specified",  // Needs to check page 2
  "115943244": "Not specified",  // Needs to check page 2
  "115629416": "Not specified",  // Needs to check page 2
  "115843150": "Not specified",  // Needs to check page 2
  "115437832": "Not specified",  // Needs to check page 2
  "115285887": "Not specified",  // Needs to check page 2
  "115488888": "Not specified",  // Needs to check page 2
  "115311090": "Not specified",  // Needs to check page 2
  "114942423": "Not specified"   // Needs to check page 2
};

console.log('\n📊 PROPERTIES WITH CORRECT SQUARE METERS:');
Object.entries(CORRECT_AREAS).forEach(([id, area]) => {
  if (area !== "Not specified") {
    console.log(`   Property ${id}: ${area}`);
  }
});

// Read current mockData.ts
let mockDataContent = fs.readFileSync('src/lib/mockData.ts', 'utf8');

let updatedCount = 0;
let notSpecifiedCount = 0;

// Update areas for all properties
Object.entries(CORRECT_AREAS).forEach(([propertyId, correctArea]) => {
  // Find the property and update its area
  const areaRegex = new RegExp(`("id": "${propertyId}"[\\s\\S]*?"area": ")[^"]*(")`);

  if (mockDataContent.includes(`"id": "${propertyId}"`)) {
    const before = mockDataContent;

    if (correctArea !== "Not specified") {
      mockDataContent = mockDataContent.replace(areaRegex, `$1${correctArea}$2`);

      if (before !== mockDataContent) {
        updatedCount++;
        console.log(`✅ Updated property ${propertyId} area to ${correctArea}`);
      }
    } else {
      notSpecifiedCount++;
    }
  }
});

// Write the updated content
fs.writeFileSync('src/lib/mockData.ts', mockDataContent);

console.log('\n📊 UPDATE SUMMARY:');
console.log(`   Properties updated: ${updatedCount}`);
console.log(`   Properties needing page 2 check: ${notSpecifiedCount}`);
console.log('\n✅ Square meters updated for visible properties!');
console.log('⚠️  Some properties may be on page 2 - need to check those separately');