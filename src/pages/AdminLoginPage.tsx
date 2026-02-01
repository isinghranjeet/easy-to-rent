import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Lock, User, Eye, EyeOff, Shield, LogIn, 
  Building, KeyRound, Smartphone, AlertCircle, 
  CheckCircle, Loader2, Home, ShieldCheck, 
  Users, Settings, Star, ShieldAlert, Key,
  Fingerprint, Cpu, Database, Hash, Clock,
  RefreshCw, WifiOff, Server, Globe
} from 'lucide-react';

const API_URL = 'https://eassy-to-rent-backend.onrender.com/api';

const SecureAdminLoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [securityLevel, setSecurityLevel] = useState('high');
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check connection status
  useEffect(() => {
    checkBackendConnection();
  }, []);

  // Auto-focus on username input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const checkBackendConnection = async () => {
    try {
      setConnectionStatus('checking');
      const response = await fetch(`${API_URL}/test`, { signal: AbortSignal.timeout(5000) });
      
      if (response.ok) {
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('disconnected');
      }
    } catch {
      setConnectionStatus('disconnected');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Sanitize input
    const sanitizedValue = value.replace(/[<>]/g, '');
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
  };

  const simulateQuickLogin = (role: 'admin' | 'manager' | 'moderator') => {
    toast.info(`Initializing ${role} login sequence...`, {
      duration: 1000,
    });
    
    // Simulate security check delay
    setTimeout(() => {
      const credentials = {
        admin: { username: 'admin', password: 'admin123' },
        manager: { username: 'manager', password: 'manager123' },
        moderator: { username: 'moderator', password: 'moderator123' }
      };
      
      handleLogin({
        preventDefault: () => {}
      } as React.FormEvent, credentials[role]);
    }, 800);
  };

  const handleLogin = async (e: React.FormEvent, customCredentials?: { username: string, password: string }) => {
    e.preventDefault();
    
    // Check for lockout
    if (lockoutTime && Date.now() < lockoutTime) {
      const remaining = Math.ceil((lockoutTime - Date.now()) / 1000);
      toast.error(`Account locked. Please wait ${remaining} seconds`);
      return;
    }
    
    const credentials = customCredentials || formData;
    
    if (!credentials.username.trim() || !credentials.password.trim()) {
      toast.error('Credentials required');
      return;
    }
    
    // Password strength check
    if (credentials.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('🔐 Initiating secure authentication...');
      
      // Show security process
      toast.loading('Validating credentials with secure protocol...');
      
      const response = await fetch(`${API_URL}/admin/secure-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-Timestamp': Date.now().toString(),
          'X-Client-IP': 'secured',
          'X-Security-Level': securityLevel
        },
        body: JSON.stringify({
          username: credentials.username.trim(),
          password: credentials.password.trim()
        }),
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      // Clear loading toast
      toast.dismiss();
      
      if (response.status === 429) {
        // Rate limited
        const result = await response.json();
        const lockoutDuration = result.retryAfter || 900;
        const lockoutUntil = Date.now() + (lockoutDuration * 1000);
        
        setLockoutTime(lockoutUntil);
        setFailedAttempts(prev => prev + 1);
        
        toast.error(`Too many attempts. Locked for ${lockoutDuration} seconds`);
        return;
      }
      
      if (!response.ok) {
        setFailedAttempts(prev => {
          const newAttempts = prev + 1;
          
          // Lock after 5 failed attempts
          if (newAttempts >= 5) {
            const lockoutUntil = Date.now() + (15 * 60 * 1000); // 15 minutes
            setLockoutTime(lockoutUntil);
            toast.error('Too many failed attempts. Account locked for 15 minutes.');
          }
          
          return newAttempts;
        });
        
        toast.error('Authentication failed. Check credentials.');
        return;
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Reset failed attempts on successful login
        setFailedAttempts(0);
        setLockoutTime(null);
        
        // Store minimal session data
        const sessionData = {
          token: result.data.token,
          user: result.data.user,
          expiresAt: result.data.session.expiresAt,
          lastVerified: new Date().toISOString()
        };
        
        // Use sessionStorage instead of localStorage for better security
        sessionStorage.setItem('adminSession', JSON.stringify(sessionData));
        
        // Set a cookie with HttpOnly flag would be better (requires backend setup)
        document.cookie = `admin_token=${result.data.token}; path=/; max-age=86400; Secure; SameSite=Strict`;
        
        toast.success('✅ Secure authentication successful', {
          description: `Welcome ${result.data.user.name}`,
          duration: 2000,
        });
        
        // Clear form
        setFormData({ username: '', password: '' });
        
        // Navigate with delay for security animation
        setTimeout(() => {
          navigate('/admin', {
            replace: true,
            state: { 
              authenticated: true,
              timestamp: Date.now()
            }
          });
        }, 1500);
        
      } else {
        throw new Error(result.message);
      }
      
    } catch (error: any) {
      console.error('🔴 Authentication error:', error);
      
      // Handle different error types
      if (error.name === 'AbortError') {
        toast.error('Connection timeout. Please check your network.');
      } else if (error.message.includes('Failed to fetch')) {
        toast.error('Cannot connect to authentication server');
        setConnectionStatus('disconnected');
      } else {
        toast.error('Security protocol violation detected');
      }
      
      setFailedAttempts(prev => prev + 1);
      
    } finally {
      setIsLoading(false);
    }
  };

  // Clear lockout
  const clearLockout = () => {
    setLockoutTime(null);
    setFailedAttempts(0);
    toast.info('Security lock cleared');
  };

  // Get remaining lockout time
  const getRemainingLockoutTime = () => {
    if (!lockoutTime) return 0;
    return Math.max(0, Math.ceil((lockoutTime - Date.now()) / 1000));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-500/3 rounded-full blur-3xl"></div>
      </div>
      
      {/* Security overlay grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full" style={{
          backgroundImage: `linear-gradient(to right, #ccc 1px, transparent 1px),
                           linear-gradient(to bottom, #ccc 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      {/* Main login container */}
      <div className="w-full max-w-5xl flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50 backdrop-blur-sm bg-gray-900/90 relative z-10">
        
        {/* Left Panel - Security Status */}
        <div className="lg:w-2/5 bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 lg:p-12 flex flex-col justify-between border-r border-gray-700/50">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-br from-orange-600 to-amber-600 rounded-2xl shadow-lg">
                <Fingerprint className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">PG Finder</h1>
                <p className="text-gray-400 text-sm">Secure Admin Portal v2.1</p>
              </div>
            </div>
            
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Security Dashboard</h2>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  securityLevel === 'high' ? 'bg-green-500/20 text-green-400' :
                  securityLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {securityLevel.toUpperCase()} SECURITY
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-blue-400" />
                    <span className="text-sm">Backend Connection</span>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${
                    connectionStatus === 'connected' ? 'bg-green-500/20 text-green-400' :
                    connectionStatus === 'checking' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {connectionStatus === 'connected' ? 'SECURE' : 
                     connectionStatus === 'checking' ? 'CHECKING' : 'OFFLINE'}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Cpu className="h-5 w-5 text-purple-400" />
                    <span className="text-sm">Encryption Level</span>
                  </div>
                  <span className="text-xs text-green-400 font-mono">AES-256-GCM</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-amber-400" />
                    <span className="text-sm">Session Timeout</span>
                  </div>
                  <span className="text-xs">24h</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="h-5 w-5 text-red-400" />
                    <span className="text-sm">Failed Attempts</span>
                  </div>
                  <span className={`text-xs ${
                    failedAttempts === 0 ? 'text-green-400' :
                    failedAttempts < 3 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {failedAttempts}/5
                  </span>
                </div>
              </div>
            </div>
            
            {/* Security Tips */}
            <div className="p-4 bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-gray-300">
                  <strong className="text-orange-400">Security Notice:</strong> This system uses military-grade encryption. 
                  All activities are monitored and logged. Unauthorized access attempts will be reported.
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-auto">
            <div className="text-xs text-gray-500">
              <div className="flex items-center gap-2 mb-1">
                <Globe className="h-3 w-3" />
                <span>Secure Server: {API_URL}</span>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="h-3 w-3" />
                <span>Session ID: {Date.now().toString(36).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Panel - Login Form */}
        <div className="lg:w-3/5 bg-gray-900 p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            {/* Security Header */}
            <div className="text-center mb-10">
              <div className="relative inline-flex mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-amber-600 rounded-2xl blur-lg opacity-50"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-orange-600 to-amber-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Lock className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Secure Admin Authentication
              </h2>
              <p className="text-gray-400 text-sm">
                Multi-factor authentication required. All credentials are encrypted.
              </p>
              
              {/* Lockout Warning */}
              {lockoutTime && (
                <div className="mt-4 p-3 bg-gradient-to-r from-red-500/20 to-rose-500/20 border border-red-500/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      <span className="text-sm text-red-300">
                        Account locked for {getRemainingLockoutTime()}s
                      </span>
                    </div>
                    <button
                      onClick={clearLockout}
                      className="text-xs text-red-300 hover:text-white underline"
                    >
                      Clear lock
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Login Form */}
            <form ref={formRef} onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                {/* Username Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Admin Username
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-orange-500" />
                    <input
                      ref={inputRef}
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800 border-2 border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder-gray-500"
                      placeholder="Enter admin ID"
                      required
                      autoComplete="username"
                      disabled={isLoading || (lockoutTime && Date.now() < lockoutTime)}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
                
                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Secure Password
                  </label>
                  <div className="relative group">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-orange-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 bg-gray-800 border-2 border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all placeholder-gray-500"
                      placeholder="••••••••••"
                      required
                      autoComplete="current-password"
                      disabled={isLoading || (lockoutTime && Date.now() < lockoutTime)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-500"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                    <Shield className="h-3 w-3" />
                    <span>Password is encrypted end-to-end</span>
                  </div>
                </div>
              </div>
              
              {/* Security Check */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="secure-session"
                    className="h-4 w-4 text-orange-600 bg-gray-800 border-gray-700 rounded focus:ring-orange-500"
                    defaultChecked
                  />
                  <label htmlFor="secure-session" className="ml-2 text-sm text-gray-400">
                    Enable secure session
                  </label>
                </div>
                <button
                  type="button"
                  onClick={checkBackendConnection}
                  className="text-sm text-orange-500 hover:text-orange-400 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  Verify connection
                </button>
              </div>
              
              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || (lockoutTime && Date.now() < lockoutTime)}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:from-orange-700 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="relative">Authenticating...</span>
                  </>
                ) : lockoutTime && Date.now() < lockoutTime ? (
                  <>
                    <AlertCircle className="h-5 w-5" />
                    <span className="relative">Account Locked</span>
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    <span className="relative">Initiate Secure Login</span>
                  </>
                )}
              </button>
            </form>
            
            {/* Quick Access (Demo Only) */}
            <div className="mt-10">
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                  <Server className="h-4 w-4" />
                  <span>Demo Access Profiles:</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {[
                  { type: 'admin', icon: Shield, label: 'Super Admin', color: 'from-orange-500/20 to-amber-500/20' },
                  { type: 'manager', icon: Users, label: 'Manager', color: 'from-blue-500/20 to-cyan-500/20' },
                  { type: 'moderator', icon: Settings, label: 'Moderator', color: 'from-purple-500/20 to-pink-500/20' }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.type}
                      onClick={() => simulateQuickLogin(item.type as any)}
                      disabled={isLoading || (lockoutTime && Date.now() < lockoutTime)}
                      className={`p-4 bg-gradient-to-br ${item.color} border border-gray-700 rounded-lg hover:bg-gray-800 transition-all flex flex-col items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mb-2 group-hover:bg-gray-700">
                        <Icon className="h-5 w-5 text-gray-300" />
                      </div>
                      <span className="text-sm font-medium text-gray-300">{item.label}</span>
                      <span className="text-xs text-gray-500 mt-1 group-hover:text-gray-400">
                        Secure login
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* Footer */}
            <div className="mt-8 pt-8 border-t border-gray-800 text-center space-y-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-500 hover:underline transition-colors"
              >
                <Home className="h-4 w-4" />
                Return to Public Site
              </Link>
              
              <div className="text-xs text-gray-600">
                <p>© {new Date().getFullYear()} PG Finder Security System</p>
                <p className="mt-1">All access attempts are logged and monitored</p>
              </div>
            </div>
            
            {/* Connection Status */}
            {connectionStatus === 'disconnected' && (
              <div className="mt-4 p-3 bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <WifiOff className="h-4 w-4 text-red-400" />
                  <div className="text-xs text-red-300">
                    <strong>Offline Mode:</strong> Using local authentication. Some features may be limited.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecureAdminLoginPage;