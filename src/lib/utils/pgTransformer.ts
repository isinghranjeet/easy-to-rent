// src/lib/utils/pgTransformer.ts

export interface RawPGData {
  _id?: string;
  id?: string;
  name?: string;
  description?: string;
  city?: string;
  address?: string;
  price?: number;
  type?: 'boys' | 'girls' | 'co-ed' | 'family';
  images?: string[];
  amenities?: string[];
  verified?: boolean;
  featured?: boolean;
  rating?: number;
  reviewCount?: number;
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  createdAt?: string;
  distance?: string;
  locality?: string;
  location?: {
    type: string;
    coordinates: number[];
  };
  slug?: string;
}

export interface TransformedPG {
  _id: string;
  id?: string;
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
  distance?: string;
  locality?: string;
  location?: string;
  slug?: string;
  // Derived fields for comparison
  wifi?: boolean;
  meals?: boolean;
  ac?: boolean;
  parking?: boolean;
}

export const transformPGData = (listing: RawPGData): TransformedPG => {
  // Ensure we have valid images
  let images = ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80'];
  if (Array.isArray(listing.images) && listing.images.length > 0) {
    images = listing.images.filter((img: string) => img && img.trim() !== '');
    if (images.length === 0) {
      images = ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80'];
    }
  }
  
  // Ensure we have valid amenities
  let amenities = ['WiFi', 'Power Backup'];
  if (Array.isArray(listing.amenities) && listing.amenities.length > 0) {
    amenities = listing.amenities.filter((a: string) => a && a.trim() !== '');
    if (amenities.length === 0) {
      amenities = ['WiFi', 'Power Backup'];
    }
  }
  
  // Map amenities to boolean fields
  const wifi = amenities.some(a => a.toLowerCase().includes('wifi'));
  const meals = amenities.some(a => a.toLowerCase().includes('meal'));
  const ac = amenities.some(a => a.toLowerCase().includes('ac') || a.toLowerCase().includes('air'));
  const parking = amenities.some(a => a.toLowerCase().includes('park'));
  
  return {
    _id: listing._id?.toString() || listing.id?.toString() || Math.random().toString(),
    id: listing._id?.toString() || listing.id?.toString(),
    name: listing.name || 'Premium PG',
    description: listing.description || 'Comfortable accommodation with amenities',
    city: listing.city || 'Chandigarh',
    address: listing.address || 'Location',
    price: listing.price || 0,
    type: (listing.type as 'boys' | 'girls' | 'co-ed' | 'family') || 'boys',
    images: images,
    amenities: amenities,
    verified: Boolean(listing.verified),
    featured: Boolean(listing.featured),
    rating: listing.rating || 4.0,
    reviewCount: listing.reviewCount || 0,
    ownerName: listing.ownerName || 'Owner',
    ownerPhone: listing.ownerPhone || '',
    ownerEmail: listing.ownerEmail || '',
    createdAt: listing.createdAt || new Date().toISOString(),
    distance: listing.distance || 'Near CU',
    locality: listing.locality || listing.city,
    location: listing.city || listing.locality,
    slug: listing._id?.toString() || listing.id?.toString(),
    // Derived fields
    wifi,
    meals,
    ac,
    parking
  };
};