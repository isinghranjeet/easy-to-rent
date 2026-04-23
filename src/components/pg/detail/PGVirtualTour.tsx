import { Play } from 'lucide-react';
import { getYouTubeEmbedUrl } from '@/lib/utils/youtubeUtils';

interface PGVirtualTourProps {
  videoUrl?: string;
  virtualTour?: string;
}

export const PGVirtualTour = ({ videoUrl, virtualTour }: PGVirtualTourProps) => {
  const embedUrl = getYouTubeEmbedUrl(videoUrl || virtualTour || '');

  if (!embedUrl) return null;

  return (
    <div className="container mx-auto px-4 mb-8">
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b bg-gradient-to-r from-orange-50 to-red-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
              <Play className="h-4 w-4 text-orange-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Virtual Tour</h2>
            <span className="px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded-full font-medium">
              HD
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1 ml-10">
            Take a virtual walkthrough of this property
          </p>
        </div>
        <div className="relative pb-[56.25%] h-0 bg-black">
          <iframe
            src={embedUrl}
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            title="Virtual Tour of PG"
          />
        </div>
        <div className="p-3 bg-gray-50 text-center text-xs text-gray-500">
          🎬 Watch this video to get a complete view of the property
        </div>
      </div>
    </div>
  );
};

