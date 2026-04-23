import type { PGListing, Review } from '@/services/api';

export interface Location {
  type: string;
  coordinates: number[];
  address: string;
  placeId?: string;
}

export interface NearbyPlace {
  name: string;
  type: string;
  distance: string;
  duration?: string;
}

export interface RoomDetail {
  type: string;
  price: number;
  size: string;
  available: number;
  description: string;
}

export interface BookingData {
  name: string;
  phone: string;
  email: string;
  message: string;
  moveInDate: string;
}

export type { PGListing, Review };

