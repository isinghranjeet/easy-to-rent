import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PGOverviewTab } from './PGOverviewTab';
import { PGAmenitiesTab } from './PGAmenitiesTab';
import { PGRoomsTab } from './PGRoomsTab';
import { PGLocationTab } from './PGLocationTab';
import { PGReviewsTab } from './PGReviewsTab';
import type { PGListing, Review } from '@/services/api';
import type { RoomDetail } from '@/types/pgDetail';

interface PGTabsProps {
  pg: PGListing;
  reviews: Review[];
  canReview: boolean;
  hasUserReviewed: boolean;
  roomDetails: RoomDetail[];
  selectedRoom: number;
  onSelectRoom: (index: number) => void;
  onWriteReview: () => void;
  onViewOnMap: () => void;
  onGetDirections: () => void;
}

export const PGTabs = ({
  pg,
  reviews,
  canReview,
  hasUserReviewed,
  roomDetails,
  selectedRoom,
  onSelectRoom,
  onWriteReview,
  onViewOnMap,
  onGetDirections,
}: PGTabsProps) => {
  const [selectedTab, setSelectedTab] = useState('overview');

  return (
    <Tabs
      value={selectedTab}
      onValueChange={setSelectedTab}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-5 bg-gray-100 p-1 rounded-xl">
        <TabsTrigger
          value="overview"
          className="rounded-lg data-[state=active]:bg-white"
        >
          Overview
        </TabsTrigger>
        <TabsTrigger
          value="amenities"
          className="rounded-lg data-[state=active]:bg-white"
        >
          Amenities
        </TabsTrigger>
        <TabsTrigger
          value="rooms"
          className="rounded-lg data-[state=active]:bg-white"
        >
          Rooms
        </TabsTrigger>
        <TabsTrigger
          value="location"
          className="rounded-lg data-[state=active]:bg-white"
        >
          Location
        </TabsTrigger>
        <TabsTrigger
          value="reviews"
          className="rounded-lg data-[state=active]:bg-white"
        >
          Reviews
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6">
        <PGOverviewTab description={pg.description} />
      </TabsContent>

      <TabsContent value="amenities" className="mt-6">
        <PGAmenitiesTab amenities={pg.amenities} />
      </TabsContent>

      <TabsContent value="rooms" className="mt-6">
        <PGRoomsTab
          roomDetails={roomDetails}
          selectedRoom={selectedRoom}
          onSelectRoom={onSelectRoom}
        />
      </TabsContent>

      <TabsContent value="location" className="mt-6">
        <PGLocationTab
          address={pg.address}
          locality={pg.locality}
          city={pg.city}
          onViewOnMap={onViewOnMap}
          onGetDirections={onGetDirections}
        />
      </TabsContent>

      <TabsContent value="reviews" className="mt-6">
        <PGReviewsTab
          reviews={reviews}
          canReview={canReview}
          hasUserReviewed={hasUserReviewed}
          onWriteReview={onWriteReview}
        />
      </TabsContent>
    </Tabs>
  );
};

