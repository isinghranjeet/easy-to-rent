import { useCallback } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { api, type PGListing } from '@/services/api';

export interface UseContactOptions {
  onAuthRequired?: () => void;
}

export interface UseContactReturn {
  handlePhoneCall: (pg: PGListing | null) => void;
  handleWhatsAppContact: (pg: PGListing | null) => void;
}

const STATIC_PHONE = '9315058665';

export const useContact = (options: UseContactOptions = {}): UseContactReturn => {
  const { isAuthenticated } = useAuth();
  const { onAuthRequired } = options;

  const handlePhoneCall = useCallback(
    async (pg: PGListing | null) => {
      if (!isAuthenticated) {
        onAuthRequired?.();
        toast.info('Please login to contact the owner', {
          description: 'Authentication is required to call or message property owners.',
        });
        return;
      }

      const phoneNumber = pg?.ownerPhone || pg?.contactPhone || STATIC_PHONE;

      try {
        // Log contact attempt via protected backend API
        if (pg?._id) {
          await api.initiateContact(pg._id, 'call');
        }
      } catch (error) {
        console.error('Contact initiation error:', error);
        // Continue even if logging fails — don't block the user
      }

      window.location.href = `tel:${phoneNumber}`;
      toast.success(`Connecting you to ${pg?.name || 'property'} owner`);
    },
    [isAuthenticated, onAuthRequired]
  );

  const handleWhatsAppContact = useCallback(
    async (pg: PGListing | null) => {
      if (!isAuthenticated) {
        onAuthRequired?.();
        toast.info('Please login to contact the owner', {
          description: 'Authentication is required to call or message property owners.',
        });
        return;
      }

      const phoneNumber = pg?.ownerPhone || pg?.contactPhone || STATIC_PHONE;
      const message = encodeURIComponent(
        `Hello,\n\nI'm interested in "${pg?.name}" on EasyTorent.\n` +
          `📍 Price: ₹${pg?.price?.toLocaleString()}/month\n` +
          `📍 Location: ${pg?.locality}, ${pg?.city}\n` +
          `📍 Type: ${pg?.type}\n\n` +
          `Could you please share more details about availability and amenities?\n\n` +
          `Thanks!`
      );

      try {
        // Log contact attempt via protected backend API
        if (pg?._id) {
          await api.initiateContact(pg._id, 'whatsapp');
        }
      } catch (error) {
        console.error('Contact initiation error:', error);
        // Continue even if logging fails — don't block the user
      }

      window.open(`https://wa.me/91${phoneNumber}?text=${message}`, '_blank');
      toast.success(`Opening WhatsApp chat with ${pg?.name || 'property'} owner`);
    },
    [isAuthenticated, onAuthRequired]
  );

  return {
    handlePhoneCall,
    handleWhatsAppContact,
  };
};

