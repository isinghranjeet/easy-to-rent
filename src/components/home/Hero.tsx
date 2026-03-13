import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { locations } from '@/lib/data/pgData';

export function Hero() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (searchQuery) params.set('q', searchQuery);
    if (selectedLocation) params.set('location', selectedLocation);
    if (selectedType) params.set('type', selectedType);

    navigate(`/pg?${params.toString()}`);
  };

  const stats = [
    { icon: Home, value: '500+', label: 'Verified PGs' },
    { icon: Users, value: '10K+', label: 'Happy Students' },
    { icon: MapPin, value: '50+', label: 'Locations' },
  ];

  return (
    <section className="relative w-full min-h-[60vh] flex items-center overflow-hidden">

      {/* Background Gradient */}
      <div className="absolute inset-0 hero-gradient opacity-95" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">

        <div className="max-w-3xl mx-auto text-center">

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Find Your Perfect{' '}
            <span className="text-orange-400">Home Away</span> From Home
          </h1>

          {/* Search Box */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-xl">

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

              {/* Search Input */}
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

                <Input
                  placeholder="Search PG name..."
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
                  {locations.slice(1).map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Type */}
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="h-11">
                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="boys">Boys</SelectItem>
                  <SelectItem value="girls">Girls</SelectItem>
                  <SelectItem value="co-ed">Co-Ed</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                </SelectContent>
              </Select>

            </div>

            {/* Search Button */}
            <div className="mt-3">
              <Button
                onClick={handleSearch}
                className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>

          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-8 flex-wrap text-white">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-2 text-lg font-bold">
                  <stat.icon className="h-4 w-4 text-orange-400" />
                  {stat.value}
                </div>
                <p className="text-sm text-gray-200">{stat.label}</p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Bottom Curve Wave */}
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