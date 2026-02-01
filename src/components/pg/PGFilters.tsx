// components/pg/PGFilters.tsx
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PGFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedPriceRange: number;
  setSelectedPriceRange: (range: number) => void;
  selectedAmenities: string[];
  setSelectedAmenities: (amenities: string[]) => void;
  onClearFilters: () => void;
  locations: string[];
  amenities: string[];
  priceRanges: Array<{ min: number; max: number; label: string }>;
}

export const PGFilters = ({
  searchQuery,
  setSearchQuery,
  selectedLocation,
  setSelectedLocation,
  selectedType,
  setSelectedType,
  selectedPriceRange,
  setSelectedPriceRange,
  selectedAmenities,
  setSelectedAmenities,
  onClearFilters,
  locations,
  amenities,
  priceRanges,
}: PGFiltersProps) => {
  const hasActiveFilters = 
    searchQuery || 
    selectedLocation !== 'All Locations' || 
    selectedType !== 'all' || 
    selectedPriceRange !== 0 || 
    selectedAmenities.length > 0;

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by PG name, location, or amenities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-12 text-lg"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-4">
        {/* Location Filter */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
          >
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PG Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
          >
            <option value="all">All Types</option>
            <option value="boys">Boys</option>
            <option value="girls">Girls</option>
            <option value="co-ed">Co-Ed</option>
          </select>
        </div>

        {/* Price Range Filter */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </label>
          <select
            value={selectedPriceRange}
            onChange={(e) => setSelectedPriceRange(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
          >
            <option value={0}>All Prices</option>
            {priceRanges.map((range, index) => (
              <option key={index} value={index + 1}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Amenities Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amenities
        </label>
        <div className="flex flex-wrap gap-2">
          {amenities.slice(0, 10).map((amenity) => (
            <Badge
              key={amenity}
              variant={selectedAmenities.includes(amenity) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => {
                if (selectedAmenities.includes(amenity)) {
                  setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                } else {
                  setSelectedAmenities([...selectedAmenities, amenity]);
                }
              }}
            >
              {amenity}
              {selectedAmenities.includes(amenity) && (
                <X className="ml-1 h-3 w-3" />
              )}
            </Badge>
          ))}
          {amenities.length > 10 && (
            <span className="text-sm text-gray-500 self-center ml-2">
              +{amenities.length - 10} more
            </span>
          )}
        </div>
      </div>

      {/* Active Filters & Clear Button */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                Search: {searchQuery}
                <button onClick={() => setSearchQuery('')}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedLocation !== 'All Locations' && (
              <Badge variant="secondary" className="gap-1">
                Location: {selectedLocation}
                <button onClick={() => setSelectedLocation('All Locations')}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedType !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                Type: {selectedType}
                <button onClick={() => setSelectedType('all')}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedPriceRange !== 0 && (
              <Badge variant="secondary" className="gap-1">
                Price: {priceRanges[selectedPriceRange].label}
                <button onClick={() => setSelectedPriceRange(0)}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedAmenities.map(amenity => (
              <Badge key={amenity} variant="secondary" className="gap-1">
                {amenity}
                <button onClick={() => setSelectedAmenities(selectedAmenities.filter(a => a !== amenity))}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-600 hover:text-gray-900"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};