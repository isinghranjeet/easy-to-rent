import { useCallback } from 'react';
import { toast } from 'sonner';
import type { PGListing } from '@/services/api';

export interface UseContactReturn {
  handlePhoneCall: (pg: PGListing | null) => void;
  handleWhatsAppContact: (pg: PGListing | null) => void;
}

const STATIC_PHONE = '9315058665';

export const useContact = (): UseContactReturn => {
  const handlePhoneCall = useCallback(
    (pg: PGListing | null) => {
      const phoneNumber = pg?.ownerPhone || pg?.contactPhone || STATIC_PHONE;
      window.location.href = `tel:${phoneNumber}`;
      toast.success(`Connecting you to ${pg?.name || 'property'} owner`);
    },
    []
  );

  const handleWhatsAppContact = useCallback(
    (pg: PGListing | null) => {
      const phoneNumber = pg?.ownerPhone || pg?.contactPhone || STATIC_PHONE;
      const message = encodeURIComponent(
        `Hello,\n\nI'm interested in "${pg?.name}" on EasyTorent.\n` +
          `📍 Price: ₹${pg?.price?.toLocaleString()}/month\n` +
          `📍 Location: ${pg?.locality}, ${pg?.city}\n` +
          `📍 Type: ${pg?.type}\n\n` +
          `Could you please share more details about availability and amenities?\n\n` +
          `Thanks!`
      );
      window.open(`https://wa.me/91${phoneNumber}?text=${message}`, '_blank');
      toast.success(`Opening WhatsApp chat with ${pg?.name || 'property'} owner`);
    },
    []
  );

  return {
    handlePhoneCall,
    handleWhatsAppContact,
  };
};

