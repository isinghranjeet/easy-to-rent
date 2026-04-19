/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PGCard } from '@/components/pg/PGCard';
import { AirbnbMap } from '@/components/map/AirbnbMap';
import { PriceAlertButton } from '@/components/pg/PriceAlertButton'; // ✅ ADD THIS
import { toast } from 'sonner';
import {
  Loader2,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  MapPin,
  ChevronDown,
  Map as MapIcon,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  Navigation
} from 'lucide-react';
import { api } from '@/services/api';

// Only 3 PGs per page in list/grid view
const PG_LIMIT = 3;

interface PGListing {
  _id: string;
  name: string;
  city: string;
  price: number;
  type: string;
  images: string[];
  rating: number;
  reviewCount?: number;
  verified?: boolean;
  featured?: boolean;
  published?: boolean;
  coordinates?: { lat: number; lng: number };
  address?: string;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const PGList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [listings, setListings] = useState<PGListing[]>([]);
  const [allListings, setAllListings] = useState<PGListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [locations, setLocations] = useState<{ name: string; count: number }[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' }
  ];

  // Track scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await api.getPopularLocations(20);
        if (response.success && response.data) {
          setLocations(response.data.map((loc: any) => ({
            name: loc.name,
            count: loc.pgCount
          })));
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };
    fetchLocations();
  }, []);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedLocation) params.set('location', selectedLocation);
    if (selectedType) params.set('type', selectedType);
    if (currentPage > 1) params.set('page', currentPage.toString());
    if (sortBy !== 'newest') params.set('sort', sortBy);
    setSearchParams(params);
  }, [searchQuery, selectedLocation, selectedType, currentPage, sortBy, setSearchParams]);

  // Fetch all PGs for map (unlimited)
  const fetchAllForMap = useCallback(async () => {
    try {
      const params: any = {
        page: '1',
        limit: '100'
      };
      
      if (selectedLocation) params.city = selectedLocation;
      if (selectedType) params.type = selectedType;
      if (debouncedSearch) params.search = debouncedSearch;
      
      const queryString = new URLSearchParams(params).toString();
      const result = await api.request<any>(`/api/pg?${queryString}`);
      
      const responseData = result.success ? (result.data || {}) : result;
      const listingsData = responseData.items || (Array.isArray(responseData) ? responseData : []);
      setAllListings(Array.isArray(listingsData) ? listingsData.filter((l: any) => l.published !== false) : []);
    } catch (error) {
      console.error('Error fetching all PGs for map:', error);
    }
  }, [selectedLocation, selectedType, debouncedSearch]);

  // Fetch paginated listings for grid/list view
  const fetchListings = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        page: page.toString(),
        limit: PG_LIMIT.toString()
      };

      if (selectedLocation) params.city = selectedLocation;
      if (selectedType) params.type = selectedType;
      if (debouncedSearch) params.search = debouncedSearch;
      if (priceRange.min) params.minPrice = priceRange.min;
      if (priceRange.max) params.maxPrice = priceRange.max;

      switch (sortBy) {
        case 'price_asc':
          params.sort = 'price';
          params.order = 'asc';
          break;
        case 'price_desc':
          params.sort = 'price';
          params.order = 'desc';
          break;
        case 'rating':
          params.sort = 'rating';
          params.order = 'desc';
          break;
        default:
          params.sort = 'createdAt';
          params.order = 'desc';
      }

      const queryString = new URLSearchParams(params).toString();
      const result = await api.request<any>(`/api/pg?${queryString}`);

      const responseData = result.success ? (result.data || {}) : result;
      const listingsData = responseData.items || (Array.isArray(responseData) ? responseData : []);
      const newTotalCount = responseData.total || listingsData.length;
      const newTotalPages = responseData.pages || Math.ceil(newTotalCount / PG_LIMIT) || 1;

      setTotalCount(newTotalCount);
      setTotalPages(newTotalPages);
      setCurrentPage(page);
      setListings(Array.isArray(listingsData) ? listingsData.filter((l: any) => l.published !== false) : []);
      
      fetchAllForMap();
    } catch {
      setError('Unable to load listings. Please try again.');
      toast.error('Failed to load PG listings');
    } finally {
      setLoading(false);
    }
  }, [selectedLocation, selectedType, debouncedSearch, sortBy, priceRange, fetchAllForMap]);

  useEffect(() => {
    fetchListings(1);
  }, [fetchListings]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedLocation('');
    setSelectedType('');
    setSortBy('newest');
    setPriceRange({ min: '', max: '' });
    setCurrentPage(1);
    toast.success('All filters cleared');
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      fetchListings(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const activeFiltersCount = [
    selectedLocation,
    selectedType,
    searchQuery,
    sortBy !== 'newest',
    priceRange.min,
    priceRange.max
  ].filter(Boolean).length;

  if (loading && currentPage === 1) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading properties...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section - Hide in map view */}
      {viewMode !== 'map' && (
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Find Your Perfect PG</h1>
            <p className="text-white/90 text-lg mb-6">
              Discover verified PGs with best amenities at affordable prices
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by city, PG name, or locality..."
                className="w-full pl-12 pr-4 py-3 text-gray-900 rounded-xl focus:ring-2 focus:ring-orange-400 outline-none shadow-lg"
              />
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        {/* Filter Bar */}
        <div className={`bg-white rounded-xl shadow-sm border mb-6 transition-all ${isScrolled ? 'shadow-md' : ''}`}>
          <div className="p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-orange-500 text-white text-xs rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {activeFiltersCount > 0 && (
                <div className="flex items-center gap-2">
                  <div className="h-6 w-px bg-gray-200" />
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-red-500 transition flex items-center gap-1"
                  >
                    <X className="h-3 w-3" />
                    Clear all
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition ${
                    viewMode === 'grid' ? 'bg-white shadow text-orange-500' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition ${
                    viewMode === 'list' ? 'bg-white shadow text-orange-500' : 'text-gray-500 hover:text-gray-700'
                  }`}
                  title="List View"
                >
                  <ListIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Big View Map Button */}
              <button
                onClick={() => setViewMode('map')}
                className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium shadow-md"
              >
                <MapIcon className="h-5 w-5" />
                View Map
              </button>

              <button
                onClick={() => fetchListings(currentPage)}
                className="p-2 text-gray-500 hover:text-orange-500 transition"
                title="Refresh"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Expanded Filters Panel */}
          <div className={`border-t transition-all duration-300 overflow-hidden ${showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="p-4 bg-gray-50 rounded-b-xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                  >
                    <option value="">All Locations</option>
                    {locations.map((loc) => (
                      <option key={loc.name} value={loc.name}>
                        {loc.name} ({loc.count})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PG Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                  >
                    <option value="">All Types</option>
                    <option value="boys">Boys PG</option>
                    <option value="girls">Girls PG</option>
                    <option value="co-ed">Co-ed PG</option>
                    <option value="family">Family PG</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Range (₹)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 hover:text-red-600 transition"
                >
                  Clear All
                </button>
                <button
                  onClick={() => {
                    setShowFilters(false);
                    fetchListings(1);
                  }}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filter Tags */}
        {viewMode !== 'map' && activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedLocation && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                <MapPin className="h-3 w-3" />
                {selectedLocation}
                <button onClick={() => setSelectedLocation('')} className="ml-1 hover:text-orange-900">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedType && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {selectedType === 'boys'
                  ? 'Boys PG'
                  : selectedType === 'girls'
                  ? 'Girls PG'
                  : selectedType === 'co-ed'
                  ? 'Co-ed PG'
                  : 'Family PG'}
                <button onClick={() => setSelectedType('')} className="ml-1 hover:text-blue-900">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {(priceRange.min || priceRange.max) && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                ₹{priceRange.min || '0'} - ₹{priceRange.max || '∞'}
                <button
                  onClick={() => setPriceRange({ min: '', max: '' })}
                  className="ml-1 hover:text-green-900"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                🔍 {searchQuery}
                <button onClick={() => setSearchQuery('')} className="ml-1 hover:text-gray-900">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-center">
            <p className="text-red-600">{error}</p>
            <button onClick={() => fetchListings(1)} className="mt-2 text-red-500 underline">
              Try Again
            </button>
          </div>
        )}

        {/* Map View - Shows ALL PGs from database */}
        {viewMode === 'map' ? (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="p-3 bg-blue-50 border-b text-sm text-blue-700 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>📍 Click on any marker to see PG details. Scroll to zoom in/out.</span>
            </div>
            <AirbnbMap listings={allListings.length > 0 ? allListings : listings} loading={loading} />
          </div>
        ) : (
          <>
            {/* PG Listings - Only 3 per page */}
            {listings.length > 0 ? (
              <>
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }
                >
                  {listings.map((pg) => (
                    <PGCard key={pg._id} pg={pg} />
                  ))}
                </div>

                {/* Simple Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10">
                    <div className="flex justify-center items-center gap-4">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-orange-50 hover:border-orange-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        ← Previous
                      </button>

                      <span className="text-gray-700 font-medium">
                        Page {currentPage} of {totalPages}
                      </span>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-orange-50 hover:border-orange-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No properties found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search criteria</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default PGList;