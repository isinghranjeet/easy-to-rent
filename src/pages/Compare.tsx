// Compare.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GitCompare, ArrowLeft, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCompare } from '@/contexts/CompareContext';
import { toast } from 'sonner';
import { transformPGData, TransformedPG } from '@/lib/utils/pgTransformer';
import { api } from '@/services/api';


const Compare = () => {
  const { compareList, removeFromCompare, clearCompare, maxCompareLimit } = useCompare();
  const [comparePGs, setComparePGs] = useState<TransformedPG[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (compareList.length > 0) {
      fetchComparePGs();
    } else {
      setComparePGs([]);
      setLoading(false);
    }
  }, [compareList]);

  const fetchComparePGs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch each PG by ID
      const fetchPromises = compareList.map(async (id) => {
        try {
          const result = await api.request<any>(`/api/pg/${id}`);
          return result.success ? result.data : result;
        } catch (err) {
          console.error(`Error fetching PG ${id}:`, err);
          return null;
        }
      });
      
      const results = await Promise.all(fetchPromises);
      const validPGs = results.filter(pg => pg !== null);
      
      // Transform the data using the utility function
      const transformedPGs = validPGs.map(pg => transformPGData(pg));
      
      setComparePGs(transformedPGs);
      
      if (transformedPGs.length === 0) {
        toast.error('No valid PG details found');
      }
      
    } catch (err: any) {
      console.error('Error fetching compare PGs:', err);
      setError(err.message);
      toast.error('Failed to load comparison data');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCompare = (pgId: string, pgName: string) => {
    removeFromCompare(pgId);
    toast.success('Removed from Compare', {
      description: `${pgName} has been removed from comparison`,
    });
  };

  const handleClearCompare = () => {
    clearCompare();
    toast.success('Comparison Cleared', {
      description: 'All items have been removed from comparison',
    });
  };

  // Comparison fields
  const comparisonFields = [
    { key: 'price', label: 'Price (per month)', format: (value: number) => `₹${value?.toLocaleString() || 0}` },
    { key: 'type', label: 'Type', format: (value: string) => value ? value.charAt(0).toUpperCase() + value.slice(1) : 'N/A' },
    { key: 'city', label: 'City', format: (value: string) => value || 'N/A' },
    { key: 'locality', label: 'Locality', format: (value: string) => value || 'N/A' },
    { key: 'rating', label: 'Rating', format: (value: number) => value ? value.toFixed(1) : '0.0' },
    { key: 'reviewCount', label: 'Reviews', format: (value: number) => value || 0 },
    { key: 'wifi', label: 'WiFi', format: (value: boolean) => value ? '✅ Yes' : '❌ No' },
    { key: 'meals', label: 'Meals Included', format: (value: boolean) => value ? '✅ Yes' : '❌ No' },
    { key: 'ac', label: 'AC Rooms', format: (value: boolean) => value ? '✅ Yes' : '❌ No' },
    { key: 'parking', label: 'Parking', format: (value: boolean) => value ? '✅ Yes' : '❌ No' },
    { key: 'featured', label: 'Featured', format: (value: boolean) => value ? '⭐ Yes' : 'No' },
    { key: 'verified', label: 'Verified', format: (value: boolean) => value ? '✅ Yes' : '❌ No' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-24">
            <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading comparison data...</p>
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
                  <X className="h-10 w-10 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Error Loading Data</h3>
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
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Property Cards Header - Responsive grid */}
            <div className={`grid gap-4 mb-8 ${
              comparePGs.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
              comparePGs.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
              'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
            }`}>
              {comparePGs.map((pg) => (
                <Card key={pg._id || pg.id} className="relative">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleRemoveFromCompare(pg._id || pg.id || '', pg.name)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg line-clamp-1">{pg.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-primary">₹{pg.price?.toLocaleString() || 0}</p>
                      <p className="text-sm text-muted-foreground">
                        {pg.locality || pg.city}, {pg.city}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={
                          pg.type === 'boys' ? 'default' : 
                          pg.type === 'girls' ? 'secondary' : 
                          'outline'
                        }>
                          {pg.type === 'boys' ? '👦 Boys' : 
                           pg.type === 'girls' ? '👧 Girls' : 
                           pg.type === 'co-ed' ? '👫 Co-ed' : 
                           '👪 Family'}
                        </Badge>
                        {pg.featured && (
                          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                            ⭐ Featured
                          </Badge>
                        )}
                        {pg.verified && (
                          <Badge variant="outline" className="border-green-500 text-green-600">
                            ✅ Verified
                          </Badge>
                        )}
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
                        <TableHead className="w-[200px] bg-muted/50">Feature</TableHead>
                        {comparePGs.map((pg) => (
                          <TableHead key={pg._id || pg.id} className="text-center bg-muted/50">
                            {pg.name}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comparisonFields.map((field) => (
                        <TableRow key={field.key} className="hover:bg-muted/30">
                          <TableCell className="font-medium">{field.label}</TableCell>
                          {comparePGs.map((pg) => (
                            <TableCell key={`${pg._id || pg.id}-${field.key}`} className="text-center">
                              {field.format(pg[field.key as keyof TransformedPG] as any)}
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
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {comparePGs.map((pg, index) => (
                <Link key={pg._id || pg.id} to={`/pg/${pg._id || pg.id}`}>
                  <Button variant={index === 0 ? 'default' : 'outline'}>
                    View {pg.name}
                  </Button>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Tips */}
        {comparePGs.length > 0 && comparePGs.length < maxCompareLimit && (
          <Card className="mt-8 bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                  <span className="text-primary text-xs">💡</span>
                </div>
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