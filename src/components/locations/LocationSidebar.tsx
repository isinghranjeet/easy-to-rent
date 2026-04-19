// src/components/locations/LocationSidebar.tsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, ChevronRight, Search, Loader2 } from 'lucide-react';
import { api } from '@/services/api';

interface Location {
  _id: string;
  name: string;
  slug: string;
  pgCount: number;
  image?: string;
}

interface LocationSidebarProps {
  onLocationSelect?: (location: Location) => void;
  limit?: number;
}

const LocationSidebar: React.FC<LocationSidebarProps> = ({ 
  onLocationSelect, 
  limit = 10 
}) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const currentPath = useLocation();

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const response = await api.getPopularLocations(limit);
        if (response.success) {
          setLocations(response.data);
          setFilteredLocations(response.data);
        }
      } catch (error) {
        console.error('Error loading locations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLocations();
  }, [limit]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = locations.filter(loc =>
        loc.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations(locations);
    }
  }, [searchTerm, locations]);

  const handleLocationClick = (location: Location) => {
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-orange-500" />
        Popular Locations
      </h2>

      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search locations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      {/* Locations List */}
      <div className="space-y-1 max-h-96 overflow-y-auto">
        {filteredLocations.map((location) => {
          const isActive = currentPath.pathname === `/location/${location.slug}`;
          
          return (
            <Link
              key={location._id}
              to={`/location/${location.slug}`}
              onClick={() => handleLocationClick(location)}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-orange-50 text-orange-600'
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <MapPin className={`h-4 w-4 ${isActive ? 'text-orange-500' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">{location.name}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{location.pgCount} PGs</span>
                <ChevronRight className={`h-4 w-4 ${isActive ? 'text-orange-500' : 'text-gray-400'}`} />
              </div>
            </Link>
          );
        })}
      </div>

      {filteredLocations.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No locations found
        </div>
      )}
    </div>
  );
};

export default LocationSidebar;  // ✅ Default export