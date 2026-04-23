import { Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ReviewFormModalProps {
  open: boolean;
  reviewRating: number;
  reviewComment: string;
  submittingReview: boolean;
  onOpenChange: (open: boolean) => void;
  setReviewRating: (value: number) => void;
  setReviewComment: (value: string) => void;
  onSubmitReview: () => void;
}

export function ReviewFormModal({
  open,
  reviewRating,
  reviewComment,
  submittingReview,
  onOpenChange,
  setReviewRating,
  setReviewComment,
  onSubmitReview,
}: ReviewFormModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 mt-1">
            Share your experience about this property
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      "h-8 w-8 transition-all",
                      star <= reviewRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-300"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Your Review</label>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value.slice(0, 1000))}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:border-orange-500 outline-none"
              placeholder="Share your experience..."
              maxLength={1000}
            />
            <p className="text-xs text-gray-500 mt-1">{reviewComment.length}/1000 characters</p>
          </div>
          <Button
            onClick={onSubmitReview}
            disabled={submittingReview || reviewComment.trim().length < 10}
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            {submittingReview ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Submitting...</> : "Submit Review"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
