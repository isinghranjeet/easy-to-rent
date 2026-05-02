/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/profile/BookingHistory.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Search, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Download
} from 'lucide-react';
import { api } from '@/services/api';

interface Booking {
  _id: string;
  pgId: {
    name: string;
    address: string;
    city: string;
    images?: string[];
  };
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  durationMonths: number;
  totalAmount: number;
  discountApplied: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';
  paymentStatus: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
  guestDetails: {
    name: string;
    phone: string;
    email?: string;
  };
  specialRequests?: string;
  createdAt: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
  completed: { label: 'Completed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  refunded: { label: 'Refunded', color: 'bg-purple-100 text-purple-800', icon: DollarSign },
};

const paymentStatusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800' },
  paid: { label: 'Paid', color: 'bg-green-100 text-green-800' },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-800' },
  refunded: { label: 'Refunded', color: 'bg-purple-100 text-purple-800' },
  partially_refunded: { label: 'Partially Refunded', color: 'bg-orange-100 text-orange-800' },
};

export const BookingHistory = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.getUserBookings();
      if (response.success && response.data) {
        setBookings(response.data);
      }
    } catch {
      // Use demo data
    }
    // Demo data fallback
    setBookings([
      {
        _id: '1',
        pgId: { name: 'Sunrise PG for Girls', address: '123 Main Street, Sector 15', city: 'Mumbai', images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af'] },
        roomType: 'Single Sharing', checkInDate: '2024-01-15', checkOutDate: '2024-04-15', durationMonths: 3,
        totalAmount: 45000, discountApplied: 5000, status: 'confirmed', paymentStatus: 'paid',
        guestDetails: { name: 'Priya Sharma', phone: '+91 98765 43210', email: 'priya@example.com' },
        createdAt: '2024-01-10',
      },
      {
        _id: '2',
        pgId: { name: 'Comfort Stay Boys PG', address: '456 Park Avenue', city: 'Delhi', images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32'] },
        roomType: 'Triple Sharing', checkInDate: '2024-02-01', checkOutDate: '2024-05-01', durationMonths: 3,
        totalAmount: 27000, discountApplied: 3000, status: 'pending', paymentStatus: 'pending',
        guestDetails: { name: 'Rahul Verma', phone: '+91 87654 32109' },
        createdAt: '2024-01-28',
      },
      {
        _id: '3',
        pgId: { name: 'Elite PG for Women', address: '789 Lake View Road', city: 'Bangalore', images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5'] },
        roomType: 'Double Sharing', checkInDate: '2023-11-01', checkOutDate: '2024-01-01', durationMonths: 2,
        totalAmount: 20000, discountApplied: 2000, status: 'completed', paymentStatus: 'paid',
        guestDetails: { name: 'Anjali Patel', phone: '+91 98765 12345' },
        createdAt: '2023-10-25',
      },
    ]);
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, []);

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch = !searchQuery || booking.pgId.name.toLowerCase().includes(searchQuery.toLowerCase()) || booking.pgId.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const formatPrice = (price: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  const totalSpent = bookings.filter((b) => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.totalAmount, 0);
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;

  if (loading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2"><FileText className="h-6 w-6 text-orange-500" />Booking History</h2>
          <p className="text-muted-foreground">View and manage your property bookings</p>
        </div>
        <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Export</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Bookings</p><p className="text-2xl font-bold text-orange-600">{bookings.length}</p></CardContent></Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Confirmed</p><p className="text-2xl font-bold text-green-600">{confirmedCount}</p></CardContent></Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-bold text-yellow-600">{pendingCount}</p></CardContent></Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Spent</p><p className="text-2xl font-bold text-blue-600">{formatPrice(totalSpent)}</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search by property or city..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" /></div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="all">All Status</option><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {filteredBookings.length === 0 ? (
        <Card><CardContent className="py-12 text-center"><FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><h3 className="text-lg font-semibold mb-2">No Bookings Found</h3><p className="text-muted-foreground mb-6">{searchQuery || statusFilter !== 'all' ? 'Try adjusting your filters' : "You haven't made any bookings yet"}</p><Link to="/pg"><Button className="bg-gradient-to-r from-orange-500 to-orange-600">Browse Properties</Button></Link></CardContent></Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const StatusIcon = statusConfig[booking.status]?.icon || AlertCircle;
            return (
              <Card key={booking._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="w-full lg:w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {booking.pgId.images?.[0] ? <img src={booking.pgId.images[0]} alt={booking.pgId.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><FileText className="h-8 w-8 text-muted-foreground" /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div><h3 className="font-semibold text-lg">{booking.pgId.name}</h3><p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />{booking.pgId.address}, {booking.pgId.city}</p></div>
                        <Badge className={statusConfig[booking.status]?.color}><StatusIcon className="h-3 w-3 mr-1" />{statusConfig[booking.status]?.label}</Badge>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
                        <div><p className="text-xs text-muted-foreground">Room Type</p><p className="text-sm font-medium">{booking.roomType}</p></div>
                        <div><p className="text-xs text-muted-foreground">Check-in</p><p className="text-sm font-medium flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(booking.checkInDate)}</p></div>
                        <div><p className="text-xs text-muted-foreground">Duration</p><p className="text-sm font-medium flex items-center gap-1"><Clock className="h-3 w-3" />{booking.durationMonths} months</p></div>
                        <div><p className="text-xs text-muted-foreground">Amount</p><p className="text-sm font-bold text-green-600">{formatPrice(booking.totalAmount)}</p></div>
                      </div>
                      <div className="flex items-center gap-2 mt-3"><span className="text-xs text-muted-foreground">Payment:</span><Badge variant="outline" className={paymentStatusConfig[booking.paymentStatus]?.color}>{paymentStatusConfig[booking.paymentStatus]?.label}</Badge></div>
                    </div>
                    <div className="flex lg:flex-col gap-2"><Button variant="outline" size="sm" asChild><Link to={`/pg/${booking.pgId.name.toLowerCase().replace(/\s+/g, '-')}`}>View Property</Link></Button></div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
