import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Users, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { api } from "@/services/api";

export function Hero() {
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [locations, setLocations] = useState<string[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

  // Fetch unique locations from the API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoadingLocations(true);
        // Fetch all PG listings to extract unique locations
        const result = await api.request<any>('/api/pg?limit=100');
        
        const responseData = result.success ? (result.data || []) : result;
        const listingsData = responseData.items || (Array.isArray(responseData) ? responseData : []);
        
        // Extract unique locations (city and locality)
        const locationSet = new Set<string>();
        listingsData.forEach((pg: any) => {
          if (pg.city) locationSet.add(pg.city);
          if (pg.locality) locationSet.add(pg.locality);
        });
        
        // Convert to array and sort alphabetically
        const uniqueLocations = Array.from(locationSet).sort();
        setLocations(uniqueLocations);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
        // Fallback to some default locations if API fails
        setLocations(['Chandigarh', 'Mohali', 'Panchkula', 'Zirakpur']);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchLocations();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (searchQuery) params.set("q", searchQuery);
    if (selectedLocation) params.set("location", selectedLocation);
    if (selectedType) params.set("type", selectedType);

    navigate(`/pg?${params.toString()}`);
  };

  return (
    <section className="relative w-full min-h-[60vh] flex items-center overflow-hidden">

      {/* Background Gradient */}
      <div className="absolute inset-0 hero-gradient opacity-95" />

      <div className="container mx-auto px-4 relative z-10">

        <div className="max-w-3xl mx-auto text-center">

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Find Your Perfect{" "}
            <span className="text-orange-400">Home Away</span> From Home
          </h1>

          {/* Search Box */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-xl">

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

              {/* Search Input */}
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search PG name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>

              {/* Location - Now using real data */}
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="h-11">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                  <SelectValue placeholder={loadingLocations ? "Loading locations..." : "Location"} />
                </SelectTrigger>
                <SelectContent>
                  {loadingLocations ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="h-5 w-5 text-orange-500 animate-spin" />
                      <span className="ml-2 text-sm text-gray-500">Loading...</span>
                    </div>
                  ) : locations.length > 0 ? (
                    locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="py-6 text-center text-sm text-gray-500">
                      No locations found
                    </div>
                  )}
                </SelectContent>
              </Select>

              {/* Type */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="h-11">
                  <Users className="h-4 w-4 mr-2 text-gray-500 flex-shrink-0" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boys">Boys PG</SelectItem>
                  <SelectItem value="girls">Girls PG</SelectItem>
                  <SelectItem value="co-ed">Co-ed PG</SelectItem>
                  <SelectItem value="family">Family PG</SelectItem>
                </SelectContent>
              </Select>

            </div>

            {/* Search Button */}
            <div className="mt-3">
              <Button
                onClick={handleSearch}
                className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white"
                disabled={loadingLocations}
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>

          </div>

          {/* Stats Section (Optional) */}
          {!loadingLocations && locations.length > 0 && (
            <div className="mt-6 text-white/80 text-sm">
              <span className="font-semibold text-white">{locations.length}+</span> locations available
            </div>
          )}

        </div>

      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 120"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-[80px]"
          preserveAspectRatio="none"
        >
          <path
            d="M0,96L60,85.3C120,75,240,53,360,42.7C480,32,600,32,720,42.7C840,53,960,75,1080,80C1200,85,1320,75,1380,69.3L1440,64V120H0Z"
            fill="white"
          />
        </svg>
      </div>

    </section>
  );
}