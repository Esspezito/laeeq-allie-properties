export interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  type: string;
  status?: 'available' | 'under-offer' | 'sold';
  images: string[];
  description?: string;
  features?: string[];
  source: 'property24' | 'privateproperty';
  sourceUrl: string;
  agentName?: string;
  agentContact?: string;
}

export interface AgentProfile {
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  officePhone?: string;
  address?: string;
  bio: string;
  specializations: string[];
  areas: string[];
  profileImage: string;
  achievements?: string[];
}