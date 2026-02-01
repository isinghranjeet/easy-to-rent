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

import AdminLoginPage from "./pages/AdminLoginPage";
import AdminPGPortal from "./pages/AdminPGPortal";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <WishlistProvider>
          <CompareProvider>
            <Toaster />
            <Sonner />

            <BrowserRouter>
              <Routes>
                {/* ================= Public Routes ================= */}
                <Route path="/" element={<Index />} />
                <Route path="/pg" element={<PGList />} />
                <Route path="/pg/:slug" element={<PGDetail />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />

                {/* ================= Admin Routes ================= */}
                {/* Admin Login */}
                <Route path="/login" element={<AdminLoginPage />} />

                {/* Optional: old URL support */}
                <Route path="/admin/login" element={<AdminLoginPage />} />

                {/* Admin Dashboard (Protected) */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminPGPortal />
                    </ProtectedRoute>
                  }
                />

                {/* ================= 404 ================= */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>

          </CompareProvider>
        </WishlistProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;