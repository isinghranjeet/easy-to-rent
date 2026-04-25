import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Home, ArrowRight } from 'lucide-react';
import { PGCard } from '@/components/pg/PGCard';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import { cn } from '@/lib/utils';

interface PG {
  _id: string;
  id?: string;
  name: string;
  price: number;
  city: string;
  locality?: string;
  images: string[];
  rating: number;
  type: 'boys' | 'girls' | 'co-ed' | 'family';
  featured?: boolean;
  verified?: boolean;
  amenities?: string[];
  description?: string;
  slug?: string;
  address?: string;
  ownerName?: string;
  ownerPhone?: string;
  distance?: string;
  availableRooms?: number;
  minStay?: string;
  wifi?: boolean;
  meals?: boolean;
  ac?: boolean;
  parking?: boolean;
  virtualTour?: string;
  reviewCount?: number;
}

interface SimilarPGsProps {
  currentPgId: string;
  city: string;
  type: string;
}

export const SimilarPGs = ({ currentPgId, city, type }: SimilarPGsProps) => {
  const [similarPgs, setSimilarPgs] = useState<PG[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSimilarPGs();
  }, [currentPgId, city, type]);

  const fetchSimilarPGs = async () => {
    try {
      setLoading(true);
      const response = await api.getPGs({
        city,
        type,
        limit: 5,
        sort: '-rating',
        published: true,
      });

      if (response.success && response.data?.items) {
        // Filter out current PG and limit to 4
        const filtered = (response.data.items as PG[])
          .filter((pg) => pg._id !== currentPgId && pg.id !== currentPgId)
          .slice(0, 4);
        setSimilarPgs(filtered);
      }
    } catch (error) {
      console.error('Error fetching similar PGs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!loading && similarPgs.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-b from-white to-orange-50/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 rounded-full mb-4">
            <MapPin className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-600">Near You</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Similar Properties You May Like
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            More {type} PGs in {city} with great amenities and affordable pricing
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-xl h-48 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Similar PGs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarPgs.map((pg, idx) => (
                <PGCard
                  key={pg._id}
                  pg={{
                    id: pg._id,
                    _id: pg._id,
                    name: pg.name,
                    slug: pg.slug,
                    description: pg.description,
                    city: pg.city,
                    locality: pg.locality,
                    address: pg.address,
                    price: pg.price,
                    images: pg.images || [],
                    gallery: [],
                    type: pg.type,
                    amenities: pg.amenities || [],
                    rating: pg.rating || 0,
                    reviewCount: pg.reviewCount || 0,
                    ownerName: pg.ownerName,
                    ownerPhone: pg.ownerPhone,
                    featured: pg.featured,
                    verified: pg.verified,
                    distance: pg.distance,
                    availableRooms: pg.availableRooms,
                    minStay: pg.minStay,
                    wifi: pg.amenities?.includes('WiFi') || pg.amenities?.includes('wifi'),
                    meals: pg.amenities?.includes('Meals') || pg.amenities?.includes('meals'),
                    ac: pg.amenities?.includes('AC') || pg.amenities?.includes('Air Conditioning'),
                    parking: pg.amenities?.includes('Parking') || pg.amenities?.includes('parking'),
                    virtualTour: pg.virtualTour,
                  }}
                  index={idx}
                />
              ))}
            </div>

            {/* View All Link */}
            <div className="text-center mt-8">
              <Link to={`/pg?city=${encodeURIComponent(city)}&type=${encodeURIComponent(type)}`}>
                <Button variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50">
                  View All {type} PGs in {city} <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

