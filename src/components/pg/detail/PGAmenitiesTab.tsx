import { getAmenityIconComponent } from '@/lib/utils/amenityIcons';

interface PGAmenitiesTabProps {
  amenities: string[];
}

export const PGAmenitiesTab = ({ amenities }: PGAmenitiesTabProps) => {
  return (
    <div className="bg-white rounded-xl p-6 border">
      <h2 className="text-xl font-bold text-gray-900 mb-6">All Amenities</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {amenities.map((amenity) => {
          const Icon = getAmenityIconComponent(amenity);
          return (
            <div
              key={amenity}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div className="w-10 h-10 rounded-lg bg-white border flex items-center justify-center">
                <Icon className="h-5 w-5 text-orange-600" />
              </div>
              <span className="font-medium text-gray-900">{amenity}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

