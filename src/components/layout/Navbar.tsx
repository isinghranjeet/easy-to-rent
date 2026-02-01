import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Heart, GitCompare, Search, Home, MapPin, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCompare } from "@/contexts/CompareContext";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { wishlist } = useWishlist();
  const { compareList } = useCompare();

  const navLinks = [
    { href: "/", label: "Home", icon: <Home className="h-4 w-4" /> },
    { href: "/pg", label: "Find PG", icon: <Search className="h-4 w-4" /> },
    { href: "/about", label: "About", icon: <Star className="h-4 w-4" /> },
    { href: "/contact", label: "Contact", icon: <MapPin className="h-4 w-4" /> },
    { href: "/faq", label: "FAQ", icon: <Shield className="h-4 w-4" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">

          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center shadow-sm">
              <img
                src="/ranjeet.png"
                alt="EassyRent Logo"
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=ER&background=1e3a8a&color=ea580c&bold=true&size=256`;
                }}
              />
            </div>
            {/* Brand Text & Attractive Tagline */}
            <div className="flex flex-col">
              <span className="text-xl font-bold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-800 to-sky-800">
                  EassyTo
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-700 to-orange-700">
                  Rent
                </span>
              </span>

              <div className="flex items-center gap-2 text-sm font-semibold mt-1">
                <span className="flex items-center gap-1 text-gray-600 hover:text-orange-600 transition-colors">
                  <span className="w-2 h-2 bg-sky-800 rounded-full animate-pulse" /> Find
                </span>
                <span className="text-gray-400">•</span>
                <span className="flex items-center gap-1 text-gray-600 hover:text-orange-600 transition-colors">
                  <span className="w-2 h-2 bg-orange-700 rounded-full animate-pulse" /> Stay
                </span>
                <span className="text-gray-400">•</span>
                <span className="flex items-center gap-1 text-gray-600 hover:text-orange-600 transition-colors">
                  <span className="w-2 h-2 bg-sky-800 rounded-full animate-pulse" /> Live
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
                  ${isActive(link.href)
                    ? "bg-orange-500 text-white"
                    : "text-gray-700 hover:bg-orange-100 hover:text-orange-600"
                  }`}
              >
                <span className={isActive(link.href) ? "text-white" : "text-orange-500"}>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/wishlist">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-300 text-gray-700 hover:border-orange-400 hover:text-orange-600"
              >
                <Heart className="h-5 w-5" />
                Wishlist {wishlist.length > 0 && `(${wishlist.length})`}
              </Button>
            </Link>
            <Link to="/compare">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-300 text-gray-700 hover:border-orange-400 hover:text-orange-600"
              >
                <GitCompare className="h-5 w-5" />
                Compare {compareList.length > 0 && `(${compareList.length})`}
              </Button>
            </Link>
            <Link to="/pg">
              <Button className="flex items-center gap-2 bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800 hover:from-orange-700 hover:to-orange-900 text-white">
                <Search className="h-5 w-5" />
                Search PG
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md bg-gray-100 hover:bg-orange-50"
          >
            {isOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-md text-base font-medium transition-colors duration-200
                    ${isActive(link.href)
                      ? "bg-orange-500 text-white"
                      : "text-gray-700 hover:bg-orange-100 hover:text-orange-600"
                    }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}

              <div className="flex flex-col gap-2 mt-4">
                <Link to="/wishlist" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full flex items-center gap-2 border-gray-300 text-gray-700 hover:border-orange-400 hover:text-orange-600"
                  >
                    <Heart className="h-5 w-5" />
                    Wishlist ({wishlist.length})
                  </Button>
                </Link>
                <Link to="/compare" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full flex items-center gap-2 border-gray-300 text-gray-700 hover:border-orange-400 hover:text-orange-600"
                  >
                    <GitCompare className="h-5 w-5" />
                    Compare ({compareList.length})
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}