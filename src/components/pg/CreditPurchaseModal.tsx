// frontend/src/components/pg/CreditPurchaseModal.tsx
import { useState } from 'react';
import { 
  CreditCard, Phone, MessageCircle, Zap, Shield, CheckCircle, 
  Smartphone, Copy, Check, AlertCircle, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { api } from '@/services/api';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');

  const UPI_ID = '9315058665@ptsbi';
  const AMOUNT = 10;
  const NAME = 'EasyTorent';
  const NOTE = '4 Contact Credits';

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCardPayment = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!window.Razorpay) {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          throw new Error('Payment gateway not available');
        }
      }

      const orderResponse = await api.createCallCreditOrder(AMOUNT);
      if (!orderResponse.success) {
        throw new Error(orderResponse.message || 'Failed to create order');
      }

      const userName = localStorage.getItem('userName') || 'Guest';
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
              throw new Error(verifyResponse.message || 'Payment verification failed');
            }
          } catch (error: any) {
            toast.error(error.message || 'Payment verification failed');
            setError(error.message);
          }
        },
        prefill: { name: userName, email: userEmail, contact: userPhone },
        theme: { color: '#F97316' },
        modal: { ondismiss: () => { setLoading(false); toast.info('Payment cancelled'); } }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Failed to process payment');
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Direct UPI Payment Request
  const requestUPIPayment = () => {
    // Create UPI intent URL
    const upiIntentUrl = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(NAME)}&am=${AMOUNT}&cu=INR&tn=${encodeURIComponent(NOTE)}`;
    
    // Open UPI app
    window.location.href = upiIntentUrl;
    
    // Show success message with instructions
    toast.success('UPI app opened! Please complete the payment.', {
      duration: 5000,
    });
    
    // After returning from UPI app, show verification option
    setTimeout(() => {
      toast.info('After payment, click "Verify Payment" to get your credits.', {
        duration: 8000,
      });
    }, 3000);
  };

  // Verify UPI Payment (Manual verification for now)
  const verifyUPIPayment = async () => {
    setVerifying(true);
    try {
      // Create a unique transaction ID
      const transactionId = `UPI_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Call verification API
      const response = await api.request('/api/payments/verify-upi-payment', {
        method: 'POST',
        body: JSON.stringify({
          transactionId: transactionId,
          amount: AMOUNT,
          status: 'completed'
        })
      });

      if (response.success) {
        setPaymentSuccess(true);
        toast.success('Payment verified! 4 credits added to your account.');
        setTimeout(() => {
          onSuccess();
          onClose();
          setPaymentSuccess(false);
        }, 2000);
      } else {
        toast.error('Verification failed. Please contact support with payment screenshot.');
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      toast.error('Could not verify automatically. Please contact support.');
    } finally {
      setVerifying(false);
    }
  };

  const copyUPIId = () => {
    navigator.clipboard.writeText(UPI_ID);
    toast.success('UPI ID copied! You can manually pay and then verify.');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
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
            {error && (
              <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            <div className="text-center py-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white mb-6">
                <Zap className="h-12 w-12 mx-auto mb-3" />
                <div className="text-3xl font-bold">₹{AMOUNT}</div>
                <div className="text-sm opacity-90">One-time payment</div>
                <div className="text-2xl font-bold mt-3">4 Contact Credits</div>
              </div>

              <Tabs defaultValue="card" className="w-full" onValueChange={(v) => setPaymentMethod(v as 'card' | 'upi')}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="card" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Card
                  </TabsTrigger>
                  <TabsTrigger value="upi" className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    UPI
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="card">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-left p-3 bg-gray-50 rounded-lg">
                      <CreditCard className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Credit/Debit Card</p>
                        <p className="text-sm text-gray-500">All major cards accepted</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleCardPayment}
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
                        Pay ₹{AMOUNT} via Card
                      </>
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="upi">
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-left p-3 bg-gray-50 rounded-lg">
                      <Smartphone className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Instant UPI Payment</p>
                        <p className="text-sm text-gray-500">Pay using Google Pay, PhonePe, Paytm</p>
                      </div>
                    </div>
                    
                    {/* Direct UPI Payment Button */}
                    <Button
                      onClick={requestUPIPayment}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-6 text-lg"
                    >
                      <Smartphone className="h-5 w-5 mr-2" />
                      Pay ₹{AMOUNT} with UPI
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">OR</span>
                      </div>
                    </div>

                    {/* Manual UPI Option */}
                    <div className="p-4 bg-orange-50 rounded-lg text-center border border-orange-200">
                      <p className="text-sm text-gray-600 mb-2">Manual UPI Payment</p>
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <code className="text-base font-bold text-orange-600 bg-white px-3 py-2 rounded-lg border">
                          {UPI_ID}
                        </code>
                        <button 
                          onClick={copyUPIId}
                          className="p-2 hover:bg-white rounded-lg transition-colors"
                          title="Copy UPI ID"
                        >
                          <Copy className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                      <Button
                        onClick={verifyUPIPayment}
                        disabled={verifying}
                        variant="outline"
                        className="w-full border-orange-300 text-orange-600 hover:bg-orange-50"
                      >
                        {verifying ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          'I have completed the payment'
                        )}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-700">Secure Payment</span>
                </div>
                <p className="text-xs text-blue-700">
                  Your payment is secure. Credits are added instantly after payment.
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