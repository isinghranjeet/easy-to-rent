// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { ArrowRight, Star, AlertCircle, Wifi } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { PGCard } from '@/components/pg/PGCard';

// const API_URL = 'https://eassy-to-rent-backend.onrender.com';

// // Define the PG interface to match your backend structure
// interface PGListing {
//   _id: string;
//   id?: string;
//   name: string;
//   slug?: string;
//   description: string;
//   city: string;
//   locality: string;
//   address: string;
//   price: number;
//   type: 'boys' | 'girls' | 'co-ed' | 'family';
//   images: string[];
//   gallery?: string[];
//   amenities: string[];
//   verified: boolean;
//   featured: boolean;
//   rating: number;
//   reviewCount: number;
//   ownerName?: string;
//   ownerPhone?: string;
//   wifi?: boolean;
//   meals?: boolean;
//   ac?: boolean;
//   parking?: boolean;
//   createdAt: string;
//   distance?: string;
// }

// export function FeaturedPGs() {
//   const [allPGs, setAllPGs] = useState<PGListing[]>([]);
//   const [displayedPGs, setDisplayedPGs] = useState<PGListing[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const itemsPerPage = 6;

//   useEffect(() => {
//     fetchPGs();
//   }, []);

//   const fetchPGs = async () => {
//     try {
//       setLoading(true);
//       setError('');
      
//       console.log('🌐 Fetching PGs from:', `${API_URL}/api/pg?limit=20`);
      
//       const response = await fetch(`${API_URL}/api/pg?limit=20`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         },
//         mode: 'cors'
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }
      
//       const result = await response.json();
//       console.log('📥 Response received:', result);
      
//       // Handle different response structures
//       let pgs: PGListing[] = [];
      
//       if (result.success) {
//         // Case 1: { success: true, data: { items: [...] } }
//         if (result.data?.items && Array.isArray(result.data.items)) {
//           pgs = result.data.items;
//           console.log(`✅ Found ${pgs.length} PGs from backend (paginated)`);
//           console.log(`📊 Total: ${result.data.total}, Page: ${result.data.page}/${result.data.pages}`);
//         }
//         // Case 2: { success: true, data: [...] }
//         else if (Array.isArray(result.data)) {
//           pgs = result.data;
//           console.log(`✅ Found ${pgs.length} PGs from backend (direct array)`);
//         }
//         // Case 3: { success: true, items: [...] }
//         else if (Array.isArray(result.items)) {
//           pgs = result.items;
//           console.log(`✅ Found ${pgs.length} PGs from backend (items array)`);
//         }
//         else {
//           console.warn('Unexpected data structure:', result);
//         }
//       } else {
//         throw new Error(result.message || 'Failed to fetch PGs');
//       }
      
//       // Filter to only show published PGs
//       const publishedPGs = pgs.filter(pg => pg.published !== false);
      
//       if (publishedPGs.length === 0) {
//         setError('No published PGs found in database');
//         setAllPGs([]);
//         setDisplayedPGs([]);
//         return;
//       }
      
//       setAllPGs(publishedPGs);
//       updateDisplayedPGs(publishedPGs);
      
//     } catch (err: any) {
//       console.error('❌ Fetch error:', err);
//       setError(`Failed to load data: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateDisplayedPGs = (pgs: PGListing[]) => {
//     // Sort by featured first, then by rating, then by createdAt
//     const sortedPGs = [...pgs].sort((a, b) => {
//       // First sort by featured (true first)
//       if (a.featured && !b.featured) return -1;
//       if (!a.featured && b.featured) return 1;
      
//       // Then by rating (higher first)
//       if ((a.rating || 0) > (b.rating || 0)) return -1;
//       if ((a.rating || 0) < (b.rating || 0)) return 1;
      
//       // Then by createdAt (newest first)
//       return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
//     });
    
//     const initialCount = Math.min(itemsPerPage, sortedPGs.length);
//     setDisplayedPGs(sortedPGs.slice(0, initialCount));
//   };

//   // Helper function to count PGs by type
//   const countByType = (type: string): number => {
//     return allPGs.filter(pg => pg.type === type).length;
//   };

//   // Helper function to transform PG data for PGCard
//   const transformForPGCard = (pg: PGListing) => {
//     return {
//       id: pg._id || pg.id || '',
//       name: pg.name,
//       slug: pg.slug || pg._id,
//       description: pg.description,
//       price: pg.price,
//       images: pg.images || [],
//       gallery: pg.gallery || [],
//       city: pg.city,
//       locality: pg.locality,
//       type: pg.type,
//       amenities: pg.amenities || [],
//       rating: pg.rating || 0,
//       reviewCount: pg.reviewCount || 0,
//       ownerName: pg.ownerName,
//       ownerPhone: pg.ownerPhone,
//       featured: pg.featured || false,
//       verified: pg.verified || false,
//       wifi: pg.wifi || pg.amenities?.some(a => a.toLowerCase().includes('wifi')) || false,
//       meals: pg.meals || pg.amenities?.some(a => a.toLowerCase().includes('meal')) || false,
//       ac: pg.ac || pg.amenities?.some(a => a.toLowerCase().includes('ac') || a.toLowerCase().includes('air')) || false,
//       parking: pg.parking || pg.amenities?.some(a => a.toLowerCase().includes('park')) || false,
//       distance: pg.distance,
//     };
//   };

//   if (loading) {
//     return (
//       <section className="py-16 md:py-24 bg-gradient-to-b from-white to-orange-50/30">
//         <div className="container mx-auto px-4">
//           <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
//             <div className="animate-pulse">
//               <div className="h-4 w-24 bg-gray-200 rounded"></div>
//               <div className="h-8 w-64 bg-gray-200 rounded mt-2"></div>
//               <div className="h-4 w-96 bg-gray-200 rounded mt-2"></div>
//             </div>
//             <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[1, 2, 3, 4, 5, 6].map((i) => (
//               <div key={i} className="bg-white border rounded-xl overflow-hidden animate-pulse">
//                 <div className="h-48 bg-gray-200"></div>
//                 <div className="p-4">
//                   <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
//                   <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
//                   <div className="h-8 bg-gray-200 rounded"></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     );
//   }

//   if (error) {
//     return (
//       <section className="py-16 md:py-24 bg-gradient-to-b from-white to-orange-50/30">
//         <div className="container mx-auto px-4">
//           <div className="text-center py-12 border-2 border-dashed border-orange-200 rounded-2xl bg-white">
//             <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
//               <AlertCircle className="h-8 w-8 text-orange-600" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h3>
//             <p className="text-muted-foreground mb-6 max-w-md mx-auto">
//               {error}
//             </p>
//             <Button 
//               onClick={fetchPGs}
//               className="bg-orange-600 hover:bg-orange-700"
//             >
//               Try Again
//             </Button>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="py-16 md:py-24 bg-gradient-to-b from-white to-orange-50/30">
//       <div className="container mx-auto px-4">
//         <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
//           <div>
//             <div className="inline-flex items-center gap-2 mb-3 px-4 py-2 bg-orange-100 text-orange-700 rounded-full border border-orange-200">
//               <Star className="h-4 w-4 fill-orange-500" />
//               <span className="text-sm font-medium uppercase tracking-wider">
//                 Top Picks
//               </span>
//             </div>
//             <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mt-2">
//               Featured PG Accommodations
//             </h2>
//             <p className="text-gray-600 mt-3 max-w-2xl">
//               {displayedPGs.length} premium stays loved by students for their comfort, location, and amenities. 
//               All verified and highly rated by residents.
//             </p>
//             <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
//               <span className="inline-flex items-center gap-1">
//                 <span className="h-2 w-2 rounded-full bg-orange-500"></span>
//                 <span className="font-medium">{allPGs.filter(pg => pg.featured).length}</span> Featured
//               </span>
//               <span className="text-gray-300">•</span>
//               <span>Total: {allPGs.length} PGs</span>
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-3">
//             <Link to="/pg">
//               <Button className="bg-orange-600 hover:bg-orange-700 gap-2">
//                 View All PGs
//                 <ArrowRight className="h-4 w-4" />
//               </Button>
//             </Link>
//           </div>
//         </div>

//         {displayedPGs.length === 0 ? (
//           <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl bg-white">
//             <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
//               <span className="text-2xl">🏠</span>
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">No PGs Available</h3>
//             <p className="text-gray-600 mb-6 max-w-md mx-auto">
//               There are no accommodations available at the moment. Check back soon!
//             </p>
//           </div>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {displayedPGs.map((pg, index) => (
//                 <div key={pg._id || pg.id || index} className="relative">
//                   {pg.featured && (
//                     <div className="absolute top-3 left-3 z-10">
//                       <div className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full shadow-sm">
//                         <Star className="h-3 w-3 fill-white" />
//                         Featured
//                       </div>
//                     </div>
//                   )}
//                   <PGCard pg={transformForPGCard(pg)} index={index} />
//                 </div>
//               ))}
//             </div>

//             <div className="mt-12 pt-8 border-t border-gray-200">
//               <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//                 <div className="text-center sm:text-left">
//                   <h4 className="font-semibold text-gray-900 mb-1">
//                     Need more options?
//                   </h4>
//                   <p className="text-sm text-gray-600">
//                     Browse our complete collection of verified PG accommodations
//                   </p>
//                 </div>
//                 <div className="flex flex-wrap gap-2 justify-center">
//                   <Link to="/pg?type=boys">
//                     <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
//                        Boys PG ({countByType('boys')})
//                     </Button>
//                   </Link>
//                   <Link to="/pg?type=girls">
//                     <Button variant="outline" className="border-pink-300 text-pink-700 hover:bg-pink-50">
//                        Girls PG ({countByType('girls')})
//                     </Button>
//                   </Link>
//                   <Link to="/pg?type=co-ed">
//                     <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
//                        Co-ed PG ({countByType('co-ed')})
//                     </Button>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </section>
//   );
// }













import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PGCard } from '@/components/pg/PGCard';

// Production backend URL
const API_URL = 'https://eassy-to-rent-backend.onrender.com';

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
  published?: boolean;
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
      
      console.log('🌐 Fetching from:', `${API_URL}/api/pg?limit=20`);
      console.log('📍 Current domain:', window.location.origin);
      
      // Add cache busting
      const url = `${API_URL}/api/pg?limit=20&_=${Date.now()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('📥 Response:', result);
      
      let pgs: PGListing[] = [];
      
      if (result.success) {
        if (result.data?.items && Array.isArray(result.data.items)) {
          pgs = result.data.items;
        } else if (Array.isArray(result.data)) {
          pgs = result.data;
        } else if (Array.isArray(result.items)) {
          pgs = result.items;
        }
      }
      
      // Show all PGs, not just published ones for testing
      if (pgs.length === 0) {
        // If no PGs from API, show mock data for testing
        console.log('No PGs from API, using mock data');
        pgs = getMockPGs();
      }
      
      setAllPGs(pgs);
      updateDisplayedPGs(pgs);
      
    } catch (err: any) {
      console.error('❌ Fetch error:', err);
      setError(`Failed to load data: ${err.message}`);
      
      // Show mock data on error so UI doesn't break
      const mockPGs = getMockPGs();
      setAllPGs(mockPGs);
      updateDisplayedPGs(mockPGs);
    } finally {
      setLoading(false);
    }
  };

  // Mock data function for testing
  const getMockPGs = (): PGListing[] => {
    return [
      {
        _id: '1',
        name: 'Sunrise PG',
        description: 'Nice PG with all amenities',
        city: 'Chandigarh',
        locality: 'Sector 44',
        address: '444 bj nkkm',
        price: 5000,
        type: 'boys',
        images: [],
        amenities: ['WiFi', 'AC', 'Power Backup'],
        verified: true,
        featured: true,
        rating: 4.0,
        reviewCount: 0,
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        name: 'Test PG',
        description: 'this is test',
        city: 'Chandigarh',
        locality: 'Sector 23',
        address: '23',
        price: 5000,
        type: 'girls',
        images: [],
        amenities: ['WiFi', 'AC', 'CCTV'],
        verified: true,
        featured: false,
        rating: 0,
        reviewCount: 0,
        createdAt: new Date().toISOString()
      },
      {
        _id: '3',
        name: 'Yoyo Hostel',
        description: 'this is very fun yoyo hostel',
        city: 'Chandigarh',
        locality: 'Sector 69',
        address: '69',
        price: 6969,
        type: 'boys',
        images: [],
        amenities: ['WiFi', 'AC', 'Attached Bathroom'],
        verified: true,
        featured: false,
        rating: 0,
        reviewCount: 0,
        createdAt: new Date().toISOString()
      }
    ];
  };

  const updateDisplayedPGs = (pgs: PGListing[]) => {
    const sortedPGs = [...pgs].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
    
    setDisplayedPGs(sortedPGs.slice(0, itemsPerPage));
  };

  const countByType = (type: string): number => {
    return allPGs.filter(pg => pg.type === type).length;
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
      ac: pg.ac || pg.amenities?.some(a => a.toLowerCase().includes('ac')) || false,
      parking: pg.parking || pg.amenities?.some(a => a.toLowerCase().includes('park')) || false,
      distance: pg.distance,
    };
  };

  // Rest of your component remains the same...
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

  if (error && displayedPGs.length === 0) {
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
              <PGCard pg={transformForPGCard(pg)} index={index} />
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
      </div>
    </section>
  );
}