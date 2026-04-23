/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Trash2,
  Shield,
  ShieldOff,
  ShieldAlert,
  Search,
  RefreshCw,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  Calendar,
  Clock,
  UserCircle,
  LogOut,
  Home,
  Loader2,
  Eye,
  X,
  MapPin,
  Globe,
  Building2,
  Download,
  Filter,
  Activity,
  Star,
  Key,
  Edit,
  Save,
  Bell,
  Send,
  Mail as MailIcon,
  Award,
  Verified,
  Image,
  TrendingUp,
  Youtube,
  Video,
  Play,
  ExternalLink,
  Copy,
  Check as CheckIcon,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api, User } from '@/services/api';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// ────────────────── Types ──────────────────
interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  ipAddress: string;
  details?: Record<string, any>;
}

interface Location {
  city: string;
  state: string;
  country: string;
  timezone: string;
  address?: string;
  pincode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface UserWithLocation extends User {
  location?: Location;
  lastLogin?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'suspended';
}

interface EditUserData {
  name: string;
  email: string;
  phone: string;
  role: string;
  location: Location;
}

interface PGListing {
  _id: string;
  id?: string;
  name: string;
  slug?: string;
  city: string;
  locality?: string;
  address?: string;
  price: number;
  rating: number;
  verified: boolean;
  published: boolean;
  featured: boolean;
  images: string[];
  gallery?: string[];
  ownerName: string;
  ownerPhone: string;
  createdAt: string;
  views: number;
  weeklyBookings: number;
  type: string;
  description?: string;
  amenities?: string[];
  wifi?: boolean;
  meals?: boolean;
  ac?: boolean;
  parking?: boolean;
  availableRooms?: number;
  minStay?: string;
  videoUrl?: string;
  virtualTour?: string;
}

interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  pgListing: {
    _id: string;
    name: string;
    city: string;
  };
  rating: number;
  title: string;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

// ────────────────── Status Badge Component ──────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    active: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
    inactive: { bg: 'bg-gray-50 border-gray-200', text: 'text-gray-500', icon: <XCircle className="h-3.5 w-3.5" /> },
    suspended: { bg: 'bg-red-50 border-red-200', text: 'text-red-600', icon: <ShieldAlert className="h-3.5 w-3.5" /> },
  };
  const c = config[status] || config.active;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text}`}>
      {c.icon} {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// ────────────────── Role Badge Component ──────────────────
const RoleBadge = ({ role }: { role: string }) => {
  const config: Record<string, { bg: string; text: string }> = {
    admin: { bg: 'bg-purple-100 border-purple-300', text: 'text-purple-700' },
    owner: { bg: 'bg-blue-100 border-blue-300', text: 'text-blue-700' },
    user: { bg: 'bg-sky-50 border-sky-200', text: 'text-sky-600' },
    moderator: { bg: 'bg-amber-100 border-amber-300', text: 'text-amber-700' },
  };
  const c = config[role] || config.user;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${c.bg} ${c.text}`}>
      {role === 'admin' ? <Shield className="h-3 w-3" /> : <UserCircle className="h-3 w-3" />}
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
};

// ────────────────── Property Status Badge ──────────────────
const PropertyStatusBadge = ({ verified, published }: { verified: boolean; published: boolean }) => {
  if (verified && published) {
    return <span className="px-2 py-1 rounded-lg text-xs font-medium bg-emerald-100 text-emerald-700 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Live</span>;
  }
  if (verified && !published) {
    return <span className="px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 flex items-center gap-1"><XCircle className="h-3 w-3" /> Draft</span>;
  }
  return <span className="px-2 py-1 rounded-lg text-xs font-medium bg-amber-100 text-amber-700 flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Pending</span>;
};

// ────────────────── Location Badge Component ──────────────────
const LocationBadge = ({ location }: { location?: Location }) => {
  if (!location || !location.city) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-100 text-gray-500 text-xs">
        <Globe className="h-3 w-3" />
        Not specified
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs border border-blue-200">
      <MapPin className="h-3 w-3" />
      {location.city}, {location.state}
    </span>
  );
};

// ────────────────── Virtual Tour Badge Component ──────────────────
const VirtualTourBadge = ({ videoUrl, virtualTour }: { videoUrl?: string; virtualTour?: string }) => {
  const hasVideo = !!(videoUrl || virtualTour);
  if (!hasVideo) {
    return <span className="text-xs text-gray-400">No video</span>;
  }
  return (
    <div className="flex flex-col gap-1">
      <Badge className="bg-blue-100 text-blue-700 w-fit gap-1">
        <Youtube className="h-3 w-3" />
        {videoUrl ? 'YouTube Tour' : virtualTour ? '3D Tour' : 'Video'}
      </Badge>
    </div>
  );
};

// ────────────────── Confirm Modal ──────────────────
interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  variant: 'danger' | 'warning' | 'info';
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({ isOpen, title, message, confirmText, variant, loading, onConfirm, onCancel }: ConfirmModalProps) => {
  if (!isOpen) return null;
  
  const variantConfig = {
    danger: { bg: 'bg-red-100', icon: <AlertTriangle className="h-6 w-6 text-red-600" />, button: 'bg-red-600 hover:bg-red-700' },
    warning: { bg: 'bg-amber-100', icon: <AlertTriangle className="h-6 w-6 text-amber-600" />, button: 'bg-amber-600 hover:bg-amber-700' },
    info: { bg: 'bg-blue-100', icon: <Shield className="h-6 w-6 text-blue-600" />, button: 'bg-blue-600 hover:bg-blue-700' },
  };

  const config = variantConfig[variant];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-scaleIn">
        <div className="p-6">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${config.bg}`}>
            {config.icon}
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500">{message}</p>
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button onClick={onCancel} disabled={loading} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className={`flex-1 px-4 py-2.5 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 ${config.button}`}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// ────────────────── Image Gallery Modal ──────────────────
const ImageGalleryModal = ({ images, currentIndex, onClose }: { images: string[]; currentIndex: number; onClose: () => void }) => {
  const [index, setIndex] = useState(currentIndex);

  if (!images.length) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-12 right-0 text-white hover:text-gray-300">
          <X className="h-8 w-8" />
        </button>
        <img src={images[index]} alt={`Gallery ${index + 1}`} className="w-full h-auto max-h-[80vh] object-contain rounded-lg" />
        {images.length > 1 && (
          <>
            <button onClick={() => setIndex((i) => (i > 0 ? i - 1 : images.length - 1))} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70">
              <ChevronDown className="h-6 w-6 rotate-90" />
            </button>
            <button onClick={() => setIndex((i) => (i + 1) % images.length)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70">
              <ChevronDown className="h-6 w-6 -rotate-90" />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
              {index + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ────────────────── Property View Modal (FULLY WORKING) ──────────────────
const PropertyViewModal = ({ property, isOpen, onClose }: { property: PGListing | null; isOpen: boolean; onClose: () => void }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !property) return null;

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'www.youtube.com/embed/');
    }
    if (url.includes('youtube.com/embed/')) {
      return url;
    }
    return url;
  };

  const propertyUrl = `${window.location.origin}/pg/${property.slug || property._id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(propertyUrl);
      setCopied(true);
      toast.success('Property link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleViewOnWebsite = () => {
    window.open(propertyUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <PropertyStatusBadge verified={property.verified} published={property.published !== false} />
                {property.featured && (
                  <Badge className="bg-yellow-100 text-yellow-700 gap-1">
                    <Award className="h-3 w-3" />
                    Featured
                  </Badge>
                )}
                {(property.videoUrl || property.virtualTour) && (
                  <Badge className="bg-blue-100 text-blue-700 gap-1">
                    <Youtube className="h-3 w-3" />
                    Virtual Tour Available
                  </Badge>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{property.name}</h3>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                {property.address}, {property.city}
              </p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center flex-shrink-0">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {property.images && property.images.length > 0 && (
            <div className="mb-6">
              <div className="relative h-80 md:h-96 rounded-xl overflow-hidden bg-gray-100">
                <img 
                  src={property.images[activeImage]} 
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
                {property.images.length > 1 && (
                  <>
                    <button onClick={() => setActiveImage(prev => prev > 0 ? prev - 1 : property.images.length - 1)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70"><ChevronDown className="h-5 w-5 rotate-90" /></button>
                    <button onClick={() => setActiveImage(prev => (prev + 1) % property.images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70"><ChevronDown className="h-5 w-5 -rotate-90" /></button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-white text-sm">{activeImage + 1} / {property.images.length}</div>
                  </>
                )}
              </div>
              {property.images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                  {property.images.map((img, idx) => (
                    <button key={idx} onClick={() => setActiveImage(idx)} className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${idx === activeImage ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200 hover:border-purple-300'}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {(property.videoUrl || property.virtualTour) && (
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-3"><div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"><Youtube className="h-4 w-4 text-blue-600" /></div><h4 className="font-bold text-gray-900">Virtual Tour</h4><Badge className="bg-red-100 text-red-700 text-xs">HD</Badge></div>
              <div className="relative pb-[56.25%] h-0 bg-black rounded-lg overflow-hidden">
                <iframe src={property.videoUrl ? getYouTubeEmbedUrl(property.videoUrl) : property.virtualTour} className="absolute top-0 left-0 w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen title="Virtual Tour" />
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">🎬 Watch this video to get a complete view of the property</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Building2 className="h-4 w-4 text-purple-500" />Basic Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1 border-b border-gray-100"><span className="text-gray-500">Property Type:</span><span className="font-medium capitalize">{property.type}</span></div>
                  <div className="flex justify-between py-1 border-b border-gray-100"><span className="text-gray-500">Price:</span><span className="font-bold text-purple-600">₹{property.price.toLocaleString()}<span className="text-xs font-normal text-gray-500">/month</span></span></div>
                  <div className="flex justify-between py-1 border-b border-gray-100"><span className="text-gray-500">Rating:</span><span className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />{property.rating || 'New'} ({property.reviewCount || 0} reviews)</span></div>
                  <div className="flex justify-between py-1 border-b border-gray-100"><span className="text-gray-500">Total Views:</span><span>{property.views || 0} views</span></div>
                  <div className="flex justify-between py-1"><span className="text-gray-500">Weekly Bookings:</span><span>{property.weeklyBookings || 0} bookings</span></div>
                </div>
              </div>
              {(property.availableRooms || property.minStay) && (
                <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Home className="h-4 w-4 text-purple-500" />Room Details</h4>
                  <div className="space-y-2 text-sm">
                    {property.availableRooms !== undefined && <div className="flex justify-between py-1 border-b border-gray-100"><span className="text-gray-500">Available Rooms:</span><span className={`font-medium ${property.availableRooms <= 2 ? 'text-orange-600' : 'text-green-600'}`}>{property.availableRooms} {property.availableRooms <= 2 && '(Hurry up!)'}</span></div>}
                    {property.minStay && <div className="flex justify-between py-1"><span className="text-gray-500">Minimum Stay:</span><span className="font-medium">{property.minStay}</span></div>}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><UserCircle className="h-4 w-4 text-purple-500" />Owner Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1 border-b border-gray-100"><span className="text-gray-500">Owner Name:</span><span className="font-medium">{property.ownerName || 'Not provided'}</span></div>
                  <div className="flex justify-between py-1 border-b border-gray-100"><span className="text-gray-500">Phone:</span><span className="font-medium">{property.ownerPhone || 'Not provided'}</span></div>
                  <div className="flex justify-between py-1"><span className="text-gray-500">Listed On:</span><span>{new Date(property.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><MapPin className="h-4 w-4 text-purple-500" />Location Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1 border-b border-gray-100"><span className="text-gray-500">Full Address:</span><span className="font-medium text-right">{property.address || 'Not specified'}</span></div>
                  <div className="flex justify-between py-1 border-b border-gray-100"><span className="text-gray-500">City:</span><span className="font-medium">{property.city}</span></div>
                  <div className="flex justify-between py-1"><span className="text-gray-500">Locality:</span><span className="font-medium">{property.locality || 'Not specified'}</span></div>
                </div>
              </div>
            </div>
          </div>

          {property.amenities && property.amenities.length > 0 && (
            <div className="mt-6 bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Award className="h-4 w-4 text-purple-500" />Amenities ({property.amenities.length})</h4>
              <div className="flex flex-wrap gap-2">{property.amenities.map((item, idx) => (<Badge key={idx} variant="outline" className="bg-white px-3 py-1 text-sm">{item}</Badge>))}</div>
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 pt-3 border-t">
                {property.wifi && <div className="flex items-center gap-1 text-xs text-green-600"><CheckCircle2 className="h-3 w-3" /> WiFi</div>}
                {property.meals && <div className="flex items-center gap-1 text-xs text-green-600"><CheckCircle2 className="h-3 w-3" /> Meals</div>}
                {property.ac && <div className="flex items-center gap-1 text-xs text-green-600"><CheckCircle2 className="h-3 w-3" /> AC</div>}
                {property.parking && <div className="flex items-center gap-1 text-xs text-green-600"><CheckCircle2 className="h-3 w-3" /> Parking</div>}
              </div>
            </div>
          )}

          {property.description && (
            <div className="mt-6 bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border">
              <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{property.description}</p>
            </div>
          )}

          <div className="mt-6 flex gap-3 sticky bottom-0 bg-white pt-4 border-t">
            <Button onClick={handleViewOnWebsite} className="flex-1 bg-purple-600 hover:bg-purple-700 gap-2"><ExternalLink className="h-4 w-4" />View on Website</Button>
            <Button onClick={handleCopyLink} variant="outline" className="flex-1 border-gray-300 gap-2">{copied ? <CheckIcon className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}{copied ? 'Copied!' : 'Copy Link'}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ────────────────── Property Edit Modal (with Virtual Tour) ──────────────────
const PropertyEditModal = ({ property, isOpen, onClose, onSave, loading }: { property: PGListing | null; isOpen: boolean; onClose: () => void; onSave: (data: any) => Promise<void>; loading: boolean }) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (property) {
      setFormData({
        name: property.name,
        description: property.description || '',
        price: property.price,
        city: property.city,
        locality: property.locality || '',
        address: property.address || '',
        type: property.type,
        amenities: property.amenities || [],
        availableRooms: property.availableRooms || 0,
        minStay: property.minStay || '1 month',
        wifi: property.wifi || false,
        meals: property.meals || false,
        ac: property.ac || false,
        parking: property.parking || false,
        videoUrl: property.videoUrl || '',
        virtualTour: property.virtualTour || '',
      });
    }
  }, [property]);

  const getYouTubeEmbedPreview = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
    if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'www.youtube.com/embed/');
    return url;
  };

  if (!isOpen || !property) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6">
          <div className="flex items-center justify-between"><div><h3 className="text-lg font-bold text-gray-900">Edit Property</h3><p className="text-sm text-gray-500 mt-1">Update property information including virtual tour</p></div><button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"><X className="h-5 w-5 text-gray-500" /></button></div>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-6 space-y-6">
          <div><h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Building2 className="h-5 w-5 text-purple-500" />Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Property Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" required /></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Description</label><textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Describe the property, amenities, nearby facilities..." /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Price (₹/month) *</label><input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Type *</label><select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"><option value="boys">Boys PG</option><option value="girls">Girls PG</option><option value="co-ed">Co-ed PG</option><option value="family">Family PG</option></select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">City *</label><input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Locality / Area</label><input type="text" value={formData.locality} onChange={(e) => setFormData({ ...formData, locality: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" placeholder="e.g., Sector 62, Near CU" /></div>
              <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label><input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Complete address with landmark" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Available Rooms</label><input type="number" value={formData.availableRooms} onChange={(e) => setFormData({ ...formData, availableRooms: parseInt(e.target.value) })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Minimum Stay</label><input type="text" value={formData.minStay} onChange={(e) => setFormData({ ...formData, minStay: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" placeholder="e.g., 1 month, 3 months" /></div>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200"><h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Award className="h-5 w-5 text-purple-500" />Amenities</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{['wifi', 'meals', 'ac', 'parking'].map((amenity) => (<label key={amenity} className="flex items-center gap-2"><input type="checkbox" checked={formData[amenity]} onChange={(e) => setFormData({ ...formData, [amenity]: e.target.checked })} className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" /><span className="text-sm capitalize">{amenity}</span></label>))}</div>
          </div>
          <div className="pt-4 border-t border-gray-200"><h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Youtube className="h-5 w-5 text-purple-500" />Virtual Tour (YouTube / Video)</h4>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">YouTube Video URL</label><input type="url" value={formData.videoUrl || ''} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" placeholder="https://youtube.com/watch?v=... or https://youtu.be/..." /><p className="text-xs text-gray-500 mt-1">💡 Support: YouTube, Vimeo, or any embeddable video URL</p></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">3D Virtual Tour URL (Optional)</label><input type="url" value={formData.virtualTour || ''} onChange={(e) => setFormData({ ...formData, virtualTour: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" placeholder="https://my.matterport.com/show/?m=..." /><p className="text-xs text-gray-500 mt-1">💡 Matterport, Kuula, or any 3D virtual tour platform</p></div>
              {(formData.videoUrl || formData.virtualTour) && (<div className="mt-4 p-4 bg-gray-50 rounded-xl"><p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"><Play className="h-4 w-4 text-green-600" />Preview:</p><div className="relative pb-[56.25%] h-0 bg-gray-200 rounded-lg overflow-hidden"><iframe src={formData.videoUrl ? getYouTubeEmbedPreview(formData.videoUrl) : formData.virtualTour} className="absolute top-0 left-0 w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Virtual Tour Preview" /></div><p className="text-xs text-green-600 mt-2 text-center">✅ Video preview is working. This will be visible on the PG detail page.</p></div>)}
              {!formData.videoUrl && !formData.virtualTour && (<div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200"><p className="text-sm text-blue-700 flex items-center gap-2"><Youtube className="h-4 w-4" />Add a YouTube video to show virtual tour of this property</p><p className="text-xs text-blue-600 mt-1">Example: https://youtu.be/VIDEO_ID or https://www.youtube.com/watch?v=VIDEO_ID</p></div>)}
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2">{loading && <Loader2 className="h-4 w-4 animate-spin" />}<Save className="h-4 w-4" />Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ────────────────── Edit User Modal ──────────────────
interface EditUserModalProps {
  isOpen: boolean;
  user: UserWithLocation | null;
  loading: boolean;
  onSave: (data: EditUserData) => Promise<void>;
  onClose: () => void;
}

const EditUserModal = ({ isOpen, user, loading, onSave, onClose }: EditUserModalProps) => {
  const [formData, setFormData] = useState<EditUserData>({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    location: { city: '', state: '', country: 'India', timezone: 'IST', address: '', pincode: '' },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'user',
        location: user.location || { city: '', state: '', country: 'India', timezone: 'IST', address: '', pincode: '' },
      });
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onSave(formData);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6"><div className="flex items-center justify-between"><div><h3 className="text-lg font-bold text-gray-900">Edit User</h3><p className="text-sm text-gray-500 mt-1">Update user information and location details</p></div><button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"><X className="h-5 w-5 text-gray-500" /></button></div></div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div><h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><UserCircle className="h-5 w-5 text-purple-500" />Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none ${errors.name ? 'border-red-500' : 'border-gray-200'}`} placeholder="Enter full name" />{errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}</div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Email Address <span className="text-red-500">*</span></label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none ${errors.email ? 'border-red-500' : 'border-gray-200'}`} placeholder="Enter email address" />{errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}</div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Phone Number <span className="text-red-500">*</span></label><input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none ${errors.phone ? 'border-red-500' : 'border-gray-200'}`} placeholder="Enter phone number" />{errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}</div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Role</label><select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"><option value="user">User</option><option value="owner">Owner</option><option value="moderator">Moderator</option><option value="admin">Admin</option></select></div>
            </div>
          </div>
          <div><h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><MapPin className="h-5 w-5 text-purple-500" />Location Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Address</label><input type="text" value={formData.location.address} onChange={(e) => setFormData({ ...formData, location: { ...formData.location, address: e.target.value } })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Street address" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">City</label><input type="text" value={formData.location.city} onChange={(e) => setFormData({ ...formData, location: { ...formData.location, city: e.target.value } })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" placeholder="City" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">State</label><input type="text" value={formData.location.state} onChange={(e) => setFormData({ ...formData, location: { ...formData.location, state: e.target.value } })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" placeholder="State" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Country</label><input type="text" value={formData.location.country} onChange={(e) => setFormData({ ...formData, location: { ...formData.location, country: e.target.value } })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Country" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">PIN Code</label><input type="text" value={formData.location.pincode} onChange={(e) => setFormData({ ...formData, location: { ...formData.location, pincode: e.target.value } })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" placeholder="PIN code" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label><select value={formData.location.timezone} onChange={(e) => setFormData({ ...formData, location: { ...formData.location, timezone: e.target.value } })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"><option value="IST">IST (UTC+5:30)</option><option value="EST">EST (UTC-5:00)</option><option value="PST">PST (UTC-8:00)</option><option value="GMT">GMT (UTC+0:00)</option></select></div>
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2">{loading && <Loader2 className="h-4 w-4 animate-spin" />}<Save className="h-4 w-4" />Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ────────────────── User Detail Drawer ──────────────────
const UserDetailDrawer = ({ user, onClose, onEdit }: { user: UserWithLocation | null; onClose: () => void; onEdit: () => void }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'bookings' | 'reviews'>('overview');
  if (!user) return null;

  const recentActivities: ActivityLog[] = [
    { id: '1', userId: user._id, action: 'Login', timestamp: new Date().toISOString(), ipAddress: '192.168.1.1', details: { device: 'Chrome on Windows' } },
    { id: '2', userId: user._id, action: 'Profile Update', timestamp: new Date(Date.now() - 86400000).toISOString(), ipAddress: '192.168.1.1', details: { field: 'Location' } },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl overflow-y-auto animate-slideIn">
        <div className="p-6 border-b border-gray-100 sticky top-0 bg-white z-10"><div className="flex items-center justify-between mb-4"><h3 className="text-lg font-bold text-gray-900">User Profile Management</h3><button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"><X className="h-5 w-5 text-gray-500" /></button></div>
          <div className="flex gap-1 border-b border-gray-100">{['overview','activity','bookings','reviews'].map((tab, idx) => (<button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === tab ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>{idx===0?<UserCircle className="h-4 w-4"/>:idx===1?<Activity className="h-4 w-4"/>:idx===2?<Calendar className="h-4 w-4"/>:<Star className="h-4 w-4"/>}{tab.charAt(0).toUpperCase()+tab.slice(1)}</button>))}</div>
        </div>
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-start gap-6"><div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">{user.name?.charAt(0)?.toUpperCase() || 'U'}</div><div className="flex-1"><div className="flex items-start justify-between"><div><h4 className="text-2xl font-bold text-gray-900">{user.name}</h4><div className="flex items-center gap-2 mt-2 flex-wrap"><RoleBadge role={user.role} /><StatusBadge status={user.status || 'active'} /></div></div><button onClick={onEdit} className="px-4 py-2 text-sm bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center gap-2"><Edit className="h-4 w-4" />Edit Profile</button></div></div></div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200"><div className="flex items-center gap-2 mb-3"><div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center"><MapPin className="h-4 w-4 text-blue-700" /></div><h5 className="font-semibold text-blue-900">Location Information</h5></div>{user.location ? (<div className="grid grid-cols-2 gap-4"><div><p className="text-xs text-blue-600 mb-1">Address</p><p className="font-medium text-blue-900">{user.location.address || 'Not specified'}</p></div><div><p className="text-xs text-blue-600 mb-1">City</p><p className="font-medium text-blue-900">{user.location.city || 'Not specified'}</p></div><div><p className="text-xs text-blue-600 mb-1">State</p><p className="font-medium text-blue-900">{user.location.state || 'Not specified'}</p></div><div><p className="text-xs text-blue-600 mb-1">Country</p><p className="font-medium text-blue-900">{user.location.country || 'India'}</p></div><div><p className="text-xs text-blue-600 mb-1">PIN Code</p><p className="font-medium text-blue-900">{user.location.pincode || 'Not specified'}</p></div><div><p className="text-xs text-blue-600 mb-1">Timezone</p><p className="font-medium text-blue-900">{user.location.timezone || 'IST'}</p></div></div>) : <p className="text-blue-600">No location information available</p>}</div>
              <div className="grid grid-cols-2 gap-4"><div className="p-4 bg-gray-50 rounded-xl"><div className="flex items-center gap-2 text-gray-600 mb-2"><Mail className="h-4 w-4" /><span className="text-xs font-medium">EMAIL</span></div><p className="text-gray-900 font-medium">{user.email}</p><p className="text-xs text-gray-400 mt-1">Verified • Primary</p></div><div className="p-4 bg-gray-50 rounded-xl"><div className="flex items-center gap-2 text-gray-600 mb-2"><Phone className="h-4 w-4" /><span className="text-xs font-medium">PHONE</span></div><p className="text-gray-900 font-medium">{user.phone || 'Not provided'}</p><p className="text-xs text-gray-400 mt-1">{user.phone ? 'Verified' : 'Not verified'}</p></div></div>
              <div className="grid grid-cols-2 gap-4"><div className="p-4 bg-gray-50 rounded-xl"><div className="flex items-center gap-2 text-gray-600 mb-2"><Calendar className="h-4 w-4" /><span className="text-xs font-medium">MEMBER SINCE</span></div><p className="text-gray-900 font-medium">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Unknown'}</p></div><div className="p-4 bg-gray-50 rounded-xl"><div className="flex items-center gap-2 text-gray-600 mb-2"><Clock className="h-4 w-4" /><span className="text-xs font-medium">LAST ACTIVE</span></div><p className="text-gray-900 font-medium">{user.lastLogin ? new Date(user.lastLogin).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }) : 'Never'}</p></div></div>
              <div className="p-4 bg-gray-50 rounded-xl"><div className="flex items-center gap-2 text-gray-600 mb-3"><Key className="h-4 w-4" /><span className="text-xs font-medium">SYSTEM INFORMATION</span></div><div className="space-y-2"><div className="flex justify-between"><span className="text-sm text-gray-500">User ID</span><span className="text-sm font-mono text-gray-900">{user._id}</span></div><div className="flex justify-between"><span className="text-sm text-gray-500">Account Type</span><span className="text-sm text-gray-900">{user.role === 'admin' ? 'Administrator' : user.role === 'owner' ? 'Property Owner' : 'Standard User'}</span></div></div></div>
            </div>
          )}
          {activeTab === 'activity' && (<div className="space-y-4"><h4 className="font-semibold text-gray-900 mb-4">Recent Activity Log</h4>{recentActivities.map((activity) => (<div key={activity.id} className="p-4 bg-gray-50 rounded-xl"><div className="flex items-center justify-between mb-2"><span className="font-medium text-gray-900">{activity.action}</span><span className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</span></div><div className="flex items-center gap-4 text-xs text-gray-500"><span className="flex items-center gap-1"><Globe className="h-3 w-3" />{activity.ipAddress}</span>{activity.details && <span className="text-gray-400">{Object.entries(activity.details).map(([key, value]) => `${key}: ${value}`).join(', ')}</span>}</div></div>))}</div>)}
          {activeTab === 'bookings' && (<div className="text-center py-12"><Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No booking history available</p></div>)}
          {activeTab === 'reviews' && (<div className="text-center py-12"><Star className="h-12 w-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No reviews yet</p></div>)}
        </div>
      </div>
    </div>
  );
};

// ────────────────── Admin Panel Page ──────────────────
const AdminPanel = () => {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  // Tab state
  const [activeTab, setActiveTab] = useState<'users' | 'properties' | 'reviews'>('users');

  // User states
  const [users, setUsers] = useState<UserWithLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserWithLocation | null>(null);
  const [editingUser, setEditingUser] = useState<UserWithLocation | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserWithLocation | null>(null);
  const [statusChangeTarget, setStatusChangeTarget] = useState<{ user: UserWithLocation; newStatus: string } | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const [sendingReminder, setSendingReminder] = useState<string | null>(null);

  // Property states
  const [properties, setProperties] = useState<PGListing[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [propertySearchTerm, setPropertySearchTerm] = useState('');
  const [propertyFilter, setPropertyFilter] = useState<'all' | 'pending' | 'verified' | 'featured'>('all');
  const [propertyActionLoading, setPropertyActionLoading] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<PGListing | null>(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<PGListing | null>(null);
  const [imagePreview, setImagePreview] = useState<{ url: string; index: number; images: string[] } | null>(null);
  const [advancedFilters, setAdvancedFilters] = useState({
    minPrice: '',
    maxPrice: '',
    type: 'all',
    rating: 'all'
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);

  // ✅ Review states
  const [reviewsTab, setReviewsTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [pendingReviews, setPendingReviews] = useState<Review[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewStats, setReviewStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });

  // Check admin access
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== 'admin')) {
      toast.error('Admin access required');
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, user, authLoading, navigate]);

  // ────────────────── User Functions ──────────────────
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getAllUsers();
      if (response.success && response.data) {
        const usersWithLocation = (response.data.items || []).map((u: any) => ({
          ...u,
          location: u.location || { city: u.city || '', state: u.state || '', country: u.country || 'India', timezone: u.timezone || 'IST', address: u.address || '', pincode: u.pincode || '' },
          status: u.status || 'active',
        }));
        setUsers(usersWithLocation);
        toast.success('Users loaded successfully');
      } else {
        throw new Error(response.message || 'Failed to fetch users');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch users';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ────────────────── Property Functions ──────────────────
  const fetchProperties = useCallback(async () => {
    try {
      setPropertiesLoading(true);
      const response = await api.getPGs({ limit: 200 });
      if (response.success && response.data) {
        const pgList = (response.data.items || []).map((p: any) => ({
          ...p,
          verified: p.verified || false,
          published: p.published !== false,
          featured: p.featured || false,
          videoUrl: p.videoUrl || '',
          virtualTour: p.virtualTour || '',
        }));
        setProperties(pgList);
        toast.success(`Loaded ${pgList.length} properties`);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setPropertiesLoading(false);
    }
  }, []);

  // ✅ Review Functions
  const fetchPendingReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await api.request('/api/reviews/admin/pending');
      if (response.success) {
        setPendingReviews(response.data);
      }
    } catch (error) {
      console.error('Error fetching pending reviews:', error);
      toast.error('Failed to fetch pending reviews');
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchAllReviews = async (status: string = 'all') => {
    try {
      setReviewsLoading(true);
      const response = await api.request(`/api/reviews/admin/all?status=${status}&limit=100`);
      if (response.success) {
        setAllReviews(response.data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to fetch reviews');
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchReviewStats = async () => {
    try {
      const response = await api.request('/api/reviews/admin/stats');
      if (response.success) {
        setReviewStats(response.stats);
      }
    } catch (error) {
      console.error('Error fetching review stats:', error);
    }
  };

  const handleApproveReview = async (reviewId: string) => {
    try {
      const response = await api.request(`/api/reviews/admin/${reviewId}/approve`, {
        method: 'PUT'
      });
      if (response.success) {
        toast.success('Review approved successfully');
        fetchPendingReviews();
        fetchReviewStats();
        if (reviewsTab !== 'pending') fetchAllReviews(reviewsTab);
      }
    } catch (error) {
      toast.error('Failed to approve review');
    }
  };

  const handleRejectReview = async (reviewId: string) => {
    try {
      const response = await api.request(`/api/reviews/admin/${reviewId}/reject`, {
        method: 'PUT',
        body: JSON.stringify({ reason: 'Does not meet guidelines' })
      });
      if (response.success) {
        toast.success('Review rejected');
        fetchPendingReviews();
        fetchReviewStats();
        if (reviewsTab !== 'pending') fetchAllReviews(reviewsTab);
      }
    } catch (error) {
      toast.error('Failed to reject review');
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchUsers();
      fetchProperties();
      fetchReviewStats();
    }
  }, [isAuthenticated, user, fetchUsers, fetchProperties]);

  // Send Offer Email to user
  const sendOfferToUser = async (userEmail: string, userName: string) => {
    try {
      setSendingEmail(userEmail);
      const response = await api.sendOfferEmail(userEmail, userName);
      if (response.success) {
        toast.success(`🎉 Offer email sent to ${userEmail}`);
      } else {
        throw new Error(response.message || 'Failed to send offer');
      }
    } catch (error: any) {
      toast.error('Failed to send offer email');
    } finally {
      setSendingEmail(null);
    }
  };

  const sendWishlistReminder = async (userId: string, userName: string, userEmail: string) => {
    try {
      setSendingReminder(userId);
      const response = await api.sendWishlistReminderToUser(userId);
      if (response.success) {
        toast.success(`Wishlist reminder sent to ${userName}`);
      } else {
        throw new Error(response.message || 'Failed to send reminder');
      }
    } catch (error: any) {
      toast.error('Failed to send wishlist reminder');
    } finally {
      setSendingReminder(null);
    }
  };

  const sendBulkOfferEmails = async () => {
    const activeUsers = users.filter(u => (u.status || 'active') === 'active');
    const confirmed = window.confirm(`Send offer emails to ${activeUsers.length} active users?`);
    if (!confirmed) return;
    
    toast.info(`Sending offer emails to ${activeUsers.length} users...`);
    let successCount = 0, failCount = 0;
    for (const user of activeUsers) {
      try {
        await api.sendOfferEmail(user.email, user.name);
        successCount++;
      } catch (error) { failCount++; }
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    toast.success(`Bulk offer completed! Sent to ${successCount} users, failed: ${failCount}`);
  };

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase()) || u.phone?.includes(searchTerm);
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || (u.status || 'active') === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Filter properties
  const filteredProperties = properties.filter((p) => {
    const matchesSearch = p.name?.toLowerCase().includes(propertySearchTerm.toLowerCase()) || p.city?.toLowerCase().includes(propertySearchTerm.toLowerCase());
    let matchesBasic = true;
    if (propertyFilter === 'pending') matchesBasic = !p.verified;
    if (propertyFilter === 'verified') matchesBasic = p.verified;
    if (propertyFilter === 'featured') matchesBasic = p.featured;
    let matchesAdvanced = true;
    if (advancedFilters.minPrice && p.price < parseInt(advancedFilters.minPrice)) matchesAdvanced = false;
    if (advancedFilters.maxPrice && p.price > parseInt(advancedFilters.maxPrice)) matchesAdvanced = false;
    if (advancedFilters.type !== 'all' && p.type !== advancedFilters.type) matchesAdvanced = false;
    if (advancedFilters.rating !== 'all' && (!p.rating || p.rating < parseInt(advancedFilters.rating))) matchesAdvanced = false;
    return matchesSearch && matchesBasic && matchesAdvanced;
  });

  // Property Stats
  const propertyStats = {
    total: properties.length,
    verified: properties.filter(p => p.verified).length,
    pending: properties.filter(p => !p.verified).length,
    featured: properties.filter(p => p.featured).length,
    withVirtualTour: properties.filter(p => p.videoUrl || p.virtualTour).length,
  };

  const propertyByCity = useMemo(() => {
    const cities: Record<string, number> = {};
    properties.forEach(p => { if (p.city) cities[p.city] = (cities[p.city] || 0) + 1; });
    return Object.entries(cities).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [properties]);

  const getCompletePropertyData = (property: PGListing, updates: Partial<PGListing>) => {
    return {
      name: property.name,
      description: property.description || '',
      price: property.price,
      city: property.city,
      locality: property.locality || '',
      address: property.address || '',
      type: property.type,
      images: property.images || [],
      gallery: property.gallery || [],
      amenities: property.amenities || [],
      published: property.published,
      featured: property.featured,
      verified: property.verified,
      wifi: property.wifi,
      meals: property.meals,
      ac: property.ac,
      parking: property.parking,
      availableRooms: property.availableRooms,
      minStay: property.minStay,
      rating: property.rating,
      reviewCount: property.reviewCount,
      ownerName: property.ownerName,
      ownerPhone: property.ownerPhone,
      videoUrl: property.videoUrl,
      virtualTour: property.virtualTour,
      ...updates
    };
  };

  const handleVerifyProperty = async (id: string, verified: boolean) => {
    if (propertyActionLoading === id) return;
    try {
      setPropertyActionLoading(id);
      const currentProperty = properties.find(p => p._id === id);
      if (!currentProperty) throw new Error('Property not found');
      const updateData = getCompletePropertyData(currentProperty, { verified });
      const response = await api.updatePGListing(id, updateData);
      if (response.success) {
        setProperties(prev => prev.map(p => p._id === id ? { ...p, verified: verified } : p));
        toast.success(`Property ${verified ? 'verified' : 'unverified'} successfully`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update verification status');
    } finally {
      setPropertyActionLoading(null);
    }
  };

  const handleFeatureProperty = async (id: string, featured: boolean) => {
    if (propertyActionLoading === id) return;
    try {
      setPropertyActionLoading(id);
      const currentProperty = properties.find(p => p._id === id);
      if (!currentProperty) throw new Error('Property not found');
      const updateData = getCompletePropertyData(currentProperty, { featured });
      const response = await api.updatePGListing(id, updateData);
      if (response.success) {
        setProperties(prev => prev.map(p => p._id === id ? { ...p, featured: featured } : p));
        toast.success(`Property ${featured ? 'featured' : 'unfeatured'} successfully`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update featured status');
    } finally {
      setPropertyActionLoading(null);
    }
  };

  const handlePublishProperty = async (id: string, published: boolean) => {
    if (propertyActionLoading === id) return;
    try {
      setPropertyActionLoading(id);
      const currentProperty = properties.find(p => p._id === id);
      if (!currentProperty) throw new Error('Property not found');
      const updateData = getCompletePropertyData(currentProperty, { published });
      const response = await api.updatePGListing(id, updateData);
      if (response.success) {
        setProperties(prev => prev.map(p => p._id === id ? { ...p, published: published } : p));
        toast.success(`Property ${published ? 'published' : 'unpublished'} successfully`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update publish status');
    } finally {
      setPropertyActionLoading(null);
    }
  };

  const handleUpdateProperty = async (id: string, formData: any) => {
    if (propertyActionLoading === id) return;
    try {
      setPropertyActionLoading(id);
      const currentProperty = properties.find(p => p._id === id);
      if (!currentProperty) throw new Error('Property not found');
      const updateData = getCompletePropertyData(currentProperty, formData);
      const response = await api.updatePGListing(id, updateData);
      if (response.success) {
        setProperties(prev => prev.map(p => p._id === id ? { ...p, ...formData } : p));
        toast.success('Property updated successfully');
        setEditingProperty(null);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update property');
    } finally {
      setPropertyActionLoading(null);
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    try {
      setPropertyActionLoading(id);
      const response = await api.deletePGListing(id);
      if (response.success) {
        setProperties(prev => prev.filter(p => p._id !== id));
        toast.success('Property deleted successfully');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete property');
    } finally {
      setPropertyActionLoading(null);
    }
  };

  const handleBulkVerify = async () => {
    if (selectedProperties.length === 0) return;
    if (!confirm(`Verify ${selectedProperties.length} properties?`)) return;
    toast.info(`Verifying ${selectedProperties.length} properties...`);
    let successCount = 0;
    for (const id of selectedProperties) {
      const property = properties.find(p => p._id === id);
      if (property && !property.verified) {
        await handleVerifyProperty(id, true);
        successCount++;
      }
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    toast.success(`Verified ${successCount} properties`);
    setSelectedProperties([]);
  };

  const handleBulkDelete = async () => {
    if (selectedProperties.length === 0) return;
    if (!confirm(`Delete ${selectedProperties.length} properties?`)) return;
    toast.info(`Deleting ${selectedProperties.length} properties...`);
    let successCount = 0;
    for (const id of selectedProperties) {
      await handleDeleteProperty(id);
      successCount++;
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    toast.success(`Deleted ${successCount} properties`);
    setSelectedProperties([]);
  };

  const handleExportProperties = () => {
    const exportData = filteredProperties.map(p => ({
      id: p._id, name: p.name, city: p.city, price: p.price, type: p.type,
      verified: p.verified, published: p.published, featured: p.featured,
      hasVirtualTour: !!(p.videoUrl || p.virtualTour), rating: p.rating, views: p.views, createdAt: p.createdAt
    }));
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `properties-export-${new Date().toISOString().split('T')[0]}.json`);
    linkElement.click();
    toast.success(`Exported ${filteredProperties.length} properties`);
  };

  const handleUpdateUser = async (userId: string, updateData: Partial<UserWithLocation>) => {
    try {
      setActionLoading(true);
      const response = await api.updateUser(userId, updateData);
      if (response.success) {
        setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, ...updateData } : u));
        toast.success('User updated successfully');
        return true;
      }
    } catch (error: unknown) {
      toast.error('Failed to update user');
      return false;
    } finally {
      setActionLoading(false);
    }
    return false;
  };

  const handleEditUser = async (formData: EditUserData) => {
    if (!editingUser) return;
    const success = await handleUpdateUser(editingUser._id, {
      name: formData.name, email: formData.email, phone: formData.phone,
      role: formData.role, location: formData.location,
    });
    if (success) { setEditingUser(null); setSelectedUser(null); }
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const response = await api.deleteUser(deleteTarget._id);
      if (response.success) {
        toast.success('User deleted successfully');
        setUsers((prev) => prev.filter((u) => u._id !== deleteTarget._id));
        if (selectedUser?._id === deleteTarget._id) setSelectedUser(null);
      }
    } catch (error: unknown) {
      toast.error('Failed to delete user');
    } finally {
      setActionLoading(false);
      setDeleteTarget(null);
    }
  };

  const handleStatusChange = async () => {
    if (!statusChangeTarget) return;
    setActionLoading(true);
    try {
      const response = await api.updateUserStatus(statusChangeTarget.user._id, statusChangeTarget.newStatus);
      if (response.success) {
        toast.success(`User ${statusChangeTarget.newStatus === 'active' ? 'activated' : 'suspended'} successfully`);
        setUsers((prev) => prev.map((u) => u._id === statusChangeTarget.user._id ? { ...u, status: statusChangeTarget.newStatus as any } : u));
      }
    } catch (error: unknown) {
      toast.error('Failed to update status');
    } finally {
      setActionLoading(false);
      setStatusChangeTarget(null);
    }
  };

  const handleExportData = () => {
    try {
      const exportData = users.map(u => ({
        id: u._id, name: u.name, email: u.email, phone: u.phone, role: u.role,
        status: u.status, city: u.location?.city, state: u.location?.state,
        country: u.location?.country, pincode: u.location?.pincode,
        joined: u.createdAt, lastLogin: u.lastLogin,
      }));
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', `users-export-${new Date().toISOString().split('T')[0]}.json`);
      linkElement.click();
      toast.success(`Exported ${users.length} users successfully`);
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const stats = {
    total: users.length,
    active: users.filter((u) => (u.status || 'active') === 'active').length,
    suspended: users.filter((u) => u.status === 'suspended').length,
    admins: users.filter((u) => u.role === 'admin').length,
    owners: users.filter((u) => u.role === 'owner').length,
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="h-8 w-8 animate-spin text-purple-500" /></div>;
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white"><Shield className="h-5 w-5" /></div>
              <div><h1 className="text-lg font-bold text-gray-900">Admin Control Center</h1><p className="text-xs text-gray-500">EasyTorent • Enterprise Management</p></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-full border border-purple-100">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">{user?.name?.charAt(0)?.toUpperCase()}</div>
                <span className="text-sm font-medium text-purple-700 hidden sm:inline">{user?.name}</span>
              </div>
              <button onClick={() => navigate('/')} className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg"><Home className="h-4 w-4" /></button>
              <button onClick={() => { logout(); navigate('/login'); }} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><LogOut className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2">
          <button onClick={() => setActiveTab('users')} className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'users' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>👥 User Management</button>
          <button onClick={() => setActiveTab('properties')} className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'properties' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>🏠 Property Management</button>
          <button onClick={() => { setActiveTab('reviews'); fetchPendingReviews(); fetchReviewStats(); }} className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === 'reviews' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            ⭐ Review Management
            {reviewStats.pending > 0 && <span className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">{reviewStats.pending}</span>}
          </button>
        </div>

        {/* ==================== USER MANAGEMENT TAB ==================== */}
        {activeTab === 'users' && (
          <>
            {error && (<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"><p className="text-sm text-red-700">{error}</p></div>)}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-white rounded-2xl p-5 shadow-sm border"><div><p className="text-sm text-gray-500">Total Users</p><p className="text-3xl font-bold">{stats.total}</p></div></div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border"><div><p className="text-sm text-gray-500">Active</p><p className="text-3xl font-bold text-green-600">{stats.active}</p></div></div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border"><div><p className="text-sm text-gray-500">Suspended</p><p className="text-3xl font-bold text-red-600">{stats.suspended}</p></div></div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border"><div><p className="text-sm text-gray-500">Admins</p><p className="text-3xl font-bold text-purple-600">{stats.admins}</p></div></div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border"><div><p className="text-sm text-gray-500">Owners</p><p className="text-3xl font-bold text-blue-600">{stats.owners}</p></div></div>
            </div>
            <div className="bg-white rounded-2xl border shadow-sm mb-6">
              <div className="p-5">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm" /></div>
                  <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border rounded-xl text-sm"><Filter className="h-4 w-4" /> Filters</button>
                  <button onClick={handleExportData} className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border rounded-xl text-sm"><Download className="h-4 w-4" /> Export</button>
                  <button onClick={sendBulkOfferEmails} className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm"><Send className="h-4 w-4" /> Bulk Offer</button>
                  <button onClick={fetchUsers} disabled={loading} className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl text-sm"><RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh</button>
                </div>
                {showFilters && (<div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t"><select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-3 py-2 border rounded-lg text-sm"><option value="all">All Roles</option><option value="user">User</option><option value="admin">Admin</option><option value="owner">Owner</option></select><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border rounded-lg text-sm"><option value="all">All Status</option><option value="active">Active</option><option value="suspended">Suspended</option></select></div>)}
              </div>
            </div>
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              {loading ? <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-purple-500" /></div> : filteredUsers.length === 0 ? <div className="text-center py-20"><Users className="h-12 w-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No users found</p></div> : (
                <>
                  <div className="hidden lg:grid lg:grid-cols-[2fr_2fr_1fr_1fr_1.5fr_0.8fr] gap-4 px-6 py-4 bg-gray-50 border-b text-xs font-semibold text-gray-500"><span>User</span><span>Contact</span><span>Role</span><span>Status</span><span>Joined</span><span className="text-right">Actions</span></div>
                  {filteredUsers.map((u) => (
                    <div key={u._id} className="grid grid-cols-1 lg:grid-cols-[2fr_2fr_1fr_1fr_1.5fr_0.8fr] gap-4 items-center px-6 py-4 border-b hover:bg-gray-50">
                      <div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${u.role === 'admin' ? 'bg-gradient-to-br from-purple-500 to-indigo-500' : u.role === 'owner' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-gradient-to-br from-orange-500 to-amber-500'}`}>{u.name?.charAt(0)?.toUpperCase() || '?'}</div><div><p className="font-semibold text-gray-900">{u.name}</p></div></div>
                      <div className="hidden lg:block"><p className="text-sm text-gray-700">{u.email}</p><p className="text-xs text-gray-400">{u.phone || 'No phone'}</p></div>
                      <div><RoleBadge role={u.role} /></div>
                      <div><StatusBadge status={u.status || 'active'} /></div>
                      <div className="hidden lg:block text-sm text-gray-600">{u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '—'}</div>
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => setSelectedUser(u)} className="p-2 text-gray-400 hover:text-purple-600 rounded-lg"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => setEditingUser(u)} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => sendOfferToUser(u.email, u.name)} disabled={sendingEmail === u.email} className="p-2 text-gray-400 hover:text-green-600 rounded-lg">{sendingEmail === u.email ? <Loader2 className="h-4 w-4 animate-spin" /> : <MailIcon className="h-4 w-4" />}</button>
                        <button onClick={() => sendWishlistReminder(u._id, u.name, u.email)} disabled={sendingReminder === u._id} className="p-2 text-gray-400 hover:text-orange-600 rounded-lg">{sendingReminder === u._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}</button>
                        {u.role !== 'admin' && <button onClick={() => setStatusChangeTarget({ user: u, newStatus: (u.status || 'active') === 'active' ? 'suspended' : 'active' })} className="p-2 rounded-lg">{(u.status || 'active') === 'active' ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}</button>}
                        {u.role !== 'admin' && <button onClick={() => setDeleteTarget(u)} className="p-2 text-gray-400 hover:text-red-600 rounded-lg"><Trash2 className="h-4 w-4" /></button>}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </>
        )}

        {/* ==================== PROPERTY MANAGEMENT TAB ==================== */}
        {activeTab === 'properties' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-white rounded-2xl p-5 shadow-sm border"><div><p className="text-sm text-gray-500">Total</p><p className="text-3xl font-bold">{propertyStats.total}</p></div></div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border"><div><p className="text-sm text-gray-500">Verified</p><p className="text-3xl font-bold text-green-600">{propertyStats.verified}</p></div></div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border"><div><p className="text-sm text-gray-500">Pending</p><p className="text-3xl font-bold text-amber-600">{propertyStats.pending}</p></div></div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border"><div><p className="text-sm text-gray-500">Featured</p><p className="text-3xl font-bold text-yellow-600">{propertyStats.featured}</p></div></div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border"><div><p className="text-sm text-gray-500">Video Tour</p><p className="text-3xl font-bold text-blue-600">{propertyStats.withVirtualTour}</p></div></div>
            </div>
            {propertyByCity.length > 0 && (<div className="bg-white rounded-2xl p-5 shadow-sm border mb-6"><h4 className="text-sm font-medium text-gray-500 mb-3">Properties by City</h4>{propertyByCity.map(([city, count]) => (<div key={city} className="flex justify-between items-center"><span className="text-sm">{city}</span><div className="flex-1 mx-4 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-purple-500 rounded-full" style={{ width: `${(count / propertyStats.total) * 100}%` }} /></div><span className="text-sm font-semibold">{count}</span></div>))}</div>)}
            {selectedProperties.length > 0 && (<div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-xl p-3 flex gap-2 z-40 border"><span className="text-sm font-medium">{selectedProperties.length} selected</span><button onClick={handleBulkVerify} className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm">Verify All</button><button onClick={handleBulkDelete} className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm">Delete All</button><button onClick={() => setSelectedProperties([])} className="px-3 py-1 bg-gray-200 rounded-lg text-sm">Clear</button></div>)}
            <div className="bg-white rounded-2xl border shadow-sm mb-6"><div className="p-5"><div className="flex flex-col md:flex-row gap-4"><div className="relative flex-1"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="text" value={propertySearchTerm} onChange={(e) => setPropertySearchTerm(e.target.value)} placeholder="Search by name or city..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl text-sm" /></div><div className="flex gap-2 flex-wrap"><button onClick={() => setPropertyFilter('all')} className={`px-4 py-2.5 rounded-xl text-sm ${propertyFilter === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}>All ({propertyStats.total})</button><button onClick={() => setPropertyFilter('pending')} className={`px-4 py-2.5 rounded-xl text-sm ${propertyFilter === 'pending' ? 'bg-amber-600 text-white' : 'bg-gray-100'}`}>Pending ({propertyStats.pending})</button><button onClick={() => setPropertyFilter('verified')} className={`px-4 py-2.5 rounded-xl text-sm ${propertyFilter === 'verified' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>Verified ({propertyStats.verified})</button><button onClick={() => setPropertyFilter('featured')} className={`px-4 py-2.5 rounded-xl text-sm ${propertyFilter === 'featured' ? 'bg-yellow-600 text-white' : 'bg-gray-100'}`}>Featured ({propertyStats.featured})</button><button onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} className={`px-4 py-2.5 rounded-xl text-sm ${showAdvancedFilters ? 'bg-purple-100 text-purple-700' : 'bg-gray-100'}`}><Filter className="h-4 w-4" /> Advanced</button><button onClick={handleExportProperties} className="px-4 py-2.5 rounded-xl text-sm bg-gray-100"><Download className="h-4 w-4" /> Export</button><button onClick={fetchProperties} disabled={propertiesLoading} className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl text-sm"><RefreshCw className={`h-4 w-4 ${propertiesLoading ? 'animate-spin' : ''}`} /> Refresh</button></div></div>{showAdvancedFilters && (<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t"><input type="number" placeholder="Min Price" value={advancedFilters.minPrice} onChange={(e) => setAdvancedFilters({...advancedFilters, minPrice: e.target.value})} className="px-3 py-2 border rounded-lg text-sm" /><input type="number" placeholder="Max Price" value={advancedFilters.maxPrice} onChange={(e) => setAdvancedFilters({...advancedFilters, maxPrice: e.target.value})} className="px-3 py-2 border rounded-lg text-sm" /><select value={advancedFilters.type} onChange={(e) => setAdvancedFilters({...advancedFilters, type: e.target.value})} className="px-3 py-2 border rounded-lg text-sm"><option value="all">All Types</option><option value="boys">Boys</option><option value="girls">Girls</option><option value="co-ed">Co-ed</option><option value="family">Family</option></select><select value={advancedFilters.rating} onChange={(e) => setAdvancedFilters({...advancedFilters, rating: e.target.value})} className="px-3 py-2 border rounded-lg text-sm"><option value="all">Any Rating</option><option value="4">4★+</option><option value="3">3★+</option></select></div>)}</div></div>
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              {propertiesLoading ? <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-purple-500" /></div> : filteredProperties.length === 0 ? <div className="text-center py-20"><Building2 className="h-12 w-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No properties found</p></div> : (
                <>
                  <div className="hidden lg:grid lg:grid-cols-[0.5fr_1.5fr_1fr_1fr_0.8fr_0.8fr_1fr_1.2fr] gap-4 px-6 py-4 bg-gray-50 border-b text-xs font-semibold text-gray-500"><span><input type="checkbox" onChange={(e) => setSelectedProperties(e.target.checked ? filteredProperties.map(p => p._id) : [])} className="rounded border-gray-300" /></span><span>Property</span><span>Location</span><span>Price</span><span>Virtual Tour</span><span>Status</span><span>Views</span><span className="text-right">Actions</span></div>
                  {filteredProperties.map((p) => (
                    <div key={p._id} className="grid grid-cols-1 lg:grid-cols-[0.5fr_1.5fr_1fr_1fr_0.8fr_0.8fr_1fr_1.2fr] gap-4 items-center px-6 py-4 border-b hover:bg-gray-50">
                      <div className="hidden lg:block"><input type="checkbox" checked={selectedProperties.includes(p._id)} onChange={(e) => setSelectedProperties(e.target.checked ? [...selectedProperties, p._id] : selectedProperties.filter(id => id !== p._id))} className="rounded border-gray-300" /></div>
                      <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer" onClick={() => p.images?.[0] && setImagePreview({ url: p.images[0], index: 0, images: p.images })}>{p.images?.[0] ? <img src={p.images[0]} className="w-full h-full object-cover" alt={p.name} /> : <Building2 className="h-5 w-5 text-gray-400" />}</div><div><p className="font-semibold text-gray-900">{p.name}</p><p className="text-xs text-gray-400">{p.type} PG</p></div></div>
                      <div><p className="text-sm text-gray-700">{p.city}</p><p className="text-xs text-gray-400">{p.locality || 'N/A'}</p></div>
                      <div><p className="font-semibold text-purple-600">₹{p.price.toLocaleString()}/month</p><p className="text-xs text-gray-400">⭐ {p.rating || 'New'}</p></div>
                      <div><VirtualTourBadge videoUrl={p.videoUrl} virtualTour={p.virtualTour} /></div>
                      <div><PropertyStatusBadge verified={p.verified} published={p.published !== false} /></div>
                      <div><p className="text-sm">{p.views || 0} views</p><p className="text-xs text-gray-400">{p.weeklyBookings || 0} bookings</p></div>
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => { setSelectedProperty(p); setShowViewModal(true); }} className="p-2 text-blue-400 hover:text-blue-600 rounded-lg"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => setEditingProperty(p)} className="p-2 text-gray-400 hover:text-blue-600 rounded-lg"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => handleVerifyProperty(p._id, !p.verified)} disabled={propertyActionLoading === p._id} className={`p-2 rounded-lg ${propertyActionLoading === p._id ? 'opacity-50' : p.verified ? 'text-amber-600' : 'text-emerald-600'}`}>{propertyActionLoading === p._id ? <Loader2 className="h-4 w-4 animate-spin" /> : (p.verified ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />)}</button>
                        <button onClick={() => handleFeatureProperty(p._id, !p.featured)} disabled={propertyActionLoading === p._id} className={`p-2 rounded-lg ${propertyActionLoading === p._id ? 'opacity-50' : p.featured ? 'text-gray-400' : 'text-yellow-600'}`}><Award className="h-4 w-4" /></button>
                        <button onClick={() => handlePublishProperty(p._id, p.published === false)} disabled={propertyActionLoading === p._id} className={`p-2 rounded-lg ${propertyActionLoading === p._id ? 'opacity-50' : p.published !== false ? 'text-gray-400' : 'text-green-600'}`}>{p.published !== false ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}</button>
                        <button onClick={() => handleDeleteProperty(p._id)} disabled={propertyActionLoading === p._id} className="p-2 text-red-400 hover:text-red-600 rounded-lg"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  ))}
                  <div className="px-6 py-4 bg-gray-50/50 border-t flex justify-between"><p className="text-sm text-gray-500">Showing {filteredProperties.length} of {properties.length} properties</p><button onClick={() => setSelectedProperties([])} className="text-sm text-purple-600">Clear Selection</button></div>
                </>
              )}
            </div>
          </>
        )}

        {/* ==================== REVIEW MANAGEMENT TAB ==================== */}
        {activeTab === 'reviews' && (
          <>
            {/* Review Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-2xl p-5 shadow-sm border"><div><p className="text-sm text-gray-500">Pending Reviews</p><p className="text-3xl font-bold text-amber-600">{reviewStats.pending}</p></div></div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border"><div><p className="text-sm text-gray-500">Approved Reviews</p><p className="text-3xl font-bold text-green-600">{reviewStats.approved}</p></div></div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border"><div><p className="text-sm text-gray-500">Rejected Reviews</p><p className="text-3xl font-bold text-red-600">{reviewStats.rejected}</p></div></div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border"><div><p className="text-sm text-gray-500">Total Reviews</p><p className="text-3xl font-bold text-purple-600">{reviewStats.total}</p></div></div>
            </div>

            {/* Tab Filter */}
            <div className="flex gap-2 mb-6 border-b pb-2">
              <button onClick={() => { setReviewsTab('pending'); fetchPendingReviews(); }} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${reviewsTab === 'pending' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Pending ({reviewStats.pending})</button>
              <button onClick={() => { setReviewsTab('approved'); fetchAllReviews('approved'); }} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${reviewsTab === 'approved' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Approved ({reviewStats.approved})</button>
              <button onClick={() => { setReviewsTab('rejected'); fetchAllReviews('rejected'); }} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${reviewsTab === 'rejected' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Rejected ({reviewStats.rejected})</button>
              <button onClick={() => { setReviewsTab('all'); fetchAllReviews('all'); }} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${reviewsTab === 'all' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>All ({reviewStats.total})</button>
            </div>

            {/* Reviews List */}
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              {reviewsLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-purple-500" /></div>
              ) : reviewsTab === 'pending' && pendingReviews.length === 0 ? (
                <div className="text-center py-20"><CheckCircle2 className="h-12 w-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No pending reviews</p></div>
              ) : reviewsTab !== 'pending' && allReviews.length === 0 ? (
                <div className="text-center py-20"><Star className="h-12 w-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No {reviewsTab} reviews found</p></div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {(reviewsTab === 'pending' ? pendingReviews : allReviews).map((review: any) => (
                    <div key={review._id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* Review Header */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold">
                              {review.user?.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{review.user?.name || 'Anonymous'}</p>
                              <p className="text-xs text-gray-500">{review.user?.email}</p>
                            </div>
                            <div className="flex items-center gap-1 ml-auto">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className={cn("h-4 w-4", star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300")} />
                              ))}
                            </div>
                          </div>

                          {/* Property Info */}
                          <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-900">{review.pgListing?.name}</p>
                            <p className="text-xs text-gray-500">{review.pgListing?.city}</p>
                          </div>

                          {/* Review Content */}
                          <p className="text-gray-700 mb-2 line-clamp-3">{review.comment}</p>
                          <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>

                          {/* Status Badge */}
                          <div className="mt-3">
                            {review.status === 'pending' && <Badge className="bg-amber-100 text-amber-700">Pending Approval</Badge>}
                            {review.status === 'approved' && <Badge className="bg-green-100 text-green-700">Approved</Badge>}
                            {review.status === 'rejected' && <Badge className="bg-red-100 text-red-700">Rejected</Badge>}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        {review.status === 'pending' && (
                          <div className="flex gap-2 ml-4">
                            <button onClick={() => handleApproveReview(review._id)} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4" />
                              Approve
                            </button>
                            <button onClick={() => handleRejectReview(review._id)} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2">
                              <XCircle className="h-4 w-4" />
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Modals */}
      <ConfirmModal isOpen={!!deleteTarget} title="Delete User Account" message={`Delete "${deleteTarget?.name}"'s account?`} confirmText="Delete" variant="danger" loading={actionLoading} onConfirm={handleDeleteUser} onCancel={() => setDeleteTarget(null)} />
      <ConfirmModal isOpen={!!statusChangeTarget} title={statusChangeTarget?.newStatus === 'suspended' ? 'Suspend User' : 'Activate User'} message={`${statusChangeTarget?.newStatus === 'suspended' ? 'Suspend' : 'Activate'} "${statusChangeTarget?.user.name}"?`} confirmText="Confirm" variant="warning" loading={actionLoading} onConfirm={handleStatusChange} onCancel={() => setStatusChangeTarget(null)} />
      <EditUserModal isOpen={!!editingUser} user={editingUser} loading={actionLoading} onSave={handleEditUser} onClose={() => setEditingUser(null)} />
      <UserDetailDrawer user={selectedUser} onClose={() => setSelectedUser(null)} onEdit={() => { if (selectedUser) { setEditingUser(selectedUser); setSelectedUser(null); } }} />
      <PropertyEditModal property={editingProperty} isOpen={!!editingProperty} onClose={() => setEditingProperty(null)} onSave={(data) => handleUpdateProperty(editingProperty!._id, data)} loading={propertyActionLoading === editingProperty?._id} />
      <PropertyViewModal property={selectedProperty} isOpen={showViewModal} onClose={() => { setShowViewModal(false); setSelectedProperty(null); }} />
      {imagePreview && <ImageGalleryModal images={imagePreview.images} currentIndex={imagePreview.index} onClose={() => setImagePreview(null)} />}
    </div>
  );
};

export default AdminPanel;