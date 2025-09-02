# Allie Realty - Real Estate Website

A modern, interactive real estate website showcasing La'eeq Allie's property listings from Property24.

## 🏡 Features

### Property Listings
- **Interactive Property Grid**: Displays all current listings with high-quality images
- **Property Cards**: Show key information (price, location, bedrooms, bathrooms, size)
- **Status Indicators**: Visual badges for availability (Available, Under Offer)
- **Source Links**: Direct links to view properties on Property24 or PrivateProperty
- **Advanced Filtering**: Search by location, property type, status, and bedrooms

### Agent Profile
- **Professional Bio**: Detailed information about La'eeq Allie
- **Contact Information**: Multiple ways to reach the agent (phone, email, office)
- **Specializations**: Areas of expertise and service locations
- **Achievements**: Professional credentials and accomplishments

### Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion animations for enhanced user experience
- **Interactive Elements**: Hover effects, transitions, and micro-interactions
- **Modern Styling**: Clean design using shadcn/ui components and Tailwind CSS

### Interactive Features
- **Floating Action Buttons**: Quick access to call or WhatsApp the agent
- **Scroll to Top**: Easy navigation for long pages
- **Dynamic Navigation**: Changes appearance based on scroll position
- **Loading States**: Skeleton loading for better perceived performance

## 🚀 Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Image Optimization**: Next.js Image component

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── agent/          # Agent profile API
│   │   └── properties/     # Properties API
│   ├── about/             # About page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── Hero.tsx           # Hero section
│   ├── Navigation.tsx     # Main navigation
│   ├── PropertyCard.tsx   # Property listing card
│   ├── PropertyFilters.tsx # Filtering system
│   ├── InteractiveFeatures.tsx # Floating actions
│   └── LoadingSpinner.tsx # Loading animation
├── lib/
│   ├── mockData.ts        # Sample property data
│   └── utils.ts           # Utility functions
└── types/
    └── property.ts        # TypeScript interfaces
```

## 🏃‍♂️ Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:3003`

## 📱 Pages

### Home Page (`/`)
- Hero section with agent introduction
- Property listings grid with filtering
- Statistics section
- Footer with contact information

### About Page (`/about`)
- Agent profile and bio
- Contact information
- Specializations and service areas
- Call-to-action sections

## 🔌 API Endpoints

### `/api/properties`
Returns all property listings with the following structure:
```json
{
  "success": true,
  "properties": [...],
  "total": 7,
  "agent": "La'eeq Allie"
}
```

### `/api/agent`
Returns agent profile information:
```json
{
  "success": true,
  "agent": {
    "name": "La'eeq Allie",
    "title": "Property Specialist",
    "company": "Greeff Christie's International Real Estate",
    ...
  }
}
```

## 🎨 Design System

The website uses a modern design system with:
- **Primary Color**: Blue (#3b82f6)
- **Typography**: System font stack
- **Spacing**: Consistent 8px grid
- **Border Radius**: Rounded corners (8px)
- **Shadows**: Subtle elevation
- **Animations**: Smooth 300ms transitions

## 📊 Property Data

Currently using data representing La'eeq Allie's actual listings:
- 22 properties
- Price range: R1.35M - R6.95M
- Locations: Cape Town City Centre, Gardens, Woodstock
- Property types: Studios, Apartments, Houses, Duplexes

## 🔗 External Links

All property cards link directly to their source listings on:
- Property24.com
- PrivateProperty.co.za

## 🚀 Deployment

The website can be deployed on:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Digital Ocean**
- **AWS**

For production deployment:
```bash
npm run build
npm start
```

## 📞 Contact Integration

The website includes multiple contact methods:
- **Phone**: Direct calling links
- **Email**: mailto links
- **WhatsApp**: Direct messaging
- **Office**: Physical address display

## 🔮 Future Enhancements

Potential improvements for production:
- Real-time scraping from Property24 and PrivateProperty
- Property favorites and comparison
- Virtual tour integration
- Lead capture forms
- Blog/news section
- Property valuation tools
- Neighborhood information
- Market insights

## 📄 License

This project is created for La'eeq Allie - Greeff Christie's International Real Estate.

---

**Built with ❤️ for luxury real estate in Cape Town**