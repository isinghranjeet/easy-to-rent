import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PGCard } from '@/components/pg/PGCard';

// ✅ UPDATED: Use your Render backend URL
const API_URL = 'https://eassy-to-rent-backend.onrender.com';

export function FeaturedPGs() {
  const [allPGs, setAllPGs] = useState([]);
  const [displayedPGs, setDisplayedPGs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchPGs = async () => {
      try {
        setLoading(true);
        setError('');
        
        console.log('🌐 Fetching PGs from:', `${API_URL}/api/pg`);
        
        const response = await fetch(`${API_URL}/api/pg`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('📥 Response received:', result);
        
        if (result.success && Array.isArray(result.data)) {
          const pgs = result.data;
          console.log(`✅ Found ${pgs.length} total PGs`);
          
          setAllPGs(pgs);
          
          // Show featured PGs first, then fall back to other PGs
          const featured = pgs.filter(pg => pg.featured === true);
          const nonFeatured = pgs.filter(pg => !pg.featured);
          
          // Combine featured + enough non-featured to reach minimum count
          const allCombined = [...featured, ...nonFeatured];
          const initialCount = Math.min(itemsPerPage, allCombined.length);
          const initialPGs = allCombined.slice(0, initialCount);
          
          setDisplayedPGs(initialPGs);
        } else {
          console.warn('⚠️ Invalid response format:', result);
          setError(result.message || 'Failed to load PGs');
          setAllPGs([]);
          setDisplayedPGs([]);
        }
      } catch (err) {
        console.error('❌ Fetch error:', err);
        setError('Unable to load PGs from backend. Using demo data instead.');
        loadDemoData();
      } finally {
        setLoading(false);
      }
    };

    fetchPGs();
  }, []);

  const loadDemoData = () => {
    console.log('🔄 Loading demo PGs...');
    const demoPGs = [
      {
        _id: 'demo-1',
        name: 'Sunshine Boys PG',
        city: 'Chandigarh',
        locality: 'Gate 1',
        address: 'Gate 1, Chandigarh University Road',
        price: 8500,
        type: 'boys',
        rating: 4.5,
        reviewCount: 42,
        description: 'Premium boys PG with all modern amenities near CU Gate 1',
        images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80'],
        amenities: ['WiFi', 'AC', 'Meals', 'Parking', 'CCTV', 'Power Backup'],
        verified: true,
        featured: true,
        ownerName: 'Rajesh Kumar',
        ownerPhone: '9876543210',
        distance: '500m from CU'
      },
      {
        _id: 'demo-2',
        name: 'Girls Safe Haven PG',
        city: 'Chandigarh',
        locality: 'Library Road',
        address: 'Near University Library, CU Campus',
        price: 9500,
        type: 'girls',
        rating: 4.8,
        reviewCount: 36,
        description: 'Secure and comfortable PG exclusively for girls with 24/7 security',
        images: ['https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&auto=format&fit=crop&q=80'],
        amenities: ['WiFi', 'AC', 'Meals', 'Security', 'CCTV', 'Hot Water', 'Laundry'],
        verified: true,
        featured: true,
        ownerName: 'Priya Sharma',
        ownerPhone: '9876543211',
        distance: '300m from Library'
      },
      {
        _id: 'demo-3',
        name: 'Co-Ed Student Hub',
        city: 'Chandigarh',
        locality: 'Sports Complex',
        address: 'Opposite CU Sports Complex',
        price: 7500,
        type: 'co-ed',
        rating: 4.3,
        reviewCount: 28,
        description: 'Co-ed PG perfect for students with study room and high-speed internet',
        images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80'],
        amenities: ['WiFi', 'Study Room', 'Library', 'Common Area', 'Laundry', 'Power Backup'],
        verified: true,
        featured: true,
        ownerName: 'Amit Verma',
        ownerPhone: '9876543212',
        distance: '200m from Sports Complex'
      },
      {
        _id: 'demo-4',
        name: 'Elite Boys Hostel',
        city: 'Chandigarh',
        locality: 'Gate 2',
        address: 'Gate 2, Chandigarh University',
        price: 9000,
        type: 'boys',
        rating: 4.6,
        reviewCount: 38,
        description: 'Modern boys hostel with gym and study rooms',
        images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80'],
        amenities: ['WiFi', 'AC', 'Gym', 'Meals', 'Parking', 'CCTV', 'Laundry'],
        verified: true,
        featured: false,
        ownerName: 'Vikram Singh',
        ownerPhone: '9876543213',
        distance: '400m from Gate 2'
      },
      {
        _id: 'demo-5',
        name: 'Royal Girls PG',
        city: 'Chandigarh',
        locality: 'Academic Block',
        address: 'Near Academic Block, CU',
        price: 10000,
        type: 'girls',
        rating: 4.9,
        reviewCount: 45,
        description: 'Luxury accommodation for girls with premium amenities',
        images: ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&auto=format&fit=crop&q=80'],
        amenities: ['WiFi', 'AC', 'Meals', 'Gym', 'Spa', 'CCTV', '24/7 Security'],
        verified: true,
        featured: false,
        ownerName: 'Neha Gupta',
        ownerPhone: '9876543214',
        distance: '150m from Academic Block'
      },
      {
        _id: 'demo-6',
        name: 'Student Comfort PG',
        city: 'Chandigarh',
        locality: 'Market Road',
        address: 'Market Road, Near CU',
        price: 7000,
        type: 'co-ed',
        rating: 4.2,
        reviewCount: 31,
        description: 'Budget-friendly PG with all basic amenities',
        images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80'],
        amenities: ['WiFi', 'Meals', 'Laundry', 'Common Area', 'Hot Water'],
        verified: true,
        featured: false,
        ownerName: 'Sanjay Mehta',
        ownerPhone: '9876543215',
        distance: '600m from Market'
      },
      {
        _id: 'demo-7',
        name: 'Premium Boys Accommodation',
        city: 'Chandigarh',
        locality: 'Hostel Zone',
        address: 'Hostel Zone, CU Campus',
        price: 11000,
        type: 'boys',
        rating: 4.7,
        reviewCount: 52,
        description: 'Top-tier accommodation with private rooms and premium facilities',
        images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80'],
        amenities: ['WiFi', 'AC', 'Private Bath', 'Meals', 'Gym', 'Parking', 'CCTV'],
        verified: true,
        featured: true,
        ownerName: 'Rahul Sharma',
        ownerPhone: '9876543216',
        distance: 'On Campus'
      },
      {
        _id: 'demo-8',
        name: 'Cosy Girls Nest',
        city: 'Chandigarh',
        locality: 'Peace Road',
        address: 'Peace Road, Near CU',
        price: 8000,
        type: 'girls',
        rating: 4.4,
        reviewCount: 29,
        description: 'Comfortable and secure girls PG in peaceful locality',
        images: ['https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&auto=format&fit=crop&q=80'],
        amenities: ['WiFi', 'AC', 'Meals', 'Security', 'Laundry', 'Hot Water'],
        verified: true,
        featured: false,
        ownerName: 'Anjali Patel',
        ownerPhone: '9876543217',
        distance: '700m from Campus'
      }
    ];
    
    const featured = demoPGs.filter(pg => pg.featured);
    const nonFeatured = demoPGs.filter(pg => !pg.featured);
    const allCombined = [...featured, ...nonFeatured];
    const initialCount = Math.min(itemsPerPage, allCombined.length);
    
    setAllPGs(demoPGs);
    setDisplayedPGs(allCombined.slice(0, initialCount));
    console.log(`✅ Demo data loaded: ${demoPGs.length} PGs`);
  };

  const handleRetry = () => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      loadDemoData();
      setLoading(false);
    }, 1000);
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

  if (error && allPGs.length === 0) {
    return (
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-orange-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center py-12 border-2 border-dashed border-orange-200 rounded-2xl bg-white">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Connection Issue</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {error}
            </p>
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={handleRetry}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Load Demo Data
              </Button>
              <a href={`${API_URL}/api/pg`} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-orange-300">
                  Test API
                </Button>
              </a>
            </div>
            <div className="mt-6 text-sm text-gray-500">
              <p>Backend URL: {API_URL}</p>
            </div>
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
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={handleRetry}
                variant="outline"
                className="border-orange-300"
              >
                Load Demo Data
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedPGs.map((pg, index) => (
                <div 
                  key={pg._id || index} 
                  className="transform transition-transform duration-300 hover:-translate-y-2"
                >
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
                       Boys PG ({allPGs.filter(pg => pg.type === 'boys').length})
                    </Button>
                  </Link>
                  <Link to="/pg?type=girls">
                    <Button variant="outline" className="border-pink-300 text-pink-700 hover:bg-pink-50">
                       Girls PG ({allPGs.filter(pg => pg.type === 'girls').length})
                    </Button>
                  </Link>
                  <Link to="/pg?type=co-ed">
                    <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                       Co-ed PG ({allPGs.filter(pg => pg.type === 'co-ed').length})
                    </Button>
                  </Link>
                   <Link to="/pg?type=co-ed">
                    <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                       Family ({allPGs.filter(pg => pg.type === 'co-ed').length})
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