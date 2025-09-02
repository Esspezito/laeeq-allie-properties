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
      "https://images.prop24.com/363165826/Crop600x400",
      "https://images.prop24.com/363165827/Crop600x400"
    ],
    description: "Perched on one of the higher floors, this beautifully positioned one bedroom apartment captures uninterrupted panoramic views and offers modern living in the heart of Gardens.",
    features: [
      "Higher Floor",
      "Panoramic Views",
      "Modern Living",
      "Gardens Location",
      "1 Bedroom",
      "Under Offer"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/gardens/cape-town/western-cape/9145/116338371",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "116134937",
    title: "4 Bedroom House in Gardens",
    price: "R 5,895,000",
    location: "Gardens, Cape Town",
    bedrooms: 4,
    bathrooms: 5,
    area: "175 m²",
    type: "House",
    status: "available",
    images: [
      "https://images.prop24.com/356438741/Crop600x400",
      "https://images.prop24.com/356438742/Crop600x400",
      "https://images.prop24.com/356438743/Crop600x400",
      "https://images.prop24.com/356438744/Crop600x400"
    ],
    description: "Step into a sanctuary of elegance and light, nestled in the highly sought-after suburb of Gardens. This multi-level masterpiece offers luxurious living with breathtaking views.",
    features: [
      "4 Bedrooms",
      "5 Bathrooms",
      "Multi-level",
      "Gardens Location",
      "Luxury Home",
      "On Show: 02 Sep"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/gardens/cape-town/western-cape/9145/116134937",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "116280718",
    title: "Studio Apartment in Cape Town City Centre",
    price: "R 2,995,000",
    location: "Cape Town City Centre",
    bedrooms: 0.5,
    bathrooms: 1,
    area: "31 m²",
    type: "Studio",
    status: "available",
    images: [
      "https://images.prop24.com/362505491/Crop600x400",
      "https://images.prop24.com/362505492/Crop600x400",
      "https://images.prop24.com/362505493/Crop600x400"
    ],
    description: "Welcome to a beautifully re-imagined boutique development in the heart of Cape Town's vibrant City Bowl. No transfer duty! Perfect investment opportunity.",
    features: [
      "No Transfer Duty",
      "Exclusive Mandate",
      "City Centre Location",
      "Investment Opportunity",
      "Modern Design",
      "On Show: 03 Sep",
      "Studio Living"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116280718",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "116281167",
    title: "1 Bedroom Apartment in Cape Town City Centre",
    price: "R 3,995,000",
    location: "Cape Town City Centre",
    bedrooms: 1,
    bathrooms: 1,
    area: "49 m²",
    type: "Apartment",
    status: "available",
    images: [
      "https://images.prop24.com/362506741/Crop600x400",
      "https://images.prop24.com/362506742/Crop600x400",
      "https://images.prop24.com/362506743/Crop600x400"
    ],
    description: "Stylish one-bedroom apartment in the heart of the city. No transfer duty! Modern finishes and prime location make this an ideal investment.",
    features: [
      "No Transfer Duty",
      "1 Bedroom",
      "City Centre",
      "Modern Finishes",
      "On Show: 03 Sep",
      "Investment Ready"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116281167",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "116282958",
    title: "2 Bedroom House in Woodstock",
    price: "R 2,695,000",
    location: "Woodstock, Cape Town",
    bedrooms: 2,
    bathrooms: 1,
    area: "145 m²",
    type: "House",
    status: "available",
    images: [
      "https://images.prop24.com/362974581/Crop600x400",
      "https://images.prop24.com/362974582/Crop600x400",
      "https://images.prop24.com/362974583/Crop600x400"
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
      "https://images.prop24.com/362506931/Crop600x400",
      "https://images.prop24.com/362506932/Crop600x400",
      "https://images.prop24.com/362506933/Crop600x400"
    ],
    description: "Step into a thoughtfully designed 1-bedroom apartment with modern finishes and city views. No transfer duty!",
    features: [
      "No Transfer Duty",
      "Modern Design",
      "City Views",
      "On Show: 03 Sep",
      "Prime Location",
      "1 Bedroom"
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
      "https://images.prop24.com/363736991/Crop600x400",
      "https://images.prop24.com/363736992/Crop600x400",
      "https://images.prop24.com/363736993/Crop600x400"
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
      "https://images.prop24.com/362505861/Crop600x400",
      "https://images.prop24.com/362505862/Crop600x400",
      "https://images.prop24.com/362505863/Crop600x400",
      "https://images.prop24.com/362505864/Crop600x400"
    ],
    description: "Located in the vibrant Citybowl precinct, this immaculate penthouse offers the perfect balance of luxury and urban living. No transfer duty!",
    features: [
      "No Transfer Duty",
      "Penthouse",
      "Luxury Living",
      "City Bowl",
      "2.5 Bathrooms",
      "On Show: 03 Sep"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116280871",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "116283204",
    title: "Studio Apartment in Cape Town City Centre",
    price: "R 1,950,000",
    location: "Cape Town City Centre",
    bedrooms: 0.5,
    bathrooms: 1,
    area: "25 m²",
    type: "Studio",
    status: "available",
    images: [
      "https://images.prop24.com/362978431/Crop600x400",
      "https://images.prop24.com/362978432/Crop600x400",
      "https://images.prop24.com/362978433/Crop600x400"
    ],
    description: "No transfer duty! This never-before-owned studio apartment is a compact yet beautifully crafted space, ideal for buyers seeking a low-maintenance city lifestyle.",
    features: [
      "No Transfer Duty",
      "Brand New",
      "Studio",
      "Low Maintenance",
      "City Centre",
      "On Show: 03 Sep",
      "Investment Ready"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116283204",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "116226593",
    title: "2 Bedroom Apartment in Gardens",
    price: "R 4,195,000",
    location: "Gardens, Cape Town",
    bedrooms: 2,
    bathrooms: 1,
    area: "89 m²",
    type: "Apartment",
    status: "available",
    images: [
      "https://images.prop24.com/361421201/Crop600x400",
      "https://images.prop24.com/361421202/Crop600x400",
      "https://images.prop24.com/361421203/Crop600x400"
    ],
    description: "Beautifully renovated 2-bedroom apartment in Nelsons View, Gardens. Stunning city and mountain views with modern finishes throughout.",
    features: [
      "Renovated",
      "Nelsons View",
      "2 Bedrooms",
      "Gardens Location",
      "Mountain Views",
      "On Show: 03 Sep"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/gardens/cape-town/western-cape/9145/116226593",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "116220646",
    title: "Studio Apartment in Cape Town City Centre",
    price: "R 1,699,999",
    location: "Cape Town City Centre",
    bedrooms: 0.5,
    bathrooms: 1,
    area: "42 m²",
    type: "Studio",
    status: "available",
    images: [
      "https://images.prop24.com/361144581/Crop600x400",
      "https://images.prop24.com/361144582/Crop600x400",
      "https://images.prop24.com/361144583/Crop600x400"
    ],
    description: "Charming studio apartment in the historic Company Gardens district. Perfect for city living with easy access to all amenities.",
    features: [
      "Historic District",
      "Company Gardens",
      "Studio Living",
      "City Centre",
      "Investment Opportunity",
      "Walk to Everything"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116220646",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "116200162",
    title: "1 Bedroom Apartment in Cape Town City Centre",
    price: "R 1,799,999",
    location: "Cape Town City Centre",
    bedrooms: 1,
    bathrooms: 1,
    area: "53 m²",
    type: "Apartment",
    status: "available",
    images: [
      "https://images.prop24.com/360417821/Crop600x400",
      "https://images.prop24.com/360417822/Crop600x400",
      "https://images.prop24.com/360417823/Crop600x400"
    ],
    description: "Airbnb-friendly one-bedroom apartment in the heart of the city. Excellent investment potential with strong rental demand.",
    features: [
      "Airbnb-Friendly",
      "1 Bedroom",
      "Investment Property",
      "City Centre",
      "On Show: 02 Sep",
      "High Rental Demand"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116200162",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "116216202",
    title: "1 Bedroom Apartment in Mutual Heights",
    price: "R 1,850,000",
    location: "Cape Town City Centre",
    bedrooms: 1,
    bathrooms: 1,
    area: "61 m²",
    type: "Apartment",
    status: "under-offer",
    images: [
      "https://images.prop24.com/360913421/Crop600x400",
      "https://images.prop24.com/360913422/Crop600x400",
      "https://images.prop24.com/360913423/Crop600x400"
    ],
    description: "Iconic Mutual Heights building. Art Deco charm meets modern convenience in this well-positioned one-bedroom apartment.",
    features: [
      "Mutual Heights",
      "Art Deco Building",
      "1 Bedroom",
      "Under Offer",
      "Historic Building",
      "City Centre"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116216202",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "116155994",
    title: "2 Bedroom House in Woodstock",
    price: "R 2,250,000",
    location: "Woodstock, Cape Town",
    bedrooms: 2,
    bathrooms: 2,
    area: "120 m²",
    type: "House",
    status: "available",
    images: [
      "https://images.prop24.com/359241701/Crop600x400",
      "https://images.prop24.com/359241702/Crop600x400",
      "https://images.prop24.com/359241703/Crop600x400"
    ],
    description: "Character-filled Victorian home in the heart of Woodstock. Original features preserved with modern updates throughout.",
    features: [
      "Victorian Home",
      "2 Bedrooms",
      "2 Bathrooms",
      "Character Features",
      "Woodstock",
      "Investment Potential"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/woodstock/cape-town/western-cape/10164/116155994",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "115843150",
    title: "Investment Studio in Cape Town City Centre",
    price: "R 1,895,000",
    location: "Cape Town City Centre",
    bedrooms: 0.5,
    bathrooms: 1,
    area: "33 m²",
    type: "Studio",
    status: "available",
    images: [
      "https://images.prop24.com/355601231/Crop600x400",
      "https://images.prop24.com/355601232/Crop600x400",
      "https://images.prop24.com/355601233/Crop600x400"
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
      "https://images.prop24.com/353271841/Crop600x400",
      "https://images.prop24.com/353271842/Crop600x400",
      "https://images.prop24.com/353271843/Crop600x400"
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