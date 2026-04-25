// frontend/src/components/home/TopRecommendations.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, Star, MapPin, Zap, Crown } from 'lucide-react';
import { PGCard } from '@/components/pg/PGCard';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface PGListing {
  _id: string;
  name: string;
  price: number;
  city: string;
  locality?: string;
  images: string[];
  rating: number;
  type: 'boys' | 'girls' | 'co-ed' | 'family';
  featured?: boolean;
  verified?: boolean;
}

export const TopRecommendations = () => {
  const [trending, setTrending] = useState<PGListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingPGs();
  }, []);

  const fetchTrendingPGs = async () => {
    try {
      setLoading(true);
      
      // Fetch trending PGs (admin recommended)
      const pgResponse = await api.getPGs({ limit: 8, sort: '-rating' });
      
      if (pgResponse.success && pgResponse.data?.items) {
        setTrending(pgResponse.data.items);
      }
    } catch (error) {
      console.error('Error fetching trending PGs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-white to-orange-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 rounded-full mb-4">
              <Sparkles className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-600">Curated For You</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trending</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-xl h-48 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-orange-50/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 rounded-full mb-4">
            <Sparkles className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-600">Admin Recommended</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trending
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Most viewed and popular properties recommended by our team
          </p>
        </div>

        {/* Trending Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trending.map((pg, idx) => (
            <div key={pg._id} className="relative">
              {idx < 3 && (
                <div className="absolute -top-2 -left-2 z-10">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                    <Zap className="inline h-3 w-3 mr-1" />
                    #{idx + 1} Trending
                  </div>
                </div>
              )}
              <PGCard pg={pg} index={idx} />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Link to="/pg">
            <Button variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50">
              View All Trending →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};