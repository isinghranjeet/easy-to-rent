import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GitCompare, ArrowLeft, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCompare } from '@/contexts/CompareContext';
import { useToast } from '@/hooks/use-toast';

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
    amenities: ['wifi', 'ac', 'parking', 'meals'],
    rating: 4.5,
    reviewCount: 120,
    featured: true,
    verified: true,
    wifi: true,
    meals: true,
    ac: true,
    parking: true,
    ownerName: 'John Doe',
    ownerPhone: '9876543210',
  },
  {
    id: '2',
    name: 'Budget Girls PG',
    slug: 'budget-girls-pg',
    description: 'Affordable and secure PG for girls',
    price: 8000,
    images: ['https://example.com/pg2.jpg'],
    city: 'Mumbai',
    locality: 'Andheri',
    type: 'girls' as const,
    amenities: ['wifi', 'meals'],
    rating: 4.2,
    reviewCount: 85,
    featured: false,
    verified: true,
    wifi: true,
    meals: true,
    ac: false,
    parking: false,
    ownerName: 'Jane Smith',
    ownerPhone: '9876543211',
  },
  // Add more mock data as needed
];

const Compare = () => {
  const { compareList, removeFromCompare, clearCompare, maxCompareLimit } = useCompare();
  const { toast } = useToast();
  const [comparePGs, setComparePGs] = useState<any[]>([]);

  useEffect(() => {
    // Filter PGs that are in the compare list
    const filtered = mockPGs.filter(pg => compareList.includes(pg.id));
    setComparePGs(filtered);
  }, [compareList]);

  const handleRemoveFromCompare = (pgId: string, pgName: string) => {
    removeFromCompare(pgId);
    toast({
      title: 'Removed from Compare',
      description: `${pgName} has been removed from comparison`,
    });
  };

  const handleClearCompare = () => {
    clearCompare();
    toast({
      title: 'Comparison Cleared',
      description: 'All items have been removed from comparison',
    });
  };

  // Comparison fields
  const comparisonFields = [
    { key: 'price', label: 'Price (per month)', format: (value: number) => `₹${value.toLocaleString()}` },
    { key: 'type', label: 'Type', format: (value: string) => value.charAt(0).toUpperCase() + value.slice(1) },
    { key: 'city', label: 'City', format: (value: string) => value },
    { key: 'locality', label: 'Locality', format: (value: string) => value },
    { key: 'rating', label: 'Rating', format: (value: number) => value.toFixed(1) },
    { key: 'reviewCount', label: 'Reviews', format: (value: number) => value },
    { key: 'wifi', label: 'WiFi', format: (value: boolean) => value ? '✅ Yes' : '❌ No' },
    { key: 'meals', label: 'Meals Included', format: (value: boolean) => value ? '✅ Yes' : '❌ No' },
    { key: 'ac', label: 'AC Rooms', format: (value: boolean) => value ? '✅ Yes' : '❌ No' },
    { key: 'parking', label: 'Parking', format: (value: boolean) => value ? '✅ Yes' : '❌ No' },
    { key: 'featured', label: 'Featured', format: (value: boolean) => value ? '⭐ Yes' : 'No' },
    { key: 'verified', label: 'Verified', format: (value: boolean) => value ? '✅ Yes' : '❌ No' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Compare Properties</h1>
            <p className="text-muted-foreground">
              Compare up to {maxCompareLimit} properties side by side
            </p>
          </div>
          
          <div className="flex gap-2">
            <Link to="/pg">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Add More Properties
              </Button>
            </Link>
            
            {comparePGs.length > 0 && (
              <Button variant="destructive" onClick={handleClearCompare}>
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        {comparePGs.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6 pb-6">
              <div className="text-center py-12">
                <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <GitCompare className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No properties to compare</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Add properties to compare by clicking the compare icon on any property card.
                  You can compare up to {maxCompareLimit} properties.
                </p>
                <div className="flex gap-3 justify-center">
                  <Link to="/pg">
                    <Button>Browse Properties</Button>
                  </Link>
                  <Link to="/wishlist">
                    <Button variant="outline">View Wishlist</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Property Cards Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {comparePGs.map((pg) => (
                <Card key={pg.id} className="relative">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 h-8 w-8 p-0"
                    onClick={() => handleRemoveFromCompare(pg.id, pg.name)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg line-clamp-1">{pg.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-primary">₹{pg.price.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {pg.locality}, {pg.city}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant={pg.type === 'boys' ? 'default' : 
                                  pg.type === 'girls' ? 'secondary' : 'outline'}>
                          {pg.type === 'boys' ? '👦 Boys' : 
                           pg.type === 'girls' ? '👧 Girls' : 
                           '👫 Co-ed'}
                        </Badge>
                        {pg.featured && <Badge className="bg-yellow-500">⭐ Featured</Badge>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Comparison Table */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Feature</TableHead>
                        {comparePGs.map((pg) => (
                          <TableHead key={pg.id} className="text-center">
                            {pg.name}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comparisonFields.map((field) => (
                        <TableRow key={field.key}>
                          <TableCell className="font-medium">{field.label}</TableCell>
                          {comparePGs.map((pg) => (
                            <TableCell key={`${pg.id}-${field.key}`} className="text-center">
                              {field.format(pg[field.key])}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-8">
              <Link to={`/pg/${comparePGs[0]?.slug}`}>
                <Button>View {comparePGs[0]?.name}</Button>
              </Link>
              {comparePGs.length > 1 && (
                <Link to={`/pg/${comparePGs[1]?.slug}`}>
                  <Button variant="outline">View {comparePGs[1]?.name}</Button>
                </Link>
              )}
            </div>
          </>
        )}

        {/* Tips */}
        {comparePGs.length > 0 && comparePGs.length < maxCompareLimit && (
          <Card className="mt-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium mb-1">Tip: Add more properties</h4>
                  <p className="text-sm text-muted-foreground">
                    You can add up to {maxCompareLimit} properties for comparison. 
                    Go back to the search page to add more properties to your comparison list.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Compare;