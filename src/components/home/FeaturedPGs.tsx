import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, AlertCircle } from 'lucide-react';
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

export function FeaturedPGs() {
  const [allPGs, setAllPGs] = useState<PGListing[]>([]);
  const [displayedPGs, setDisplayedPGs] = useState<PGListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const itemsPerPage = 6;

  useEffect(() => {
    fetchPGs();
  }, []);

  const fetchPGs = async () => {
    try {
      setLoading(true);
      setError('');
      
      const result = await api.request<{ success: boolean; data?: { items: RawPGData[] } | RawPGData[]; items?: RawPGData[]; message?: string }>('/api/pg?limit=20');
      
      let rawPgs: RawPGData[] = [];
      
      if (result.success) {
        if (result.data?.items && Array.isArray(result.data.items)) {
          rawPgs = result.data.items;
        }
        else if (Array.isArray(result.data)) {
          rawPgs = result.data;
        }
        else if (Array.isArray(result.items)) {
          rawPgs = result.items;
        }
      } else {
        throw new Error(result.message || 'Failed to fetch PGs');
      }

      const pgs: PGListing[] = rawPgs.map(transformPGData);
      
      const publishedPGs = pgs.filter(pg => pg.published !== false);
      
      if (publishedPGs.length === 0) {
        setError('No PGs found');
        setAllPGs([]);
        setDisplayedPGs([]);
        return;
      }
      
      setAllPGs(publishedPGs);
      updateDisplayedPGs(publishedPGs);
      
    } catch (err: any) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const updateDisplayedPGs = (pgs: PGListing[]) => {
    const sortedPGs = [...pgs].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      
      if ((a.rating || 0) > (b.rating || 0)) return -1;
      if ((a.rating || 0) < (b.rating || 0)) return 1;
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    const initialCount = Math.min(itemsPerPage, sortedPGs.length);
    setDisplayedPGs(sortedPGs.slice(0, initialCount));
  };

  const transformForPGCard = (pg: PGListing) => {
    return {
      id: pg._id || pg.id || '',
      name: pg.name,
      slug: pg.slug || pg._id,
      description: pg.description,
      price: pg.price,
      images: pg.images || [],
      gallery: pg.gallery || [],
      city: pg.city,
      locality: pg.locality,
      type: pg.type,
      amenities: pg.amenities || [],
      rating: pg.rating || 0,
      reviewCount: pg.reviewCount || 0,
      ownerName: pg.ownerName,
      ownerPhone: pg.ownerPhone,
      featured: pg.featured || false,
      verified: pg.verified || false,
      wifi: pg.wifi || pg.amenities?.some(a => a.toLowerCase().includes('wifi')) || false,
      meals: pg.meals || pg.amenities?.some(a => a.toLowerCase().includes('meal')) || false,
      ac: pg.ac || pg.amenities?.some(a => a.toLowerCase().includes('ac') || a.toLowerCase().includes('air')) || false,
      parking: pg.parking || pg.amenities?.some(a => a.toLowerCase().includes('park')) || false,
      distance: pg.distance,
    };
  };

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-orange-50/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div className="animate-pulse">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-8 w-64 bg-gray-200 rounded mt-2"></div>
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white border rounded-xl overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-orange-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center py-12 border-2 border-dashed border-orange-200 rounded-2xl bg-white">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {error}
            </p>
            <Button 
              onClick={fetchPGs}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white to-orange-50/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-4 py-2 bg-orange-100 text-orange-700 rounded-full border border-orange-200">
              <Star className="h-4 w-4 fill-orange-500" />
              <span className="text-sm font-medium uppercase tracking-wider">
                Featured
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Featured Accommodations
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/pg">
              <Button className="bg-orange-600 hover:bg-orange-700 gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {displayedPGs.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl bg-white">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-2xl">🏠</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No PGs Available</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              There are no accommodations available at the moment.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedPGs.map((pg, index) => (
                <Link key={pg._id || pg.id || index} to={`/pg/${pg._id || pg.id}`} className="w-full">
                  <div className="relative">
                    {pg.featured && (
                      <div className="absolute top-3 left-3 z-10">
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full shadow-sm">
                          <Star className="h-3 w-3 fill-white" />
                          Featured
                        </div>
                      </div>
                    )}
                    <PGCard pg={transformForPGCard(pg)} index={index} />
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}