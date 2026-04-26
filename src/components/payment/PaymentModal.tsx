import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, Smartphone, Building2, Shield, Lock, CheckCircle } from 'lucide-react';
import { api } from '@/services/api';
import { toast } from 'sonner';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  amount: number;
  onSuccess: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const PaymentModal = ({ isOpen, onClose, bookingId, amount, onSuccess }: PaymentModalProps) => {
  const [loading, setLoading] = useState(false);
  const [securityCheck, setSecurityCheck] = useState(false);
  const [paymentToken, setPaymentToken] = useState<string>('');

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!securityCheck) {
      toast.error('Please confirm the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error('Failed to load payment gateway');
        setLoading(false);
        return;
      }

      // Create order
      if (!import.meta.env.VITE_RAZORPAY_KEY_ID) {
        throw new Error('VITE_RAZORPAY_KEY_ID is missing. Configure payment key in your .env file.');
      }

      const orderResponse = await api.createPaymentOrder(bookingId, amount);

      if (!orderResponse.success) {
        throw new Error(orderResponse.message || 'Failed to create order');
      }

      const { orderId, keyId, paymentToken: token, currency } = orderResponse.data;
      setPaymentToken(token);

      const options = {
        key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: currency || 'INR',
        name: 'EasyTorent',
        description: `Booking Payment - ${bookingId}`,
        order_id: orderId,
        handler: async (response: any) => {
          try {
            const verifyResponse = await api.verifyPayment({
              bookingId,
              provider: 'razorpay',
              paymentToken: token,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyResponse.success) {
              toast.success('Payment successful! Booking confirmed.');
              onSuccess();
              onClose();
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#F97316'
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.info('Payment cancelled');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      const message = error?.message || 'Payment failed';
      if (message.includes('Not Found - /api/payments/create-order')) {
        toast.error('Payment API route is missing on backend (/api/payments/create-order). Start/update backend payment routes.');
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-orange-500" />
            Complete Payment
          </DialogTitle>
          <DialogDescription>
            Review your booking amount and continue with secure Razorpay checkout.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 p-3 bg-green-50 rounded-lg">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="text-xs text-green-700">256-bit SSL Encrypted Payment</span>
          </div>

          {/* Amount Display */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-3xl font-bold text-orange-600">₹{amount.toLocaleString()}</p>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Payment Methods</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center gap-1 p-2 border rounded-lg bg-orange-50 border-orange-200">
                <CreditCard className="h-5 w-5 text-orange-600" />
                <span className="text-xs text-gray-600">Card</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 border rounded-lg">
                <Smartphone className="h-5 w-5 text-gray-500" />
                <span className="text-xs text-gray-600">UPI</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 border rounded-lg">
                <Building2 className="h-5 w-5 text-gray-500" />
                <span className="text-xs text-gray-600">NetBanking</span>
              </div>
            </div>
          </div>

          {/* Security Check */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="securityCheck"
              checked={securityCheck}
              onChange={(e) => setSecurityCheck(e.target.checked)}
              className="mt-0.5 rounded border-gray-300"
            />
            <label htmlFor="securityCheck" className="text-xs text-gray-600">
              I confirm that I have read and agree to the{' '}
              <a href="/terms" target="_blank" className="text-orange-600 hover:underline">
                Terms & Conditions
              </a>{' '}
              and{' '}
              <a href="/refund" target="_blank" className="text-orange-600 hover:underline">
                Refund Policy
              </a>
            </label>
          </div>

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={loading || !securityCheck}
            className="w-full bg-orange-600 hover:bg-orange-700 gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            {loading ? 'Processing...' : `Pay ₹${amount.toLocaleString()} Securely`}
          </Button>

          {/* Footer */}
          <div className="flex items-center justify-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" /> Secure</span>
            <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" /> Instant</span>
            <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-green-500" /> 7-Day Refund</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};