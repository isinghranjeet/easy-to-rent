/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Building2,
  Trash2,
  Search,
  RefreshCw,
  Eye,
  EyeOff,
  MapPin,
  IndianRupee,
  X,
  Loader2,
  Home,
  LogOut,
  ChevronDown,
  ImagePlus,
  CheckCircle2,
  AlertTriangle,
  Star,
  Navigation,
  Globe,
  LocateFixed,
  Copy,
  Check,
  Clock,
  Calendar,
  Users,
  Wifi,
  Zap,
  Shield,
  Award,
  TrendingUp,
  Filter,
  Download,
  MoreVertical,
  Edit,
  MessageSquare,
  Phone,
  Mail,
  Link2,
  Menu, // Added missing Menu icon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api, PGListing } from '@/services/api';
import { toast } from 'sonner';
import { validateImage } from '@/lib/utils/fileUtils';

// ─────────── Types ───────────
interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    state?: string;
    country?: string;
    road?: string;
    suburb?: string;
  };
}

// ─────────── Constants ───────────
const AMENITY_OPTIONS = [
  'WiFi', 'AC', 'Geyser', 'Parking', 'Laundry', 'Food/Mess', 'Power Backup',
  'Security', 'CCTV', 'RO Water', 'Refrigerator', 'TV', 'Gym', 'Study Room',
  'Attached Bathroom', 'Balcony', 'Cleaning Service', 'Kitchen Access',
];

const ROOM_TYPES = ['Single', 'Double', 'Triple', 'Four Sharing'];
const MAX_IMAGES = 10;

// ─────────── Current Location Component ───────────
interface CurrentLocationProps {
  onLocationSelect: (location: {
    address: string;
    city: string;
    locality: string;
    coordinates?: { lat: number; lng: number };
  }) => void;
}

const CurrentLocation = ({ onLocationSelect }: CurrentLocationProps) => {
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [recentLocations, setRecentLocations] = useState<string[]>([]);
  const searchTimeout = useRef<NodeJS.Timeout>();
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Load recent locations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentLocations');
    if (saved) {
      setRecentLocations(JSON.parse(saved));
    }
  }, []);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveRecentLocation = (loc: string) => {
    const updated = [loc, ...recentLocations.filter(l => l !== loc)].slice(0, 5);
    setRecentLocations(updated);
    localStorage.setItem('recentLocations', JSON.stringify(updated));
  };

  const searchLocation = async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Location search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      searchLocation(value);
    }, 500);
  };

  const detectCurrentLocation = () => {
    setDetecting(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
            );
            const data = await response.json();
            
            const address = data.display_name;
            const city = data.address.city || data.address.town || data.address.village || '';
            const locality = data.address.suburb || data.address.neighbourhood || '';
            
            setLocation(address);
            onLocationSelect({
              address,
              city,
              locality,
              coordinates: { lat: latitude, lng: longitude }
            });
            
            saveRecentLocation(address);
            toast.success('Location detected successfully');
          } catch (error) {
            toast.error('Failed to get location details');
          } finally {
            setDetecting(false);
          }
        },
        (error) => {
          toast.error('Unable to access your location');
          setDetecting(false);
        }
      );
    } else {
      toast.error('Geolocation is not supported');
      setDetecting(false);
    }
  };

  const handleSelectSuggestion = (suggestion: LocationSuggestion) => {
    const address = suggestion.display_name;
    const city = suggestion.address.city || suggestion.address.town || suggestion.address.village || '';
    const locality = suggestion.address.suburb || suggestion.address.road || '';
    
    setLocation(address);
    onLocationSelect({
      address,
      city,
      locality,
      coordinates: { lat: parseFloat(suggestion.lat), lng: parseFloat(suggestion.lon) }
    });
    
    saveRecentLocation(address);
    setShowSuggestions(false);
    setSuggestions([]);
    toast.success('Location selected');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Location copied to clipboard');
  };

  return (
    <div className="space-y-3" ref={suggestionRef}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={location}
            onChange={handleSearchChange}
            placeholder="Search for a location or drag the pin"
            className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
          />
          {location && (
            <button
              onClick={() => copyToClipboard(location)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              title="Copy location"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          )}
        </div>
        <button
          onClick={detectCurrentLocation}
          disabled={detecting}
          className="px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-purple-500/25"
          title="Use current location"
        >
          <LocateFixed className={`h-4 w-4 ${detecting ? 'animate-pulse' : ''}`} />
          <span className="hidden sm:inline">{detecting ? 'Detecting...' : 'Current'}</span>
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full max-w-lg mt-1 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSelectSuggestion(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-0 flex items-start gap-3"
            >
              <MapPin className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 line-clamp-1">
                  {suggestion.display_name.split(',')[0]}
                </p>
                <p className="text-xs text-gray-500 line-clamp-1">
                  {suggestion.display_name}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Recent Locations */}
      {recentLocations.length > 0 && !showSuggestions && (
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-3 w-3 text-gray-400" />
            <span className="text-xs font-medium text-gray-500">RECENT LOCATIONS</span>
          </div>
          <div className="space-y-2">
            {recentLocations.map((loc, index) => (
              <button
                key={index}
                onClick={() => {
                  setLocation(loc);
                  onLocationSelect({
                    address: loc,
                    city: '',
                    locality: ''
                  });
                }}
                className="w-full flex items-center gap-2 text-left text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 p-2 rounded-lg transition-colors"
              >
                <Clock className="h-3 w-3 text-gray-400" />
                <span className="truncate flex-1">{loc}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Location Preview Map (Static) */}
      {location && (
        <div className="relative h-32 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-8 w-8 text-purple-500 mx-auto mb-1" />
              <p className="text-xs text-purple-600 font-medium">Location Selected</p>
              <p className="text-xs text-gray-500 mt-1 px-4 truncate max-w-xs">{location}</p>
            </div>
          </div>
          {/* Decorative grid lines */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(to right, #e9d5ff 1px, transparent 1px), linear-gradient(to bottom, #e9d5ff 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            opacity: 0.2
          }} />
        </div>
      )}
    </div>
  );
};

// ─────────── Create/Edit Form ───────────
interface PropertyFormProps {
  editData?: PGListing | null;
  onSave: () => void;
  onCancel: () => void;
}

const PropertyForm = ({ editData, onSave, onCancel }: PropertyFormProps) => {
  const [saving, setSaving] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'location' | 'amenities' | 'media' | 'contact'>('basic');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef<string[]>([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    city: 'Chandigarh',
    locality: '',
    address: '',
    distance: '',
    price: '',
    type: 'boys' as 'boys' | 'girls' | 'co-ed' | 'family',
    amenities: [] as string[],
    roomTypes: [] as string[],
    contactPhone: '',
    contactEmail: '',
    published: true,
    images: [] as (string | { file: File; preview: string })[],
  });

  // Progress calculation
  const calculateProgress = () => {
    let completed = 0;
    let total = 7; // Basic fields

    if (form.name) completed++;
    if (form.description && form.description.length >= 200) completed++;
    if (form.address) completed++;
    if (form.price) completed++;
    if (form.amenities.length > 0) completed++;
    if (form.roomTypes.length > 0) completed++;
    if (form.contactPhone) completed++;

    return Math.round((completed / total) * 100);
  };

  const validateDescription = (description: string) => {
    if (!description) {
      toast.error('Description is required');
      return false;
    }
    if (description.length < 200) {
      toast.error('Description must be at least 200 characters long');
      return false;
    }
    return true;
  };

  const validatePhone = (phone: string) => {
    if (!phone) {
      toast.error('Phone number is required');
      return false;
    }
    if (phone.length < 10) {
      toast.error('Phone number must be at least 10 characters long');
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name || '',
        description: editData.description || '',
        city: editData.city || 'Chandigarh',
        locality: editData.locality || '',
        address: editData.address || '',
        distance: editData.distance || '',
        price: editData.price?.toString() || '',
        type: editData.type || 'boys',
        amenities: editData.amenities || [],
        roomTypes: editData.roomTypes || [],
        contactPhone: editData.contactPhone || '',
        contactEmail: editData.contactEmail || '',
        published: editData.published ?? true,
        images: editData.images || [],
      });
    }
  }, [editData]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    const urls = objectUrlsRef.current;
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const toggleAmenity = (amenity: string) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const toggleRoomType = (rt: string) => {
    setForm(prev => ({
      ...prev,
      roomTypes: prev.roomTypes.includes(rt)
        ? prev.roomTypes.filter(r => r !== rt)
        : [...prev.roomTypes, rt],
    }));
  };

  const handleLocationSelect = (location: {
    address: string;
    city: string;
    locality: string;
    coordinates?: { lat: number; lng: number };
  }) => {
    setForm(prev => ({
      ...prev,
      address: location.address,
      city: location.city || prev.city,
      locality: location.locality || prev.locality,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const currentCount = form.images.length;
    const remaining = MAX_IMAGES - currentCount;

    if (remaining <= 0) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (files.length > remaining) {
      toast.warning(`Only ${remaining} more image${remaining > 1 ? 's' : ''} can be added (max ${MAX_IMAGES})`);
    }

    const filesToProcess = Array.from(files).slice(0, remaining);
    const newImageObjects: { file: File; preview: string }[] = [];

    for (const file of filesToProcess) {
      const validation = validateImage(file);
      if (!validation.valid) {
        toast.error(`${file.name}: ${validation.error}`);
        continue;
      }

      const preview = URL.createObjectURL(file);
      objectUrlsRef.current.push(preview);
      newImageObjects.push({ file, preview });
    }

    if (newImageObjects.length > 0) {
      setForm(prev => ({ ...prev, images: [...prev.images, ...newImageObjects] }));
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (idx: number) => {
    const img = form.images[idx];
    if (typeof img !== 'string' && img.preview) {
      URL.revokeObjectURL(img.preview);
    }
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.address || !form.price) {
      toast.error('Please fill in Name, Address, and Price');
      return;
    }
    if (!validateDescription(form.description)) {
      setActiveTab('basic');
      return;
    }
    if (!validatePhone(form.contactPhone)) {
      setActiveTab('contact');
      return;
    }
    setSaving(true);
    try {
      const formDataToSend = new FormData();

      const existingUrls = form.images.filter(img => typeof img === 'string') as string[];
      const newFiles = form.images.filter(img => typeof img !== 'string') as { file: File; preview: string }[];

      Object.entries(form).forEach(([key, value]) => {
        if (key === 'images') return;
        if (Array.isArray(value)) {
          value.forEach(item => formDataToSend.append(`${key}[]`, item));
        } else if (value !== null && value !== undefined) {
          formDataToSend.append(key, value.toString());
        }
      });

      formDataToSend.set('price', form.price.toString());

      if (existingUrls.length > 0) {
        formDataToSend.append('existingImages', JSON.stringify(existingUrls));
      }

      newFiles.forEach((imgObj) => {
        formDataToSend.append('images', imgObj.file);
      });

      if (newFiles.length > 0) {
        setUploadStatus(`Uploading ${newFiles.length} image${newFiles.length > 1 ? 's' : ''}...`);
      }

      if (editData) {
        await api.updatePGListing(editData._id, formDataToSend);
        toast.success('Property updated successfully!');
      } else {
        await api.createPGListing(formDataToSend);
        toast.success('Property created successfully!');
      }
      onSave();
    } catch (error: any) {
      const messages = error.errors;
      if (messages && Array.isArray(messages)) {
        messages.forEach((msg: string) => toast.error(msg));
      } else {
        toast.error(error.message || 'Failed to save property');
      }
    } finally {
      setSaving(false);
      setUploadStatus(null);
    }
  };

  const inputClass = 'w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-sm';

  const progress = calculateProgress();

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl my-8">
        {/* Header with Progress */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-100 rounded-t-2xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {editData ? 'Edit Property' : 'Add New Property'}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">Fill in the details of your PG listing</p>
              </div>
              <button onClick={onCancel} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-gray-500">Completion Progress</span>
                <span className="font-semibold text-purple-600">{progress}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mt-4 overflow-x-auto pb-1">
              {[
                { id: 'basic', label: 'Basic Info', icon: <Building2 className="h-4 w-4" /> },
                { id: 'location', label: 'Location', icon: <MapPin className="h-4 w-4" /> },
                { id: 'amenities', label: 'Amenities', icon: <Wifi className="h-4 w-4" /> },
                { id: 'media', label: 'Media', icon: <ImagePlus className="h-4 w-4" /> },
                { id: 'contact', label: 'Contact', icon: <Phone className="h-4 w-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-50 text-purple-700 border-b-2 border-purple-500'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">PG Name *</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                  placeholder="e.g. Sunrise PG for Boys"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className={`${inputClass} h-32 resize-none`}
                  placeholder="Describe your PG — facilities, rules, nearby landmarks... (minimum 200 characters)"
                />
                <div className="flex justify-end mt-1">
                  <span className={`text-xs ${form.description.length >= 200 ? 'text-green-600' : 'text-gray-400'}`}>
                    {form.description.length}/200 characters
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Monthly Rent (₹) *</label>
                  <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className={inputClass} placeholder="5000" required min={0} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">PG Type</label>
                  <div className="relative">
                    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as 'boys' | 'girls' | 'co-ed' | 'family' })} className={`${inputClass} appearance-none pr-10 cursor-pointer`}>
                      <option value="boys">Boys</option>
                      <option value="girls">Girls</option>
                      <option value="co-ed">Co-Ed</option>
                      <option value="family">Family</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Location Tab */}
          {activeTab === 'location' && (
            <div className="space-y-4">
              <CurrentLocation onLocationSelect={handleLocationSelect} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                  <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className={inputClass} placeholder="Chandigarh" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Locality</label>
                  <input value={form.locality} onChange={e => setForm({ ...form, locality: e.target.value })} className={inputClass} placeholder="e.g. Sector 22" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Address *</label>
                  <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className={inputClass} placeholder="Complete address of the PG" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Distance from CU</label>
                  <input value={form.distance} onChange={e => setForm({ ...form, distance: e.target.value })} className={inputClass} placeholder="e.g. 2 km" />
                </div>
              </div>
            </div>
          )}

          {/* Amenities Tab */}
          {activeTab === 'amenities' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Room Types</label>
                <div className="flex flex-wrap gap-2">
                  {ROOM_TYPES.map(rt => (
                    <button
                      key={rt} type="button" onClick={() => toggleRoomType(rt)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                        form.roomTypes.includes(rt)
                          ? 'bg-purple-50 border-purple-300 text-purple-700 shadow-sm'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {rt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Amenities</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {AMENITY_OPTIONS.map(amenity => (
                    <button
                      key={amenity} type="button" onClick={() => toggleAmenity(amenity)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all text-left ${
                        form.amenities.includes(amenity)
                          ? 'bg-purple-50 border-purple-300 text-purple-700 shadow-sm'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Media Tab */}
          {activeTab === 'media' && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Images ({form.images.length}/{MAX_IMAGES})
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {form.images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group">
                    <img
                      src={typeof img === 'string' ? img : img.preview}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button" onClick={() => removeImage(idx)}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-5 w-5 text-white" />
                    </button>
                  </div>
                ))}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                {form.images.length < MAX_IMAGES && (
                  <button
                    type="button" onClick={triggerFilePicker}
                    className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-purple-400 hover:text-purple-500 transition-colors"
                  >
                    <ImagePlus className="h-6 w-6" />
                    <span className="text-xs mt-1">Add Image</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Phone *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} className={`${inputClass} pl-10`} placeholder="9876543210" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="email" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} className={`${inputClass} pl-10`} placeholder="owner@email.com" />
                  </div>
                </div>
              </div>

              {/* Published Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900 text-sm">Publish Listing</p>
                  <p className="text-xs text-gray-500">Make this visible to tenants</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, published: !form.published })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${form.published ? 'bg-purple-600' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.published ? 'left-6' : 'left-0.5'}`} />
                </button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => {
                const tabs = ['basic', 'location', 'amenities', 'media', 'contact'];
                const currentIndex = tabs.indexOf(activeTab);
                if (currentIndex > 0) {
                  setActiveTab(tabs[currentIndex - 1] as any);
                }
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
              disabled={activeTab === 'basic'}
            >
              Previous
            </button>
            <div className="flex gap-3">
              <button type="button" onClick={onCancel} className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              {activeTab !== 'contact' ? (
                <button
                  type="button"
                  onClick={() => {
                    const tabs = ['basic', 'location', 'amenities', 'media', 'contact'];
                    const currentIndex = tabs.indexOf(activeTab);
                    if (currentIndex < tabs.length - 1) {
                      setActiveTab(tabs[currentIndex + 1] as any);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit" disabled={saving}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {uploadStatus ? uploadStatus : (editData ? 'Update Property' : 'Create Property')}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─────────── Delete Confirm ───────────
const DeleteConfirm = ({ name, loading, onConfirm, onCancel }: { name: string; loading: boolean; onConfirm: () => void; onCancel: () => void }) => (
  <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 animate-scaleIn">
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
        <AlertTriangle className="h-6 w-6 text-red-600" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Property</h3>
      <p className="text-sm text-gray-500 mb-6">
        Are you sure you want to delete <strong>"{name}"</strong>? This action cannot be undone.
      </p>
      <div className="flex gap-3">
        <button onClick={onCancel} disabled={loading} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50">
          Cancel
        </button>
        <button onClick={onConfirm} disabled={loading} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Delete
        </button>
      </div>
    </div>
  </div>
);

// ─────────── Main Dashboard ───────────
const OwnerDashboard = () => {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  const [listings, setListings] = useState<PGListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<PGListing | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PGListing | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price-high' | 'price-low'>('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Access guard
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !['owner', 'admin'].includes(user?.role || ''))) {
      toast.error('Owner access required');
      navigate('/login?role=owner', { replace: true });
    }
  }, [isAuthenticated, user, authLoading, navigate]);

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.getMyListings();
      if (response.success && response.data) {
        setListings(response.data.items || []);
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && ['owner', 'admin'].includes(user?.role || '')) {
      fetchListings();
    }
  }, [isAuthenticated, user, fetchListings]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await api.deletePGListing(deleteTarget._id);
      if (res.success) {
        toast.success('Property deleted');
        setListings(prev => prev.filter(l => l._id !== deleteTarget._id));
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  // Filter and sort listings
  const filtered = listings
    .filter(l =>
      l.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.city?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
        case 'oldest':
          return new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime();
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        default:
          return 0;
      }
    });

  // Stats
  const stats = {
    total: listings.length,
    published: listings.filter(l => l.published).length,
    unpublished: listings.filter(l => !l.published).length,
    avgRating: listings.length > 0 ? (listings.reduce((a, l) => a + (l.rating || 0), 0) / listings.length).toFixed(1) : '0',
    totalBookings: listings.reduce((a, l) => a + (l.totalBookings || 0), 0),
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!isAuthenticated || !['owner', 'admin'].includes(user?.role || '')) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Owner Dashboard</h1>
                <p className="text-xs text-gray-500">Manage your properties</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Current Location Quick Link */}
              <button
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      async (position) => {
                        toast.success('Location accessed');
                      },
                      () => toast.error('Location access denied')
                    );
                  }
                }}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-200 text-blue-700 text-sm hover:bg-blue-100 transition-colors"
              >
                <Navigation className="h-4 w-4" />
                <span>Use My Location</span>
              </button>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-full border border-purple-100">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <span className="text-sm font-medium text-purple-700 hidden sm:inline">{user?.name}</span>
              </div>
              <button onClick={() => navigate('/')} className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Home">
                <Home className="h-4 w-4" />
              </button>
              <button onClick={() => { logout(); navigate('/login'); }} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Sign Out">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Properties', value: stats.total, icon: <Building2 className="h-5 w-5" />, color: 'from-purple-500 to-indigo-600', bg: 'bg-purple-50' },
            { label: 'Published', value: stats.published, icon: <Eye className="h-5 w-5" />, color: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50' },
            { label: 'Unpublished', value: stats.unpublished, icon: <EyeOff className="h-5 w-5" />, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50' },
            { label: 'Avg Rating', value: stats.avgRating, icon: <Star className="h-5 w-5" />, color: 'from-sky-500 to-blue-600', bg: 'bg-sky-50' },
            { label: 'Total Bookings', value: stats.totalBookings, icon: <Users className="h-5 w-5" />, color: 'from-pink-500 to-rose-600', bg: 'bg-pink-50' },
          ].map((s, i) => (
            <div key={i} className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">{s.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{s.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center`}>
                  <div className={`bg-gradient-to-br ${s.color} bg-clip-text text-transparent`}>{s.icon}</div>
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${s.color}`} />
            </div>
          ))}
        </div>

        {/* Enhanced Toolbar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 p-5">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by name, address, or city..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
              </select>

              <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 ${viewMode === 'grid' ? 'bg-purple-50 text-purple-600' : 'bg-white text-gray-400 hover:bg-gray-50'}`}
                >
                  <Building2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 ${viewMode === 'list' ? 'bg-purple-50 text-purple-600' : 'bg-white text-gray-400 hover:bg-gray-50'}`}
                >
                  <Menu className="h-4 w-4" />
                </button>
              </div>

              <button onClick={fetchListings} disabled={loading} className="p-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <button onClick={() => { setEditTarget(null); setShowForm(true); }} className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/25 transition-all flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add Property
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Property Type</label>
                <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                  <option>All Types</option>
                  <option>Boys</option>
                  <option>Girls</option>
                  <option>Co-Ed</option>
                  <option>Family</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Status</label>
                <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                  <option>All</option>
                  <option>Published</option>
                  <option>Unpublished</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Min Price</label>
                <input type="number" placeholder="₹0" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Max Price</label>
                <input type="number" placeholder="₹50000" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" />
              </div>
            </div>
          )}
        </div>

        {/* Listings Grid/List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Loading your properties...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Building2 className="h-16 w-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                {listings.length === 0 ? 'No properties yet' : 'No matching properties'}
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                {listings.length === 0
                  ? 'Start by adding your first PG property!'
                  : 'Try adjusting your search or filters'}
              </p>
              {listings.length === 0 && (
                <button
                  onClick={() => { setEditTarget(null); setShowForm(true); }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/25 inline-flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> Add Your First Property
                </button>
              )}
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(listing => (
              <div key={listing._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl transition-all group">
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {listing.images && listing.images.length > 0 ? (
                    <img src={listing.images[0]} alt={listing.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="h-12 w-12 text-gray-300" />
                    </div>
                  )}
                  {/* Status Badge */}
                  <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${listing.published ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-white'}`}>
                    {listing.published ? 'Live' : 'Draft'}
                  </div>
                  {/* Type Badge */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-gray-700 capitalize">
                    {listing.type}
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{listing.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">{listing.address}, {listing.city}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <IndianRupee className="h-4 w-4 text-purple-600" />
                      <span className="text-xl font-bold text-gray-900">{listing.price?.toLocaleString('en-IN')}</span>
                      <span className="text-sm text-gray-400">/mo</span>
                    </div>
                    {listing.rating > 0 && (
                      <div className="flex items-center gap-1 text-sm bg-amber-50 px-2 py-1 rounded-lg">
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                        <span className="font-semibold text-amber-700">{listing.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Amenities Preview */}
                  {listing.amenities && listing.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {listing.amenities.slice(0, 3).map((a, i) => (
                        <span key={i} className="px-2 py-0.5 bg-purple-50 text-purple-600 text-xs rounded-md font-medium">{a}</span>
                      ))}
                      {listing.amenities.length > 3 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-md font-medium">+{listing.amenities.length - 3}</span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditTarget(listing); setShowForm(true); }}
                      className="flex-1 px-3 py-2 bg-purple-50 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Edit className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(listing)}
                      className="px-3 py-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      className="px-3 py-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      title="More options"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* List View Table */}
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Property</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Rating</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(listing => (
                  <tr key={listing._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{listing.name}</p>
                          <p className="text-xs text-gray-400">ID: {listing._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-3.5 w-3.5" />
                        {listing.city}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">₹{listing.price?.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        listing.published ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {listing.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {listing.rating > 0 ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                          <span>{listing.rating}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">No ratings</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => { setEditTarget(listing); setShowForm(true); }} className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(listing)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modals */}
      {showForm && (
        <PropertyForm
          editData={editTarget}
          onSave={() => { setShowForm(false); setEditTarget(null); fetchListings(); }}
          onCancel={() => { setShowForm(false); setEditTarget(null); }}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          name={deleteTarget.name}
          loading={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default OwnerDashboard;