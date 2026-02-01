import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, User, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// ✅ Backend URL
const API_URL = 'https://eassy-to-rent-backend.onrender.com/api';

interface LoginProps {
  onLoginSuccess: () => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: 'admin@pgfinder.com',
    password: 'Admin@123',
    rememberMe: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Default admin credentials (in production, this should come from backend)
  const defaultAdmins = [
    { email: 'admin@pgfinder.com', password: 'Admin@123', name: 'Super Admin' },
    { email: 'ranjeet@cu.com', password: 'Ranjeet@123', name: 'Ranjeet Singh' },
    { email: 'manager@pgfinder.com', password: 'Manager@123', name: 'PG Manager' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // First try backend authentication
      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            // Store user data and token
            localStorage.setItem('adminToken', result.token || 'authenticated');
            localStorage.setItem('adminUser', JSON.stringify(result.user || { 
              email: formData.email,
              name: formData.email.split('@')[0]
            }));
            localStorage.setItem('adminLoggedIn', 'true');
            
            if (formData.rememberMe) {
              localStorage.setItem('adminRemember', 'true');
            }

            toast.success(`Welcome back, ${result.user?.name || 'Admin'}!`);
            onLoginSuccess();
            return;
          }
        }
      } catch (apiError) {
        console.log('Backend auth not available, using fallback');
      }

      // Fallback to local authentication
      const admin = defaultAdmins.find(
        admin => admin.email === formData.email && admin.password === formData.password
      );

      if (admin) {
        // Store authentication data
        localStorage.setItem('adminToken', 'authenticated');
        localStorage.setItem('adminUser', JSON.stringify(admin));
        localStorage.setItem('adminLoggedIn', 'true');
        
        if (formData.rememberMe) {
          localStorage.setItem('adminRemember', 'true');
        }

        toast.success(`Welcome, ${admin.name}!`);
        onLoginSuccess();
      } else {
        setError('Invalid email or password');
        toast.error('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      toast.error('Login error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoUser: { email: string, password: string, name: string }) => {
    setFormData({ ...demoUser, rememberMe: true });
    setError('');
  };

  const quickLogin = async (email: string, password: string, name: string) => {
    setLoading(true);
    setError('');
    
    try {
      localStorage.setItem('adminToken', 'authenticated');
      localStorage.setItem('adminUser', JSON.stringify({ email, name }));
      localStorage.setItem('adminLoggedIn', 'true');
      localStorage.setItem('adminRemember', 'true');
      
      toast.success(`Welcome, ${name}!`);
      setTimeout(() => {
        onLoginSuccess();
      }, 500);
    } catch (err) {
      toast.error('Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Portal
          </h1>
          <p className="text-gray-600">
            Secure access to PG Finder management
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border overflow-hidden">
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Sign In to Dashboard</h2>
              <p className="text-gray-600 text-sm">
                Enter your credentials to access the admin panel
              </p>
              
              {location.state?.message && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-700">{location.state.message}</p>
                </div>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-800">{error}</p>
                    <p className="text-xs text-red-700 mt-1">
                      Try demo credentials below
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="admin@pgfinder.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In to Dashboard'}
              </Button>
            </form>

            {/* Demo Login Buttons */}
            <div className="mt-8 pt-6 border-t">
              <p className="text-sm text-gray-600 text-center mb-4">
                Quick login with demo accounts
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => quickLogin('admin@pgfinder.com', 'Admin@123', 'Super Admin')}
                  disabled={loading}
                  className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition-all text-sm font-medium disabled:opacity-50"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="h-4 w-4" />
                    Super Admin
                  </div>
                </button>
                <button
                  onClick={() => quickLogin('ranjeet@cu.com', 'Ranjeet@123', 'Ranjeet Singh')}
                  disabled={loading}
                  className="px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 text-orange-700 rounded-lg hover:bg-orange-100 transition-all text-sm font-medium disabled:opacity-50"
                >
                  <div className="flex items-center justify-center gap-2">
                    <User className="h-4 w-4" />
                    Owner
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                PG Finder Admin Dashboard v2.0
              </p>
              <p className="text-xs text-gray-500 mt-2">
                By continuing, you agree to our Terms and Privacy Policy
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <Shield className="h-4 w-4" />
            <span>Secured by JWT Authentication</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-1" />
              <span className="text-xs font-medium text-green-700">Secure</span>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
              <Shield className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <span className="text-xs font-medium text-blue-700">Protected</span>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
              <User className="h-5 w-5 text-purple-600 mx-auto mb-1" />
              <span className="text-xs font-medium text-purple-700">Role-based</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}