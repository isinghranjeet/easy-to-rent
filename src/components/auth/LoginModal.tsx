/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen, 
  onClose, 
  defaultTab = 'login' 
}) => {
  const { login: authLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpValue, setOtpValue] = useState('');

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });

  const [registerErrors, setRegisterErrors] = useState<Record<string, string>>({});

  // Handle login form input changes
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
    if (error) setError(null);
  };

  // Handle register form input changes
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
    if (registerErrors[e.target.name]) {
      setRegisterErrors({
        ...registerErrors,
        [e.target.name]: ''
      });
    }
    if (error) setError(null);
  };

  // Validate register form
  const validateRegister = (): boolean => {
    const errors: Record<string, string> = {};

    if (!registerData.name.trim()) {
      errors.name = 'Name is required';
    } else if (registerData.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!registerData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(registerData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!registerData.password) {
      errors.password = 'Password is required';
    } else if (registerData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (registerData.phone && !/^\d{10}$/.test(registerData.phone.replace(/\D/g, ''))) {
      errors.phone = 'Phone number must be 10 digits';
    }

    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Google Login Handler
  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      toast.error('Google Sign-In is not configured');
      return;
    }
    
    const redirectUri = `${window.location.origin}/auth-callback`;
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email%20profile&access_type=online&prompt=select_account`;
    
    window.location.href = googleAuthUrl;
  };

  // Login through AuthContext
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await authLogin(loginData.email, loginData.password);
      onClose();
      setLoginData({ email: '', password: '' });
    } catch (error: any) {
      if (error.message === 'OTP_REQUIRED') {
        setShowOtpScreen(true);
        toast.success('OTP sent!', { description: 'Check your email for the verification code.' });
        return;
      }

      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please check your credentials.');
      toast.error('Login failed', {
        description: error.message || 'Please check your email and password'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.verifyLoginOtp(loginData.email, otpValue);

      if (response.success && response.data) {
        toast.success('Login successful!', {
          description: `Welcome back, ${response.data.user?.name || 'User'}!`,
        });
        setShowOtpScreen(false);
        setOtpValue('');
        onClose();
        setLoginData({ email: '', password: '' });
        window.location.reload();
      } else {
        throw new Error('Verification failed');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to verify OTP';
      console.error('Verify OTP error:', error);
      setError(message);
      toast.error('Verification failed', { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  // REGISTER FUNCTION
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateRegister()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.register({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        phone: registerData.phone || undefined
      });

      if (response.success && response.data) {
        toast.success('Registration successful!', {
          description: 'Your account has been created successfully.',
        });
        
        onClose();
        setRegisterData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: ''
        });
        
        window.location.reload();
      } else {
        throw new Error(response.message || 'Registration failed');
      }

    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed. Please try again.');
      toast.error('Registration failed', {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fill with demo credentials
  const fillDemoCredentials = () => {
    setLoginData({
      email: 'rsinghranjeet7428@gmail.com',
      password: 'password123'
    });
  };

  const fillTestCredentials = () => {
    setLoginData({
      email: 'ranjeet@gmail.com',
      password: 'password123'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Welcome to Easy2Rent
          </DialogTitle>
        </DialogHeader>

        {/* Demo Users Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 mb-4">
          <div className="flex items-center gap-2 text-blue-700 mb-2">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-semibold">Test Accounts</span>
          </div>
          <p className="text-xs text-blue-600 mb-3">
            Use these existing accounts from database:
          </p>
          <div className="space-y-2">
            <Button 
              type="button"
              size="sm"
              variant="outline"
              onClick={fillDemoCredentials}
              className="w-full text-xs border-blue-200 text-blue-700 hover:bg-blue-100 justify-start"
            >
              <User className="h-3 w-3 mr-2" />
              rsinghranjeet7428@gmail.com
            </Button>
            <Button 
              type="button"
              size="sm"
              variant="outline"
              onClick={fillTestCredentials}
              className="w-full text-xs border-blue-200 text-blue-700 hover:bg-blue-100 justify-start"
            >
              <User className="h-3 w-3 mr-2" />
              ranjeet@gmail.com
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Note: You need the correct password for these accounts
          </p>
        </div>

        {showOtpScreen ? (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <Mail className="h-10 w-10 text-primary mx-auto mb-2" />
              <h3 className="text-lg font-medium">Verify your email</h3>
              <p className="text-sm text-gray-500">
                We've sent a 6-digit OTP to <strong>{loginData.email}</strong>.
              </p>
            </div>
            
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="------"
                  value={otpValue}
                  onChange={(e) => {
                    setOtpValue(e.target.value);
                    if (error) setError(null);
                  }}
                  className="text-center text-2xl tracking-widest uppercase font-mono h-14"
                  maxLength={6}
                  required
                  disabled={isLoading}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading || otpValue.length < 6}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </Button>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowOtpScreen(false);
                    setOtpValue('');
                    setError(null);
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                >
                  Back to login
                </button>
              </div>
            </form>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'register')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      className="pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="login-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      className="pl-10 pr-10"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && activeTab === 'login' && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                {/* Google Sign In Button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full"
                >
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </Button>

                <div className="text-center text-sm text-gray-500">
                  <button
                    type="button"
                    onClick={() => setActiveTab('register')}
                    className="text-primary hover:underline"
                  >
                    Don't have an account? Register
                  </button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-name"
                      name="name"
                      placeholder="Enter your full name"
                      value={registerData.name}
                      onChange={handleRegisterChange}
                      className="pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  {registerErrors.name && (
                    <p className="text-xs text-red-500">{registerErrors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      className="pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  {registerErrors.email && (
                    <p className="text-xs text-red-500">{registerErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-phone">Phone Number (Optional)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={registerData.phone}
                      onChange={handleRegisterChange}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                  {registerErrors.phone && (
                    <p className="text-xs text-red-500">{registerErrors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password (min. 6 characters)"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      className="pl-10 pr-10"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {registerErrors.password && (
                    <p className="text-xs text-red-500">{registerErrors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password">Confirm Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="register-confirm-password"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      className="pl-10 pr-10"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {registerErrors.confirmPassword && (
                    <p className="text-xs text-red-500">{registerErrors.confirmPassword}</p>
                  )}
                </div>

                {error && activeTab === 'register' && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating account...
                    </>
                  ) : (
                    'Register'
                  )}
                </Button>

                <div className="text-center text-sm text-gray-500">
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="text-primary hover:underline"
                  >
                    Already have an account? Login
                  </button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        )}

        <div className="text-xs text-center text-gray-400 mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;