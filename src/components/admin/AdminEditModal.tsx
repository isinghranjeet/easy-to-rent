import { useState } from 'react';
import { 
  X, Plus, CheckCircle, Eye, Star, ShieldCheck, Save, Loader2,
  Image as ImageIcon, Settings, MapPin, User, Phone, Mail, Home,
  DollarSign, Users, Award, Wifi, Coffee, Tv, Wind, Droplets,
  Car, Shield, Clock, Calendar
} from 'lucide-react';
import { PGListing } from './types';

interface AdminEditModalProps {
  listing: PGListing;
  onClose: () => void;
  onSave: (data: PGListing) => Promise<void>;
}

const AdminEditModal = ({ listing, onClose, onSave }: AdminEditModalProps) => {
  const [formData, setFormData] = useState<PGListing>(listing);
  const [saving, setSaving] = useState(false);
  const [newImage, setNewImage] = useState('');
  const [newAmenity, setNewAmenity] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const addImage = () => {
    if (newImage.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, newImage.trim()]
      });
      setNewImage('');
    }
  };

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, newAmenity.trim()]
      });
      setNewAmenity('');
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const removeAmenity = (index: number) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter((_, i) => i !== index)
    });
  };

  const commonAmenities = [
    'WiFi', 'AC', 'Meals', 'Parking', 'CCTV', 'Power Backup',
    'Laundry', 'Hot Water', 'Study Room', 'Gym', 'TV', 'Geyser',
    'Attached Bathroom', 'Balcony', 'Housekeeping'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-gray-800 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-gray-900 to-black border-b border-gray-800 z-10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {listing._id ? 'Edit Listing' : 'Create New Listing'}
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                {listing._id ? `ID: ${listing._id}` : 'Create a new PG listing'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            {['basic', 'details', 'images', 'amenities', 'status'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {activeTab === 'basic' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="bg-gray-900/50 p-5 rounded-2xl border border-gray-800">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Home className="h-5 w-5 text-blue-400" />
                    Basic Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        PG Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="Enter PG name"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Locality
                        </label>
                        <input
                          type="text"
                          value={formData.locality}
                          onChange={(e) => setFormData({...formData, locality: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          placeholder="e.g., Gate 1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Address *
                      </label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        rows={2}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Price (₹/month) *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                          <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                            className="w-full pl-8 pr-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            required
                            min="0"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Type *
                        </label>
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                        >
                          <option value="boys" className="bg-gray-900">Boys PG</option>
                          <option value="girls" className="bg-gray-900">Girls PG</option>
                          <option value="co-ed" className="bg-gray-900">Co-ed PG</option>
                          <option value="family" className="bg-gray-900">Family PG</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="bg-gray-900/50 p-5 rounded-2xl border border-gray-800">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-emerald-400" />
                    Owner Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Owner Name *
                      </label>
                      <input
                        type="text"
                        value={formData.ownerName}
                        onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Owner Phone *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">📱</span>
                          <input
                            type="text"
                            value={formData.ownerPhone}
                            onChange={(e) => setFormData({...formData, ownerPhone: e.target.value})}
                            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                            required
                            placeholder="9315058665"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Contact Phone
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">📞</span>
                          <input
                            type="text"
                            value={formData.contactPhone}
                            onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                            placeholder="9315058665"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Owner Email
                      </label>
                      <input
                        type="email"
                        value={formData.ownerEmail}
                        onChange={(e) => setFormData({...formData, ownerEmail: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        placeholder="owner@example.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs content would go here */}
          
          {/* Form Actions */}
          <div className="sticky bottom-0 bg-gradient-to-r from-gray-900 to-black border-t border-gray-800 mt-8 p-6">
            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-700 text-gray-300 rounded-xl font-semibold hover:bg-gray-800 transition-all hover:border-gray-600"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 flex items-center gap-3"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    {listing._id ? 'Update Listing' : 'Create Listing'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEditModal;