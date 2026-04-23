import { Calendar, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { PriceAlertButton } from '@/components/pg/PriceAlertButton';
import type { PGListing } from '@/services/api';

interface PGBookingSidebarProps {
  pg: PGListing;
  bookingMonths: number;
  onChangeMonths: (months: number) => void;
  calculatedPrice: number;
  totalSavings: number;
  onBookNow: () => void;
  onCall: () => void;
  onWhatsApp: () => void;
}

export const PGBookingSidebar = ({
  pg,
  bookingMonths,
  onChangeMonths,
  calculatedPrice,
  totalSavings,
  onBookNow,
  onCall,
  onWhatsApp,
}: PGBookingSidebarProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border sticky top-24">
        <div className="mb-6">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold text-gray-900">
              ₹{pg.price.toLocaleString()}
            </span>
            <span className="text-gray-600">/month</span>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Duration
              </span>
              <span className="text-sm font-bold text-orange-600">
                {bookingMonths} months
              </span>
            </div>
            <Slider
              value={[bookingMonths]}
              min={1}
              max={12}
              step={1}
              onValueChange={([value]) => onChangeMonths(value)}
              className="w-full"
            />
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Base ({bookingMonths} months)
              </span>
              <span className="font-medium">
                ₹{(pg.price * bookingMonths).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Discount</span>
              <span className="font-medium text-green-600">
                -₹{totalSavings.toLocaleString()}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span className="text-gray-900">Total</span>
              <span className="text-orange-600">
                ₹{calculatedPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <PriceAlertButton
            pgId={pg._id}
            currentPrice={pg.price}
            pgName={pg.name}
          />
        </div>

        <Button
          onClick={onBookNow}
          size="lg"
          className="w-full bg-orange-600 hover:bg-orange-700 gap-2 mb-4 text-lg font-semibold"
        >
          <Calendar className="h-5 w-5" /> Book Now
        </Button>

        <div className="space-y-3 mb-6">
          <Button
            onClick={onCall}
            size="lg"
            className="w-full bg-green-600 hover:bg-green-700 gap-2"
          >
            <Phone className="h-4 w-4" /> Call Owner
          </Button>

          <Button
            onClick={onWhatsApp}
            variant="outline"
            size="lg"
            className="w-full border-green-600 text-green-700 hover:bg-green-50 gap-2"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
};

