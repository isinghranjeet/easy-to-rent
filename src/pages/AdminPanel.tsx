import { useState, useEffect, useCallback } from 'react';
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
  BarChart3,
  Activity,
  Truck,
  Star,
  MoreVertical,
  Key,
  Edit,
  Save,
  XCircle as CancelIcon,
  Plus,
  Trash,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api, User } from '@/services/api';
import { toast } from 'sonner';

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
          <button 
            onClick={onCancel} 
            disabled={loading} 
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 ${config.button}`}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmText}
          </button>
        </div>
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
    location: {
      city: '',
      state: '',
      country: 'India',
      timezone: 'IST',
      address: '',
      pincode: '',
    },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'user',
        location: user.location || {
          city: '',
          state: '',
          country: 'India',
          timezone: 'IST',
          address: '',
          pincode: '',
        },
      });
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.location.city.trim()) newErrors.city = 'City is required';
    if (!formData.location.state.trim()) newErrors.state = 'State is required';
    
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
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Edit User</h3>
              <p className="text-sm text-gray-500 mt-1">Update user information and location details</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-purple-500" />
              Basic Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all ${
                    errors.name ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Enter full name"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all ${
                    errors.email ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all ${
                    errors.phone ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Enter phone number"
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="user">User</option>
                  <option value="owner">Owner</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-purple-500" />
              Location Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location.address}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, address: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Street address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location.city}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, city: e.target.value }
                  })}
                  className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none ${
                    errors.city ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="City"
                />
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location.state}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, state: e.target.value }
                  })}
                  className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none ${
                    errors.state ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="State"
                />
                {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.location.country}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, country: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Country"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PIN Code
                </label>
                <input
                  type="text"
                  value={formData.location.pincode}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, pincode: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="PIN code"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <select
                  value={formData.location.timezone}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: { ...formData.location, timezone: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="IST">IST (UTC+5:30)</option>
                  <option value="EST">EST (UTC-5:00)</option>
                  <option value="PST">PST (UTC-8:00)</option>
                  <option value="GMT">GMT (UTC+0:00)</option>
                  <option value="CST">CST (UTC+8:00)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              <Save className="h-4 w-4" />
              Save Changes
            </button>
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

  // Mock activity data
  const recentActivities: ActivityLog[] = [
    {
      id: '1',
      userId: user._id,
      action: 'Login',
      timestamp: new Date().toISOString(),
      ipAddress: '192.168.1.1',
      details: { device: 'Chrome on Windows' }
    },
    {
      id: '2',
      userId: user._id,
      action: 'Profile Update',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      ipAddress: '192.168.1.1',
      details: { field: 'Location' }
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl overflow-y-auto animate-slideIn">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">User Profile Management</h3>
            <button 
              onClick={onClose} 
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-100">
            {[
              { id: 'overview', label: 'Overview', icon: <UserCircle className="h-4 w-4" /> },
              { id: 'activity', label: 'Activity', icon: <Activity className="h-4 w-4" /> },
              { id: 'bookings', label: 'Bookings', icon: <Truck className="h-4 w-4" /> },
              { id: 'reviews', label: 'Reviews', icon: <Star className="h-4 w-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === tab.id
                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50/50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900">{user.name}</h4>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <RoleBadge role={user.role} />
                        <StatusBadge status={user.status || 'active'} />
                      </div>
                    </div>
                    <button
                      onClick={onEdit}
                      className="px-4 py-2 text-sm bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-sm"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-blue-700" />
                  </div>
                  <h5 className="font-semibold text-blue-900">Location Information</h5>
                </div>
                {user.location ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-blue-600 mb-1">Address</p>
                      <p className="font-medium text-blue-900">{user.location.address || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 mb-1">City</p>
                      <p className="font-medium text-blue-900">{user.location.city || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 mb-1">State</p>
                      <p className="font-medium text-blue-900">{user.location.state || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 mb-1">Country</p>
                      <p className="font-medium text-blue-900">{user.location.country || 'India'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 mb-1">PIN Code</p>
                      <p className="font-medium text-blue-900">{user.location.pincode || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600 mb-1">Timezone</p>
                      <p className="font-medium text-blue-900">{user.location.timezone || 'IST'}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-blue-600">No location information available</p>
                )}
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Mail className="h-4 w-4" />
                    <span className="text-xs font-medium">EMAIL</span>
                  </div>
                  <p className="text-gray-900 font-medium">{user.email}</p>
                  <p className="text-xs text-gray-400 mt-1">Verified • Primary</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Phone className="h-4 w-4" />
                    <span className="text-xs font-medium">PHONE</span>
                  </div>
                  <p className="text-gray-900 font-medium">{user.phone || 'Not provided'}</p>
                  <p className="text-xs text-gray-400 mt-1">{user.phone ? 'Verified' : 'Not verified'}</p>
                </div>
              </div>

              {/* Account Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-xs font-medium">MEMBER SINCE</span>
                  </div>
                  <p className="text-gray-900 font-medium">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    }) : 'Unknown'}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs font-medium">LAST ACTIVE</span>
                  </div>
                  <p className="text-gray-900 font-medium">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: 'numeric',
                      month: 'short'
                    }) : 'Never'}
                  </p>
                </div>
              </div>

              {/* System Information */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <Key className="h-4 w-4" />
                  <span className="text-xs font-medium">SYSTEM INFORMATION</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">User ID</span>
                    <span className="text-sm font-mono text-gray-900">{user._id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Account Type</span>
                    <span className="text-sm text-gray-900">{user.role === 'admin' ? 'Administrator' : user.role === 'owner' ? 'Property Owner' : 'Standard User'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 mb-4">Recent Activity Log</h4>
              {recentActivities.map((activity) => (
                <div key={activity.id} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{activity.action}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {activity.ipAddress}
                    </span>
                    {activity.details && (
                      <span className="text-gray-400">
                        {Object.entries(activity.details).map(([key, value]) => `${key}: ${value}`).join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="text-center py-12">
              <Truck className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No booking history available</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="text-center py-12">
              <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No reviews yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ────────────────── Admin Panel Page ──────────────────
const AdminPanel = () => {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

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

  // Check admin access
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== 'admin')) {
      toast.error('Admin access required');
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, user, authLoading, navigate]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getAllUsers();
      if (response.success && response.data) {
        // Add location data from API response or use default
        const usersWithLocation = (response.data.items || []).map((u: any) => ({
          ...u,
          location: u.location || {
            city: u.city || '',
            state: u.state || '',
            country: u.country || 'India',
            timezone: u.timezone || 'IST',
            address: u.address || '',
            pincode: u.pincode || '',
          },
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

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchUsers();
    }
  }, [isAuthenticated, user, fetchUsers]);

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone?.includes(searchTerm);
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || (u.status || 'active') === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleUpdateUser = async (userId: string, updateData: Partial<UserWithLocation>) => {
    try {
      setActionLoading(true);
      const response = await api.updateUser(userId, updateData);
      if (response.success) {
        setUsers((prev) => prev.map((u) => 
          u._id === userId ? { ...u, ...updateData } : u
        ));
        toast.success('User updated successfully');
        return true;
      } else {
        throw new Error(response.message || 'Failed to update user');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update user';
      toast.error(message);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditUser = async (formData: EditUserData) => {
    if (!editingUser) return;
    
    const success = await handleUpdateUser(editingUser._id, {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      location: formData.location,
    });
    
    if (success) {
      setEditingUser(null);
      setSelectedUser(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      const response = await api.deleteUser(deleteTarget._id);
      if (response.success) {
        toast.success(response.message || 'User deleted successfully');
        setUsers((prev) => prev.filter((u) => u._id !== deleteTarget._id));
        if (selectedUser?._id === deleteTarget._id) {
          setSelectedUser(null);
        }
      } else {
        throw new Error(response.message || 'Failed to delete user');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete user';
      toast.error(message);
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
        toast.success(response.message || `User ${statusChangeTarget.newStatus === 'active' ? 'activated' : 'suspended'} successfully`);
        setUsers((prev) => prev.map((u) => 
          u._id === statusChangeTarget.user._id 
            ? { ...u, status: statusChangeTarget.newStatus as 'active' | 'inactive' | 'suspended' } 
            : u
        ));
      } else {
        throw new Error(response.message || 'Failed to update status');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update status';
      toast.error(message);
    } finally {
      setActionLoading(false);
      setStatusChangeTarget(null);
    }
  };

  // Export users data
  const handleExportData = () => {
    try {
      const exportData = users.map(u => ({
        id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        status: u.status,
        city: u.location?.city,
        state: u.location?.state,
        country: u.location?.country,
        pincode: u.location?.pincode,
        joined: u.createdAt,
        lastLogin: u.lastLogin,
      }));
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `users-export-${new Date().toISOString().split('T')[0]}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success(`Exported ${users.length} users successfully`);
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  // Stats
  const stats = {
    total: users.length,
    active: users.filter((u) => (u.status || 'active') === 'active').length,
    suspended: users.filter((u) => u.status === 'suspended').length,
    admins: users.filter((u) => u.role === 'admin').length,
    owners: users.filter((u) => u.role === 'owner').length,
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Admin Control Center</h1>
                <p className="text-xs text-gray-500">EassyToRent • Enterprise Management</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Admin Profile */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-full border border-purple-100">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <span className="text-sm font-medium text-purple-700 hidden sm:inline">{user?.name}</span>
              </div>

              {/* Navigation */}
              <button
                onClick={() => navigate('/')}
                className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                title="Home"
              >
                <Home className="h-4 w-4" />
              </button>

              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Error Alert ── */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-xs text-red-600 hover:text-red-800 mt-1"
              >
                Dismiss
              </button>
            </div>
            <button onClick={fetchUsers} className="text-red-600 hover:text-red-800 text-sm font-medium">
              Retry
            </button>
          </div>
        )}

        {/* ── Stats Cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Users', value: stats.total, icon: <Users className="h-5 w-5" />, color: 'from-sky-500 to-blue-600', bg: 'bg-sky-50' },
            { label: 'Active', value: stats.active, icon: <CheckCircle2 className="h-5 w-5" />, color: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50' },
            { label: 'Suspended', value: stats.suspended, icon: <ShieldAlert className="h-5 w-5" />, color: 'from-red-500 to-rose-600', bg: 'bg-red-50' },
            { label: 'Admins', value: stats.admins, icon: <Shield className="h-5 w-5" />, color: 'from-purple-500 to-indigo-600', bg: 'bg-purple-50' },
            { label: 'Owners', value: stats.owners, icon: <Building2 className="h-5 w-5" />, color: 'from-blue-500 to-cyan-600', bg: 'bg-blue-50' },
          ].map((stat, i) => (
            <div key={i} className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <div className={`bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />
            </div>
          ))}
        </div>

        {/* ── Filters & Search ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6">
          <div className="p-5">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, phone, or ID..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                />
              </div>

              {/* Quick Filters */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Filter className="h-4 w-4" />
                Filters
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* Export */}
              <button
                onClick={handleExportData}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Download className="h-4 w-4" />
                Export
              </button>

              {/* Refresh */}
              <button
                onClick={fetchUsers}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 shadow-sm shadow-purple-200"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Role</label>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="all">All Roles</option>
                    <option value="user">Users</option>
                    <option value="admin">Admins</option>
                    <option value="owner">Owners</option>
                    <option value="moderator">Moderators</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Location</label>
                  <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none">
                    <option>All Locations</option>
                    <option>Mumbai</option>
                    <option>Delhi</option>
                    <option>Bangalore</option>
                    <option>Chennai</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Users Table ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Loading users...</p>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No users found</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
              </div>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="hidden lg:grid lg:grid-cols-[2fr_2fr_1fr_1fr_1.5fr_0.5fr] gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <span>User</span>
                <span>Contact</span>
                <span>Role</span>
                <span>Status</span>
                <span>Joined</span>
                <span className="text-right">Actions</span>
              </div>

              {/* Table Rows */}
              {filteredUsers.map((u) => (
                <div
                  key={u._id}
                  className="grid grid-cols-1 lg:grid-cols-[2fr_2fr_1fr_1fr_1.5fr_0.5fr] gap-4 items-center px-6 py-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                >
                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm ${
                      u.role === 'admin' 
                        ? 'bg-gradient-to-br from-purple-500 to-indigo-500' 
                        : u.role === 'owner'
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                        : 'bg-gradient-to-br from-orange-500 to-amber-500'
                    }`}>
                      {u.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{u.name}</p>
                      <p className="text-xs text-gray-400 truncate lg:hidden">{u.email}</p>
                      <div className="hidden lg:block">
                        <LocationBadge location={u.location} />
                      </div>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="hidden lg:block min-w-0">
                    <p className="text-sm text-gray-700 truncate">{u.email}</p>
                    <p className="text-xs text-gray-400">{u.phone || 'No phone'}</p>
                  </div>

                  {/* Role */}
                  <div>
                    <RoleBadge role={u.role} />
                  </div>

                  {/* Status */}
                  <div>
                    <StatusBadge status={u.status || 'active'} />
                  </div>

                  {/* Joined */}
                  <div className="hidden lg:block">
                    <p className="text-sm text-gray-600">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      }) : '—'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 justify-end">
                    <button
                      onClick={() => setSelectedUser(u)}
                      className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => setEditingUser(u)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit User"
                    >
                      <Edit className="h-4 w-4" />
                    </button>

                    {u.role !== 'admin' && (
                      <>
                        <button
                          onClick={() =>
                            setStatusChangeTarget({
                              user: u,
                              newStatus: (u.status || 'active') === 'active' ? 'suspended' : 'active',
                            })
                          }
                          className={`p-2 rounded-lg transition-colors ${
                            (u.status || 'active') === 'active'
                              ? 'text-gray-400 hover:text-amber-600 hover:bg-amber-50'
                              : 'text-amber-500 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={(u.status || 'active') === 'active' ? 'Suspend User' : 'Activate User'}
                        >
                          {(u.status || 'active') === 'active' ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                        </button>

                        <button
                          onClick={() => setDeleteTarget(u)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}

                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors lg:hidden">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Mobile Location Badge */}
                  <div className="lg:hidden mt-2">
                    <LocationBadge location={u.location} />
                  </div>
                </div>
              ))}

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-semibold text-gray-700">{filteredUsers.length}</span> of{' '}
                  <span className="font-semibold text-gray-700">{users.length}</span> users
                </p>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    Previous
                  </button>
                  <button className="px-3 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    1
                  </button>
                  <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    2
                  </button>
                  <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    3
                  </button>
                  <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* ── Modals ── */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete User Account"
        message={`You are about to permanently delete "${deleteTarget?.name}"'s account. This action cannot be undone. All associated data, including reviews, bookings, and personal information will be permanently removed from the system.`}
        confirmText="Delete Permanently"
        variant="danger"
        loading={actionLoading}
        onConfirm={handleDeleteUser}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmModal
        isOpen={!!statusChangeTarget}
        title={statusChangeTarget?.newStatus === 'suspended' ? 'Suspend User Account' : 'Activate User Account'}
        message={
          statusChangeTarget?.newStatus === 'suspended'
            ? `You are about to suspend "${statusChangeTarget?.user.name}"'s account. They will lose access to all platform features and will not be able to log in until manually reactivated.`
            : `You are about to reactivate "${statusChangeTarget?.user.name}"'s account. They will regain full access to the platform and be able to log in normally.`
        }
        confirmText={statusChangeTarget?.newStatus === 'suspended' ? 'Confirm Suspension' : 'Confirm Activation'}
        variant="warning"
        loading={actionLoading}
        onConfirm={handleStatusChange}
        onCancel={() => setStatusChangeTarget(null)}
      />

      <EditUserModal
        isOpen={!!editingUser}
        user={editingUser}
        loading={actionLoading}
        onSave={handleEditUser}
        onClose={() => setEditingUser(null)}
      />

      <UserDetailDrawer 
        user={selectedUser} 
        onClose={() => setSelectedUser(null)}
        onEdit={() => {
          if (selectedUser) {
            setEditingUser(selectedUser);
            setSelectedUser(null);
          }
        }}
      />
    </div>
  );
};

export default AdminPanel;