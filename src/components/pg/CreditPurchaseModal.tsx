// frontend/src/components/pg/CreditPurchaseModal.tsx
import { useState, useEffect } from 'react';
import { 
  CreditCard, Phone, MessageCircle, Zap, Shield, CheckCircle, 
  QrCode, Smartphone, Copy, Check, AlertCircle, ArrowLeft
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
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [upiId, setUpiId] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [verifyingPayment, setVerifyingPayment] = useState(false);

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

      const orderResponse = await api.createCallCreditOrder(10);
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

  const handleUPIPayment = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.request('/api/payments/generate-upi-qr', {
        method: 'POST',
        body: JSON.stringify({ amount: 10 })
      });

      if (response.success) {
        setQrCode(response.qrCode);
        setUpiId(response.upiId);
        setTransactionId(response.transactionId);
        toast.info('Scan QR code with any UPI app to pay');
      } else {
        throw new Error(response.message || 'Failed to generate QR');
      }
    } catch (error: any) {
      console.error('UPI payment error:', error);
      toast.error(error.message || 'Failed to initiate UPI payment');
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyUPIId = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    toast.success('UPI ID copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const verifyUPIPayment = async () => {
    setVerifyingPayment(true);
    try {
      const userId = localStorage.getItem('userId');
      const response = await api.request('/api/payments/verify-upi-payment', {
        method: 'POST',
        body: JSON.stringify({ transactionId, userId })
      });

      if (response.success) {
        setPaymentSuccess(true);
        toast.success('Payment verified! 4 credits added.');
        setTimeout(() => {
          onSuccess();
          onClose();
          setPaymentSuccess(false);
        }, 2000);
      } else {
        toast.error('Payment not found. Please complete the payment first.');
      }
    } catch (error) {
      toast.error('Failed to verify payment. Please try again.');
    } finally {
      setVerifyingPayment(false);
    }
  };

  const resetToPaymentMethod = () => {
    setQrCode(null);
    setError(null);
    setPaymentMethod('card');
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
        ) : qrCode ? (
          // QR Code Payment View
          <div className="py-4">
            <button 
              onClick={resetToPaymentMethod}
              className="flex items-center gap-2 text-orange-600 mb-4 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to payment options
            </button>
            
            <div className="text-center">
              <div className="bg-white p-4 rounded-2xl inline-block mb-4">
                <img src={qrCode} alt="UPI QR Code" className="w-64 h-64" />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">UPI ID:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-sm text-orange-600">{upiId}</code>
                    <button onClick={copyUPIId} className="p-1 hover:bg-gray-200 rounded">
                      {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    📱 Scan QR code with any UPI app (Google Pay, PhonePe, Paytm, etc.)
                  </p>
                </div>
                
                <Button 
                  onClick={verifyUPIPayment}
                  disabled={verifyingPayment}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {verifyingPayment ? 'Verifying...' : 'I have completed the payment'}
                </Button>
              </div>
            </div>
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
                <div className="text-3xl font-bold">₹10</div>
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
                    UPI / QR
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
                        Pay ₹10 via Card
                      </>
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="upi">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-left p-3 bg-gray-50 rounded-lg">
                      <QrCode className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Scan QR Code</p>
                        <p className="text-sm text-gray-500">Pay using any UPI app</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-left p-3 bg-gray-50 rounded-lg">
                      <Smartphone className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">Google Pay | PhonePe | Paytm</p>
                        <p className="text-sm text-gray-500">Instant payment via UPI</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleUPIPayment}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Generating QR...
                      </div>
                    ) : (
                      <>
                        <QrCode className="h-4 w-4 mr-2" />
                        Generate QR Code
                      </>
                    )}
                  </Button>
                </TabsContent>
              </Tabs>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-semibold text-blue-700">Secure Payment</span>
                </div>
                <p className="text-xs text-blue-700">
                  Your payment is secure and encrypted. Credits are added instantly after successful payment.
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