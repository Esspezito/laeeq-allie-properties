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
      "https://images.prop24.com/362320551/Crop600x400",
      "https://images.prop24.com/362320552/Crop600x400",
      "https://images.prop24.com/362320553/Crop600x400"
    ],
    description: "Welcome to a beautifully re-imagined boutique development in the heart of Cape Town's vibrant City Bowl. This never-before-owned studio bedroom apartment is fully furnished and Airbnb-ready.",
    features: [
      "Fully furnished",
      "Private 12m² balcony",
      "Herringbone flooring",
      "Open-plan layout",
      "Designer kitchen",
      "No transfer duty"
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
      "https://images.prop24.com/362328219/Crop600x400",
      "https://images.prop24.com/362328220/Crop600x400",
      "https://images.prop24.com/362328221/Crop600x400"
    ],
    description: "Set within a newly launched boutique development in the heart of Cape Town's City Bowl, this never-before-owned one-bedroom apartment combines functionality with standout design.",
    features: [
      "Steel blue kitchen cabinetry",
      "Integrated oven",
      "Marble-look countertops",
      "Central kitchen island",
      "Walk-in shower",
      "Built-in cupboard space"
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
      "https://images.prop24.com/362551801/Crop600x400",
      "https://images.prop24.com/362551802/Crop600x400",
      "https://images.prop24.com/362551803/Crop600x400"
    ],
    description: "Tucked away on Balfour Street in Upper Woodstock, this two bedroom, one bathroom home presents a unique opportunity to own in one of Cape Town's most dynamic and evolving neighbourhoods.",
    features: [
      "Classic built-in home bar",
      "Two bedrooms",
      "Central living room",
      "Covered entertainment area",
      "Pet friendly",
      "Close to local coffee shops"
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
      "https://images.prop24.com/362328219/Crop600x400",
      "https://images.prop24.com/362328220/Crop600x400",
      "https://images.prop24.com/362328221/Crop600x400"
    ],
    description: "Step into a thoughtfully designed 1-bedroom apartment that blends everyday comfort with standout features, perfectly positioned in the beating heart of Cape Town's City Centre.",
    features: [
      "Stylish kitchen with built-in oven",
      "Central kitchen island",
      "Plenty of natural light",
      "Walk-in shower",
      "Ample built-in cupboards",
      "Ideal location in City Bowl"
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
    description: "Located on a quiet and secure street in the heart of Gardens, this stylish one bedroom apartment ticks all the right boxes, with beautiful Table Mountain views, secure parking, and full Airbnb-friendly flexibility.",
    features: [
      "Fully furnished",
      "Table Mountain views",
      "Secure parking",
      "Open-plan layout",
      "Built-in kitchen appliances",
      "Airbnb-friendly"
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
      "https://images.prop24.com/362323143/Crop600x400",
      "https://images.prop24.com/362323144/Crop600x400",
      "https://images.prop24.com/362323145/Crop600x400"
    ],
    description: "Located in the vibrant Citybowl precinct, this immaculate penthouse offers the perfect balance of luxury and urban convenience, just steps from Bree, Long, and Loop Street's top cafés, restaurants, and cultural attractions.",
    features: [
      "Fully furnished",
      "High-end modern finishes",
      "Open-plan living",
      "Designer kitchen",
      "34m² balcony with views",
      "Secure building"
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
    description: "This never-before-owned studio apartment is a compact yet beautifully crafted space, ideal for buyers seeking a low-maintenance city base or a savvy investment in a high-demand location.",
    features: [
      "Herringbone flooring",
      "Marble-inspired surfaces",
      "French clay pink kitchen",
      "Large windows",
      "Open-plan layout",
      "Near Greenmarket Square"
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
      "https://images.prop24.com/361424611/Crop600x400",
      "https://images.prop24.com/361424612/Crop600x400",
      "https://images.prop24.com/361424613/Crop600x400"
    ],
    description: "Nestled in the serene and well-maintained Nelsons View, this beautifully renovated two-bedroom, one-bathroom apartment offers the perfect blend of comfort, style, and flexibility.",
    features: [
      "Airbnb-friendly building",
      "Mountain views",
      "Built-in cupboards",
      "Open-plan living area",
      "Renovated bathroom",
      "Secure parking bay"
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
      "https://images.prop24.com/361593377/Crop600x400",
      "https://images.prop24.com/361593378/Crop600x400",
      "https://images.prop24.com/361593379/Crop600x400"
    ],
    description: "Located in the historic Company Gardens district of Cape Town, this stylish studio apartment offers exceptional city living in the sought-after St Martini Gardens.",
    features: [
      "Private balcony with views",
      "Airbnb-friendly building",
      "Communal pool",
      "Tranquil garden",
      "24-hour security",
      "On-site laundry"
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
      "https://images.prop24.com/360998181/Crop600x400",
      "https://images.prop24.com/360998182/Crop600x400",
      "https://images.prop24.com/360998183/Crop600x400"
    ],
    description: "Ideally located in the heart of Cape Town's vibrant City Bowl, this bright and airy Airbnb-friendly apartment offers the perfect balance of comfort, convenience, and style.",
    features: [
      "Modern kitchen",
      "Open-plan living",
      "Sliding doors to balcony",
      "Secure undercover parking",
      "Spacious store room",
      "24-hour security"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/116200162",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "116216202",
    title: "1 Bedroom Duplex in Mutual Heights",
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
    description: "Located in the iconic Mutual Heights building in the heart of Cape Town's City Bowl, this stylishly renovated one-bedroom duplex apartment offers a unique blend of character, modern design, and income potential.",
    features: [
      "Secure parking bay",
      "24-hour security",
      "Airbnb-friendly",
      "Shared gym and pool",
      "Modern kitchen",
      "Loft-style bedroom"
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
    bathrooms: 1,
    area: "123 m²",
    type: "House",
    status: "available",
    images: [
      "https://images.prop24.com/360263014/Crop600x400",
      "https://images.prop24.com/360263015/Crop600x400",
      "https://images.prop24.com/360263016/Crop600x400"
    ],
    description: "Welcome to this beautifully maintained two-bedroom, one-bathroom home tucked away in the heart of Upper Woodstock, a perfect balance of modern finishes and timeless character.",
    features: [
      "Original wooden flooring",
      "Fireplace in first bedroom",
      "Built-in cupboards",
      "Open-plan kitchen",
      "Spacious patio",
      "Pet-friendly"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/woodstock/cape-town/western-cape/10164/116155994",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "115943244",
    title: "1 Bedroom Apartment in 16 on Bree",
    price: "R 4,495,000",
    location: "Cape Town City Centre",
    bedrooms: 1,
    bathrooms: 1,
    area: "66 m²",
    type: "Apartment",
    status: "available",
    images: [
      "https://images.prop24.com/356704291/Crop600x400",
      "https://images.prop24.com/356704292/Crop600x400",
      "https://images.prop24.com/356704293/Crop600x400"
    ],
    description: "Unlock prime returns with this beautifully designed one-bedroom apartment in Cape Town's most iconic Airbnb-friendly building, 16 on Bree.",
    features: [
      "Private balcony",
      "Rooftop pool",
      "Gym",
      "Bar on 27th floor",
      "Panoramic views",
      "Heart of Bree Street"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115943244",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "115843150",
    title: "Investment Studio in The Carrington",
    price: "R 1,850,000",
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
    description: "Generating R370,000 of revenue in the past 12 months, this stunning investment studio could be yours today.",
    features: [
      "The Carrington building",
      "Fully furnished",
      "Biometric access",
      "Rooftop relaxation area",
      "Communal braai space",
      "Airbnb-friendly"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115843150",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "115629416",
    title: "1 Bedroom Apartment in 16 on Bree",
    price: "R 2,999,999",
    location: "Cape Town City Centre",
    bedrooms: 1,
    bathrooms: 1,
    area: "41 m²",
    type: "Apartment",
    status: "under-offer",
    images: [
      "https://images.prop24.com/353271841/Crop600x400",
      "https://images.prop24.com/353271842/Crop600x400",
      "https://images.prop24.com/353271843/Crop600x400"
    ],
    description: "Discover luxury urban living in this beautifully renovated and stylishly furnished one-bedroom, one-bathroom apartment in the iconic 16 on Bree.",
    features: [
      "Secure parking",
      "Table Mountain views",
      "Rooftop pool and bar",
      "Fully-equipped gym",
      "24-hour concierge",
      "Biometric access"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115629416",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "115518432",
    title: "Modern Studio in CBD",
    price: "R 1,695,000",
    location: "Cape Town City Centre",
    bedrooms: 0.5,
    bathrooms: 1,
    area: "25 m²",
    type: "Studio",
    status: "available",
    images: [
      "https://images.prop24.com/348932451/Crop600x400",
      "https://images.prop24.com/348932452/Crop600x400",
      "https://images.prop24.com/348932453/Crop600x400"
    ],
    description: "Discover the epitome of urban living in this modern studio apartment, located in the vibrant heart of Cape Town's CBD.",
    features: [
      "Pool",
      "24-hour security",
      "State-of-the-art gym",
      "Rooftop area",
      "Air conditioning",
      "Airbnb friendly"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115518432",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "115437832",
    title: "High-Yield Studio in The Duke",
    price: "R 1,849,500",
    location: "Cape Town City Centre",
    bedrooms: 0.5,
    bathrooms: 1,
    area: "37 m²",
    type: "Studio",
    status: "available",
    images: [
      "https://images.prop24.com/343347524/Crop600x400",
      "https://images.prop24.com/343347525/Crop600x400",
      "https://images.prop24.com/343347526/Crop600x400"
    ],
    description: "High-Yield Airbnb Investment – Two Identical Units for Sale. These premium apartments in The Duke generate approximately R300,000 annually per unit through Airbnb.",
    features: [
      "Rooftop communal area",
      "Rooftop pool",
      "Furnished",
      "City center location",
      "High rental potential",
      "Close to restaurants"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115437832",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "115488888",
    title: "Profitable Studio in The Duke",
    price: "R 1,849,500",
    location: "Cape Town City Centre",
    bedrooms: 0.5,
    bathrooms: 1,
    area: "37 m²",
    type: "Studio",
    status: "available",
    images: [
      "https://images.prop24.com/349836494/Crop600x400",
      "https://images.prop24.com/349836495/Crop600x400",
      "https://images.prop24.com/349836496/Crop600x400"
    ],
    description: "Profitable Airbnb Investment – Two Modern Apartments for Sale in The Duke building.",
    features: [
      "The Duke building",
      "Rooftop communal space",
      "Rooftop pool",
      "High-end finishes",
      "City view",
      "Airbnb investment"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115488888",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "115285887",
    title: "4 Bedroom House in Gardens",
    price: "R 5,895,000",
    location: "Gardens, Cape Town",
    bedrooms: 4,
    bathrooms: 5,
    area: "175 m²",
    type: "House",
    status: "available",
    images: [
      "https://images.prop24.com/346789012/Crop600x400",
      "https://images.prop24.com/346789013/Crop600x400",
      "https://images.prop24.com/346789014/Crop600x400"
    ],
    description: "Step into a sanctuary of elegance and light, nestled in the highly sought-after suburb of Gardens. This sunlit, multi-level masterpiece boasts breathtaking views of Table Mountain and the vibrant cityscape.",
    features: [
      "Panoramic Table Mountain views",
      "Four en-suite bedrooms",
      "Fireplaces in each bedroom",
      "Handcrafted terracotta tiles",
      "Central courtyard",
      "Solar geyser"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/gardens/cape-town/western-cape/9145/115285887",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "115311090",
    title: "Studio in The Carrington",
    price: "R 1,595,000",
    location: "Cape Town City Centre",
    bedrooms: 0.5,
    bathrooms: 1,
    area: "26 m²",
    type: "Studio",
    status: "available",
    images: [
      "https://images.prop24.com/347411552/Crop600x400",
      "https://images.prop24.com/347411553/Crop600x400",
      "https://images.prop24.com/347411554/Crop600x400"
    ],
    description: "Step into luxury with this modern studio apartment located in The Carrington on Loop Street. Perfectly positioned in the heart of Cape Town's vibrant city centre.",
    features: [
      "Airbnb-friendly",
      "High-quality finishes",
      "Functional kitchen",
      "Rooftop communal area",
      "24-hour concierge",
      "Biometric access"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/115311090",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "114942423",
    title: "1 Bedroom Duplex in The Adderley",
    price: "R 2,895,000",
    location: "Cape Town City Centre",
    bedrooms: 1,
    bathrooms: 2,
    area: "95 m²",
    type: "Apartment",
    status: "available",
    images: [
      "https://images.prop24.com/341234567/Crop600x400",
      "https://images.prop24.com/341234568/Crop600x400",
      "https://images.prop24.com/341234569/Crop600x400"
    ],
    description: "Experience the perfect blend of elegance and convenience in this 1-bedroom, 2-bathroom double-story apartment located in the prestigious The Adderley in Cape Town's CBD.",
    features: [
      "Two secure parking bays",
      "Private storeroom",
      "Open-plan layout",
      "Rooftop pool",
      "Well-equipped gym",
      "No pets allowed"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/cape-town-city-centre/cape-town/western-cape/9138/114942423",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  },
  {
    id: "114046864",
    title: "Studio Apartment in Woodstock",
    price: "R 1,350,000",
    location: "Woodstock, Cape Town",
    bedrooms: 0.5,
    bathrooms: 1,
    area: "36 m²",
    type: "Studio",
    status: "available",
    images: [
      "https://images.prop24.com/327464785/Crop600x400",
      "https://images.prop24.com/327464786/Crop600x400",
      "https://images.prop24.com/327464787/Crop600x400"
    ],
    description: "Welcome to your new home in the vibrant neighborhood of Woodstock, Cape Town. This contemporary studio apartment offers an ideal blend of style, convenience, and breathtaking views of Table Mountain.",
    features: [
      "Fully furnished",
      "One parking space",
      "Modern finishes",
      "Open-plan layout",
      "Table Mountain views",
      "Airbnb-friendly"
    ],
    source: "property24",
    sourceUrl: "https://www.property24.com/for-sale/woodstock/cape-town/western-cape/10164/114046864",
    agentName: "La'eeq Allie",
    agentContact: "+27 82 123 4567"
  }
];