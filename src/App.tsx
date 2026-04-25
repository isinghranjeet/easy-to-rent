import React, { useState, useEffect } from "react";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { CompareProvider } from "./contexts/CompareContext";

import { InstallBanner } from "./components/pwa/InstallBanner";
import { InstallButton } from "./components/pwa/InstallButton";
import { SplashScreen } from "./components/pwa/SplashScreen";

// Pages
import Index from "./pages/Index";
import PGList from "./pages/PGList";
import PGDetail from "./pages/PGDetail";
import Wishlist from "./pages/Wishlist";
import Compare from "./pages/Compare";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import OwnerDashboard from "./pages/OwnerDashboard";
import Dashboard from "./pages/Dashboard";

// Admin
import AdminLayout from "./admin/pages/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import PgManagement from "./admin/pages/PgManagement";
import UserManagement from "./admin/pages/UserManagement";
import BookingManagement from "./admin/pages/BookingManagement";
import ReviewManagement from "./admin/pages/ReviewManagement";
import AnalyticsPage from "./admin/pages/AnalyticsPage";
import SystemHealth from "./admin/pages/SystemHealth";
import NotificationsPage from "./admin/pages/NotificationsPage";
import AdminProfile from "./admin/pages/AdminProfile";

// Extra pages
import HowItWorks from "./pages/how-it-works";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Refund from "./pages/Refund";
import RegisterPropertyPage from "./pages/RegisterPropertyPage";
import LocationPage from "./pages/LocationPage";
import AuthCallback from "./pages/AuthCallback";

const queryClient = new QueryClient();

/* ---------------- ROLE GATE ---------------- */
const RoleGate = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated && user?.role === "owner") {
    const isOwnerPath =
      location.pathname.startsWith("/owner") || location.pathname === "/login";

    if (!isOwnerPath) {
      return <Navigate to="/owner" replace />;
    }
  }

  return <>{children}</>;
};

/* ---------------- SPLASH CONTROLLER - ONLY ONE TIME EVER ---------------- */
const SplashController = ({ children }: { children: React.ReactNode }) => {
  const [showSplash, setShowSplash] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user has seen splash before (permanent storage)
    const hasSeenPermanent = localStorage.getItem("easytorent_splash_complete");
    
    if (hasSeenPermanent) {
      // Returning user - no splash, directly show app
      setShowSplash(false);
      setIsChecking(false);
      return;
    }

    // First time user - show splash
    setShowSplash(true);
    
    // Auto hide splash after duration
    const timer = setTimeout(() => {
      setShowSplash(false);
      // Mark as seen permanently (never show again)
      localStorage.setItem("easytorent_splash_complete", "true");
      setIsChecking(false);
    }, 2800); // 2.8 seconds splash duration

    return () => clearTimeout(timer);
  }, []);

  // Show nothing while checking
  if (isChecking) {
    return null;
  }

  // Show splash on first visit only
  if (showSplash) {
    return <SplashScreen onComplete={() => {
      setShowSplash(false);
      setIsChecking(false);
    }} />;
  }

  // Show app content
  return <>{children}</>;
};

/* ---------------- MAIN APP ---------------- */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <AuthProvider>
        <WishlistProvider>
          <CompareProvider>
            <BrowserRouter
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <SplashController>
                {/* PWA UI */}
                <InstallBanner />
                <InstallButton variant="floating" />

                <Routes>
                  {/* Public */}
                  <Route path="/" element={<RoleGate><Index /></RoleGate>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/owner/login" element={<Login />} />
                  <Route path="/owner/register" element={<Login />} />

                  <Route path="/pg" element={<RoleGate><PGList /></RoleGate>} />
                  <Route path="/pg/:slug" element={<RoleGate><PGDetail /></RoleGate>} />

                  <Route path="/dashboard" element={<RoleGate><Dashboard /></RoleGate>} />

                  <Route path="/wishlist" element={<RoleGate><Wishlist /></RoleGate>} />
                  <Route path="/compare" element={<RoleGate><Compare /></RoleGate>} />
                  <Route path="/about" element={<RoleGate><About /></RoleGate>} />
                  <Route path="/contact" element={<RoleGate><Contact /></RoleGate>} />
                  <Route path="/faq" element={<RoleGate><FAQ /></RoleGate>} />
                  <Route path="/terms" element={<RoleGate><Terms /></RoleGate>} />
                  <Route path="/privacy" element={<RoleGate><Privacy /></RoleGate>} />

                  {/* Blog */}
                  <Route path="/blog" element={<RoleGate><Blog /></RoleGate>} />
                  <Route path="/blog/:slug" element={<RoleGate><BlogDetail /></RoleGate>} />

                  {/* Extra */}
                  <Route path="/how-it-works" element={<RoleGate><HowItWorks /></RoleGate>} />
                  <Route path="/refund" element={<RoleGate><Refund /></RoleGate>} />
                  <Route path="/register-property" element={<RoleGate><RegisterPropertyPage /></RoleGate>} />
                  <Route path="/list-property" element={<RoleGate><RegisterPropertyPage /></RoleGate>} />

                  {/* Location */}
                  <Route path="/location/:slug" element={<RoleGate><LocationPage /></RoleGate>} />

                  {/* Auth callback */}
                  <Route path="/auth/callback" element={<AuthCallback />} />

                  {/* Admin */}
                  <Route path="/admin" element={<RoleGate><AdminLayout /></RoleGate>}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="pgs" element={<PgManagement />} />
                    <Route path="bookings" element={<BookingManagement />} />
                    <Route path="reviews" element={<ReviewManagement />} />
                    <Route path="analytics" element={<AnalyticsPage />} />
                    <Route path="system" element={<SystemHealth />} />
                    <Route path="notifications" element={<NotificationsPage />} />
                    <Route path="profile" element={<AdminProfile />} />
                  </Route>

                  {/* Owner */}
                  <Route path="/owner" element={<OwnerDashboard />} />

                  {/* 404 */}
                  <Route path="*" element={<RoleGate><NotFound /></RoleGate>} />
                </Routes>
              </SplashController>
            </BrowserRouter>
          </CompareProvider>
        </WishlistProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;