import React, { useState } from 'react';
import { api } from '@/services/api';
import { toast } from 'sonner';
import { Loader2, AlertCircle, Mail, X } from 'lucide-react';

interface OtpModalProps {
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
  onResend?: () => void;
}

const OtpModal: React.FC<OtpModalProps> = ({ email, onSuccess, onCancel, onResend }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

try {
      const response = await api.verifyLoginOtp(email, otp);
      
      // ✅ CRITICAL FIX: Store user data and role after OTP verification
      // Backend returns user data directly in response.data, not nested under user property
      if (response.data) {
        const userData = {
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
          phone: response.data.phone,
          profileImage: response.data.profileImage,
        };
        
        // Store role in localStorage for persistence
        localStorage.setItem('userRole', userData.role);
        
        // Dispatch custom event with user data for AuthContext to pick up
        window.dispatchEvent(new CustomEvent('userLoggedIn', { 
          detail: { user: userData } 
        }));
        
        console.log('✅ [OTP] User logged in, role:', userData.role);
        
        // ✅ Store token if provided
        if (response.data.token) {
          localStorage.setItem('auth_token', response.data.token);
        }
      } else {
        // Fallback: trigger generic event
        window.dispatchEvent(new CustomEvent('userLoggedIn'));
      }
      
      toast.success('Login successful!');
      
      onSuccess();
    } catch (err: unknown) {
      const errorMessage = (err as Error).message || 'Invalid OTP. Please try again.';
      setError(errorMessage);
      toast.error('Verification failed', { description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (onResend) {
      onResend();
      return;
    }
    
    setLoading(true);
    try {
      // Call login again to resend OTP
      await api.post('/api/auth/login', { email, password: '' });
      toast.success('New OTP sent! Please check your email.');
    } catch (err: unknown) {
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Verify OTP</h2>
                <p className="text-sm text-gray-500">Sent to {email}</p>
              </div>
            </div>
            <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter 6-digit code
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  maxLength={6}
                  className="w-full px-4 py-4 text-2xl font-mono text-center bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all"
                  placeholder="000000"
                  autoFocus
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin mr-3 inline" />
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </button>

              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                className="w-full h-12 bg-white border-2 border-dashed border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all text-sm font-medium"
              >
                {loading ? 'Sending...' : 'Resend OTP'}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-center text-gray-500">
            Didn't receive OTP? Check spam folder or request new one above.
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;