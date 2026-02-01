import { PGListing } from '@/types/pg';

export const calculatePriceWithDiscount = (
  basePrice: number,
  months: number
): { finalPrice: number; discount: number; savings: number } => {
  let discount = 0;
  
  if (months >= 12) {
    discount = 20;
  } else if (months >= 6) {
    discount = 15;
  } else if (months >= 3) {
    discount = 10;
  }
  
  const total = basePrice * months;
  const savings = (total * discount) / 100;
  const finalPrice = total - savings;
  
  return {
    finalPrice: Math.round(finalPrice),
    discount,
    savings: Math.round(savings),
  };
};

export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

export const getAmenityIcon = (amenity: string): string => {
  const iconMap: Record<string, string> = {
    'WiFi': 'Wifi',
    'Meals': 'Utensils',
    'AC': 'Wind',
    'Parking': 'Car',
    'CCTV': 'Shield',
    'Power Backup': 'Zap',
    'Gym': 'Dumbbell',
    'Study Room': 'BookOpen',
    'Laundry': 'Droplets',
    'Swimming Pool': 'Droplets',
    'Yoga Room': 'Sun',
    '24/7 Security': 'Lock',
    'Hot Water': 'Droplets',
    'TV': 'Video',
    'Refrigerator': 'Home',
    'Geyser': 'Zap',
    'Cooking': 'Utensils',
    'Water Purifier': 'Droplets',
    'Housekeeping': 'Shield',
    'Medical': 'Shield',
  };
  
  return iconMap[amenity] || 'Check';
};

export const filterListings = (
  listings: PGListing[],
  filters: {
    type: string;
    minPrice: string;
    maxPrice: string;
    search: string;
    amenities: string[];
    city: string;
    verified: boolean;
    featured: boolean;
  }
): PGListing[] => {
  return listings.filter(listing => {
    // Type filter
    if (filters.type !== 'all' && listing.type !== filters.type) {
      return false;
    }
    
    // Price filter
    if (filters.minPrice && listing.price < parseInt(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && listing.price > parseInt(filters.maxPrice)) {
      return false;
    }
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matches = 
        listing.name.toLowerCase().includes(searchLower) ||
        listing.address.toLowerCase().includes(searchLower) ||
        listing.description.toLowerCase().includes(searchLower) ||
        listing.city.toLowerCase().includes(searchLower);
      if (!matches) return false;
    }
    
    // City filter
    if (filters.city && !listing.city.toLowerCase().includes(filters.city.toLowerCase())) {
      return false;
    }
    
    // Amenities filter
    if (filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every(amenity => 
        listing.amenities?.includes(amenity)
      );
      if (!hasAllAmenities) return false;
    }
    
    // Verified filter
    if (filters.verified && !listing.verified) {
      return false;
    }
    
    // Featured filter
    if (filters.featured && !listing.featured) {
      return false;
    }
    
    return true;
  });
};

export const sortListings = (
  listings: PGListing[],
  sortBy: string
): PGListing[] => {
  const sorted = [...listings];
  
  switch (sortBy) {
    case 'price-low':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    default: // recommended
      sorted.sort((a, b) => {
        const scoreA = (a.featured ? 100 : 0) + (a.verified ? 50 : 0) + (a.rating * 10);
        const scoreB = (b.featured ? 100 : 0) + (b.verified ? 50 : 0) + (b.rating * 10);
        return scoreB - scoreA;
      });
  }
  
  return sorted;
};