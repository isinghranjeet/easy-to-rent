// // frontend/src/components/home/TopRecommendations.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, Star, MapPin, Zap } from 'lucide-react';
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
  locality: string;
  images: string[];
  rating: number;
  type: string;
  featured?: boolean;
  verified?: boolean;
}

export const TopRecommendations = () => {
  const [recommendations, setRecommendations] = useState<PGListing[]>([]);
  const [trending, setTrending] = useState<PGListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'personalized' | 'trending'>('trending');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchRecommendations();
  }, [isAuthenticated]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      
      if (isAuthenticated) {
        try {
          const personalizedRes = await api.getPersonalizedRecommendations(8);
          if (personalizedRes.success && personalizedRes.recommendations) {
            setRecommendations(personalizedRes.recommendations);
          }
        } catch (error) {
          console.log('Personalized recommendations not available yet');
        }
      }
      
      // Fetch trending PGs
      try {
        const trendingRes = await api.getTrendingPGs(8);
        if (trendingRes.success && trendingRes.trending) {
          setTrending(trendingRes.trending);
        } else if (trendingRes.data && trendingRes.data.trending) {
          setTrending(trendingRes.data.trending);
        }
      } catch (error) {
        console.log('Trending API error, fetching from PG list instead');
        // Fallback: Get PGs from main list
        const pgRes = await api.getPGs({ limit: 8, sort: '-rating' });
        if (pgRes.success && pgRes.data?.items) {
          setTrending(pgRes.data.items);
        }
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayData = activeTab === 'personalized' ? recommendations : trending;

  // Don't show if no data and not loading
  if (!loading && displayData.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-orange-50/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 rounded-full mb-4">
            <Sparkles className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-600">Curated For You</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {activeTab === 'personalized' ? 'Top Recommendations' : 'Trending Now'}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {activeTab === 'personalized' 
              ? 'Based on your browsing history and preferences'
              : 'Most viewed and popular properties this month'}
          </p>
        </div>

        {/* Tabs - Only show For You if logged in */}
        <div className="flex justify-center gap-4 mb-8">
          {isAuthenticated && (
            <button
              onClick={() => setActiveTab('personalized')}
              className={cn(
                "px-6 py-2 rounded-full font-medium transition-all",
                activeTab === 'personalized'
                  ? "bg-orange-600 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-orange-50"
              )}
            >
              For You
            </button>
          )}
          <button
            onClick={() => setActiveTab('trending')}
            className={cn(
              "px-6 py-2 rounded-full font-medium transition-all",
              activeTab === 'trending'
                ? "bg-orange-600 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-orange-50"
            )}
          >
            <TrendingUp className="inline h-4 w-4 mr-1" />
            Trending
          </button>
        </div>

        {/* Recommendations Grid */}
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
        ) : displayData.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayData.map((pg, idx) => (
              <div key={pg._id} className="relative">
                {activeTab === 'personalized' && pg.featured && (
                  <div className="absolute -top-2 -left-2 z-10">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      🔥 Best Match
                    </div>
                  </div>
                )}
                {activeTab === 'trending' && idx < 3 && (
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
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No properties found. Check back later!</p>
            <Link to="/pg">
              <Button className="mt-4 bg-orange-600 hover:bg-orange-700">
                Explore PGs
              </Button>
            </Link>
          </div>
        )}

        {/* View All Link */}
        {displayData.length > 0 && (
          <div className="text-center mt-10">
            <Link to="/pg">
              <Button variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50">
                View All {activeTab === 'personalized' ? 'Recommendations' : 'Trending PGs'} →
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};