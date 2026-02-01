import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Hero } from '../components/home/Hero';
import { FeaturedPGs } from '../components/home/FeaturedPGs';
import WhyChooseUs from '../components/home/WhyChooseUs'; // Default import
import { Testimonials } from '../components/home/Testimonials';
import { CTASection } from '../components/home/CTASection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeaturedPGs />
        <WhyChooseUs />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;