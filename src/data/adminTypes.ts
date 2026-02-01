// data/adminTypes.ts
export interface PGListing {
  _id: string;
  name: string;
  location: {
    type: string;
    coordinates: number[];
  };
  address: string;
  city: string;
  locality: string;
  price: number;
  type: 'boys' | 'girls' | 'co-ed' | 'family';
  rating: number;
  reviewCount: number;
  description: string;
  images: string[];
  amenities: string[];
  roomTypes: string[];
  distance: string;
  availability: string;
  verified: boolean;
  featured: boolean;
  published: boolean;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface PGStats {
  total: number;
  published: number;
  draft: number;
  featured: number;
  verified: number;
  boys: number;
  girls: number;
  coed: number;
}