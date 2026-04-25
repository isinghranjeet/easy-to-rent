/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertCircle, Heart, Shield, Home, Wifi, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PGCard } from '@/components/pg/PGCard';
import { api } from '@/services/api';
import { transformPGData } from '@/lib/utils/pgTransformer';

const staysPerType = 3;

const initialState = {
  girls: [],
  boys: [],
  family: [],
  'co-ed': [],
};

// ✅ Skeleton Card
const PGCardSkeleton = () => (
  <div className="bg-white border rounded-xl overflow-hidden shadow-sm animate-pulse">
    <div className="h-48 bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-5 w-3/4 bg-gray-200 rounded" />
      <div className="h-4 w-1/2 bg-gray-200 rounded" />
      <div className="h-6 w-1/3 bg-gray-200 rounded" />
      <div className="flex gap-2">
        <div className="h-6 w-10 bg-gray-200 rounded-full" />
        <div className="h-6 w-10 bg-gray-200 rounded-full" />
        <div className="h-6 w-10 bg-gray-200 rounded-full" />
      </div>
    </div>
  </div>
);

// ✅ Image filter (outside for performance)
const filterRealImages = (images: string[] = []) => {
  const fake = ['placeholder', 'dummy', 'unsplash', 'picsum'];
  return images.filter(img => img && img.length > 10 && !fake.some(f => img.toLowerCase().includes(f)));
};

export function FeaturedPGs() {
  const [staysByType, setStaysByType] = useState<any>(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const hasFetched = useRef(false);
  const cache = useRef<any>(null);

  const fetchStays = useCallback(async () => {
    try {
      if (cache.current) {
        setStaysByType(cache.current);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      const result = await api.getPGs({ limit: 20, published: true });
      const rawPgs = result?.data?.items || [];

      if (!rawPgs.length) {
        setStaysByType(initialState);
        return;
      }

      const grouped = {
        girls: [],
        boys: [],
        family: [],
        'co-ed': [],
      };

      rawPgs.forEach((raw: any) => {
        try {
          const stay = transformPGData(raw);
          if (!stay?.type) return;
          grouped[stay.type].push(stay);
        } catch {}
      });

      const sortFn = (a: any, b: any) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return (b.rating || 0) - (a.rating || 0);
      };

      Object.keys(grouped).forEach((key) => {
        grouped[key] = grouped[key].sort(sortFn).slice(0, staysPerType);
      });

      cache.current = grouped;
      setStaysByType(grouped);

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchStays();
  }, [fetchStays]);

  // ✅ Transform
  const transformForCard = useCallback((stay: any) => {
    const images = [...new Set([
      ...filterRealImages(stay.images),
      ...filterRealImages(stay.gallery)
    ])];

    return {
      id: stay._id,
      name: stay.name,
      slug: stay.slug || stay._id,
      description: stay.description,
      price: stay.price,
      images,
      city: stay.city,
      locality: stay.locality,
      type: stay.type,
      amenities: stay.amenities || [],
      rating: stay.rating || 4.5,
      reviewCount: stay.reviewCount || 0,
      featured: stay.featured || false,
      wifi: stay.wifi,
      meals: stay.meals,
      ac: stay.ac,
      parking: stay.parking,
    };
  }, []);

  const sections = useMemo(() => [
    { title: "Premium Stays for Women", data: staysByType.girls, type: "girls", icon: <Heart className="h-4 w-4" /> },
    { title: "Executive Stays for Men", data: staysByType.boys, type: "boys", icon: <Shield className="h-4 w-4" /> },
    { title: "Family Residences", data: staysByType.family, type: "family", icon: <Home className="h-4 w-4" /> },
    { title: "Co-living Spaces", data: staysByType['co-ed'], type: "co-ed", icon: <Wifi className="h-4 w-4" /> },
  ], [staysByType]);

  // ✅ Skeleton UI
  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">

          <div className="text-center mb-12">
            <div className="h-8 w-60 bg-gray-200 mx-auto rounded mb-3 animate-pulse"></div>
            <div className="h-4 w-80 bg-gray-200 mx-auto rounded animate-pulse"></div>
          </div>

          {[1, 2, 3].map((section) => (
            <div key={section} className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => <PGCardSkeleton key={i} />)}
              </div>
            </div>
          ))}

        </div>
      </section>
    );
  }

  // ❌ Error UI
  if (error) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="mx-auto mb-4 text-red-500" />
        <p>{error}</p>
        <Button onClick={fetchStays} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">

        <h2 className="text-3xl font-bold text-center mb-10">
          Featured PGs
        </h2>

        {sections.map(section => {
          if (!section.data.length) return null;

          return (
            <div key={section.type} className="mb-12">

              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  {section.icon}
                  {section.title}
                </h3>

                <Link to={`/pg?type=${section.type}`}>
                  <Button variant="outline">
                    View All <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {section.data.map((stay: any) => (
                  <PGCard key={stay._id} pg={transformForCard(stay)} />
                ))}
              </div>

            </div>
          );
        })}

        <div className="text-center mt-10">
          <Link to="/pg">
            <Button size="lg">
              Browse All Properties <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}