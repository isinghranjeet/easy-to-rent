import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PGCard } from '@/components/pg/PGCard';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { toast } from 'sonner';
import { Loader2, AlertCircle, Search, Grid, List, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { transformPGData } from '@/lib/utils/pgTransformer';

// Updated to use your Render backend
const API_URL = 'https://eassy-to-rent-backend.onrender.com/api';

interface PGListing {
  _id: string;
  name: string;
  description: string;
  city: string;
  address: string;
  price: number;
  type: 'boys' | 'girls' | 'co-ed' | 'family';
  images: string[];
  amenities: string[];
  verified: boolean;
  featured: boolean;
  rating: number;
  reviewCount: number;
  ownerName?: string;
  ownerPhone?: string;
  createdAt: string;
  slug?: string;
  distance?: string;
  published?: boolean;
  locality?: string;
  location?: string;
}

const PGList = () => {
  const [searchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || 'all');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'rating' | 'newest'>('newest');
  
  const [listings, setListings] = useState<PGListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Fetch first page on mount
  useEffect(() => {
    fetchListings(1, true);
  }, []);

  // Fetch when filters change (reset to page 1)
  useEffect(() => {
    if (!loading) {
      fetchListings(1, true);
    }
  }, [selectedLocation, selectedType, sortBy, debouncedSearch]);

  useEffect(() => {
    if (searchParams.get('q')) setSearchQuery(searchParams.get('q') || '');
    if (searchParams.get('location')) setSelectedLocation(searchParams.get('location') || 'all');
    if (searchParams.get('type')) setSelectedType(searchParams.get('type') || 'all');
  }, [searchParams]);

  const fetchListings = async (page = 1, reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setListings([]);
      } else {
        setLoadingMore(true);
      }
      
      setError(null);
      
      // Build URL with pagination parameters
      const url = new URL(`${API_URL}/pg`);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('limit', '20'); // 20 items per page
      
      // Add filters if needed (if your backend supports them)
      if (selectedType !== 'all') {
        url.searchParams.append('type', selectedType);
      }
      if (selectedLocation !== 'all') {
        url.searchParams.append('city', selectedLocation);
      }
      if (debouncedSearch) {
        url.searchParams.append('search', debouncedSearch);
      }
      
      console.log('Fetching listings from:', url.toString());
      
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('API Response:', result);
      
      if (!result.success) {
        throw new Error(result.message || 'API request failed');
      }
      
      // Extract data from response
      const listingsData = result.data?.items || [];
      const newTotalCount = result.data?.total || 0;
      const newTotalPages = result.data?.pages || 1;
      const currentPageData = result.data?.page || 1;
      
      setTotalCount(newTotalCount);
      setTotalPages(newTotalPages);
      setCurrentPage(currentPageData);
      setHasMore(currentPageData < newTotalPages);
      
      if (!Array.isArray(listingsData)) {
        console.warn('Listings data is not an array:', listingsData);
        if (reset) setListings([]);
        return;
      }
      
      console.log(`Received ${listingsData.length} listings from database (Page ${currentPageData}/${newTotalPages}, Total: ${newTotalCount})`);
      
      // ✅ UPDATED: Use the transformer utility
      const transformedListings = listingsData.map((listing: any) => transformPGData(listing));
      
      if (reset) {
        setListings(transformedListings);
      } else {
        setListings(prev => [...prev, ...transformedListings]);
      }
      
      if (reset && transformedListings.length === 0) {
        toast.info('No PG listings found. Add some listings to get started.');
      } else if (reset) {
        toast.success(`Loaded ${transformedListings.length} PG listings`);
      }
      
    } catch (err: any) {
      console.error('Error fetching listings:', err);
      setError(`Failed to load listings: ${err.message}`);
      toast.error('Failed to load PG listings');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loadingMore) {
      fetchListings(currentPage + 1, false);
    }
  };

  const filteredPGs = useMemo(() => {
    // Since we're fetching filtered data from backend, this is now just for client-side sorting
    let filtered = [...listings];

    // Sort the filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc': 
          return a.price - b.price;
        case 'price_desc': 
          return b.price - a.price;
        case 'rating': 
          return (b.rating || 0) - (a.rating || 0);
        case 'newest': 
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default: 
          return 0;
      }
    });

    return filtered;
  }, [listings, sortBy]);

  const locations = useMemo(() => {
    const uniqueLocations = new Set<string>();
    listings.forEach(pg => {
      if (pg.city) uniqueLocations.add(pg.city);
      if (pg.locality) uniqueLocations.add(pg.locality);
    });
    return ['all', ...Array.from(uniqueLocations)].filter(Boolean);
  }, [listings]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedLocation('all');
    setSelectedType('all');
    toast.success('Filters cleared');
  };

  const refreshListings = () => {
    fetchListings(1, true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-24">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading accommodations...</p>
            <p className="text-sm text-gray-400 mt-2">Fetching from backend...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Find PG Accommodations</h1>
              <p className="text-gray-600">
                {totalCount} accommodations available
                {listings.length > 0 && ` (showing ${listings.length} of ${totalCount})`}
              </p>
            </div>
            <button
              onClick={refreshListings}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Listings
            </button>
          </div>
          
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by location, PG name, or description..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-gray-600">
              Showing <span className="font-semibold">{filteredPGs.length}</span> of {totalCount} results
              {currentPage > 1 && ` (Page ${currentPage} of ${totalPages})`}
            </p>
            {error && (
              <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {error}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                aria-label="Grid view"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-gray-300 text-gray-900 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              aria-label="Sort by"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${selectedType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              All Types
            </button>
            <button
              onClick={() => setSelectedType('boys')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${selectedType === 'boys' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Boys PG
            </button>
            <button
              onClick={() => setSelectedType('girls')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${selectedType === 'girls' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Girls PG
            </button>
            <button
              onClick={() => setSelectedType('co-ed')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${selectedType === 'co-ed' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Co-ed PG
            </button>
            
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="border border-gray-300 text-gray-900 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white min-w-[150px]"
              aria-label="Select location"
            >
              <option value="all">All Locations</option>
              {locations.filter(loc => loc !== 'all').map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
            
            <button
              onClick={clearFilters}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results */}
        {filteredPGs.length > 0 ? (
          <>
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {filteredPGs.map((pg) => (
                <PGCard key={pg._id} pg={pg} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Pagination Info */}
            <div className="mt-4 text-center text-sm text-gray-500">
              Page {currentPage} of {totalPages} • {totalCount} total listings
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No accommodations found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {totalCount === 0 
                ? "No PG listings available in the database yet. Add some listings to get started."
                : "Try adjusting your search or filter criteria to find what you're looking for."}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
              {totalCount === 0 && (
                <button
                  onClick={refreshListings}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Refresh
                </button>
              )}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
            <button
              onClick={() => fetchListings(1, true)}
              className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default PGList;