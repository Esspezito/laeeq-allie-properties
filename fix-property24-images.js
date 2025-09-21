const fs = require('fs');

// Read the current mockData.ts
const mockDataContent = fs.readFileSync('src/lib/mockData.ts', 'utf8');

// Function to convert Property24 image URLs to proxy URLs
function convertToProxyUrl(imageUrl) {
  if (imageUrl.includes('prop24.com')) {
    return `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
  }
  return imageUrl;
}

// Extract the properties array using regex
const propertiesMatch = mockDataContent.match(/export const mockProperties: Property\[\] = (\[[\s\S]*?\]);/);

if (!propertiesMatch) {
  console.error('Could not find properties array in mockData.ts');
  process.exit(1);
}

// Parse the properties array
const propertiesArrayString = propertiesMatch[1];
let properties;

try {
  // Use eval to parse the array (safe in this controlled environment)
  properties = eval('(' + propertiesArrayString + ')');
} catch (error) {
  console.error('Failed to parse properties array:', error.message);
  process.exit(1);
}

console.log(`Found ${properties.length} properties to process...`);

// Convert all Property24 image URLs to proxy URLs
let convertedCount = 0;
properties.forEach((property, index) => {
  if (property.images && Array.isArray(property.images)) {
    const originalImages = [...property.images];
    property.images = property.images.map(convertToProxyUrl);

    // Count how many images were converted
    const converted = originalImages.filter((url, i) => url !== property.images[i]).length;
    if (converted > 0) {
      convertedCount += converted;
      console.log(`  Property ${property.id}: Converted ${converted} Property24 images`);
    }
  }
});

// Extract agent profile
const agentProfileMatch = mockDataContent.match(/export const agentProfile: AgentProfile = \{[\s\S]*?\};/);
const agentProfileCode = agentProfileMatch ? agentProfileMatch[0] : '';

// Create the new mockData.ts content
const newMockDataContent = `import { Property, AgentProfile } from '@/types/property';

${agentProfileCode}

export const mockProperties: Property[] = ${JSON.stringify(properties, null, 2)};
`;

// Write the updated file
fs.writeFileSync('src/lib/mockData.ts', newMockDataContent);

console.log(`\n✅ Successfully updated mockData.ts!`);
console.log(`📊 Total properties: ${properties.length}`);
console.log(`🖼️  Property24 images converted to proxy URLs: ${convertedCount}`);
console.log(`🔄 All Property24 images now use /api/image-proxy for CORS bypass`);