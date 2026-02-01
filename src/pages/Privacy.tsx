import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="hero-gradient py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-primary-foreground/80">
              Last updated: January 2024
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-card rounded-2xl p-8 card-shadow space-y-8">
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    1. Information We Collect
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We collect information you provide directly to us, such as:
                  </p>
                  <ul className="text-muted-foreground space-y-2 list-disc pl-5">
                    <li>Name and contact information</li>
                    <li>Account credentials</li>
                    <li>Search preferences and history</li>
                    <li>Communication with us or property owners</li>
                    <li>Feedback and reviews</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    2. How We Use Your Information
                  </h2>
                  <ul className="text-muted-foreground space-y-2 list-disc pl-5">
                    <li>To provide and maintain our services</li>
                    <li>To connect you with property owners</li>
                    <li>To send you updates and notifications</li>
                    <li>To improve our platform and user experience</li>
                    <li>To respond to your inquiries and support requests</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    3. Information Sharing
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We do not sell your personal information. We may share your information with property owners when you express interest in their listings, and with service providers who assist in operating our platform.
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    4. Data Security
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    5. Cookies and Tracking
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent.
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    6. Your Rights
                  </h2>
                  <ul className="text-muted-foreground space-y-2 list-disc pl-5">
                    <li>Access your personal information</li>
                    <li>Correct inaccurate data</li>
                    <li>Request deletion of your data</li>
                    <li>Opt-out of marketing communications</li>
                    <li>Export your data</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    7. Children's Privacy
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.
                  </p>
                </div>

                <div>
                  <h2 className="font-display text-xl font-bold text-foreground mb-4">
                    8. Contact Us
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have any questions about this Privacy Policy, please contact us at privacy@cupgfinder.com.
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

export default Privacy;
