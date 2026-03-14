import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PGCard } from '@/components/pg/PGCard';
import { toast } from 'sonner';
import { Loader2, AlertCircle, Search, Grid, List, RefreshCw, ChevronRight, ChevronLeft } from 'lucide-react';

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
  location?: {
    type: string;
    coordinates: number[];
  };
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const PGList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || 'all');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'rating' | 'newest'>('newest');
  
  const [listings, setListings] = useState<PGListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedLocation !== 'all') params.set('location', selectedLocation);
    if (selectedType !== 'all') params.set('type', selectedType);
    setSearchParams(params);
  }, [searchQuery, selectedLocation, selectedType, setSearchParams]);

  useEffect(() => {
    fetchListings(1);
  }, [selectedLocation, selectedType, sortBy, debouncedSearch]);

  useEffect(() => {
    fetchListings(1);
  }, []);

  const fetchListings = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const url = new URL(`${API_URL}/pg`);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('limit', '3'); // Changed to 3 items per page
      
      if (selectedType !== 'all') {
        url.searchParams.append('type', selectedType);
      }
      if (selectedLocation !== 'all') {
        url.searchParams.append('city', selectedLocation);
      }
      if (debouncedSearch) {
        url.searchParams.append('search', debouncedSearch);
      }
      
      switch (sortBy) {
        case 'price_asc':
          url.searchParams.append('sort', 'price');
          url.searchParams.append('order', 'asc');
          break;
        case 'price_desc':
          url.searchParams.append('sort', 'price');
          url.searchParams.append('order', 'desc');
          break;
        case 'rating':
          url.searchParams.append('sort', 'rating');
          url.searchParams.append('order', 'desc');
          break;
        case 'newest':
          url.searchParams.append('sort', 'createdAt');
          url.searchParams.append('order', 'desc');
          break;
      }
      
      const response = await fetch(url.toString(), {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch listings`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to load listings');
      }
      
      const listingsData = result.data?.items || result.data || [];
      const newTotalCount = result.data?.total || listingsData.length;
      const newTotalPages = result.data?.pages || Math.ceil(newTotalCount / 3) || 1;
      
      setTotalCount(newTotalCount);
      setTotalPages(newTotalPages);
      setCurrentPage(page);
      
      if (!Array.isArray(listingsData)) {
        setListings([]);
        return;
      }
      
      const publishedListings = listingsData.filter((listing: any) => 
        listing.published !== false
      );
      
      setListings(publishedListings);
      
    } catch (err: any) {
      setError('Unable to load listings. Please try again.');
      toast.error('Failed to load PG listings');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      fetchListings(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const filteredPGs = useMemo(() => {
    let filtered = [...listings];

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
    setSortBy('newest');
    toast.success('Filters cleared');
  };

  const refreshListings = () => {
    fetchListings(1);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push(-1); // Ellipsis
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push(-1); // Ellipsis
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push(-1); // Ellipsis
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push(-1); // Ellipsis
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-24">
            <Loader2 className="h-12 w-12 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading accommodations...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Find PG Accommodations</h1>
            <button
              onClick={refreshListings}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm transition-colors"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
          
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by location, PG name, or description..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            />
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          {error && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {error}
            </p>
          )}
          
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-orange-500' : 'text-gray-600 hover:text-gray-900'}`}
                aria-label="Grid view"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-orange-500' : 'text-gray-600 hover:text-gray-900'}`}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-gray-300 text-gray-900 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white"
              aria-label="Sort by"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${selectedType === 'all' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              All Types
            </button>
            <button
              onClick={() => setSelectedType('boys')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${selectedType === 'boys' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Boys PG
            </button>
            <button
              onClick={() => setSelectedType('girls')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${selectedType === 'girls' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Girls PG
            </button>
            <button
              onClick={() => setSelectedType('co-ed')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${selectedType === 'co-ed' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Co-ed PG
            </button>
            <button
              onClick={() => setSelectedType('family')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${selectedType === 'family' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Family PG
            </button>
            
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="border border-gray-300 text-gray-900 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white min-w-[150px]"
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                {getPageNumbers().map((page, index) => (
                  page === -1 ? (
                    <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">...</span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`min-w-[40px] h-10 rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-orange-500 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No accommodations found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {error && (
          <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
            <button
              onClick={() => fetchListings(1)}
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