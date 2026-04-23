import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Clock,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  CheckCircle,
  Loader2,
} from "lucide-react";

export interface FooterLocation {
  _id: string;
  name: string;
  slug: string;
  pgCount: number;
}

interface FooterMainContentProps {
  email: string;
  setEmail: (value: string) => void;
  handleNewsletterSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loadingLocations: boolean;
  popularLocations: FooterLocation[];
}

export function FooterMainContent({
  email,
  setEmail,
  handleNewsletterSubmit,
  loadingLocations,
  popularLocations,
}: FooterMainContentProps) {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8 md:mb-10 rounded-xl trust-badge p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 md:h-8 md:w-8 text-orange-400" />
            <div>
              <h4 className="font-semibold text-sm md:text-base">Verified Properties</h4>
              <p className="text-xs md:text-sm text-gray-400">All listings physically verified</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <UserCheck className="h-6 w-6 md:h-8 md:w-8 text-orange-400" />
            <div>
              <h4 className="font-semibold text-sm md:text-base">Trusted Owners</h4>
              <p className="text-xs md:text-sm text-gray-400">Background verified</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-orange-400" />
            <div>
              <h4 className="font-semibold text-sm md:text-base">Easy Booking</h4>
              <p className="text-xs md:text-sm text-gray-400">Simple rental process</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 font-bold">EZ</div>
            <span className="text-xl font-bold text-orange-400">EasyToRent</span>
          </div>
          <p className="text-sm text-gray-400">Verified rental properties near educational institutions.</p>
          <div className="flex gap-2">
            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-orange-500 footer-social"
                onClick={(e) => {
                  e.preventDefault();
                  const socialLinks = [
                    "https://facebook.com/easytorent",
                    "https://twitter.com/easytorent",
                    "https://instagram.com/easytorent",
                    "https://youtube.com/easytorent",
                  ];
                  window.open(socialLinks[i], "_blank");
                }}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="footer-title text-lg font-semibold text-orange-400">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm text-gray-400">
            <li><Link to="/" className="footer-link hover:text-orange-400">Home</Link></li>
            <li><Link to="/about" className="footer-link hover:text-orange-400">About Us</Link></li>
            <li><Link to="/how-it-works" className="footer-link hover:text-orange-400">How It Works</Link></li>
            <li><Link to="/pg" className="footer-link hover:text-orange-400">Properties</Link></li>
            <li><Link to="/register-property" className="footer-link hover:text-orange-400">List Your Property</Link></li>
            <li><Link to="/contact" className="footer-link hover:text-orange-400">Contact</Link></li>
            <li><Link to="/blog" className="footer-link hover:text-orange-400">Blog</Link></li>
            <li><Link to="/faq" className="footer-link hover:text-orange-400">FAQ</Link></li>
            <li><Link to="/privacy" className="footer-link hover:text-orange-400">Privacy Policy</Link></li>
            <li><Link to="/terms" className="footer-link hover:text-orange-400">Terms & Conditions</Link></li>
            <li><Link to="/refund" className="footer-link hover:text-orange-400">Refund Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-title text-lg font-semibold text-orange-400">Popular Locations</h4>
          {loadingLocations ? (
            <div className="mt-4 space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <Loader2 className="h-3 w-3 text-orange-400 animate-spin" />
                  <div className="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : (
            <ul className="mt-4 space-y-2 text-sm text-gray-400">
              {popularLocations.map((location, index) => (
                <li key={`${location._id || location.slug || location.name}-${index}`} className="flex items-center gap-2 group">
                  <ChevronRight className="h-3 w-3 text-orange-400 group-hover:translate-x-1 transition" />
                  <Link to={`/location/${location.slug}`} className="footer-link hover:text-orange-400 flex justify-between w-full">
                    <span>{location.name}</span>
                    <span className="text-xs text-gray-500 group-hover:text-orange-400">{location.pgCount} PGs</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h4 className="footer-title text-lg font-semibold text-orange-400">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm text-gray-400">
            <li className="flex gap-2"><MapPin className="h-4 w-4 text-orange-400 flex-shrink-0 mt-1" /><span>Chandigarh University Area, Punjab</span></li>
            <li className="flex gap-2"><Phone className="h-4 w-4 text-orange-400 flex-shrink-0" /><a href="tel:+919315058665" className="hover:text-orange-400">+91 93150 58665</a></li>
            <li className="flex gap-2"><Mail className="h-4 w-4 text-orange-400 flex-shrink-0" /><a href="mailto:supporteasytorent@gmail.com" className="hover:text-orange-400 break-all">supporteasytorent@gmail.com</a></li>
            <li className="flex gap-2"><Clock className="h-4 w-4 text-orange-400 flex-shrink-0" /><span>Mon-Sat: 9 AM - 8 PM</span></li>
          </ul>

          <div className="mt-6">
            <h5 className="mb-2 text-sm font-medium">Stay Updated</h5>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="newsletter-input w-full rounded-lg border border-white/10 px-4 py-2 text-sm text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
                required
              />
              <button type="submit" className="w-full rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium hover:bg-orange-600 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="footer-bottom mt-8 md:mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 py-4 text-sm text-gray-400 md:flex-row">
        <p>&copy; {new Date().getFullYear()} EasyToRent. All rights reserved.</p>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          <Link to="/privacy" className="hover:text-orange-400 transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-orange-400 transition-colors">Terms</Link>
          <Link to="/refund" className="hover:text-orange-400 transition-colors">Refund</Link>
          <Link to="/sitemap" className="hover:text-orange-400 transition-colors">Sitemap</Link>
        </div>
        <div className="flex items-center gap-2">
          <span className="status-indicator"></span>
          <span>24/7 Support</span>
        </div>
      </div>
    </div>
  );
}
