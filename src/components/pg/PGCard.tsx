/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, memo } from 'react';
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
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, toggleCompare } = useCompare();

  const pgId = pg.id || pg._id || '';

  const allImages = [...(pg.images || []), ...(pg.gallery || [])].filter(Boolean);
  const displayImages = allImages.length > 0 ? allImages : [FALLBACK_IMAGE];
  const isFeatured = variant === 'featured' || pg.featured;

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
          <div className="absolute -left-8 top-3 z-10 rotate-45 bg-gradient-to-r from-primary to-primary/80 px-8 py-0.5 text-[8px] font-medium uppercase tracking-wider text-white shadow-sm">
            EasyTorent Featured
          </div>
        )}

        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={displayImages[currentImage]}
            alt={pg.name}
            className={cn(
              "h-full w-full object-cover transition-all duration-500",
              isHovered && "scale-105"
            )}
            onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Top Badges */}
          <div className="absolute left-2 top-2 flex gap-1">
            {pg.verified && (
              <Badge variant="secondary" className="h-5 border-0 bg-white/95 px-1.5 text-[10px] font-medium text-green-600 shadow-sm backdrop-blur">
                <Shield className="mr-0.5 h-2.5 w-2.5" />
                Verified
              </Badge>
            )}
            {pg.availableRooms && pg.availableRooms <= 2 && (
              <Badge variant="secondary" className="h-5 border-0 bg-orange-500/90 px-1.5 text-[10px] font-medium text-white shadow-sm">
                Only {pg.availableRooms} left
              </Badge>
            )}
          </div>

          {/* Type Badge */}
          <div className="absolute right-2 top-2">
            <Badge variant="secondary" className="border-0 bg-white/95 px-2 py-0.5 text-[10px] font-medium text-gray-700 shadow-sm backdrop-blur">
              {getTypeLabel(pg.type || 'co-ed')}
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="absolute right-2 top-12 flex flex-col gap-1.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={(e) => handleAuthAction('wishlist', e)}
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full transition-all hover:scale-110 shadow-sm",
                    isAuthenticated && isInWishlist(pg.id)
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-white/95 text-gray-700 hover:bg-white"
                  )}
                  aria-label="Add to wishlist"
                >
                  <Heart className={cn("h-3.5 w-3.5", isAuthenticated && isInWishlist(pg.id) && "fill-current")} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left" className="text-xs">
                <p>{isAuthenticated && isInWishlist(pg.id) ? "Remove from wishlist" : "Add to wishlist"}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={(e) => handleAuthAction('compare', e)}
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full transition-all hover:scale-110 shadow-sm",
                    isAuthenticated && isInCompare(pg.id)
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "bg-white/95 text-gray-700 hover:bg-white"
                  )}
                  aria-label="Compare property"
                >
                  {isAuthenticated && isInCompare(pg.id) ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <GitCompare className="h-3.5 w-3.5" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="left" className="text-xs">
                <p>{isAuthenticated && isInCompare(pg.id) ? "Remove from compare" : "Add to compare"}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Price Tag */}
          <div className="absolute bottom-2 right-2 rounded-md bg-white/95 px-2 py-1 shadow-sm backdrop-blur">
            <span className="text-sm font-bold text-primary">₹{pg.price.toLocaleString()}</span>
            <span className="text-[10px] text-muted-foreground">/month</span>
          </div>

          {/* Image Navigation */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentImage(prev => prev === 0 ? displayImages.length - 1 : prev - 1);
                }}
                className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white opacity-0 transition group-hover:opacity-100 hover:bg-black/70"
              >
                <ChevronLeft className="h-3 w-3" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentImage(prev => (prev + 1) % displayImages.length);
                }}
                className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white opacity-0 transition group-hover:opacity-100 hover:bg-black/70"
              >
                <ChevronRight className="h-3 w-3" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-2 left-2 rounded-full bg-black/50 px-1.5 py-0.5 text-[8px] text-white backdrop-blur">
              {currentImage + 1}/{displayImages.length}
            </div>
          )}
        </div>

        {/* Content Section */}
        <CardContent className="p-3">
          {/* Rating & Reviews */}
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5 rounded bg-yellow-50 px-1 py-0.5">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-semibold">{pg.rating?.toFixed(1) || '4.5'}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">
                ({pg.reviewCount || 0} reviews)
              </span>
            </div>
            
            {pg.minStay && (
              <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                <Clock className="h-2.5 w-2.5" />
                <span>Min {pg.minStay}</span>
              </div>
            )}
          </div>

          {/* Property Name */}
          <Link to={`/pg/${pg._id || pg.id}`} className="block" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-1 text-sm font-semibold leading-tight text-foreground hover:text-primary transition-colors line-clamp-1">
              {pg.name}
            </h3>
          </Link>

          {/* Location */}
          <div className="mb-2 flex items-start gap-1 text-[11px] text-muted-foreground">
            <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
            <span className="line-clamp-1">
              {pg.locality}, {pg.city}
              {pg.distance && <span className="ml-1 font-medium text-primary">• {pg.distance}</span>}
            </span>
          </div>

          {/* EasyTorent Badge */}
          <div className="mb-2 flex items-center gap-1">
            <Badge variant="outline" className="border-primary/20 bg-primary/5 px-1.5 py-0.5 text-[8px] font-medium text-primary">
              <Building className="mr-0.5 h-2.5 w-2.5" />
              EasyTorent Verified
            </Badge>
          </div>

          {/* Description */}
          <p className="mb-2 text-[11px] leading-relaxed text-muted-foreground line-clamp-1">
            {pg.description || 'Premium PG accommodation with modern amenities and comfortable living spaces.'}
          </p>

          {/* Amenities Grid */}
          <div className="mb-3 grid grid-cols-4 gap-1">
            {pg.wifi && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center gap-0.5 rounded bg-primary/5 p-1">
                    <Wifi className="h-3 w-3 text-primary" />
                    <span className="text-[8px] text-primary">WiFi</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="text-xs">
                  <p>High-speed WiFi available</p>
                </TooltipContent>
              </Tooltip>
            )}
            {pg.meals && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center gap-0.5 rounded bg-primary/5 p-1">
                    <Utensils className="h-3 w-3 text-primary" />
                    <span className="text-[8px] text-primary">Meals</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="text-xs">
                  <p>Home-cooked meals included</p>
                </TooltipContent>
              </Tooltip>
            )}
            {pg.ac && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center gap-0.5 rounded bg-primary/5 p-1">
                    <Wind className="h-3 w-3 text-primary" />
                    <span className="text-[8px] text-primary">A/C</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="text-xs">
                  <p>Air conditioned rooms</p>
                </TooltipContent>
              </Tooltip>
            )}
            {pg.parking && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center gap-0.5 rounded bg-primary/5 p-1">
                    <Car className="h-3 w-3 text-primary" />
                    <span className="text-[8px] text-primary">Parking</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="text-xs">
                  <p>Vehicle parking available</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Additional Amenities */}
          {pg.amenities && pg.amenities.length > 0 && (
            <div className="mb-3 flex flex-wrap items-center gap-1">
              <span className="text-[9px] font-medium text-muted-foreground">Amenities:</span>
              <div className="flex flex-wrap gap-1">
                {pg.amenities.slice(0, 2).map((item, idx) => (
                  <Badge key={idx} variant="outline" className="h-4 border-border/50 px-1 text-[8px] font-normal">
                    {item}
                  </Badge>
                ))}
                {pg.amenities.length > 2 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="outline" className="h-4 border-border/50 px-1 text-[8px] font-normal cursor-help">
                        +{pg.amenities.length - 2} more
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs">
                      <p>{pg.amenities.slice(2).join(', ')}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-7 border-muted-foreground/20 text-[11px] font-medium hover:bg-muted/50"
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
                className="h-7 w-full gap-1 bg-gradient-to-r from-orange-500 to-orange-600 px-0 text-[11px] font-medium hover:from-orange-600 hover:to-orange-700"
              >
                <Phone className="h-3 w-3" />
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
                className="h-7 w-full gap-1 bg-gradient-to-r from-green-500 to-green-600 px-0 text-[11px] font-medium text-white hover:from-green-600 hover:to-green-700"
              >
                <MessageCircle className="h-3 w-3" />
                Chat
              </Button>
            </a>
          </div>

          {/* EasyTorent Footer */}
          <div className="mt-2 flex items-center justify-between border-t border-border/50 pt-2 text-[9px] text-muted-foreground">
            <span className="flex items-center gap-0.5">
              <Building className="h-2.5 w-2.5" />
              <span className="font-medium text-foreground">EasyTorent</span>
            </span>
            <span className="text-[8px]">Listed on EasyTorent</span>
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