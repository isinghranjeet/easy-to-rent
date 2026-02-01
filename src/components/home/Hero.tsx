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
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Pattern - EXACTLY LIKE SCREENSHOT */}
      <div className="absolute inset-0 hero-gradient opacity-95" />
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Floating Elements - EXACTLY LIKE SCREENSHOT */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary-foreground/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-1.5s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
         

          {/* Heading - Orange Accent */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
            Find Your Perfect{' '}
            <span className="relative">
              <span className="relative z-10 text-orange-500">Home Away</span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-orange-400/30 -z-0" />
            </span>{' '}
            From Home
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '200ms' }}>
           Discover verified PG accommodations near Chandigarh University campus. Safe, affordable, and just a walk away from your classes.
Enjoy hassle-free booking with zero brokerage and genuine listings.
Perfect for students seeking comfort, security, and convenience near Chandigarh University.
          </p>

          {/* Search Box */}
          <div className="bg-card rounded-2xl p-4 md:p-6 card-shadow animate-fade-up" style={{ animationDelay: '300ms' }}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by PG name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 focus:border-orange-400 focus:ring-orange-400"
                />
              </div>
              
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="h-12 focus:border-orange-400 focus:ring-orange-400">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
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

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="h-12 focus:border-orange-400 focus:ring-orange-400">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boys">Boys</SelectItem>
                  <SelectItem value="girls">Girls</SelectItem>
                  <SelectItem value="co-ed">Co-Ed</SelectItem>
                    <SelectItem value="co-ed">Family</SelectItem>

                </SelectContent>
              </Select>
            </div>

            {/* Orange Button */}
            <Button onClick={handleSearch} size="xl" className="w-full md:w-auto mt-4 bg-orange-500 hover:bg-orange-600 text-white">
              <Search className="h-5 w-5 mr-2" />
              Search PGs
            </Button>
          </div>

          {/* Stats - Light Sky Blue Text */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-12 animate-fade-up" style={{ animationDelay: '400ms' }}>
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <stat.icon className="h-5 w-5 text-orange-500" />
                  <span className="font-display text-2xl md:text-3xl font-bold text-sky-500">
                    {stat.value}
                  </span>
                </div>
                <span className="text-sky-400 text-sm">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Wave - EXACTLY LIKE SCREENSHOT */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
}