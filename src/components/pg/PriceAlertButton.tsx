import { useState, useEffect } from 'react';
import { Bell, BellOff, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/services/api';
import { toast } from 'sonner';

interface PriceAlertButtonProps {
  pgId: string;
  currentPrice: number;
  pgName?: string;
}

export const PriceAlertButton = ({ pgId, currentPrice, pgName }: PriceAlertButtonProps) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [desiredPrice, setDesiredPrice] = useState(Math.round(currentPrice * 0.8));
  const [hasAlert, setHasAlert] = useState(false);
  const [checking, setChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setIsLoggedIn(!!token);
  }, []);

  // Check if user already has alert for this PG
  useEffect(() => {
    const checkExistingAlert = async () => {
      if (!isLoggedIn) {
        setChecking(false);
        return;
      }
      
      try {
        const response = await api.getPriceAlerts();
        if (response.success && response.data) {
          const existing = response.data.find((alert: any) => alert.pg?._id === pgId);
          if (existing) {
            setHasAlert(true);
          }
        }
      } catch (error) {
        console.error('Error checking alerts:', error);
      } finally {
        setChecking(false);
      }
    };
    
    checkExistingAlert();
  }, [pgId, isLoggedIn]);

  const createAlert = async () => {
    if (desiredPrice >= currentPrice) {
      toast.error('Invalid price', {
        description: 'Desired price must be less than current price'
      });
      return;
    }

    if (!isLoggedIn) {
      toast.error('Login Required', {
        description: 'Please login to create price alerts'
      });
      setShowModal(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.createPriceAlert(pgId, desiredPrice);
      
      if (response.success) {
        toast.success('Price alert created!', {
          description: `We'll notify you when price drops below ₹${desiredPrice.toLocaleString()}`
        });
        setHasAlert(true);
        setShowModal(false);
      } else {
        throw new Error(response.message || 'Failed to create alert');
      }
    } catch (error: any) {
      toast.error('Failed to create alert', { 
        description: error.message || 'Please try again later'
      });
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (checking) {
    return (
      <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 rounded-lg opacity-50 w-full justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading...
      </button>
    );
  }

  // Alert already exists
  if (hasAlert) {
    return (
      <button 
        disabled
        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-lg cursor-default w-full justify-center"
      >
        <BellOff className="h-4 w-4" />
        Alert Set
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition w-full justify-center"
      >
        <Bell className="h-4 w-4" />
        Set Price Alert
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Set Price Alert</h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <span className="text-xl">&times;</span>
              </button>
            </div>
            
            {pgName && (
              <p className="text-sm text-gray-500 mb-2">PG: <strong>{pgName}</strong></p>
            )}
            
            <p className="text-sm text-gray-600 mb-4">
              Current price: <strong className="text-lg text-orange-600">₹{currentPrice.toLocaleString()}</strong>/month
            </p>
            
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notify me when price drops below
            </label>
            <div className="relative mb-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                value={desiredPrice}
                onChange={(e) => setDesiredPrice(Number(e.target.value))}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                min={1}
                max={currentPrice - 1}
              />
            </div>
            
            {!isLoggedIn && (
              <div className="bg-yellow-50 p-3 rounded-lg mb-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <p className="text-xs text-yellow-700">
                    Please login to create price alerts. <a href="/login" className="underline font-medium">Login here</a>
                  </p>
                </div>
              </div>
            )}
            
            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <p className="text-xs text-blue-700">
                  We'll send you an email notification when the price drops. You can create multiple alerts for different PGs.
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={createAlert}
                disabled={loading || desiredPrice >= currentPrice || !isLoggedIn}
                className="flex-1 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Create Alert
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};