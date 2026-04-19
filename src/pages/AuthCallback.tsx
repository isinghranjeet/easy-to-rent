import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { api } from '@/services/api';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const errorParam = urlParams.get('error');

      if (errorParam) {
        setError(`Google auth error: ${errorParam}`);
        toast.error('Google login cancelled or failed');
        setTimeout(() => navigate('/'), 2000);
        return;
      }

      if (!code) {
        setError('No authorization code received');
        toast.error('Authentication failed');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      try {
        const response = await api.request('/api/auth/google', {
          method: 'POST',
          body: JSON.stringify({ code })
        });

        if (response.success) {
          localStorage.setItem('auth_token', response.data.token);
          api.setToken(response.data.token);
          toast.success(`Welcome ${response.data.user.name}!`);
          navigate('/');
          setTimeout(() => {
            window.location.reload();
          }, 100);
        } else {
          throw new Error(response.message || 'Login failed');
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || 'Authentication failed');
        toast.error('Login failed', { description: err.message });
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        {error ? (
          <>
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Error</h2>
            <p className="text-gray-600">{error}</p>
            <p className="text-sm text-gray-500 mt-4">Redirecting to home page...</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Completing Login</h2>
            <p className="text-gray-600">Please wait while we verify your Google account...</p>
          </>
        )}
      </div>
    </div>
  );
}