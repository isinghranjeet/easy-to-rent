// Wishlist.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useWishlist } from '@/contexts/WishlistContext';
import { PGCard } from '@/components/pg/PGCard';
import { toast } from 'sonner';
import { transformPGData, TransformedPG } from '@/lib/utils/pgTransformer';

// API URL
const API_URL = 'https://eassy-to-rent-backend.onrender.com/api';

const Wishlist = () => {
  const { wishlist, toggleWishlist, clearWishlist } = useWishlist();
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
      
      // Fetch each PG by ID
      const fetchPromises = wishlist.map(async (id) => {
        try {
          const response = await fetch(`${API_URL}/pg/${id}`);
          if (!response.ok) return null;
          const result = await response.json();
          return result.success ? result.data : null;
        } catch (err) {
          console.error(`Error fetching PG ${id}:`, err);
          return null;
        }
      });
      
      const results = await Promise.all(fetchPromises);
      const validPGs = results.filter(pg => pg !== null);
      
      // Transform the data using the utility function
      const transformedPGs = validPGs.map(pg => transformPGData(pg));
      
      setWishlistPGs(transformedPGs);
      
      if (transformedPGs.length === 0) {
        toast.error('No valid PG details found in wishlist');
      }
      
    } catch (err: any) {
      console.error('Error fetching wishlist PGs:', err);
      setError(err.message);
      toast.error('Failed to load wishlist items');
    } finally {
      setLoading(false);
    }
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
                <div key={pg._id || pg.id} className="relative group">
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

export default Wishlist;