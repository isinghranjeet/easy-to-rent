import { Link } from 'react-router-dom';
import { MapPin, Star, BadgeCheck, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { PGListing } from '@/services/api';

interface PGHeaderProps {
  pg: PGListing;
  reviewsCount: number;
  roomTypesCount: number;
}

export const PGHeader = ({ pg, reviewsCount, roomTypesCount }: PGHeaderProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Badge
          className={cn(
            'text-sm py-1 px-3',
            pg.type === 'boys'
              ? 'bg-blue-100 text-blue-700'
              : pg.type === 'girls'
              ? 'bg-pink-100 text-pink-700'
              : 'bg-purple-100 text-purple-700'
          )}
        >
          {pg.type === 'co-ed'
            ? 'Co-Ed'
            : pg.type.charAt(0).toUpperCase() + pg.type.slice(1)}
        </Badge>
        {pg.verified && (
          <Badge className="bg-green-100 text-green-700 gap-1">
            <BadgeCheck className="h-3 w-3" />
            Verified
          </Badge>
        )}
        {pg.featured && (
          <Badge className="bg-orange-100 text-orange-700 gap-1">
            <Crown className="h-3 w-3" />
            Featured
          </Badge>
        )}
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
        {pg.name}
      </h1>

      <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
        <Link
          to={`/location/${pg.city?.toLowerCase().replace(/ /g, '-')}`}
          className="flex items-center gap-2 hover:text-orange-600 transition-colors"
        >
          <MapPin className="h-4 w-4 text-orange-600" />
          <span className="font-medium">{pg.address}</span>
        </Link>
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-bold text-gray-900">
            {pg.rating || 4.5}
          </span>
          <span>({reviewsCount || pg.reviewCount || 0} reviews)</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-orange-50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-orange-600">
            ₹{pg.price.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Per Month</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-blue-600">
            {pg.distance || 'Near CU'}
          </div>
          <div className="text-sm text-gray-600">From CU</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-green-600">
            {roomTypesCount}
          </div>
          <div className="text-sm text-gray-600">Room Types</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <div className="text-xl font-bold text-purple-600">
            {pg.amenities.length}+
          </div>
          <div className="text-sm text-gray-600">Amenities</div>
        </div>
      </div>
    </div>
  );
};

