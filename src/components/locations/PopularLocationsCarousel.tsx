import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, MapPin, Home, Loader2 } from 'lucide-react';
import { api } from '@/services/api';

interface Location {
  _id: string;
  name: string;
  slug: string;
  pgCount: number;
  image: string;
  description?: string;
}

const PopularLocationsCarousel = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const response = await api.getPopularLocations(10);
        if (response.success) {
          setLocations(response.data);
        }
      } catch (error) {
        console.error('Error loading popular locations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLocations();

    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 768) setItemsPerView(2);
      else if (window.innerWidth < 1024) setItemsPerView(3);
      else setItemsPerView(4);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    if (currentIndex + itemsPerView < locations.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-8 my-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (locations.length === 0) return null;

  const visibleLocations = locations.slice(currentIndex, currentIndex + itemsPerView);

  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 my-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">🔥 Popular Locations</h2>
          <p className="text-gray-600 mt-1">Most searched PGs in these areas</p>
        </div>
        
        {locations.length > itemsPerView && (
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex + itemsPerView >= locations.length}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {visibleLocations.map((location) => (
          <Link
            key={location._id}
            to={`/location/${location.slug}`}
            className="group relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="relative h-40 overflow-hidden">
              <img
                src={location.image}
                alt={location.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=500';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <div className="flex items-center gap-1 text-white">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-medium">{location.name}</span>
                </div>
              </div>
            </div>
            
            <div className="p-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 text-gray-600">
                  <Home className="h-4 w-4" />
                  <span className="text-sm">{location.pgCount} PGs</span>
                </div>
                <span className="text-orange-500 text-sm font-semibold group-hover:translate-x-1 transition">
                  View →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PopularLocationsCarousel;