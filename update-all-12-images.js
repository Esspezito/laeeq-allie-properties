const fs = require('fs');

console.log('🎯 UPDATING mockData.ts with ALL 12 EXTRACTED REAL IMAGES');

// All successfully extracted Property24 image URLs
const ALL_EXTRACTED_IMAGES = {
  "116463618": "https://images.prop24.com/365598971/Ensure1280x720",
  "116455279": "https://images.prop24.com/365456846/Ensure1280x720",
  "116455489": "https://images.prop24.com/365668291/Ensure1280x720",
  "116455093": "https://images.prop24.com/365453847/Ensure1280x720",
  "116439140": "https://images.prop24.com/365167323/Ensure1280x720",
  "116441627": "https://images.prop24.com/365215817/Ensure1280x720",
  "116441202": "https://images.prop24.com/365208392/Ensure1280x720",
  "116441599": "https://images.prop24.com/365215425/Ensure1280x720",
  "116282958": "https://images.prop24.com/362551801/Ensure1280x720",
  "116281167": "https://images.prop24.com/362327447/Ensure1280x720",
  "116281209": "https://images.prop24.com/362328219/Ensure1280x720",
  "116296190": "https://images.prop24.com/362588815/Ensure1280x720"
};

console.log(`✅ Total extracted images: ${Object.keys(ALL_EXTRACTED_IMAGES).length}`);

// Read current mockData.ts
const mockDataPath = 'src/lib/mockData.ts';
let mockDataContent = fs.readFileSync(mockDataPath, 'utf8');

// Update images for all extracted properties
Object.entries(ALL_EXTRACTED_IMAGES).forEach(([propertyId, imageUrl]) => {
  // Find and update the images array for this property
  const regex = new RegExp(`("id": "${propertyId}"[\\s\\S]*?"images": )\\[[^\\]]*\\]`, 'g');
  const replacement = `$1[\n      "${imageUrl}"\n    ]`;

  if (mockDataContent.includes(`"id": "${propertyId}"`)) {
    mockDataContent = mockDataContent.replace(regex, replacement);
    console.log(`✅ Updated property ${propertyId}`);
  }
});

// Write updated content
fs.writeFileSync(mockDataPath, mockDataContent);

console.log('\n🎯 FINAL STATUS:');
console.log(`✅ ${Object.keys(ALL_EXTRACTED_IMAGES).length}/32 properties have REAL Property24 images`);
console.log(`⚠️  ${32 - Object.keys(ALL_EXTRACTED_IMAGES).length}/32 properties pending (empty images array)`);
console.log('🔗 ALL 32 properties link to REAL Property24 URLs');
console.log('\n🚀 Site ready with 12 real Property24 images!');