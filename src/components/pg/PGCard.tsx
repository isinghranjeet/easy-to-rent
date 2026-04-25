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
  Building,
  Home,
  Youtube,
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
  virtualTour?: string;
}

interface PGCardProps {
  pg: BackendPG;
  index?: number;
  variant?: 'default' | 'featured';
}

// Contact number for inquiries
const CONTACT_NUMBER = '9315058665';

// Home Logo Component for fallback
const HomeLogo = () => (
  <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-gray-100 to-gray-200">
    <div className="text-center p-4">
      <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
        <Home className="h-10 w-10 text-white" />
      </div>
      <p className="text-gray-600 text-sm font-medium">EasyTorent</p>
      <p className="text-gray-400 text-xs mt-1">PG Accommodation</p>
    </div>
  </div>
);

export const PGCard = memo(({ pg, index = 0, variant = 'default' }: PGCardProps) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'wishlist' | 'compare' | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  
  const imageRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout>();
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, toggleCompare } = useCompare();

  const pgId = pg.id || pg._id || '';

  // Filter out fake/placeholder images - only keep real images from owner
  const filterRealImages = useCallback((images: string[] | undefined): string[] => {
    if (!images || !Array.isArray(images)) return [];
    
    // List of fake/placeholder patterns to exclude
    const fakePatterns = [
      'placeholder',
      'default',
      'fake',
      'dummy',
      'unsplash.com',
      'picsum.photos',
      'loremflick',
      'cloudimage',
      'via.placeholder.com',
      'placekitten',
      'dummyimage',
      'placehold.co',
      'placeholder-image',
      'no-image',
      'noimage',
      'fallback',
      'default-image'
    ];
    
    return images.filter(img => {
      if (!img || typeof img !== 'string') return false;
      const lowerImg = img.toLowerCase();
      // Check if image URL contains any fake pattern
      const isFake = fakePatterns.some(pattern => lowerImg.includes(pattern));
      // Also filter out empty strings or very short URLs
      if (img.trim().length < 10) return false;
      // Check if it's a valid URL format
      const isValidUrl = img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/');
      return !isFake && isValidUrl;
    });
  }, []);

  // Get only real images from owner
  const ownerImages = filterRealImages(pg.images);
  const ownerGallery = filterRealImages(pg.gallery);
  
  // Combine all real images and remove duplicates
  const allRealImages = [...new Set([...ownerImages, ...ownerGallery])];
  
  // If no real images, use empty array - will show home logo
  const displayImages = allRealImages.length > 0 ? allRealImages : [];
  
  const isFeatured = variant === 'featured' || pg.featured;

  // Reset current image when displayImages changes
  useEffect(() => {
    setCurrentImage(0);
  }, [displayImages.length]);

  // Auto-play functionality (only if images exist)
  useEffect(() => {
    if (displayImages.length > 1 && isHovered && !autoPlayRef.current) {
      autoPlayRef.current = setInterval(() => {
        setCurrentImage(prev => (prev + 1) % displayImages.length);
      }, 3000);
    }
    
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = undefined;
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
    if (displayImages.length <= 1) return;
    if (touchStart - touchEnd > 75) {
      nextImage();
    } else if (touchStart - touchEnd < -75) {
      prevImage();
    }
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (displayImages.length <= 1) return;
    setCurrentImage(prev => (prev + 1) % displayImages.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (displayImages.length <= 1) return;
    setCurrentImage(prev => prev === 0 ? displayImages.length - 1 : prev - 1);
  };

  const goToImage = (index: number, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (index >= 0 && index < displayImages.length) {
      setCurrentImage(index);
    }
  };

  const handleImageError = (imageUrl: string) => {
    if (!imageErrors.has(imageUrl)) {
      setImageErrors(prev => new Set(prev).add(imageUrl));
    }
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
    return labels[type || 'co-ed'];
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
    if (pg.slug) {
      navigate(`/pg/${pg.slug}`);
    } else if (pg._id || pg.id) {
      navigate(`/pg/${pg._id || pg.id}`);
    }
  };

  // Check if image is valid (not errored and not fake)
  const isValidImage = (imageUrl: string) => {
    return imageUrl && !imageErrors.has(imageUrl);
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
          {displayImages.length > 0 ? (
            <>
              {/* Image Container with Smooth Transition */}
              <div 
                className="flex h-full transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentImage * 100}%)` }}
              >
                {displayImages.map((image, idx) => (
                  <div key={idx} className="relative h-full w-full flex-shrink-0">
                    {isValidImage(image) ? (
                      <img
                        src={image}
                        alt={`${pg.name} - ${idx + 1}`}
                        className={cn(
                          "h-full w-full object-cover",
                          isHovered && "scale-105 transition-transform duration-700"
                        )}
                        onError={() => handleImageError(image)}
                        loading="lazy"
                      />
                    ) : (
                      <HomeLogo />
                    )}
                  </div>
                ))}
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

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
            </>
          ) : (
            // Show Home Logo when no images available
            <HomeLogo />
          )}

          {/* Top Badges - Verified badge hidden */}
          <div className="absolute left-2 top-2 flex gap-1 z-10">
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
                    isAuthenticated && isInWishlist(pgId)
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-white/95 text-gray-700 hover:bg-white"
                  )}
                  aria-label="Add to wishlist"
                >
                  <Heart className={cn("h-4 w-4", isAuthenticated && isInWishlist(pgId) && "fill-current")} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left" className="text-sm">
                <p>{isAuthenticated && isInWishlist(pgId) ? "Remove from wishlist" : "Add to wishlist"}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={(e) => handleAuthAction('compare', e)}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full transition-all hover:scale-110 shadow-sm",
                    isAuthenticated && isInCompare(pgId)
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "bg-white/95 text-gray-700 hover:bg-white"
                  )}
                  aria-label="Compare property"
                >
                  {isAuthenticated && isInCompare(pgId) ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <GitCompare className="h-4 w-4" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="left" className="text-sm">
                <p>{isAuthenticated && isInCompare(pgId) ? "Remove from compare" : "Add to compare"}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Price Tag */}
          <div className="absolute bottom-2 right-2 z-10 rounded-md bg-white/95 px-3 py-1.5 shadow-sm backdrop-blur">
            <span className="text-base font-bold text-primary">₹{pg.price.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">/month</span>
          </div>

          {/* Virtual Tour Badge */}
          {pg.virtualTour && (
            <div
              className="absolute bottom-2 left-2 z-10 rounded-md bg-red-600/90 px-3 py-1.5 shadow-sm backdrop-blur cursor-pointer hover:bg-red-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                window.open(pg.virtualTour, '_blank', 'noopener,noreferrer');
              }}
              title="Watch Virtual Tour"
            >
              <div className="flex items-center gap-1.5">
                <Youtube className="h-3.5 w-3.5 text-white" />
                <span className="text-xs font-semibold text-white">Virtual Tour</span>
              </div>
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
                  <img src={image} alt="" className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
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
                navigate(`/pg/${pg.id || pg._id}`);
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
            <span>Listed on EasyTorent</span>
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