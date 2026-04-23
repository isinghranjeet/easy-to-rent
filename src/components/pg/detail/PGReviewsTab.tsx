import { Check, MessageSquare, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Review } from '@/services/api';

interface PGReviewsTabProps {
  reviews: Review[];
  canReview: boolean;
  hasUserReviewed: boolean;
  onWriteReview: () => void;
}

export const PGReviewsTab = ({
  reviews,
  canReview,
  hasUserReviewed,
  onWriteReview,
}: PGReviewsTabProps) => {
  return (
    <div className="bg-white rounded-xl p-6 border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Guest Reviews</h2>
        {canReview && !hasUserReviewed && (
          <Button
            onClick={onWriteReview}
            className="bg-orange-600 hover:bg-orange-700 gap-2"
          >
            <MessageSquare className="h-4 w-4" /> Write a Review
          </Button>
        )}
        {hasUserReviewed && (
          <Badge className="bg-green-100 text-green-700 gap-1">
            <Check className="h-3 w-3" /> You reviewed this
          </Badge>
        )}
      </div>

      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="border-b pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold">
                    {review.userName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {review.userName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{review.rating}</span>
                </div>
              </div>
              <p className="text-gray-700 mt-2">{review.comment}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">
              No reviews yet. Be the first to review!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

