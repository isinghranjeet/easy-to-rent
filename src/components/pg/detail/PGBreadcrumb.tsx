import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Verified } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { PGListing } from '@/services/api';

interface PGBreadcrumbProps {
  pg: PGListing;
}

export const PGBreadcrumb = ({ pg }: PGBreadcrumbProps) => {
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <Link
          to="/pg"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to listings
        </Link>
        <div className="flex items-center gap-4">
          {pg.city && (
            <Link to={`/location/${pg.city.toLowerCase().replace(/ /g, '-')}`}>
              <Badge className="bg-orange-100 text-orange-700 border-orange-200 cursor-pointer hover:bg-orange-200">
                <MapPin className="h-3 w-3 mr-1" />
                More in {pg.city}
              </Badge>
            </Link>
          )}
          {pg.verified && (
            <Badge className="bg-green-100 text-green-700 border-green-200">
              <Verified className="h-3 w-3 mr-1" />
              Verified Property
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

