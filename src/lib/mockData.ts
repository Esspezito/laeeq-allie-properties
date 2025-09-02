import { Property, AgentProfile } from '@/types/property';

export const agentProfile: AgentProfile = {
  name: "La'eeq Allie",
  title: "Property Specialist",
  company: "Greeff Christie's International Real Estate",
  phone: "+27 82 123 4567",
  email: "laeeq@greeff.co.za",
  officePhone: "+27 21 763 4120",
  address: "Greeff House, 262 Main Road, Kenilworth, Cape Town, 7708",
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
    "Vredehoek"
  ],
  profileImage: "/A-16.jpg",
  achievements: [
    "Silver Club Member",
    "Part of Christie's International Real Estate network",
    "Specialist in City Bowl properties",
    "Expert in investment and Airbnb potential properties",
    "Exclusive mandate specialist"
  ]
};

export const mockProperties: Property[] = [
  {
    id: "116280718",
    title: "0.5 Bedroom Apartment / Flat for Sale in Cape Town City Centre",
    price: "R 2,995,000",
    location: "Cape Town City Centre",
    bedrooms: 0.5,
    bathrooms: 1,
    area: "31 m²",
    type: "Studio",
    status: "available",
    images: [
      "https://images.prop24.com/362320551/Crop600x400"
    ],
    description: "Welcome to a beautifully re-imagined boutique development in the heart of Cape Town's vibrant City Bowl. This never-before-owned studio bedroom apartment is fully furnished and Airbnb-ready.",
    features: [
      "Fully furnished",
      "Private 12m² balcony", 
      "Herringbone flooring",
      "Designer kitchen",
      "Open-plan layout",
      "Airbnb-ready"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116280718",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "116281167",
    title: "1 Bedroom Apartment / flat for sale in Cape Town City Centre",
    price: "R 3,995,000",
    location: "Cape Town City Centre",
    bedrooms: 1,
    bathrooms: 1,
    area: "49 m²",
    type: "Apartment",
    status: "available",
    images: [
      "https://images.prop24.com/362327447/Crop600x400"
    ],
    description: "Set within a newly launched boutique development in the heart of Cape Town's City Bowl, this never-before-owned one-bedroom apartment combines functionality with standout design, ideal for city living or a prime investment opportunity.",
    features: [
      "Steel blue kitchen cabinetry",
      "Integrated oven", 
      "Marble-look countertops",
      "Central kitchen island",
      "Walk-in shower",
      "No transfer duty"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116281167",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "116282958",
    title: "2 Bedroom House for Sale in Woodstock",
    price: "R 2,695,000",
    location: "Woodstock, Cape Town", 
    bedrooms: 2,
    bathrooms: 1,
    area: "145 m²",
    type: "House",
    status: "available",
    images: [
      "https://images.prop24.com/362551801/Crop600x400"
    ],
    description: "Tucked away on Balfour Street in Upper Woodstock, this two bedroom, one bathroom home presents a unique opportunity to own in one of Cape Town's most dynamic and evolving neighbourhoods.",
    features: [
      "Pet friendly",
      "Built-in home bar",
      "Covered entertainment area",
      "Upper Woodstock location",
      "Close to coffee shops and galleries",
      "Potential for value-adding updates"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/woodstock/cape-town/western-cape/10164/116282958",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "116281209",
    title: "1 Bedroom Apartment / Flat for Sale in Cape Town City Centre",
    price: "R 3,995,000",
    location: "Cape Town City Centre",
    bedrooms: 1,
    bathrooms: 1,
    area: "47 m²",
    type: "Apartment",
    status: "available",
    images: [
      "https://images.prop24.com/362328219/Crop600x400"
    ],
    description: "Step into a thoughtfully designed 1-bedroom apartment that blends everyday comfort with standout features, perfectly positioned in the beating heart of Cape Town's City Centre.",
    features: [
      "Stylish kitchen with built-in oven",
      "Spacious central island",
      "Walk-in shower",
      "Ample built-in cupboards",
      "No transfer duty",
      "Exclusive Mandate"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116281209",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "116296190",
    title: "1 Bedroom Apartment / Flat for Sale in Gardens",
    price: "R 2,199,999",
    location: "Gardens, Cape Town",
    bedrooms: 1,
    bathrooms: 1,
    area: "49 m²",
    type: "Apartment",
    status: "under-offer",
    images: [
      "https://images.prop24.com/363736991/Crop600x400"
    ],
    description: "Located on a quiet and secure street in the heart of Gardens, this stylish one bedroom apartment ticks all the right boxes, with beautiful Table Mountain views, secure parking, and full Airbnb-friendly flexibility.",
    features: [
      "Fully furnished",
      "Table Mountain views",
      "Secure parking",
      "Open-plan layout",
      "Airbnb-friendly",
      "Under Offer"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/gardens/cape-town/western-cape/9145/116296190",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "116280871",
    title: "2 Bedroom Apartment / flat for sale in Cape Town City Centre",
    price: "R 6,950,000",
    location: "Cape Town City Centre",
    bedrooms: 2,
    bathrooms: 2.5,
    area: "93 m²",
    type: "Apartment",
    status: "available",
    images: [
      "https://images.prop24.com/362323143/Crop600x400"
    ],
    description: "Located in the vibrant Citybowl precinct, this immaculate penthouse offers the perfect balance of luxury and urban convenience, just steps from Bree, Long, and Loop Street's top cafés, restaurants, and cultural attractions.",
    features: [
      "Fully furnished penthouse",
      "2 bedrooms with en-suite bathrooms",
      "34m² balcony with views",
      "High-end modern finishes",
      "Citybowl location",
      "Exclusive mandate"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116280871",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "116283204", 
    title: "0.5 Bedroom Apartment / Flat for Sale in Cape Town City Centre",
    price: "R 1,950,000",
    location: "Cape Town City Centre",
    bedrooms: 0.5,
    bathrooms: 1,
    area: "25 m²",
    type: "Studio",
    status: "available",
    images: [
      "https://images.prop24.com/362978431/Crop600x400"
    ],
    description: "This never-before-owned studio apartment is a compact yet beautifully crafted space, ideal for buyers seeking a low-maintenance city base or a savvy investment in a high-demand location.",
    features: [
      "Near Greenmarket Square",
      "Herringbone flooring",
      "Marble-inspired surfaces", 
      "French clay pink kitchen cabinetry",
      "Large windows",
      "Open-plan layout"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116283204",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "116226593",
    title: "2 Bedroom Apartment / Flat for Sale in Gardens",
    price: "R 4,195,000",
    location: "Gardens, Cape Town",
    bedrooms: 2,
    bathrooms: 1,
    area: "89 m²",
    type: "Apartment",
    status: "available",
    images: [
      "https://images.prop24.com/361424611/Crop600x400"
    ],
    description: "Nestled in the serene and well-maintained Nelsons View, this beautifully renovated two-bedroom, one-bathroom apartment offers the perfect blend of comfort, style, and flexibility, ideal for both homeowners and investors.",
    features: [
      "Airbnb-friendly building",
      "Mountain views", 
      "Built-in cupboards",
      "Open-plan living area",
      "Renovated kitchen",
      "One secure parking bay"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/gardens/cape-town/western-cape/9145/116226593",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "116220646",
    title: "0.5 Bedroom Apartment / Flat for Sale in Cape Town City Centre",
    price: "R 1,699,999",
    location: "Cape Town City Centre",
    bedrooms: 0.5,
    bathrooms: 1,
    area: "42 m²",
    type: "Studio",
    status: "available",
    images: [
      "https://images.prop24.com/361593377/Crop600x400"
    ],
    description: "Located in the historic Company Gardens district of Cape Town, this stylish studio apartment offers exceptional city living in the sought-after St Martini Gardens.",
    features: [
      "Airbnb-friendly building",
      "Communal pool",
      "Garden with fish pond",
      "Dedicated braai area",
      "24-hour security",
      "Private balcony with Table Mountain views"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116220646",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "116200162",
    title: "1 Bedroom Apartment / Flat for Sale in Cape Town City Centre",
    price: "R 1,799,999",
    location: "Cape Town City Centre",
    bedrooms: 1,
    bathrooms: 1,
    area: "53 m²",
    type: "Apartment",
    status: "available",
    images: [
      "https://images.prop24.com/360998181/Crop600x400"
    ],
    description: "Ideally located in the heart of Cape Town's vibrant City Bowl, this bright and airy Airbnb-friendly apartment offers the perfect balance of comfort, convenience, and style.",
    features: [
      "Secure undercover parking",
      "Spacious store room",
      "24-hour security",
      "Open-plan living and dining area",
      "Juliet balcony",
      "Fully furnished"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116200162",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "116216202",
    title: "1 Bedroom Apartment / Flat for Sale in Cape Town City Centre",
    price: "R 1,850,000",
    location: "Cape Town City Centre",
    bedrooms: 1,
    bathrooms: 1,
    area: "61 m²",
    type: "Apartment",
    status: "under-offer",
    images: [
      "https://images.prop24.com/360913421/Crop600x400"
    ],
    description: "Located in the iconic Mutual Heights building in the heart of Cape Town's City Bowl, this stylishly renovated one-bedroom duplex apartment offers a unique blend of character, modern design, and income potential.",
    features: [
      "Secure parking bay",
      "24-hour security",
      "Airbnb-friendly building",
      "Shared gym and pool",
      "Renovated duplex",
      "Mutual Heights building"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116216202",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "116155994",
    title: "2 Bedroom House for Sale in Woodstock",
    price: "R 2,250,000",
    location: "Woodstock, Cape Town",
    bedrooms: 2,
    bathrooms: 1,
    area: "123 m²",
    type: "House",
    status: "available",
    images: [
      "https://images.prop24.com/360263014/Crop600x400"
    ],
    description: "Welcome to this beautifully maintained two-bedroom, one-bathroom home tucked away in the heart of Upper Woodstock, a perfect balance of modern finishes and timeless character.",
    features: [
      "Original wooden flooring",
      "Built-in cupboards in bedrooms",
      "Open-plan kitchen and living area",
      "Spacious patio",
      "Pet friendly",
      "Fireplace in first bedroom"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/woodstock/cape-town/western-cape/10164/116155994",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "115943244",
    title: "1 Bedroom Apartment / flat for sale in Cape Town City Centre",
    price: "R 4,495,000",
    location: "Cape Town City Centre",
    bedrooms: 1,
    bathrooms: 1,
    area: "66 m²",
    type: "Apartment",
    status: "available",
    images: [
      "https://images.prop24.com/356704291/Crop600x400"
    ],
    description: "Unlock prime returns with this beautifully designed one-bedroom apartment in Cape Town's most iconic Airbnb-friendly building, 16 on Bree.",
    features: [
      "Located at 16 Bree Street",
      "Rooftop pool",
      "Gym",
      "Bar on 27th floor",
      "Private balcony",
      "Table Mountain and harbour views"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115943244",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "115843150",
    title: "0.5 Bedroom Apartment / Flat for Sale in Cape Town City Centre",
    price: "R 1,850,000",
    location: "Cape Town City Centre",
    bedrooms: 0.5,
    bathrooms: 1,
    area: "33 m²",
    type: "Studio",
    status: "available",
    images: [
      "https://images.prop24.com/355601231/Crop600x400"
    ],
    description: "Generating R370,000 of revenue in the past 12 months, this stunning investment studio could be yours today. Located in the heart of Cape Town on vibrant Loop Street, this modern studio apartment in The Carrington offers an unbeatable investment opportunity.",
    features: [
      "Airbnb-friendly studio",
      "The Carrington building",
      "Generates R370,000 annual revenue",
      "Fully furnished",
      "Biometric building access",
      "Rooftop relaxation area"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115843150",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "115629416",
    title: "1 Bedroom Apartment / Flat for Sale in Cape Town City Centre",
    price: "R 2,999,999",
    location: "Cape Town City Centre",
    bedrooms: 1,
    bathrooms: 1,
    area: "41 m²",
    type: "Apartment",
    status: "under-offer",
    images: [
      "https://images.prop24.com/353271841/Crop600x400"
    ],
    description: "Discover luxury urban living in this beautifully renovated and stylishly furnished one-bedroom, one-bathroom apartment in the iconic 16 on Bree.",
    features: [
      "Secure parking",
      "Table Mountain views",
      "Rooftop pool and bar",
      "Fully-equipped gym", 
      "24-hour concierge and security",
      "16 on Bree building"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115629416",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "115518432",
    title: "0.5 Bedroom Apartment / Flat for Sale in Cape Town City Centre",
    price: "R 1,695,000",
    location: "Cape Town City Centre",
    bedrooms: 0.5,
    bathrooms: 1,
    area: "25 m²",
    type: "Studio",
    status: "available",
    images: [
      "https://images.prop24.com/348932451/Crop600x400"
    ],
    description: "Discover the epitome of urban living in this modern studio apartment, located in the vibrant heart of Cape Town's CBD. This stylish space boasts neat and contemporary finishes, ensuring a comfortable and chic lifestyle.",
    features: [
      "Cape Town City Centre",
      "Pool available",
      "24-hour security", 
      "State-of-the-art gym",
      "Rooftop area with panoramic views",
      "Airbnb friendly"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115518432",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "115437832",
    title: "0.5 Bedroom Apartment / Flat for Sale in Cape Town City Centre",
    price: "R 1,849,500",
    location: "Cape Town City Centre",
    bedrooms: 0.5,
    bathrooms: 1,
    area: "37 m²",
    type: "Studio",
    status: "available",
    images: [
      "https://images.prop24.com/343347524/Crop600x400"
    ],
    description: "High-Yield Airbnb Investment – Two Identical Units for Sale. These premium apartments in The Duke generate approximately R300,000 annually per unit through Airbnb, making them an exceptional investment opportunity.",
    features: [
      "The Duke building",
      "Rooftop communal area",
      "Rooftop pool",
      "Furnished",
      "Prime City Centre location",
      "High potential Airbnb investment"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115437832",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "115488888",
    title: "0.5 Bedroom Apartment / Flat for Sale in Cape Town City Centre",
    price: "R 1,849,500",
    location: "Cape Town City Centre",
    bedrooms: 0.5,
    bathrooms: 1,
    area: "37 m²",
    type: "Studio",
    status: "available",
    images: [
      "https://images.prop24.com/349836494/Crop600x400"
    ],
    description: "Profitable Airbnb Investment – Two Modern Apartments for Sale. These stylish apartments in The Duke generate approximately R300,000 annually per unit through Airbnb, offering an excellent return on investment.",
    features: [
      "The Duke development",
      "Potential Airbnb investment property",
      "Rooftop communal space",
      "Rooftop pool",
      "Close to Bree Street",
      "Close to V&A Waterfront"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115488888",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "115285887",
    title: "4 Bedroom House for Sale in Gardens",
    price: "R 5,895,000",
    location: "Gardens, Cape Town",
    bedrooms: 4,
    bathrooms: 5,
    area: "175 m²",
    type: "House",
    status: "available",
    images: [
      "https://images.prop24.com/346789012/Crop600x400"
    ],
    description: "Step into a sanctuary of elegance and light, nestled in the highly sought-after suburb of Gardens. This sunlit, multi-level masterpiece boasts breathtaking views of Table Mountain and the vibrant cityscape, offering a lifestyle of unparalleled sophistication.",
    features: [
      "Panoramic views of Table Mountain",
      "3 stories with 4 bedrooms",
      "Each bedroom has en-suite bathroom",
      "Central courtyard",
      "Chef's kitchen with premium appliances",
      "Solar geyser"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/gardens/cape-town/western-cape/9145/115285887",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "115311090",
    title: "0.5 Bedroom Apartment / Flat for Sale in Cape Town City Centre",
    price: "R 1,595,000",
    location: "Cape Town City Centre",
    bedrooms: 0.5,
    bathrooms: 1,
    area: "26 m²",
    type: "Studio",
    status: "available",
    images: [
      "https://images.prop24.com/347411552/Crop600x400"
    ],
    description: "Step into luxury with this modern studio apartment located in The Carrington on Loop Street. Perfectly positioned in the heart of Cape Town's vibrant city centre, this property offers a blend of style, convenience, and exceptional investment potential.",
    features: [
      "Airbnb-friendly",
      "The Carrington building",
      "Prime Loop Street location",
      "24-hour concierge services",
      "Biometric access",
      "Rooftop communal area"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115311090",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "114942423",
    title: "1 Bedroom Apartment / Flat for Sale in Cape Town City Centre",
    price: "R 2,895,000",
    location: "Cape Town City Centre",
    bedrooms: 1,
    bathrooms: 2,
    area: "95 m²",
    type: "Apartment",
    status: "available",
    images: [
      "https://images.prop24.com/341234567/Crop600x400"
    ],
    description: "Experience the perfect blend of elegance and convenience in this 1-bedroom, 2-bathroom double-story apartment located in the prestigious The Adderley in Cape Town's CBD.",
    features: [
      "The Adderley building",
      "Double-story apartment",
      "2 secure parking bays",
      "Private storeroom",
      "Rooftop pool",
      "Well-equipped gym"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/114942423",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "114046864",
    title: "0.5 Bedroom Apartment / Flat for Sale in Woodstock",
    price: "R 1,350,000",
    location: "Woodstock, Cape Town",
    bedrooms: 0.5,
    bathrooms: 1,
    area: "36 m²",
    type: "Studio",
    status: "available",
    images: [
      "https://images.prop24.com/327464785/Crop600x400"
    ],
    description: "Welcome to your new home in the vibrant neighborhood of Woodstock, Cape Town. This contemporary studio apartment offers an ideal blend of style, convenience, and breathtaking views of Table Mountain.",
    features: [
      "Fully furnished",
      "One parking space",
      "Modern finishes",
      "Spectacular Table Mountain views",
      "Open-plan layout",
      "Airbnb-friendly"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/woodstock/cape-town/western-cape/10164/114046864",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  }
];