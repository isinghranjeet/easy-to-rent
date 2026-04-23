import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingData {
  name: string;
  phone: string;
  email: string;
  message: string;
  moveInDate: string;
}

interface RoomDetail {
  type: string;
  price: number;
  size: string;
  available: number;
  description: string;
}

interface PgSummary {
  name: string;
  address: string;
}

interface BookingFormModalProps {
  open: boolean;
  pg: PgSummary | null;
  roomDetails: RoomDetail[];
  selectedRoom: number;
  bookingMonths: number;
  calculatedPrice: number;
  bookingData: BookingData;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  setBookingData: React.Dispatch<React.SetStateAction<BookingData>>;
}

export function BookingFormModal({
  open,
  pg,
  roomDetails,
  selectedRoom,
  bookingMonths,
  calculatedPrice,
  bookingData,
  onClose,
  onSubmit,
  setBookingData,
}: BookingFormModalProps) {
  if (!open || !pg) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Book Your Room</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-6 p-4 bg-orange-50 rounded-lg">
            <h3 className="font-bold text-gray-900">{pg.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{pg.address}</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm font-medium">Selected Room:</span>
              <span className="font-bold text-orange-600">{roomDetails[selectedRoom]?.type || "Single Occupancy"}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm font-medium">Duration:</span>
              <span className="font-bold text-orange-600">{bookingMonths} months</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm font-medium">Total Amount:</span>
              <span className="font-bold text-orange-600">₹{calculatedPrice.toLocaleString()}</span>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                value={bookingData.name}
                onChange={(e) => setBookingData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                value={bookingData.phone}
                onChange={(e) => setBookingData((prev) => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 outline-none"
                required
                pattern="[0-9]{10}"
                title="Please enter a valid 10-digit phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={bookingData.email}
                onChange={(e) => setBookingData((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Move-in Date *</label>
              <input
                type="date"
                value={bookingData.moveInDate}
                onChange={(e) => setBookingData((prev) => ({ ...prev, moveInDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 outline-none"
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Message</label>
              <textarea
                value={bookingData.message}
                onChange={(e) => setBookingData((prev) => ({ ...prev, message: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 outline-none"
                placeholder="Any specific requirements or questions..."
              />
            </div>

            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
              Confirm Booking
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
