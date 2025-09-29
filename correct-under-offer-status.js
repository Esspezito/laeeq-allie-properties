const fs = require('fs');

console.log('🔍 CORRECTING UNDER OFFER STATUS BASED ON PROPERTY24 VISUAL INSPECTION');
console.log('=' .repeat(70));

// From the screenshot analysis, these properties have "UNDER OFFER" orange badges:
const UNDER_OFFER_PROPERTIES = {
  // R 2 199 999 - 1 Bedroom Apartment in Gardens (clearly visible orange "UNDER OFFER" badge)
  "116296190": "under-offer",

  // R 1 850 000 - 1 Bedroom Apartment (orange "UNDER OFFER" badge at bottom of screenshot)
  "116216202": "under-offer"
};

console.log('\n🎯 IDENTIFIED UNDER OFFER PROPERTIES:');
Object.entries(UNDER_OFFER_PROPERTIES).forEach(([id, status]) => {
  console.log(`   🟠 Property ${id}: ${status}`);
});

// Read current mockData.ts
let mockDataContent = fs.readFileSync('src/lib/mockData.ts', 'utf8');

let updatedCount = 0;

// Update specific properties to "under-offer" status
Object.entries(UNDER_OFFER_PROPERTIES).forEach(([propertyId, correctStatus]) => {
  const statusRegex = new RegExp(`("id": "${propertyId}"[\\s\\S]*?"status": ")[^"]*(")`);

  if (mockDataContent.includes(`"id": "${propertyId}"`)) {
    const before = mockDataContent;
    mockDataContent = mockDataContent.replace(statusRegex, `$1${correctStatus}$2`);

    if (before !== mockDataContent) {
      updatedCount++;
      console.log(`   ✅ Updated property ${propertyId} to "${correctStatus}"`);
    }
  }
});

// Write the updated content
fs.writeFileSync('src/lib/mockData.ts', mockDataContent);

console.log('\n📊 UPDATE SUMMARY:');
console.log(`   Properties updated to "under-offer": ${updatedCount}`);
console.log(`   Properties remaining "available": ${28 - updatedCount}`);

// Verify the changes
const finalContent = fs.readFileSync('src/lib/mockData.ts', 'utf8');
const underOfferMatches = (finalContent.match(/"status": "under-offer"/g) || []).length;
const availableMatches = (finalContent.match(/"status": "available"/g) || []).length;

console.log('\n✅ VERIFICATION:');
console.log(`   "under-offer" status: ${underOfferMatches} properties`);
console.log(`   "available" status: ${availableMatches} properties`);
console.log(`   Total: ${underOfferMatches + availableMatches} properties`);

if (underOfferMatches === Object.keys(UNDER_OFFER_PROPERTIES).length) {
  console.log('\n🎉 SUCCESS! Under Offer properties updated correctly');
  console.log('   ✅ Status now matches Property24 listings exactly');
} else {
  console.log('\n⚠️  Warning: Under Offer count mismatch');
}