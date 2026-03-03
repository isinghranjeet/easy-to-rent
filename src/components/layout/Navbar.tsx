import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, GitCompare, Search, Home, MapPin, Shield, Star, X, Menu } from "lucide-react";
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">

          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-gray-100 flex items-center justify-center shadow-sm">
              <img
                src="/ranjeet.png"
                alt="EassyRent Logo"
                className="w-8 h-8 md:w-10 md:h-10 object-contain"
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=ER&background=1e3a8a&color=ea580c&bold=true&size=256`;
                }}
              />
            </div>
            {/* Brand Text & Attractive Tagline */}
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-800 to-sky-800">
                  EassyTo
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-700 to-orange-700">
                  Rent
                </span>
              </span>

              <div className="hidden sm:flex items-center gap-2 text-xs md:text-sm font-semibold mt-1">
                <span className="flex items-center gap-1 text-gray-600 hover:text-orange-600 transition-colors">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-sky-800 rounded-full animate-pulse" /> Find
                </span>
                <span className="text-gray-400">•</span>
                <span className="flex items-center gap-1 text-gray-600 hover:text-orange-600 transition-colors">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-orange-700 rounded-full animate-pulse" /> Stay
                </span>
                <span className="text-gray-400">•</span>
                <span className="flex items-center gap-1 text-gray-600 hover:text-orange-600 transition-colors">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-sky-800 rounded-full animate-pulse" /> Live
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
               <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-1.5 px-3 lg:px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
                  ${isActive(link.href)
                    ? "bg-orange-500 text-white"
                    : "text-gray-700 hover:bg-orange-100 hover:text-orange-600"
                  }`}
              >
                <span className={`${isActive(link.href) ? "text-white" : "text-orange-500"} mb-0.5`}>{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Action Buttons (Desktop) */}
          <div className="hidden lg:flex items-center gap-2">
            <Link to="/wishlist">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-300 text-gray-700 hover:border-orange-400 hover:text-orange-600 font-medium"
              >
                <Heart className="h-4 w-4" />
                <span className="hidden xl:inline">Wishlist</span>
                {wishlist.length > 0 && <span className="bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full text-xs">{wishlist.length}</span>}
              </Button>
            </Link>
            <Link to="/compare">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-300 text-gray-700 hover:border-orange-400 hover:text-orange-600 font-medium"
              >
                <GitCompare className="h-4 w-4" />
                <span className="hidden xl:inline">Compare</span>
                {compareList.length > 0 && <span className="bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full text-xs">{compareList.length}</span>}
              </Button>
            </Link>
            <Link to="/pg">
              <Button className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg transition-all">
                <Search className="h-4 w-4" />
                Search PG
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center z-[60]">
             <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 -mr-2 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-full transition-all duration-200"
             >
               <Menu className={`h-6 w-6 transition-colors ${isOpen ? 'text-orange-600' : 'text-gray-700'}`} />
             </button>
          </div>
        </div>
      </div>
    </nav>

    {/* Mobile Popover/Drawer */}
    {/* Backdrop */}
    <div 
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={() => setIsOpen(false)}
    />
    
    {/* Drawer */}
    <div 
      className={`fixed top-0 right-0 h-full w-[85vw] sm:w-[350px] bg-white z-[110] lg:hidden shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="flex flex-col h-full bg-white">
        <div className="p-6 border-b border-gray-100 overflow-y-auto">
           <div className="flex items-center justify-between mb-8 mt-2">
              <span className="text-xl font-bold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-800 to-sky-800">
                  EassyTo
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-700 to-orange-700">
                  Rent
                </span>
              </span>
              <button onClick={() => setIsOpen(false)} className="p-2 -mr-2 bg-gray-50 rounded-full hover:bg-gray-100">
                <X className="h-6 w-6 text-gray-500" />
              </button>
           </div>
           
           <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold transition-all duration-200
                  ${isActive(link.href)
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                    : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  }`}
              >
                <span className={isActive(link.href) ? "text-white" : "text-orange-500"}>{link.icon}</span>
                {link.label}
              </Link>
            ))}
           </div>
        </div>

        <div className="p-6 mt-auto bg-gray-50/50">
           <div className="flex flex-col gap-3">
              <Link to="/wishlist" onClick={() => setIsOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full flex justify-between items-center h-12 border-gray-200 bg-white text-gray-700 hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50"
                >
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-orange-500" />
                    <span className="font-semibold">My Wishlist</span>
                  </div>
                  {wishlist.length > 0 && (
                    <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-sm font-bold">
                      {wishlist.length}
                    </span>
                  )}
                </Button>
              </Link>
              
              <Link to="/compare" onClick={() => setIsOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full flex justify-between items-center h-12 border-gray-200 bg-white text-gray-700 hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50"
                >
                   <div className="flex items-center gap-2">
                    <GitCompare className="h-5 w-5 text-orange-500" />
                    <span className="font-semibold">Compare Properties</span>
                  </div>
                  {compareList.length > 0 && (
                    <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-sm font-bold">
                      {compareList.length}
                    </span>
                  )}
                </Button>
              </Link>

              <div className="h-px bg-gray-200 my-2"></div>

              <Link to="/pg" onClick={() => setIsOpen(false)}>
                <Button className="w-full flex items-center justify-center gap-2 h-14 text-base font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/30">
                  <Search className="h-5 w-5" />
                  Start Exploring PGs
                </Button>
              </Link>
           </div>
        </div>
      </div>
    </div>
  </>
  );
}