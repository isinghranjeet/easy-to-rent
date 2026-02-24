import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, AlertCircle, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PGCard } from '@/components/pg/PGCard';

const API_URL = 'https://eassy-to-rent-backend.onrender.com';

export function FeaturedPGs() {
  const [allPGs, setAllPGs] = useState([]);
  const [displayedPGs, setDisplayedPGs] = useState([]);
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
      
      console.log('🌐 Fetching PGs from:', `${API_URL}/api/pg`);
      
      const response = await fetch(`${API_URL}/api/pg`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('📥 Response received:', result);
      
      // ✅ FIXED: Extract PGs from result.data.items (your backend structure)
      let pgs = [];
      
      if (result.success && result.data && Array.isArray(result.data.items)) {
        // Your backend returns: { success: true, data: { items: [...], count, total, page, pages } }
        pgs = result.data.items;
        console.log(`✅ Found ${pgs.length} PGs from backend`);
        console.log(`📊 Total PGs: ${result.data.total}, Page: ${result.data.page}/${result.data.pages}`);
      } else {
        console.warn('Unexpected response format:', result);
        throw new Error('Invalid data format from server');
      }
      
      if (pgs.length === 0) {
        setError('No PGs found in database');
        setAllPGs([]);
        setDisplayedPGs([]);
        return;
      }
      
      setAllPGs(pgs);
      updateDisplayedPGs(pgs);
      
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setError(`Failed to load data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateDisplayedPGs = (pgs) => {
    // Sort by featured first, then by createdAt or any other criteria
    const sortedPGs = [...pgs].sort((a, b) => {
      // First sort by featured (true first)
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      // Then by createdAt (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    const initialCount = Math.min(itemsPerPage, sortedPGs.length);
    setDisplayedPGs(sortedPGs.slice(0, initialCount));
  };

  // Helper function to count PGs by type
  const countByType = (type) => {
    return allPGs.filter(pg => pg.type === type).length;
  };

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-orange-50/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div className="animate-pulse">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-8 w-64 bg-gray-200 rounded mt-2"></div>
              <div className="h-4 w-96 bg-gray-200 rounded mt-2"></div>
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
                Top Picks
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Featured PG Accommodations
            </h2>
            <p className="text-gray-600 mt-3 max-w-2xl">
              {displayedPGs.length} premium stays loved by students for their comfort, location, and amenities. 
              All verified and highly rated by residents.
            </p>
            <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                <span className="font-medium">{allPGs.filter(pg => pg.featured).length}</span> Featured
              </span>
              <span className="text-gray-300">•</span>
              <span>Total: {allPGs.length} PGs</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/pg">
              <Button className="bg-orange-600 hover:bg-orange-700 gap-2">
                View All PGs
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
              There are no accommodations available at the moment. Check back soon!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedPGs.map((pg, index) => (
                <div key={pg._id || pg.id || index} className="relative">
                  {pg.featured && (
                    <div className="absolute top-3 left-3 z-10">
                      <div className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full shadow-sm">
                        <Star className="h-3 w-3 fill-white" />
                        Featured
                      </div>
                    </div>
                  )}
                  <PGCard pg={pg} index={index} />
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Need more options?
                  </h4>
                  <p className="text-sm text-gray-600">
                    Browse our complete collection of verified PG accommodations
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Link to="/pg?type=boys">
                    <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                       Boys PG ({countByType('boys')})
                    </Button>
                  </Link>
                  <Link to="/pg?type=girls">
                    <Button variant="outline" className="border-pink-300 text-pink-700 hover:bg-pink-50">
                       Girls PG ({countByType('girls')})
                    </Button>
                  </Link>
                  <Link to="/pg?type=co-ed">
                    <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                       Co-ed PG ({countByType('co-ed')})
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}