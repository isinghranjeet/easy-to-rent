/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

// Fix marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom colors for different PG types
const getMarkerColor = (type: string) => {
  switch(type) {
    case 'boys': return '#3b82f6';
    case 'girls': return '#ec4899';
    case 'co-ed': return '#8b5cf6';
    case 'family': return '#10b981';
    default: return '#f97316';
  }
};

export const SimpleMap = ({ listings }: { listings: any[] }) => {
  const [center] = useState([30.7333, 76.7794]);
  
  // Filter PGs with valid coordinates
  const validPGs = listings.filter(pg => {
    const coords = pg.coordinates;
    return coords && coords.lat && coords.lat !== 0 && coords.lng && coords.lng !== 0;
  });
  
  if (validPGs.length === 0) {
    return (
      <div className="h-[500px] bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No PGs with location data</p>
          <p className="text-xs text-gray-400 mt-1">{listings.length} PGs found, {validPGs.length} with coordinates</p>
        </div>
      </div>
    );
  }
  
  return (
    <MapContainer 
      center={center} 
      zoom={12} 
      style={{ height: '500px', width: '100%' }}
      zoomControl={true}
    >
      <TileLayer 
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" 
      />
      
      {validPGs.map(pg => {
        const markerColor = getMarkerColor(pg.type);
        
        const customIcon = L.divIcon({
          html: `<div style="
            background-color: ${markerColor};
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
        
        return (
          <Marker 
            key={pg._id} 
            position={[pg.coordinates.lat, pg.coordinates.lng]}
            icon={customIcon}
          >
            <Popup>
              <div className="w-64 p-2">
                <img 
                  src={pg.images?.[0] || 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=500'} 
                  alt={pg.name}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=500';
                  }}
                />
                <h3 className="font-bold text-gray-900">{pg.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{pg.address}</p>
                <p className="text-orange-600 font-bold mt-2">₹{pg.price.toLocaleString()}<span className="text-xs font-normal">/month</span></p>
                <Link 
                  to={`/pg/${pg.slug || pg._id}`}
                  className="mt-2 block text-center bg-orange-500 text-white py-1.5 rounded-lg hover:bg-orange-600 transition text-sm"
                >
                  View Details
                </Link>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};