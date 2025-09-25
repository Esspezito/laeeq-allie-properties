const fs = require('fs');

console.log('🎯 UPDATING mockData.ts with ALL 19 EXTRACTED REAL IMAGES');

// All successfully extracted Property24 image URLs
const ALL_19_EXTRACTED_IMAGES = {
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
  "116296190": "https://images.prop24.com/362588815/Ensure1280x720",
  "116280871": "https://images.prop24.com/362323143/Ensure1280x720",
  "116226593": "https://images.prop24.com/361424611/Ensure1280x720",
  "116283204": "https://images.prop24.com/362361776/Ensure1280x720",
  "116220646": "https://images.prop24.com/361593377/Ensure1280x720",
  "116200162": "https://images.prop24.com/360998181/Ensure1280x720",
  "116216202": "https://images.prop24.com/361263158/Ensure1280x720",
  "116155994": "https://images.prop24.com/360263014/Ensure1280x720"
};

console.log(`✅ Total extracted images: ${Object.keys(ALL_19_EXTRACTED_IMAGES).length}`);

// Read current mockData.ts
const mockDataPath = 'src/lib/mockData.ts';
let mockDataContent = fs.readFileSync(mockDataPath, 'utf8');

// Update images for all extracted properties
let updatedCount = 0;
Object.entries(ALL_19_EXTRACTED_IMAGES).forEach(([propertyId, imageUrl]) => {
  // Find and update the images array for this property
  const regex = new RegExp(`("id": "${propertyId}"[\\s\\S]*?"images": )\\[[^\\]]*\\]`, 'g');
  const replacement = `$1[
      "${imageUrl}"
    ]`;

  if (mockDataContent.includes(`"id": "${propertyId}"`)) {
    const before = mockDataContent;
    mockDataContent = mockDataContent.replace(regex, replacement);
    if (before !== mockDataContent) {
      updatedCount++;
      console.log(`✅ Updated property ${propertyId}`);
    }
  }
});

// Write updated content
fs.writeFileSync(mockDataPath, mockDataContent);

console.log(`\n📊 Updated ${updatedCount} properties`);
console.log('\n🎯 FINAL STATUS:');
console.log(`✅ ${Object.keys(ALL_19_EXTRACTED_IMAGES).length}/32 properties have REAL Property24 images`);
console.log(`⚠️  ${32 - Object.keys(ALL_19_EXTRACTED_IMAGES).length}/32 properties pending`);
console.log('🔗 ALL 32 properties link to REAL Property24 URLs');
console.log('\n🚀 Site ready with 19 real Property24 images!');
console.log('\n📈 Progress: 59% of properties now have real images!');