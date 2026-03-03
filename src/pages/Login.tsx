import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Home as HomeIcon,
  Shield,
  Heart,
  Star,
  Building2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const { login, register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/';

  // Check if URL has ?role=owner param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('role') === 'owner') {
      setIsOwner(true);
    }
  }, [location.search]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'owner') {
        navigate('/owner', { replace: true });
      } else if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, from]);

  const validateForm = (): boolean => {
    setError(null);
    if (!formData.email) { setError('Email is required'); return false; }
    if (!/\S+@\S+\.\S+/.test(formData.email)) { setError('Please enter a valid email address'); return false; }
    if (!formData.password) { setError('Password is required'); return false; }
    if (formData.password.length < 8) { setError('Password must be at least 8 characters'); return false; }

    if (mode === 'register') {
      if (!formData.name.trim()) { setError('Name is required'); return false; }
      if (!formData.phone) { setError('Phone number is required'); return false; }
      if (!/^\d{10}$/.test(formData.phone)) { setError('Please enter a valid 10-digit phone number'); return false; }
      if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return false; }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
      } else {
        await register(
          formData.name,
          formData.email,
          formData.password,
          formData.phone,
          isOwner ? 'owner' : 'user'
        );
      }
    } catch (err: unknown) {
      console.error('Auth error:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError(null);
    setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  };

  const toggleOwner = () => {
    setIsOwner(!isOwner);
    setError(null);
    setMode('login');
    setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  };

  // Feature cards for left panel
  const tenantFeatures = [
    { icon: <Heart className="h-5 w-5" />, title: 'Save Favorites', desc: 'Wishlist PGs you love and access them anytime' },
    { icon: <Shield className="h-5 w-5" />, title: 'Verified Listings', desc: 'All properties are verified for your safety' },
    { icon: <Star className="h-5 w-5" />, title: 'Reviews & Ratings', desc: 'Read real reviews from fellow tenants' },
  ];

  const ownerFeatures = [
    { icon: <Building2 className="h-5 w-5" />, title: 'List Your Property', desc: 'Create and manage your PG listings easily' },
    { icon: <Star className="h-5 w-5" />, title: 'Get Reviews', desc: 'Build trust with ratings from real tenants' },
    { icon: <Shield className="h-5 w-5" />, title: 'Verified Badge', desc: 'Get verified status for more visibility' },
  ];

  const features = isOwner ? ownerFeatures : tenantFeatures;

  // Dynamic colors
  const accentFrom = isOwner ? 'from-indigo-900' : 'from-sky-900';
  const accentVia = isOwner ? 'via-purple-800' : 'via-sky-800';
  const accentTo = isOwner ? 'to-violet-700' : 'to-orange-700';
  const btnFrom = isOwner ? 'from-purple-600' : 'from-orange-600';
  const btnTo = isOwner ? 'to-indigo-600' : 'to-amber-600';
  const btnShadow = isOwner ? 'shadow-purple-500/25 hover:shadow-purple-500/30' : 'shadow-orange-500/25 hover:shadow-orange-500/30';
  const btnHoverFrom = isOwner ? 'hover:from-purple-700' : 'hover:from-orange-700';
  const btnHoverTo = isOwner ? 'hover:to-indigo-700' : 'hover:to-amber-700';
  const focusRing = isOwner ? 'focus:ring-purple-500 focus:border-purple-500' : 'focus:ring-orange-500 focus:border-orange-500';
  const linkColor = isOwner ? 'text-purple-600 hover:text-purple-700' : 'text-orange-600 hover:text-orange-700';
  const featureIconBg = isOwner ? 'bg-purple-500/20' : 'bg-orange-500/20';
  const featureIconText = isOwner ? 'text-purple-300' : 'text-orange-300';
  const gradientText = isOwner
    ? 'from-purple-300 to-pink-200'
    : 'from-orange-300 to-yellow-200';

  return (
    <div className="min-h-screen flex">
      {/* ── LEFT PANEL ── */}
      <div className={`hidden lg:flex lg:w-1/2 relative bg-gradient-to-br ${accentFrom} ${accentVia} ${accentTo} overflow-hidden transition-colors duration-700`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[500px] h-[500px] -top-32 -left-32 bg-white/5 rounded-full blur-sm animate-pulse" />
          <div className="absolute w-[400px] h-[400px] bottom-20 right-10 bg-white/10 rounded-full blur-sm" style={{ animation: 'pulse 3s infinite alternate' }} />
          <div className="absolute w-[300px] h-[300px] top-1/2 left-1/3 bg-white/10 rounded-full blur-sm" style={{ animation: 'pulse 4s infinite alternate-reverse' }} />
        </div>

        <div className="relative z-10 flex flex-col justify-center p-12 xl:p-20 text-white">
          <Link to="/" className="flex items-center gap-3 mb-12 group">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors">
              <HomeIcon className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold">
              <span className="text-white">EassyTo</span>
              <span className={isOwner ? 'text-purple-300' : 'text-orange-300'}>Rent</span>
            </span>
          </Link>

          <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
            {isOwner ? (
              <>
                List Your PG
                <br />
                <span className={`bg-gradient-to-r ${gradientText} bg-clip-text text-transparent`}>
                  Reach Thousands
                </span>
              </>
            ) : (
              <>
                Find Your Perfect
                <br />
                <span className={`bg-gradient-to-r ${gradientText} bg-clip-text text-transparent`}>
                  PG Accommodation
                </span>
              </>
            )}
          </h1>

          <p className="text-lg text-white/70 mb-10 max-w-md leading-relaxed">
            {isOwner
              ? 'List your PG property, manage bookings, and reach thousands of students & professionals.'
              : 'Join thousands of students and professionals who found their ideal PG with EassyToRent.'}
          </p>

          <div className="space-y-4">
            {features.map((feature, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors duration-300"
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${featureIconBg} flex items-center justify-center ${featureIconText}`}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-white/60">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isOwner ? 'bg-indigo-900' : 'bg-sky-900'}`}>
                <HomeIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                <span className={isOwner ? 'text-indigo-900' : 'text-sky-900'}>EassyTo</span>
                <span className={isOwner ? 'text-purple-600' : 'text-orange-600'}>Rent</span>
              </span>
            </Link>
          </div>

          {/* ── Owner / Tenant Toggle ── */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 rounded-xl p-1 flex gap-1">
              <button
                onClick={() => { if (isOwner) toggleOwner(); }}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  !isOwner
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                🏠 Tenant
              </button>
              <button
                onClick={() => { if (!isOwner) toggleOwner(); }}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  isOwner
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                🏢 PG Owner
              </button>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {mode === 'login'
                ? (isOwner ? 'Owner Login' : 'Welcome Back')
                : (isOwner ? 'Register as Owner' : 'Create Account')}
            </h2>
            <p className="text-gray-500 mt-2">
              {mode === 'login'
                ? (isOwner ? 'Sign in to manage your PG properties' : 'Sign in to your account to continue')
                : (isOwner ? 'List your PG and start getting tenants' : 'Join EassyToRent to save & compare PGs')}
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-shake">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && (
              <>
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {isOwner ? 'Owner / Business Name' : 'Full Name'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 ${focusRing} focus:ring-2 outline-none transition-all`}
                      placeholder={isOwner ? 'Your PG or business name' : 'John Doe'}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 ${focusRing} focus:ring-2 outline-none transition-all`}
                      placeholder="9876543210"
                      maxLength={10}
                      disabled={loading}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 ${focusRing} focus:ring-2 outline-none transition-all`}
                  placeholder="you@example.com"
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full pl-11 pr-12 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 ${focusRing} focus:ring-2 outline-none transition-all`}
                  placeholder="••••••••"
                  disabled={loading}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (register only) */}
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`w-full pl-11 pr-12 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 ${focusRing} focus:ring-2 outline-none transition-all`}
                    placeholder="••••••••"
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 bg-gradient-to-r ${btnFrom} ${btnTo} text-white rounded-xl font-semibold shadow-lg ${btnShadow} ${btnHoverFrom} ${btnHoverTo} hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  {mode === 'login'
                    ? (isOwner ? 'Sign In as Owner' : 'Sign In')
                    : (isOwner ? 'Register as Owner' : 'Create Account')}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Switch mode */}
          <p className="text-center text-sm text-gray-600">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={switchMode}
              className={`${linkColor} font-semibold hover:underline transition-colors`}
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          {/* Trust badges */}
          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5" />
              <span>Verified</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5" />
              <span>Trusted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
