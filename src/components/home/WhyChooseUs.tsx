// /src/components/home/WhyChooseUs.tsx
import React from 'react';
import { CheckCircle, Shield, Users, Clock, MapPin, Award } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay = 0 }) => {
  return (
    <div 
      className="group relative p-6 bg-card rounded-xl border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/50 rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default function WhyChooseUs() {
  const features = [
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Verified Listings",
      description: "Every PG is personally verified for safety, amenities, and compliance with our quality standards.",
      delay: 100
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Safe & Secure",
      description: "All listed PGs undergo thorough background checks with verified owners and proper documentation.",
      delay: 200
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Trusted by Students",
      description: "Join thousands of students who've found their perfect home through our platform with real reviews.",
      delay: 300
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Quick Responses",
      description: "Get instant responses from PG owners and schedule visits within hours of inquiry.",
      delay: 400
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Prime Locations",
      description: "Carefully curated listings near colleges, universities, metro stations, and commercial hubs.",
      delay: 500
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Best Price Guarantee",
      description: "We ensure competitive pricing with no hidden charges and transparent rental agreements.",
      delay: 600
    }
  ];

  const stats = [
    { value: "10,000+", label: "Happy Students" },
    { value: "2,500+", label: "Verified PGs" },
    { value: "15+", label: "Cities" },
    { value: "24/7", label: "Support" }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Why Choose Us
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Your Trusted PG Partner
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We simplify your search for the perfect PG with verified listings, transparent pricing, 
            and a seamless booking experience.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center p-6 bg-card rounded-xl border animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>

        {/* Process Section */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/10 rounded-2xl p-8 md:p-12">
          <h3 className="text-2xl font-bold text-center mb-8">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="text-lg font-semibold mb-2">Search & Filter</h4>
              <p className="text-sm text-muted-foreground">
                Use filters to find PGs by location, budget, amenities, and preferences.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="text-lg font-semibold mb-2">Connect Directly</h4>
              <p className="text-sm text-muted-foreground">
                Contact PG owners directly via call or WhatsApp for instant communication.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="text-lg font-semibold mb-2">Book with Confidence</h4>
              <p className="text-sm text-muted-foreground">
                Visit, verify, and book with our support and transparent pricing.
              </p>
            </div>
          </div>
        </div>

       
        
      </div>
    </section>
  );
}