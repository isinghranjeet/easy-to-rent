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
  const [locations, setLocations] = useState<
    { name: string; slug: string }[]
  >([]);

  // 🎯 Capitalize helper
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  // 🎯 College mapping
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

  // 📡 Fetch Locations
  const fetchLocations = useCallback(async () => {
    try {
      setLoadingLocations(true);

      // Cache check
      const cached = localStorage.getItem("pg_locations_v2");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < 5 * 60 * 1000) {
          setLocations(parsed.data);
          setLoadingLocations(false);
          return;
        }
      }

      const response = await api.getPopularLocations(20);

      let locationData = [];

      if (response.success && response.data?.length > 0) {
        locationData = response.data.map((loc: any) => ({
          name: capitalize(loc.name),
          slug: loc.slug,
        }));
      } else {
        // fallback
        const pgResult = await api.request<any>("/api/pg?limit=100");
        const listings =
          pgResult?.data?.items ||
          pgResult?.data ||
          pgResult?.items ||
          [];

        const locationSet = new Set<string>();

        for (const pg of listings) {
          const city = pg?.city?.trim();
          if (city) locationSet.add(city);
        }

        locationData = Array.from(locationSet).map((name) => ({
          name: capitalize(name),
          slug: name.toLowerCase().replace(/ /g, "-"),
        }));
      }

      // cache save
      localStorage.setItem(
        "pg_locations_v2",
        JSON.stringify({
          data: locationData,
          timestamp: Date.now(),
        })
      );

      setLocations(locationData);
    } catch (error) {
      console.error("Failed to fetch locations:", error);

      // fallback static
      setLocations([
        { name: "Chandigarh", slug: "chandigarh" },
        { name: "Mohali", slug: "mohali" },
        { name: "Panchkula", slug: "panchkula" },
        { name: "Kharar", slug: "kharar" },
      ]);
    } finally {
      setLoadingLocations(false);
    }
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  // 🔍 Search handler
  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();

    if (searchQuery) params.set("q", searchQuery);
    if (selectedLocation) params.set("location", selectedLocation);
    if (selectedType) params.set("type", selectedType);

    navigate(`/pg?${params.toString()}`);
  }, [searchQuery, selectedLocation, selectedType, navigate]);

  // 🎯 College select
  const handleCollegeSelect = useCallback(
    (college: string) => {
      const location = collegeMap[college];
      if (!location) return;

      setSelectedLocation(location);
      navigate(`/pg?location=${location}`);
    },
    [collegeMap, navigate]
  );

  // 🎯 Location select
  const handleLocationSelect = useCallback(
    (locationName: string) => {
      setSelectedLocation(locationName);
      navigate(`/pg?location=${encodeURIComponent(locationName)}`);
    },
    [navigate]
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
              <Select
                value={selectedLocation || "all"}
                onValueChange={(val) =>
                  handleLocationSelect(val === "all" ? "" : val)
                }
              >
                <SelectTrigger className="h-11">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>

                  {loadingLocations ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="animate-spin h-5 w-5" />
                    </div>
                  ) : (
                    locations.map((loc) => (
                      <SelectItem key={loc.slug} value={loc.name}>
                        {loc.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>

              {/* Type */}
              <Select
                value={selectedType || "all"}
                onValueChange={(val) =>
                  setSelectedType(val === "all" ? "" : val)
                }
              >
                <SelectTrigger className="h-11">
                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="boys">Boys PG</SelectItem>
                  <SelectItem value="girls">Girls PG</SelectItem>
                  <SelectItem value="co-ed">Co-ed PG</SelectItem>
                  <SelectItem value="family">Family PG</SelectItem>
                </SelectContent>
              </Select>

              {/* Colleges */}
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