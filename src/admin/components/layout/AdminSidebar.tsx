import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Home,
  CalendarDays,
  Star,
  BarChart3,
  Activity,
  Bell,
  ChevronLeft,
  ChevronRight,
  Shield,
  UserCircle,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createPermissionChecker } from '@/admin/utils/rbacHelpers';

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
  permissions: string[];
  badge?: number;
}

const navItems: NavItem[] = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', permissions: ['dashboard:view'] },
  { to: '/admin/users', icon: Users, label: 'Users', permissions: ['users:view'] },
  { to: '/admin/pgs', icon: Home, label: 'PG Listings', permissions: ['pgs:view'] },
  { to: '/admin/bookings', icon: CalendarDays, label: 'Bookings', permissions: ['bookings:view'] },
  { to: '/admin/reviews', icon: Star, label: 'Reviews', permissions: ['reviews:view'] },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics', permissions: ['analytics:view'] },
  { to: '/admin/system', icon: Activity, label: 'System Health', permissions: ['system:view'] },
  { to: '/admin/notifications', icon: Bell, label: 'Notifications', permissions: ['notifications:view'] },
  { to: '/admin/profile', icon: UserCircle, label: 'Profile', permissions: ['dashboard:view'] },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const { user } = useAuth();
  const location = useLocation();
  const checker = createPermissionChecker(user?.role || 'user');
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredNav = navItems.filter((item) => checker.canAny(item.permissions as never));

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-xl shadow-lg border border-gray-200/60 dark:border-gray-800/60"
      >
        <Zap className="h-5 w-5 text-purple-600" />
      </button>

      <motion.aside
        className={cn(
          'fixed lg:sticky top-0 left-0 h-screen bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border-r border-gray-200/60 dark:border-gray-800/60 z-40 flex flex-col shadow-sm',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        initial={false}
        animate={{ width: collapsed ? 80 : 256 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Logo area */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200/60 dark:border-gray-800/60">
          <motion.div
            className="flex items-center gap-3 overflow-hidden"
            layout
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-500 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/20">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="whitespace-nowrap"
                >
                  <p className="font-bold text-gray-900 dark:text-white text-sm tracking-tight">Admin Center</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase">EasyToRent</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          <motion.button
            onClick={onToggle}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {collapsed ? (
                <motion.div
                  key="right"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="h-4 w-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="left"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {filteredNav.map((item, index) => {
            const isActive =
              item.to === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.to);
            return (
              <motion.div
                key={item.to}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <NavLink
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group',
                    isActive
                      ? 'bg-gradient-to-r from-purple-500/10 to-indigo-500/5 text-purple-700 dark:text-purple-300 shadow-sm shadow-purple-500/10'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white',
                    collapsed && 'justify-center'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  {/* Active indicator glow */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <item.icon className={cn(
                    'h-5 w-5 flex-shrink-0 transition-colors',
                    isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                  )} />
                  <AnimatePresence mode="wait">
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="truncate flex-1 whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {!collapsed && item.badge ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm"
                    >
                      {item.badge}
                    </motion.span>
                  ) : null}
                </NavLink>
              </motion.div>
            );
          })}
        </nav>

        {/* Bottom: user mini profile */}
        <div className="p-3 border-t border-gray-200/60 dark:border-gray-800/60">
          <motion.div
            className={cn(
              'flex items-center gap-3 p-2 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-800/30',
              collapsed && 'justify-center'
            )}
            layout
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md shadow-purple-500/20">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="overflow-hidden"
                >
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {user?.name || 'Admin'}
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 capitalize font-medium">
                    {user?.role || 'admin'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.aside>
    </>
  );
}
