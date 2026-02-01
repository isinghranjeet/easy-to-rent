export interface PGListing {
  id: string;
  slug: string;
  name: string;
  type: 'boys' | 'girls' | 'co-ed';
  price: number;
  originalPrice?: number;
  location: string;
  address: string;
  distance: string;
  rating: number;
  reviewCount: number;
  images: string[];
  amenities: string[];
  description: string;
  roomTypes: string[];
  meals: boolean;
  wifi: boolean;
  ac: boolean;
  parking: boolean;
  laundry: boolean;
  security: boolean;
  furnished: boolean;
  availability: 'available' | 'limited' | 'full';
  featured: boolean;
  verified: boolean;
  ownerName: string;
  ownerPhone: string;
}

export const pgListings: PGListing[] = [
  {
    id: '1',
    slug: 'sunrise-boys-pg',
    name: 'Sunrise Boys PG',
    type: 'boys',
    price: 8500,
    originalPrice: 10000,
    location: 'Near Gate 1',
    address: '23, University Road, Near Gate 1',
    distance: '0.3 km',
    rating: 4.8,
    reviewCount: 124,
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    ],
    amenities: ['WiFi', 'AC', 'Meals', 'Laundry', 'Parking', 'CCTV', 'Power Backup'],
    description: 'Premium boys PG with all modern amenities. Located just 300m from the main campus gate with 24/7 security and home-cooked meals.',
    roomTypes: ['Single', 'Double', 'Triple'],
    meals: true,
    wifi: true,
    ac: true,
    parking: true,
    laundry: true,
    security: true,
    furnished: true,
    availability: 'available',
    featured: true,
    verified: true,
    ownerName: 'Mr. Sharma',
    ownerPhone: '+91 98765 43210',
  },
  {
    id: '2',
    slug: 'lakshmi-girls-hostel',
    name: 'Lakshmi Girls Hostel',
    type: 'girls',
    price: 9000,
    location: 'Library Road',
    address: '45, Library Road, CU Campus',
    distance: '0.5 km',
    rating: 4.9,
    reviewCount: 89,
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800',
    ],
    amenities: ['WiFi', 'AC', 'Meals', 'Laundry', 'CCTV', 'Power Backup', 'Gym'],
    description: 'Safe and secure girls hostel with excellent facilities. Walking distance to library and academic blocks.',
    roomTypes: ['Single', 'Double'],
    meals: true,
    wifi: true,
    ac: true,
    parking: false,
    laundry: true,
    security: true,
    furnished: true,
    availability: 'limited',
    featured: true,
    verified: true,
    ownerName: 'Mrs. Gupta',
    ownerPhone: '+91 98765 43211',
  },
  {
    id: '3',
    slug: 'green-valley-pg',
    name: 'Green Valley PG',
    type: 'co-ed',
    price: 7500,
    location: 'Sports Complex',
    address: '12, Sports Complex Road',
    distance: '0.8 km',
    rating: 4.5,
    reviewCount: 67,
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
      'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800',
      'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800',
    ],
    amenities: ['WiFi', 'Meals', 'Laundry', 'CCTV', 'Study Room'],
    description: 'Affordable co-ed accommodation with separate floors for boys and girls. Great for students who prefer a mixed environment.',
    roomTypes: ['Double', 'Triple'],
    meals: true,
    wifi: true,
    ac: false,
    parking: true,
    laundry: true,
    security: true,
    furnished: true,
    availability: 'available',
    featured: false,
    verified: true,
    ownerName: 'Mr. Singh',
    ownerPhone: '+91 98765 43212',
  },
  {
    id: '4',
    slug: 'premium-student-living',
    name: 'Premium Student Living',
    type: 'boys',
    price: 12000,
    originalPrice: 14000,
    location: 'Near Cafeteria',
    address: '8, Main Campus Road',
    distance: '0.2 km',
    rating: 4.7,
    reviewCount: 156,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    ],
    amenities: ['WiFi', 'AC', 'Meals', 'Laundry', 'Parking', 'CCTV', 'Gym', 'Swimming Pool'],
    description: 'Luxury accommodation for students seeking premium comfort. Features include swimming pool, gym, and gourmet meals.',
    roomTypes: ['Single', 'Double'],
    meals: true,
    wifi: true,
    ac: true,
    parking: true,
    laundry: true,
    security: true,
    furnished: true,
    availability: 'available',
    featured: true,
    verified: true,
    ownerName: 'Mr. Kapoor',
    ownerPhone: '+91 98765 43213',
  },
  {
    id: '5',
    slug: 'budget-friendly-stay',
    name: 'Budget Friendly Stay',
    type: 'boys',
    price: 5500,
    location: 'Back Gate Area',
    address: '67, Back Gate Road',
    distance: '1.2 km',
    rating: 4.2,
    reviewCount: 45,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
      'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800',
    ],
    amenities: ['WiFi', 'Meals', 'CCTV'],
    description: 'Affordable option for budget-conscious students. Basic amenities with clean and comfortable rooms.',
    roomTypes: ['Triple', 'Dormitory'],
    meals: true,
    wifi: true,
    ac: false,
    parking: false,
    laundry: false,
    security: true,
    furnished: true,
    availability: 'available',
    featured: false,
    verified: true,
    ownerName: 'Mr. Verma',
    ownerPhone: '+91 98765 43214',
  },
  {
    id: '6',
    slug: 'sakura-girls-residence',
    name: 'Sakura Girls Residence',
    type: 'girls',
    price: 11000,
    location: 'Near Admin Block',
    address: '34, Admin Block Lane',
    distance: '0.4 km',
    rating: 4.9,
    reviewCount: 203,
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
      'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800',
      'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800',
    ],
    amenities: ['WiFi', 'AC', 'Meals', 'Laundry', 'Parking', 'CCTV', 'Gym', 'Yoga Room'],
    description: 'Premium girls-only residence with spa-like amenities. Features include yoga room, beauty salon, and organic meals.',
    roomTypes: ['Single', 'Double'],
    meals: true,
    wifi: true,
    ac: true,
    parking: true,
    laundry: true,
    security: true,
    furnished: true,
    availability: 'limited',
    featured: true,
    verified: true,
    ownerName: 'Mrs. Mehta',
    ownerPhone: '+91 98765 43215',
  },
];

export const locations = [
  'All Locations',
  'Near Gate 1',
  'Library Road',
  'Sports Complex',
  'Near Cafeteria',
  'Back Gate Area',
  'Near Admin Block',
];

export const amenitiesList = [
  'WiFi',
  'AC',
  'Meals',
  'Laundry',
  'Parking',
  'CCTV',
  'Power Backup',
  'Gym',
  'Study Room',
  'Swimming Pool',
];

export const priceRanges = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under ₹6,000', min: 0, max: 6000 },
  { label: '₹6,000 - ₹8,000', min: 6000, max: 8000 },
  { label: '₹8,000 - ₹10,000', min: 8000, max: 10000 },
  { label: 'Above ₹10,000', min: 10000, max: Infinity },
];
