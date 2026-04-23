import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { PGListing } from '@/services/api';

export interface UseContactReturn {
  handlePhoneCall: (pg: PGListing | null) => void;
  handleWhatsAppContact: (pg: PGListing | null) => void;
}

const STATIC_PHONE = '9315058665';

export const useContact = (): UseContactReturn => {
  const { isAuthenticated } = useAuth();

  const handlePhoneCall = useCallback(
    (pg: PGListing | null) => {
      if (!isAuthenticated) {
        toast.error('Please login to contact property owner');
        return;
      }

      const phoneNumber = pg?.ownerPhone || STATIC_PHONE;
      window.location.href = `tel:${phoneNumber}`;
      toast.success(`Connecting you to ${pg?.name} owner`);
    },
    [isAuthenticated]
  );

  const handleWhatsAppContact = useCallback(
    (pg: PGListing | null) => {
      if (!isAuthenticated) {
        toast.error('Please login to contact property owner');
        return;
      }

      const phoneNumber = pg?.ownerPhone || STATIC_PHONE;
      const message = encodeURIComponent(
        `Hello,\n\nI'm interested in "${pg?.name}" on EasyTorent.\n` +
          `📍 Price: ₹${pg?.price?.toLocaleString()}/month\n` +
          `📍 Location: ${pg?.locality}, ${pg?.city}\n` +
          `📍 Type: ${pg?.type}\n\n` +
          `Could you please share more details about availability and amenities?\n\n` +
          `Thanks!`
      );
      window.open(`https://wa.me/91${phoneNumber}?text=${message}`, '_blank');
      toast.success(`Opening WhatsApp chat with ${pg?.name} owner`);
    },
    [isAuthenticated]
  );

  return {
    handlePhoneCall,
    handleWhatsAppContact,
  };
};

