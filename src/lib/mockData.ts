import { Property, AgentProfile } from '@/types/property';

export const agentProfile: AgentProfile = {
  name: "La'eeq Allie",
  title: "Property Specialist",
  company: "Greeff Christie's International Real Estate",
  phone: "+27 82 123 4567",
  email: "laeeq@greeff.co.za",
  officePhone: "+27 21 763 4120",
  address: "Greeff House, 262 Main Road, Kenilworth, Cape Town, 7708",
  bio: "La'eeq Allie is a dedicated real estate professional specializing in sectional-title and freehold residential properties across Cape Town's City Bowl, Gardens, and Woodstock areas. With extensive local market knowledge and backed by Christie's International Real Estate network, La'eeq provides exceptional service to both buyers and sellers, ensuring seamless property transactions in Cape Town's most vibrant neighborhoods.",
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
    "Woodstock",
    "City Bowl",
    "Vredehoek"
  ],
  profileImage: "/A-16.jpg",
  achievements: [
    "Part of Christie's International Real Estate network",
    "Specialist in City Bowl properties",
    "Expert in investment and Airbnb potential properties",
    "Exclusive mandate specialist"
  ]
};

export const mockProperties: Property[] = [
  {
    id: "116338371",
    title: "1 Bedroom Apartment in Gardens",
    price: "R 2,399,999",
    location: "Gardens, Cape Town",
    bedrooms: 1,
    bathrooms: 1,
    area: "57 m²",
    type: "Apartment",
    status: "under-offer",
    images: [
      "https://images.prop24.com/363165824/Crop600x400",
      "https://images.prop24.com/363165825/Crop600x400",
      "https://images.prop24.com/363165826/Crop600x400"
    ],
    description: "Exclusive listing. Perched on one of the higher floors, this apartment offers panoramic views and modern living in the heart of Gardens.",
    features: [
      "Exclusive Listing",
      "Higher Floor",
      "Panoramic Views",
      "Modern Living",
      "Gardens Location",
      "1 Bedroom"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/gardens/cape-town/western-cape/9145/116338371",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "116280718",
    title: "Studio Apartment in Cape Town City Centre",
    price: "R 2,995,000",
    location: "Cape Town City Centre",
    bedrooms: 0,
    bathrooms: 1,
    area: "31 m²",
    type: "Studio",
    status: "available",
    images: [
      "https://images.prop24.com/350908862/Crop600x400",
      "https://images.prop24.com/350908863/Crop600x400"
    ],
    description: "No transfer duty! Modern studio apartment in the heart of the city. Perfect investment opportunity with excellent rental potential.",
    features: [
      "No Transfer Duty",
      "City Centre Location",
      "Investment Opportunity",
      "Modern Design",
      "On Show",
      "Studio Living"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116280718",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "116068819",
    title: "2 Bedroom House in Woodstock",
    price: "R 2,250,000",
    location: "Woodstock, Cape Town",
    bedrooms: 2,
    bathrooms: 1,
    area: "123 m²",
    type: "House",
    status: "available",
    images: [
      "https://images.prop24.com/355723549/Crop600x400",
      "https://images.prop24.com/355723550/Crop600x400"
    ],
    description: "Charming 2-bedroom house in trendy Woodstock. Perfect for first-time buyers or investors looking for a property in an up-and-coming area.",
    features: [
      "2 Bedrooms",
      "Woodstock Location",
      "On Show",
      "Investment Potential",
      "Trendy Area",
      "Freehold"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/woodstock/cape-town/western-cape/10164/116068819",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "116282958",
    title: "Exclusive Sole Mandate in Upper Woodstock",
    price: "R 2,695,000",
    location: "Woodstock, Cape Town",
    bedrooms: 2,
    bathrooms: 1,
    area: "145 m²",
    type: "House",
    status: "available",
    images: [
      "https://images.prop24.com/355723549/Crop600x400",
      "https://images.prop24.com/355723550/Crop600x400"
    ],
    description: "Exclusive Sole Mandate. Tucked away on Balfour Street in Upper Woodstock, this property offers character and potential in a sought-after location.",
    features: [
      "Exclusive Sole Mandate",
      "Upper Woodstock",
      "2 Bedrooms",
      "Character Home",
      "Investment Potential",
      "Quiet Street"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/woodstock/cape-town/western-cape/10164/116282958",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "116281209",
    title: "1 Bedroom Apartment in Cape Town City Centre",
    price: "R 3,995,000",
    location: "Cape Town City Centre",
    bedrooms: 1,
    bathrooms: 1,
    area: "47 m²",
    type: "Apartment",
    status: "available",
    images: [
      "https://images.prop24.com/363165824/Crop600x400",
      "https://images.prop24.com/363165825/Crop600x400"
    ],
    description: "Exclusive mandate. Step into a thoughtfully designed 1-bedroom apartment with modern finishes and city views. No transfer duty!",
    features: [
      "Exclusive Mandate",
      "No Transfer Duty",
      "Modern Design",
      "City Views",
      "On Show",
      "Prime Location"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116281209",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "116296190",
    title: "1 Bedroom Apartment in Gardens",
    price: "R 2,199,999",
    location: "Gardens, Cape Town",
    bedrooms: 1,
    bathrooms: 1,
    area: "49 m²",
    type: "Apartment",
    status: "under-offer",
    images: [
      "https://images.prop24.com/350908862/Crop600x400",
      "https://images.prop24.com/350908863/Crop600x400"
    ],
    description: "Exclusive Dual Mandate. Located on a quiet and secure street in the heart of Gardens, this apartment offers peaceful city living.",
    features: [
      "Exclusive Dual Mandate",
      "Gardens Location",
      "Quiet Street",
      "Secure",
      "City Living",
      "Under Offer"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/gardens/cape-town/western-cape/9145/116296190",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "116280871",
    title: "Luxury Penthouse in Cape Town City Centre",
    price: "R 6,950,000",
    location: "Cape Town City Centre",
    bedrooms: 2,
    bathrooms: 2.5,
    area: "93 m²",
    type: "Apartment",
    status: "available",
    images: [
      "https://images.prop24.com/355723549/Crop600x400",
      "https://images.prop24.com/355723550/Crop600x400"
    ],
    description: "Exclusive mandate. Located in the vibrant Citybowl precinct, this immaculate penthouse offers the perfect balance of luxury and urban living. No transfer duty!",
    features: [
      "Exclusive Mandate",
      "No Transfer Duty",
      "Penthouse",
      "Luxury Living",
      "City Bowl",
      "2.5 Bathrooms"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116280871",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "116283204",
    title: "Brand New Studio in Cape Town City Centre",
    price: "R 1,950,000",
    location: "Cape Town City Centre",
    bedrooms: 0,
    bathrooms: 1,
    area: "25 m²",
    type: "Studio",
    status: "available",
    images: [
      "https://images.prop24.com/363165824/Crop600x400",
      "https://images.prop24.com/363165825/Crop600x400"
    ],
    description: "No transfer duty! This never-before-owned studio apartment is a compact yet beautifully crafted space, ideal for buyers seeking a low-maintenance city lifestyle.",
    features: [
      "No Transfer Duty",
      "Brand New",
      "Studio",
      "Low Maintenance",
      "City Centre",
      "Investment Ready"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116283204",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "115843150",
    title: "Investment Studio in Cape Town City Centre",
    price: "R 1,895,000",
    location: "Cape Town City Centre",
    bedrooms: 0,
    bathrooms: 1,
    area: "33 m²",
    type: "Studio",
    status: "available",
    images: [
      "https://images.prop24.com/350908862/Crop600x400",
      "https://images.prop24.com/350908863/Crop600x400"
    ],
    description: "Exclusive mandate. Generating R370,000 of revenue in the past 12 months, this stunning investment studio could be yours today. Prime Airbnb opportunity!",
    features: [
      "Exclusive Mandate",
      "R370k Annual Revenue",
      "Airbnb Ready",
      "Investment Property",
      "Fully Furnished",
      "High ROI"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115843150",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "115629416",
    title: "Renovated 1 Bedroom in Iconic 16 on Bree",
    price: "R 3,295,000",
    location: "Cape Town City Centre",
    bedrooms: 1,
    bathrooms: 1,
    area: "52 m²",
    type: "Apartment",
    status: "sold",
    images: [
      "https://images.prop24.com/355723549/Crop600x400",
      "https://images.prop24.com/355723550/Crop600x400"
    ],
    description: "SOLD! Discover luxury urban living in this beautifully renovated and stylishly furnished one-bedroom apartment in the iconic 16 on Bree building.",
    features: [
      "Renovated",
      "Furnished",
      "16 on Bree",
      "Iconic Building",
      "City Centre",
      "Luxury Living"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115629416",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  }
];