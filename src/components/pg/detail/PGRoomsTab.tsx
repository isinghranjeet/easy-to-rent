import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { RoomDetail } from '@/types/pgDetail';

interface PGRoomsTabProps {
  roomDetails: RoomDetail[];
  selectedRoom: number;
  onSelectRoom: (index: number) => void;
}

export const PGRoomsTab = ({
  roomDetails,
  selectedRoom,
  onSelectRoom,
}: PGRoomsTabProps) => {
  return (
    <div className="bg-white rounded-xl p-6 border">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Available Rooms</h2>
      <div className="space-y-4">
        {roomDetails.map((room, index) => (
          <div
            key={index}
            className={cn(
              'border rounded-xl p-4 transition-all cursor-pointer',
              selectedRoom === index
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-orange-300'
            )}
            onClick={() => onSelectRoom(index)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{room.type}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="text-xs bg-green-100 text-green-700">
                    {room.available} available
                  </Badge>
                  <span className="text-sm text-gray-600">{room.size}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-gray-900">
                  ₹{room.price.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">per month</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

