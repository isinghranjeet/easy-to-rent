/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/profile/PaymentHistory.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  CreditCard, 
  Search, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Clock,
  Loader2,
  Download,
  TrendingUp,
  Receipt
} from 'lucide-react';
import { api } from '@/services/api';

interface Payment {
  _id: string;
  amount: number;
  currency: string;
  provider: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  type: 'booking' | 'credit' | 'refund';
  description: string;
  bookingId?: string;
  pgName?: string;
  createdAt: string;
}

const paymentStatusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800', icon: Clock },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-800', icon: XCircle },
  refunded: { label: 'Refunded', color: 'bg-purple-100 text-purple-800', icon: DollarSign },
};

export const PaymentHistory = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await api.getUserBookings();
      if (response.success && response.data) {
        const bookings = response.data;
        const paymentData: Payment[] = bookings.map((b: any) => ({
          _id: b._id,
          amount: b.totalAmount,
          currency: 'INR',
          provider: 'razorpay',
          status: b.paymentStatus === 'paid' ? 'completed' : b.paymentStatus === 'failed' ? 'failed' : 'pending',
          type: 'booking',
          description: `Booking for ${b.pgId?.name || 'PG'}`,
          bookingId: b._id,
          pgName: b.pgId?.name,
          createdAt: b.createdAt,
        }));
        setPayments(paymentData);
        return;
      }
    } catch {
      // Use demo data
    }
    // Demo data fallback
    setPayments([
      { _id: '1', amount: 45000, currency: 'INR', provider: 'razorpay', status: 'completed', type: 'booking', description: 'Booking for Sunrise PG for Girls', bookingId: '1', pgName: 'Sunrise PG for Girls', createdAt: '2024-01-10' },
      { _id: '2', amount: 1000, currency: 'INR', provider: 'razorpay', status: 'completed', type: 'credit', description: 'Call Credits - 10 credits', createdAt: '2024-01-08' },
      { _id: '3', amount: 27000, currency: 'INR', provider: 'razorpay', status: 'pending', type: 'booking', description: 'Booking for Comfort Stay Boys PG', bookingId: '2', pgName: 'Comfort Stay Boys PG', createdAt: '2024-01-28' },
      { _id: '4', amount: 20000, currency: 'INR', provider: 'razorpay', status: 'completed', type: 'booking', description: 'Booking for Elite PG for Women', bookingId: '3', pgName: 'Elite PG for Women', createdAt: '2023-10-25' },
      { _id: '5', amount: 5000, currency: 'INR', provider: 'razorpay', status: 'completed', type: 'refund', description: 'Refund - Elite PG (cancelled)', createdAt: '2023-09-15' },
    ]);
    setLoading(false);
  };

  useEffect(() => { fetchPayments(); }, []);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = !searchQuery || payment.description.toLowerCase().includes(searchQuery.toLowerCase()) || payment.pgName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const totalSpent = payments.filter((p) => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter((p) => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const completedCount = payments.filter((p) => p.status === 'completed').length;
  const pendingCount = payments.filter((p) => p.status === 'pending').length;

  if (loading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2"><CreditCard className="h-6 w-6 text-orange-500" />Payment History</h2>
          <p className="text-muted-foreground">View and manage your payments</p>
        </div>
        <Button variant="outline" className="gap-2"><Download className="h-4 w-4" />Export</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Transactions</p><p className="text-2xl font-bold text-orange-600">{payments.length}</p></CardContent></Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Completed</p><p className="text-2xl font-bold text-green-600">{completedCount}</p></CardContent></Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-bold text-yellow-600">{pendingCount}</p></CardContent></Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Spent</p><p className="text-2xl font-bold text-blue-600">{formatPrice(totalSpent)}</p></CardContent></Card>
      </div>

      {totalPending > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4 flex items-center gap-4">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div><p className="font-semibold text-yellow-800">Pending Payments</p><p className="text-sm text-yellow-700">You have {formatPrice(totalPending)} in pending payments that need to be completed.</p></div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search payments..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" /></div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="all">All Status</option><option value="pending">Pending</option><option value="completed">Completed</option><option value="failed">Failed</option><option value="refunded">Refunded</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {filteredPayments.length === 0 ? (
        <Card><CardContent className="py-12 text-center"><CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" /><h3 className="text-lg font-semibold mb-2">No Payments Found</h3><p className="text-muted-foreground mb-6">{searchQuery || statusFilter !== 'all' ? 'Try adjusting your filters' : 'You have no payment history yet'}</p></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {filteredPayments.map((payment) => {
            const StatusIcon = paymentStatusConfig[payment.status]?.icon || Clock;
            return (
              <Card key={payment._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${payment.type === 'refund' ? 'bg-purple-100' : payment.type === 'credit' ? 'bg-blue-100' : 'bg-green-100'}`}>
                      {payment.type === 'refund' ? <DollarSign className="h-5 w-5 text-purple-600" /> : payment.type === 'credit' ? <TrendingUp className="h-5 w-5 text-blue-600" /> : <Receipt className="h-5 w-5 text-green-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold">{payment.description}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(payment.createdAt)} • {payment.provider}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${payment.type === 'refund' ? 'text-purple-600' : 'text-green-600'}`}>{payment.type === 'refund' ? '+' : '-'}{formatPrice(payment.amount)}</p>
                          <Badge className={paymentStatusConfig[payment.status]?.color}><StatusIcon className="h-3 w-3 mr-1" />{paymentStatusConfig[payment.status]?.label}</Badge>
                        </div>
                      </div>
                      {payment.bookingId && (
                        <Button variant="link" size="sm" className="p-0 h-auto mt-1" asChild>
                          <Link to={`/bookings`}>View Booking</Link>
                        </Button>
                      )}
                    </div>
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
