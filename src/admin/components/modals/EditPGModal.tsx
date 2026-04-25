import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { AdminPG } from '@/admin/types';
import {
  X,
  Home,
  Save,
  Loader2,
  AlertCircle,
  MapPin,
  IndianRupee,
  Image,
  Video,
  Youtube,
  Check,
  Plus,
  Trash2,
  Eye,
} from 'lucide-react';

interface EditPGModalProps {
  pg: AdminPG | null;
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<AdminPG>) => Promise<void>;
  loading?: boolean;
}

const PG_TYPES = ['boys', 'girls', 'co-ed', 'family'] as const;

const COMMON_AMENITIES = [
  'WiFi',
  'AC',
  'Meals',
  'Parking',
  'Laundry',
  'TV',
  'Geyser',
  'Fridge',
  'Security',
  'Power Backup',
  'Housekeeping',
  'Gym',
  'Lift',
  'RO Water',
  'Washing Machine',
];

function isValidYouTubeUrl(url: string): boolean {
  if (!url) return true;
  return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(url);
}

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  if (url.includes('youtube.com/watch?v=')) {
    return url.replace('watch?v=', 'embed/');
  }
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
  }
  return url;
}

export function EditPGModal({ pg, open, onClose, onSave, loading }: EditPGModalProps) {
  const [formData, setFormData] = useState<Partial<AdminPG>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [newAmenity, setNewAmenity] = useState('');

  useEffect(() => {
    if (pg && open) {
      setFormData({
        name: pg.name || '',
        description: pg.description || '',
        price: pg.price || 0,
        city: pg.city || '',
        locality: pg.locality || '',
        address: pg.address || '',
        type: pg.type || 'boys',
        amenities: Array.isArray(pg.amenities) ? [...pg.amenities] : [],
        images: Array.isArray(pg.images) ? [...pg.images] : [],
        videoUrl: pg.videoUrl || '',
        virtualTour: pg.virtualTour || '',
      });
      setErrors({});
      setShowPreview(false);
    }
  }, [pg, open]);

  const updateField = useCallback(<K extends keyof AdminPG>(field: K, value: AdminPG[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const toggleAmenity = (amenity: string) => {
    const current = Array.isArray(formData.amenities) ? formData.amenities : [];
    if (current.includes(amenity)) {
      updateField('amenities', current.filter((a) => a !== amenity));
    } else {
      updateField('amenities', [...current, amenity]);
    }
  };

  const addCustomAmenity = () => {
    const trimmed = newAmenity.trim();
    if (!trimmed) return;
    const current = Array.isArray(formData.amenities) ? formData.amenities : [];
    if (!current.includes(trimmed)) {
      updateField('amenities', [...current, trimmed]);
    }
    setNewAmenity('');
  };

  const removeAmenity = (amenity: string) => {
    const current = Array.isArray(formData.amenities) ? formData.amenities : [];
    updateField('amenities', current.filter((a) => a !== amenity));
  };

  const handleImagesChange = (value: string) => {
    const urls = value
      .split(/\n|,/)
      .map((u) => u.trim())
      .filter((u) => u.length > 0);
    updateField('images', urls);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = 'PG name is required';
    if (!formData.city?.trim()) newErrors.city = 'City is required';
    if (!formData.address?.trim()) newErrors.address = 'Address is required';
    if (formData.price === undefined || formData.price < 0) newErrors.price = 'Valid price is required';
    if (formData.videoUrl && !isValidYouTubeUrl(formData.videoUrl)) {
      newErrors.videoUrl = 'Only YouTube URLs are allowed';
    }
    if (formData.virtualTour && !isValidYouTubeUrl(formData.virtualTour)) {
      newErrors.virtualTour = 'Only YouTube URLs are allowed';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      await onSave(formData);
    }
  };

  if (!open || !pg) return null;

  const imagesText = Array.isArray(formData.images) ? formData.images.join('\n') : '';
  const embedUrl = getYouTubeEmbedUrl(formData.virtualTour || '');

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full shadow-2xl animate-scaleIn max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit Property</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Update details for {pg.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Property Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => updateField('name', e.target.value)}
                className={cn(
                  'w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border rounded-xl text-sm dark:text-white outline-none focus:ring-2 focus:ring-purple-500 transition-colors',
                  errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700'
                )}
                placeholder="Enter property name"
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.name}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm dark:text-white outline-none focus:ring-2 focus:ring-purple-500 transition-colors resize-none"
              placeholder="Enter property description"
            />
          </div>

          {/* Price & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Price (₹/month) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  min={0}
                  value={formData.price || ''}
                  onChange={(e) => updateField('price', Number(e.target.value))}
                  className={cn(
                    'w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border rounded-xl text-sm dark:text-white outline-none focus:ring-2 focus:ring-purple-500 transition-colors',
                    errors.price ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700'
                  )}
                  placeholder="Enter price"
                />
              </div>
              {errors.price && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.price}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Type
              </label>
              <select
                value={formData.type || 'boys'}
                onChange={(e) => updateField('type', e.target.value as AdminPG['type'])}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm dark:text-white outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
              >
                {PG_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                City <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.city || ''}
                  onChange={(e) => updateField('city', e.target.value)}
                  className={cn(
                    'w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border rounded-xl text-sm dark:text-white outline-none focus:ring-2 focus:ring-purple-500 transition-colors',
                    errors.city ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700'
                  )}
                  placeholder="City"
                />
              </div>
              {errors.city && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.city}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Locality
              </label>
              <input
                type="text"
                value={formData.locality || ''}
                onChange={(e) => updateField('locality', e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm dark:text-white outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                placeholder="Locality"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => updateField('address', e.target.value)}
                className={cn(
                  'w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border rounded-xl text-sm dark:text-white outline-none focus:ring-2 focus:ring-purple-500 transition-colors',
                  errors.address ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700'
                )}
                placeholder="Full address"
              />
              {errors.address && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.address}
                </p>
              )}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amenities
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {COMMON_AMENITIES.map((amenity) => {
                const selected = (formData.amenities || []).includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1',
                      selected
                        ? 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300'
                        : 'bg-gray-50 border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    )}
                  >
                    {selected && <Check className="h-3 w-3" />}
                    {amenity}
                  </button>
                );
              })}
            </div>
            {/* Custom amenities */}
            <div className="flex flex-wrap gap-2 mb-2">
              {(formData.amenities || [])
                .filter((a) => !COMMON_AMENITIES.includes(a))
                .map((amenity) => (
                  <span
                    key={amenity}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-50 border border-purple-200 text-purple-700 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300"
                  >
                    {amenity}
                    <button
                      type="button"
                      onClick={() => removeAmenity(amenity)}
                      className="hover:text-red-500"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </span>
                ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomAmenity();
                  }
                }}
                className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm dark:text-white outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                placeholder="Add custom amenity"
              />
              <button
                type="button"
                onClick={addCustomAmenity}
                className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Image URLs
            </label>
            <div className="relative">
              <Image className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <textarea
                value={imagesText}
                onChange={(e) => handleImagesChange(e.target.value)}
                rows={3}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm dark:text-white outline-none focus:ring-2 focus:ring-purple-500 transition-colors resize-none"
                placeholder="Enter image URLs (one per line or comma separated)"
              />
            </div>
            {Array.isArray(formData.images) && formData.images.length > 0 && (
              <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 border border-gray-200 dark:border-gray-700">
                    <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Virtual Tour - YouTube */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Youtube className="h-5 w-5 text-red-600" />
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Virtual Tour (YouTube)</h4>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                YouTube Video URL
              </label>
              <div className="relative">
                <Video className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.virtualTour || ''}
                  onChange={(e) => updateField('virtualTour', e.target.value)}
                  className={cn(
                    'w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border rounded-xl text-sm dark:text-white outline-none focus:ring-2 focus:ring-purple-500 transition-colors',
                    errors.virtualTour ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700'
                  )}
                  placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
                />
              </div>
              {errors.virtualTour && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.virtualTour}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">Only YouTube URLs (youtube.com or youtu.be) are supported.</p>
            </div>

            {/* Preview */}
            {embedUrl && (
              <div>
                <button
                  type="button"
                  onClick={() => setShowPreview((p) => !p)}
                  className="flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-700 font-medium mb-2"
                >
                  <Eye className="h-4 w-4" />
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </button>
                {showPreview && (
                  <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-black aspect-video">
                    <iframe
                      src={embedUrl}
                      title="Virtual Tour Preview"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Video URL (legacy) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Promotional Video URL (YouTube)
            </label>
            <div className="relative">
              <Video className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={formData.videoUrl || ''}
                onChange={(e) => updateField('videoUrl', e.target.value)}
                className={cn(
                  'w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border rounded-xl text-sm dark:text-white outline-none focus:ring-2 focus:ring-purple-500 transition-colors',
                  errors.videoUrl ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700'
                )}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
            {errors.videoUrl && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.videoUrl}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 sticky bottom-0 bg-white dark:bg-gray-900 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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
}

