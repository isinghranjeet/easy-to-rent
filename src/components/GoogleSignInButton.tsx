import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Chrome } from 'lucide-react';

interface GoogleSignInButtonProps {
  onSuccess: (credential: string) => void;
  onError: () => void;
  isLoading?: boolean;
}

declare global {
  interface Window {
    google?: any;
  }
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ 
  onSuccess, 
  onError, 
  isLoading 
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if Google script is loaded
    const initializeGoogleButton = () => {
      if (window.google && buttonRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: (response: any) => {
              if (response.credential) {
                onSuccess(response.credential);
              } else {
                onError();
              }
            },
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          window.google.accounts.id.renderButton(
            buttonRef.current,
            {
              type: 'standard',
              theme: 'outline',
              size: 'large',
              text: 'continue_with',
              shape: 'rectangular',
              logo_alignment: 'left',
              width: '100%',
            }
          );
        } catch (error) {
          console.error('Error initializing Google button:', error);
        }
      } else {
        // Retry after 500ms if Google script not loaded
        setTimeout(initializeGoogleButton, 500);
      }
    };

    initializeGoogleButton();

    return () => {
      // Cleanup
      if (window.google && buttonRef.current) {
        buttonRef.current.innerHTML = '';
      }
    };
  }, [onSuccess, onError]);

  return (
    <div className="w-full">
      <div ref={buttonRef} className="w-full flex justify-center"></div>
      {isLoading && (
        <div className="text-center text-sm text-gray-500 mt-2">
          Processing...
        </div>
      )}
    </div>
  );
};

export default GoogleSignInButton;