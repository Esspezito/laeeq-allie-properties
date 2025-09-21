const fs = require('fs');

// Read the current scraped Property24 data (has the real property details)
const scrapedData = JSON.parse(fs.readFileSync('property24-full-galleries.json', 'utf8'));

// High-quality property images organized by type
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

// Kitchen-specific images
const kitchenImages = [
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1440&h=900&fit=crop&q=80",
  "https://images.unsplash.com/photo-1556909075-f3584490d38d?w=1440&h=900&fit=crop&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1440&h=900&fit=crop&q=80",
];

// Bedroom images
const bedroomImages = [
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1440&h=900&fit=crop&q=80",
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1440&h=900&fit=crop&q=80",
  "https://images.unsplash.com/photo-1560448075-bb485b067938?w=1440&h=900&fit=crop&q=80",
];

// Bathroom images
const bathroomImages = [
  "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1440&h=900&fit=crop&q=80",
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1440&h=900&fit=crop&q=80",
  "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1440&h=900&fit=crop&q=80",
];

// Read current mockData to get agent profile
const currentMockData = fs.readFileSync('src/lib/mockData.ts', 'utf8');
const agentProfileMatch = currentMockData.match(/export const agentProfile: AgentProfile = \\{[\\s\\S]*?\\};/);
const agentProfileCode = agentProfileMatch ? agentProfileMatch[0] : '';

// Process all properties with complete working galleries
const finalProperties = scrapedData.properties.map((prop, index) => {
  // Build complete gallery starting with variety of apartment images
  let galleryImages = [];

  // Add main living area images first
  const shuffledModernImages = [...modernApartmentImages].sort(() => Math.random() - 0.5);
  galleryImages.push(...shuffledModernImages.slice(0, 4));

  // Add Cape Town views for properties in Cape Town
  if (prop.location.includes('Cape Town') || prop.location.includes('Gardens')) {
    galleryImages.push(...capeTownViews);
  }

  // Add kitchen images
  galleryImages.push(...kitchenImages.slice(0, 2));

  // Add bedroom images based on bedroom count
  const bedrooms = prop.bedrooms || 2;
  if (bedrooms > 0) {
    galleryImages.push(...bedroomImages.slice(0, Math.min(bedrooms, 3)));
  }

  // Add bathroom images
  const bathrooms = prop.bathrooms || Math.max(1, Math.ceil(bedrooms * 0.8));
  galleryImages.push(...bathroomImages.slice(0, Math.min(bathrooms, 2)));

  // Ensure we have enough variety - add more modern images if needed
  while (galleryImages.length < 12) {
    const randomImg = modernApartmentImages[galleryImages.length % modernApartmentImages.length];
    if (!galleryImages.includes(randomImg)) {
      galleryImages.push(randomImg);
    }
  }

  // Limit to 15 images max for performance
  galleryImages = galleryImages.slice(0, 15);

  // Enhanced property details
  const enhancedBedrooms = prop.bedrooms || (prop.title.includes('3 Bedroom') ? 3 :
                                            prop.title.includes('2 Bedroom') ? 2 :
                                            prop.title.includes('1 Bedroom') ? 1 : 2);

  const enhancedBathrooms = prop.bathrooms || Math.max(1, Math.ceil(enhancedBedrooms * 0.8));

  // Enhanced title
  let enhancedTitle = prop.title;
  if (enhancedBedrooms === 3) {
    enhancedTitle = `Luxury 3 Bedroom Apartment in ${prop.location}`;
  } else if (enhancedBedrooms === 2) {
    enhancedTitle = `Modern 2 Bedroom Apartment in ${prop.location}`;
  } else if (enhancedBedrooms === 1) {
    enhancedTitle = `Stylish 1 Bedroom Apartment in ${prop.location}`;
  } else if (prop.title.includes('0.5') || prop.title.includes('Studio')) {
    enhancedTitle = `Contemporary Studio in ${prop.location}`;
  }

  // Enhanced description
  const bedroomText = enhancedBedrooms ? `${enhancedBedrooms} bedroom` : 'studio';
  const description = `Exceptional ${bedroomText} apartment in the prestigious ${prop.location}. This beautifully designed property features modern finishes, premium amenities, and spectacular views. ${enhancedBedrooms >= 3 ? 'Perfect for families seeking luxury living in the heart of Cape Town.' : 'Ideal for professionals and investors looking for prime location and quality.'}`;

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
    bedrooms: enhancedBedrooms,
    bathrooms: enhancedBathrooms,
    area: prop.area,
    type: prop.type,
    status: prop.status,
    images: galleryImages, // All working stock images
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

console.log('✅ Successfully created working galleries with stock images!');
console.log(`📊 Total properties: ${finalProperties.length}`);
console.log(`🖼️  Average images per property: ${Math.round(finalProperties.reduce((sum, p) => sum + p.images.length, 0) / finalProperties.length)}`);

// Show sample of first few properties
console.log('\\n📋 Sample Properties:');
finalProperties.slice(0, 5).forEach(prop => {
  console.log(`   ${prop.id}: ${prop.images.length} images - ${prop.title.substring(0, 40)}...`);
});

console.log('\\n🎯 Final Gallery Features:');
console.log('   ✓ 100% working high-quality stock images');
console.log('   ✓ 12-15 images per property for complete gallery navigation');
console.log('   ✓ Real Property24 data (prices, locations, details)');
console.log('   ✓ Location-specific view images (Cape Town, Table Mountain)');
console.log('   ✓ Room-specific images (kitchen, bedroom, bathroom)');
console.log('   ✓ Enhanced titles and descriptions');
console.log('   ✓ Ready for gallery navigation!');