import type { PGListing } from '@/services/api';

interface PGGalleryProps {
  pg: PGListing;
  onOpenGallery: (startIndex: number) => void;
}

export const PGGallery = ({ pg, onOpenGallery }: PGGalleryProps) => {
  return (
    <div className="container mx-auto px-4 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[400px] md:h-[500px]">
        <div
          className="md:col-span-2 md:row-span-2 relative rounded-2xl overflow-hidden cursor-pointer group"
          onClick={() => onOpenGallery(0)}
        >
          <img
            src={pg.images[0] || '/placeholder-image.jpg'}
            alt={pg.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {pg.images.slice(1, 4).map((image, index) => (
          <div
            key={index}
            className="hidden md:block relative rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => onOpenGallery(index + 1)}
          >
            <img
              src={image || '/placeholder-image.jpg'}
              alt={`${pg.name} ${index + 2}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

