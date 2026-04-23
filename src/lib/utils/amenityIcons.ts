import {
  Wifi,
  Utensils,
  Wind,
  Car,
  Shield,
  Zap,
  Dumbbell,
  BookOpen,
  Check,
  Home,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const amenityIconMap: Record<string, LucideIcon> = {
  WiFi: Wifi,
  Meals: Utensils,
  AC: Wind,
  Parking: Car,
  CCTV: Shield,
  'Power Backup': Zap,
  Gym: Dumbbell,
  'Study Room': BookOpen,
  Laundry: Shield,
  '24/7 Security': Shield,
  'Hot Water': Utensils,
  TV: Home,
  Refrigerator: Home,
  Geyser: Zap,
  Cooking: Utensils,
  'Water Purifier': Utensils,
  Housekeeping: Shield,
};

export const getAmenityIconComponent = (amenity: string): LucideIcon => {
  return amenityIconMap[amenity] || Check;
};

