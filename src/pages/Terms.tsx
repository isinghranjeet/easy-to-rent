import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="hero-gradient py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Terms of Service
            </h1>
            <p className="text-primary-foreground/80">
              Last updated: January 2024
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto prose prose-slate">
              <div className="bg-card rounded-2xl p-8 card-shadow space-y-8">
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    1. Acceptance of Terms
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    By accessing and using CU PG Finder, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    2. Use License
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Permission is granted to temporarily access the materials on CU PG Finder for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    3. User Responsibilities
                  </h2>
                  <ul className="text-muted-foreground space-y-2 list-disc pl-5">
                    <li>Provide accurate and current information during registration</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Use the platform responsibly and ethically</li>
                    <li>Not engage in fraudulent activities</li>
                    <li>Respect other users' privacy and rights</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    4. Property Listings
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    While we verify listings to the best of our ability, CU PG Finder acts only as an intermediary platform. We recommend users to personally visit and verify properties before making any commitments.
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    5. Limitation of Liability
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    CU PG Finder shall not be held liable for any disputes arising between property owners and tenants. Any transaction or agreement is solely between the involved parties.
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    6. Privacy
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Your use of CU PG Finder is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices.
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    7. Modifications
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    CU PG Finder may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then-current version of these Terms of Service.
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    8. Contact Information
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    For any questions regarding these terms, please contact us at legal@cupgfinder.com.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
