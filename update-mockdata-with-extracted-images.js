const fs = require('fs');
const path = require('path');

console.log('🎯 UPDATING mockData.ts with ALL extracted real Property24 images');

// All extracted Property24 image URLs so far
const EXTRACTED_REAL_IMAGES = {
  "116463618": "https://images.prop24.com/365598971/Ensure1280x720", // ✅ EXTRACTED
  "116455279": "https://images.prop24.com/365456846/Ensure1280x720", // ✅ EXTRACTED
  "116455489": "https://images.prop24.com/365668291/Ensure1280x720", // ✅ EXTRACTED
  "116455093": "https://images.prop24.com/365453847/Ensure1280x720", // ✅ EXTRACTED
  "116439140": "https://images.prop24.com/365167323/Ensure1280x720", // ✅ EXTRACTED
  "116441627": "https://images.prop24.com/365215817/Ensure1280x720", // ✅ EXTRACTED
  "116441202": "https://images.prop24.com/365208392/Ensure1280x720", // ✅ EXTRACTED
  "116441599": "https://images.prop24.com/365215425/Ensure1280x720", // ✅ EXTRACTED
};

// Properties still needing extraction (24 remaining)
const PENDING_PROPERTIES = [
  "116300894", "116338371", "116280718", "116282958", "116281167",
  "116281209", "116296190", "116280871", "116226593", "116283204",
  "116220646", "116200162", "116216202", "116155994", "116344417",
  "115943244", "115629416", "115843150", "115437832", "115285887",
  "115488888", "115311090", "114942423", "114046864"
];

console.log(`✅ EXTRACTED: ${Object.keys(EXTRACTED_REAL_IMAGES).length}/32 properties`);
console.log(`⚠️  PENDING: ${PENDING_PROPERTIES.length}/32 properties`);

// Read current mockData.ts
const mockDataPath = path.join(__dirname, 'src/lib/mockData.ts');
const currentContent = fs.readFileSync(mockDataPath, 'utf8');

// Update the images arrays for extracted properties
let updatedContent = currentContent;

Object.entries(EXTRACTED_REAL_IMAGES).forEach(([propertyId, imageUrl]) => {
  // Find the property by ID and update its images array
  const propertyRegex = new RegExp(`("id": "${propertyId}"[\\s\\S]*?)"images": \\[[\\s\\S]*?\\]`, 'g');
  const replacement = `$1"images": [\n      "${imageUrl}"\n    ]`;

  if (propertyRegex.test(updatedContent)) {
    updatedContent = updatedContent.replace(propertyRegex, replacement);
    console.log(`✅ Updated property ${propertyId} with real image: ${imageUrl}`);
  } else {
    console.log(`⚠️  Could not find property ${propertyId} in mockData.ts`);
  }
});

// Write updated content
fs.writeFileSync(mockDataPath, updatedContent);

console.log('\n🎯 MOCKDATA.TS UPDATED with extracted real images!');
console.log(`📊 Properties with real images: ${Object.keys(EXTRACTED_REAL_IMAGES).length}/32`);
console.log('📋 NEXT: Continue extracting remaining 24 properties...');

PENDING_PROPERTIES.forEach((id, index) => {
  console.log(`   ⚠️  [${index + 1}/24] Property ${id} - NEEDS EXTRACTION`);
});

module.exports = { EXTRACTED_REAL_IMAGES, PENDING_PROPERTIES };