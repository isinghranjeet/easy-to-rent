export interface PGListing {
  _id: string;
  name: string;
  description: string;
  city: string;
  address: string;
  price: number;
  type: 'boys' | 'girls' | 'co-ed' | 'family';
  images: string[];
  amenities: string[];
  verified: boolean;
  featured: boolean;
  rating: number;
  reviewCount: number;
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  createdAt: string;
  updatedAt?: string;
  slug?: string;
  distance?: string;
  published?: boolean;
  locality?: string;
  totalRooms?: number;
  availableRooms?: number;
  rules?: string[];
  deposit?: number;
  noticePeriod?: number;
}

export interface Review {
  _id: string;
  pgId: string;
  userId: string;
  userName: string;
  userProgram?: string;
  rating: number;
  comment: string;
  verified: boolean;
  createdAt: string;
}

export interface ContactRequest {
  name: string;
  phone: string;
  email: string;
  message: string;
  visitDate: string;
  timeSlot: string;
  pgId: string;
  pgName: string;
}