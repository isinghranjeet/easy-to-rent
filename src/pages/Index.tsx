import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Hero } from '../components/home/Hero';
import { FeaturedPGs } from '../components/home/FeaturedPGs';
import WhyChooseUs from '../components/home/WhyChooseUs';
import { Testimonials } from '../components/home/Testimonials';
import { CTASection } from '../components/home/CTASection';
import { TopRecommendations } from '@/components/home/TopRecommendations';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user?.role === 'owner') {
      navigate('/owner', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeaturedPGs />
        
        {/* Show recommendations only for authenticated users */}
        {isAuthenticated && user?.role !== 'owner' && <TopRecommendations />}
        
        <WhyChooseUs />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;