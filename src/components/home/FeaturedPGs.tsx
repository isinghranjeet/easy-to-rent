import { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertCircle, Heart, Shield, Home, Wifi, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PGCard } from '@/components/pg/PGCard';
import { api } from '@/services/api';
import { RawPGData, transformPGData } from '@/lib/utils/pgTransformer';
import { toast } from 'sonner';

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
  const [retryCount, setRetryCount] = useState(0);

  const fetchStays = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      // ✅ Use correct API endpoint
      const result = await api.getPGs({ limit: 20, published: true });
      
      console.log('FeaturedPGs API Response:', result);

      let rawPgs: RawPGData[] = [];

      if (result.success && result.data) {
        rawPgs = result.data.items || [];
      } else if (Array.isArray(result)) {
        rawPgs = result;
      } else if (result.items && Array.isArray(result.items)) {
        rawPgs = result.items;
      } else if (result.data && Array.isArray(result.data)) {
        rawPgs = result.data;
      }

      if (!rawPgs.length) {
        console.warn('No PGs found in response');
        setStaysByType(initialState);
        setLoading(false);
        return;
      }

      const grouped = {
        girls: [] as PGListing[],
        boys: [] as PGListing[],
        family: [] as PGListing[],
        'co-ed': [] as PGListing[],
      };

      for (const raw of rawPgs) {
        try {
          const stay = transformPGData(raw);
          
          // Skip if not published
          if (stay.published === false) continue;
          
          // Skip if no type
          if (!stay.type) continue;
          
          // Add to respective group
          if (grouped[stay.type]) {
            grouped[stay.type].push(stay);
          }
        } catch (err) {
          console.error('Error transforming PG:', raw, err);
        }
      }

      // Sort: featured first, then by rating, then by newest
      const sortFn = (a: PGListing, b: PGListing) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        if (a.rating !== b.rating) return (b.rating || 0) - (a.rating || 0);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      };

      // Sort and limit each type
      Object.keys(grouped).forEach((key) => {
        grouped[key] = grouped[key].sort(sortFn).slice(0, staysPerType);
      });

      setStaysByType(grouped);

      // Check if any section has data
      const hasData = Object.values(grouped).some(arr => arr.length > 0);
      if (!hasData) {
        setError('No accommodations found. Please add some PG listings first.');
      } else {
        toast.success(`Loaded ${rawPgs.length} properties`);
      }

    } catch (err: any) {
      console.error('FeaturedPGs fetch error:', err);
      setError(err.message || 'Failed to load accommodations');
      toast.error('Failed to load featured properties');
    } finally {
      setLoading(false);
    }
  }, [retryCount]);

  useEffect(() => {
    fetchStays();
  }, [fetchStays, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const transformForCard = useCallback((stay: PGListing) => {
    const amenitiesLower = stay.amenities?.map(a => a.toLowerCase()) || [];

    return {
      id: stay._id,
      name: stay.name,
      slug: stay.slug || stay._id,
      description: stay.description || 'Comfortable accommodation with all amenities',
      price: stay.price,
      images: stay.images || [],
      gallery: stay.gallery || [],
      city: stay.city,
      locality: stay.locality || stay.city,
      type: stay.type,
      amenities: stay.amenities || [],
      rating: stay.rating || 0,
      reviewCount: stay.reviewCount || 0,
      ownerName: stay.ownerName,
      ownerPhone: stay.ownerPhone,
      featured: stay.featured || false,
      verified: stay.verified || false,
      wifi: stay.wifi ?? amenitiesLower.some(a => a.includes('wifi') || a.includes('internet')),
      meals: stay.meals ?? amenitiesLower.some(a => a.includes('meal') || a.includes('food')),
      ac: stay.ac ?? amenitiesLower.some(a => a.includes('ac') || a.includes('air conditioning')),
      parking: stay.parking ?? amenitiesLower.some(a => a.includes('park') || a.includes('parking')),
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
      bgColor: "from-pink-50 to-rose-50",
      iconColor: "text-pink-600"
    },
    {
      title: "Executive Stays for Men",
      subtitle: "Modern residences for professionals",
      icon: <Shield className="h-4 w-4" />,
      data: staysByType.boys,
      type: "boys",
      bgColor: "from-blue-50 to-cyan-50",
      iconColor: "text-blue-600"
    },
    {
      title: "Family Residences",
      subtitle: "Spacious homes for families",
      icon: <Home className="h-4 w-4" />,
      data: staysByType.family,
      type: "family",
      bgColor: "from-emerald-50 to-teal-50",
      iconColor: "text-emerald-600"
    },
    {
      title: "Co-living Spaces",
      subtitle: "Inclusive accommodations for everyone",
      icon: <Wifi className="h-4 w-4" />,
      data: staysByType['co-ed'],
      type: "co-ed",
      bgColor: "from-purple-50 to-indigo-50",
      iconColor: "text-purple-600"
    },
  ], [staysByType]);

  // ✅ Skeleton Loading
  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mx-auto mb-3"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mx-auto"></div>
          </div>

          {[1, 2, 3, 4].map((section) => (
            <div key={section} className="mb-16">
              <div className="flex justify-between items-center mb-6">
                <div className="space-y-2">
                  <div className="h-6 w-60 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white border rounded-xl overflow-hidden shadow-sm">
                    <div className="h-48 w-full bg-gray-200 animate-pulse"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                      <div className="flex gap-2">
                        <div className="h-6 w-12 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="h-6 w-12 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="h-6 w-12 bg-gray-200 rounded-full animate-pulse"></div>
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

  // ❌ Error State
  if (error) {
    return (
      <div className="text-center py-16 bg-gray-50">
        <div className="max-w-md mx-auto">
          <AlertCircle className="mx-auto mb-4 h-16 w-16 text-orange-500" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Properties</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <Button onClick={handleRetry} className="bg-orange-600 hover:bg-orange-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // ✅ Check if any section has data
  const hasAnyData = sections.some(section => section.data.length > 0);

  if (!hasAnyData) {
    return (
      <div className="text-center py-16 bg-gray-50">
        <div className="max-w-md mx-auto">
          <Home className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Available</h3>
          <p className="text-gray-500 mb-6">Check back later for new accommodations.</p>
          <Button onClick={handleRetry} variant="outline">Refresh</Button>
        </div>
      </div>
    );
  }

  // ✅ Main UI
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Featured Accommodations
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the best PGs near Chandigarh University, curated just for you
          </p>
        </div>

        {sections.map(section => {
          if (!section.data.length) return null;

          return (
            <div key={section.type} className="mb-16 last:mb-0">
              {/* Section Header with Gradient */}
              <div className={`bg-gradient-to-r ${section.bgColor} rounded-2xl p-6 mb-6`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl bg-white shadow-sm ${section.iconColor}`}>
                      {section.icon}
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                        {section.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {section.subtitle}
                      </p>
                    </div>
                  </div>
                  <Link to={`/pg?type=${section.type}`}>
                    <Button variant="outline" className="bg-white hover:bg-gray-50">
                      View All ({section.data.length}+)
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Property Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.data.map((stay, index) => (
                  <div 
                    key={stay._id} 
                    className="transform transition-all duration-300 hover:-translate-y-1"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Link to={`/pg/${stay._id}`} className="block h-full">
                      <PGCard pg={transformForCard(stay)} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Bottom CTA */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600 mb-4">Looking for more options?</p>
          <Link to="/pg">
            <Button size="lg" className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700">
              Browse All Properties
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// Add RefreshCw import if not present
import { RefreshCw } from 'lucide-react';