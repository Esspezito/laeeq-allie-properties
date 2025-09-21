const fs = require('fs');

// Read the current scraped data
const scrapedData = JSON.parse(fs.readFileSync('property24-stealth-data.json', 'utf8'));

// High-quality property images to use as gallery
const galleryImages = [
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1440&h=900&fit=crop",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1440&h=900&fit=crop",
  "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1440&h=900&fit=crop",
  "https://images.unsplash.com/photo-1600607688960-e095ff2c4043?w=1440&h=900&fit=crop",
  "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=1440&h=900&fit=crop",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1440&h=900&fit=crop",
  "https://images.unsplash.com/photo-1600607688992-15776b57e9f2?w=1440&h=900&fit=crop",
  "https://images.unsplash.com/photo-1600607688716-7cb3c892c76c?w=1440&h=900&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1440&h=900&fit=crop",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1440&h=900&fit=crop",
  "https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=1440&h=900&fit=crop",
  "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1440&h=900&fit=crop",
  "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=1440&h=900&fit=crop",
  "https://images.unsplash.com/photo-1600607688992-15776b57e9f2?w=1440&h=900&fit=crop"
];

// Kitchen images
const kitchenImages = [
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1440&h=900&fit=crop",
  "https://images.unsplash.com/photo-1556909075-f3584490d38d?w=1440&h=900&fit=crop",
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1440&h=900&fit=crop"
];

// Bathroom images
const bathroomImages = [
  "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1440&h=900&fit=crop",
  "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1440&h=900&fit=crop",
  "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1440&h=900&fit=crop"
];

// Bedroom images
const bedroomImages = [
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1440&h=900&fit=crop",
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1440&h=900&fit=crop",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1440&h=900&fit=crop"
];

// City view images for Cape Town properties
const cityViewImages = [
  "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1440&h=900&fit=crop", // Cape Town city
  "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?w=1440&h=900&fit=crop", // Table Mountain
  "https://images.unsplash.com/photo-1555400092-aa3baafce1be?w=1440&h=900&fit=crop"  // Waterfront
];

// Read current mockData to get agent profile
const currentMockData = fs.readFileSync('src/lib/mockData.ts', 'utf8');
const agentProfileMatch = currentMockData.match(/export const agentProfile: AgentProfile = \{[\s\S]*?\};/);
const agentProfileCode = agentProfileMatch ? agentProfileMatch[0] : '';

// Process properties with full galleries
const processedProperties = scrapedData.properties.map((prop, index) => {
  // Extract bedroom count from title
  let bedrooms = null;
  if (prop.title && prop.title.includes('3 Bedroom')) {
    bedrooms = 3;
  } else if (prop.title && prop.title.includes('2 Bedroom')) {
    bedrooms = 2;
  } else if (prop.title && prop.title.includes('1 Bedroom')) {
    bedrooms = 1;
  } else if (prop.title && prop.title.includes('0.5 Bedroom')) {
    bedrooms = 0; // Studio
  }

  // Calculate bathrooms based on bedrooms
  const bathrooms = bedrooms ? Math.max(1, Math.floor(bedrooms * 0.8)) : 1;

  // Build comprehensive image gallery
  let images = [];

  // Start with Property24 image if it exists and is valid
  const p24Image = prop.images[0];
  if (p24Image && !p24Image.includes('blank.gif') && p24Image.includes('prop24.com')) {
    // Convert to higher resolution
    const highResImage = p24Image.replace('/Crop600x400', '/Crop1440x900').replace('/Crop320x213', '/Crop1440x900');
    images.push(highResImage);
  }

  // Add main living area images
  const shuffledGallery = [...galleryImages].sort(() => Math.random() - 0.5);
  images.push(...shuffledGallery.slice(0, 4));

  // Add location-specific views
  if (prop.location === 'Cape Town City Centre') {
    images.push(...cityViewImages);
  }

  // Add kitchen images
  images.push(...kitchenImages.slice(0, 2));

  // Add bedroom images based on bedroom count
  if (bedrooms && bedrooms > 0) {
    images.push(...bedroomImages.slice(0, bedrooms));
  }

  // Add bathroom images
  images.push(...bathroomImages.slice(0, bathrooms));

  // Ensure we have at least 10 images for a good gallery
  while (images.length < 12) {
    const randomImage = galleryImages[Math.floor(Math.random() * galleryImages.length)];
    if (!images.includes(randomImage)) {
      images.push(randomImage);
    }
  }

  // Limit to 15 images maximum
  images = images.slice(0, 15);

  // Enhanced title
  let enhancedTitle = prop.title;
  if (enhancedTitle === '3 Bedroom Apartment') {
    enhancedTitle = `Luxury 3 Bedroom Apartment in ${prop.location}`;
  } else if (enhancedTitle === '2 Bedroom Apartment') {
    enhancedTitle = `Modern 2 Bedroom Apartment in ${prop.location}`;
  } else if (enhancedTitle === '1 Bedroom Apartment') {
    enhancedTitle = `Stylish 1 Bedroom Apartment in ${prop.location}`;
  } else if (enhancedTitle === '0.5 Bedroom Apartment') {
    enhancedTitle = `Contemporary Studio Apartment in ${prop.location}`;
  }

  // Enhanced description
  let description = `Exceptional ${prop.type.toLowerCase()} located in the prestigious ${prop.location} area. `;
  if (bedrooms && bedrooms > 0) {
    description += `This beautifully designed ${bedrooms} bedroom property `;
  } else {
    description += `This stunning studio property `;
  }
  description += `features modern finishes, premium amenities, and breathtaking views. Perfect for ${bedrooms && bedrooms > 2 ? 'families seeking luxury living' : 'professionals and investors'}.`;

  // Location-specific features
  const features = [];
  if (prop.location === 'Cape Town City Centre') {
    features.push('City Bowl Views', 'V&A Waterfront Access', 'Public Transport', 'Shopping Centers');
  } else if (prop.location === 'Gardens') {
    features.push('Table Mountain Views', 'Company Gardens', 'Kloof Street', 'Premium Location');
  } else if (prop.location === 'Woodstock') {
    features.push('Trendy Neighborhood', 'Art District', 'Salt Circle', 'Investment Opportunity');
  }

  if (bedrooms >= 2) {
    features.push('Built-in Wardrobes', 'Modern Kitchen');
  }
  if (bedrooms >= 3) {
    features.push('Master En-suite', 'Private Balcony');
  }

  return {
    id: prop.id,
    title: enhancedTitle,
    price: prop.price,
    location: prop.location,
    bedrooms: bedrooms || undefined,
    bathrooms: bathrooms || undefined,
    area: prop.area || `${50 + (bedrooms || 0) * 30} m²`,
    type: prop.type,
    status: prop.status,
    images: images,
    description: description,
    features: features.slice(0, 4),
    source: prop.source,
    sourceUrl: prop.sourceUrl,
    agentName: prop.agentName,
    agentContact: prop.agentContact
  };
});

// Create the new mockData.ts content
const newMockDataContent = `import { Property, AgentProfile } from '@/types/property';

${agentProfileCode}

export const mockProperties: Property[] = ${JSON.stringify(processedProperties, null, 2)};
`;

// Write the updated mockData.ts file
fs.writeFileSync('src/lib/mockData.ts', newMockDataContent);

console.log('✅ Successfully updated mockData.ts with full galleries!');
console.log(`📊 Total properties: ${processedProperties.length}`);
console.log(`🖼️  Average images per property: ${Math.round(processedProperties.reduce((sum, p) => sum + p.images.length, 0) / processedProperties.length)}`);

// Show gallery statistics
const galleryStats = processedProperties.map(p => ({
  id: p.id,
  title: p.title.substring(0, 40) + '...',
  imageCount: p.images.length,
  hasP24Image: p.images[0].includes('prop24.com')
}));

console.log('\\n📸 Gallery Statistics:');
galleryStats.slice(0, 5).forEach(stat => {
  console.log(`   ${stat.id}: ${stat.imageCount} images ${stat.hasP24Image ? '✓ P24' : ''}`);
});

console.log('\\n🎯 All properties now have:');
console.log('   ✓ 10-15 images per property for full gallery');
console.log('   ✓ Property24 feature image as first image (when available)');
console.log('   ✓ High-quality living area, kitchen, bedroom, bathroom images');
console.log('   ✓ Location-specific view images');
console.log('   ✓ Enhanced titles and descriptions');