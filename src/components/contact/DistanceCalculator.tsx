import { useState } from "react";
import { toast } from "sonner";
import {
  Route,
  Minimize2,
  Maximize2,
  MapPinned,
  Navigation2,
  Navigation,
  CheckCircle,
  MapPin,
  Map,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const DistanceCalculator = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const cuCoords = { lat: 30.7067, lng: 76.718 };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        toast.success("Location detected successfully");
        setIsLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setIsLoading(false);
        toast.error("Unable to retrieve your location. Please enable location services.");
      }
    );
  };

  const calculateDistance = () => {
    if (!userLocation) {
      getCurrentLocation();
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const R = 6371;
      const dLat = ((cuCoords.lat - userLocation.lat) * Math.PI) / 180;
      const dLon = ((cuCoords.lng - userLocation.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((userLocation.lat * Math.PI) / 180) *
          Math.cos((cuCoords.lat * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const calculatedDistance = R * c;

      setDistance(calculatedDistance.toFixed(1));
      setIsLoading(false);
      toast.success("Distance calculated successfully");
    }, 1200);
  };

  const openGoogleMaps = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${cuCoords.lat},${cuCoords.lng}`, "_blank");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
            <Route className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Distance from Chandigarh University</h3>
            <p className="text-sm text-sky-600">Calculate your current distance</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMapExpanded(!isMapExpanded)}
          className="text-gray-600 hover:text-orange-600"
        >
          {isMapExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>

      <div className={`transition-all duration-300 ${isMapExpanded ? "h-64" : "h-48"} mb-4`}>
        <div className="h-full bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg overflow-hidden border border-gray-200 relative">
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <MapPinned className="h-12 w-12 text-orange-600/30 mb-4" />
            <div className="text-center mb-4">
              <p className="font-medium text-gray-900 mb-1">Chandigarh University</p>
              <p className="text-sm text-sky-600">Gharuan, Mohali, Punjab</p>
            </div>
            {userLocation && (
              <div className="flex items-center gap-2 text-sm text-sky-600 bg-white/80 px-3 py-2 rounded-lg">
                <Navigation2 className="h-4 w-4 text-green-600" />
                <span>Your location detected</span>
              </div>
            )}
          </div>

          {distance && (
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                  <Navigation className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-sky-600">Distance to CU</p>
                  <p className="text-lg font-semibold text-gray-900">{distance} km</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {distance ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Distance Calculated</p>
                <p className="text-sm text-sky-600 mt-1">
                  You are approximately {distance} km from Chandigarh University.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Location Detection Required</p>
                <p className="text-sm text-sky-600 mt-1">
                  Enable location services to calculate distance and find nearby PG accommodations.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={calculateDistance}
            disabled={isLoading}
            className="flex-1 min-w-[140px] gap-2 bg-orange-600 hover:bg-orange-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <Navigation2 className="h-4 w-4" />
                {distance ? "Recalculate" : "Calculate Distance"}
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={openGoogleMaps}
            className="flex-1 min-w-[140px] gap-2 border-orange-300 hover:border-orange-400 hover:bg-orange-50 text-gray-700 hover:text-orange-600"
          >
            <Map className="h-4 w-4" />
            View on Maps
          </Button>
        </div>
      </div>
    </div>
  );
};
