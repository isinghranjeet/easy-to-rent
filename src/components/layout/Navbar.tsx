import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Heart,
  Search,
  Home,
  MapPin,
  Shield,
  Star,
  X,
  Menu,
  LogIn,
  LogOut,
  Building2,
  ChevronDown,
  User,
  Settings,
  HelpCircle,
  Scale,
  Plus
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCompare } from "@/contexts/CompareContext";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { wishlist } = useWishlist();
  const { compareList } = useCompare();
  const { isAuthenticated, user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home", icon: <Home className="h-4 w-4" /> },
    { href: "/pg", label: "Find PG", icon: <Search className="h-4 w-4" /> },
    { href: "/about", label: "About", icon: <Star className="h-4 w-4" /> },
    { href: "/contact", label: "Contact", icon: <MapPin className="h-4 w-4" /> },
    { href: "/faq", label: "FAQ", icon: <Shield className="h-4 w-4" /> }
  ];

  const isActive = (path: string) => location.pathname === path;

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
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-orange-100" 
          : "bg-white border-b border-gray-200"
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24">

            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-2 sm:gap-4">
              <div className="relative">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center">
                  <img
                    src="/ranjeet.png"
                    alt="EasyToRent"
                    className="w-full h-full object-contain drop-shadow-lg"
                    loading="eager"
                  />
                </div>
              </div>
            </Link>

            {/* Desktop Navigation - Visible on lg and up */}
            <div className="hidden lg:flex items-center gap-1">
              {user?.role !== 'owner' && navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                    ${isActive(link.href)
                      ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-md shadow-orange-200"
                      : "text-gray-700 hover:bg-orange-50"
                    }`}
                >
                  <span className={`transition-colors duration-200 ${
                    isActive(link.href) 
                      ? "text-white" 
                      : "text-orange-500 group-hover:text-orange-600"
                  }`}>
                    {link.icon}
                  </span>
                  {link.label}
                  {!isActive(link.href) && (
                    <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-orange-500 group-hover:w-1/2 group-hover:left-1/4 transition-all duration-300"></span>
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop Action Buttons - Visible on lg and up */}
            <div className="hidden lg:flex items-center gap-3">
              {user?.role !== 'owner' && (
                <>
                  {/* Compare Button - Desktop with Orange Theme */}
                  <Button
                    asChild
                    variant="outline"
                    className="relative flex items-center gap-2 border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-all duration-300 group"
                  >
                    <Link to="/compare">
                      <Scale className="h-4 w-4 text-gray-600 group-hover:text-orange-500 group-hover:scale-110 transition-all duration-300" />
                      <span className="group-hover:text-orange-600">Compare</span>
                      {compareList.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-2 py-0.5 rounded-full text-xs font-bold animate-pulse">
                          {compareList.length}
                        </span>
                      )}
                    </Link>
                  </Button>

                  {/* Wishlist Button - Desktop */}
                  <Button
                    asChild
                    variant="outline"
                    className="relative flex items-center gap-2 border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-all duration-300 group"
                  >
                    <Link to="/wishlist">
                      <Heart className="h-4 w-4 text-gray-600 group-hover:text-orange-500 group-hover:scale-110 transition-all duration-300" />
                      <span className="group-hover:text-orange-600">Wishlist</span>
                      {wishlist.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold animate-pulse">
                          {wishlist.length}
                        </span>
                      )}
                    </Link>
                  </Button>

                  {/* Search Button - Desktop */}
                  <Button asChild className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md shadow-orange-200 hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                    <Link to="/pg">
                      <Search className="h-4 w-4" />
                      Search PG
                    </Link>
                  </Button>
                </>
              )}

              {/* Auth Section - Desktop */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-orange-200 hover:border-orange-400 bg-orange-50/50 hover:bg-orange-100 transition-all duration-300 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600">
                      {user?.name?.split(' ')[0] || 'Profile'}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-orange-500 transition-transform duration-300 ${
                      showProfileMenu ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in slide-in-from-top-2">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                      {(user?.role === 'owner' || user?.role === 'admin') && (
                        <Link
                          to="/owner"
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <Building2 className="h-4 w-4" />
                          Dashboard
                        </Link>
                      )}
                      <Link
                        to="/settings"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                      <Link
                        to="/help"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        onClick={() => setShowProfileMenu(false)}
                      >
                        <HelpCircle className="h-4 w-4" />
                        Help
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={() => {
                          logout();
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/owner/register">
                    <Button variant="ghost" className="hidden xl:flex items-center gap-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 transition-all duration-300">
                      <Plus className="h-4 w-4 text-orange-500" />
                      Register Your Property
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md shadow-orange-200 transform hover:scale-105 transition-all duration-300">
                      <LogIn className="h-4 w-4" />
                      Login
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile/Tablet Action Icons - Visible below lg */}
            <div className="flex lg:hidden items-center gap-1 sm:gap-2">
              {user?.role !== 'owner' && (
                <>
                  {/* Compare Icon - Mobile/Tablet with Orange Theme */}
                  <Button asChild variant="ghost" size="icon" className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full hover:bg-orange-50 p-1.5 sm:p-2">
                    <Link to="/compare">
                      <Scale className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                      {compareList.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white w-4 h-4 sm:w-5 sm:h-5 rounded-full text-xs flex items-center justify-center">
                          {compareList.length}
                        </span>
                      )}
                    </Link>
                  </Button>

                  {/* Wishlist Icon - Mobile/Tablet */}
                  <Button asChild variant="ghost" size="icon" className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full hover:bg-orange-50 p-1.5 sm:p-2">
                    <Link to="/wishlist">
                      <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                      {wishlist.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white w-4 h-4 sm:w-5 sm:h-5 rounded-full text-xs flex items-center justify-center">
                          {wishlist.length}
                        </span>
                      )}
                    </Link>
                  </Button>

                  {/* Search Icon - Mobile/Tablet */}
                  <Button asChild variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 rounded-full hover:bg-orange-50 p-1.5 sm:p-2">
                    <Link to="/pg">
                      <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                    </Link>
                  </Button>
                </>
              )}

              {/* Profile/Login Icon - Mobile/Tablet */}
              {isAuthenticated ? (
                <button
                  onClick={() => setIsOpen(true)}
                  className="p-1.5 sm:p-2"
                >
                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                </button>
              ) : (
                <Link to="/login" className="p-1.5 sm:p-2">
                  <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 rounded-full hover:bg-orange-50">
                    <LogIn className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                  </Button>
                </Link>
              )}

              {/* Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 sm:p-2 ml-1"
              >
                <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gray-100 hover:bg-orange-100">
                  {isOpen ? (
                    <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
                  ) : (
                    <Menu className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
                  )}
                </Button>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Slide-out */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`absolute right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 sm:p-6">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div className="flex items-center gap-2">
                <img src="/ranjeet.png" alt="Logo" className="w-10 h-10 sm:w-12 sm:h-12" />
                <span className="font-bold text-lg sm:text-xl bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
                  EasyToRent
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-orange-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* User Info - Mobile */}
            {isAuthenticated && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center text-white font-bold text-base sm:text-lg">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">{user?.name || 'User'}</p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">{user?.email || ''}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Navigation Links */}
            <div className="space-y-1">
              {user?.role !== 'owner' && navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-200 text-sm sm:text-base ${
                    isActive(link.href)
                      ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-md"
                      : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  }`}
                >
                  <span className={isActive(link.href) ? "text-white" : "text-orange-500"}>
                    {link.icon}
                  </span>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Action Buttons */}
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
              {user?.role !== 'owner' && (
                <>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {/* Compare Button - Mobile Menu with Orange Theme */}
                    <Link
                      to="/compare"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 p-3 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-100 transition-colors"
                    >
                      <Scale className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-sm sm:text-base font-medium">Compare</span>
                      {compareList.length > 0 && (
                        <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-1.5 py-0.5 rounded-full text-xs">
                          {compareList.length}
                        </span>
                      )}
                    </Link>

                    {/* Wishlist Button - Mobile Menu */}
                    <Link
                      to="/wishlist"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 p-3 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-100 transition-colors"
                    >
                      <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-sm sm:text-base font-medium">Wishlist</span>
                      {wishlist.length > 0 && (
                        <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-1.5 py-0.5 rounded-full text-xs">
                          {wishlist.length}
                        </span>
                      )}
                    </Link>
                  </div>

                  {/* Search Button - Mobile Menu */}
                  <Button asChild className="flex items-center justify-center gap-2 p-3 mt-2 sm:mt-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-medium shadow-lg shadow-orange-200">
                    <Link
                      to="/pg"
                      onClick={() => setIsOpen(false)}
                    >
                      <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="text-sm sm:text-base">Search PG</span>
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Auth Actions */}
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-gray-700 hover:bg-orange-50 rounded-xl transition-colors mb-1 text-sm sm:text-base"
                  >
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-gray-700 hover:bg-orange-50 rounded-xl transition-colors mb-1 text-sm sm:text-base"
                  >
                    <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                    Settings
                  </Link>
                  <Link
                    to="/help"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-gray-700 hover:bg-orange-50 rounded-xl transition-colors mb-3 text-sm sm:text-base"
                  >
                    <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                    Help
                  </Link>
                  {(user?.role === 'owner' || user?.role === 'admin') && (
                    <Link
                      to="/owner"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-gray-700 hover:bg-orange-50 rounded-xl transition-colors mb-1 text-sm sm:text-base"
                    >
                      <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors font-medium text-sm sm:text-base"
                  >
                    <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                    Logout
                  </button>
                </>
              ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/owner/register"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-orange-200 text-orange-600 rounded-xl hover:bg-orange-50 transition-all duration-300 font-medium text-sm sm:text-base"
                    >
                      <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                      Register Your Property
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-medium shadow-lg shadow-orange-200 text-sm sm:text-base"
                    >
                      <LogIn className="h-4 w-4 sm:h-5 sm:w-5" />
                      Login / Sign Up
                    </Link>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}