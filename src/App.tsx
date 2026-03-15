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
import AdminPanel from "./pages/AdminPanel";
import OwnerDashboard from "./pages/OwnerDashboard";
import { useAuth } from "./contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

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
            <BrowserRouter>
              <Routes>
                {/* ================= Public Routes (Tenant-Facing) ================= */}
                <Route path="/" element={<RoleGate><Index /></RoleGate>} />
                <Route path="/login" element={<Login />} />
                <Route path="/owner/login" element={<Login />} />
                <Route path="/owner/register" element={<Login />} />
                <Route path="/pg" element={<RoleGate><PGList /></RoleGate>} />
                <Route path="/pg/:slug" element={<RoleGate><PGDetail /></RoleGate>} />
                <Route path="/wishlist" element={<RoleGate><Wishlist /></RoleGate>} />
                <Route path="/compare" element={<RoleGate><Compare /></RoleGate>} />
                <Route path="/about" element={<RoleGate><About /></RoleGate>} />
                <Route path="/contact" element={<RoleGate><Contact /></RoleGate>} />
                <Route path="/faq" element={<RoleGate><FAQ /></RoleGate>} />
                <Route path="/terms" element={<RoleGate><Terms /></RoleGate>} />
                <Route path="/privacy" element={<RoleGate><Privacy /></RoleGate>} />

                {/* ================= Admin Routes ================= */}
                <Route path="/admin" element={<RoleGate><AdminPanel /></RoleGate>} />

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