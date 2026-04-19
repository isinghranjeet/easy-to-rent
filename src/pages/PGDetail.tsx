import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Star, Phone, MessageCircle, Navigation, Route,
  Wifi, Utensils, Wind, Car, Shield, Zap, Dumbbell, BookOpen,
  Check, ChevronLeft, ChevronRight, X, Calendar, Clock, Users,
  TrendingUp, Home, Crown,
  BadgeCheck, Users as UsersIcon, Building,
  Bus, Train, Coffee, ShoppingBag, Hospital, School, Landmark
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AirbnbMap } from '@/components/map/AirbnbMap';
import { PriceAlertButton } from '@/components/pg/PriceAlertButton';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const amenityIcons: Record<string, React.ElementType> = {
  'WiFi': Wifi,
  'Meals': Utensils,
  'AC': Wind,
  'Parking': Car,
  'CCTV': Shield,
  'Power Backup': Zap,
  'Gym': Dumbbell,
  'Study Room': BookOpen,
  'Laundry': Shield,
  '24/7 Security': Shield,
  'Hot Water': Utensils,
  'TV': Home,
  'Refrigerator': Home,
  'Geyser': Zap,
  'Cooking': Utensils,
  'Water Purifier': Utensils,
  'Housekeeping': Shield,
};

interface Location {
  type: string;
  coordinates: number[];
  address: string;
  placeId?: string;
}

interface NearbyPlace {
  name: string;
  type: string;
  distance: string;
  duration?: string;
}

interface PGListing {
  _id: string;
  name: string;
  description: string;
  city: string;
  address: string;
  price: number;
  type: 'boys' | 'girls' | 'co-ed' | 'family';
  images: string[];
  amenities: string[];
  verified: boolean;
  featured: boolean;
  rating: number;
  reviewCount: number;
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  createdAt: string;
  distance?: string;
  published?: boolean;
  locality?: string;
  roomTypes?: string[];
  slug?: string;
  location?: Location;
  nearbyPlaces?: NearbyPlace[];
  coordinates?: { lat: number; lng: number };
}

interface DemandMeterData {
  views: number;
  weeklyBookings: number;
  monthlyBookings: number;
  rating: number;
  reviewCount: number;
  demandLevel: string;
  demandColor: string;
  demandPercentage: number;
  demandMessage: string;
}

const PGDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [currentImage, setCurrentImage] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedRoom, setSelectedRoom] = useState(0);
  const [bookingMonths, setBookingMonths] = useState(3);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    moveInDate: '',
  });
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [nearbyLocations, setNearbyLocations] = useState<any[]>([]);
  
  const [pg, setPg] = useState<PGListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [similarPGs, setSimilarPGs] = useState<any[]>([]);
  const [nearbyPGs, setNearbyPGs] = useState<any[]>([]);
  
  const [demandData, setDemandData] = useState<DemandMeterData>({
    views: 0,
    weeklyBookings: 0,
    monthlyBookings: 0,
    rating: 4.5,
    reviewCount: 0,
    demandLevel: 'Medium',
    demandColor: 'bg-yellow-500',
    demandPercentage: 60,
    demandMessage: '📈 Good interest in this property. Check availability.'
  });
  const [loadingDemand, setLoadingDemand] = useState(true);

  const STATIC_PHONE = '9315058665';

  const fetchDemandData = async (pgId: string) => {
    try {
      setLoadingDemand(true);
      const response = await api.request(`/api/pg/${pgId}/demand-meter`);
      if (response.success && response.data) {
        setDemandData(response.data);
      }
    } catch (error) {
      console.error('Error fetching demand data:', error);
    } finally {
      setLoadingDemand(false);
    }
  };

  const incrementViewCount = async (pgId: string) => {
    try {
      await api.request(`/api/pg/${pgId}/increment-view`, { method: 'POST' });
    } catch (error) {
      console.error('Error incrementing view:', error);
    }
  };

  useEffect(() => {
    if (!slug) {
      setError("No PG identifier provided");
      setLoading(false);
      return;
    }

    const fetchPG = async () => {
      try {
        setLoading(true);
        setError(null);

        let response;
        
        try {
          response = await api.request<any>(`/api/pg/slug/${slug}`);
        } catch (slugError) {
          if (slug.match(/^[0-9a-fA-F]{24}$/)) {
            response = await api.request<any>(`/api/pg/${slug}`);
          } else {
            throw new Error('PG not found');
          }
        }
        
        if (response?.data) {
          setPg(response.data);
          await fetchDemandData(response.data._id);
          await incrementViewCount(response.data._id);
          
          if (response.data.city) {
            fetchSimilarPGs(response.data.city, response.data._id);
            fetchNearbyLocations(response.data.city);
            fetchNearbyPGs(response.data.city, response.data._id);
          }
        } else if (response?.success === false) {
          throw new Error(response.message || "Failed to load PG");
        } else if (response) {
          setPg(response);
          if (response.city) {
            fetchSimilarPGs(response.city, response._id);
            fetchNearbyLocations(response.city);
            fetchNearbyPGs(response.city, response._id);
          }
        } else {
          throw new Error("No data received from server");
        }
      } catch (error) {
        console.error("Error fetching PG:", error);
        setError(error instanceof Error ? error.message : "Failed to load PG details");
      } finally {
        setLoading(false);
      }
    };

    fetchPG();
  }, [slug]);

  const fetchSimilarPGs = async (city: string, currentId: string) => {
    try {
      const response = await api.getPGs({ city, limit: 4 });
      if (response.success && response.data?.items) {
        const filtered = response.data.items.filter((pg: any) => pg._id !== currentId);
        setSimilarPGs(filtered);
      }
    } catch (error) {
      console.error("Error fetching similar PGs:", error);
    }
  };

  const fetchNearbyPGs = async (city: string, currentId: string) => {
    try {
      const response = await api.getPGs({ city, limit: 20 });
      if (response.success && response.data?.items) {
        const filtered = response.data.items.filter((pg: any) => pg._id !== currentId);
        setNearbyPGs(filtered);
      }
    } catch (error) {
      console.error("Error fetching nearby PGs:", error);
    }
  };

  const fetchNearbyLocations = async (city: string) => {
    try {
      const response = await api.getLocations({ search: city, limit: 5 });
      if (response.success && response.data?.locations) {
        setNearbyLocations(response.data.locations);
      }
    } catch (error) {
      console.error("Error fetching nearby locations:", error);
    }
  };
  
  useEffect(() => {
    if (pg) {
      const basePrice = pg.price;
      const discount = bookingMonths >= 6 ? 15 : bookingMonths >= 3 ? 10 : 0;
      const calculated = basePrice * bookingMonths * ((100 - discount) / 100);
      setCalculatedPrice(Math.round(calculated));
      setTotalSavings(basePrice * bookingMonths - calculated);
    }
  }, [pg, bookingMonths]);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const message = encodeURIComponent(
      `*New Booking Request*\n\n` +
      `*PG:* ${pg?.name}\n` +
      `*Location:* ${pg?.address}\n` +
      `*Price:* ₹${pg?.price}/month\n` +
      `*Duration:* ${bookingMonths} months\n` +
      `*Total:* ₹${calculatedPrice}\n\n` +
      `*Guest Details:*\n` +
      `*Name:* ${bookingData.name}\n` +
      `*Phone:* ${bookingData.phone}\n` +
      `*Email:* ${bookingData.email}\n` +
      `*Move-in Date:* ${bookingData.moveInDate}\n` +
      `*Message:* ${bookingData.message || 'No additional message'}`
    );
    
    window.open(`https://wa.me/91${STATIC_PHONE}?text=${message}`, '_blank');
    
    toast.success('Redirecting to WhatsApp for booking!');
    setShowBookingForm(false);
    setBookingData({
      name: '',
      phone: '',
      email: '',
      message: '',
      moveInDate: '',
    });
  };

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(
      `Hello,\n\nI'm interested in your PG:\n` +
      `• Name: ${pg?.name}\n` +
      `• Location: ${pg?.address}\n` +
      `• Price: ₹${pg?.price}/month\n\n` +
      `Please provide more information.`
    );
    window.open(`https://wa.me/91${STATIC_PHONE}?text=${message}`, '_blank');
    toast.success('Opening WhatsApp chat');
  };

  const handlePhoneCall = () => {
    window.location.href = `tel:${STATIC_PHONE}`;
    toast.success('Connecting you to the owner...');
  };

  const viewOnMap = () => {
    if (!pg) return;
    const address = encodeURIComponent(pg.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
    toast.info('Opening location on Google Maps');
  };

  const getDirections = () => {
    if (!pg) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(pg.address)}`;
    window.open(url, '_blank');
    toast.info('Getting directions to this property');
  };

  const roomDetails = pg?.roomTypes?.map((type, index) => ({
    type,
    price: pg.price * (index === 0 ? 1 : index === 1 ? 0.7 : 0.5),
    size: index === 0 ? '120 sq ft' : index === 1 ? '180 sq ft' : '220 sq ft',
    available: Math.floor(Math.random() * 5) + 1,
    description: `${type} occupancy room with basic amenities`
  })) || (pg ? [
    { 
      type: 'Single Occupancy', 
      price: pg.price, 
      size: '120 sq ft', 
      available: 3,
      description: 'Private room with attached bathroom, study table, and wardrobe'
    },
    { 
      type: 'Double Occupancy', 
      price: pg.price * 0.7, 
      size: '180 sq ft', 
      available: 5,
      description: 'Shared room for 2 people with separate beds and storage'
    },
    { 
      type: 'Triple Occupancy', 
      price: pg.price * 0.5, 
      size: '220 sq ft', 
      available: 2,
      description: 'Shared room for 3 people, economical option'
    },
  ] : []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-orange-50/50">
        <Navbar />
        <main className="flex-1 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
              <p className="text-muted-foreground">Loading PG details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !pg) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-orange-50/50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
              <Home className="h-12 w-12 text-orange-600" />
            </div>
            <h1 className="font-display text-3xl font-bold text-gray-900 mb-4">
              {error ? "Error Loading PG" : "PG Not Found"}
            </h1>
            <p className="text-gray-600 mb-8 max-w-md">
              {error || "The PG accommodation you're looking for doesn't exist or has been removed."}
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/pg">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  Back to Listings
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="border-orange-300">
                  Go Home
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-orange-50/50">
      <Navbar />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/pg" className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to listings
            </Link>
            <div className="flex items-center gap-4">
              {pg.city && (
                <Link to={`/location/${pg.city.toLowerCase().replace(/ /g, '-')}`}>
                  <Badge className="bg-orange-100 text-orange-700 border-orange-200 cursor-pointer hover:bg-orange-200">
                    <MapPin className="h-3 w-3 mr-1" />
                    More in {pg.city}
                  </Badge>
                </Link>
              )}
              <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                <TrendingUp className="h-3 w-3 mr-1" />
                Trending at CU
              </Badge>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="container mx-auto px-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[400px] md:h-[500px]">
            <div 
              className="md:col-span-2 md:row-span-2 relative rounded-2xl overflow-hidden cursor-pointer group"
              onClick={() => setShowGallery(true)}
            >
              <img
                src={pg.images[0] || '/placeholder-image.jpg'}
                alt={pg.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            
            {pg.images.slice(1, 4).map((image, index) => (
              <div 
                key={index}
                className="hidden md:block relative rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => {
                  setCurrentImage(index + 1);
                  setShowGallery(true);
                }}
              >
                <img
                  src={image || '/placeholder-image.jpg'}
                  alt={`${pg.name} ${index + 2}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ✅ VIRTUAL TOUR SECTION */}
        {(pg.videoUrl || pg.virtualTour) && (
          <div className="container mx-auto px-4 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <div className="p-4 border-b bg-gradient-to-r from-orange-50 to-red-50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <svg className="h-4 w-4 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M10 8.64L15.27 12 10 15.36V8.64zM8 5v14l11-7-11-7z"/>
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Virtual Tour</h2>
                  <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded-full font-medium">HD</span>
                </div>
                <p className="text-sm text-gray-600 mt-1 ml-10">
                  Take a virtual walkthrough of this property
                </p>
              </div>
              <div className="relative pb-[56.25%] h-0 bg-black">
                <iframe
                  src={pg.videoUrl ? pg.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/') : pg.virtualTour}
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                  title="Virtual Tour of PG"
                />
              </div>
              <div className="p-3 bg-gray-50 text-center text-xs text-gray-500">
                🎬 Watch this video to get a complete view of the property
              </div>
            </div>
          </div>
        )}

        {/* Gallery Modal */}
        {showGallery && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
            <button
              onClick={() => setShowGallery(false)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center z-10 hover:bg-white/20 transition-colors"
            >
              <X className="h-6 w-6 text-white" />
            </button>
            
            <button
              onClick={() => setCurrentImage((prev) => (prev === 0 ? pg.images.length - 1 : prev - 1))}
              className="absolute left-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            
            <div className="relative">
              <img
                src={pg.images[currentImage] || '/placeholder-image.jpg'}
                alt={`${pg.name} ${currentImage + 1}`}
                className="max-h-[80vh] max-w-[90vw] object-contain rounded-xl"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="text-white text-sm">
                  {currentImage + 1} / {pg.images.length}
                </span>
              </div>
            </div>
            
            <button
              onClick={() => setCurrentImage((prev) => (prev === pg.images.length - 1 ? 0 : prev + 1))}
              className="absolute right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge className={cn(
                    "text-sm py-1 px-3",
                    pg.type === 'boys' ? 'bg-blue-100 text-blue-700' : 
                    pg.type === 'girls' ? 'bg-pink-100 text-pink-700' : 
                    'bg-purple-100 text-purple-700'
                  )}>
                    {pg.type === 'co-ed' ? 'Co-Ed' : pg.type.charAt(0).toUpperCase() + pg.type.slice(1)}
                  </Badge>
                  {pg.verified && (
                    <Badge className="bg-green-100 text-green-700 gap-1">
                      <BadgeCheck className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                  {pg.featured && (
                    <Badge className="bg-orange-100 text-orange-700 gap-1">
                      <Crown className="h-3 w-3" />
                      Featured
                    </Badge>
                  )}
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  {pg.name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
                  <Link to={`/location/${pg.city?.toLowerCase().replace(/ /g, '-')}`} className="flex items-center gap-2 hover:text-orange-600 transition-colors">
                    <MapPin className="h-4 w-4 text-orange-600" />
                    <span className="font-medium">{pg.address}</span>
                  </Link>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-gray-900">{demandData.rating || pg.rating || 4.5}</span>
                    <span>({demandData.reviewCount || pg.reviewCount || 0} reviews)</span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-orange-50 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-orange-600">₹{pg.price.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Per Month</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-blue-600">{pg.distance || 'Near CU'}</div>
                    <div className="text-sm text-gray-600">From CU</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-green-600">{roomDetails.length}</div>
                    <div className="text-sm text-gray-600">Room Types</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-purple-600">{pg.amenities.length}+</div>
                    <div className="text-sm text-gray-600">Amenities</div>
                  </div>
                </div>

                {/* REAL-TIME DEMAND METER */}
                {!loadingDemand ? (
                  <div className={`mt-6 bg-gradient-to-r ${demandData.demandLevel === 'Very High' ? 'from-red-50 to-orange-50' : demandData.demandLevel === 'High' ? 'from-orange-50 to-red-50' : 'from-yellow-50 to-orange-50'} rounded-xl p-4`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">🔥 Demand Meter</span>
                      <span className={`text-sm font-bold px-2 py-0.5 rounded-full text-white ${
                        demandData.demandColor === 'bg-red-500' ? 'bg-red-500' : 
                        demandData.demandColor === 'bg-orange-500' ? 'bg-orange-500' : 
                        demandData.demandColor === 'bg-yellow-500' ? 'bg-yellow-600' : 'bg-green-500'
                      }`}>
                        {demandData.demandLevel} Demand
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${demandData.demandColor} h-2 rounded-full transition-all duration-500`} 
                        style={{ width: `${demandData.demandPercentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>👁️ {demandData.views} views today</span>
                      <span>📅 {demandData.weeklyBookings} booked this week</span>
                      <span>⭐ {demandData.rating} rating</span>
                    </div>
                    <p className={`text-xs mt-2 ${
                      demandData.demandLevel === 'Very High' ? 'text-red-600' : 
                      demandData.demandLevel === 'High' ? 'text-orange-600' : 'text-yellow-600'
                    }`}>
                      {demandData.demandMessage}
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 bg-gray-100 rounded-xl p-4 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-2 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                )}
              </div>

              {/* Tabs */}
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-xl">
                  <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="amenities" className="rounded-lg data-[state=active]:bg-white">
                    Amenities
                  </TabsTrigger>
                  <TabsTrigger value="rooms" className="rounded-lg data-[state=active]:bg-white">
                    Rooms
                  </TabsTrigger>
                  <TabsTrigger value="location" className="rounded-lg data-[state=active]:bg-white">
                    Location
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <div className="bg-white rounded-xl p-6 border">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">About this PG</h2>
                    <p className="text-gray-700 mb-6">{pg.description || "No description available."}</p>
                    
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Key Features</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {pg.amenities.slice(0, 6).map((amenity, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-gray-600">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="amenities" className="mt-6">
                  <div className="bg-white rounded-xl p-6 border">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">All Amenities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {pg.amenities.map((amenity) => {
                        const Icon = amenityIcons[amenity] || Check;
                        return (
                          <div key={amenity} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 rounded-lg bg-white border flex items-center justify-center">
                              <Icon className="h-5 w-5 text-orange-600" />
                            </div>
                            <span className="font-medium text-gray-900">{amenity}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="rooms" className="mt-6">
                  <div className="bg-white rounded-xl p-6 border">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Available Rooms</h2>
                    <div className="space-y-4">
                      {roomDetails.map((room, index) => (
                        <div 
                          key={index}
                          className={cn(
                            "border rounded-xl p-4 transition-all cursor-pointer",
                            selectedRoom === index 
                              ? "border-orange-500 bg-orange-50" 
                              : "border-gray-200 hover:border-orange-300"
                          )}
                          onClick={() => setSelectedRoom(index)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-bold text-lg text-gray-900">{room.type}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={cn(
                                  "text-xs",
                                  room.available > 2 ? "bg-green-100 text-green-700" :
                                  room.available > 0 ? "bg-yellow-100 text-yellow-700" :
                                  "bg-red-100 text-red-700"
                                )}>
                                  {room.available} available
                                </Badge>
                                <span className="text-sm text-gray-600">{room.size}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-gray-900">₹{room.price.toLocaleString()}</div>
                              <div className="text-sm text-gray-600">per month</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="location" className="mt-6">
                  <div className="bg-white rounded-xl p-6 border">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Location</h2>
                    
                    <div className="mb-8 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-6 w-6 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-lg">Property Address</h3>
                          <p className="text-gray-700 mt-1">{pg.address}</p>
                          <p className="text-gray-600 mt-1">{pg.locality || pg.city} • {pg.city}</p>
                          <div className="flex items-center gap-2 mt-3">
                            <Badge className="bg-orange-100 text-orange-700">
                              <MapPin className="h-3 w-3 mr-1" />
                              {pg.distance || 'Near Chandigarh University'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-8">
                      <Button 
                        onClick={viewOnMap}
                        className="bg-orange-600 hover:bg-orange-700 gap-2"
                      >
                        <Navigation className="h-4 w-4" />
                        View on Maps
                      </Button>
                      <Button 
                        onClick={getDirections}
                        variant="outline"
                        className="border-orange-300 hover:bg-orange-50 gap-2"
                      >
                        <Route className="h-4 w-4" />
                        Get Directions
                      </Button>
                    </div>

                    {nearbyPGs.length > 0 && (
                      <div className="mb-8">
                        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-orange-600" />
                          Nearby PGs in {pg.city}
                        </h3>
                        <div className="h-[400px] rounded-xl overflow-hidden border">
                          <AirbnbMap 
                            listings={[{ ...pg, coordinates: pg.coordinates }, ...nearbyPGs]}
                            loading={false}
                          />
                        </div>
                      </div>
                    )}

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        Estimated Travel Times
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600">To City Center</p>
                          <p className="font-bold text-gray-900">10-15 min drive</p>
                        </div>
                        <div>
                          <p className="text-gray-600">To Railway Station</p>
                          <p className="font-bold text-gray-900">20-25 min drive</p>
                        </div>
                        <div>
                          <p className="text-gray-600">To Airport</p>
                          <p className="font-bold text-gray-900">30-35 min drive</p>
                        </div>
                        <div>
                          <p className="text-gray-600">To Market</p>
                          <p className="font-bold text-gray-900">5-10 min walk</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {similarPGs.length > 0 && (
                <div className="bg-white rounded-xl p-6 border">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Similar PGs in {pg.city}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {similarPGs.map((similarPG) => (
                      <Link 
                        key={similarPG._id} 
                        to={`/pg/${similarPG.slug || similarPG._id}`}
                        className="flex gap-3 p-3 border rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all"
                      >
                        <img 
                          src={similarPG.images?.[0] || '/placeholder-image.jpg'} 
                          alt={similarPG.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">{similarPG.name}</h3>
                          <p className="text-sm text-gray-600">{similarPG.address}</p>
                          <p className="text-orange-600 font-bold mt-1">₹{similarPG.price}/month</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <Link to={`/location/${pg.city?.toLowerCase().replace(/ /g, '-')}`}>
                      <Button variant="outline" className="border-orange-300 text-orange-600">
                        View all {pg.city} PGs →
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {nearbyLocations.length > 0 && (
                <div className="bg-white rounded-xl p-6 border">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Explore Nearby Areas</h2>
                  <div className="flex flex-wrap gap-2">
                    {nearbyLocations.map((loc) => (
                      <Link key={loc.slug} to={`/location/${loc.slug}`}>
                        <Badge className="bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-700 cursor-pointer transition-colors px-3 py-1">
                          {loc.name} ({loc.pgCount} PGs)
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Contact & Booking */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border sticky top-24">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{pg.price.toLocaleString()}
                    </span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Duration</span>
                      <span className="text-sm font-bold text-orange-600">{bookingMonths} months</span>
                    </div>
                    <Slider
                      value={[bookingMonths]}
                      min={1}
                      max={12}
                      step={1}
                      onValueChange={([value]) => setBookingMonths(value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Base ({bookingMonths} months)</span>
                      <span className="font-medium">₹{(pg.price * bookingMonths).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-medium text-green-600">-₹{totalSavings.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-orange-600">₹{calculatedPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <PriceAlertButton 
                    pgId={pg._id} 
                    currentPrice={pg.price}
                    pgName={pg.name}
                  />
                </div>

                <Button 
                  onClick={() => setShowBookingForm(true)} 
                  size="lg" 
                  className="w-full bg-orange-600 hover:bg-orange-700 gap-2 mb-4 text-lg font-semibold"
                >
                  <Calendar className="h-5 w-5" />
                  Book Now
                </Button>

                <div className="space-y-3 mb-6">
                  <Button 
                    onClick={handlePhoneCall} 
                    size="lg" 
                    className="w-full bg-green-600 hover:bg-green-700 gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    Call Owner
                  </Button>
                  
                  <Button 
                    onClick={handleWhatsAppContact} 
                    variant="outline" 
                    size="lg"
                    className="w-full border-green-600 text-green-700 hover:bg-green-50 gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </Button>
                </div>

                <div className="pt-6 border-t">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center">
                      <UsersIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{pg.ownerName || 'Property Owner'}</p>
                      <p className="text-gray-600 text-sm">Property Manager</p>
                    </div>
                  </div>
                  
                  <div className="text-center border-t pt-4">
                    <p className="text-sm text-gray-600 mb-2">Contact for inquiries:</p>
                    <p className="text-sm text-gray-500">Available 24/7 for your queries</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-white rounded-xl p-4 border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Quick Response</p>
                      <p className="text-xs text-gray-600">Usually within 30 min</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-4 border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Verified PG</p>
                      <p className="text-xs text-gray-600">100% authentic listing</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Book Your Room</h2>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div className="mb-6 p-4 bg-orange-50 rounded-lg">
                <h3 className="font-bold text-gray-900">{pg.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{pg.address}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-medium">Selected Room:</span>
                  <span className="font-bold text-orange-600">{roomDetails[selectedRoom].type}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm font-medium">Duration:</span>
                  <span className="font-bold text-orange-600">{bookingMonths} months</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm font-medium">Total Amount:</span>
                  <span className="font-bold text-orange-600">₹{calculatedPrice.toLocaleString()}</span>
                </div>
              </div>
              
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={bookingData.name}
                    onChange={(e) => setBookingData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={bookingData.phone}
                    onChange={(e) => setBookingData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={bookingData.email}
                    onChange={(e) => setBookingData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Move-in Date *
                  </label>
                  <input
                    type="date"
                    value={bookingData.moveInDate}
                    onChange={(e) => setBookingData(prev => ({ ...prev, moveInDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 outline-none"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Message
                  </label>
                  <textarea
                    value={bookingData.message}
                    onChange={(e) => setBookingData(prev => ({ ...prev, message: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 outline-none"
                    placeholder="Any specific requirements or questions..."
                  />
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800 flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Your booking request will be sent via WhatsApp to the owner
                  </p>
                </div>
                
                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                  Confirm Booking via WhatsApp
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PGDetail;