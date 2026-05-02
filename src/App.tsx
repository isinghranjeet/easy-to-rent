import React, { useState, useEffect, Suspense } from "react";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { CompareProvider } from "./contexts/CompareContext";

import { InstallBanner } from "./components/pwa/InstallBanner";
import { InstallButton } from "./components/pwa/InstallButton";
import { OfflineBanner } from "./components/pwa/OfflineBanner";
import { SplashScreen } from "./components/pwa/SplashScreen";
import { GlobalBackNavigation } from "./components/layout/GlobalBackNavigation";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { PageLoader } from "./components/layout/PageLoader";

/* ---------------- PUBLIC PAGES ---------------- */
const Index = React.lazy(() => import("./pages/Index"));
const PGList = React.lazy(() => import("./pages/PGList"));
const PGDetail = React.lazy(() => import("./pages/PGDetail"));
const Wishlist = React.lazy(() => import("./pages/Wishlist"));
const Compare = React.lazy(() => import("./pages/Compare"));
const About = React.lazy(() => import("./pages/About"));
const Contact = React.lazy(() => import("./pages/Contact"));
const FAQ = React.lazy(() => import("./pages/FAQ"));
const Terms = React.lazy(() => import("./pages/Terms"));
const Privacy = React.lazy(() => import("./pages/Privacy"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Login = React.lazy(() => import("./pages/Login"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Settings = React.lazy(() => import("./pages/Settings"));
const Help = React.lazy(() => import("./pages/Help"));

/* ---------------- USER PROFILE ---------------- */
const UserProfile = React.lazy(() => import("./pages/UserProfile"));

const OwnerDashboard = React.lazy(() => import("./pages/OwnerDashboard"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));

/* ---------------- ADMIN ---------------- */
const AdminLayout = React.lazy(() => import("./admin/pages/AdminLayout"));
const AdminDashboard = React.lazy(() => import("./admin/pages/AdminDashboard"));
const PgManagement = React.lazy(() => import("./admin/pages/PgManagement"));
const UserManagement = React.lazy(() => import("./admin/pages/UserManagement"));
const BookingManagement = React.lazy(() => import("./admin/pages/BookingManagement"));
const ReviewManagement = React.lazy(() => import("./admin/pages/ReviewManagement"));
const AnalyticsPage = React.lazy(() => import("./admin/pages/AnalyticsPage"));
const SystemHealth = React.lazy(() => import("./admin/pages/SystemHealth"));
const NotificationsPage = React.lazy(() => import("./admin/pages/NotificationsPage"));
const AdminProfile = React.lazy(() => import("./admin/pages/AdminProfile"));

/* ---------------- EXTRA ---------------- */
const HowItWorks = React.lazy(() => import("./pages/how-it-works"));
const Blog = React.lazy(() => import("./pages/Blog"));
const BlogDetail = React.lazy(() => import("./pages/BlogDetail"));
const Refund = React.lazy(() => import("./pages/Refund"));
const RegisterPropertyPage = React.lazy(
  () => import("./pages/RegisterPropertyPage")
);
const LocationPage = React.lazy(() => import("./pages/LocationPage"));
const AuthCallback = React.lazy(() => import("./pages/AuthCallback"));

const queryClient = new QueryClient();

/* ---------------- ROLE GATE ---------------- */
const RoleGate = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // ✅ FIX: Handle admin role - redirect to admin dashboard
  if (isAuthenticated && user?.role === "admin") {
    const isAdminPath = location.pathname.startsWith("/admin");
    const isLoginPath = location.pathname === "/login";
    
    // If not already on admin route, redirect to admin dashboard
    if (!isAdminPath && !isLoginPath) {
      console.log('🔄 [ROLE_GATE] Admin logged in, redirecting to /admin');
      return <Navigate to="/admin" replace />;
    }
  }

  if (isAuthenticated && user?.role === "owner") {
    const isOwnerPath =
      location.pathname.startsWith("/owner") ||
      location.pathname === "/login";

    if (!isOwnerPath) {
      return <Navigate to="/owner" replace />;
    }
  }

  return <>{children}</>;
};

/* ---------------- SPLASH ---------------- */
const SplashController = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [showSplash, setShowSplash] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const hasSeen = localStorage.getItem("easytorent_splash_complete");

    if (hasSeen) {
      setIsChecking(false);
      return;
    }

    setShowSplash(true);

    const timer = setTimeout(() => {
      localStorage.setItem("easytorent_splash_complete", "true");
      setShowSplash(false);
      setIsChecking(false);
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  if (isChecking) return null;

  if (showSplash) {
    return (
      <SplashScreen
        onComplete={() => {
          setShowSplash(false);
          setIsChecking(false);
        }}
      />
    );
  }

  return <>{children}</>;
};

/* ---------------- APP ---------------- */
const App = () => {
  return (
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
                <GlobalBackNavigation />

                <SplashController>
                  <InstallBanner />
                  <InstallButton variant="floating" />
                  <OfflineBanner />

                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      {/* PUBLIC */}
                      <Route
                        path="/"
                        element={
                          <RoleGate>
                            <Index />
                          </RoleGate>
                        }
                      />

                      <Route path="/login" element={<Login />} />
                      <Route path="/owner/login" element={<Login />} />
                      <Route path="/owner/register" element={<Login />} />

                      <Route
                        path="/pg"
                        element={
                          <RoleGate>
                            <PGList />
                          </RoleGate>
                        }
                      />

                      <Route
                        path="/pg/:slug"
                        element={
                          <RoleGate>
                            <PGDetail />
                          </RoleGate>
                        }
                      />

                      <Route
                        path="/dashboard"
                        element={
                          <RoleGate>
                            <Dashboard />
                          </RoleGate>
                        }
                      />

                      <Route
                        path="/wishlist"
                        element={
                          <RoleGate>
                            <Wishlist />
                          </RoleGate>
                        }
                      />

                      <Route
                        path="/compare"
                        element={
                          <RoleGate>
                            <Compare />
                          </RoleGate>
                        }
                      />

                      <Route
                        path="/about"
                        element={
                          <RoleGate>
                            <About />
                          </RoleGate>
                        }
                      />

                      <Route
                        path="/contact"
                        element={
                          <RoleGate>
                            <Contact />
                          </RoleGate>
                        }
                      />

                      <Route
                        path="/faq"
                        element={
                          <RoleGate>
                            <FAQ />
                          </RoleGate>
                        }
                      />

                      <Route
                        path="/terms"
                        element={
                          <RoleGate>
                            <Terms />
                          </RoleGate>
                        }
                      />

                      <Route
                        path="/privacy"
                        element={
                          <RoleGate>
                            <Privacy />
                          </RoleGate>
                        }
                      />

                      {/* BLOG */}
                      <Route
                        path="/blog"
                        element={
                          <RoleGate>
                            <Blog />
                          </RoleGate>
                        }
                      />

                      <Route
                        path="/blog/:slug"
                        element={
                          <RoleGate>
                            <BlogDetail />
                          </RoleGate>
                        }
                      />

                      {/* EXTRA */}
                      <Route
                        path="/how-it-works"
                        element={
                          <RoleGate>
                            <HowItWorks />
                          </RoleGate>
                        }
                      />

                      <Route
                        path="/refund"
                        element={
                          <RoleGate>
                            <Refund />
                          </RoleGate>
                        }
                      />

                      <Route
                        path="/register-property"
                        element={
                          <RoleGate>
                            <RegisterPropertyPage />
                          </RoleGate>
                        }
                      />

                      <Route
                        path="/list-property"
                        element={
                          <RoleGate>
                            <RegisterPropertyPage />
                          </RoleGate>
                        }
                      />

                      <Route
                        path="/location/:slug"
                        element={
                          <RoleGate>
                            <LocationPage />
                          </RoleGate>
                        }
                      />

                      <Route
                        path="/auth/callback"
                        element={<AuthCallback />}
                      />

                      {/* ADMIN */}
                      <Route
                        path="/admin"
                        element={
                          <RoleGate>
                            <AdminLayout />
                          </RoleGate>
                        }
                      >
                        <Route
                          index
                          element={<AdminDashboard />}
                        />
                        <Route
                          path="users"
                          element={<UserManagement />}
                        />
                        <Route
                          path="pgs"
                          element={<PgManagement />}
                        />
                        <Route
                          path="bookings"
                          element={<BookingManagement />}
                        />
                        <Route
                          path="reviews"
                          element={<ReviewManagement />}
                        />
                        <Route
                          path="analytics"
                          element={<AnalyticsPage />}
                        />
                        <Route
                          path="system"
                          element={<SystemHealth />}
                        />
                        <Route
                          path="notifications"
                          element={<NotificationsPage />}
                        />
                        <Route
                          path="profile"
                          element={<AdminProfile />}
                        />
                      </Route>

{/* PROFILE - New Advanced User Profile */}
                      <Route
                        path="/profile"
                        element={
                          <RoleGate>
                            <ProtectedRoute>
                              <UserProfile />
                            </ProtectedRoute>
                          </RoleGate>
                        }
                      />

                      <Route
                        path="/settings"
                        element={
                          <RoleGate>
                            <ProtectedRoute>
                              <Settings />
                            </ProtectedRoute>
                          </RoleGate>
                        }
                      />

                      <Route
                        path="/help"
                        element={
                          <RoleGate>
                            <ProtectedRoute>
                              <Help />
                            </ProtectedRoute>
                          </RoleGate>
                        }
                      />

                      {/* OWNER */}
                      <Route
                        path="/owner"
                        element={<OwnerDashboard />}
                      />

                      {/* 404 */}
                      <Route
                        path="*"
                        element={
                          <RoleGate>
                            <NotFound />
                          </RoleGate>
                        }
                      />
                    </Routes>
                  </Suspense>
                </SplashController>
              </BrowserRouter>
            </CompareProvider>
          </WishlistProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;