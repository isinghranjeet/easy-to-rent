// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState, memo, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Heart,
//   MapPin,
//   Shield,
//   GitCompare,
//   Check,
//   ChevronLeft,
//   ChevronRight,
//   Building,
//   Phone,
//   MessageCircle,
//   Eye,
//   Zap,
//   Sparkles,
//   TrendingUp,
//   Crown,
//   Star
// } from 'lucide-react';

// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Card, CardContent } from '@/components/ui/card';
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
// import { useWishlist } from '@/contexts/WishlistContext';
// import { useCompare } from '@/contexts/CompareContext';
// import { useAuth } from '@/contexts/AuthContext';
// import { AuthModal } from '@/components/AuthModal';
// import { CreditPurchaseModal } from './CreditPurchaseModal';
// import { cn } from '@/lib/utils';
// import { useToast } from '@/hooks/use-toast';
// import { api } from '@/services/api';

// interface BackendPG {
//   _id?: string;
//   id?: string;
//   name: string;
//   slug?: string;
//   city?: string;
//   locality?: string;
//   price: number;
//   images: string[];
//   gallery?: string[];
//   type?: 'boys' | 'girls' | 'co-ed' | 'family';
//   featured?: boolean;
//   verified?: boolean;
//   availableRooms?: number;
//   rating?: number;
//   reviewCount?: number;
// }

// interface PGCardProps {
//   pg: BackendPG;
//   index?: number;
//   variant?: 'default' | 'featured';
//   showContactButtons?: boolean;
// }

// const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80';

// // Generate random rating between 3.5 and 5.0
// const getRandomRating = (seed: number): number => {
//   const min = 3.5;
//   const max = 5.0;
//   const random = ((seed * 9301 + 49297) % 233280) / 233280;
//   return Math.round((min + random * (max - min)) * 10) / 10;
// };

// export const PGCard = memo(({ pg, index = 0, variant = 'default', showContactButtons = true }: PGCardProps) => {
//   const [currentImage, setCurrentImage] = useState(0);
//   const [showAuthModal, setShowAuthModal] = useState(false);
//   const [showCreditModal, setShowCreditModal] = useState(false);
//   const [pendingAction, setPendingAction] = useState<'wishlist' | 'compare' | 'contact' | null>(null);
//   const [pendingContactType, setPendingContactType] = useState<'call' | 'whatsapp' | null>(null);
//   const [isHovered, setIsHovered] = useState(false);
//   const [touchStart, setTouchStart] = useState(0);
//   const [touchEnd, setTouchEnd] = useState(0);
//   const [imageLoaded, setImageLoaded] = useState<boolean[]>([]);
//   const [creditBalance, setCreditBalance] = useState(0);
//   const [showTooltip, setShowTooltip] = useState(false);
  
//   const autoPlayRef = useRef<NodeJS.Timeout>();
//   const tooltipTimeoutRef = useRef<NodeJS.Timeout>();
  
//   const { toast } = useToast();
//   const navigate = useNavigate();
//   const { isAuthenticated, user } = useAuth();
//   const { isInWishlist, toggleWishlist } = useWishlist();
//   const { isInCompare, toggleCompare } = useCompare();

//   const pgId = pg.id || pg._id || '';
  
//   // Generate unique random rating
//   const ratingSeed = (pgId.charCodeAt(0) || 0) + index;
//   const randomRating = getRandomRating(ratingSeed);

//   const allImages = [...(pg.images || []), ...(pg.gallery || [])].filter(Boolean);
//   const displayImages = allImages.length > 0 ? allImages : [FALLBACK_IMAGE];
//   const isFeatured = variant === 'featured' || pg.featured;
//   const isSuperHost = pg.verified && (pg.rating || 0) > 4.5;

//   // Initialize image loaded state
//   useEffect(() => {
//     setImageLoaded(new Array(displayImages.length).fill(false));
//   }, [displayImages.length]);

//   // Fetch credit balance on mount
//   useEffect(() => {
//     if (isAuthenticated && showContactButtons) {
//       fetchCreditBalance();
//     }
//   }, [isAuthenticated, showContactButtons]);

//   // Auto-play functionality
//   useEffect(() => {
//     if (displayImages.length > 1 && isHovered) {
//       autoPlayRef.current = setInterval(() => {
//         setCurrentImage(prev => (prev + 1) % displayImages.length);
//       }, 3000);
//     }
    
//     return () => {
//       if (autoPlayRef.current) {
//         clearInterval(autoPlayRef.current);
//       }
//     };
//   }, [isHovered, displayImages.length]);

//   // Cleanup tooltip timeout
//   useEffect(() => {
//     return () => {
//       if (tooltipTimeoutRef.current) {
//         clearTimeout(tooltipTimeoutRef.current);
//       }
//     };
//   }, []);

//   const fetchCreditBalance = async () => {
//     try {
//       const response = await api.request('/api/payments/credit-balance');
//       if (response.success) {
//         setCreditBalance(response.balance);
//       }
//     } catch (error) {
//       console.error('Error fetching credit balance:', error);
//     }
//   };

//   // Touch handlers for mobile swipe
//   const handleTouchStart = (e: React.TouchEvent) => {
//     setTouchStart(e.targetTouches[0].clientX);
//   };

//   const handleTouchMove = (e: React.TouchEvent) => {
//     setTouchEnd(e.targetTouches[0].clientX);
//   };

//   const handleTouchEnd = () => {
//     if (touchStart - touchEnd > 75) {
//       nextImage();
//     } else if (touchStart - touchEnd < -75) {
//       prevImage();
//     }
//   };

//   const nextImage = (e?: React.MouseEvent) => {
//     e?.preventDefault();
//     e?.stopPropagation();
//     setCurrentImage(prev => (prev + 1) % displayImages.length);
//   };

//   const prevImage = (e?: React.MouseEvent) => {
//     e?.preventDefault();
//     e?.stopPropagation();
//     setCurrentImage(prev => prev === 0 ? displayImages.length - 1 : prev - 1);
//   };

//   const goToImage = (index: number, e?: React.MouseEvent) => {
//     e?.preventDefault();
//     e?.stopPropagation();
//     setCurrentImage(index);
//   };

//   const getTypeLabel = (type: BackendPG['type']) => {
//     const labels = {
//       'boys': 'Boys',
//       'girls': 'Girls',
//       'co-ed': 'Co-ed',
//       'family': 'Family'
//     };
//     return labels[type || 'co-ed'];
//   };

//   const getTypeColor = (type: BackendPG['type']) => {
//     const colors = {
//       'boys': 'from-blue-500 to-blue-600',
//       'girls': 'from-pink-500 to-pink-600',
//       'co-ed': 'from-purple-500 to-purple-600',
//       'family': 'from-emerald-500 to-emerald-600'
//     };
//     return colors[type || 'co-ed'];
//   };

//   const handleAuthAction = (action: 'wishlist' | 'compare', e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     if (!isAuthenticated) {
//       setPendingAction(action);
//       setShowAuthModal(true);
//       return;
//     }
    
//     if (action === 'wishlist') {
//       toggleWishlist(pgId);
//       toast({
//         title: isInWishlist(pgId) ? "Removed from Wishlist" : "Added to Wishlist",
//         description: isInWishlist(pgId) ? `${pg.name} has been removed` : `${pg.name} has been saved`,
//         duration: 2000,
//       });
//     } else {
//       toggleCompare(pgId);
//       toast({
//         title: isInCompare(pgId) ? "Removed from Compare" : "Added to Compare",
//         description: isInCompare(pgId) ? `Removed from comparison` : `Ready to compare`,
//         duration: 2000,
//       });
//     }
//   };

//   const handleContactWithCredit = async (type: 'call' | 'whatsapp', e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (!isAuthenticated) {
//       setPendingAction('contact');
//       setPendingContactType(type);
//       setShowAuthModal(true);
//       return;
//     }

//     if (creditBalance < 1) {
//       setPendingContactType(type);
//       setShowCreditModal(true);
//       return;
//     }

//     try {
//       const response = await api.request('/api/payments/use-contact-credit', {
//         method: 'POST',
//         body: JSON.stringify({ pgId, contactType: type })
//       });

//       if (response.success) {
//         setCreditBalance(response.balance);
        
//         if (type === 'call') {
//           window.location.href = `tel:${response.contactNumber}`;
//           toast.success(`Connecting you to ${pg.name} owner`);
//         } else {
//           const message = encodeURIComponent(
//             `Hello,\n\nI'm interested in "${pg.name}" on EasyTorent.\n` +
//             `📍 Price: ₹${pg.price.toLocaleString()}/month\n` +
//             `📍 Location: ${pg.locality}, ${pg.city}\n` +
//             `📍 Type: ${getTypeLabel(pg.type)}\n\n` +
//             `Could you please share more details about availability and amenities?\n\n` +
//             `Thanks!`
//           );
//           window.open(`https://wa.me/91${response.contactNumber}?text=${message}`, '_blank');
//           toast.success(`Opening WhatsApp chat with ${pg.name} owner`);
//         }
        
//         // Show remaining credits
//         if (response.balance > 0) {
//           toast.info(`${response.balance} contact credits remaining`);
//         } else {
//           toast.warning('You have used all your credits. Please purchase more to continue contacting owners.');
//         }
//       }
//     } catch (error) {
//       console.error('Error using credit:', error);
//       toast.error('Failed to connect. Please try again.');
//     }
//   };

//   const handleSuccess = () => {
//     if (pendingAction === 'wishlist') {
//       toggleWishlist(pgId);
//     } else if (pendingAction === 'compare') {
//       toggleCompare(pgId);
//     } else if (pendingAction === 'contact' && pendingContactType) {
//       handleContactWithCredit(pendingContactType, new Event('click') as any);
//     }
//     setPendingAction(null);
//     setPendingContactType(null);
//     fetchCreditBalance();
//   };

//   const handleCardClick = () => {
//     navigate(`/pg/${pg.slug || pgId}`);
//   };

//   const handleMouseEnter = () => {
//     setIsHovered(true);
//     setShowTooltip(true);
//     if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
//   };

//   const handleMouseLeave = () => {
//     setIsHovered(false);
//     tooltipTimeoutRef.current = setTimeout(() => setShowTooltip(false), 300);
//   };

//   return (
//     <TooltipProvider>
//       <Card
//         className={cn(
//           "group relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50/50 transition-all duration-500 cursor-pointer",
//           "hover:shadow-2xl hover:-translate-y-2",
//           "animate-in fade-in-0 zoom-in-95"
//         )}
//         style={{ animationDelay: `${index * 50}ms` }}
//         onMouseEnter={handleMouseEnter}
//         onMouseLeave={handleMouseLeave}
//         onClick={handleCardClick}
//       >
//         {/* Animated Gradient Border */}
//         <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
//         {/* Premium Badges */}
//         {isFeatured && (
//           <div className="absolute -left-10 top-4 z-20 rotate-45 bg-gradient-to-r from-amber-500 to-orange-500 px-10 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
//             <Sparkles className="inline h-3 w-3 mr-1" />
//             Featured
//           </div>
//         )}

//         {isSuperHost && (
//           <div className="absolute left-3 top-3 z-20">
//             <div className="flex items-center gap-1 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
//               <Crown className="h-3 w-3" />
//               Super Host
//             </div>
//           </div>
//         )}

//         {/* Image Section */}
//         <div 
//           className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200"
//           onTouchStart={handleTouchStart}
//           onTouchMove={handleTouchMove}
//           onTouchEnd={handleTouchEnd}
//         >
//           {/* Image Container */}
//           <div 
//             className="flex h-full transition-transform duration-700 ease-out"
//             style={{ transform: `translateX(-${currentImage * 100}%)` }}
//           >
//             {displayImages.map((image, idx) => (
//               <div key={idx} className="relative h-full w-full flex-shrink-0">
//                 {!imageLoaded[idx] && (
//                   <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
//                     <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
//                   </div>
//                 )}
//                 <img
//                   src={image}
//                   alt={pg.name}
//                   className={cn(
//                     "h-full w-full object-cover transition-all duration-700",
//                     isHovered && "scale-110",
//                     imageLoaded[idx] ? "opacity-100" : "opacity-0"
//                   )}
//                   onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
//                   onLoad={() => setImageLoaded(prev => ({ ...prev, [idx]: true }))}
//                   loading="lazy"
//                 />
//               </div>
//             ))}
//           </div>

//           {/* Premium Overlay Gradient */}
//           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

//           {/* Top Badges */}
//           <div className="absolute left-3 top-3 flex gap-2 z-10">
//             {pg.verified && (
//               <Badge className="h-6 border-0 bg-emerald-500/90 backdrop-blur-sm px-2 text-[10px] font-semibold text-white shadow-lg">
//                 <Shield className="mr-1 h-2.5 w-2.5" />
//                 Verified
//               </Badge>
//             )}
//             {pg.availableRooms && pg.availableRooms <= 2 && (
//               <Badge className="h-6 border-0 bg-rose-500/90 backdrop-blur-sm px-2 text-[10px] font-semibold text-white shadow-lg animate-pulse">
//                 <TrendingUp className="mr-1 h-2.5 w-2.5" />
//                 Only {pg.availableRooms} left
//               </Badge>
//             )}
//           </div>

//           {/* Type Badge with Gradient */}
//           <div className="absolute right-3 top-3 z-10">
//             <div className={cn(
//               "rounded-md bg-gradient-to-r px-3 py-1 text-xs font-bold text-white shadow-lg",
//               getTypeColor(pg.type)
//             )}>
//               {getTypeLabel(pg.type)}
//             </div>
//           </div>

//           {/* Rating Badge */}
//           <div className="absolute left-3 bottom-3 z-10">
//             <div className="flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-sm px-2 py-0.5 shadow-lg">
//               <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
//               <span className="text-xs font-bold text-gray-800">{randomRating.toFixed(1)}</span>
//             </div>
//           </div>

//           {/* Wishlist & Compare Buttons */}
//           <div className="absolute right-3 top-16 z-10 flex flex-col gap-2">
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <button
//                   onClick={(e) => handleAuthAction('wishlist', e)}
//                   className={cn(
//                     "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm",
//                     isAuthenticated && isInWishlist(pg.id)
//                       ? "bg-rose-500 text-white hover:bg-rose-600"
//                       : "bg-white/90 text-gray-700 hover:bg-white"
//                   )}
//                   aria-label="Add to wishlist"
//                 >
//                   <Heart className={cn("h-3.5 w-3.5 transition-all", isAuthenticated && isInWishlist(pg.id) && "fill-current")} />
//                 </button>
//               </TooltipTrigger>
//               <TooltipContent side="left" className="text-xs">
//                 <p>{isAuthenticated && isInWishlist(pg.id) ? "Remove from wishlist" : "Save to wishlist"}</p>
//               </TooltipContent>
//             </Tooltip>

//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <button
//                   onClick={(e) => handleAuthAction('compare', e)}
//                   className={cn(
//                     "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm",
//                     isAuthenticated && isInCompare(pg.id)
//                       ? "bg-primary text-white hover:bg-primary/90"
//                       : "bg-white/90 text-gray-700 hover:bg-white"
//                   )}
//                   aria-label="Compare property"
//                 >
//                   {isAuthenticated && isInCompare(pg.id) ? (
//                     <Check className="h-3.5 w-3.5" />
//                   ) : (
//                     <GitCompare className="h-3.5 w-3.5" />
//                   )}
//                 </button>
//               </TooltipTrigger>
//               <TooltipContent side="left" className="text-xs">
//                 <p>{isAuthenticated && isInCompare(pg.id) ? "Remove from compare" : "Add to compare"}</p>
//               </TooltipContent>
//             </Tooltip>
//           </div>

//           {/* Price Tag with Animation */}
//           <div className="absolute bottom-3 right-3 z-10 rounded-lg bg-gradient-to-r from-primary to-primary/80 px-3 py-1.5 shadow-lg backdrop-blur-sm transform transition-all duration-300 group-hover:scale-105">
//             <span className="text-base font-bold text-white">₹{pg.price.toLocaleString()}</span>
//             <span className="text-[10px] text-white/80 ml-0.5">/month</span>
//           </div>

//           {/* Image Navigation */}
//           {displayImages.length > 1 && (
//             <>
//               <button
//                 onClick={prevImage}
//                 className={cn(
//                   "absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-1.5 text-white transition-all duration-300 hover:bg-black/80 hover:scale-110 z-10",
//                   "md:opacity-0 md:group-hover:opacity-100 opacity-100"
//                 )}
//                 aria-label="Previous"
//               >
//                 <ChevronLeft className="h-4 w-4" />
//               </button>
//               <button
//                 onClick={nextImage}
//                 className={cn(
//                   "absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-1.5 text-white transition-all duration-300 hover:bg-black/80 hover:scale-110 z-10",
//                   "md:opacity-0 md:group-hover:opacity-100 opacity-100"
//                 )}
//                 aria-label="Next"
//               >
//                 <ChevronRight className="h-4 w-4" />
//               </button>
//             </>
//           )}

//           {/* Image Counter */}
//           {displayImages.length > 1 && (
//             <div className="absolute bottom-3 left-3 z-10 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
//               {currentImage + 1}/{displayImages.length}
//             </div>
//           )}

//           {/* Dots Indicator */}
//           {displayImages.length > 1 && (
//             <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
//               {displayImages.map((_, idx) => (
//                 <button
//                   key={idx}
//                   onClick={(e) => goToImage(idx, e)}
//                   className={cn(
//                     "h-1 rounded-full transition-all duration-300",
//                     idx === currentImage 
//                       ? "w-5 bg-white" 
//                       : "w-1.5 bg-white/60 hover:bg-white/80"
//                   )}
//                   aria-label={`Go to image ${idx + 1}`}
//                 />
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Content Section */}
//         <CardContent className="p-4">
//           {/* Property Name with Hover Effect */}
//           <h3 className="mb-1.5 text-sm font-bold leading-tight text-gray-800 line-clamp-1 group-hover:text-primary transition-colors duration-300">
//             {pg.name}
//           </h3>

//           {/* Location with Icon */}
//           <div className="mb-3 flex items-start gap-1.5 text-xs text-gray-500">
//             <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
//             <span className="line-clamp-1">
//               {pg.locality}, {pg.city}
//             </span>
//           </div>

//           {/* Credit Balance Indicator */}
//           {isAuthenticated && showContactButtons && creditBalance > 0 && (
//             <div className="mb-3 flex items-center gap-1.5">
//               <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 rounded-full">
//                 <Zap className="h-2.5 w-2.5 text-green-600" />
//                 <span className="text-[10px] font-medium text-green-600">{creditBalance} contact credits left</span>
//               </div>
//             </div>
//           )}

//           {/* Contact Buttons */}
//           {showContactButtons && (
//             <div className="grid grid-cols-2 gap-2 mb-3">
//               <Button
//                 size="sm"
//                 className="h-8 gap-1.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-xs font-medium"
//                 onClick={(e) => handleContactWithCredit('call', e)}
//               >
//                 <Phone className="h-3 w-3" />
//                 Call Owner
//               </Button>

//               <Button
//                 size="sm"
//                 className="h-8 gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-xs font-medium"
//                 onClick={(e) => handleContactWithCredit('whatsapp', e)}
//               >
//                 <MessageCircle className="h-3 w-3" />
//                 WhatsApp
//               </Button>
//             </div>
//           )}

//           {/* View Details Button */}
//           <Button
//             variant="outline"
//             size="sm"
//             className="w-full h-8 gap-1.5 text-xs font-medium border-primary/30 hover:bg-primary/5 hover:border-primary transition-all duration-300"
//             onClick={(e) => {
//               e.stopPropagation();
//               navigate(`/pg/${pg.slug || pgId}`);
//             }}
//           >
//             <Eye className="h-3 w-3" />
//             View Details
//           </Button>

//           {/* EasyTorent Footer */}
//           <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2.5">
//             <div className="flex items-center gap-1.5">
//               <div className="h-5 w-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
//                 <Building className="h-2.5 w-2.5 text-white" />
//               </div>
//               <span className="text-[10px] font-semibold text-gray-700">EasyTorent</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <div className="h-1 w-1 rounded-full bg-green-500 animate-pulse" />
//               <span className="text-[10px] text-gray-400">Verified Listing</span>
//             </div>
//           </div>
//         </CardContent>

//         {/* Hover Border Effect */}
//         <div className={cn(
//           "absolute inset-0 border-2 border-primary/50 rounded-xl pointer-events-none transition-all duration-500",
//           isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
//         )} />

//         {/* Floating Credit Info Tooltip */}
//         {showTooltip && isAuthenticated && creditBalance === 0 && showContactButtons && (
//           <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-30 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
//             <div className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap flex items-center gap-1">
//               <Zap className="h-3 w-3 text-yellow-400" />
//               Need credits to contact? Tap ₹10 for 4 contacts
//             </div>
//             <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
//           </div>
//         )}
//       </Card>

//       {/* Auth Modal */}
//       <AuthModal
//         isOpen={showAuthModal}
//         onClose={() => {
//           setShowAuthModal(false);
//           setPendingAction(null);
//           setPendingContactType(null);
//         }}
//         onSuccess={handleSuccess}
//       />

//       {/* Credit Purchase Modal */}
//       <CreditPurchaseModal
//         isOpen={showCreditModal}
//         onClose={() => {
//           setShowCreditModal(false);
//           setPendingContactType(null);
//         }}
//         onSuccess={() => {
//           fetchCreditBalance();
//           if (pendingContactType) {
//             setTimeout(() => {
//               handleContactWithCredit(pendingContactType, new Event('click') as any);
//             }, 500);
//           }
//         }}
//       />
//     </TooltipProvider>
//   );
// });

// PGCard.displayName = 'PGCard';






















































































/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, memo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  MapPin,
  Star,
  Wifi,
  Utensils,
  Wind,
  Car,
  Shield,
  GitCompare,
  Check,
  ChevronLeft,
  ChevronRight,
  Phone,
  MessageCircle,
  Clock,
  Users,
  Building
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCompare } from '@/contexts/CompareContext';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/AuthModal';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface BackendPG {
  _id?: string;
  id?: string;
  name: string;
  slug?: string;
  description?: string;
  city?: string;
  locality?: string;
  address?: string;
  price: number;
  images: string[];
  gallery?: string[];
  type?: 'boys' | 'girls' | 'co-ed' | 'family';
  amenities?: string[];
  rating?: number;
  reviewCount?: number;
  ownerName?: string;
  ownerPhone?: string;
  featured?: boolean;
  verified?: boolean;
  wifi?: boolean;
  meals?: boolean;
  ac?: boolean;
  parking?: boolean;
  distance?: string;
  availableRooms?: number;
  minStay?: string;
}

interface PGCardProps {
  pg: BackendPG;
  index?: number;
  variant?: 'default' | 'featured';
}

// Contact number for inquiries
const CONTACT_NUMBER = '9315058665';
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80';

export const PGCard = memo(({ pg, index = 0, variant = 'default' }: PGCardProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'wishlist' | 'compare' | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [showThumbnails, setShowThumbnails] = useState(false);
  
  const imageRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout>();
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, toggleCompare } = useCompare();

  const pgId = pg.id || pg._id || '';

  const allImages = [...(pg.images || []), ...(pg.gallery || [])].filter(Boolean);
  const displayImages = allImages.length > 0 ? allImages : [FALLBACK_IMAGE];
  const isFeatured = variant === 'featured' || pg.featured;

  // Auto-play functionality
  useEffect(() => {
    if (displayImages.length > 1 && isHovered) {
      autoPlayRef.current = setInterval(() => {
        setCurrentImage(prev => (prev + 1) % displayImages.length);
      }, 3000);
    }
    
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isHovered, displayImages.length]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left
      nextImage();
    } else if (touchStart - touchEnd < -75) {
      // Swipe right
      prevImage();
    }
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setCurrentImage(prev => (prev + 1) % displayImages.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setCurrentImage(prev => prev === 0 ? displayImages.length - 1 : prev - 1);
  };

  const goToImage = (index: number, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setCurrentImage(index);
  };

  // Format contact number
  const phoneNumber = CONTACT_NUMBER;
  const whatsappNumber = phoneNumber.replace(/\D/g, '');
  
  // Professional inquiry message
  const inquiryMessage = `Dear Team,

I am interested in the property "${pg.name}" listed on EasyTorent.

Property Details:
• Price: ₹${pg.price}/month
• Location: ${pg.locality}, ${pg.city}
• Type: ${pg.type}

Please share more details and availability.

Regards,
[Your Name]`;
  
  const whatsappUrl = `https://wa.me/91${whatsappNumber}?text=${encodeURIComponent(inquiryMessage)}`;
  const callUrl = `tel:${phoneNumber}`;

  const getTypeLabel = (type: BackendPG['type']) => {
    const labels = {
      'boys': 'Boys',
      'girls': 'Girls',
      'co-ed': 'Co-ed',
      'family': 'Family'
    };
    return labels[type];
  };

  const handleAuthAction = (action: 'wishlist' | 'compare', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      setPendingAction(action);
      setShowAuthModal(true);
      return;
    }
    
    if (action === 'wishlist') {
      toggleWishlist(pgId);
      toast({
        title: isInWishlist(pgId) ? "Removed from Wishlist" : "Added to Wishlist",
        description: isInWishlist(pgId) ? `${pg.name} has been removed` : `${pg.name} has been saved`,
        duration: 2000,
      });
    } else {
      toggleCompare(pgId);
      toast({
        title: isInCompare(pgId) ? "Removed from Compare" : "Added to Compare",
        description: isInCompare(pgId) ? `Removed from comparison` : `Ready to compare`,
        duration: 2000,
      });
    }
  };

  const handleContactClick = (type: 'call' | 'whatsapp', e: React.MouseEvent) => {
    e.stopPropagation();
    
    toast({
      title: "EasyTorent Support",
      description: `Connecting you with our support team`,
      duration: 2000,
    });
  };

  const handleSuccess = () => {
    if (pendingAction === 'wishlist') {
      toggleWishlist(pgId);
    } else if (pendingAction === 'compare') {
      toggleCompare(pgId);
    }
    setPendingAction(null);
  };

  const handleCardClick = () => {
    navigate(`/pg/${pg.slug}`);
  };

  return (
    <TooltipProvider>
      <Card
        className={cn(
          "group relative overflow-hidden border transition-all duration-300 cursor-pointer",
          isFeatured 
            ? "border-primary/20 shadow-md hover:shadow-lg" 
            : "border-border/50 shadow-sm hover:shadow-md",
          "hover:-translate-y-0.5 animate-in fade-in-0 zoom-in-95"
        )}
        style={{ animationDelay: `${index * 100}ms` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        {/* EasyTorent Featured Ribbon */}
        {isFeatured && (
          <div className="absolute -left-8 top-3 z-10 rotate-45 bg-gradient-to-r from-primary to-primary/80 px-8 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white shadow-sm">
            EasyTorent Featured
          </div>
        )}

        {/* Image Section with Touch Support */}
        <div 
          ref={imageRef}
          className="relative aspect-[4/3] overflow-hidden bg-muted"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Image Container with Smooth Transition */}
          <div 
            className="flex h-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentImage * 100}%)` }}
          >
            {displayImages.map((image, idx) => (
              <div key={idx} className="relative h-full w-full flex-shrink-0">
                <img
                  src={image}
                  alt={`${pg.name} - ${idx + 1}`}
                  className={cn(
                    "h-full w-full object-cover",
                    isHovered && "scale-105 transition-transform duration-700"
                  )}
                  onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Top Badges */}
          <div className="absolute left-2 top-2 flex gap-1 z-10">
            {pg.verified && (
              <Badge variant="secondary" className="h-6 border-0 bg-white/95 px-2 text-xs font-medium text-green-600 shadow-sm backdrop-blur">
                <Shield className="mr-1 h-3 w-3" />
                Verified
              </Badge>
            )}
            {pg.availableRooms && pg.availableRooms <= 2 && (
              <Badge variant="secondary" className="h-6 border-0 bg-orange-500/90 px-2 text-xs font-medium text-white shadow-sm">
                Only {pg.availableRooms} left
              </Badge>
            )}
          </div>

          {/* Type Badge */}
          <div className="absolute right-2 top-2 z-10">
            <Badge variant="secondary" className="border-0 bg-white/95 px-3 py-1 text-xs font-medium text-gray-700 shadow-sm backdrop-blur">
              {getTypeLabel(pg.type || 'co-ed')}
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="absolute right-2 top-12 z-10 flex flex-col gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={(e) => handleAuthAction('wishlist', e)}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full transition-all hover:scale-110 shadow-sm",
                    isAuthenticated && isInWishlist(pg.id)
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-white/95 text-gray-700 hover:bg-white"
                  )}
                  aria-label="Add to wishlist"
                >
                  <Heart className={cn("h-4 w-4", isAuthenticated && isInWishlist(pg.id) && "fill-current")} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left" className="text-sm">
                <p>{isAuthenticated && isInWishlist(pg.id) ? "Remove from wishlist" : "Add to wishlist"}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={(e) => handleAuthAction('compare', e)}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full transition-all hover:scale-110 shadow-sm",
                    isAuthenticated && isInCompare(pg.id)
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "bg-white/95 text-gray-700 hover:bg-white"
                  )}
                  aria-label="Compare property"
                >
                  {isAuthenticated && isInCompare(pg.id) ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <GitCompare className="h-4 w-4" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="left" className="text-sm">
                <p>{isAuthenticated && isInCompare(pg.id) ? "Remove from compare" : "Add to compare"}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Price Tag */}
          <div className="absolute bottom-2 right-2 z-10 rounded-md bg-white/95 px-3 py-1.5 shadow-sm backdrop-blur">
            <span className="text-base font-bold text-primary">₹{pg.price.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">/month</span>
          </div>

          {/* Image Navigation Arrows - Visible on hover and always on mobile */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className={cn(
                  "absolute left-1 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70 z-10",
                  "md:opacity-0 md:group-hover:opacity-100 opacity-100"
                )}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextImage}
                className={cn(
                  "absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70 z-10",
                  "md:opacity-0 md:group-hover:opacity-100 opacity-100"
                )}
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}

          {/* Image Counter - Always Visible */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-2 left-2 z-10 rounded-full bg-black/50 px-2 py-1 text-xs text-white backdrop-blur">
              {currentImage + 1}/{displayImages.length}
            </div>
          )}

          {/* Dots Indicator - Mobile Friendly */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {displayImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => goToImage(idx, e)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    idx === currentImage 
                      ? "w-6 bg-white" 
                      : "w-1.5 bg-white/60 hover:bg-white/80"
                  )}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail Preview - Visible on hover/click */}
        {displayImages.length > 1 && showThumbnails && (
          <div className="absolute left-2 right-2 top-1/2 z-20 -translate-y-1/2 rounded-lg bg-black/80 p-2 backdrop-blur">
            <div className="flex gap-1 overflow-x-auto py-1">
              {displayImages.map((image, idx) => (
                <button
                  key={idx}
                  onClick={(e) => goToImage(idx, e)}
                  className={cn(
                    "h-12 w-12 flex-shrink-0 overflow-hidden rounded border-2 transition-all",
                    idx === currentImage ? "border-primary scale-110" : "border-transparent opacity-70"
                  )}
                >
                  <img src={image} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content Section */}
        <CardContent className="p-4">
          {/* Rating & Reviews */}
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 rounded bg-yellow-50 px-1.5 py-1">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold">{pg.rating?.toFixed(1) || '4.5'}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                ({pg.reviewCount || 0} reviews)
              </span>
            </div>
            
            {pg.minStay && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Min {pg.minStay}</span>
              </div>
            )}
          </div>

          {/* Property Name */}
          <Link to={`/pg/${pg._id || pg.id}`} className="block" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-1.5 text-base font-semibold leading-tight text-foreground hover:text-primary transition-colors line-clamp-1">
              {pg.name}
            </h3>
          </Link>

          {/* Location */}
          <div className="mb-2 flex items-start gap-1 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1">
              {pg.locality}, {pg.city}
              {pg.distance && <span className="ml-1 font-medium text-primary">• {pg.distance}</span>}
            </span>
          </div>

          {/* EasyTorent Badge */}
          <div className="mb-2 flex items-center gap-1">
            <Badge variant="outline" className="border-primary/20 bg-primary/5 px-2 py-0.5 text-xs font-medium text-primary">
              <Building className="mr-1 h-3 w-3" />
              EasyTorent Verified
            </Badge>
          </div>

          {/* Description */}
          <p className="mb-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {pg.description || 'Premium PG accommodation with modern amenities and comfortable living spaces.'}
          </p>

          {/* Amenities Grid */}
          <div className="mb-3 grid grid-cols-4 gap-1.5">
            {pg.wifi && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center gap-1 rounded bg-primary/5 p-1.5">
                    <Wifi className="h-4 w-4 text-primary" />
                    <span className="text-xs text-primary">WiFi</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="text-sm">
                  <p>High-speed WiFi available</p>
                </TooltipContent>
              </Tooltip>
            )}
            {pg.meals && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center gap-1 rounded bg-primary/5 p-1.5">
                    <Utensils className="h-4 w-4 text-primary" />
                    <span className="text-xs text-primary">Meals</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="text-sm">
                  <p>Home-cooked meals included</p>
                </TooltipContent>
              </Tooltip>
            )}
            {pg.ac && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center gap-1 rounded bg-primary/5 p-1.5">
                    <Wind className="h-4 w-4 text-primary" />
                    <span className="text-xs text-primary">A/C</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="text-sm">
                  <p>Air conditioned rooms</p>
                </TooltipContent>
              </Tooltip>
            )}
            {pg.parking && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center gap-1 rounded bg-primary/5 p-1.5">
                    <Car className="h-4 w-4 text-primary" />
                    <span className="text-xs text-primary">Parking</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="text-sm">
                  <p>Vehicle parking available</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Additional Amenities */}
          {pg.amenities && pg.amenities.length > 0 && (
            <div className="mb-3 flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">Amenities:</span>
              <div className="flex flex-wrap gap-1.5">
                {pg.amenities.slice(0, 2).map((item, idx) => (
                  <Badge key={idx} variant="outline" className="h-5 border-border/50 px-1.5 text-xs font-normal">
                    {item}
                  </Badge>
                ))}
                {pg.amenities.length > 2 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="h-5 border-border/50 px-1.5 text-xs font-normal cursor-help">
                        +{pg.amenities.length - 2} more
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent className="text-sm">
                      <p>{pg.amenities.slice(2).join(', ')}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-muted-foreground/20 text-sm font-medium hover:bg-muted/50"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/pg/${pg.id}`);
              }}
            >
              Details
            </Button>

            <a 
              href={callUrl} 
              onClick={(e) => handleContactClick('call', e)}
              className="block"
            >
              <Button
                size="sm"
                className="h-8 w-full gap-1.5 bg-gradient-to-r from-orange-500 to-orange-600 px-0 text-sm font-medium hover:from-orange-600 hover:to-orange-700"
              >
                <Phone className="h-3.5 w-3.5" />
                Call
              </Button>
            </a>

            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={(e) => handleContactClick('whatsapp', e)}
              className="block"
            >
              <Button
                size="sm"
                className="h-8 w-full gap-1.5 bg-gradient-to-r from-green-500 to-green-600 px-0 text-sm font-medium text-white hover:from-green-600 hover:to-green-700"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Chat
              </Button>
            </a>
          </div>

          {/* EasyTorent Footer */}
          <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Building className="h-3 w-3" />
              <span className="font-medium text-foreground">EasyTorent</span>
            </span>
            <span className="text-xs">Listed on EasyTorent</span>
          </div>
        </CardContent>

        {/* Hover Border Effect */}
        <div className={cn(
          "absolute inset-0 border-2 border-primary rounded-lg pointer-events-none transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )} />
      </Card>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setPendingAction(null);
        }}
        onSuccess={handleSuccess}
      />
    </TooltipProvider>
  );
});

PGCard.displayName = 'PGCard';