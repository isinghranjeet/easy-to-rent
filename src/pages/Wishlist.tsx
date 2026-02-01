import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';
import { PGCard } from '@/components/pg/PGCard';

// Mock data - replace with actual API call
const mockPGs = [
  {
    id: '1',
    name: 'Luxury PG for Professionals',
    slug: 'luxury-pg-professionals',
    description: 'Premium PG with all modern amenities',
    price: 15000,
    images: ['https://example.com/pg1.jpg'],
    city: 'Delhi',
    locality: 'Connaught Place',
    type: 'co-ed' as const,
    amenities: ['wifi', 'ac', 'parking'],
    rating: 4.5,
    reviewCount: 120,
    featured: true,
    verified: true,
    wifi: true,
    meals: true,
    ac: true,
    parking: true,
  },
  // Add more mock data as needed
];

const Wishlist = () => {
  const { wishlist, toggleWishlist, clearWishlist } = useWishlist();
  const { toast } = useToast();
  const [wishlistPGs, setWishlistPGs] = useState<any[]>([]);

  useEffect(() => {
    // Filter PGs that are in the wishlist
    const filtered = mockPGs.filter(pg => wishlist.includes(pg.id));
    setWishlistPGs(filtered);
  }, [wishlist]);

  const handleClearWishlist = () => {
    clearWishlist();
    toast({
      title: 'Wishlist Cleared',
      description: 'All items have been removed from your wishlist',
    });
  };

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
                      ₹{wishlistPGs.reduce((sum, pg) => sum + pg.price, 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Monthly Value</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">
                      {(wishlistPGs.reduce((sum, pg) => sum + pg.rating, 0) / wishlistPGs.length).toFixed(1)}
                    </p>
                    <p className="text-sm text-muted-foreground">Average Rating</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Property Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistPGs.map((pg, index) => (
                <PGCard key={pg.id} pg={pg} index={index} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;