export interface PGListing {
  _id: string;
  name: string;
  city: string;
  locality: string;
  address: string;
  price: number;
  type: 'boys' | 'girls' | 'co-ed' | 'family';
  description: string;
  images: string[];
  gallery: string[];
  googleMapLink: string;
  amenities: string[];
  roomTypes: string[];
  distance: string;
  availability: 'available' | 'sold-out' | 'coming-soon';
  published: boolean;
  verified: boolean;
  featured: boolean;
  rating: number;
  reviewCount: number;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  ownerId: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServerStatus {
  status: 'online' | 'offline' | 'checking';
  uptime: string;
  responseTime: number;
  lastChecked: string;
  database: 'connected' | 'disconnected';
  apiVersion: string;
}

export interface StatsData {
  total: number;
  published: number;
  draft: number;
  featured: number;
  verified: number;
  boys: number;
  girls: number;
  coed: number;
  family: number;
  avgRating: number;
  totalReviews: number;
  avgPrice: number;
  totalValue: number;
}