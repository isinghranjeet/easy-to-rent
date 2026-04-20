// frontend/src/components/pg/CreditPurchaseModal.tsx
import { useState } from 'react';
import { X, CreditCard, Phone, MessageCircle, Zap, Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { api } from '@/services/api';
import { toast } from 'sonner';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CreditPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreditPurchaseModal = ({ isOpen, onClose, onSuccess }: CreditPurchaseModalProps) => {
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

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

  const handlePurchase = async () => {
    setLoading(true);
    
    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway. Please check your internet connection.');
        setLoading(false);
        return;
      }

      // Create order
      const orderResponse = await api.createCallCreditOrder(10);

      if (!orderResponse.success) {
        throw new Error(orderResponse.message || 'Failed to create order');
      }

      // Get user details
      const userName = localStorage.getItem('userName') || '';
      const userEmail = localStorage.getItem('userEmail') || '';
      const userPhone = localStorage.getItem('userPhone') || '';

      const options = {
        key: orderResponse.keyId,
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        name: 'EasyTorent',
        description: 'Purchase 4 Contact Credits',
        image: '/logo.png',
        order_id: orderResponse.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await api.verifyCallCreditPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyResponse.success) {
              setPaymentSuccess(true);
              toast.success('Payment successful! 4 credits added to your account.');
              setTimeout(() => {
                onSuccess();
                onClose();
                setPaymentSuccess(false);
              }, 2000);
            } else {
              toast.error('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Verification error:', error);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: userName,
          email: userEmail,
          contact: userPhone
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
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {paymentSuccess ? 'Payment Successful!' : 'Get Contact Credits'}
          </DialogTitle>
        </DialogHeader>
        
        {paymentSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Credits Added!</h3>
            <p className="text-gray-600">4 contact credits have been added to your account.</p>
          </div>
        ) : (
          <>
            <div className="text-center py-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white mb-6">
                <Zap className="h-12 w-12 mx-auto mb-3" />
                <div className="text-3xl font-bold">₹10</div>
                <div className="text-sm opacity-90">One-time payment</div>
                <div className="text-2xl font-bold mt-3">4 Contact Credits</div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-left p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Call Property Owners</p>
                    <p className="text-sm text-gray-500">Directly call and discuss your requirements</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-left p-3 bg-gray-50 rounded-lg">
                  <MessageCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">WhatsApp Inquiries</p>
                    <p className="text-sm text-gray-500">Chat instantly with property managers</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handlePurchase}
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Processing...
                  </div>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay ₹10 & Get 4 Credits
                  </>
                )}
              </Button>

              {/* Test Mode Info - Remove this in production */}
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-yellow-600" />
                  <span className="text-xs font-semibold text-yellow-700">TEST MODE</span>
                </div>
                <p className="text-xs text-yellow-700">
                  Test Card: 4111 1111 1111 1111 | Expiry: Any future date | CVV: Any 3 digits | OTP: Any 3 digits
                </p>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                * Credits never expire. 1 credit = 1 call or WhatsApp message
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};