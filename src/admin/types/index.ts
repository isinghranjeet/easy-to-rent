// src/admin/types/index.ts
// Centralized TypeScript interfaces for the Admin Dashboard

import type { User, PGListing, Booking, Review } from '@/services/api';

// ────────────────── Re-exports for convenience ──────────────────
export type { User, PGListing, Booking, Review };

// ────────────────── Role & Permissions ──────────────────
export type AdminRole = 'admin' | 'moderator' | 'owner' | 'user';

export type Permission =
  | 'dashboard:view'
  | 'users:view' | 'users:manage' | 'users:delete'
  | 'pgs:view' | 'pgs:manage' | 'pgs:delete'
  | 'bookings:view' | 'bookings:manage'
  | 'reviews:view' | 'reviews:moderate'
  | 'analytics:view'
  | 'system:view'
  | 'notifications:view'
  | 'settings:manage';

export interface RBACConfig {
  [role: string]: Permission[];
}

// ────────────────── Dashboard KPIs ──────────────────
export interface KPIData {
  label: string;
  value: number | string;
  change?: number; // percentage change
  changeType?: 'up' | 'down' | 'neutral';
  icon?: string;
  color?: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalPGs: number;
  totalBookings: number;
  totalRevenue: number;
  activeListings: number;
  pendingApprovals: number;
  suspendedUsers: number;
  featuredPGs: number;
  newUsersToday: number;
  newPGsToday: number;
  bookingsToday: number;
  revenueToday: number;
}

// ────────────────── Live Activity ──────────────────
export type ActivityEventType =
  | 'pg_created'
  | 'booking_created'
  | 'payment_success'
  | 'payment_failure'
  | 'user_signup'
  | 'review_submitted'
  | 'review_approved'
  | 'review_rejected'
  | 'user_suspended'
  | 'pg_featured'
  | 'pg_verified'
  | 'system_alert';

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  message: string;
  userId?: string;
  userName?: string;
  targetId?: string;
  targetName?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
  read: boolean;
}

// ────────────────── Admin User Extensions ──────────────────
export interface AdminUser extends User {
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: string;
  location?: {
    city: string;
    state: string;
    country: string;
    timezone: string;
    address?: string;
    pincode?: string;
  };
  phone?: string;
  bookingCount?: number;
  reviewCount?: number;
}

// ────────────────── User Activity Log ──────────────────
export interface UserActivityLog {
  _id: string;
  action: string;
  userName?: string;
  userRole?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
  status: 'success' | 'failed';
  timestamp: string;
}

// ────────────────── User Stats ──────────────────
export interface UserRecentBooking {
  _id: string;
  pgName: string;
  city: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

export interface UserStats {
  user: { _id: string; name: string; email: string };
  bookingCount: number;
  reviewCount: number;
  recentBookings: UserRecentBooking[];
}

// ────────────────── Admin Profile Update ──────────────────
export interface AdminProfileUpdateData {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
}

export interface AdminPasswordUpdateData {
  currentPassword: string;
  newPassword: string;
}

// ────────────────── Admin PG Extensions ──────────────────
export interface AdminPG extends PGListing {
  views: number;
  weeklyBookings: number;
  monthlyBookings: number;
  revenue: number;
  ownerEmail?: string;
  createdAt: string;
  updatedAt?: string;
  adminRecommended?: boolean;
}

// ────────────────── Admin Booking Extensions ──────────────────
export interface AdminBooking extends Booking {
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  pgName?: string;
  pgCity?: string;
  pgImage?: string;
  adminNotes?: string;
}

// ────────────────── Admin Review Extensions ──────────────────
export interface AdminReview extends Review {
  pgName?: string;
  pgCity?: string;
  userEmail?: string;
  status: 'pending' | 'approved' | 'rejected';
  moderatorNote?: string;
  flagged?: boolean;
  flagReason?: string;
}

// ────────────────── Analytics ──────────────────
export interface MonthlyRevenue {
  month: string;
  revenue: number;
  bookings: number;
}

export interface BookingTrend {
  date: string;
  count: number;
  status: string;
}

export interface CityDistribution {
  city: string;
  count: number;
  percentage: number;
}

export interface MostViewedPG {
  pgId: string;
  name: string;
  city: string;
  views: number;
  bookings: number;
  conversionRate: number;
}

export interface AnalyticsData {
  monthlyRevenue: MonthlyRevenue[];
  bookingTrends: BookingTrend[];
  cityDistribution: CityDistribution[];
  mostViewedPGs: MostViewedPG[];
  conversionRate: number;
  totalViews: number;
  totalBookings: number;
}

// ────────────────── System Health ──────────────────
export type APIStatus = 'healthy' | 'degraded' | 'down';

export interface APIHealth {
  endpoint: string;
  status: APIStatus;
  responseTime: number;
  lastChecked: string;
  errorRate: number;
}

export interface ErrorLog {
  id: string;
  timestamp: string;
  endpoint: string;
  method: string;
  statusCode: number;
  message: string;
  stack?: string;
  userAgent?: string;
}

export interface SystemHealthStatus {
  overall: APIStatus;
  uptime: number; // percentage
  apiHealth: APIHealth[];
  errorLogs: ErrorLog[];
  cacheHitRatio: number;
  slowEndpoints: APIHealth[];
  serverLoad: {
    cpu: number;
    memory: number;
    disk: number;
  };
}

// ────────────────── Notifications ──────────────────
export type NotificationSeverity = 'info' | 'warning' | 'critical';

export interface NotificationAlert {
  id: string;
  title: string;
  message: string;
  severity: NotificationSeverity;
  category: 'high_traffic' | 'payment_failure' | 'low_booking' | 'system_error' | 'new_signup' | 'review_flagged';
  targetId?: string;
  targetType?: string;
  acknowledged: boolean;
  createdAt: string;
}

// ────────────────── Audit Logs ──────────────────
export interface AuditLog {
  _id: string;
  action: string;
  userId: string;
  userName: string;
  userRole: string;
  targetType: 'user' | 'pg' | 'booking' | 'review' | 'system';
  targetId?: string;
  targetName?: string;
  details: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed';
  createdAt: string;
}

// ────────────────── Table & Pagination ──────────────────
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilterState {
  search: string;
  status: string;
  role?: string;
  city?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
}

// ────────────────── Chart Data ──────────────────
export interface ChartDataset {
  label: string;
  data: number[];
  color?: string;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

