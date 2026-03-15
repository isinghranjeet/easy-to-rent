/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/Wishlist.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { PGCard } from '@/components/pg/PGCard';
import { toast } from 'sonner';
import { transformPGData, TransformedPG } from '@/lib/utils/pgTransformer';
import { api } from '@/services/api';


const Wishlist = () => {
  const { wishlist, toggleWishlist, clearWishlist } = useWishlist();
  const { isAuthenticated, user } = useAuth();
  const [wishlistPGs, setWishlistPGs] = useState<TransformedPG[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (wishlist.length > 0) {
      fetchWishlistPGs();
    } else {
      setWishlistPGs([]);
      setLoading(false);
    }
  }, [wishlist]);

  const fetchWishlistPGs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is authenticated for real data
      if (!isAuthenticated) {
        // Show demo data if not authenticated
        const mockPGs = generateMockPGs(wishlist);
        setWishlistPGs(mockPGs);
        setLoading(false);
        return;
      }
      
      // Try to fetch from API
      try {
        const fetchPromises = wishlist.map(async (id) => {
          try {
            const result = await api.request<any>(`/api/pg/${id}`);
            return result.success ? result.data : result; // Handle both wrapper and direct object
          } catch (err) {
            console.error(`Error fetching PG ${id}:`, err);
            return null;
          }
        });
        
        const results = await Promise.all(fetchPromises);
        const validPGs = results.filter(pg => pg !== null);
        
        if (validPGs.length > 0) {
          const transformedPGs = validPGs.map(pg => transformPGData(pg));
          setWishlistPGs(transformedPGs);
        } else {
          // Fallback to mock data if no valid PGs found
          const mockPGs = generateMockPGs(wishlist);
          setWishlistPGs(mockPGs);
        }
        
      } catch (err) {
        console.error('API fetch failed, using mock data:', err);
        const mockPGs = generateMockPGs(wishlist);
        setWishlistPGs(mockPGs);
      }
      
    } catch (err: any) {
      console.error('Error in wishlist:', err);
      setError(err.message);
      toast.error('Failed to load wishlist items');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to generate mock PG data
  const generateMockPGs = (ids: string[]): TransformedPG[] => {
    return ids.map((id, index) => ({
      _id: id,
      id: id,
      name: `Sample PG ${index + 1}`,
      address: '123 Sample Street, City',
      city: 'Chandigarh',
      price: 5000 + (index * 1000),
      rating: 4.5,
      reviewCount: 50 + (index * 10),
      images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af'],
      amenities: ['WiFi', 'Parking', 'Food'],
      type: index % 2 === 0 ? 'boys' : 'girls',
      description: 'This is a sample PG property for demonstration.',
      distance: `${1 + index} km`,
      reviews: 50 + (index * 10),
      createdAt: new Date().toISOString(),
      verified: true,
      featured: false
    }));
  };

  const handleClearWishlist = () => {
    clearWishlist();
    toast.success('Wishlist Cleared', {
      description: 'All items have been removed from your wishlist',
    });
  };

  const handleRemoveItem = (pgId: string, pgName: string) => {
    toggleWishlist(pgId);
    toast.success('Removed from Wishlist', {
      description: `${pgName} has been removed from your wishlist`,
    });
  };

  // Calculate stats
  const totalValue = wishlistPGs.reduce((sum, pg) => sum + (pg.price || 0), 0);
  const avgRating = wishlistPGs.length > 0 
    ? (wishlistPGs.reduce((sum, pg) => sum + (pg.rating || 0), 0) / wishlistPGs.length).toFixed(1)
    : '0.0';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-24">
            <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6 pb-6">
              <div className="text-center py-12">
                <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
                  <Heart className="h-10 w-10 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Error Loading Wishlist</h3>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Button onClick={() => window.location.reload()}>Try Again</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Demo Mode Banner */}
        {!isAuthenticated && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700 text-center">
              🔐 You're viewing demo data. <Link to="/login" className="underline font-semibold">Login</Link> to see your real wishlist.
            </p>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">My Wishlist</h1>
            <p className="text-muted-foreground">
              {wishlistPGs.length} {wishlistPGs.length === 1 ? 'property' : 'properties'} saved
            </p>
          </div>
          
          <div className="flex gap-2">
            <Link to="/pg">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Search
              </Button>
            </Link>
            
            {wishlistPGs.length > 0 && (
              <Button variant="destructive" onClick={handleClearWishlist}>
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        {wishlistPGs.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6 pb-6">
              <div className="text-center py-12">
                <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Save your favorite PGs by clicking the heart icon on any property card
                </p>
                <Link to="/pg">
                  <Button>Browse Properties</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">{wishlistPGs.length}</p>
                    <p className="text-sm text-muted-foreground">Properties Saved</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">
                      ₹{totalValue.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Monthly Value</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">{avgRating}</p>
                    <p className="text-sm text-muted-foreground">Average Rating</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Property Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistPGs.map((pg, index) => (
                <div key={pg._id || pg.id || index} className="relative group">
                  <PGCard pg={pg} index={index} />
                  <button
                    onClick={() => handleRemoveItem(pg._id || pg.id || '', pg.name)}
                    className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                    title="Remove from wishlist"
                  >
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  </button>
                </div>
              ))}
            </div>

            {/* Empty state note if some items failed to load */}
            {wishlist.length > wishlistPGs.length && (
              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700 text-center">
                  ⚠️ Some items in your wishlist could not be loaded. They may have been removed or are unavailable.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// ✅ IMPORTANT: Make sure this default export exists!
export default Wishlist;