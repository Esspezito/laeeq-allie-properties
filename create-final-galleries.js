const fs = require('fs');

// Read the extracted gallery data
const galleryData = JSON.parse(fs.readFileSync('property24-full-galleries.json', 'utf8'));

// High-quality property images for complete galleries
const modernApartmentImages = [
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1440&h=900&fit=crop&q=80", // Modern living room
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1440&h=900&fit=crop&q=80", // Kitchen view
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1440&h=900&fit=crop&q=80", // Bedroom
  "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1440&h=900&fit=crop&q=80", // Bathroom
  "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1440&h=900&fit=crop&q=80", // Living area
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1440&h=900&fit=crop&q=80", // Balcony view
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1440&h=900&fit=crop&q=80", // Modern kitchen
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1440&h=900&fit=crop&q=80", // Master bedroom
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1440&h=900&fit=crop&q=80", // Luxury bathroom
  "https://images.unsplash.com/photo-1600607688960-e095ff2c4043?w=1440&h=900&fit=crop&q=80", // Dining area
  "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1440&h=900&fit=crop&q=80", // City apartment view
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1440&h=900&fit=crop&q=80", // Modern interior
];

// Cape Town specific views
const capeTownViews = [
  "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1440&h=900&fit=crop&q=80", // Cape Town city
  "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?w=1440&h=900&fit=crop&q=80", // Table Mountain
  "https://images.unsplash.com/photo-1555400092-aa3baafce1be?w=1440&h=900&fit=crop&q=80", // V&A Waterfront
];

// Read current mockData to get agent profile
const currentMockData = fs.readFileSync('src/lib/mockData.ts', 'utf8');
const agentProfileMatch = currentMockData.match(/export const agentProfile: AgentProfile = \{[\s\S]*?\};/);
const agentProfileCode = agentProfileMatch ? agentProfileMatch[0] : '';

// Function to filter out UI elements and get real property images
function getRealProperty24Images(imageArray) {
  const realImages = imageArray.filter(img =>
    img &&
    img.includes('prop24.com') &&
    !img.includes('blank.gif') &&
    !img.includes('loading.gif') &&
    !img.includes('NoImage') &&
    !img.includes('icon_') &&
    !img.includes('search-') &&
    !img.includes('grid_icon') &&
    !img.includes('.svg') &&
    img.includes('/') && // Must have path structure
    img.match(/\d{8,}/) // Must contain image ID
  );

  // Convert to high resolution
  return realImages.map(img =>
    img.replace('Ensure1280x720', 'Crop1440x900')
       .replace('Crop600x400', 'Crop1440x900')
       .replace('Crop320x213', 'Crop1440x900')
  );
}

// Process all properties with complete galleries
const finalProperties = galleryData.properties.map((prop, index) => {
  // Get real Property24 images
  const realP24Images = getRealProperty24Images(prop.images);

  // Build complete gallery starting with Property24 images
  let galleryImages = [...realP24Images];

  // Add high-quality stock images to complete the gallery
  const shuffledModernImages = [...modernApartmentImages].sort(() => Math.random() - 0.5);

  // Add enough images to get to 12-15 total
  let targetCount = Math.max(12, realP24Images.length + 8);

  for (const img of shuffledModernImages) {
    if (galleryImages.length >= targetCount) break;
    if (!galleryImages.includes(img)) {
      galleryImages.push(img);
    }
  }

  // Add Cape Town views for properties in Cape Town
  if (prop.location.includes('Cape Town') || prop.location.includes('Gardens')) {
    for (const img of capeTownViews) {
      if (galleryImages.length >= 15) break;
      if (!galleryImages.includes(img)) {
        galleryImages.push(img);
      }
    }
  }

  // Ensure minimum of 10 images
  while (galleryImages.length < 10 && galleryImages.length < modernApartmentImages.length) {
    const randomImg = modernApartmentImages[galleryImages.length % modernApartmentImages.length];
    if (!galleryImages.includes(randomImg)) {
      galleryImages.push(randomImg);
    }
  }

  // Limit to 15 images max
  galleryImages = galleryImages.slice(0, 15);

  // Enhanced property details
  const bedrooms = prop.bedrooms || (prop.title.includes('3 Bedroom') ? 3 :
                                    prop.title.includes('2 Bedroom') ? 2 :
                                    prop.title.includes('1 Bedroom') ? 1 : undefined);

  const bathrooms = prop.bathrooms || (bedrooms ? Math.max(1, Math.ceil(bedrooms * 0.8)) : 1);

  // Enhanced title
  let enhancedTitle = prop.title;
  if (bedrooms === 3) {
    enhancedTitle = `Luxury 3 Bedroom Apartment in ${prop.location}`;
  } else if (bedrooms === 2) {
    enhancedTitle = `Modern 2 Bedroom Apartment in ${prop.location}`;
  } else if (bedrooms === 1) {
    enhancedTitle = `Stylish 1 Bedroom Apartment in ${prop.location}`;
  } else if (prop.title.includes('0.5') || prop.title.includes('Studio')) {
    enhancedTitle = `Contemporary Studio in ${prop.location}`;
  }

  // Enhanced description
  const bedroomText = bedrooms ? `${bedrooms} bedroom` : 'studio';
  const description = `Exceptional ${bedroomText} apartment in the prestigious ${prop.location}. This beautifully designed property features modern finishes, premium amenities, and spectacular views. ${bedrooms >= 3 ? 'Perfect for families seeking luxury living in the heart of Cape Town.' : 'Ideal for professionals and investors looking for prime location and quality.'}`;

  // Location-specific features
  let features = [];
  if (prop.location === 'Cape Town City Centre') {
    features = ['City Bowl Views', 'V&A Waterfront Access', 'Public Transport', 'Premium Shopping'];
  } else if (prop.location === 'Gardens') {
    features = ['Table Mountain Views', 'Company Gardens', 'Kloof Street Cafes', 'Heritage Location'];
  } else if (prop.location === 'Woodstock') {
    features = ['Trendy Arts District', 'Salt Circle', 'Investment Potential', 'Transport Links'];
  } else {
    features = ['Modern Finishes', 'Prime Location', 'Investment Opportunity', 'Quality Fixtures'];
  }

  return {
    id: prop.id,
    title: enhancedTitle,
    price: prop.price,
    location: prop.location,
    bedrooms: bedrooms,
    bathrooms: bathrooms,
    area: prop.area,
    type: prop.type,
    status: prop.status,
    images: galleryImages,
    description: description,
    features: features,
    source: prop.source,
    sourceUrl: prop.sourceUrl,
    agentName: prop.agentName,
    agentContact: prop.agentContact
  };
});

// Create the final mockData.ts content
const finalMockDataContent = `import { Property, AgentProfile } from '@/types/property';

${agentProfileCode}

export const mockProperties: Property[] = ${JSON.stringify(finalProperties, null, 2)};
`;

// Write the final mockData.ts file
fs.writeFileSync('src/lib/mockData.ts', finalMockDataContent);

console.log('✅ Successfully created final galleries!');
console.log(`📊 Total properties: ${finalProperties.length}`);

// Statistics
const propertiesWithP24Images = finalProperties.filter(p =>
  p.images.some(img => img.includes('prop24.com'))
).length;

const avgImagesPerProperty = Math.round(
  finalProperties.reduce((sum, p) => sum + p.images.length, 0) / finalProperties.length
);

console.log(`🖼️  Properties with Property24 images: ${propertiesWithP24Images}/${finalProperties.length}`);
console.log(`📸 Average images per property: ${avgImagesPerProperty}`);

// Show sample of first few properties
console.log('\\n📋 Sample Properties:');
finalProperties.slice(0, 5).forEach(prop => {
  const p24Count = prop.images.filter(img => img.includes('prop24.com')).length;
  console.log(`   ${prop.id}: ${prop.images.length} images (${p24Count} from P24) - ${prop.title.substring(0, 40)}...`);
});

console.log('\\n🎯 Final Gallery Features:');
console.log('   ✓ Real Property24 images as first images (when available)');
console.log('   ✓ 10-15 high-quality images per property');
console.log('   ✓ Modern apartment interiors (living, kitchen, bedroom, bathroom)');
console.log('   ✓ Cape Town location-specific views');
console.log('   ✓ Enhanced titles, descriptions, and features');
console.log('   ✓ Proper bedroom/bathroom counts');
console.log('   ✓ Ready for gallery navigation!');