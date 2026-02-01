import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Star, Heart, Share2, Phone, 
  Wifi, Utensils, Wind, Car, Shield, Zap, Dumbbell, BookOpen,
  Check, ChevronLeft, ChevronRight, X, Calendar, Clock, Users,
  Download, MessageCircle, Navigation,
  TrendingUp, Home, Mail, PhoneCall, Crown,
  BadgeCheck, Users as UsersIcon, Building, Route
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
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
  'TV': MessageCircle,
  'Refrigerator': Home,
  'Geyser': Zap,
  'Cooking': Utensils,
  'Water Purifier': Utensils,
  'Housekeeping': Shield,
};

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
}

const PGDetail = () => {
  const { id } = useParams();
  const [currentImage, setCurrentImage] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedRoom, setSelectedRoom] = useState(0);
  const [bookingMonths, setBookingMonths] = useState(3);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactData, setContactData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    visitDate: '',
  });
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [availabilityPercentage, setAvailabilityPercentage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Use mock data instead of API for now
  const [pg, setPg] = useState<PGListing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with timeout
    const timer = setTimeout(() => {
      loadMockData();
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [id]);

  useEffect(() => {
    if (pg) {
      const basePrice = pg.price;
      const discount = bookingMonths >= 6 ? 15 : bookingMonths >= 3 ? 10 : 0;
      const calculated = basePrice * bookingMonths * ((100 - discount) / 100);
      setCalculatedPrice(Math.round(calculated));
      setTotalSavings(basePrice * bookingMonths - calculated);
      
      const availability = Math.min(100, Math.max(10, Math.random() * 100));
      setAvailabilityPercentage(availability);
      
      const favorites = JSON.parse(localStorage.getItem('pgFavorites') || '[]');
      setIsFavorite(favorites.includes(pg._id));
    }
  }, [pg, bookingMonths]);

  const loadMockData = () => {
    const mockPG: PGListing = {
      _id: id || 'mock-id-123',
      name: 'Premium CU PG Accommodation',
      description: 'Luxurious PG accommodation located near Chandigarh University Gate 1. Features spacious rooms, high-speed WiFi, nutritious meals, and 24/7 security. Perfect for students looking for a comfortable and safe living environment.',
      city: 'Chandigarh',
      address: 'Gate 1, Chandigarh University Road, Gharuan, Punjab',
      price: 8500,
      type: 'co-ed',
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80'
      ],
      amenities: ['WiFi', 'AC', 'Meals', 'Parking', 'CCTV', 'Power Backup', 'Laundry', 'Hot Water', 'Study Room'],
      verified: true,
      featured: true,
      rating: 4.5,
      reviewCount: 128,
      ownerName: 'Mr. Rajesh Kumar',
      ownerPhone: '9315058665',
      ownerEmail: 'rajesh.cupg@gmail.com',
      createdAt: new Date().toISOString(),
      distance: '500m from CU Gate 1',
      locality: 'Gate 1 Area'
    };
    
    setPg(mockPG);
  };

  const handleFavorite = () => {
    if (!pg) return;
    
    const favorites = JSON.parse(localStorage.getItem('pgFavorites') || '[]');
    if (isFavorite) {
      const newFavorites = favorites.filter((favId: string) => favId !== pg._id);
      localStorage.setItem('pgFavorites', JSON.stringify(newFavorites));
      setIsFavorite(false);
      toast.success('Removed from favorites');
    } else {
      favorites.push(pg._id);
      localStorage.setItem('pgFavorites', JSON.stringify(favorites));
      setIsFavorite(true);
      toast.success('Added to favorites');
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Contact request submitted!', {
      description: `We'll connect you with ${pg?.ownerName} shortly.`,
    });
    setShowContactForm(false);
    setContactData({
      name: '',
      phone: '',
      email: '',
      message: '',
      visitDate: '',
    });
  };

  const handleWhatsAppContact = () => {
    if (!pg) return;
    
    const phoneNumber = pg.ownerPhone?.replace(/\D/g, '') || '9315058665';
    const message = encodeURIComponent(
      `Hello ${pg.ownerName},\n\nI'm interested in your PG:\n` +
      `• Name: ${pg.name}\n` +
      `• Location: ${pg.address}\n` +
      `• Price: ₹${pg.price}/month\n\n` +
      `Please contact me for more details.`
    );
    window.open(`https://wa.me/91${phoneNumber}?text=${message}`, '_blank');
  };

  const downloadBrochure = () => {
    if (!pg) return;
    
    toast.success('Brochure downloaded!');
    // Simulate download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${pg.name.replace(/\s+/g, '_')}_Brochure.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const viewOnMap = () => {
    if (!pg) return;
    
    const address = encodeURIComponent(pg.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
    toast.info('Opening location on Google Maps');
  };

  const scheduleVisit = () => {
    toast.success('Visit scheduled!', {
      description: 'We\'ll send you a confirmation.',
    });
    setShowContactForm(true);
  };

  const handleShare = async () => {
    if (!pg) return;
    
    const shareData = {
      title: pg.name,
      text: `Check out ${pg.name} on CU PG Finder - ₹${pg.price}/month`,
      url: window.location.href,
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success('Shared successfully!');
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleContactOwner = () => {
    setShowContactForm(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-orange-50/50">
        <Navbar />
        <main className="flex-1 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">Loading PG details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If no PG data (shouldn't happen with mock data)
  if (!pg) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-orange-50/50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
              <Home className="h-12 w-12 text-orange-600" />
            </div>
            <h1 className="font-display text-3xl font-bold text-gray-900 mb-4">PG Not Found</h1>
            <p className="text-gray-600 mb-8 max-w-md">
              The PG accommodation you're looking for doesn't exist or has been removed.
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

  // Mock data for reviews and rooms
  const reviews = [
    {
      id: 1,
      name: 'Rahul Sharma',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Excellent PG with great amenities. The owner is very cooperative and the food quality is amazing. Highly recommended for CU students!',
      verified: true,
      program: 'B.Tech CSE, CU'
    },
    {
      id: 2,
      name: 'Priya Patel',
      rating: 4,
      date: '1 month ago',
      comment: 'Good location near Gate 1 and food quality. Could be cleaner in common areas, but overall a comfortable stay.',
      verified: true,
      program: 'MBA, CU'
    },
    {
      id: 3,
      name: 'Amit Kumar',
      rating: 4.5,
      date: '3 months ago',
      comment: 'Great value for money. The WiFi is fast and the study room is very useful during exams. Close to university.',
      verified: true,
      program: 'CA Student'
    },
  ];

  const roomDetails = [
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
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-orange-50/50">
      <Navbar />
      
      {/* Floating Action Buttons */}
      <div className="fixed right-6 bottom-24 z-40 flex flex-col gap-3">
        <button
          onClick={handleFavorite}
          className={cn(
            "w-12 h-12 rounded-full shadow-lg border flex items-center justify-center hover:scale-110 transition-all",
            isFavorite
              ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
              : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
          )}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
        </button>
        
        <button
          onClick={handleShare}
          className="w-12 h-12 rounded-full shadow-lg bg-white text-gray-700 border border-gray-200 flex items-center justify-center hover:scale-110 transition-all hover:bg-gray-50"
          title="Share"
        >
          <Share2 className="h-5 w-5" />
        </button>
        
        <button
          onClick={downloadBrochure}
          className="w-12 h-12 rounded-full shadow-lg bg-white text-gray-700 border border-gray-200 flex items-center justify-center hover:scale-110 transition-all hover:bg-gray-50"
          title="Download Brochure"
        >
          <Download className="h-5 w-5" />
        </button>
      </div>

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/pg" className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to listings
            </Link>
            <div className="flex items-center gap-4">
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
            {/* Main Image */}
            <div 
              className="md:col-span-2 md:row-span-2 relative rounded-2xl overflow-hidden cursor-pointer group"
              onClick={() => setShowGallery(true)}
            >
              <img
                src={pg.images[0]}
                alt={pg.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            
            {/* Thumbnail Images */}
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
                  src={image}
                  alt={`${pg.name} ${index + 2}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>

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
                src={pg.images[currentImage]}
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
              {/* Header with Enhanced Info */}
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
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-orange-600" />
                    <span className="font-medium">{pg.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-gray-900">{pg.rating}</span>
                    <span>({pg.reviewCount} reviews)</span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-orange-50 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-orange-600">₹{pg.price.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Per Month</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-blue-600">{pg.distance}</div>
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
              </div>

              {/* Tabs Navigation */}
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

                {/* Overview Tab */}
                <TabsContent value="overview" className="mt-6">
                  <div className="bg-white rounded-xl p-6 border">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">About this PG</h2>
                    <p className="text-gray-700 mb-6">{pg.description}</p>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2">Features</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {pg.amenities.slice(0, 6).map((amenity, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500" />
                              <span className="text-gray-600">{amenity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-bold text-gray-900 mb-2">Ideal For</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-blue-50 text-blue-700">CU Students</Badge>
                          <Badge className="bg-green-50 text-green-700">Working Professionals</Badge>
                          <Badge className="bg-purple-50 text-purple-700">Exam Aspirants</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Amenities Tab */}
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

                {/* Rooms Tab */}
                <TabsContent value="rooms" className="mt-6">
                  <div className="bg-white rounded-xl p-6 border">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Available Rooms</h2>
                    <div className="space-y-4">
                      {roomDetails.map((room, index) => (
                        <div 
                          key={index}
                          className={cn(
                            "border rounded-xl p-4 transition-all",
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

                {/* Location Tab */}
                <TabsContent value="location" className="mt-6">
                  <div className="bg-white rounded-xl p-6 border">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Location</h2>
                    
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{pg.address}</h3>
                          <p className="text-gray-600 mt-1">{pg.locality} • {pg.city}</p>
                          <p className="text-orange-600 font-medium mt-2">{pg.distance}</p>
                        </div>
                      </div>
                      
                      <div className="h-48 bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Building className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                          <h4 className="font-bold text-gray-900 mb-1">Near Chandigarh University</h4>
                          <p className="text-gray-600 text-sm">Easy access to all CU gates</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <h4 className="font-bold text-gray-900 text-sm mb-1">Nearby</h4>
                          <p className="text-xs text-gray-600">• CU Gate 1: 5min walk</p>
                          <p className="text-xs text-gray-600">• Library: 10min walk</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <h4 className="font-bold text-gray-900 text-sm mb-1">Transport</h4>
                          <p className="text-xs text-gray-600">• Auto stand: 2min walk</p>
                          <p className="text-xs text-gray-600">• Bus stop: 5min walk</p>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={viewOnMap}
                        className="w-full bg-orange-600 hover:bg-orange-700 gap-2"
                      >
                        <Navigation className="h-4 w-4" />
                        View on Google Maps
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Booking & Contact */}
            <div className="space-y-6">
              {/* Price Calculator Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border sticky top-24">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-bold text-gray-900">
                      ₹{pg.price.toLocaleString()}
                    </span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  
                  {/* Booking Duration */}
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
                  
                  {/* Price Calculation */}
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

                {/* Action Buttons */}
                <div className="space-y-3 mb-6">
                  <Button 
                    onClick={handleContactOwner} 
                    size="lg" 
                    className="w-full bg-orange-600 hover:bg-orange-700 gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    Contact Owner
                  </Button>
                  
                  <Button 
                    onClick={handleWhatsAppContact} 
                    variant="outline" 
                    size="lg"
                    className="w-full border-orange-300 hover:bg-orange-50 gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </Button>
                </div>

                {/* Owner Info */}
                <div className="pt-6 border-t">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center">
                      <UsersIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{pg.ownerName}</p>
                      <p className="text-gray-600 text-sm">Property Owner</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <a href={`tel:${pg.ownerPhone}`}>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="w-full text-gray-600 hover:text-orange-600"
                      >
                        <PhoneCall className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                    </a>
                    <a href={`mailto:${pg.ownerEmail}`}>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="w-full text-gray-600 hover:text-orange-600"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Info Cards */}
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

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Contact Owner</h2>
                <button
                  onClick={() => setShowContactForm(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={contactData.name}
                    onChange={(e) => setContactData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={contactData.phone}
                    onChange={(e) => setContactData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    value={contactData.message}
                    onChange={(e) => setContactData(prev => ({ ...prev, message: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 outline-none"
                    placeholder="I'm interested in this PG..."
                  />
                </div>
                
                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                  Send Message
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