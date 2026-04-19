/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Loader2, Navigation, MapPin, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';
import { toast } from 'sonner';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface PG {
  _id: string;
  name: string;
  address: string;
  city: string;
  price: number;
  type: 'boys' | 'girls' | 'co-ed' | 'family';
  images: string[];
  rating: number;
  reviewCount?: number;
  coordinates?: { lat: number; lng: number };
  slug?: string;
  distance?: number;
}

interface PGMapProps {
  pgs: PG[];
  height?: string;
  showNearMe?: boolean;
  center?: [number, number];
  zoom?: number;
}

// Component to set map view
function SetViewOnLocation({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// Custom marker icons
const getPGIcon = (type: string) => {
  const colors: Record<string, string> = {
    boys: '#3b82f6',
    girls: '#ec4899',
    'co-ed': '#8b5cf6',
    family: '#10b981'
  };
  const color = colors[type] || '#f97316';
  
  return L.divIcon({
    html: `<div style="
      background-color: ${color};
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      cursor: pointer;
    ">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="none">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      </svg>
    </div>`,
    className: 'custom-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  });
};

export const PGMap = ({ pgs, height = '500px', showNearMe = true, center, zoom = 13 }: PGMapProps) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>(center || [30.7333, 76.7794]);

  const getUserLocation = () => {
    setGettingLocation(true);
    
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      setGettingLocation(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setMapCenter([latitude, longitude]);
        setGettingLocation(false);
        toast.success('Location detected! Showing PGs near you.');
      },
      (error) => {
        let message = 'Unable to get your location';
        if (error.code === error.PERMISSION_DENIED) {
          message = 'Please allow location access to see PGs near you';
        }
        toast.error(message);
        setGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Calculate distance between coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`;
  };

  // Filter PGs with valid coordinates
  const validPGs = pgs.filter(pg => pg.coordinates?.lat && pg.coordinates?.lng);

  return (
    <div className="space-y-4">
      {showNearMe && (
        <div className="flex gap-3">
          <button
            onClick={getUserLocation}
            disabled={gettingLocation}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
          >
            <Navigation className="h-4 w-4" />
            {gettingLocation ? 'Getting Location...' : userLocation ? 'Update My Location' : '📍 Find PGs Near Me'}
          </button>
          
          {userLocation && (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">Showing PGs near you</span>
              <button onClick={() => setUserLocation(null)} className="ml-2 hover:text-green-900">
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}
      
      <div className="rounded-xl overflow-hidden border shadow-lg" style={{ height, width: '100%' }}>
        <MapContainer
          key={mapCenter.toString()}
          center={mapCenter}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          
          {userLocation && <SetViewOnLocation center={userLocation} zoom={zoom} />}
          
          {/* User location marker */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={L.divIcon({
                html: `<div style="
                  background-color: #3b82f6;
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  border: 3px solid white;
                  box-shadow: 0 0 0 4px rgba(59,130,246,0.4);
                ">
                  <div style="
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 8px;
                    height: 8px;
                    background: white;
                    border-radius: 50%;
                  "></div>
                </div>`,
                className: 'user-location-marker',
                iconSize: [20, 20],
                iconAnchor: [10, 10],
              })}
            >
              <Popup>
                <div className="text-center">
                  <p className="font-semibold">You are here</p>
                </div>
              </Popup>
            </Marker>
          )}
          
          {/* PG Markers */}
          {validPGs.map((pg) => {
            const distance = userLocation && pg.coordinates?.lat
              ? calculateDistance(userLocation[0], userLocation[1], pg.coordinates.lat, pg.coordinates.lng)
              : null;
            
            return (
              <Marker
                key={pg._id}
                position={[pg.coordinates!.lat, pg.coordinates!.lng]}
                icon={getPGIcon(pg.type)}
              >
                <Popup>
                  <div className="w-64 p-2">
                    <img
                      src={pg.images?.[0] || '/placeholder-image.jpg'}
                      alt={pg.name}
                      className="w-full h-32 object-cover rounded-lg mb-2"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=500';
                      }}
                    />
                    <h3 className="font-bold text-gray-900 text-sm">{pg.name}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {pg.address}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-orange-600 font-bold text-sm">
                        ₹{pg.price.toLocaleString()}/month
                      </span>
                      {distance && (
                        <span className="text-xs text-gray-500">📍 {distance}</span>
                      )}
                    </div>
                    <Link
                      to={`/pg/${pg.slug || pg._id}`}
                      className="mt-2 block text-center text-xs bg-orange-500 text-white py-1.5 rounded-lg hover:bg-orange-600 transition"
                    >
                      View Details
                    </Link>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
      
      {validPGs.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No properties with location data available</p>
        </div>
      )}
    </div>
  );
};