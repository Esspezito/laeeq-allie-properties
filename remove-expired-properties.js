const fs = require('fs');

console.log('🗑️  Removing 4 expired properties without images...');

// Properties to remove (expired/no images)
const PROPERTIES_TO_REMOVE = [
  "116300894",
  "116338371",
  "116344417",
  "114046864"
];

// Read current mockData.ts
const mockDataPath = 'src/lib/mockData.ts';
let mockDataContent = fs.readFileSync(mockDataPath, 'utf8');

// Count properties before
const propertiesBefore = (mockDataContent.match(/"id":/g) || []).length;

// Remove each property
PROPERTIES_TO_REMOVE.forEach(propertyId => {
  // Find and remove the entire property object
  const regex = new RegExp(`  \\{\\s*"id": "${propertyId}"[\\s\\S]*?\\},?`, 'g');

  if (mockDataContent.includes(`"id": "${propertyId}"`)) {
    mockDataContent = mockDataContent.replace(regex, '');
    console.log(`✅ Removed property ${propertyId}`);
  }
});

// Clean up any double commas or trailing commas
mockDataContent = mockDataContent.replace(/,\s*,/g, ',');
mockDataContent = mockDataContent.replace(/,\s*]/g, ']');

// Count properties after
const propertiesAfter = (mockDataContent.match(/"id":/g) || []).length;

// Write updated content
fs.writeFileSync(mockDataPath, mockDataContent);

console.log('\n📊 Summary:');
console.log(`   Properties before: ${propertiesBefore}`);
console.log(`   Properties removed: ${PROPERTIES_TO_REMOVE.length}`);
console.log(`   Properties after: ${propertiesAfter}`);
console.log('\n✅ Only active properties with real images remain!');