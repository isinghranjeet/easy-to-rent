import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, AlertCircle, Heart, Shield, Home, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PGCard } from '@/components/pg/PGCard';
import { api } from '@/services/api';
import { RawPGData, transformPGData } from '@/lib/utils/pgTransformer';

interface PGListing {
  _id: string;
  id?: string;
  name: string;
  slug?: string;
  description: string;
  city: string;
  locality: string;
  address: string;
  price: number;
  type: 'boys' | 'girls' | 'co-ed' | 'family';
  images: string[];
  gallery?: string[];
  amenities: string[];
  verified: boolean;
  featured: boolean;
  rating: number;
  reviewCount: number;
  ownerName?: string;
  ownerPhone?: string;
  wifi?: boolean;
  meals?: boolean;
  ac?: boolean;
  parking?: boolean;
  createdAt: string;
  distance?: string;
  published?: boolean;
}

const staysPerType = 3;

export function FeaturedPGs() {
  const [staysByType, setStaysByType] = useState<Record<string, PGListing[]>>({
    girls: [],
    boys: [],
    family: [],
    'co-ed': [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStays();
  }, []);

  const fetchStays = async () => {
    try {
      setLoading(true);
      setError('');
      
      const result = await api.request<{
        success: boolean;
        data?: { items: RawPGData[] } | RawPGData[];
        items?: RawPGData[];
        message?: string;
      }>('/api/pg?limit=20');

      let rawPgs: RawPGData[] = [];
      if (result.success) {
        if (result.data?.items && Array.isArray(result.data.items)) rawPgs = result.data.items;
        else if (Array.isArray(result.data)) rawPgs = result.data;
        else if (Array.isArray(result.items)) rawPgs = result.items;
      } else {
        throw new Error(result.message || 'Failed to fetch accommodations');
      }

      const stays: PGListing[] = rawPgs.map(transformPGData);
      const publishedStays = stays.filter(stay => stay.published !== false);

      if (publishedStays.length === 0) {
        setError('No accommodations found');
        setStaysByType({ girls: [], boys: [], family: [], 'co-ed': [] });
        return;
      }

      const sortStays = (stays: PGListing[]) =>
        [...stays].sort((a, b) => {
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          if (ratingA !== ratingB) return ratingB - ratingA;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

      setStaysByType({
        girls: sortStays(publishedStays.filter(s => s.type === 'girls')).slice(0, staysPerType),
        boys: sortStays(publishedStays.filter(s => s.type === 'boys')).slice(0, staysPerType),
        family: sortStays(publishedStays.filter(s => s.type === 'family')).slice(0, staysPerType),
        'co-ed': sortStays(publishedStays.filter(s => s.type === 'co-ed')).slice(0, staysPerType),
      });
    } catch (err: any) {
      console.error('Error fetching accommodations:', err);
      setError('Failed to load accommodations');
    } finally {
      setLoading(false);
    }
  };

  const transformForCard = (stay: PGListing) => ({
    id: stay._id || stay.id || '',
    name: stay.name,
    slug: stay.slug || stay._id,
    description: stay.description,
    price: stay.price,
    images: stay.images || [],
    gallery: stay.gallery || [],
    city: stay.city,
    locality: stay.locality,
    type: stay.type,
    amenities: stay.amenities || [],
    rating: stay.rating || 0,
    reviewCount: stay.reviewCount || 0,
    ownerName: stay.ownerName,
    ownerPhone: stay.ownerPhone,
    featured: stay.featured || false,
    verified: stay.verified || false,
    wifi: stay.wifi || stay.amenities?.some(a => a.toLowerCase().includes('wifi')) || false,
    meals: stay.meals || stay.amenities?.some(a => a.toLowerCase().includes('meal')) || false,
    ac: stay.ac || stay.amenities?.some(a => a.toLowerCase().includes('ac') || a.toLowerCase().includes('air')) || false,
    parking: stay.parking || stay.amenities?.some(a => a.toLowerCase().includes('park')) || false,
    distance: stay.distance,
  });

  const renderSection = (title: string, subtitle: string, icon: React.ReactNode, stays: PGListing[], type: string, badgeText: string) => {
    if (stays.length === 0) return null;

    return (
      <div className="mb-20 last:mb-0">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-4 py-2 bg-orange-100 text-orange-700 rounded-full">
              {icon}
              <span className="text-sm font-medium uppercase tracking-wider">{badgeText}</span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-600 mt-2">{subtitle}</p>
          </div>
          <Link to={`/pg?type=${type}`}>
            <Button className="gap-2 bg-orange-600 hover:bg-orange-700 text-white shadow-md transition-all duration-300">
              View All {title.split(' ')[0]} Stays
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stays.map((stay, index) => (
            <Link key={stay._id || stay.id || index} to={`/pg/${stay._id || stay.id}`} className="w-full group">
              <div className="relative transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl rounded-xl bg-white border border-orange-100 overflow-hidden">
                {stay.featured && (
                  <div className="absolute top-3 left-3 z-10">
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full shadow-md">
                      <Star className="h-3 w-3 fill-white" />
                      Featured
                    </div>
                  </div>
                )}
                <PGCard pg={transformForCard(stay)} index={index} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  // ─── Loading Skeleton ──────────────────────────────
  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-orange-50/30">
        <div className="container mx-auto px-4">
          {[1, 2, 3, 4].map((section) => (
            <div key={section} className="mb-16 animate-pulse">
              <div className="h-6 w-32 bg-orange-200 rounded mb-2"></div>
              <div className="h-8 w-48 bg-orange-200 rounded mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white border border-orange-100 rounded-xl overflow-hidden">
                    <div className="h-48 bg-orange-100"></div>
                    <div className="p-4">
                      <div className="h-4 bg-orange-100 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-orange-100 rounded w-1/2 mb-4"></div>
                      <div className="h-8 bg-orange-100 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // ─── Error ──────────────────────────────
  if (error) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-orange-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center py-12 border-2 border-dashed border-orange-200 rounded-2xl bg-white">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Accommodations</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">{error}</p>
            <Button onClick={fetchStays} className="bg-orange-600 hover:bg-orange-700 text-white">
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // ─── Empty ──────────────────────────────
  const hasAnyStays = Object.values(staysByType).some(arr => arr.length > 0);
  if (!hasAnyStays) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-orange-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center py-12 border-2 border-dashed border-orange-200 rounded-2xl bg-white">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-2xl">🏠</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Accommodations Available</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              There are no stays available at the moment. Please check back later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ─── Render All Sections ──────────────────────────────
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-orange-50/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-3 px-4 py-2 bg-orange-100 text-orange-700 rounded-full border border-orange-200">
            <Star className="h-4 w-4 fill-orange-500" />
            <span className="text-sm font-medium uppercase tracking-wider">Premium Living Spaces</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Featured Accommodations
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Discover our handpicked selection of premium stays tailored to your lifestyle needs
          </p>
        </div>

        {renderSection("Premium Stays for Women", "Safe, secure, and comfortable living spaces with 24/7 security", <Heart className="h-4 w-4" />, staysByType.girls, "girls", "Women's Exclusive")}
        {renderSection("Executive Stays for Men", "Modern residences designed for young professionals and students", <Shield className="h-4 w-4" />, staysByType.boys, "boys", "Trending Now")}
        {renderSection("Family Residences", "Spacious homes away from home for your loved ones", <Home className="h-4 w-4" />, staysByType.family, "family", "Family Friendly")}
        {renderSection("Co-living Spaces", "Inclusive accommodations for everyone", <Wifi className="h-4 w-4" />, staysByType['co-ed'], "co-ed", "Premium Choice")}
      </div>
    </section>
  );
}