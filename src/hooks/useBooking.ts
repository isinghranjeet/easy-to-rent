import { useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { calculateBookingPrice } from '@/lib/utils/pricingUtils';
import type { PGListing } from '@/services/api';
import type { RoomDetail, BookingData } from '@/types/pgDetail';

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: { _id: string };
  error?: string;
}

export interface UseBookingReturn {
  bookingData: BookingData;
  setBookingData: React.Dispatch<React.SetStateAction<BookingData>>;
  bookingMonths: number;
  setBookingMonths: (value: number) => void;
  selectedRoom: number;
  setSelectedRoom: (value: number) => void;
  roomDetails: RoomDetail[];
  calculatedPrice: number;
  totalSavings: number;
  showBookingForm: boolean;
  setShowBookingForm: (value: boolean) => void;
  currentBookingId: string;
  setCurrentBookingId: (value: string) => void;
  showPaymentModal: boolean;
  setShowPaymentModal: (value: boolean) => void;
  handleBookingSubmit: (e: React.FormEvent) => Promise<void>;
  resetBooking: () => void;
}

const generateDefaultRooms = (basePrice: number): RoomDetail[] => [
  {
    type: 'Single Occupancy',
    price: basePrice,
    size: '120 sq ft',
    available: 3,
    description: 'Private room with attached bathroom, study table, and wardrobe',
  },
  {
    type: 'Double Occupancy',
    price: basePrice,
    size: '180 sq ft',
    available: 5,
    description: 'Shared room for 2 people with separate beds and storage',
  },
  {
    type: 'Triple Occupancy',
    price: basePrice,
    size: '220 sq ft',
    available: 2,
    description: 'Shared room for 3 people, economical option',
  },
];

const generateRoomsFromPG = (pg: PGListing): RoomDetail[] => {
  if (pg.roomTypes && pg.roomTypes.length > 0) {
    return pg.roomTypes.map((type, index) => ({
      type,
      price: pg.price,
      size: index === 0 ? '120 sq ft' : index === 1 ? '180 sq ft' : '220 sq ft',
      available: Math.floor(Math.random() * 5) + 1,
      description: `${type} occupancy room with basic amenities`,
    }));
  }
  return generateDefaultRooms(pg.price);
};

export const useBooking = (pg: PGListing | null): UseBookingReturn => {
  const { isAuthenticated, user } = useAuth();

  const [bookingData, setBookingData] = useState<BookingData>({
    name: '',
    phone: '',
    email: '',
    message: '',
    moveInDate: '',
  });
  const [bookingMonths, setBookingMonths] = useState(3);
  const [selectedRoom, setSelectedRoom] = useState(0);
  const [roomDetails, setRoomDetails] = useState<RoomDetail[]>([]);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Initialize room details when PG loads
  useEffect(() => {
    if (pg) {
      setRoomDetails(generateRoomsFromPG(pg));
    }
  }, [pg]);

  // Recalculate price when PG or months change
  useEffect(() => {
    if (pg) {
      const breakdown = calculateBookingPrice(pg.price, bookingMonths);
      setCalculatedPrice(breakdown.finalPrice);
      setTotalSavings(breakdown.savings);
    }
  }, [pg, bookingMonths]);

  const handleBookingSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!pg || !pg._id) {
        toast.error('Property data not loaded. Please refresh the page.');
        return;
      }

      if (!pg.price || pg.price <= 0) {
        toast.error('Invalid property price. Please contact support.');
        return;
      }

      if (!bookingData.moveInDate) {
        toast.error('Please select a move-in date');
        return;
      }

      if (!bookingData.name || !bookingData.name.trim()) {
        toast.error('Please enter your full name');
        return;
      }

      if (!bookingData.phone || !bookingData.phone.trim()) {
        toast.error('Please enter your phone number');
        return;
      }

      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(bookingData.phone.trim())) {
        toast.error('Please enter a valid 10-digit phone number');
        return;
      }

      if (!isAuthenticated || !user) {
        toast.error('Please login to book this property');
        return;
      }

      try {
        const checkInDate = new Date(bookingData.moveInDate);
        if (isNaN(checkInDate.getTime())) {
          toast.error('Invalid date format');
          return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (checkInDate < today) {
          toast.error('Move-in date cannot be in the past');
          return;
        }

        const checkOutDate = new Date(checkInDate);
        checkOutDate.setMonth(checkOutDate.getMonth() + bookingMonths);

        const months = Number(bookingMonths);
        const basePrice = Number(pg.price);
        let finalTotalAmount = basePrice * months;

        if (months >= 6) {
          finalTotalAmount = finalTotalAmount * 0.85;
        } else if (months >= 3) {
          finalTotalAmount = finalTotalAmount * 0.9;
        }

        finalTotalAmount = Math.round(finalTotalAmount);

        if (isNaN(finalTotalAmount) || finalTotalAmount <= 0) {
          toast.error('Invalid amount calculated');
          return;
        }

        const roomTypeValue =
          roomDetails && roomDetails[selectedRoom]?.type
            ? roomDetails[selectedRoom].type
            : 'Single Occupancy';

        const requestBody = {
          pgId: pg._id,
          userId: user._id,
          roomType: roomTypeValue,
          checkInDate: checkInDate.toISOString(),
          checkOutDate: checkOutDate.toISOString(),
          durationMonths: String(months),
          totalAmount: String(finalTotalAmount),
          guestDetails: {
            name: bookingData.name.trim(),
            phone: bookingData.phone.trim(),
            email: bookingData.email?.trim() || user.email || '',
          },
          specialRequests: bookingData.message?.trim() || '',
        };

        const response = await api.request<ApiResponse>('/api/bookings', {
          method: 'POST',
          body: JSON.stringify(requestBody),
        });

        if (response.success && response.data?._id) {
          toast.success('Booking created! Proceed to payment.');
          setCurrentBookingId(response.data._id);
          setShowBookingForm(false);
          setShowPaymentModal(true);

          setBookingData({
            name: '',
            phone: '',
            email: '',
            message: '',
            moveInDate: '',
          });
          setBookingMonths(3);
          setSelectedRoom(0);
        } else {
          toast.error(response.message || response.error || 'Booking failed');
        }
      } catch (error: unknown) {
        console.error('Error creating booking:', error);
        const msg = error instanceof Error ? error.message : 'Failed to create booking';
        toast.error(msg);
      }
    },
    [pg, bookingData, bookingMonths, selectedRoom, roomDetails, isAuthenticated, user]
  );

  const resetBooking = useCallback(() => {
    setBookingData({
      name: '',
      phone: '',
      email: '',
      message: '',
      moveInDate: '',
    });
    setBookingMonths(3);
    setSelectedRoom(0);
    setShowBookingForm(false);
    setShowPaymentModal(false);
    setCurrentBookingId('');
  }, []);

  return {
    bookingData,
    setBookingData,
    bookingMonths,
    setBookingMonths,
    selectedRoom,
    setSelectedRoom,
    roomDetails,
    calculatedPrice,
    totalSavings,
    showBookingForm,
    setShowBookingForm,
    currentBookingId,
    setCurrentBookingId,
    showPaymentModal,
    setShowPaymentModal,
    handleBookingSubmit,
    resetBooking,
  };
};

