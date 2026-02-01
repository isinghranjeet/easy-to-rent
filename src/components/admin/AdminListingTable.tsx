import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, Edit, Trash2, Star, ShieldCheck, MapPin, User, Phone, 
  Mail, Home, CheckCircle, XCircle, ExternalLink, MoreVertical,
  TrendingUp, DollarSign, Users, Calendar, Settings, Zap
} from 'lucide-react';
import { PGListing } from './types';

interface AdminListingTableProps {
  listings: PGListing[];
  viewMode: 'grid' | 'list';
  onEdit: (listing: PGListing) => void;
  onDelete: (id: string, name: string) => void;
  onToggleStatus: (id: string, field: 'published' | 'featured' | 'verified') => void;
}

const AdminListingTable = ({
  listings,
  viewMode,
  onEdit,
  onDelete,
  onToggleStatus
}: AdminListingTableProps) => {
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div 
            key={listing._id}
            className="group bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
            onMouseEnter={() => setHoveredId(listing._id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Image Container */}
            <div className="relative h-56 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
              <img
                src={listing.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80'}
                alt={listing.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              
              {/* Status Badges */}
              <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
                {listing.featured && (
                  <span className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    Featured
                  </span>
                )}
                {listing.verified && (
                  <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Verified
                  </span>
                )}
              </div>
              
              {/* Price Overlay */}
              <div className="absolute bottom-3 left-3 z-20">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-xl shadow-2xl">
                  <div className="text-xl font-bold">₹{listing.price.toLocaleString()}</div>
                  <div className="text-xs opacity-90">per month</div>
                </div>
              </div>
              
              {/* Type Badge */}
              <div className="absolute top-3 right-3 z-20">
                <span className={`px-3 py-1.5 text-xs font-bold rounded-full shadow-lg ${
                  listing.type === 'boys' ? 'bg-blue-900/80 text-blue-200 border border-blue-700' :
                  listing.type === 'girls' ? 'bg-pink-900/80 text-pink-200 border border-pink-700' :
                  listing.type === 'co-ed' ? 'bg-purple-900/80 text-purple-200 border border-purple-700' :
                  'bg-emerald-900/80 text-emerald-200 border border-emerald-700'
                }`}>
                  {listing.type === 'co-ed' ? 'Co-Ed' : listing.type} PG
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg line-clamp-1 group-hover:text-blue-300 transition-colors">
                    {listing.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-300">{listing.city}</span>
                    {listing.locality && (
                      <>
                        <span className="text-gray-600">•</span>
                        <span className="text-sm text-gray-300">{listing.locality}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.round(listing.rating || 0)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-gray-700'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-white">
                  {listing.rating?.toFixed(1) || '0.0'}
                </span>
                <span className="text-gray-600">•</span>
                <span className="text-sm text-gray-400">
                  ({listing.reviewCount || 0} reviews)
                </span>
              </div>

              {/* Amenities Preview */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {listing.amenities?.slice(0, 3).map((amenity: string, index: number) => (
                  <span 
                    key={index} 
                    className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-md border border-gray-700"
                  >
                    {amenity}
                  </span>
                ))}
                {listing.amenities?.length > 3 && (
                  <span className="px-2 py-1 bg-gray-800 text-gray-500 text-xs rounded-md border border-gray-700">
                    +{listing.amenities.length - 3} more
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/pg/${listing._id}`)}
                    className="group/btn px-4 py-2 bg-gradient-to-r from-blue-900/30 to-blue-900/10 text-blue-300 rounded-lg hover:from-blue-800/50 hover:to-blue-900/30 transition-all duration-300 flex items-center gap-2 font-medium text-sm border border-blue-800/30 hover:border-blue-600/50"
                    title="View Public Page"
                  >
                    <Eye className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                    View
                  </button>
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEdit(listing)}
                    className="p-2 text-gray-400 hover:text-amber-300 hover:bg-amber-900/20 rounded-lg transition-all duration-300 border border-transparent hover:border-amber-700/30"
                    title="Edit Listing"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(listing._id, listing.name)}
                    className="p-2 text-gray-400 hover:text-rose-300 hover:bg-rose-900/20 rounded-lg transition-all duration-300 border border-transparent hover:border-rose-700/30"
                    title="Delete Listing"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-4">
      {listings.map((listing) => (
        <div 
          key={listing._id} 
          className="group bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 p-6 hover:border-gray-700 transition-all duration-300 hover:shadow-2xl"
        >
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            {/* Image */}
            <div className="relative lg:w-48 lg:h-48 w-full h-56 rounded-xl overflow-hidden">
              <img
                src={listing.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'}
                alt={listing.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1.5 text-xs font-bold rounded-full shadow-lg ${
                  listing.published ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-700' : 
                  'bg-gray-800 text-gray-300 border border-gray-700'
                }`}>
                  {listing.published ? 'Live' : 'Draft'}
                </span>
              </div>
            </div>
            
            {/* Details */}
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold text-white">{listing.name}</h3>
                    <div className="flex items-center gap-2">
                      {listing.featured && (
                        <span className="px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full">
                          Featured
                        </span>
                      )}
                      {listing.verified && (
                        <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">{listing.city}</span>
                      {listing.locality && (
                        <>
                          <span className="text-gray-600">•</span>
                          <span className="text-gray-300">{listing.locality}</span>
                        </>
                      )}
                    </div>
                    <span className="text-gray-600">•</span>
                    <span className={`font-medium ${
                      listing.type === 'boys' ? 'text-blue-400' :
                      listing.type === 'girls' ? 'text-pink-400' :
                      listing.type === 'co-ed' ? 'text-purple-400' :
                      'text-emerald-400'
                    }`}>
                      {listing.type === 'co-ed' ? 'Co-Ed' : listing.type} PG
                    </span>
                    <span className="text-gray-600">•</span>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-emerald-400" />
                      <span className="text-xl font-bold text-emerald-400">₹{listing.price.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 line-clamp-2 mb-4">
                    {listing.description || 'No description available'}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {listing.amenities?.slice(0, 5).map((amenity: string, index: number) => (
                      <span key={index} className="px-3 py-1.5 bg-gray-800 text-gray-300 text-sm rounded-lg border border-gray-700">
                        {amenity}
                      </span>
                    ))}
                    {listing.amenities?.length > 5 && (
                      <span className="px-3 py-1.5 bg-gray-800 text-gray-500 text-sm rounded-lg border border-gray-700">
                        +{listing.amenities.length - 5} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300">{listing.ownerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300 font-medium">{listing.ownerPhone || '9315058665'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => navigate(`/pg/${listing._id}`)}
                    className="px-4 py-2.5 bg-gradient-to-r from-blue-900/30 to-blue-900/10 text-blue-300 rounded-lg hover:from-blue-800/50 hover:to-blue-900/30 transition-all duration-300 flex items-center gap-2 font-medium border border-blue-800/30 hover:border-blue-600/50"
                  >
                    <Eye className="h-4 w-4" />
                    View Public
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(listing)}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-900/30 to-amber-900/10 text-amber-300 rounded-lg hover:from-amber-800/50 hover:to-amber-900/30 transition-all duration-300 flex items-center gap-2 font-medium border border-amber-800/30 hover:border-amber-600/50"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(listing._id, listing.name)}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-rose-900/30 to-rose-900/10 text-rose-300 rounded-lg hover:from-rose-800/50 hover:to-rose-900/30 transition-all duration-300 flex items-center gap-2 font-medium border border-rose-800/30 hover:border-rose-600/50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminListingTable;