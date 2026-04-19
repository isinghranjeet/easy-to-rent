/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

// Fix marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker colors by PG type
const getMarkerIcon = (type: string, isSelected: boolean = false) => {
  const colors: Record<string, string> = {
    boys: '#3b82f6',
    girls: '#ec4899',
    'co-ed': '#8b5cf6',
    family: '#10b981'
  };
  const color = colors[type] || '#f97316';
  const size = isSelected ? 48 : 40;
  
  return L.divIcon({
    html: `<div style="
      background-color: ${color};
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      cursor: pointer;
      transition: all 0.2s ease;
      transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
    ">
      <svg width="${size - 14}" height="${size - 14}" viewBox="0 0 24 24" fill="white" stroke="none">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      </svg>
      ${isSelected ? `<div style="
        position: absolute;
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 10px solid ${color};
      "></div>` : ''}
    </div>`,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size/2, size],
    popupAnchor: [0, -size/2]
  });
};

// Component to center map
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    if (center && map) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

interface PG {
  _id: string;
  name: string;
  address: string;
  city: string;
  price: number;
  type: 'boys' | 'girls' | 'co-ed' | 'family';
  images: string[];
  rating: number;
  reviewCount: number;
  coordinates?: { lat: number; lng: number };
  slug?: string;
}

interface AirbnbMapProps {
  listings: PG[];
  loading?: boolean;
  onListingClick?: (pg: PG) => void;
}

export const AirbnbMap = ({ listings, loading = false, onListingClick }: AirbnbMapProps) => {
  const [selectedPG, setSelectedPG] = useState<PG | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([30.7333, 76.7794]);
  const [mapZoom, setMapZoom] = useState(12);
  const [hoveredPG, setHoveredPG] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const listingRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Filter listings by type
  const filteredListings = listings.filter(pg => {
    if (typeFilter !== 'all' && pg.type !== typeFilter) return false;
    return true;
  });

  // Filter PGs with valid coordinates (for map display)
  const validListings = filteredListings.filter(pg => {
    const hasValidCoords = pg.coordinates && 
                           pg.coordinates.lat && 
                           pg.coordinates.lat !== 0 && 
                           pg.coordinates.lng && 
                           pg.coordinates.lng !== 0;
    return hasValidCoords;
  });

  // Debug logs
  useEffect(() => {
    console.log('AirbnbMap - Listings received:', listings.length);
    console.log('AirbnbMap - Valid listings for map:', validListings.length);
  }, [listings, validListings]);

  // Show warning if no PGs have coordinates
  useEffect(() => {
    if (!loading && listings.length > 0 && validListings.length === 0) {
      toast.error('⚠️ No location data available!', {
        description: 'Please add coordinates to your PG listings to see them on map.'
      });
    }
  }, [listings, validListings, loading]);

  const centerOnPG = (pg: PG) => {
    if (pg.coordinates?.lat && pg.coordinates?.lng) {
      setMapCenter([pg.coordinates.lat, pg.coordinates.lng]);
      setMapZoom(16);
      setSelectedPG(pg);
      
      // Scroll to listing
      const element = listingRefs.current.get(pg._id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gray-100 rounded-xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading properties...</p>
        </div>
      </div>
    );
  }

  // Count PGs without coordinates
  const pgsWithoutCoordinates = listings.filter(pg => !pg.coordinates?.lat || pg.coordinates.lat === 0);
  
  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-200px)] min-h-[600px] bg-white rounded-xl shadow-lg overflow-hidden border">
      
      {/* LEFT SIDE - LISTINGS */}
      <div className="w-full lg:w-1/2 flex flex-col border-r border-gray-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">
              {validListings.length} {validListings.length === 1 ? 'place' : 'places'} to stay
              {pgsWithoutCoordinates.length > 0 && (
                <span className="text-xs text-gray-400 ml-2">
                  ({pgsWithoutCoordinates.length} without location)
                </span>
              )}
            </h2>
          </div>
          
          {/* Quick Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: 'all', label: 'All', color: 'gray' },
              { id: 'boys', label: '👨 Boys PG', color: 'blue' },
              { id: 'girls', label: '👩 Girls PG', color: 'pink' },
              { id: 'co-ed', label: '👥 Co-ed', color: 'purple' },
              { id: 'family', label: '👪 Family', color: 'green' }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setTypeFilter(filter.id)}
                className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
                  typeFilter === filter.id 
                    ? `bg-${filter.color === 'blue' ? 'blue-600' : filter.color === 'pink' ? 'pink-600' : filter.color === 'purple' ? 'purple-600' : filter.color === 'green' ? 'green-600' : 'gray-900'} text-white` 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Warning if no coordinates */}
        {listings.length > 0 && validListings.length === 0 && (
          <div className="m-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  No location data available for any PG
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  To see PGs on map, add coordinates (latitude/longitude) to your PG listings in the database.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Warning for PGs without coordinates */}
        {pgsWithoutCoordinates.length > 0 && validListings.length > 0 && (
          <div className="mx-4 mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              ℹ️ {pgsWithoutCoordinates.length} PG{pgsWithoutCoordinates.length !== 1 ? 's' : ''} without coordinates (not shown on map)
            </p>
          </div>
        )}
        
        {/* Listings Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {validListings.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No properties with location data</p>
              <p className="text-xs text-gray-400 mt-2">
                {listings.length} PG{listings.length !== 1 ? 's' : ''} found but {pgsWithoutCoordinates.length} without coordinates
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {validListings.map((pg) => {
                const isSelected = selectedPG?._id === pg._id;
                const isHovered = hoveredPG === pg._id;
                
                return (
                  <div
                    key={pg._id}
                    ref={(el) => el && listingRefs.current.set(pg._id, el)}
                    onClick={() => {
                      setSelectedPG(pg);
                      centerOnPG(pg);
                      onListingClick?.(pg);
                    }}
                    onMouseEnter={() => setHoveredPG(pg._id)}
                    onMouseLeave={() => setHoveredPG(null)}
                    className={`flex gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                      isSelected 
                        ? 'border-orange-500 bg-orange-50 shadow-md' 
                        : isHovered 
                          ? 'border-gray-300 shadow-md' 
                          : 'border-gray-200 hover:shadow-md'
                    }`}
                  >
                    {/* Image */}
                    <div className="w-28 h-28 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      <img
                        src={pg.images?.[0] || 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=500'}
                        alt={pg.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=500';
                        }}
                      />
                    </div>
                    
                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 line-clamp-1">{pg.name}</h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {pg.address}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{pg.rating || 4.5}</span>
                          <span className="text-gray-400">({pg.reviewCount || 0})</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div>
                          <span className="text-lg font-bold text-orange-600">₹{pg.price.toLocaleString()}</span>
                          <span className="text-gray-500 text-sm">/month</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          pg.type === 'boys' ? 'bg-blue-100 text-blue-700' :
                          pg.type === 'girls' ? 'bg-pink-100 text-pink-700' :
                          pg.type === 'co-ed' ? 'bg-purple-100 text-purple-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {pg.type === 'boys' ? 'Boys PG' : pg.type === 'girls' ? 'Girls PG' : pg.type === 'co-ed' ? 'Co-ed' : 'Family'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* RIGHT SIDE - MAP */}
      <div className="w-full lg:w-1/2 h-[400px] lg:h-auto bg-gray-100 relative">
        {validListings.length > 0 ? (
          <MapContainer
            key={mapCenter.toString()}
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            
            <MapController center={mapCenter} zoom={mapZoom} />
            
            {/* PG Markers */}
            {validListings.map((pg) => (
              <Marker
                key={pg._id}
                position={[pg.coordinates!.lat, pg.coordinates!.lng]}
                icon={getMarkerIcon(pg.type, selectedPG?._id === pg._id)}
                eventHandlers={{
                  click: () => {
                    setSelectedPG(pg);
                    centerOnPG(pg);
                  },
                  mouseover: () => setHoveredPG(pg._id),
                  mouseout: () => setHoveredPG(null),
                }}
              >
                <Popup>
                  <div className="w-72 p-2">
                    <img
                      src={pg.images?.[0] || '/placeholder-image.jpg'}
                      alt={pg.name}
                      className="w-full h-36 object-cover rounded-lg mb-2"
                    />
                    <h3 className="font-bold text-gray-900">{pg.name}</h3>
                    <p className="text-sm text-gray-500">{pg.address}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-orange-600 font-bold">₹{pg.price.toLocaleString()}/month</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{pg.rating || 4.5}</span>
                      </div>
                    </div>
                    <Link
                      to={`/pg/${pg.slug || pg._id}`}
                      className="mt-3 block text-center bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
                    >
                      View Details
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
            <div className="text-center p-6">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No PGs to display on map</p>
              <p className="text-sm text-gray-500 mt-1">Add coordinates to your PG listings</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};