import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Home, Filter, Loader2, Star, Wifi, Car, Utensils } from 'lucide-react';
import { api } from '@/services/api';
import { PGCard } from '@/components/pg/PGCard';
import { transformPGData } from '@/lib/utils/pgTransformer';

interface LocationData {
  _id: string;
  name: string;
  slug: string;
  pgCount: number;
  image: string;
  description?: string;
  coordinates?: { lat: number; lng: number };
}

const LocationPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [location, setLocation] = useState<LocationData | null>(null);
  const [pgs, setPgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    sort: 'price_asc',
    type: '',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    const loadLocation = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const response = await api.getLocationBySlug(slug, {
          page: 1,
          limit: 12,
          sort: filters.sort,
          type: filters.type || undefined,
          minPrice: filters.minPrice ? parseInt(filters.minPrice) : undefined,
          maxPrice: filters.maxPrice ? parseInt(filters.maxPrice) : undefined
        });
        
        if (response.success) {
          setLocation(response.data.location);
          setPgs(response.data.pgs || []);
        }
      } catch (err: any) {
        console.error('Error loading location:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadLocation();
  }, [slug, filters]);

  const applyFilters = () => {
    // Trigger re-fetch with new filters
    const loadLocation = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const response = await api.getLocationBySlug(slug, {
          page: 1,
          limit: 12,
          sort: filters.sort,
          type: filters.type || undefined,
          minPrice: filters.minPrice ? parseInt(filters.minPrice) : undefined,
          maxPrice: filters.maxPrice ? parseInt(filters.maxPrice) : undefined
        });
        if (response.success) {
          setPgs(response.data.pgs || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadLocation();
  };

  const clearFilters = () => {
    setFilters({
      sort: 'price_asc',
      type: '',
      minPrice: '',
      maxPrice: ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading location...</p>
        </div>
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Location Not Found</h2>
          <p className="text-gray-600 mb-6">The location you're looking for doesn't exist.</p>
          <Link to="/" className="text-orange-500 hover:underline">
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="relative h-64 md:h-80 bg-cover bg-center"
        style={{ backgroundImage: `url(${location.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="h-8 w-8" />
              <h1 className="text-3xl md:text-4xl font-bold">{location.name}</h1>
            </div>
            
            {location.description && (
              <p className="text-white/90 max-w-2xl">{location.description}</p>
            )}
            
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                <span>{pgs.length} PGs Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Filters Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <select
                value={filters.sort}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Rating: High to Low</option>
              </select>
              
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Types</option>
                <option value="boys">Boys Only</option>
                <option value="girls">Girls Only</option>
                <option value="co-ed">Co-ed</option>
                <option value="family">Family</option>
              </select>
              
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                className="w-28 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                className="w-28 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              
              <button
                onClick={applyFilters}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                Apply
              </button>
              
              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* PGs Grid */}
        {pgs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No PGs Found
            </h3>
            <p className="text-gray-500">
              No PGs available in {location.name} with the selected filters.
            </p>
            <button onClick={clearFilters} className="mt-4 text-orange-500 hover:underline">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pgs.map((pg, index) => (
              <PGCard key={pg._id} pg={transformPGData(pg)} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPage;