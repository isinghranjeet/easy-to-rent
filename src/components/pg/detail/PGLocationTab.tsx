import { MapPin, Navigation, Route } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PGLocationTabProps {
  address: string;
  locality?: string;
  city?: string;
  onViewOnMap: () => void;
  onGetDirections: () => void;
}

export const PGLocationTab = ({
  address,
  locality,
  city,
  onViewOnMap,
  onGetDirections,
}: PGLocationTabProps) => {
  return (
    <div className="bg-white rounded-xl p-6 border">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Location</h2>
      <div className="mb-8 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
            <MapPin className="h-6 w-6 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg">
              Property Address
            </h3>
            <p className="text-gray-700 mt-1">{address}</p>
            <p className="text-gray-600 mt-1">
              {locality || city} • {city}
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-8">
        <Button
          onClick={onViewOnMap}
          className="bg-orange-600 hover:bg-orange-700 gap-2"
        >
          <Navigation className="h-4 w-4" /> View on Maps
        </Button>
        <Button
          onClick={onGetDirections}
          variant="outline"
          className="border-orange-300 hover:bg-orange-50 gap-2"
        >
          <Route className="h-4 w-4" /> Get Directions
        </Button>
      </div>
    </div>
  );
};

