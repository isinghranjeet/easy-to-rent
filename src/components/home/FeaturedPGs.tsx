import { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertCircle, Heart, Shield, Home, Wifi } from 'lucide-react';
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

const initialState = {
  girls: [],
  boys: [],
  family: [],
  'co-ed': [],
};

export function FeaturedPGs() {
  const [staysByType, setStaysByType] = useState<Record<string, PGListing[]>>(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStays = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const result = await api.request<any>('/api/pg?limit=20');

      const rawPgs: RawPGData[] =
        result?.data?.items ||
        result?.data ||
        result?.items ||
        [];

      if (!Array.isArray(rawPgs)) throw new Error('Invalid API response');

      const grouped = {
        girls: [] as PGListing[],
        boys: [] as PGListing[],
        family: [] as PGListing[],
        'co-ed': [] as PGListing[],
      };

      for (const raw of rawPgs) {
        const stay = transformPGData(raw);

        if (stay.published === false) continue;

        if (grouped[stay.type]) {
          grouped[stay.type].push(stay);
        }
      }

      const sortFn = (a: PGListing, b: PGListing) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        if (a.rating !== b.rating) return b.rating - a.rating;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      };

      Object.keys(grouped).forEach((key) => {
        grouped[key] = grouped[key].sort(sortFn).slice(0, staysPerType);
      });

      setStaysByType(grouped);

      if (!Object.values(grouped).some(arr => arr.length)) {
        setError('No accommodations found');
      }

    } catch (err: any) {
      console.error(err);
      setError('Failed to load accommodations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStays();
  }, [fetchStays]);

  const transformForCard = useCallback((stay: PGListing) => {
    const amenitiesLower = stay.amenities?.map(a => a.toLowerCase()) || [];

    return {
      id: stay._id,
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
      featured: stay.featured,
      verified: stay.verified,
      wifi: stay.wifi ?? amenitiesLower.some(a => a.includes('wifi')),
      meals: stay.meals ?? amenitiesLower.some(a => a.includes('meal')),
      ac: stay.ac ?? amenitiesLower.some(a => a.includes('ac') || a.includes('air')),
      parking: stay.parking ?? amenitiesLower.some(a => a.includes('park')),
      distance: stay.distance,
    };
  }, []);

  const sections = useMemo(() => [
    {
      title: "Premium Stays for Women",
      subtitle: "Safe, secure, and comfortable living spaces",
      icon: <Heart className="h-4 w-4" />,
      data: staysByType.girls,
      type: "girls",
    },
    {
      title: "Executive Stays for Men",
      subtitle: "Modern residences for professionals",
      icon: <Shield className="h-4 w-4" />,
      data: staysByType.boys,
      type: "boys",
    },
    {
      title: "Family Residences",
      subtitle: "Spacious homes for families",
      icon: <Home className="h-4 w-4" />,
      data: staysByType.family,
      type: "family",
    },
    {
      title: "Co-living Spaces",
      subtitle: "Inclusive accommodations",
      icon: <Wifi className="h-4 w-4" />,
      data: staysByType['co-ed'],
      type: "co-ed",
    },
  ], [staysByType]);

  // ✅ Skeleton Loading
  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">

          {[1, 2, 3, 4].map((section) => (
            <div key={section} className="mb-16">

              <div className="flex justify-between mb-6">
                <div className="space-y-2">
                  <div className="h-6 w-60 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                </div>

                <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border rounded-xl overflow-hidden shadow-sm">

                    <div className="h-48 w-full bg-gray-200 animate-pulse"></div>

                    <div className="p-4 space-y-3">
                      <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>

                      <div className="flex gap-2">
                        <div className="h-6 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="h-6 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="h-6 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                      </div>
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

  // ❌ Error
  if (error) {
    return (
      <div className="text-center p-10">
        <AlertCircle className="mx-auto mb-4 text-orange-600" />
        <p>{error}</p>
        <Button onClick={fetchStays}>Retry</Button>
      </div>
    );
  }

  // ✅ Main UI
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">

        {sections.map(section => {
          if (!section.data.length) return null;

          return (
            <div key={section.type} className="mb-16">

              <div className="flex justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                  <p>{section.subtitle}</p>
                </div>

                <Link to={`/pg?type=${section.type}`}>
                  <Button>
                    View All <ArrowRight />
                  </Button>
                </Link>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {section.data.map((stay) => (
                  <Link key={stay._id} to={`/pg/${stay._id}`}>
                    <PGCard pg={transformForCard(stay)} />
                  </Link>
                ))}
              </div>

            </div>
          );
        })}

      </div>
    </section>
  );
}