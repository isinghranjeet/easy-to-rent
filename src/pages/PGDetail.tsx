import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/AuthModal';
import { usePGDetail } from '@/hooks/usePGDetail';
import { useReviews } from '@/hooks/useReviews';
import { useBooking } from '@/hooks/useBooking';
import { useContact } from '@/hooks/useContact';
import {
  PGBreadcrumb,
  PGGallery,
  PGGalleryModal,
  PGVirtualTour,
  PGHeader,
  PGTabs,
  PGBookingSidebar,
} from '@/components/pg/detail';
import { BookingFormModal } from '@/components/pg/BookingFormModal';
import { ReviewFormModal } from '@/components/pg/ReviewFormModal';
import { PaymentModal } from '@/components/payment/PaymentModal';
import { SimilarPGs } from '@/components/pg/SimilarPGs';

const PGDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  // Data fetching hooks
  const { pg, loading, error } = usePGDetail(slug);
  const {
    reviews,
    canReview,
    hasUserReviewed,
    isSubmitting: submittingReview,
    reviewRating,
    reviewComment,
    setReviewRating,
    setReviewComment,
    submitReview,
    resetForm: resetReviewForm,
  } = useReviews(pg?._id);

  const {
    bookingData,
    setBookingData,
    bookingMonths,
    setBookingMonths,
    selectedRoom,
    setSelectedRoom,
    roomDetails,
    calculatedPrice,
    totalSavings,
    showBookingForm,
    setShowBookingForm,
    currentBookingId,
    setCurrentBookingId,
    showPaymentModal,
    setShowPaymentModal,
    handleBookingSubmit,
  } = useBooking(pg);

  const { handlePhoneCall, handleWhatsAppContact } = useContact();
  const { isAuthenticated } = useAuth();

  // Local UI state
  const [currentImage, setCurrentImage] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingContactAction, setPendingContactAction] = useState<'call' | 'whatsapp' | null>(null);

  const handleOpenGallery = (index: number) => {
    setCurrentImage(index);
    setShowGallery(true);
  };

  const handlePaymentSuccess = () => {
    toast.success('Payment successful! Your booking is confirmed.');
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const viewOnMap = () => {
    if (!pg) return;
    const address = encodeURIComponent(pg.address);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${address}`,
      '_blank'
    );
    toast.info('Opening location on Google Maps');
  };

  const getDirections = () => {
    if (!pg) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      pg.address
    )}`;
    window.open(url, '_blank');
    toast.info('Getting directions to this property');
  };

  const handleWriteReview = () => {
    setShowReviewForm(true);
  };

  const handleSubmitReview = async () => {
    if (!pg) return;
    await submitReview(pg._id, pg.name);
    setShowReviewForm(false);
  };

  const handleCloseReviewForm = (open: boolean) => {
    if (!open) {
      setShowReviewForm(false);
      resetReviewForm();
    }
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setCurrentBookingId('');
    setTimeout(() => {
      toast.info('You can complete payment later from your dashboard');
    }, 0);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-orange-50/50">
        <Navbar />
        <main className="flex-1 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4" />
              <p className="text-muted-foreground">Loading PG details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error / not found state
  if (error || !pg) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-orange-50/50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
              <Home className="h-12 w-12 text-orange-600" />
            </div>
            <h1 className="font-display text-3xl font-bold text-gray-900 mb-4">
              {error ? 'Error Loading PG' : 'PG Not Found'}
            </h1>
            <p className="text-gray-600 mb-8 max-w-md">
              {error ||
                "The PG accommodation you're looking for doesn't exist or has been removed."}
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/pg">
                <Button className="bg-orange-600 hover:bg-orange-700">
                  Back to Listings
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="border-orange-300">
                  Go Home
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-orange-50/50">
      <Navbar />

      <main className="flex-1">
        <PGBreadcrumb pg={pg} />
        <PGGallery pg={pg} onOpenGallery={handleOpenGallery} />
        <PGVirtualTour videoUrl={pg.videoUrl} virtualTour={pg.virtualTour} />
        <PGGalleryModal
          open={showGallery}
          images={pg.images}
          name={pg.name}
          currentImage={currentImage}
          onClose={() => setShowGallery(false)}
          onNavigate={setCurrentImage}
        />

        <div className="container mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-8">
              <PGHeader
                pg={pg}
                reviewsCount={reviews.length}
                roomTypesCount={roomDetails.length}
              />
              <PGTabs
                pg={pg}
                reviews={reviews}
                canReview={canReview}
                hasUserReviewed={hasUserReviewed}
                roomDetails={roomDetails}
                selectedRoom={selectedRoom}
                onSelectRoom={setSelectedRoom}
                onWriteReview={handleWriteReview}
                onViewOnMap={viewOnMap}
                onGetDirections={getDirections}
              />
            </div>

            {/* Right Column - Booking Sidebar */}
            <PGBookingSidebar
              pg={pg}
              bookingMonths={bookingMonths}
              onChangeMonths={setBookingMonths}
              calculatedPrice={calculatedPrice}
              totalSavings={totalSavings}
              onBookNow={() => setShowBookingForm(true)}
              onCall={() => {
                if (!isAuthenticated) {
                  setPendingContactAction('call');
                  setShowAuthModal(true);
                  return;
                }
                handlePhoneCall(pg);
              }}
              onWhatsApp={() => {
                if (!isAuthenticated) {
                  setPendingContactAction('whatsapp');
                  setShowAuthModal(true);
                  return;
                }
                handleWhatsAppContact(pg);
              }}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      <BookingFormModal
        open={showBookingForm}
        pg={pg ? { name: pg.name, address: pg.address } : null}
        roomDetails={roomDetails}
        selectedRoom={selectedRoom}
        bookingMonths={bookingMonths}
        calculatedPrice={calculatedPrice}
        bookingData={bookingData}
        onClose={() => setShowBookingForm(false)}
        onSubmit={handleBookingSubmit}
        setBookingData={setBookingData}
      />

      {showPaymentModal && currentBookingId && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={handleClosePaymentModal}
          bookingId={currentBookingId}
          amount={calculatedPrice}
          onSuccess={handlePaymentSuccess}
        />
      )}

      <ReviewFormModal
        open={showReviewForm}
        reviewRating={reviewRating}
        reviewComment={reviewComment}
        submittingReview={submittingReview}
        onOpenChange={handleCloseReviewForm}
        setReviewRating={setReviewRating}
        setReviewComment={setReviewComment}
        onSubmitReview={handleSubmitReview}
      />

      {/* Auth Modal for contact actions */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setPendingContactAction(null);
        }}
        onSuccess={() => {
          if (pendingContactAction === 'call' && pg) {
            handlePhoneCall(pg);
          } else if (pendingContactAction === 'whatsapp' && pg) {
            handleWhatsAppContact(pg);
          }
          setPendingContactAction(null);
        }}
      />

      {/* Similar Properties Section */}
      <SimilarPGs
        currentPgId={pg._id}
        city={pg.city}
        type={pg.type}
      />

      <Footer />
    </div>
  );
};

export default PGDetail;

