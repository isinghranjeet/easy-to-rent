import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { CompareProvider } from "./contexts/CompareContext";

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

// ────────────────── Admin Dashboard (New Modular Architecture) ──────────────────
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

// Missing imports - add these
import HowItWorks from "./pages/how-it-works";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Refund from "./pages/Refund";
import RegisterPropertyPage from "./pages/RegisterPropertyPage";

// Location Page
import LocationPage from "./pages/LocationPage";

// Auth Callback for Google Login
import AuthCallback from "./pages/AuthCallback";

// ✅ ADD DASHBOARD IMPORT
import Dashboard from "./pages/Dashboard";

import { useAuth } from "./contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { InstallBanner } from "./components/pwa/InstallBanner";
import { InstallButton } from "./components/pwa/InstallButton";

const queryClient = new QueryClient();

/**
 * roleGate - redirect owners away from application
 */
const RoleGate = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated && user?.role === 'owner') {
    const isOwnerPath = location.pathname.startsWith('/owner') || location.pathname === '/login';
    if (!isOwnerPath) {
      return <Navigate to="/owner" replace />;
    }
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <WishlistProvider>
          <CompareProvider>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              {/* Global PWA Install UI */}
              <InstallBanner />
              <InstallButton variant="floating" />

              <Routes>
                {/* ================= Public Routes (Tenant-Facing) ================= */}
                <Route path="/" element={<RoleGate><Index /></RoleGate>} />
                <Route path="/login" element={<Login />} />
                <Route path="/owner/login" element={<Login />} />
                <Route path="/owner/register" element={<Login />} />
                <Route path="/pg" element={<RoleGate><PGList /></RoleGate>} />
                <Route path="/pg/:slug" element={<RoleGate><PGDetail /></RoleGate>} />
                
                {/* ✅ DASHBOARD ROUTE - ADDED */}
                <Route path="/dashboard" element={<RoleGate><Dashboard /></RoleGate>} />
                
                <Route path="/wishlist" element={<RoleGate><Wishlist /></RoleGate>} />
                <Route path="/compare" element={<RoleGate><Compare /></RoleGate>} />
                <Route path="/about" element={<RoleGate><About /></RoleGate>} />
                <Route path="/contact" element={<RoleGate><Contact /></RoleGate>} />
                <Route path="/faq" element={<RoleGate><FAQ /></RoleGate>} />
                <Route path="/terms" element={<RoleGate><Terms /></RoleGate>} />
                <Route path="/privacy" element={<RoleGate><Privacy /></RoleGate>} />
                
                {/* ================= Blog Routes ================= */}
                <Route path="/blog" element={<RoleGate><Blog /></RoleGate>} />
                <Route path="/blog/:slug" element={<RoleGate><BlogDetail /></RoleGate>} />

                {/* ================= New Routes Added ================= */}
                <Route path="/how-it-works" element={<RoleGate><HowItWorks /></RoleGate>} />
                <Route path="/refund" element={<RoleGate><Refund /></RoleGate>} />
                <Route path="/register-property" element={<RoleGate><RegisterPropertyPage /></RoleGate>} />
                <Route path="/list-property" element={<RoleGate><RegisterPropertyPage /></RoleGate>} />

                {/* Location Route */}
                <Route path="/location/:slug" element={<RoleGate><LocationPage /></RoleGate>} />

                {/* Auth Callback Route (Google Login Redirect) */}
                <Route path="/auth/callback" element={<AuthCallback />} />

                {/* ================= Admin Routes (New Modular Architecture) ================= */}
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

                {/* ================= Owner Routes ================= */}
                <Route path="/owner" element={<OwnerDashboard />} />

                {/* ================= 404 ================= */}
                <Route path="*" element={<RoleGate><NotFound /></RoleGate>} />
              </Routes>
            </BrowserRouter>
          </CompareProvider>
        </WishlistProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;