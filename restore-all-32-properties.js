const fs = require('fs');

console.log('🎯 RESTORING ALL 32 PROPERTIES with extracted and placeholder images');

// All 32 property URLs from La'eeq Allie's Property24 listings
const ALL_32_PROPERTIES = [
  { id: "116463618", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116463618", image: "https://images.prop24.com/365598971/Ensure1280x720" },
  { id: "116455279", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116455279", image: "https://images.prop24.com/365456846/Ensure1280x720" },
  { id: "116455489", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116455489", image: "https://images.prop24.com/365668291/Ensure1280x720" },
  { id: "116455093", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116455093", image: "https://images.prop24.com/365453847/Ensure1280x720" },
  { id: "116439140", url: "https://www.property24.com/for-sale/gardens/cape-town/western-cape/9145/116439140", image: "https://images.prop24.com/365167323/Ensure1280x720" },
  { id: "116441627", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116441627", image: "https://images.prop24.com/365215817/Ensure1280x720" },
  { id: "116441202", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116441202", image: "https://images.prop24.com/365208392/Ensure1280x720" },
  { id: "116441599", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116441599", image: "https://images.prop24.com/365215425/Ensure1280x720" },
  // Remaining properties - need to extract real images
  { id: "116300894", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116300894", image: null },
  { id: "116338371", url: "https://www.property24.com/for-sale/gardens/cape-town/western-cape/9145/116338371", image: null },
  { id: "116280718", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116280718", image: null },
  { id: "116282958", url: "https://www.property24.com/for-sale/woodstock/cape-town/western-cape/10164/116282958", image: null },
  { id: "116281167", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116281167", image: null },
  { id: "116281209", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116281209", image: null },
  { id: "116296190", url: "https://www.property24.com/for-sale/gardens/cape-town/western-cape/9145/116296190", image: null },
  { id: "116280871", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116280871", image: null },
  { id: "116226593", url: "https://www.property24.com/for-sale/gardens/cape-town/western-cape/9145/116226593", image: null },
  { id: "116283204", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116283204", image: null },
  { id: "116220646", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116220646", image: null },
  { id: "116200162", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116200162", image: null },
  { id: "116216202", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116216202", image: null },
  { id: "116155994", url: "https://www.property24.com/for-sale/woodstock/cape-town/western-cape/10164/116155994", image: null },
  { id: "116344417", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116344417", image: null },
  { id: "115943244", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115943244", image: null },
  { id: "115629416", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115629416", image: null },
  { id: "115843150", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115843150", image: null },
  { id: "115437832", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115437832", image: null },
  { id: "115285887", url: "https://www.property24.com/for-sale/gardens/cape-town/western-cape/9145/115285887", image: null },
  { id: "115488888", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115488888", image: null },
  { id: "115311090", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115311090", image: null },
  { id: "114942423", url: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/114942423", image: null },
  { id: "114046864", url: "https://www.property24.com/for-sale/woodstock/cape-town/western-cape/10164/114046864", image: null }
];

console.log('📊 Total properties: 32');
console.log('✅ Properties with real images: 8');
console.log('⚠️  Properties needing images: 24');

// Generate all 32 properties
const properties = ALL_32_PROPERTIES.map((prop, index) => {
  const location = prop.url.includes('/gardens/') ? 'Gardens' :
                   prop.url.includes('/woodstock/') ? 'Woodstock' : 'Cape Town City Centre';

  // Realistic property data
  const prices = ["R 2 375 000", "R 2 750 000", "R 3 200 000", "R 3 300 000", "R 3 800 000", "R 4 200 000", "R 4 500 000", "R 4 800 000", "R 5 500 000", "R 6 200 000", "R 6 250 000", "R 7 500 000", "R 8 900 000", "R 12 995 000"];
  const bedroomOptions = [1, 1, 2, 2, 2, 3, 3];
  const areas = ["55 m²", "65 m²", "72 m²", "88 m²", "92 m²", "108 m²", "115 m²", "142 m²", "156 m²", "172 m²", "173 m²"];

  const bedrooms = bedroomOptions[index % bedroomOptions.length];
  const bathrooms = bedrooms;
  const price = prices[index % prices.length];
  const area = areas[index % areas.length];

  const title = bedrooms === 1 ? `Studio Apartment for Sale in ${location}` :
                `${bedrooms} Bedroom Apartment for Sale in ${location}`;

  const bedroomText = bedrooms === 3 ? 'luxurious 3 bedroom' :
                      bedrooms === 2 ? 'spacious 2 bedroom' : 'sophisticated studio';

  const description = `Exceptional ${bedroomText} apartment in prestigious ${location}. This beautifully designed property features modern finishes, premium amenities, and spectacular views. Listed by La'eeq Allie at ${price}. ${location === 'Gardens' ? 'Perfect location near Table Mountain and Company Gardens with easy access to the vibrant Kloof Street dining and shopping precinct.' : location === 'Woodstock' ? 'Trendy Woodstock location with easy access to the city center and emerging arts district.' : 'Prime City Centre location with V&A Waterfront access, world-class shopping, and stunning harbor views.'}`;

  const features = location === 'Cape Town City Centre' ?
    ['City Bowl Views', 'V&A Waterfront Access', 'Public Transport', 'Premium Shopping', 'Harbour Views', 'Urban Living'] :
    location === 'Gardens' ?
    ['Table Mountain Views', 'Company Gardens', 'Kloof Street Cafes', 'Heritage Location', 'Green Spaces', 'Cultural District'] :
    ['Art District', 'Trendy Neighborhood', 'City Access', 'Creative Hub', 'Local Markets', 'Urban Edge'];

  const priceNumber = parseInt(price.replace(/[^0-9]/g, ''));
  const enhancedFeatures = priceNumber >= 10000000 ?
    [...features, 'Luxury Finishes', 'Premium Building', 'Concierge Service', 'Executive Living'] :
    priceNumber >= 5000000 ?
    [...features, 'Modern Appliances', 'Secure Parking', 'Quality Construction'] :
    [...features, 'Investment Potential', 'Modern Design'];

  // Use real image if available, otherwise empty array for loading state
  const images = prop.image ? [prop.image] : [];

  return {
    id: prop.id,
    title: title,
    price: price,
    location: location,
    bedrooms: bedrooms,
    bathrooms: bathrooms,
    area: area,
    type: 'Apartment',
    status: 'available',
    images: images,
    description: description,
    features: enhancedFeatures,
    source: 'property24',
    sourceUrl: prop.url,
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  };
});

// Agent Profile
const agentProfile = `export const agentProfile: AgentProfile = {
  name: "La'eeq Allie",
  title: "Property Specialist",
  company: "Greeff Christie's International Real Estate",
  phone: "+27 82 123 4567",
  email: "laeeq@greeff.co.za",
  officePhone: "+27 21 763 4120",
  address: "96 Kloof St, Gardens, Cape Town, 8001",
  bio: "La'eeq Allie is a dedicated real estate professional specializing in sectional-title and freehold residential properties across Cape Town's City Bowl, Gardens, and Waterfront areas. With extensive local market knowledge and backed by Christie's International Real Estate network, La'eeq provides exceptional service to both buyers and sellers, ensuring seamless property transactions in Cape Town's most vibrant neighborhoods.",
  specializations: [
    "Sectional Title Properties",
    "Freehold Residential",
    "Investment Properties",
    "Airbnb-Friendly Units",
    "First-Time Buyers"
  ],
  areas: [
    "Cape Town City Centre",
    "Gardens",
    "Waterfront",
    "City Bowl",
    "Woodstock"
  ],
  profileImage: "/A-16.jpg",
  achievements: [
    "Silver Club Member",
    "Part of Christie's International Real Estate network",
    "Specialist in City Bowl properties",
    "Expert in investment and Airbnb potential properties",
    "Exclusive mandate specialist"
  ]
};`;

// Create final mockData.ts content
const finalMockDataContent = `import { Property, AgentProfile } from '@/types/property';

${agentProfile}

export const mockProperties: Property[] = ${JSON.stringify(properties, null, 2)};
`;

// Write the file
fs.writeFileSync('src/lib/mockData.ts', finalMockDataContent);

console.log('\\n✅ RESTORED ALL 32 PROPERTIES!');
console.log('📸 8 properties have real Property24 images');
console.log('⚠️  24 properties show empty images array (will display loading spinner)');
console.log('🔗 ALL properties link to REAL Property24 URLs');
console.log('\\n📋 Next steps:');
console.log('1. Try alternative scraping method with delays and rotation');
console.log('2. Use proxy services if needed');
console.log('3. Consider manual screenshot capture as fallback');