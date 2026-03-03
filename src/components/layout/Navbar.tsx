import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, GitCompare, Search, Home, MapPin, Shield, Star, X, Menu, LogIn, LogOut, UserCircle, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCompare } from "@/contexts/CompareContext";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { wishlist } = useWishlist();
  const { compareList } = useCompare();
  const { isAuthenticated, user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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

            {/* Auth Button */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-orange-50 hover:bg-orange-100 border border-orange-200 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden xl:inline max-w-[80px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>
                {showProfileMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-900 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        {user?.role && user.role !== 'user' && (
                          <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                            user.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-purple-100 text-purple-600'
                          }`}>
                            {user.role}
                          </span>
                        )}
                      </div>
                      {user?.role === 'owner' && (
                        <Link
                          to="/owner"
                          onClick={() => setShowProfileMenu(false)}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                        >
                          <Building2 className="h-4 w-4" />
                          My Dashboard
                        </Link>
                      )}
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setShowProfileMenu(false)}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <Shield className="h-4 w-4" />
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => { logout(); setShowProfileMenu(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/login">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-orange-300 text-orange-600 hover:bg-orange-50 font-medium"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden xl:inline">Login</span>
                </Button>
              </Link>
            )}
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

              {/* Mobile Auth Button */}
              {isAuthenticated ? (
                <button
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 h-12 text-base font-semibold rounded-md border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out ({user?.name?.split(' ')[0]})
                </button>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 h-12 text-base font-semibold border-orange-300 text-orange-600 hover:bg-orange-50"
                  >
                    <LogIn className="h-5 w-5" />
                    Login / Sign Up
                  </Button>
                </Link>
              )}
           </div>
        </div>
      </div>
    </div>
  </>
  );
}