import { useState, useEffect, useCallback } from 'react';
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
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api, PGListing } from '@/services/api';
import { toast } from 'sonner';

// ─────────── Amenity options ───────────
const AMENITY_OPTIONS = [
  'WiFi', 'AC', 'Geyser', 'Parking', 'Laundry', 'Food/Mess', 'Power Backup',
  'Security', 'CCTV', 'RO Water', 'Refrigerator', 'TV', 'Gym', 'Study Room',
  'Attached Bathroom', 'Balcony', 'Cleaning Service', 'Kitchen Access',
];

const ROOM_TYPES = ['Single', 'Double', 'Triple', 'Four Sharing'];

// ─────────── Create/Edit Form ───────────
interface PropertyFormProps {
  editData?: PGListing | null;
  onSave: () => void;
  onCancel: () => void;
}

const PropertyForm = ({ editData, onSave, onCancel }: PropertyFormProps) => {
  const [saving, setSaving] = useState(false);
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
    images: [] as string[],
  });

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

  const handleImageUrl = () => {
    const url = prompt('Enter image URL:');
    if (url && url.startsWith('http')) {
      setForm(prev => ({ ...prev, images: [...prev.images, url] }));
    }
  };

  const removeImage = (idx: number) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.address || !form.price) {
      toast.error('Please fill in Name, Address, and Price');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
      };

      if (editData) {
        await api.updatePGListing(editData._id, payload);
        toast.success('Property updated successfully!');
      } else {
        await api.createPGListing(payload);
        toast.success('Property created successfully!');
      }
      onSave();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to save property');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-sm';

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl my-8">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-gray-100 rounded-t-2xl">
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">PG Name *</label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className={inputClass}
                placeholder="e.g. Sunrise PG for Boys"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className={`${inputClass} h-24 resize-none`}
                placeholder="Describe your PG — facilities, rules, nearby landmarks..."
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-purple-500" /> Location
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Pricing & Type */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-purple-500" /> Pricing & Type
            </h4>
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

          {/* Room Types */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Room Types</label>
            <div className="flex flex-wrap gap-2">
              {ROOM_TYPES.map(rt => (
                <button
                  key={rt} type="button" onClick={() => toggleRoomType(rt)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    form.roomTypes.includes(rt)
                      ? 'bg-purple-50 border-purple-300 text-purple-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {rt}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map(amenity => (
                <button
                  key={amenity} type="button" onClick={() => toggleAmenity(amenity)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    form.amenities.includes(amenity)
                      ? 'bg-purple-50 border-purple-300 text-purple-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Images</label>
            <div className="flex flex-wrap gap-3">
              {form.images.map((img, idx) => (
                <div key={idx} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button" onClick={() => removeImage(idx)}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-5 w-5 text-white" />
                  </button>
                </div>
              ))}
              <button
                type="button" onClick={handleImageUrl}
                className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-purple-400 hover:text-purple-500 transition-colors"
              >
                <ImagePlus className="h-6 w-6" />
                <span className="text-xs mt-1">Add</span>
              </button>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Contact Info</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Phone</label>
                <input value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} className={inputClass} placeholder="9876543210" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Email</label>
                <input type="email" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} className={inputClass} placeholder="owner@email.com" />
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

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancel} className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button
              type="submit" disabled={saving}
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {editData ? 'Update Property' : 'Create Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─────────── Delete Confirm ───────────
const DeleteConfirm = ({ name, loading, onConfirm, onCancel }: { name: string; loading: boolean; onConfirm: () => void; onCancel: () => void }) => (
  <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6">
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

  const filtered = listings.filter(l =>
    l.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const stats = {
    total: listings.length,
    published: listings.filter(l => l.published).length,
    unpublished: listings.filter(l => !l.published).length,
    avgRating: listings.length > 0 ? (listings.reduce((a, l) => a + (l.rating || 0), 0) / listings.length).toFixed(1) : '0',
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
              <button onClick={() => navigate('/')} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Home className="h-4 w-4" /> <span className="hidden sm:inline">Home</span>
              </button>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-full border border-purple-100">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <span className="text-sm font-medium text-purple-700">{user?.name}</span>
              </div>
              <button onClick={() => { logout(); navigate('/login'); }} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Sign Out">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Properties', value: stats.total, icon: <Building2 className="h-5 w-5" />, color: 'from-purple-500 to-indigo-600', bg: 'bg-purple-50' },
            { label: 'Published', value: stats.published, icon: <Eye className="h-5 w-5" />, color: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50' },
            { label: 'Unpublished', value: stats.unpublished, icon: <EyeOff className="h-5 w-5" />, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50' },
            { label: 'Avg Rating', value: stats.avgRating, icon: <Star className="h-5 w-5" />, color: 'from-sky-500 to-blue-600', bg: 'bg-sky-50' },
          ].map((s, i) => (
            <div key={i} className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
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

        {/* Toolbar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 p-5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search your properties..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>
            <button onClick={fetchListings} disabled={loading} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <button onClick={() => { setEditTarget(null); setShowForm(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/25 transition-all">
              <Plus className="h-4 w-4" /> Add Property
            </button>
          </div>
        </div>

        {/* Listings Grid */}
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
                  : 'Try adjusting your search term'}
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(listing => (
              <div key={listing._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-shadow group">
                {/* Image */}
                <div className="relative h-44 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  {listing.images && listing.images.length > 0 ? (
                    <img src={listing.images[0]} alt={listing.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="h-12 w-12 text-gray-300" />
                    </div>
                  )}
                  {/* Status Badge */}
                  <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${listing.published ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-white'}`}>
                    {listing.published ? '● Live' : '○ Draft'}
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
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="truncate">{listing.address}, {listing.city}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <IndianRupee className="h-4 w-4 text-purple-600" />
                      <span className="text-xl font-bold text-gray-900">{listing.price?.toLocaleString('en-IN')}</span>
                      <span className="text-sm text-gray-400">/mo</span>
                    </div>
                    {listing.rating > 0 && (
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        <span className="font-semibold text-gray-700">{listing.rating}</span>
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
                      <CheckCircle2 className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(listing)}
                      className="px-3 py-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
