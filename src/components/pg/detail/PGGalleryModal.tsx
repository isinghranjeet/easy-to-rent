import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface PGGalleryModalProps {
  open: boolean;
  images: string[];
  name: string;
  currentImage: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const PGGalleryModal = ({
  open,
  images,
  name,
  currentImage,
  onClose,
  onNavigate,
}: PGGalleryModalProps) => {
  if (!open) return null;

  const handlePrev = () => {
    onNavigate(currentImage === 0 ? images.length - 1 : currentImage - 1);
  };

  const handleNext = () => {
    onNavigate(currentImage === images.length - 1 ? 0 : currentImage + 1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center z-10 hover:bg-white/20 transition-colors"
      >
        <X className="h-6 w-6 text-white" />
      </button>

      <button
        onClick={handlePrev}
        className="absolute left-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>

      <div className="relative">
        <img
          src={images[currentImage] || '/placeholder-image.jpg'}
          alt={`${name} ${currentImage + 1}`}
          className="max-h-[80vh] max-w-[90vw] object-contain rounded-xl"
        />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
          <span className="text-white text-sm">
            {currentImage + 1} / {images.length}
          </span>
        </div>
      </div>

      <button
        onClick={handleNext}
        className="absolute right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>
    </div>
  );
};

