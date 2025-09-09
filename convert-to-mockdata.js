const fs = require('fs');

// Read the scraped data
console.log('🔄 CONVERTING GREEFF DATA TO MOCKDATA FORMAT...\n');

const scrapedData = JSON.parse(fs.readFileSync('laeeq-allie-greeff-properties.json', 'utf8'));

console.log(`📊 Processing ${scrapedData.properties.length} scraped properties...`);
console.log(`📸 Total images available: ${scrapedData.totalImages}`);

// Clean and convert properties to mockData format
const convertedProperties = scrapedData.properties
  .filter(property => !property.error) // Only use successful scrapes
  .map((property, index) => {
    // Clean up images - remove duplicates and filter out non-property images
    const cleanImages = property.images
      .filter(img => {
        // Remove SVG logos, navigation images, and duplicates
        return !img.includes('.svg') && 
               !img.includes('theme-settings') && 
               img.includes('cloudfront') &&
               (img.includes('residential') || img.includes('undefined'));
      })
      .filter((img, index, arr) => arr.indexOf(img) === index) // Remove duplicates
      .slice(0, 40); // Limit to 40 images max for performance

    // Create a cleaner description from the property title and basic info
    let cleanDescription = '';
    if (property.description && property.description.length > 100) {
      // Try to extract meaningful description from the scraped text
      const descParts = property.description.split('\n').filter(part => 
        part.trim().length > 50 && 
        !part.includes('Contact') && 
        !part.includes('View my listings') &&
        !part.includes('Disclaimer') &&
        !part.includes('Privacy Policy')
      );
      cleanDescription = descParts[0] || property.title;
    } else {
      cleanDescription = property.title;
    }

    // Clean up title - remove excessive marketing language
    let cleanTitle = property.title;
    if (cleanTitle.length > 80) {
      cleanTitle = cleanTitle.substring(0, 80) + '...';
    }

    console.log(`   ${index + 1}. ${cleanTitle}`);
    console.log(`      📍 ${property.location} - ${property.price}`);
    console.log(`      🏠 ${property.bedrooms || 'Studio'} bed, ${property.bathrooms} bath, ${property.area || 'Area N/A'}`);
    console.log(`      📸 ${cleanImages.length} images processed`);

    return {
      id: property.id,
      title: cleanTitle,
      price: property.price,
      location: property.location,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      type: property.type,
      status: property.status,
      images: cleanImages,
      description: cleanDescription.substring(0, 500), // Limit description length
      source: property.source,
      sourceUrl: property.sourceUrl
    };
  });

console.log(`\n✅ Successfully converted ${convertedProperties.length} properties`);

// Read the current mockData template
let mockDataContent = fs.readFileSync('src/lib/mockData.ts', 'utf8');

// Extract the agent profile section (keep it unchanged)
const agentProfileMatch = mockDataContent.match(/(export const agentProfile: AgentProfile = \{[^}]+\};)/s);
const agentProfile = agentProfileMatch ? agentProfileMatch[1] : '';

// Create the new mockData content with converted properties
const propertiesArray = JSON.stringify(convertedProperties, null, 2)
  .replace(/^/gm, '  ') // Indent the JSON
  .slice(2, -2); // Remove outer array brackets and indentation

const newMockDataContent = `import { Property, AgentProfile } from '@/types/property';

${agentProfile}

export const mockProperties: Property[] = [
${propertiesArray}
];
`;

// Write the new mockData file
fs.writeFileSync('src/lib/mockData.ts', newMockDataContent);

console.log('\n🎉 CONVERSION COMPLETE!');
console.log('📁 Updated: src/lib/mockData.ts');
console.log(`\n📊 Final Statistics:`);
console.log(`   ✅ Properties: ${convertedProperties.length}`);
console.log(`   📸 Total images: ${convertedProperties.reduce((sum, p) => sum + p.images.length, 0)}`);
console.log(`   📊 Average images per property: ${(convertedProperties.reduce((sum, p) => sum + p.images.length, 0) / convertedProperties.length).toFixed(1)}`);

// Show property locations breakdown
const locationCounts = convertedProperties.reduce((acc, prop) => {
  acc[prop.location] = (acc[prop.location] || 0) + 1;
  return acc;
}, {});

console.log(`\n🏘️  Properties by Location:`);
Object.entries(locationCounts).forEach(([location, count]) => {
  console.log(`   • ${location}: ${count} properties`);
});

console.log('\n🔗 All properties now link to Greeff listings with comprehensive image galleries!');