/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { MapPin, Star, Navigation, X, Wifi, Car, UtensilsCrossed, Wind } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// ─── Fix Leaflet default icons ───
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// ─── Types ───
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
  amenities?: string[];
  featured?: boolean;
  verified?: boolean;
}

interface AdvancedMapProps {
  listings: PG[];
  loading?: boolean;
  onListingHover?: (id: string | null) => void;
  hoveredId?: string | null;
  onListingClick?: (pg: PG) => void;
}

// ─── Price Bubble Icon (Airbnb Style) ───
const createPriceIcon = (price: number, isSelected: boolean, isHovered: boolean) => {
  const bg = isSelected ? '#f97316' : isHovered ? '#1f2937' : '#ffffff';
  const text = isSelected || isHovered ? '#ffffff' : '#1f2937';
  const shadow = isSelected
    ? '0 4px 16px rgba(249,115,22,0.4)'
    : '0 2px 8px rgba(0,0,0,0.18)';
  const scale = isSelected ? 1.12 : isHovered ? 1.06 : 1;

  return L.divIcon({
    html: `<div style="
      background: ${bg};
      color: ${text};
      padding: 6px 14px;
      border-radius: 24px;
      font-weight: 700;
      font-size: 13px;
      font-family: 'Segoe UI', system-ui, sans-serif;
      box-shadow: ${shadow};
      border: 2px solid ${isSelected ? '#f97316' : isHovered ? '#1f2937' : '#e5e7eb'};
      white-space: nowrap;
      transform: scale(${scale});
      transition: all 0.2s ease;
      cursor: pointer;
      display: inline-block;
    ">₹${price.toLocaleString()}</div>`,
    className: 'price-marker',
    iconSize: [80, 36],
    iconAnchor: [40, 18],
  });
};

// ─── Cluster Icon ───
const createClusterIcon = (cluster: any) => {
  const count = cluster.getChildCount();
  let size = 40;
  let bg = '#f97316';
  if (count >= 100) { size = 52; bg = '#ea580c'; }
  else if (count >= 50) { size = 46; bg = '#f97316'; }
  else if (count >= 20) { size = 42; bg = '#fb923c'; }
  else { size = 38; bg = '#fdba74'; }

  return L.divIcon({
    html: `<div style="
      width: ${size}px; height: ${size}px; border-radius: 50%;
      background: ${bg}; color: white;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 13px; font-family: sans-serif;
      box-shadow: 0 3px 10px rgba(0,0,0,0.25); border: 3px solid white;
    ">${count}</div>`,
    className: 'cluster-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// ─── Pulsing User Location Dot ───
const userLocationIcon = L.divIcon({
  html: `<div style="position:relative;width:20px;height:20px;">
    <div style="position:absolute;top:-10px;left:-10px;width:40px;height:40px;border-radius:50%;background:rgba(59,130,246,0.25);animation:pulse-ring 2s ease-out infinite;"></div>
    <div style="position:absolute;top:-4px;left:-4px;width:28px;height:28px;border-radius:50%;background:rgba(59,130,246,0.15);animation:pulse-ring 2s ease-out infinite 0.5s;"></div>
    <div style="position:absolute;top:0;left:0;width:20px;height:20px;border-radius:50%;background:#3b82f6;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>
  </div>
  <style>@keyframes pulse-ring{0%{transform:scale(0.5);opacity:1}100%{transform:scale(1.5);opacity:0}}</style>`,
  className: 'user-location-marker',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// ─── Map Controller ───
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    if (center && map) {
      map.flyTo(center, zoom, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

// ─── Fit Bounds Controller ───
function FitBounds({ listings }: { listings: PG[] }) {
  const map = useMap();
  useEffect(() => {
    const valid = listings.filter((l) => l.coordinates?.lat && l.coordinates.lng);
    if (valid.length > 0) {
      const group = new (L as any).featureGroup(
        valid.map((l) => L.marker([l.coordinates!.lat, l.coordinates!.lng]))
      );
      map.fitBounds(group.getBounds().pad(0.15), { animate: true, duration: 1 });
    }
  }, [listings, map]);
  return null;
}

// ─── Haversine Distance ───
const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// ─── Amenity Icons Map ───
const amenityIcons: Record<string, React.ElementType> = {
  wifi: Wifi,
  parking: Car,
  meals: UtensilsCrossed,
  ac: Wind,
  'air conditioning': Wind,
};

// ─── Main AdvancedMap Component ───
export const AdvancedMap = ({
  listings,
  loading = false,
  onListingHover,
  hoveredId,
  onListingClick,
}: AdvancedMapProps) => {
  const [selectedPG, setSelectedPG] = useState<PG | null>(null);
  const [hoveredPG, setHoveredPG] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([30.7333, 76.7794]);
  const [mapZoom, setMapZoom] = useState(12);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'distance'>('price');
  const mapRef = useRef<L.Map | null>(null);

  // Filter & sort
  const filtered = useMemo(() => {
    let result = listings.filter((pg) => {
      if (typeFilter !== 'all' && pg.type !== typeFilter) return false;
      return true;
    });

    if (userLocation && sortBy === 'distance') {
      result = [...result].sort((a, b) => {
        const da = a.coordinates
          ? getDistance(userLocation[0], userLocation[1], a.coordinates.lat, a.coordinates.lng)
          : Infinity;
        const db = b.coordinates
          ? getDistance(userLocation[0], userLocation[1], b.coordinates.lat, b.coordinates.lng)
          : Infinity;
        return da - db;
      });
    } else if (sortBy === 'price') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'rating') {
      result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [listings, typeFilter, sortBy, userLocation]);

  // Fallback coordinates for common cities
  const cityCoords: Record<string, { lat: number; lng: number }> = {
    chandigarh: { lat: 30.7333, lng: 76.7794 },
    mohali: { lat: 30.7046, lng: 76.7179 },
    panchkula: { lat: 30.6942, lng: 76.8606 },
    zirakpur: { lat: 30.6242, lng: 76.8213 },
    delhi: { lat: 28.7041, lng: 77.1025 },
    gurgaon: { lat: 28.4595, lng: 77.0266 },
    noida: { lat: 28.5355, lng: 77.3910 },
    bangalore: { lat: 12.9716, lng: 77.5946 },
    mumbai: { lat: 19.0760, lng: 72.8777 },
    pune: { lat: 18.5204, lng: 73.8567 },
    hyderabad: { lat: 17.4065, lng: 78.4772 },
    chennai: { lat: 13.0827, lng: 80.2707 },
    kolkata: { lat: 22.5726, lng: 88.3639 },
    jaipur: { lat: 26.9124, lng: 75.7873 },
    lucknow: { lat: 26.8467, lng: 80.9462 },
  };

  // Assign fallback coordinates for listings without them
  const listingsWithCoords = filtered.map((pg) => {
    if (pg.coordinates?.lat && pg.coordinates.lng) return pg;
    const fallback = cityCoords[pg.city?.toLowerCase()] ||
                     cityCoords[pg.address?.toLowerCase()?.split(',')[0]?.trim()];
    if (fallback) {
      return { ...pg, coordinates: fallback };
    }
    return pg;
  });

  // Final fallback: scatter any remaining listings near default center
  const allListingsWithCoords = listingsWithCoords.map((pg, idx) => {
    if (pg.coordinates?.lat && pg.coordinates.lng) return pg;
    const angle = (idx * 137.508) * (Math.PI / 180);
    const radius = 0.02 + (idx % 5) * 0.015;
    return {
      ...pg,
      coordinates: {
        lat: 30.7333 + Math.cos(angle) * radius,
        lng: 76.7794 + Math.sin(angle) * radius,
      },
    };
  });

  const validListings = allListingsWithCoords;

  const getPgDistance = (pg: PG) => {
    if (!userLocation || !pg.coordinates) return null;
    const dist = getDistance(
      userLocation[0], userLocation[1],
      pg.coordinates.lat, pg.coordinates.lng
    );
    return dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`;
  };

  const handleNearMe = () => {
    setGettingLocation(true);
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported');
      setGettingLocation(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        setMapCenter(coords);
        setMapZoom(14);
        setSortBy('distance');
        setGettingLocation(false);
        toast.success('Showing PGs near you!');
      },
      (err) => {
        toast.error(err.code === 1 ? 'Please allow location access' : 'Location unavailable');
        setGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    if (hoveredId) setHoveredPG(hoveredId);
  }, [hoveredId]);

  // ─── MarkerCluster Layer via ref ───
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // Remove existing cluster layer
    map.eachLayer((layer: any) => {
      if (layer._group) {
        map.removeLayer(layer);
      }
    });

    if (validListings.length === 0) return;

    const clusterGroup = (L as any).markerClusterGroup({
      iconCreateFunction: createClusterIcon,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      maxClusterRadius: 60,
    });
    clusterGroup._group = true;

    validListings.forEach((pg) => {
      const marker = L.marker([pg.coordinates!.lat, pg.coordinates!.lng], {
        icon: createPriceIcon(pg.price, selectedPG?._id === pg._id, hoveredPG === pg._id),
      });

      // Click → navigate directly to PG detail page
      marker.on('click', () => {
        setSelectedPG(pg);
        onListingClick?.(pg);
        window.location.href = `/pg/${pg.slug || pg._id}`;
      });

      marker.on('mouseover', () => {
        setHoveredPG(pg._id);
        onListingHover?.(pg._id);
      });
      marker.on('mouseout', () => {
        setHoveredPG(null);
        onListingHover?.(null);
      });

      clusterGroup.addLayer(marker);
    });

    map.addLayer(clusterGroup);

    return () => {
      map.removeLayer(clusterGroup);
    };
  }, [validListings, selectedPG, hoveredPG, onListingClick, onListingHover]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gray-50 rounded-xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-180px)] min-h-[600px] bg-white rounded-xl shadow-lg overflow-hidden border">
      {/* LEFT PANEL — LISTINGS */}
      <div className="w-full lg:w-[45%] flex flex-col border-r border-gray-200">
        {/* Sticky Header */}
        <div className="p-4 border-b border-gray-200 bg-white z-20">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                {validListings.length} {validListings.length === 1 ? 'stay' : 'stays'}
              </h2>
              {userLocation && (
                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                  <Navigation className="h-3 w-3 text-blue-500" />
                  Sorted by nearest
                </p>
              )}
            </div>
            <button
              onClick={handleNearMe}
              disabled={gettingLocation}
              className={cn(
                'flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium transition shadow-sm',
                userLocation
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              )}
            >
              <Navigation className={cn('h-3.5 w-3.5', gettingLocation && 'animate-spin')} />
              {gettingLocation ? 'Locating...' : userLocation ? 'Near Me ✓' : 'Near Me'}
            </button>
          </div>

          {/* Type Filters */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All' },
              { id: 'boys', label: '👨 Boys' },
              { id: 'girls', label: '👩 Girls' },
              { id: 'co-ed', label: '👥 Co-ed' },
              { id: 'family', label: '👪 Family' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setTypeFilter(f.id)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition border',
                  typeFilter === f.id
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-500">Sort:</span>
            {(['price', 'rating', 'distance'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                disabled={s === 'distance' && !userLocation}
                className={cn(
                  'text-xs px-2 py-0.5 rounded transition',
                  sortBy === s
                    ? 'bg-orange-100 text-orange-700 font-medium'
                    : 'text-gray-500 hover:text-gray-700',
                  s === 'distance' && !userLocation && 'opacity-40 cursor-not-allowed'
                )}
              >
                {s === 'price' ? '💰 Price' : s === 'rating' ? '⭐ Rating' : '📍 Distance'}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4">
          {validListings.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No properties with location data</p>
            </div>
          ) : (
            <div className="space-y-3">
              {validListings.map((pg) => {
                const isSel = selectedPG?._id === pg._id;
                const isHov = hoveredPG === pg._id;
                const dist = getPgDistance(pg);

                return (
                  <div
                    key={pg._id}
                    onClick={() => {
                      setSelectedPG(pg);
                      if (pg.coordinates) {
                        setMapCenter([pg.coordinates.lat, pg.coordinates.lng]);
                        setMapZoom(16);
                      }
                      onListingClick?.(pg);
                    }}
                    onMouseEnter={() => {
                      setHoveredPG(pg._id);
                      onListingHover?.(pg._id);
                    }}
                    onMouseLeave={() => {
                      setHoveredPG(null);
                      onListingHover?.(null);
                    }}
                    className={cn(
                      'flex gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border',
                      isSel
                        ? 'border-orange-500 bg-orange-50 shadow-md'
                        : isHov
                          ? 'border-gray-300 shadow-md'
                          : 'border-gray-200 hover:shadow-md hover:border-gray-300'
                    )}
                  >
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      <img
                        src={pg.images?.[0] || 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=500'}
                        alt={pg.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=500';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{pg.name}</h3>
                        <div className="flex items-center gap-0.5 text-xs shrink-0">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{pg.rating || 4.5}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-2.5 w-2.5" />
                        {pg.address}
                      </p>
                      {dist && (
                        <p className="text-xs text-blue-600 mt-0.5">📍 {dist} away</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-base font-bold text-orange-600">₹{pg.price.toLocaleString()}</span>
                        <span className={cn(
                          'text-[10px] px-2 py-0.5 rounded-full font-medium',
                          pg.type === 'boys' ? 'bg-blue-100 text-blue-700' :
                          pg.type === 'girls' ? 'bg-pink-100 text-pink-700' :
                          pg.type === 'co-ed' ? 'bg-purple-100 text-purple-700' :
                          'bg-green-100 text-green-700'
                        )}>
                          {pg.type === 'boys' ? 'Boys' : pg.type === 'girls' ? 'Girls' : pg.type === 'co-ed' ? 'Co-ed' : 'Family'}
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

      {/* RIGHT PANEL — MAP */}
      <div className="w-full lg:w-[55%] h-[400px] lg:h-auto bg-gray-100 relative">
        {validListings.length > 0 ? (
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
            whenReady={() => {
              const map = (mapRef as any).current;
              if (!map) return;
              L.control.zoom({ position: 'bottomright' }).addTo(map);
            }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            <MapController center={mapCenter} zoom={mapZoom} />
            <FitBounds listings={validListings} />

            {/* User location marker */}
            {userLocation && (
              <Marker position={userLocation} icon={userLocationIcon}>
                <Popup>
                  <div className="text-center text-sm font-medium">You are here</div>
                </Popup>
              </Marker>
            )}
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

