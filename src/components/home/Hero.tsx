import { useState, useEffect, useCallback, useMemo } from "react";
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
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [locations, setLocations] = useState<string[]>([]);

  // 🎯 Helper: Capitalize
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  // 🎯 College → Location mapping
  const collegeMap = useMemo(
    () => ({
      "Room near Chandigarh University": "Kharar",
      "Room near Amity University Noida": "Noida",
      "Room near Galgotias University Noida": "Noida",
      "Room near NIET Noida": "Noida",
      "Room near Manav Rachna University Faridabad": "Faridabad",
      "Room near Lingaya’s Vidyapeeth Faridabad": "Faridabad",
    }),
    []
  );

  // 📡 Fetch Locations (Optimized)
  const fetchLocations = useCallback(async () => {
    try {
      setLoadingLocations(true);

      // ✅ 1. Check cache
      const cached = localStorage.getItem("pg_locations");
      if (cached) {
        setLocations(JSON.parse(cached));
        setLoadingLocations(false);
        return;
      }

      const result = await api.request<any>("/api/pg?limit=100");

      const listings =
        result?.data?.items ||
        result?.data ||
        result?.items ||
        [];

      if (!Array.isArray(listings)) throw new Error("Invalid data");

      const locationSet = new Set<string>();

      // ✅ 2. Normalize + Deduplicate
      for (const pg of listings) {
        const city = pg?.city?.trim().toLowerCase();
        const locality = pg?.locality?.trim().toLowerCase();

        if (city) locationSet.add(capitalize(city));
        if (locality) locationSet.add(capitalize(locality));
      }

      // ✅ 3. Popular first + limit
      const popular = ["Chandigarh", "Mohali", "Kharar"];

      const finalLocations = [
        ...popular,
        ...[...locationSet].filter(loc => !popular.includes(loc))
      ]
        .sort((a, b) => a.localeCompare(b))
        .slice(0, 20);

      // ✅ 4. Cache
      localStorage.setItem("pg_locations", JSON.stringify(finalLocations));

      setLocations(finalLocations);

    } catch (error) {
      console.error("Failed to fetch locations:", error);

      // fallback
      setLocations([
        "Chandigarh",
        "Mohali",
        "Panchkula",
        "Kharar",
        "Noida",
        "Faridabad",
      ]);
    } finally {
      setLoadingLocations(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  // 🔍 Search
  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();

    if (searchQuery) params.set("q", searchQuery);
    if (selectedLocation) params.set("location", selectedLocation);
    if (selectedType) params.set("type", selectedType);

    navigate(`/pg?${params.toString()}`);
  }, [searchQuery, selectedLocation, selectedType, navigate]);

  // 🎯 College Filter
  const handleCollegeSelect = useCallback(
    (college: string) => {
      const location = collegeMap[college];
      if (!location) return;

      setSelectedLocation(location);
      navigate(`/pg?location=${location}`);
    },
    [collegeMap, navigate]
  );

  return (
    <section className="relative w-full min-h-[60vh] flex items-center overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 hero-gradient opacity-95" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Find Affordable PG in Chandigarh, Noida & Faridabad
          </h1>

          <p className="text-white text-sm md:text-base mb-6">
            Verified PG near top colleges with food, WiFi and security.
          </p>

          {/* Search Box */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-xl">

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">

              {/* Search */}
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search PG name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>

              {/* Location */}
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="h-11">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {loadingLocations ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="animate-spin" />
                    </div>
                  ) : (
                    locations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>

              {/* Type */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="h-11">
                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boys">Boys PG</SelectItem>
                  <SelectItem value="girls">Girls PG</SelectItem>
                  <SelectItem value="co-ed">Co-ed PG</SelectItem>
                  <SelectItem value="family">Family PG</SelectItem>
                </SelectContent>
              </Select>

              {/* College */}
              <Select onValueChange={handleCollegeSelect}>
                <SelectTrigger className="h-11">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <SelectValue placeholder="Nearby Colleges" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(collegeMap).map((college) => (
                    <SelectItem key={college} value={college}>
                      {college}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

            </div>

            {/* Search Button */}
            <div className="mt-3">
              <Button
                onClick={handleSearch}
                className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Search className="mr-2 h-5 w-5" />
                Search
              </Button>
            </div>

          </div>

        </div>
      </div>

      {/* Wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1440 120" className="w-full h-[80px]" preserveAspectRatio="none">
          <path
            d="M0,96L60,85.3C120,75,240,53,360,42.7C480,32,600,32,720,42.7C840,53,960,75,1080,80C1200,85,1320,75,1380,69.3L1440,64V120H0Z"
            fill="white"
          />
        </svg>
      </div>

    </section>
  );
}