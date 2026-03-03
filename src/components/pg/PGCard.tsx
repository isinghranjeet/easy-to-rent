/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
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
  MessageCircle
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCompare } from '@/contexts/CompareContext';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/AuthModal';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface BackendPG {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  gallery?: string[];
  city: string;
  locality: string;
  type: 'boys' | 'girls' | 'co-ed' | 'family';
  amenities: string[];
  rating: number;
  reviewCount: number;
  ownerName?: string;
  ownerPhone?: string;
  featured: boolean;
  verified: boolean;
  wifi: boolean;
  meals: boolean;
  ac: boolean;
  parking: boolean;
  distance?: string;
  location?: string;
}

interface PGCardProps {
  pg: BackendPG;
  index?: number;
}

const DEFAULT_PHONE = '9315058665';

export function PGCard({ pg, index = 0 }: PGCardProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'wishlist' | 'compare' | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Combine main images and gallery for display
  const allImages = [...(pg.images || []), ...(pg.gallery || [])].filter(Boolean);
  const displayImages = allImages.length > 0 ? allImages : ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80'];
  
  // Get context values
  const { isAuthenticated, user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, toggleCompare, maxCompareLimit } = useCompare();

  // Create memoized versions of the check functions
  const isWishlisted = useCallback(() => isInWishlist(pg.id), [isInWishlist, pg.id]);
  const isCompared = useCallback(() => isInCompare(pg.id), [isInCompare, pg.id]);

  const phoneNumber = pg.ownerPhone || DEFAULT_PHONE;
  const whatsappNumber = phoneNumber.replace(/\D/g, '');
  
  const whatsappMessage = `Hi, I'm interested in your PG "${pg.name}" listed on PG Finder.
  
📍 Location: ${pg.city}${pg.locality ? `, ${pg.locality}` : ''}
💰 Price: ₹${pg.price}/month
📞 Contact me for more details!`;
  
  const whatsappUrl = `https://wa.me/91${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  const callUrl = `tel:${phoneNumber}`;

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % displayImages.length);
  };
  
  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    target.style.display = 'none';
    const parent = target.parentElement;
    if (parent) {
      parent.innerHTML = `
        <div class="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
          <div class="text-center">
            <div class="mx-auto mb-2 h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
              <span class="text-3xl">🏠</span>
            </div>
            <p class="text-sm text-muted-foreground">Image not available</p>
          </div>
        </div>
      `;
    }
  };

  const handleContactClick = async (type: 'call' | 'whatsapp') => {
    setIsLoading(true);
    
    try {
      await fetch('/api/analytics/contact-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pgId: pg.id,
          pgName: pg.name,
          contactType: type,
          timestamp: new Date().toISOString(),
        }),
      });
      
      toast({
        title: "Contacting PG Owner",
        description: `Redirecting to ${type === 'call' ? 'phone' : 'WhatsApp'}...`,
      });
    } catch (error) {
      console.error('Analytics error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle wishlist toggle with auth check
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      setPendingAction('wishlist');
      setShowAuthModal(true);
      return;
    }
    
    performWishlistToggle();
  };

  const performWishlistToggle = () => {
    const currentWishlistState = isWishlisted();
    const newWishlistState = !currentWishlistState;
    
    try {
      toggleWishlist(pg.id);
      
      toast({
        title: newWishlistState ? "Added to Wishlist" : "Removed from Wishlist",
        description: newWishlistState 
          ? `${pg.name} added to your wishlist`
          : `${pg.name} removed from your wishlist`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update wishlist",
        variant: "destructive",
      });
    }
  };

  // Handle compare toggle with auth check
  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      setPendingAction('compare');
      setShowAuthModal(true);
      return;
    }
    
    performCompareToggle();
  };

  const performCompareToggle = () => {
    const currentCompareState = isCompared();
    const newCompareState = !currentCompareState;
    
    try {
      toggleCompare(pg.id);
      
      toast({
        title: newCompareState ? "Added to Compare" : "Removed from Compare",
        description: newCompareState
          ? `${pg.name} added to comparison`
          : `${pg.name} removed from comparison`,
      });
    } catch (error: any) {
      toast({
        title: "Compare Limit Reached",
        description: error.message || `Cannot add more than ${maxCompareLimit} items`,
        variant: "destructive",
      });
    }
  };

  // Handle successful login
  const handleAuthSuccess = () => {
    if (pendingAction === 'wishlist') {
      performWishlistToggle();
    } else if (pendingAction === 'compare') {
      performCompareToggle();
    }
    setPendingAction(null);
  };

  return (
    <>
      <div
        className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:shadow-lg animate-fade-in"
        style={{ animationDelay: `${index * 100}ms` }}
        data-pg-id={pg.id}
      >
        {/* IMAGE SECTION */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
          {displayImages && displayImages.length > 0 ? (
            <>
              <img
                src={displayImages[currentImage]}
                alt={pg.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={handleImageError}
                loading="lazy"
              />
              
              {/* Image counter */}
              {displayImages.length > 1 && (
                <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                  {currentImage + 1}/{displayImages.length}
                </div>
              )}
              
              {/* Image navigation */}
              {displayImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Image indicators */}
              {displayImages.length > 1 && (
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                  {displayImages.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full transition-all ${
                        index === currentImage 
                          ? 'w-4 bg-white' 
                          : 'w-1.5 bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-3 h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-3xl">🏠</span>
                </div>
                <p className="text-sm text-muted-foreground">No image available</p>
              </div>
            </div>
          )}

          {/* TOP BADGES */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {pg.featured && (
              <Badge className="bg-yellow-500 text-white border-none">
                ⭐ Featured
              </Badge>
            )}
            {pg.verified && (
              <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                <Shield className="h-3 w-3 mr-1" /> Verified
              </Badge>
            )}
          </div>

          {/* TYPE BADGE */}
          <div className="absolute top-3 right-3">
            <span className={`rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-sm ${
              pg.type === 'boys' 
                ? 'bg-blue-500/90 text-white' 
                : pg.type === 'girls' 
                ? 'bg-pink-500/90 text-white' 
                : pg.type === 'co-ed'
                ? 'bg-purple-500/90 text-white'
                : 'bg-green-500/90 text-white'
            }`}>
              {pg.type === 'boys' ? '👨 Boys' : 
               pg.type === 'girls' ? '👩 Girls' : 
               pg.type === 'co-ed' ? '👥 Co-ed' : 
               '👪 Family'}
            </span>
          </div>

          {/* ACTION BUTTONS */}
          <div className="absolute top-14 right-3 flex flex-col gap-2">
            <button
              onClick={handleWishlistToggle}
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                isAuthenticated && isWishlisted()
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-white/90 hover:bg-white text-gray-700'
              )}
              aria-label={isAuthenticated && isWishlisted() ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                className={cn(
                  'h-4 w-4 transition-all',
                  isAuthenticated && isWishlisted() && 'fill-current'
                )}
              />
            </button>

            <button
              onClick={handleCompareToggle}
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center transition-all',
                isAuthenticated && isCompared()
                  ? 'bg-primary text-white hover:bg-primary/90'
                  : 'bg-white/90 hover:bg-white text-gray-700'
              )}
              aria-label={isAuthenticated && isCompared() ? "Remove from compare" : "Add to compare"}
            >
              {isAuthenticated && isCompared() ? (
                <Check className="h-4 w-4" />
              ) : (
                <GitCompare className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* PRICE BADGE */}
          <div className="absolute bottom-3 right-3 bg-background/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
            <div className="text-center">
              <span className="font-bold text-lg">₹{pg.price.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground block">per month</span>
            </div>
          </div>
        </div>

        {/* CONTENT SECTION */}
        <div className="p-5">
          {/* RATING */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span className="font-semibold">{pg.rating?.toFixed(1) || '0.0'}</span>
              <span className="text-sm text-muted-foreground">
                ({pg.reviewCount || 0} reviews)
              </span>
            </div>
          </div>

          {/* TITLE & LOCATION */}
          <Link to={`/pg/${pg.slug}`}>
            <h3 className="font-display text-xl font-semibold text-foreground hover:text-primary transition-colors line-clamp-1 mb-2">
              {pg.name}
            </h3>
          </Link>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">
              {pg.locality && `${pg.locality}, `}{pg.city}
              {pg.distance && ` • ${pg.distance}`}
            </span>
          </div>

          {/* DESCRIPTION */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {pg.description || 'No description available'}
          </p>

          {/* AMENITIES */}
          <div className="mb-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2 flex-wrap">
              {pg.wifi && (
                <div className="flex items-center gap-1">
                  <Wifi className="h-4 w-4" />
                  <span className="text-xs">WiFi</span>
                </div>
              )}
              {pg.meals && (
                <div className="flex items-center gap-1">
                  <Utensils className="h-4 w-4" />
                  <span className="text-xs">Meals</span>
                </div>
              )}
              {pg.ac && (
                <div className="flex items-center gap-1">
                  <Wind className="h-4 w-4" />
                  <span className="text-xs">AC</span>
                </div>
              )}
              {pg.parking && (
                <div className="flex items-center gap-1">
                  <Car className="h-4 w-4" />
                  <span className="text-xs">Parking</span>
                </div>
              )}
            </div>
            
            {/* Additional amenities preview */}
            {pg.amenities && pg.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {pg.amenities.slice(0, 3).map((amenity, idx) => (
                  <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    {amenity}
                  </span>
                ))}
                {pg.amenities.length > 3 && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    +{pg.amenities.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="grid grid-cols-3 gap-2">
            <Link to={`/pg/${pg.slug}`}>
              <Button variant="outline" className="w-full">
                View
              </Button>
            </Link>

            <a
              href={callUrl}
              onClick={() => handleContactClick('call')}
              className="flex-1"
            >
              <Button 
                variant="default" 
                className="w-full gap-2 bg-orange-600 hover:bg-orange-700"
                disabled={isLoading}
              >
                <Phone className="h-4 w-4" />
                Call
              </Button>
            </a>

            <a
              href={whatsappUrl}
              onClick={() => handleContactClick('whatsapp')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button 
                className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white"
                disabled={isLoading}
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setPendingAction(null);
        }}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}