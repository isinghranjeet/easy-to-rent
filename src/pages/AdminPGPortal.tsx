// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   Shield, AlertCircle, CheckCircle, RefreshCw, Trash2, Edit, 
//   Eye, EyeOff, Star, StarOff, UserCheck, Search, Filter, 
//   Plus, Download, Upload, BarChart3, Users, Home, Settings,
//   ChevronRight, ChevronLeft, X, Save, Loader2, MapPin,
//   Phone, Mail, Calendar, Check, XCircle, ExternalLink
// } from 'lucide-react';

// // ✅ Backend URL
// const API_URL = 'https://eassy-to-rent-backend.onrender.com';

// // ✅ PG Listing Interface
// interface PGListing {
//   _id: string;
//   name: string;
//   city: string;
//   locality: string;
//   address: string;
//   price: number;
//   type: 'boys' | 'girls' | 'co-ed' | 'family';
//   description: string;
//   images: string[];
//   gallery: string[];
//   googleMapLink: string;
//   amenities: string[];
//   roomTypes: string[];
//   distance: string;
//   availability: 'available' | 'sold-out' | 'coming-soon';
//   published: boolean;
//   verified: boolean;
//   featured: boolean;
//   rating: number;
//   reviewCount: number;
//   ownerName: string;
//   ownerPhone: string;
//   ownerEmail: string;
//   ownerId: string;
//   contactEmail: string;
//   contactPhone: string;
//   createdAt: string;
//   updatedAt: string;
// }

// // ✅ Edit Modal Component
// const EditModal = ({ listing, onClose, onSave }: { 
//   listing: PGListing; 
//   onClose: () => void;
//   onSave: (data: PGListing) => void;
// }) => {
//   const [formData, setFormData] = useState(listing);
//   const [saving, setSaving] = useState(false);
//   const [newImage, setNewImage] = useState('');
//   const [newAmenity, setNewAmenity] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       await onSave(formData);
//       onClose();
//     } catch (error) {
//       console.error('Save error:', error);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const addImage = () => {
//     if (newImage.trim()) {
//       setFormData({
//         ...formData,
//         images: [...formData.images, newImage.trim()]
//       });
//       setNewImage('');
//     }
//   };

//   const addAmenity = () => {
//     if (newAmenity.trim()) {
//       setFormData({
//         ...formData,
//         amenities: [...formData.amenities, newAmenity.trim()]
//       });
//       setNewAmenity('');
//     }
//   };

//   const removeImage = (index: number) => {
//     setFormData({
//       ...formData,
//       images: formData.images.filter((_, i) => i !== index)
//     });
//   };

//   const removeAmenity = (index: number) => {
//     setFormData({
//       ...formData,
//       amenities: formData.amenities.filter((_, i) => i !== index)
//     });
//   };

//   return (
//     <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
//         <div className="p-6 border-b flex items-center justify-between">
//           <h2 className="text-xl font-bold text-gray-900">
//             Edit PG Listing
//           </h2>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Left Column */}
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   PG Name *
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.name}
//                   onChange={(e) => setFormData({...formData, name: e.target.value})}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   City *
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.city}
//                   onChange={(e) => setFormData({...formData, city: e.target.value})}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Locality
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.locality}
//                   onChange={(e) => setFormData({...formData, locality: e.target.value})}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Price (₹/month) *
//                 </label>
//                 <input
//                   type="number"
//                   value={formData.price}
//                   onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Type *
//                 </label>
//                 <select
//                   value={formData.type}
//                   onChange={(e) => setFormData({...formData, type: e.target.value as any})}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
//                 >
//                   <option value="boys">Boys</option>
//                   <option value="girls">Girls</option>
//                   <option value="co-ed">Co-ed</option>
//                   <option value="family">Family</option>
//                 </select>
//               </div>
//             </div>

//             {/* Right Column */}
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Owner Name *
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.ownerName}
//                   onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Owner Phone *
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.ownerPhone}
//                   onChange={(e) => setFormData({...formData, ownerPhone: e.target.value})}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Owner Email
//                 </label>
//                 <input
//                   type="email"
//                   value={formData.ownerEmail}
//                   onChange={(e) => setFormData({...formData, ownerEmail: e.target.value})}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Availability
//                 </label>
//                 <select
//                   value={formData.availability}
//                   onChange={(e) => setFormData({...formData, availability: e.target.value as any})}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
//                 >
//                   <option value="available">Available</option>
//                   <option value="sold-out">Sold Out</option>
//                   <option value="coming-soon">Coming Soon</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Distance
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.distance}
//                   onChange={(e) => setFormData({...formData, distance: e.target.value})}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
//                   placeholder="e.g., 500m from CU"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Description */}
//           <div className="mt-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Description *
//             </label>
//             <textarea
//               value={formData.description}
//               onChange={(e) => setFormData({...formData, description: e.target.value})}
//               rows={3}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
//               required
//             />
//           </div>

//           {/* Images */}
//           <div className="mt-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Images
//             </label>
//             <div className="flex gap-2 mb-2">
//               <input
//                 type="text"
//                 value={newImage}
//                 onChange={(e) => setNewImage(e.target.value)}
//                 placeholder="Enter image URL"
//                 className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
//               />
//               <button
//                 type="button"
//                 onClick={addImage}
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//               >
//                 Add
//               </button>
//             </div>
//             <div className="flex flex-wrap gap-2">
//               {formData.images.map((img, index) => (
//                 <div key={index} className="relative group">
//                   <img
//                     src={img}
//                     alt={`Image ${index + 1}`}
//                     className="w-20 h-20 object-cover rounded-lg"
//                     onError={(e) => {
//                       (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80?text=Image+Error';
//                     }}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeImage(index)}
//                     className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                   >
//                     <X className="h-3 w-3" />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Amenities */}
//           <div className="mt-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Amenities
//             </label>
//             <div className="flex gap-2 mb-2">
//               <input
//                 type="text"
//                 value={newAmenity}
//                 onChange={(e) => setNewAmenity(e.target.value)}
//                 placeholder="Enter amenity"
//                 className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
//               />
//               <button
//                 type="button"
//                 onClick={addAmenity}
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//               >
//                 Add
//               </button>
//             </div>
//             <div className="flex flex-wrap gap-2">
//               {formData.amenities.map((amenity, index) => (
//                 <div
//                   key={index}
//                   className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
//                 >
//                   <span className="text-sm">{amenity}</span>
//                   <button
//                     type="button"
//                     onClick={() => removeAmenity(index)}
//                     className="text-blue-800 hover:text-blue-900"
//                   >
//                     <X className="h-3 w-3" />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Google Maps Link */}
//           <div className="mt-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Google Maps Link
//             </label>
//             <input
//               type="text"
//               value={formData.googleMapLink}
//               onChange={(e) => setFormData({...formData, googleMapLink: e.target.value})}
//               placeholder="https://maps.google.com/?q=..."
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
//             />
//           </div>

//           {/* Status Toggles */}
//           <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
//               <div>
//                 <div className="font-medium text-gray-900">Published</div>
//                 <div className="text-sm text-gray-600">Visible to users</div>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setFormData({...formData, published: !formData.published})}
//                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
//                   formData.published ? 'bg-green-500' : 'bg-gray-300'
//                 }`}
//               >
//                 <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                   formData.published ? 'translate-x-6' : 'translate-x-1'
//                 }`} />
//               </button>
//             </div>

//             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
//               <div>
//                 <div className="font-medium text-gray-900">Featured</div>
//                 <div className="text-sm text-gray-600">Show in featured</div>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setFormData({...formData, featured: !formData.featured})}
//                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
//                   formData.featured ? 'bg-orange-500' : 'bg-gray-300'
//                 }`}
//               >
//                 <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                   formData.featured ? 'translate-x-6' : 'translate-x-1'
//                 }`} />
//               </button>
//             </div>

//             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
//               <div>
//                 <div className="font-medium text-gray-900">Verified</div>
//                 <div className="text-sm text-gray-600">Verified badge</div>
//               </div>
//               <button
//                 type="button"
//                 onClick={() => setFormData({...formData, verified: !formData.verified})}
//                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
//                   formData.verified ? 'bg-blue-500' : 'bg-gray-300'
//                 }`}
//               >
//                 <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                   formData.verified ? 'translate-x-6' : 'translate-x-1'
//                 }`} />
//               </button>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
//               disabled={saving}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={saving}
//               className="px-6 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center gap-2"
//             >
//               {saving ? (
//                 <>
//                   <Loader2 className="h-5 w-5 animate-spin" />
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <Save className="h-5 w-5" />
//                   Save Changes
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// // ✅ Delete Confirmation Modal
// const DeleteModal = ({ onConfirm, onCancel }: { 
//   onConfirm: () => void;
//   onCancel: () => void;
// }) => (
//   <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
//     <div className="bg-white rounded-2xl p-8 w-full max-w-md">
//       <div className="text-center mb-6">
//         <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//           <AlertCircle className="h-8 w-8 text-red-600" />
//         </div>
//         <h3 className="text-xl font-bold text-gray-900 mb-2">
//           Delete Listing?
//         </h3>
//         <p className="text-gray-600">
//           This action cannot be undone. All data will be permanently removed.
//         </p>
//       </div>
      
//       <div className="flex items-center justify-center gap-4">
//         <button
//           onClick={onCancel}
//           className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
//         >
//           Cancel
//         </button>
//         <button
//           onClick={onConfirm}
//           className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
//         >
//           Delete Listing
//         </button>
//       </div>
//     </div>
//   </div>
// );

// // ✅ Quick Stats Component
// const StatsCard = ({ title, value, icon: Icon, color, trend }: any) => (
//   <div className="bg-white rounded-2xl p-6 border shadow-sm">
//     <div className="flex items-center justify-between mb-4">
//       <div className={`p-3 rounded-xl ${color}`}>
//         <Icon className="h-6 w-6 text-white" />
//       </div>
//       <div className="text-right">
//         <div className="text-2xl font-bold text-gray-900">{value}</div>
//         <div className="text-sm text-gray-600">{title}</div>
//       </div>
//     </div>
//     {trend && (
//       <div className={`text-sm ${trend.value > 0 ? 'text-green-600' : 'text-red-600'}`}>
//         {trend.value > 0 ? '↗' : '↘'} {trend.value}% from last month
//       </div>
//     )}
//   </div>
// );

// // ✅ Rating Stars Component
// const RatingStars = ({ rating, reviewCount, showCount = true, size = "sm" }: { 
//   rating: number; 
//   reviewCount: number; 
//   showCount?: boolean;
//   size?: "sm" | "md" | "lg";
// }) => {
//   const starSize = {
//     sm: "h-3 w-3",
//     md: "h-4 w-4",
//     lg: "h-5 w-5"
//   }[size];

//   return (
//     <div className="flex items-center gap-2">
//       <div className="flex items-center gap-0.5">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <Star
//             key={star}
//             className={`${starSize} ${
//               star <= Math.round(rating)
//                 ? 'text-yellow-400 fill-yellow-400'
//                 : 'text-gray-300'
//             }`}
//           />
//         ))}
//       </div>
//       <div className="flex items-center gap-2">
//         <span className={`font-medium ${
//           size === "sm" ? "text-sm" : 
//           size === "md" ? "text-base" : 
//           "text-lg"
//         } ${rating >= 4 ? 'text-green-600' : rating >= 3 ? 'text-yellow-600' : 'text-red-600'}`}>
//           {rating.toFixed(1)}
//         </span>
//         {showCount && reviewCount > 0 && (
//           <>
//             <span className="text-gray-400">•</span>
//             <span className={`${size === "sm" ? "text-xs" : "text-sm"} text-gray-500`}>
//               ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
//             </span>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// // ✅ Listing Card Component
// const ListingCard = ({ listing, onEdit, onDelete, onToggleStatus }: any) => {
//   const mainImage = listing.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image';
//   const navigate = useNavigate();

//   // Function to handle view details
//   const handleViewDetails = () => {
//     navigate(`/pg/${listing._id}`);
//   };

//   return (
//     <div className="bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
//       {/* Image */}
//       <div className="relative h-48 overflow-hidden">
//         <img
//           src={mainImage}
//           alt={listing.name}
//           className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
//           onError={(e) => {
//             (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+Error';
//           }}
//         />
//         <div className="absolute top-3 left-3 flex gap-2">
//           {listing.featured && (
//             <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-full">
//               Featured
//             </span>
//           )}
//           {listing.verified && (
//             <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
//               Verified
//             </span>
//           )}
//         </div>
//         <div className="absolute top-3 right-3">
//           <span className={`px-2 py-1 text-xs font-medium rounded-full ${
//             listing.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//           }`}>
//             {listing.published ? 'Published' : 'Draft'}
//           </span>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="p-5">
//         <div className="flex items-start justify-between mb-3">
//           <div>
//             <h3 className="font-bold text-gray-900 line-clamp-1">{listing.name}</h3>
//             <div className="flex items-center gap-2 mt-1">
//               <MapPin className="h-4 w-4 text-gray-400" />
//               <span className="text-sm text-gray-600">{listing.city}</span>
//               <span className="text-sm text-gray-400">•</span>
//               <span className="text-sm text-gray-600">{listing.locality}</span>
//             </div>
//           </div>
//           <div className="text-right">
//             <div className="text-xl font-bold text-orange-600">₹{listing.price}</div>
//             <div className="text-xs text-gray-500">per month</div>
//           </div>
//         </div>

//         {/* Rating Display */}
//         <div className="mb-3">
//           <RatingStars 
//             rating={listing.rating || 0} 
//             reviewCount={listing.reviewCount || 0} 
//             size="md"
//           />
//         </div>

//         <p className="text-gray-600 text-sm line-clamp-2 mb-4">
//           {listing.description}
//         </p>

//         {/* Amenities */}
//         <div className="flex flex-wrap gap-2 mb-4">
//           {listing.amenities?.slice(0, 3).map((amenity: string, index: number) => (
//             <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
//               {amenity}
//             </span>
//           ))}
//           {listing.amenities?.length > 3 && (
//             <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
//               +{listing.amenities.length - 3} more
//             </span>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-between pt-4 border-t">
//           <div className="flex items-center gap-4">
//             {/* View Button */}
//             <button
//               onClick={handleViewDetails}
//               className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
//               title="View Details"
//             >
//               <Eye className="h-4 w-4" />
//               <span className="text-xs font-medium">View</span>
//             </button>
            
//             {/* Status Toggle Buttons */}
//             <button
//               onClick={() => onToggleStatus(listing._id, 'published')}
//               className={`p-2 rounded-lg transition-colors ${
//                 listing.published 
//                   ? 'bg-green-100 text-green-700 hover:bg-green-200' 
//                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//               }`}
//               title={listing.published ? 'Unpublish' : 'Publish'}
//             >
//               {listing.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
//             </button>
//             <button
//               onClick={() => onToggleStatus(listing._id, 'featured')}
//               className={`p-2 rounded-lg transition-colors ${
//                 listing.featured 
//                   ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' 
//                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//               }`}
//               title={listing.featured ? 'Unfeature' : 'Feature'}
//             >
//               {listing.featured ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
//             </button>
//             <button
//               onClick={() => onToggleStatus(listing._id, 'verified')}
//               className={`p-2 rounded-lg transition-colors ${
//                 listing.verified 
//                   ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
//                   : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//               }`}
//               title={listing.verified ? 'Unverify' : 'Verify'}
//             >
//               <UserCheck className="h-4 w-4" />
//             </button>
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => onEdit(listing)}
//               className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
//               title="Edit"
//             >
//               <Edit className="h-4 w-4" />
//             </button>
//             <button
//               onClick={() => onDelete(listing._id)}
//               className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//               title="Delete"
//             >
//               <Trash2 className="h-4 w-4" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // ✅ Main Admin Component
// const AdminPGPortal = () => {
//   const navigate = useNavigate();
  
//   // State
//   const [listings, setListings] = useState<PGListing[]>([]);
//   const [filteredListings, setFilteredListings] = useState<PGListing[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
//   const [editingListing, setEditingListing] = useState<PGListing | null>(null);
//   const [deletingId, setDeletingId] = useState<string | null>(null);
//   const [actionLoading, setActionLoading] = useState(false);
  
//   // Filters
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterType, setFilterType] = useState('all');
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
//   const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'name' | 'rating'>('newest');

//   // Stats
//   const [stats, setStats] = useState({
//     total: 0,
//     published: 0,
//     draft: 0,
//     featured: 0,
//     verified: 0,
//     boys: 0,
//     girls: 0,
//     coed: 0,
//     family: 0,
//     avgRating: 0,
//     totalReviews: 0
//   });

//   // ✅ Fetch Listings
//   const fetchListings = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       console.log('🔍 Fetching listings from:', API_URL);
      
//       const response = await fetch(`${API_URL}/api/pg?admin=true`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}`);
//       }
      
//       const result = await response.json();
      
//       if (result.success && Array.isArray(result.data)) {
//         const listingsData = result.data;
//         setListings(listingsData);
//         setFilteredListings(listingsData);
//         setConnectionStatus('connected');
        
//         // Calculate stats
//         calculateStats(listingsData);
        
//         console.log(`✅ Loaded ${listingsData.length} listings`);
//       } else {
//         throw new Error('Invalid response format');
//       }
      
//     } catch (err: any) {
//       console.error('❌ Error:', err);
//       setError(`Failed to load listings: ${err.message}`);
//       setConnectionStatus('disconnected');
      
//       // Fallback mock data
//       const mockData = getMockData();
//       setListings(mockData);
//       setFilteredListings(mockData);
//       calculateStats(mockData);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Calculate stats
//   const calculateStats = (data: PGListing[]) => {
//     const totalRatings = data.reduce((sum, listing) => sum + (listing.rating || 0), 0);
//     const totalReviews = data.reduce((sum, listing) => sum + (listing.reviewCount || 0), 0);
    
//     setStats({
//       total: data.length,
//       published: data.filter(l => l.published).length,
//       draft: data.filter(l => !l.published).length,
//       featured: data.filter(l => l.featured).length,
//       verified: data.filter(l => l.verified).length,
//       boys: data.filter(l => l.type === 'boys').length,
//       girls: data.filter(l => l.type === 'girls').length,
//       coed: data.filter(l => l.type === 'co-ed').length,
//       family: data.filter(l => l.type === 'family').length,
//       avgRating: data.length > 0 ? totalRatings / data.length : 0,
//       totalReviews: totalReviews
//     });
//   };

//   // Mock data fallback
//   const getMockData = (): PGListing[] => [
//     {
//       _id: 'mock-1',
//       name: 'Sunshine Boys PG',
//       city: 'Chandigarh',
//       locality: 'Gate 1',
//       address: 'Gate 1, Chandigarh University Road',
//       price: 8500,
//       type: 'boys',
//       description: 'Premium boys PG with all modern amenities near CU Gate 1',
//       images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'],
//       gallery: [],
//       googleMapLink: '',
//       amenities: ['WiFi', 'AC', 'Meals', 'Parking', 'CCTV'],
//       roomTypes: ['Single', 'Double'],
//       distance: '500m from CU',
//       availability: 'available',
//       published: true,
//       verified: true,
//       featured: true,
//       rating: 4.5,
//       reviewCount: 42,
//       ownerName: 'Rajesh Kumar',
//       ownerPhone: '9876543210',
//       ownerEmail: 'rajesh@example.com',
//       ownerId: 'owner-1',
//       contactEmail: 'contact@example.com',
//       contactPhone: '9876543210',
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     },
//     {
//       _id: 'mock-2',
//       name: 'Girls Safe Haven PG',
//       city: 'Chandigarh',
//       locality: 'Library Road',
//       address: 'Near University Library, CU Campus',
//       price: 9500,
//       type: 'girls',
//       description: 'Secure and comfortable PG exclusively for girls with 24/7 security',
//       images: ['https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800'],
//       gallery: [],
//       googleMapLink: '',
//       amenities: ['WiFi', 'AC', 'Meals', 'Security', 'CCTV'],
//       roomTypes: ['Single', 'Double', 'Triple'],
//       distance: '300m from Library',
//       availability: 'available',
//       published: true,
//       verified: true,
//       featured: false,
//       rating: 4.8,
//       reviewCount: 36,
//       ownerName: 'Priya Sharma',
//       ownerPhone: '9876543211',
//       ownerEmail: 'priya@example.com',
//       ownerId: 'owner-2',
//       contactEmail: 'contact2@example.com',
//       contactPhone: '9876543211',
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     },
//     {
//       _id: 'mock-3',
//       name: 'Co-Ed Student Hub',
//       city: 'Chandigarh',
//       locality: 'Sports Complex',
//       address: 'Opposite CU Sports Complex',
//       price: 7500,
//       type: 'co-ed',
//       description: 'Co-ed PG perfect for students with study room and high-speed internet',
//       images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'],
//       gallery: [],
//       googleMapLink: '',
//       amenities: ['WiFi', 'Study Room', 'Library', 'Common Area'],
//       roomTypes: ['Single', 'Double'],
//       distance: '200m from Sports Complex',
//       availability: 'available',
//       published: false,
//       verified: false,
//       featured: false,
//       rating: 4.3,
//       reviewCount: 28,
//       ownerName: 'Amit Verma',
//       ownerPhone: '9876543212',
//       ownerEmail: 'amit@example.com',
//       ownerId: 'owner-3',
//       contactEmail: 'contact3@example.com',
//       contactPhone: '9876543212',
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     }
//   ];

//   // ✅ Apply Filters
//   useEffect(() => {
//     let filtered = [...listings];

//     // Search filter
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       filtered = filtered.filter(listing =>
//         listing.name.toLowerCase().includes(query) ||
//         listing.city.toLowerCase().includes(query) ||
//         listing.locality.toLowerCase().includes(query) ||
//         listing.description.toLowerCase().includes(query) ||
//         listing.ownerName.toLowerCase().includes(query)
//       );
//     }

//     // Type filter
//     if (filterType !== 'all') {
//       filtered = filtered.filter(listing => listing.type === filterType);
//     }

//     // Status filter
//     if (filterStatus !== 'all') {
//       filtered = filtered.filter(listing =>
//         filterStatus === 'published' ? listing.published : !listing.published
//       );
//     }

//     // Sort
//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case 'newest':
//           return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
//         case 'price-low':
//           return a.price - b.price;
//         case 'price-high':
//           return b.price - a.price;
//         case 'name':
//           return a.name.localeCompare(b.name);
//         case 'rating':
//           return (b.rating || 0) - (a.rating || 0);
//         default:
//           return 0;
//       }
//     });

//     setFilteredListings(filtered);
//   }, [listings, searchQuery, filterType, filterStatus, sortBy]);

//   // ✅ Initial Load
//   useEffect(() => {
//     fetchListings();
//   }, []);

//   // ✅ Handle Save Listing
//   const handleSaveListing = async (listingData: PGListing) => {
//     setActionLoading(true);
//     try {
//       const isNew = !listingData._id || listingData._id.startsWith('mock-');
//       const method = isNew ? 'POST' : 'PUT';
//       const url = isNew ? `${API_URL}/api/pg` : `${API_URL}/api/pg/${listingData._id}`;

//       console.log(`💾 ${method} ${url}`);

//       // For mock data (fallback)
//       if (connectionStatus === 'disconnected' || listingData._id.startsWith('mock-')) {
//         if (isNew) {
//           const newListing = {
//             ...listingData,
//             _id: `mock-${Date.now()}`,
//             createdAt: new Date().toISOString(),
//             updatedAt: new Date().toISOString(),
//           };
//           setListings(prev => [...prev, newListing as PGListing]);
//         } else {
//           setListings(prev => prev.map(l => 
//             l._id === listingData._id ? listingData : l
//           ));
//         }
//         alert('Listing saved successfully (using mock data)');
//         return;
//       }

//       // Real API call
//       const response = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(listingData)
//       });

//       const result = await response.json();

//       if (result.success) {
//         if (isNew) {
//           setListings(prev => [...prev, result.data]);
//         } else {
//           setListings(prev => prev.map(l => 
//             l._id === listingData._id ? result.data : l
//           ));
//         }
//         alert('Listing saved successfully!');
//       } else {
//         throw new Error(result.message || 'Failed to save');
//       }

//     } catch (error: any) {
//       console.error('❌ Save error:', error);
//       alert(`Error: ${error.message}`);
//     } finally {
//       setActionLoading(false);
//       setEditingListing(null);
//     }
//   };

//   // ✅ Handle Delete Listing
//   const handleDeleteListing = async (id: string) => {
//     setActionLoading(true);
//     try {
//       // For mock data
//       if (id.startsWith('mock-')) {
//         setListings(prev => prev.filter(l => l._id !== id));
//         alert('Listing deleted (using mock data)');
//         return;
//       }

//       // Real API call
//       const response = await fetch(`${API_URL}/api/pg/${id}`, {
//         method: 'DELETE'
//       });

//       const result = await response.json();

//       if (result.success) {
//         setListings(prev => prev.filter(l => l._id !== id));
//         alert('Listing deleted successfully!');
//       } else {
//         throw new Error(result.message || 'Failed to delete');
//       }

//     } catch (error: any) {
//       console.error('❌ Delete error:', error);
//       alert(`Error: ${error.message}`);
//     } finally {
//       setActionLoading(false);
//       setDeletingId(null);
//     }
//   };

//   // ✅ Handle Toggle Status
//   const handleToggleStatus = async (id: string, field: 'published' | 'featured' | 'verified') => {
//     try {
//       const listing = listings.find(l => l._id === id);
//       if (!listing) return;

//       const newValue = !listing[field];
      
//       // For mock data
//       if (id.startsWith('mock-')) {
//         setListings(prev => prev.map(l => 
//           l._id === id ? { ...l, [field]: newValue } : l
//         ));
//         return;
//       }

//       // Real API call
//       const response = await fetch(`${API_URL}/api/pg/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ [field]: newValue })
//       });

//       const result = await response.json();

//       if (result.success) {
//         setListings(prev => prev.map(l => 
//           l._id === id ? { ...l, [field]: newValue } : l
//         ));
//       } else {
//         throw new Error(result.message);
//       }

//     } catch (error: any) {
//       console.error(`❌ Toggle ${field} error:`, error);
//       alert(`Error: ${error.message}`);
//     }
//   };

//   // ✅ Add New Listing
//   const handleAddNew = () => {
//     const newListing: PGListing = {
//       _id: '',
//       name: 'New PG Listing',
//       city: 'Chandigarh',
//       locality: '',
//       address: '',
//       price: 5000,
//       type: 'boys',
//       description: 'Enter description here...',
//       images: [],
//       gallery: [],
//       googleMapLink: '',
//       amenities: ['WiFi', 'Power Backup'],
//       roomTypes: ['Single', 'Double'],
//       distance: '',
//       availability: 'available',
//       published: false,
//       verified: false,
//       featured: false,
//       rating: 4.0,
//       reviewCount: 0,
//       ownerName: 'Owner Name',
//       ownerPhone: '9876543210',
//       ownerEmail: 'owner@example.com',
//       ownerId: '',
//       contactEmail: '',
//       contactPhone: '',
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     };
//     setEditingListing(newListing);
//   };

//   // ✅ Export Data
//   const handleExport = () => {
//     const dataStr = JSON.stringify(listings, null, 2);
//     const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
//     const exportFileDefaultName = `pg-listings-${new Date().toISOString().split('T')[0]}.json`;
    
//     const linkElement = document.createElement('a');
//     linkElement.setAttribute('href', dataUri);
//     linkElement.setAttribute('download', exportFileDefaultName);
//     linkElement.click();
//   };

//   // ✅ Handle Refresh
//   const handleRefresh = () => {
//     fetchListings();
//   };

//   // ✅ Loading State
//   if (loading && listings.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <h2 className="text-xl font-semibold text-gray-900">Loading Admin Panel...</h2>
//           <p className="text-gray-600 mt-2">Please wait while we fetch your listings</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="p-2 bg-orange-100 rounded-xl">
//                 <Shield className="h-6 w-6 text-orange-600" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">PG Admin Portal</h1>
//                 <p className="text-sm text-gray-600">
//                   Manage all PG listings • {connectionStatus === 'connected' ? '🟢 Live' : '🟡 Offline'}
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={handleRefresh}
//                 disabled={actionLoading}
//                 className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-2"
//               >
//                 <RefreshCw className={`h-4 w-4 ${actionLoading ? 'animate-spin' : ''}`} />
//                 Refresh
//               </button>
//               <button
//                 onClick={handleExport}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
//               >
//                 <Download className="h-4 w-4" />
//                 Export
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="container mx-auto px-4 py-8">
//         {/* Connection Status */}
//         <div className="mb-8">
//           {connectionStatus === 'connected' ? (
//             <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-green-100 rounded-lg">
//                   <CheckCircle className="h-5 w-5 text-green-600" />
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="font-semibold text-green-700">✅ Connected to Backend</h3>
//                   <p className="text-green-600 text-sm">
//                     Real-time data sync with {API_URL}
//                   </p>
//                 </div>
//                 <div className="text-sm text-green-700 font-medium">
//                   {listings.length} listings loaded
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-orange-100 rounded-lg">
//                   <AlertCircle className="h-5 w-5 text-orange-600" />
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="font-semibold text-orange-700">⚠️ Using Mock Data</h3>
//                   <p className="text-orange-600 text-sm">
//                     Backend not connected. Working offline with sample data.
//                   </p>
//                 </div>
//                 <button
//                   onClick={handleRefresh}
//                   className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
//                 >
//                   Retry Connection
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
//           <StatsCard
//             title="Total Listings"
//             value={stats.total}
//             icon={Home}
//             color="bg-blue-500"
//           />
//           <StatsCard
//             title="Published"
//             value={stats.published}
//             icon={Eye}
//             color="bg-green-500"
//           />
//           <StatsCard
//             title="Featured"
//             value={stats.featured}
//             icon={Star}
//             color="bg-orange-500"
//           />
//           <StatsCard
//             title="Verified"
//             value={stats.verified}
//             icon={UserCheck}
//             color="bg-purple-500"
//           />
//           <StatsCard
//             title="Avg. Rating"
//             value={stats.avgRating.toFixed(1)}
//             icon={Star}
//             color="bg-yellow-500"
//           />
//           <StatsCard
//             title="Total Reviews"
//             value={stats.totalReviews}
//             icon={BarChart3}
//             color="bg-indigo-500"
//           />
//         </div>

//         {/* Action Bar */}
//         <div className="bg-white rounded-2xl border shadow-sm p-6 mb-8">
//           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
//             <div className="flex-1">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search by name, city, description, owner..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
//                 />
//               </div>
//             </div>
//             <div className="flex flex-wrap items-center gap-4">
//               <div className="flex items-center gap-2">
//                 <Filter className="h-5 w-5 text-gray-500" />
//                 <select
//                   value={filterType}
//                   onChange={(e) => setFilterType(e.target.value)}
//                   className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
//                 >
//                   <option value="all">All Types</option>
//                   <option value="boys">Boys PG</option>
//                   <option value="girls">Girls PG</option>
//                   <option value="co-ed">Co-ed PG</option>
//                   <option value="family">Family PG</option>
//                 </select>
//               </div>
//               <select
//                 value={filterStatus}
//                 onChange={(e) => setFilterStatus(e.target.value)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
//               >
//                 <option value="all">All Status</option>
//                 <option value="published">Published</option>
//                 <option value="draft">Draft</option>
//               </select>
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value as any)}
//                 className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
//               >
//                 <option value="newest">Newest First</option>
//                 <option value="price-low">Price: Low to High</option>
//                 <option value="price-high">Price: High to Low</option>
//                 <option value="name">Name A-Z</option>
//                 <option value="rating">Rating: High to Low</option>
//               </select>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => setViewMode('grid')}
//                   className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}
//                 >
//                   <div className="grid grid-cols-2 gap-1">
//                     {[1,2,3,4].map(i => <div key={i} className="w-2 h-2 bg-current"></div>)}
//                   </div>
//                 </button>
//                 <button
//                   onClick={() => setViewMode('list')}
//                   className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}
//                 >
//                   <div className="space-y-1">
//                     <div className="w-4 h-2 bg-current"></div>
//                     <div className="w-4 h-2 bg-current"></div>
//                   </div>
//                 </button>
//               </div>
//               <button
//                 onClick={handleAddNew}
//                 className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-orange-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
//               >
//                 <Plus className="h-5 w-5" />
//                 Add New PG
//               </button>
//             </div>
//           </div>

//           {/* Results Info */}
//           <div className="flex items-center justify-between mt-6 pt-6 border-t">
//             <div className="text-sm text-gray-600">
//               Showing <span className="font-semibold text-gray-900">{filteredListings.length}</span> of{' '}
//               <span className="font-semibold text-gray-900">{listings.length}</span> listings
//             </div>
//             <div className="flex items-center gap-4 text-sm">
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                 <span className="text-gray-600">Published</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
//                 <span className="text-gray-600">Featured</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
//                 <span className="text-gray-600">Verified</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Error Display */}
//         {error && (
//           <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
//             <div className="flex items-center gap-3">
//               <AlertCircle className="h-5 w-5 text-red-600" />
//               <div>
//                 <p className="text-red-700 font-medium">Error</p>
//                 <p className="text-red-600 text-sm">{error}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Listings Grid */}
//         {filteredListings.length === 0 ? (
//           <div className="bg-white rounded-2xl border shadow-sm p-12 text-center">
//             <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Search className="h-10 w-10 text-gray-400" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">No Listings Found</h3>
//             <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
//             <button
//               onClick={handleAddNew}
//               className="px-6 py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors"
//             >
//               Create Your First Listing
//             </button>
//           </div>
//         ) : viewMode === 'grid' ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredListings.map((listing) => (
//               <ListingCard
//                 key={listing._id}
//                 listing={listing}
//                 onEdit={setEditingListing}
//                 onDelete={setDeletingId}
//                 onToggleStatus={handleToggleStatus}
//               />
//             ))}
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {filteredListings.map((listing) => (
//               <div key={listing._id} className="bg-white rounded-2xl border shadow-sm p-6">
//                 <div className="flex items-start gap-4">
//                   <img
//                     src={listing.images[0] || 'https://via.placeholder.com/100'}
//                     alt={listing.name}
//                     className="w-24 h-24 object-cover rounded-xl"
//                   />
//                   <div className="flex-1">
//                     <div className="flex items-start justify-between">
//                       <div>
//                         <h3 className="font-bold text-gray-900">{listing.name}</h3>
//                         <div className="flex items-center gap-3 mt-1">
//                           <span className="text-sm text-gray-600">{listing.city}, {listing.locality}</span>
//                           <span className="text-gray-400">•</span>
//                           <span className="text-sm text-gray-600">{listing.type}</span>
//                           <span className="text-gray-400">•</span>
//                           <span className="text-sm font-medium text-orange-600">₹{listing.price}/month</span>
//                         </div>
//                         <div className="mt-2">
//                           <RatingStars 
//                             rating={listing.rating || 0} 
//                             reviewCount={listing.reviewCount || 0} 
//                             size="sm"
//                           />
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => navigate(`/pg/${listing._id}`)}
//                           className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2 text-sm"
//                         >
//                           <Eye className="h-3 w-3" />
//                           View
//                         </button>
//                         <button
//                           onClick={() => setEditingListing(listing)}
//                           className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
//                         >
//                           <Edit className="h-4 w-4" />
//                         </button>
//                         <button
//                           onClick={() => setDeletingId(listing._id)}
//                           className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </button>
//                       </div>
//                     </div>
//                     <p className="text-gray-600 text-sm mt-3 line-clamp-2">
//                       {listing.description}
//                     </p>
//                     <div className="flex flex-wrap gap-2 mt-3">
//                       {listing.amenities?.slice(0, 5).map((amenity: string, index: number) => (
//                         <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
//                           {amenity}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Footer Info */}
//         <div className="mt-8 text-center text-sm text-gray-500">
//           <p>© {new Date().getFullYear()} PG Finder Admin • v2.0.0</p>
//           <p className="mt-1">Average Rating: {stats.avgRating.toFixed(1)} • Total Reviews: {stats.totalReviews}</p>
//         </div>
//       </main>

//       {/* Edit Modal */}
//       {editingListing && (
//         <EditModal
//           listing={editingListing}
//           onClose={() => setEditingListing(null)}
//           onSave={handleSaveListing}
//         />
//       )}

//       {/* Delete Modal */}
//       {deletingId && (
//         <DeleteModal
//           onConfirm={() => handleDeleteListing(deletingId)}
//           onCancel={() => setDeletingId(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default AdminPGPortal; 















import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, AlertCircle, CheckCircle, RefreshCw, Trash2, Edit, 
  Eye, EyeOff, Star, StarOff, UserCheck, Search, Filter, 
  Plus, Download, Upload, BarChart3, Users, Home, Settings,
  ChevronRight, ChevronLeft, X, Save, Loader2, MapPin,
  Phone, Mail, Calendar, Check, XCircle, ExternalLink,
  Database, Wifi, WifiOff, TrendingUp, DollarSign, MessageSquare,
  Heart, Building, Key, Bed, Bath, Users as UsersIcon, Cloud,
  Clock, Globe, ShieldCheck, ChevronDown, ChevronUp, Activity,
  Server, Cpu, HardDrive, Network, Bell, BellOff, Zap,
  TrendingDown, Percent, Target, Award, Crown, Medal,
  Package, Truck, ShoppingCart, CreditCard, Wallet,
  FileText, Clipboard, CheckSquare, Square, Filter as FilterIcon,
  Grid, List, MoreVertical, Menu, LogOut, User, HelpCircle,
  Info, AlertTriangle, Coffee, Moon, Sun, Settings as SettingsIcon
} from 'lucide-react';
import { toast } from 'sonner';

// ✅ Backend URL - आपका deployed backend
const API_URL = 'https://eassy-to-rent-backend.onrender.com/api';

// ✅ PG Listing Interface
interface PGListing {
  _id: string;
  name: string;
  city: string;
  locality: string;
  address: string;
  price: number;
  type: 'boys' | 'girls' | 'co-ed' | 'family';
  description: string;
  images: string[];
  gallery: string[];
  googleMapLink: string;
  amenities: string[];
  roomTypes: string[];
  distance: string;
  availability: 'available' | 'sold-out' | 'coming-soon';
  published: boolean;
  verified: boolean;
  featured: boolean;
  rating: number;
  reviewCount: number;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  ownerId: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
  updatedAt: string;
}

// ✅ Server Status Interface
interface ServerStatus {
  status: 'online' | 'offline' | 'checking';
  uptime: string;
  responseTime: number;
  lastChecked: string;
  database: 'connected' | 'disconnected';
  apiVersion: string;
}

// ✅ Toggle Switch Component
const ToggleSwitch = ({ label, description, enabled, onChange, color, icon: Icon }: any) => {
  const colors = {
    green: { bg: 'bg-green-500', ring: 'ring-green-200', text: 'text-green-600' },
    orange: { bg: 'bg-orange-500', ring: 'ring-orange-200', text: 'text-orange-600' },
    blue: { bg: 'bg-blue-500', ring: 'ring-blue-200', text: 'text-blue-600' },
    purple: { bg: 'bg-purple-500', ring: 'ring-purple-200', text: 'text-purple-600' }
  };

  const colorSet = colors[color as keyof typeof colors] || colors.blue;

  return (
    <div className={`p-4 rounded-xl border ${enabled ? colorSet.ring + ' ring-2' : 'border-gray-200'} bg-white`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${enabled ? colorSet.text : 'text-gray-400'}`} />
          <span className={`font-medium ${enabled ? colorSet.text : 'text-gray-700'}`}>
            {label}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onChange(!enabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${enabled ? colorSet.bg : 'bg-gray-300'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
};

// ✅ Image Icon Component
const ImageIcon = (props: any) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

// ✅ Pie Chart Icon Component
const PieChartIcon = (props: any) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
  </svg>
);

// ✅ Edit Modal Component
const EditModal = ({ listing, onClose, onSave }: { 
  listing: PGListing; 
  onClose: () => void;
  onSave: (data: PGListing) => void;
}) => {
  const [formData, setFormData] = useState(listing);
  const [saving, setSaving] = useState(false);
  const [newImage, setNewImage] = useState('');
  const [newAmenity, setNewAmenity] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save listing');
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
      toast.success('Image added');
    }
  };

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, newAmenity.trim()]
      });
      setNewAmenity('');
      toast.success('Amenity added');
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
    toast.info('Image removed');
  };

  const removeAmenity = (index: number) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter((_, i) => i !== index)
    });
    toast.info('Amenity removed');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b z-10 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {listing._id ? 'Edit' : 'Create'} PG Listing
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {listing._id ? `ID: ${listing._id}` : 'Create a new PG listing'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-2xl">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  Basic Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PG Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      placeholder="Enter PG name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Locality
                      </label>
                      <input
                        type="text"
                        value={formData.locality}
                        onChange={(e) => setFormData({...formData, locality: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder="e.g., Gate 1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (₹/month) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          required
                          min="0"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type *
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
                      >
                        <option value="boys">Boys PG</option>
                        <option value="girls">Girls PG</option>
                        <option value="co-ed">Co-ed PG</option>
                        <option value="family">Family PG</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Distance from CU
                    </label>
                    <input
                      type="text"
                      value={formData.distance}
                      onChange={(e) => setFormData({...formData, distance: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="e.g., 500m from CU"
                    />
                  </div>
                </div>
              </div>

              {/* Owner Information */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-2xl">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-green-600" />
                  Owner Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Owner Name *
                    </label>
                    <input
                      type="text"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Owner Phone *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">📱</span>
                        <input
                          type="text"
                          value={formData.ownerPhone}
                          onChange={(e) => setFormData({...formData, ownerPhone: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                          required
                          placeholder="9315058665"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Phone *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">📞</span>
                        <input
                          type="text"
                          value={formData.contactPhone || '9315058665'}
                          onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Owner Email
                    </label>
                    <input
                      type="email"
                      value={formData.ownerEmail}
                      onChange={(e) => setFormData({...formData, ownerEmail: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                      placeholder="owner@example.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Description */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-2xl">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  Description
                </h3>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
                  placeholder="Describe the PG features, facilities, and nearby attractions..."
                  required
                />
              </div>

              {/* Images */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-5 rounded-2xl">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-orange-600" />
                  Images & Gallery
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      placeholder="Enter image URL (Unsplash, Cloudinary, etc.)"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={addImage}
                      className="px-4 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={img}
                          alt={`Image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Image+Error';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          Click to remove
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="bg-gradient-to-br from-cyan-50 to-teal-50 p-5 rounded-2xl">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-cyan-600" />
                  Amenities
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newAmenity}
                      onChange={(e) => setNewAmenity(e.target.value)}
                      placeholder="Enter amenity (WiFi, AC, Meals, etc.)"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={addAmenity}
                      className="px-4 py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors font-medium flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-2 bg-white border border-cyan-200 text-cyan-800 rounded-full shadow-sm"
                      >
                        <CheckCircle className="h-4 w-4 text-cyan-600" />
                        <span className="text-sm font-medium">{amenity}</span>
                        <button
                          type="button"
                          onClick={() => removeAmenity(index)}
                          className="text-cyan-600 hover:text-cyan-800 p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Toggles */}
              <div className="bg-gradient-to-br from-gray-50 to-slate-100 p-5 rounded-2xl">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-600" />
                  Listing Status
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <ToggleSwitch
                    label="Published"
                    description="Visible to users"
                    enabled={formData.published}
                    onChange={(enabled) => setFormData({...formData, published: enabled})}
                    color="green"
                    icon={Eye}
                  />
                  <ToggleSwitch
                    label="Featured"
                    description="Show in featured"
                    enabled={formData.featured}
                    onChange={(enabled) => setFormData({...formData, featured: enabled})}
                    color="orange"
                    icon={Star}
                  />
                  <ToggleSwitch
                    label="Verified"
                    description="Verified badge"
                    enabled={formData.verified}
                    onChange={(enabled) => setFormData({...formData, verified: enabled})}
                    color="blue"
                    icon={ShieldCheck}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="sticky bottom-0 bg-white border-t mt-8 p-6 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all hover:border-gray-400"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-3"
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
        </form>
      </div>
    </div>
  );
};

// ✅ Delete Modal Component
const DeleteModal = ({ onConfirm, onCancel, listingName }: { 
  onConfirm: () => void;
  onCancel: () => void;
  listingName: string;
}) => (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl p-8 w-full max-w-md">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="h-10 w-10 text-red-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Delete Listing?
        </h3>
        <div className="bg-red-50 p-4 rounded-lg mb-4">
          <p className="text-red-700 font-medium">{listingName}</p>
        </div>
        <p className="text-gray-600">
          This action cannot be undone. All data will be permanently removed from the database.
        </p>
      </div>
      
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={onCancel}
          className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all hover:border-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-rose-700 transition-all shadow-lg hover:shadow-xl"
        >
          Delete Forever
        </button>
      </div>
    </div>
  </div>
);

// ✅ Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color, trend, description }: any) => {
  const colors = {
    blue: { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-100' },
    green: { bg: 'bg-green-500', text: 'text-green-600', light: 'bg-green-100' },
    orange: { bg: 'bg-orange-500', text: 'text-orange-600', light: 'bg-orange-100' },
    purple: { bg: 'bg-purple-500', text: 'text-purple-600', light: 'bg-purple-100' },
    red: { bg: 'bg-red-500', text: 'text-red-600', light: 'bg-red-100' },
    indigo: { bg: 'bg-indigo-500', text: 'text-indigo-600', light: 'bg-indigo-100' }
  };

  const colorSet = colors[color as keyof typeof colors] || colors.blue;

  return (
    <div className="bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorSet.light}`}>
          <Icon className={`h-6 w-6 ${colorSet.text}`} />
        </div>
        {trend && (
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="mb-2">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-600">{title}</div>
      </div>
      {description && (
        <div className="text-xs text-gray-500 mt-2">{description}</div>
      )}
    </div>
  );
};

// ✅ Listing Card Component
const ListingCard = ({ listing, onEdit, onDelete, onToggleStatus }: any) => {
  const mainImage = listing.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80';
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/pg/${listing._id}`);
  };

  return (
    <div className="group bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image with Status Badges */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={mainImage}
          alt={listing.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80';
          }}
        />
        
        {/* Status Overlay */}
        <div className="absolute top-3 left-3 flex gap-2">
          {listing.featured && (
            <span className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
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
        
        {/* Type Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1.5 text-xs font-bold rounded-full shadow-lg ${
            listing.type === 'boys' ? 'bg-blue-100 text-blue-800' :
            listing.type === 'girls' ? 'bg-pink-100 text-pink-800' :
            listing.type === 'co-ed' ? 'bg-purple-100 text-purple-800' :
            'bg-green-100 text-green-800'
          }`}>
            {listing.type === 'co-ed' ? 'Co-Ed' : listing.type} PG
          </span>
        </div>
        
        {/* Published Status */}
        <div className="absolute bottom-3 left-3">
          <span className={`px-3 py-1.5 text-xs font-bold rounded-full shadow ${
            listing.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {listing.published ? '✅ Published' : '⏸️ Draft'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">
              {listing.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{listing.city}</span>
              {listing.locality && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600">{listing.locality}</span>
                </>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-600">₹{listing.price.toLocaleString()}</div>
            <div className="text-xs text-gray-500">per month</div>
          </div>
        </div>

        {/* Rating */}
        <div className="mb-3 flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= Math.round(listing.rating || 0)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-gray-900">{listing.rating?.toFixed(1) || '0.0'}</span>
          <span className="text-gray-400">•</span>
          <span className="text-sm text-gray-500">
            ({listing.reviewCount || 0} {listing.reviewCount === 1 ? 'review' : 'reviews'})
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {listing.description || 'No description available'}
        </p>

        {/* Amenities Preview */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {listing.amenities?.slice(0, 4).map((amenity: string, index: number) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
              {amenity}
            </span>
          ))}
          {listing.amenities?.length > 4 && (
            <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-md">
              +{listing.amenities.length - 4} more
            </span>
          )}
        </div>

        {/* Contact Info */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <User className="h-3 w-3 text-gray-500" />
              <span className="text-gray-700">{listing.ownerName || 'Owner'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3 text-gray-500" />
              <span className="text-gray-700 font-medium">{listing.ownerPhone || listing.contactPhone || '9315058665'}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            {/* View Button */}
            <button
              onClick={handleViewDetails}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all duration-200 flex items-center gap-2 font-medium text-sm"
              title="View Public Page"
            >
              <Eye className="h-4 w-4" />
              View
            </button>
            
            {/* Status Toggles */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onToggleStatus(listing._id, 'published')}
                className={`p-2 rounded-lg transition-all ${listing.published ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                title={listing.published ? 'Unpublish' : 'Publish'}
              >
                {listing.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <button
                onClick={() => onToggleStatus(listing._id, 'featured')}
                className={`p-2 rounded-lg transition-all ${listing.featured ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                title={listing.featured ? 'Unfeature' : 'Feature'}
              >
                {listing.featured ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
              </button>
              <button
                onClick={() => onToggleStatus(listing._id, 'verified')}
                className={`p-2 rounded-lg transition-all ${listing.verified ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                title={listing.verified ? 'Unverify' : 'Verify'}
              >
                <ShieldCheck className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Edit & Delete */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(listing)}
              className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
              title="Edit Listing"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(listing._id, listing.name)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="Delete Listing"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ Server Status Component
const ServerStatusCard = ({ status }: { status: ServerStatus }) => {
  const getStatusColor = () => {
    switch (status.status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const getStatusText = () => {
    switch (status.status) {
      case 'online': return '🟢 Online';
      case 'offline': return '🔴 Offline';
      default: return '🟡 Checking...';
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-gray-900 text-white rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/10 rounded-xl">
            <Server className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Server Status</h3>
            <p className="text-sm text-gray-300">Real-time backend monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full animate-pulse ${getStatusColor()}`}></div>
          <span className="font-medium">{getStatusText()}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 p-4 rounded-xl">
          <div className="text-sm text-gray-400">API Response</div>
          <div className="text-2xl font-bold mt-1">
            {status.responseTime}ms
          </div>
        </div>
        <div className="bg-white/5 p-4 rounded-xl">
          <div className="text-sm text-gray-400">Database</div>
          <div className={`text-2xl font-bold mt-1 ${status.database === 'connected' ? 'text-green-400' : 'text-red-400'}`}>
            {status.database === 'connected' ? '✅ Connected' : '❌ Disconnected'}
          </div>
        </div>
        <div className="bg-white/5 p-4 rounded-xl">
          <div className="text-sm text-gray-400">Uptime</div>
          <div className="text-2xl font-bold mt-1">{status.uptime}</div>
        </div>
        <div className="bg-white/5 p-4 rounded-xl">
          <div className="text-sm text-gray-400">API Version</div>
          <div className="text-2xl font-bold mt-1">v{status.apiVersion}</div>
        </div>
      </div>
    </div>
  );
};

// ✅ Main Admin Component
const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // State
  const [listings, setListings] = useState<PGListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<PGListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState<ServerStatus>({
    status: 'checking',
    uptime: '0s',
    responseTime: 0,
    lastChecked: new Date().toISOString(),
    database: 'disconnected',
    apiVersion: '2.0.0'
  });
  
  // UI State
  const [editingListing, setEditingListing] = useState<PGListing | null>(null);
  const [deletingInfo, setDeletingInfo] = useState<{id: string, name: string} | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high' | 'name' | 'rating'>('newest');
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    featured: 0,
    verified: 0,
    boys: 0,
    girls: 0,
    coed: 0,
    family: 0,
    avgRating: 0,
    totalReviews: 0,
    avgPrice: 0,
    totalValue: 0
  });

  // ✅ Check Server Status
  const checkServerStatus = async () => {
    const startTime = performance.now();
    try {
      const response = await fetch(`${API_URL}/test`);
      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);
      
      const result = await response.json();
      
      setServerStatus({
        status: 'online',
        uptime: result.data?.serverTime ? 'Active' : 'Unknown',
        responseTime,
        lastChecked: new Date().toISOString(),
        database: result.data?.database?.includes('Connected') ? 'connected' : 'disconnected',
        apiVersion: '2.0.0'
      });
      
      return true;
    } catch (error) {
      setServerStatus({
        ...serverStatus,
        status: 'offline',
        responseTime: 0,
        lastChecked: new Date().toISOString()
      });
      return false;
    }
  };

  // ✅ Fetch Listings
  const fetchListings = async () => {
    try {
      setLoading(true);
      setError('');
      
      // First check server status
      const isServerOnline = await checkServerStatus();
      
      if (!isServerOnline) {
        throw new Error('Server is offline. Using mock data.');
      }

      console.log('🔍 Fetching listings from:', API_URL);
      
      const response = await fetch(`${API_URL}/pg?admin=true`, {
        headers: {
          'Origin': window.location.origin,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'API request failed');
      }
      
      const listingsData = Array.isArray(result.data) ? result.data : [];
      console.log(`✅ Loaded ${listingsData.length} listings from backend`);
      
      setListings(listingsData);
      setFilteredListings(listingsData);
      calculateStats(listingsData);
      
      toast.success(`✅ Successfully loaded ${listingsData.length} listings`);
      
    } catch (err: any) {
      console.error('❌ Fetch error:', err);
      setError(err.message || 'Failed to connect to backend');
      
      // Load mock data
      const mockData = getMockData();
      setListings(mockData);
      setFilteredListings(mockData);
      calculateStats(mockData);
      
      toast.warning('⚠️ Using mock data. Backend connection failed.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Calculate Stats
  const calculateStats = (data: PGListing[]) => {
    const total = data.length;
    const published = data.filter(l => l.published).length;
    const draft = total - published;
    const featured = data.filter(l => l.featured).length;
    const verified = data.filter(l => l.verified).length;
    const boys = data.filter(l => l.type === 'boys').length;
    const girls = data.filter(l => l.type === 'girls').length;
    const coed = data.filter(l => l.type === 'co-ed').length;
    const family = data.filter(l => l.type === 'family').length;
    
    const totalRatings = data.reduce((sum, listing) => sum + (listing.rating || 0), 0);
    const totalReviews = data.reduce((sum, listing) => sum + (listing.reviewCount || 0), 0);
    const totalPrice = data.reduce((sum, listing) => sum + (listing.price || 0), 0);
    
    setStats({
      total,
      published,
      draft,
      featured,
      verified,
      boys,
      girls,
      coed,
      family,
      avgRating: total > 0 ? totalRatings / total : 0,
      totalReviews,
      avgPrice: total > 0 ? Math.round(totalPrice / total) : 0,
      totalValue: totalPrice
    });
  };

  // ✅ Mock Data
  const getMockData = (): PGListing[] => [
    {
      _id: 'mock-1',
      name: 'Sunshine Boys PG',
      city: 'Chandigarh',
      locality: 'Gate 1',
      address: 'Gate 1, Chandigarh University Road',
      price: 8500,
      type: 'boys',
      description: 'Premium boys PG with all modern amenities near CU Gate 1. AC rooms, WiFi, meals included.',
      images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'],
      gallery: [],
      googleMapLink: '',
      amenities: ['WiFi', 'AC', 'Meals', 'Parking', 'CCTV', 'Laundry', 'Power Backup'],
      roomTypes: ['Single', 'Double', 'Triple'],
      distance: '500m from CU',
      availability: 'available',
      published: true,
      verified: true,
      featured: true,
      rating: 4.5,
      reviewCount: 42,
      ownerName: 'Rajesh Kumar',
      ownerPhone: '9315058665',
      contactPhone: '9315058665',
      ownerEmail: 'rajesh@pgfinder.com',
      ownerId: 'owner-1',
      contactEmail: 'contact@sunshinepg.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'mock-2',
      name: 'Girls Safe Haven PG',
      city: 'Chandigarh',
      locality: 'Library Road',
      address: 'Near University Library, CU Campus',
      price: 9500,
      type: 'girls',
      description: 'Secure and comfortable PG exclusively for girls with 24/7 security and CCTV surveillance.',
      images: ['https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800'],
      gallery: [],
      googleMapLink: '',
      amenities: ['WiFi', 'AC', 'Meals', 'Security', 'CCTV', 'Hot Water', 'Study Room'],
      roomTypes: ['Single', 'Double'],
      distance: '300m from Library',
      availability: 'available',
      published: true,
      verified: true,
      featured: false,
      rating: 4.8,
      reviewCount: 36,
      ownerName: 'Priya Sharma',
      ownerPhone: '9315058665',
      contactPhone: '9315058665',
      ownerEmail: 'priya@pgfinder.com',
      ownerId: 'owner-2',
      contactEmail: 'contact@girlshaven.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'mock-3',
      name: 'Co-Ed Student Hub',
      city: 'Chandigarh',
      locality: 'Sports Complex',
      address: 'Opposite CU Sports Complex',
      price: 7500,
      type: 'co-ed',
      description: 'Co-ed PG perfect for students with study room, high-speed internet, and common areas.',
      images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'],
      gallery: [],
      googleMapLink: '',
      amenities: ['WiFi', 'Study Room', 'Library', 'Common Area', 'Laundry', 'Parking'],
      roomTypes: ['Single', 'Double', 'Shared'],
      distance: '200m from Sports Complex',
      availability: 'available',
      published: false,
      verified: false,
      featured: false,
      rating: 4.3,
      reviewCount: 28,
      ownerName: 'Amit Verma',
      ownerPhone: '9315058665',
      contactPhone: '9315058665',
      ownerEmail: 'amit@pgfinder.com',
      ownerId: 'owner-3',
      contactEmail: 'contact@studenthub.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'mock-4',
      name: 'Royal Boys PG Luxury',
      city: 'Chandigarh',
      locality: 'Sector 15',
      address: 'Sector 15 Market, Chandigarh',
      price: 12000,
      type: 'boys',
      description: 'Luxury PG with gym, swimming pool, AC rooms, and premium facilities for boys.',
      images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'],
      gallery: [],
      googleMapLink: '',
      amenities: ['WiFi', 'AC', 'Gym', 'Swimming Pool', 'Meals', 'Parking', 'CCTV', 'Laundry', 'Entertainment'],
      roomTypes: ['Single', 'Double Deluxe'],
      distance: '1km from CU',
      availability: 'available',
      published: true,
      verified: true,
      featured: true,
      rating: 4.9,
      reviewCount: 58,
      ownerName: 'Vikram Singh',
      ownerPhone: '9315058665',
      contactPhone: '9315058665',
      ownerEmail: 'vikram@pgfinder.com',
      ownerId: 'owner-4',
      contactEmail: 'contact@royalpg.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'mock-5',
      name: 'Girls Paradise PG',
      city: 'Mohali',
      locality: 'Phase 7',
      address: 'Near CU Campus, Mohali',
      price: 9000,
      type: 'girls',
      description: 'Exclusive girls PG with home-like environment, garden, and recreational facilities.',
      images: ['https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=800'],
      gallery: [],
      googleMapLink: '',
      amenities: ['WiFi', 'AC', 'Meals', 'Garden', 'TV Room', 'Hot Water', 'Study Room', 'CCTV'],
      roomTypes: ['Single', 'Double', 'Triple'],
      distance: '800m from CU',
      availability: 'available',
      published: true,
      verified: true,
      featured: true,
      rating: 4.7,
      reviewCount: 45,
      ownerName: 'Neha Gupta',
      ownerPhone: '9315058665',
      contactPhone: '9315058665',
      ownerEmail: 'neha@pgfinder.com',
      ownerId: 'owner-5',
      contactEmail: 'contact@girlsparadise.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'mock-6',
      name: 'Family PG Residence',
      city: 'Chandigarh',
      locality: 'Sector 14',
      address: 'Sector 14, Chandigarh',
      price: 15000,
      type: 'family',
      description: 'Spacious family accommodation with separate kitchen, living room, and all amenities.',
      images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
      gallery: [],
      googleMapLink: '',
      amenities: ['WiFi', 'AC', 'Kitchen', 'Parking', 'CCTV', 'Power Backup', 'Furnished', 'Security'],
      roomTypes: ['2BHK', '3BHK'],
      distance: '2km from CU',
      availability: 'available',
      published: true,
      verified: false,
      featured: false,
      rating: 4.6,
      reviewCount: 32,
      ownerName: 'Rahul Mehta',
      ownerPhone: '9315058665',
      contactPhone: '9315058665',
      ownerEmail: 'rahul@pgfinder.com',
      ownerId: 'owner-6',
      contactEmail: 'contact@familyresidence.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  // ✅ Apply Filters
  useEffect(() => {
    let filtered = [...listings];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(listing =>
        listing.name.toLowerCase().includes(query) ||
        listing.city.toLowerCase().includes(query) ||
        listing.locality.toLowerCase().includes(query) ||
        listing.description.toLowerCase().includes(query) ||
        listing.ownerName.toLowerCase().includes(query) ||
        listing.amenities.some(a => a.toLowerCase().includes(query))
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(listing => listing.type === filterType);
    }

    // Status filter
    if (filterStatus !== 'all') {
      if (filterStatus === 'published') {
        filtered = filtered.filter(listing => listing.published);
      } else if (filterStatus === 'draft') {
        filtered = filtered.filter(listing => !listing.published);
      } else if (filterStatus === 'featured') {
        filtered = filtered.filter(listing => listing.featured);
      } else if (filterStatus === 'verified') {
        filtered = filtered.filter(listing => listing.verified);
      }
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    setFilteredListings(filtered);
  }, [listings, searchQuery, filterType, filterStatus, sortBy]);

  // ✅ Initial Load
  useEffect(() => {
    fetchListings();
    
    // Refresh server status every 30 seconds
    const interval = setInterval(checkServerStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Handle Save Listing
  const handleSaveListing = async (listingData: PGListing) => {
    setActionLoading(true);
    try {
      const isNew = !listingData._id || listingData._id.startsWith('mock-');
      const method = isNew ? 'POST' : 'PUT';
      const url = isNew ? `${API_URL}/pg` : `${API_URL}/pg/${listingData._id}`;

      console.log(`💾 ${method} ${url}`);

      // For mock data (fallback)
      if (serverStatus.status === 'offline' || listingData._id.startsWith('mock-')) {
        if (isNew) {
          const newListing = {
            ...listingData,
            _id: `mock-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setListings(prev => [...prev, newListing as PGListing]);
          toast.success('✅ Listing created (using mock data)');
        } else {
          setListings(prev => prev.map(l => 
            l._id === listingData._id ? listingData : l
          ));
          toast.success('✅ Listing updated (using mock data)');
        }
        calculateStats([...listings, listingData]);
        return;
      }

      // Real API call
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        },
        body: JSON.stringify(listingData)
      });

      const result = await response.json();

      if (result.success) {
        if (isNew) {
          setListings(prev => [...prev, result.data]);
          toast.success('✅ New listing created successfully!');
        } else {
          setListings(prev => prev.map(l => 
            l._id === listingData._id ? result.data : l
          ));
          toast.success('✅ Listing updated successfully!');
        }
        calculateStats(listings);
      } else {
        throw new Error(result.message || 'Failed to save');
      }

    } catch (error: any) {
      console.error('❌ Save error:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setActionLoading(false);
      setEditingListing(null);
    }
  };

  // ✅ Handle Delete Listing
  const handleDeleteListing = async (id: string) => {
    if (!deletingInfo) return;
    
    setActionLoading(true);
    try {
      // For mock data
      if (id.startsWith('mock-')) {
        setListings(prev => prev.filter(l => l._id !== id));
        toast.success('🗑️ Listing deleted (using mock data)');
        return;
      }

      // Real API call
      const response = await fetch(`${API_URL}/pg/${id}`, {
        method: 'DELETE',
        headers: {
          'Origin': window.location.origin
        }
      });

      const result = await response.json();

      if (result.success) {
        setListings(prev => prev.filter(l => l._id !== id));
        toast.success('🗑️ Listing deleted successfully!');
      } else {
        throw new Error(result.message || 'Failed to delete');
      }

    } catch (error: any) {
      console.error('❌ Delete error:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setActionLoading(false);
      setDeletingInfo(null);
    }
  };

  // ✅ Handle Toggle Status
  const handleToggleStatus = async (id: string, field: 'published' | 'featured' | 'verified') => {
    try {
      const listing = listings.find(l => l._id === id);
      if (!listing) return;

      const newValue = !listing[field];
      
      // For mock data
      if (id.startsWith('mock-')) {
        setListings(prev => prev.map(l => 
          l._id === id ? { ...l, [field]: newValue } : l
        ));
        toast.success(`✅ ${field} status updated`);
        return;
      }

      // Real API call
      const response = await fetch(`${API_URL}/pg/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        },
        body: JSON.stringify({ [field]: newValue })
      });

      const result = await response.json();

      if (result.success) {
        setListings(prev => prev.map(l => 
          l._id === id ? { ...l, [field]: newValue } : l
        ));
        toast.success(`✅ ${field.charAt(0).toUpperCase() + field.slice(1)} status updated`);
      } else {
        throw new Error(result.message);
      }

    } catch (error: any) {
      console.error(`❌ Toggle ${field} error:`, error);
      toast.error(`Error: ${error.message}`);
    }
  };

  // ✅ Handle Add New
  const handleAddNew = () => {
    const newListing: PGListing = {
      _id: '',
      name: 'New PG Listing',
      city: 'Chandigarh',
      locality: '',
      address: '',
      price: 5000,
      type: 'boys',
      description: 'Enter description for this PG...',
      images: [],
      gallery: [],
      googleMapLink: '',
      amenities: ['WiFi', 'Power Backup'],
      roomTypes: ['Single', 'Double'],
      distance: '',
      availability: 'available',
      published: false,
      verified: false,
      featured: false,
      rating: 0,
      reviewCount: 0,
      ownerName: 'Owner Name',
      ownerPhone: '9315058665',
      contactPhone: '9315058665',
      ownerEmail: '',
      ownerId: '',
      contactEmail: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEditingListing(newListing);
  };

  // ✅ Handle Export
  const handleExport = () => {
    const dataStr = JSON.stringify(listings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `pg-listings-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('📥 Data exported successfully');
  };

  // ✅ Handle Import
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedData)) {
          setListings(importedData);
          setFilteredListings(importedData);
          calculateStats(importedData);
          toast.success('📤 Data imported successfully');
        } else {
          toast.error('Invalid file format');
        }
      } catch (error) {
        toast.error('Error reading file');
      }
    };
    reader.readAsText(file);
  };

  // ✅ Add Sample Data
  const handleAddSampleData = () => {
    const sampleData = getMockData();
    setListings(prev => [...prev, ...sampleData]);
    setFilteredListings(prev => [...prev, ...sampleData]);
    calculateStats([...listings, ...sampleData]);
    toast.success('✨ Sample data added successfully');
  };

  // ✅ Clear All Filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterType('all');
    setFilterStatus('all');
    setSortBy('newest');
    toast.info('🧹 All filters cleared');
  };

  // ✅ Loading State
  if (loading && listings.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-6">Loading Admin Dashboard</h2>
          <p className="text-gray-600 mt-2">Connecting to backend server...</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse delay-100"></div>
            <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <div className={`h-3 w-3 rounded-full border-2 border-white ${
                    serverStatus.status === 'online' ? 'bg-green-500' :
                    serverStatus.status === 'offline' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }`}></div>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">PG Finder Admin Portal</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-gray-600">
                    Backend: <span className={`font-medium ${serverStatus.status === 'online' ? 'text-green-600' : 'text-red-600'}`}>
                      {serverStatus.status === 'online' ? '🟢 Live' : '🔴 Offline'}
                    </span>
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600">
                    {listings.length} listings • {stats.published} published
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => checkServerStatus()}
                disabled={actionLoading}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${actionLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              
              <label className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl font-medium hover:bg-blue-200 transition-all duration-200 cursor-pointer flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
              
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export Data
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Server Status Card */}
        <div className="mb-8">
          <ServerStatusCard status={serverStatus} />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatsCard
            title="Total Listings"
            value={stats.total}
            icon={Home}
            color="blue"
            trend={stats.total > 0 ? 12 : 0}
            description="All PG listings"
          />
          <StatsCard
            title="Published"
            value={stats.published}
            icon={Eye}
            color="green"
            trend={Math.round((stats.published / stats.total) * 100)}
            description={`${Math.round((stats.published / stats.total) * 100)}% of total`}
          />
          <StatsCard
            title="Featured"
            value={stats.featured}
            icon={Star}
            color="orange"
            trend={Math.round((stats.featured / stats.total) * 100)}
            description="Highlighted listings"
          />
          <StatsCard
            title="Verified"
            value={stats.verified}
            icon={ShieldCheck}
            color="purple"
            trend={Math.round((stats.verified / stats.total) * 100)}
            description="Trusted PGs"
          />
          <StatsCard
            title="Avg. Price"
            value={`₹${stats.avgPrice.toLocaleString()}`}
            icon={DollarSign}
            color="green"
            description="Monthly average"
          />
          <StatsCard
            title="Avg. Rating"
            value={stats.avgRating.toFixed(1)}
            icon={TrendingUp}
            color="orange"
            description={`${stats.totalReviews} reviews`}
          />
        </div>

        {/* Type Distribution */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-blue-600" />
              PG Type Distribution
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-700">{stats.boys}</div>
                <div className="text-sm text-blue-600">Boys PG</div>
                <div className="text-xs text-gray-500 mt-1">
                  {stats.total > 0 ? Math.round((stats.boys / stats.total) * 100) : 0}%
                </div>
              </div>
              <div className="text-center p-4 bg-pink-50 rounded-xl">
                <div className="text-2xl font-bold text-pink-700">{stats.girls}</div>
                <div className="text-sm text-pink-600">Girls PG</div>
                <div className="text-xs text-gray-500 mt-1">
                  {stats.total > 0 ? Math.round((stats.girls / stats.total) * 100) : 0}%
                </div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-700">{stats.coed}</div>
                <div className="text-sm text-purple-600">Co-ed PG</div>
                <div className="text-xs text-gray-500 mt-1">
                  {stats.total > 0 ? Math.round((stats.coed / stats.total) * 100) : 0}%
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-700">{stats.family}</div>
                <div className="text-sm text-green-600">Family PG</div>
                <div className="text-xs text-gray-500 mt-1">
                  {stats.total > 0 ? Math.round((stats.family / stats.total) * 100) : 0}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-2xl border shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500" />
                <input
                  type="text"
                  placeholder="Search by name, city, owner, amenities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <Filter className="h-5 w-5 text-gray-500" />
                <div className="flex gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="all">All Types</option>
                    <option value="boys">Boys PG</option>
                    <option value="girls">Girls PG</option>
                    <option value="co-ed">Co-ed PG</option>
                    <option value="family">Family PG</option>
                  </select>
                  
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="featured">Featured</option>
                    <option value="verified">Verified</option>
                  </select>
                </div>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name A-Z</option>
                <option value="rating">Rating: High to Low</option>
              </select>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600 shadow-inner' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  title="Grid View"
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-100 text-blue-600 shadow-inner' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  title="List View"
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
              
              <button
                onClick={handleAddNew}
                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-500 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-3"
              >
                <Plus className="h-5 w-5" />
                Add New PG
              </button>
            </div>
          </div>

          {/* Results Info & Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6 pt-6 border-t">
            <div className="text-sm text-gray-600">
              Showing <span className="font-bold text-gray-900">{filteredListings.length}</span> of{' '}
              <span className="font-bold text-gray-900">{listings.length}</span> listings
              {searchQuery && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  "{searchQuery}"
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all text-sm font-medium"
              >
                Clear Filters
              </button>
              
              <button
                onClick={handleAddSampleData}
                className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-lg hover:from-purple-200 hover:to-pink-200 transition-all text-sm font-medium"
              >
                Add Sample Data
              </button>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">Published</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-600">Featured</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-6 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-red-700 font-bold mb-2">Connection Error</h4>
                <p className="text-red-600">{error}</p>
                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    onClick={fetchListings}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Retry Connection
                  </button>
                  <button
                    onClick={handleAddSampleData}
                    className="px-4 py-2 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-all font-medium"
                  >
                    Use Sample Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Listings */}
        {filteredListings.length === 0 ? (
          <div className="bg-white rounded-2xl border shadow-sm p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">No Listings Found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchQuery ? `No results found for "${searchQuery}". Try different keywords or clear the search.` : 'No PG listings available. Create your first listing!'}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={handleAddNew}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
              >
                Create First Listing
              </button>
              <button
                onClick={handleAddSampleData}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Add Sample Data
              </button>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard
                key={listing._id}
                listing={listing}
                onEdit={setEditingListing}
                onDelete={(id: string, name: string) => setDeletingInfo({ id, name })}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredListings.map((listing) => (
              <div key={listing._id} className="bg-white rounded-2xl border shadow-sm p-6 hover:shadow-md transition-all">
                <div className="flex items-start gap-6">
                  <img
                    src={listing.images[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'}
                    alt={listing.name}
                    className="w-32 h-32 object-cover rounded-xl flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 truncate">{listing.name}</h3>
                          <div className="flex items-center gap-2">
                            {listing.featured && (
                              <span className="px-2 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold rounded-full">
                                Featured
                              </span>
                            )}
                            {listing.verified && (
                              <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold rounded-full">
                                Verified
                              </span>
                            )}
                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                              listing.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {listing.published ? 'Published' : 'Draft'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{listing.city}</span>
                            {listing.locality && (
                              <>
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-600">{listing.locality}</span>
                              </>
                            )}
                          </div>
                          <span className="text-gray-400">•</span>
                          <span className={`font-medium ${
                            listing.type === 'boys' ? 'text-blue-600' :
                            listing.type === 'girls' ? 'text-pink-600' :
                            listing.type === 'co-ed' ? 'text-purple-600' :
                            'text-green-600'
                          }`}>
                            {listing.type === 'co-ed' ? 'Co-Ed' : listing.type} PG
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-xl font-bold text-orange-600">₹{listing.price.toLocaleString()}</span>
                        </div>
                        
                        <p className="text-gray-600 line-clamp-2 mb-4">
                          {listing.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {listing.amenities?.slice(0, 5).map((amenity: string, index: number) => (
                            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-md">
                              {amenity}
                            </span>
                          ))}
                          {listing.amenities?.length > 5 && (
                            <span className="px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded-md">
                              +{listing.amenities.length - 5} more
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-700">{listing.ownerName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-700 font-medium">{listing.ownerPhone || listing.contactPhone || '9315058665'}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => navigate(`/pg/${listing._id}`)}
                              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all flex items-center gap-2 font-medium"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </button>
                            <button
                              onClick={() => setEditingListing(listing)}
                              className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setDeletingInfo({ id: listing._id, name: listing.name })}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t text-center">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-sm text-gray-500">
              <p>© {new Date().getFullYear()} PG Finder Admin Dashboard</p>
              <p className="mt-1">Version 2.0.0 • Backend: {serverStatus.status === 'online' ? 'Connected' : 'Offline'}</p>
            </div>
            
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate('/')}
                className="text-sm text-gray-600 hover:text-blue-600 hover:underline"
              >
                ← Back to Home
              </button>
              <button
                onClick={fetchListings}
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                Sync with Backend
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {editingListing && (
        <EditModal
          listing={editingListing}
          onClose={() => setEditingListing(null)}
          onSave={handleSaveListing}
        />
      )}

      {deletingInfo && (
        <DeleteModal
          onConfirm={() => handleDeleteListing(deletingInfo.id)}
          onCancel={() => setDeletingInfo(null)}
          listingName={deletingInfo.name}
        />
      )}
    </div>
  );
};

export default AdminDashboard;