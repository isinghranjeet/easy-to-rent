import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";

export function Footer() {
  return (
    <>
      {/* ================= CUSTOM CSS ================= */}
      <style>
        {`
        .footer-gradient {
          background: linear-gradient(
            135deg,
            hsl(220 15% 12%) 0%,
            hsl(220 15% 8%) 100%
          );
        }

        .footer-link {
          position: relative;
          display: inline-block;
          transition: color 0.3s ease;
        }

        .footer-link::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -4px;
          width: 0%;
          height: 2px;
          background: #f97316;
          transition: width 0.3s ease;
        }

        .footer-link:hover::after {
          width: 100%;
        }

        .footer-social {
          transition: all 0.3s ease;
        }

        .footer-social:hover {
          transform: translateY(-4px);
          box-shadow: 0 0 18px rgba(249, 115, 22, 0.6);
        }

        .footer-title {
          position: relative;
          padding-bottom: 8px;
        }

        .footer-title::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 40px;
          height: 3px;
          background: #f97316;
          border-radius: 999px;
        }

        .footer-bottom {
          backdrop-filter: blur(8px);
          background: rgba(255,255,255,0.03);
        }
      `}
      </style>

      {/* ================= FOOTER ================= */}
      <footer className="footer-gradient mt-auto text-white">
        <div className="container mx-auto px-4 py-14">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

            {/* BRAND */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500 font-bold text-lg">
                  CU
                </div>
                <span className="text-xl font-bold">PG Finder</span>
              </div>

              <p className="text-sm text-gray-400 leading-relaxed">
                Find safe, verified & affordable PGs near Chandigarh University.
              </p>

              <div className="flex gap-3">
                {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="footer-social flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-orange-500"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* QUICK LINKS */}
            <div>
              <h4 className="footer-title text-lg font-semibold">
                Quick Links
              </h4>
              <ul className="mt-5 space-y-2 text-sm text-gray-400">
                {["Find PG", "About Us", "Contact", "FAQs"].map((item) => (
                  <li key={item}>
                    <Link to="/" className="footer-link hover:text-orange-400">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* LOCATIONS */}
            <div>
              <h4 className="footer-title text-lg font-semibold">
                Popular Areas
              </h4>
              <ul className="mt-5 space-y-2 text-sm text-gray-400">
                {["Gate 1", "Library Road", "Sports Complex"].map((area) => (
                  <li key={area}>
                    <Link to="/" className="footer-link hover:text-orange-400">
                      {area}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CONTACT */}
            <div>
              <h4 className="footer-title text-lg font-semibold">
                Contact Us
              </h4>
              <ul className="mt-5 space-y-3 text-sm text-gray-400">
                <li className="flex gap-3">
                  <MapPin className="h-5 w-5 text-orange-400" />
                  Chandigarh University, Punjab
                </li>
                <li className="flex gap-3">
                  <Phone className="h-5 w-5 text-orange-400" />
                  +91 9315058665
                </li>
                <li className="flex gap-3">
                  <Mail className="h-5 w-5 text-orange-400" />
                  contact@cupgfinder.com
                </li>
              </ul>
            </div>
          </div>

          {/* BOTTOM BAR */}
          <div className="footer-bottom mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 py-5 text-sm text-gray-400 md:flex-row">
            <p> PG Finder. All rights reserved.</p>
            <p>Made with ❤️ for CU Students</p>
          </div>
        </div>
      </footer>
    </>
  );
}
