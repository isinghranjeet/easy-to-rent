// src/admin/services/adminApi.ts
// Typed admin-specific API wrapper around the core ApiService

import { api } from '@/services/api';
import type {
  AdminUser,
  AdminPG,
  AdminBooking,
  AdminReview,
  DashboardStats,
  AnalyticsData as AdminAnalyticsData,
  SystemHealthStatus,
  NotificationAlert,
  AuditLog,
  ActivityEvent,
  PaginatedResponse,
  FilterState,
  PaginationParams,
  UserActivityLog,
  UserStats,
  AdminProfileUpdateData,
  AdminPasswordUpdateData,
} from '@/admin/types';

// Core ApiResponse shape from services/api.ts
interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

// ────────────────── Helper: build query string ──────────────────
function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (
      value === undefined ||
      value === null ||
      value === '' ||
      value === 'all'
    ) {
      return;
    }

    qs.append(key, String(value));
  });
  const str = qs.toString();
  return str ? `?${str}` : '';
}

function unwrap<T>(response: ApiResponse<T>): T {
  if (!response.success) {
    throw new Error(response.message || 'Request failed');
  }
  return response.data;
}

// ────────────────── Dashboard ──────────────────
export async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = (await api.getDashboardStats()) as ApiResponse<DashboardStats>;
  return unwrap(response);
}

// ────────────────── Live Activity ──────────────────
export async function fetchActivityFeed(limit = 50): Promise<ActivityEvent[]> {
  const response = (await api.request(`/api/admin/activity?limit=${limit}`)) as ApiResponse<ActivityEvent[]>;
  return unwrap(response) || [];
}

// ────────────────── Users ──────────────────
export async function fetchUsers(
  filters: FilterState,
  pagination: PaginationParams
): Promise<PaginatedResponse<AdminUser>> {
  const query = buildQuery({
    search: filters.search,
    status: filters.status,
    role: filters.role,
    page: pagination.page,
    limit: pagination.limit,
    sortBy: pagination.sortBy,
    sortOrder: pagination.sortOrder,
  });
  const response = (await api.request(`/api/admin/users${query}`)) as ApiResponse<{ items: AdminUser[]; total: number }>;
  const data = unwrap(response);
  return {
    items: data.items || [],
    total: data.total || 0,
    page: pagination.page,
    limit: pagination.limit,
    totalPages: Math.ceil((data.total || 0) / pagination.limit) || 1,
  };
}

export async function updateUser(userId: string, data: Partial<AdminUser>): Promise<AdminUser> {
  const response = (await api.updateUser(userId, data as Record<string, unknown>)) as ApiResponse<AdminUser>;
  return unwrap(response);
}

export async function updateUserStatus(userId: string, status: string): Promise<AdminUser> {
  const response = (await api.updateUserStatus(userId, status)) as ApiResponse<AdminUser>;
  return unwrap(response);
}

export async function deleteUser(userId: string): Promise<void> {
  const response = (await api.deleteUser(userId)) as ApiResponse<{ deletedId: string }>;
  unwrap(response);
}

export async function fetchUserBookings(userId: string): Promise<AdminBooking[]> {
  const response = (await api.request(`/api/admin/users/${userId}/bookings`)) as ApiResponse<AdminBooking[]>;
  return unwrap(response) || [];
}

export async function fetchUserActivity(userId: string, limit = 50): Promise<UserActivityLog[]> {
  const response = (await api.request(`/api/admin/users/${userId}/activity?limit=${limit}`)) as ApiResponse<{ activities: UserActivityLog[] }>;
  return unwrap(response)?.activities || [];
}

export async function fetchUserStats(userId: string): Promise<UserStats> {
  const response = (await api.request(`/api/users/${userId}/stats`)) as ApiResponse<UserStats>;
  return unwrap(response);
}

// ────────────────── Admin Profile ──────────────────
export async function fetchAdminProfile(): Promise<AdminUser> {
  const response = (await api.request('/api/admin/profile')) as ApiResponse<AdminUser>;
  return unwrap(response);
}

export async function updateAdminProfile(data: AdminProfileUpdateData): Promise<AdminUser> {
  const response = (await api.request('/api/admin/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  })) as ApiResponse<AdminUser>;
  return unwrap(response);
}

export async function updateAdminPassword(data: AdminPasswordUpdateData): Promise<void> {
  const response = (await api.request('/api/admin/profile/password', {
    method: 'PUT',
    body: JSON.stringify(data),
  })) as ApiResponse<null>;
  unwrap(response);
}

export async function fetchAdminOwnActivity(limit = 50): Promise<UserActivityLog[]> {
  const response = (await api.request(`/api/admin/profile/activity?limit=${limit}`)) as ApiResponse<UserActivityLog[]>;
  return unwrap(response) || [];
}

// ────────────────── PGs ──────────────────
export async function fetchPGs(
  filters: FilterState,
  pagination: PaginationParams
): Promise<PaginatedResponse<AdminPG>> {
  const query = buildQuery({
    search: filters.search,
    status: filters.status,
    city: filters.city,
    type: filters.type,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    page: pagination.page,
    limit: pagination.limit,
    sort: pagination.sortBy ? `${pagination.sortOrder === 'asc' ? '' : '-'}${pagination.sortBy}` : undefined,
  });
  const response = (await api.request(`/api/admin/pgs${query}`)) as ApiResponse<{ items: AdminPG[]; total: number }>;
  const data = unwrap(response);
  return {
    items: data.items || [],
    total: data.total || 0,
    page: pagination.page,
    limit: pagination.limit,
    totalPages: Math.ceil((data.total || 0) / pagination.limit) || 1,
  };
}

export async function verifyPG(pgId: string, verified: boolean): Promise<AdminPG> {
  const response = (await api.request(`/api/admin/pgs/${pgId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ field: 'verified', value: verified }),
  })) as ApiResponse<AdminPG>;
  return unwrap(response);
}

export async function featurePG(pgId: string, featured: boolean): Promise<AdminPG> {
  const response = (await api.request(`/api/admin/pgs/${pgId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ field: 'featured', value: featured }),
  })) as ApiResponse<AdminPG>;
  return unwrap(response);
}

export async function adminRecommendPG(pgId: string, adminRecommended: boolean): Promise<AdminPG> {
  const response = (await api.request(`/api/admin/pgs/${pgId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ field: 'adminRecommended', value: adminRecommended }),
  })) as ApiResponse<AdminPG>;
  return unwrap(response);
}

export async function updatePG(pgId: string, data: Partial<AdminPG>): Promise<AdminPG> {
  const response = (await api.updatePGListing(pgId, data as Record<string, unknown>)) as ApiResponse<AdminPG>;
  return unwrap(response);
}

export async function deletePG(pgId: string): Promise<void> {
  const response = (await api.deletePGListing(pgId)) as ApiResponse<{ id: string }>;
  unwrap(response);
}

// ────────────────── Bookings ──────────────────
export async function fetchBookings(
  filters: FilterState,
  pagination: PaginationParams
): Promise<PaginatedResponse<AdminBooking>> {
  const query = buildQuery({
    search: filters.search,
    status: filters.status,
    page: pagination.page,
    limit: pagination.limit,
    sort: pagination.sortBy ? `${pagination.sortOrder === 'asc' ? '' : '-'}${pagination.sortBy}` : undefined,
  });
  const response = (await api.request(`/api/bookings${query}`)) as ApiResponse<{ items: AdminBooking[]; total: number; page: number; pages: number }>;
  const data = unwrap(response);
  return {
    items: data.items || [],
    total: data.total || 0,
    page: data.page || pagination.page,
    limit: pagination.limit,
    totalPages: data.pages || Math.ceil((data.total || 0) / pagination.limit) || 1,
  };
}

export async function updateBookingStatus(
  bookingId: string,
  status: string,
  notes?: string
): Promise<AdminBooking> {
  const response = (await api.request(`/api/bookings/${bookingId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, notes }),
  })) as ApiResponse<AdminBooking>;
  return unwrap(response);
}

export async function cancelBookingAdmin(bookingId: string, reason?: string): Promise<AdminBooking> {
  const response = (await api.cancelBooking(bookingId, reason)) as unknown as ApiResponse<AdminBooking>;
  return unwrap(response);
}

// ────────────────── Reviews ──────────────────
export async function fetchReviews(
  status: string,
  pagination: PaginationParams
): Promise<PaginatedResponse<AdminReview>> {
  const query = buildQuery({
    status,
    page: pagination.page,
    limit: pagination.limit,
    sort: pagination.sortBy ? `${pagination.sortOrder === 'asc' ? '' : '-'}${pagination.sortBy}` : undefined,
  });
  const response = (await api.request(`/api/reviews/admin/all${query}`)) as ApiResponse<{
    items: AdminReview[];
    pagination: { page: number; limit: number; total: number; pages: number };
  }>;
  const data = unwrap(response);
  return {
    items: data.items || [],
    total: data.pagination?.total || 0,
    page: data.pagination?.page || pagination.page,
    limit: data.pagination?.limit || pagination.limit,
    totalPages: data.pagination?.pages || Math.ceil((data.pagination?.total || 0) / pagination.limit) || 1,
  };
}

export async function fetchReviewStats(): Promise<{ pending: number; approved: number; rejected: number; total: number }> {
  const response = (await api.request('/api/reviews/admin/stats')) as ApiResponse<{ stats: { pending: number; approved: number; rejected: number; total: number } }>;
  const data = unwrap(response);
  return data.stats || { pending: 0, approved: 0, rejected: 0, total: 0 };
}

export async function fetchPendingReviews(): Promise<AdminReview[]> {
  const response = (await api.request('/api/reviews/admin/pending')) as ApiResponse<AdminReview[]>;
  return unwrap(response) || [];
}

export async function approveReview(reviewId: string): Promise<void> {
  const response = (await api.request(`/api/reviews/admin/${reviewId}/approve`, { method: 'PUT' })) as ApiResponse<null>;
  unwrap(response);
}

export async function rejectReview(reviewId: string, reason?: string): Promise<void> {
  const response = (await api.request(`/api/reviews/admin/${reviewId}/reject`, {
    method: 'PUT',
    body: JSON.stringify({ reason }),
  })) as ApiResponse<null>;
  unwrap(response);
}

export async function deleteReview(reviewId: string): Promise<void> {
  const response = (await api.deleteReview(reviewId)) as ApiResponse<{ message: string }>;
  unwrap(response);
}

export async function flagReview(reviewId: string, reason: string): Promise<AdminReview> {
  const response = (await api.request(`/api/reviews/admin/${reviewId}/flag`, {
    method: 'PUT',
    body: JSON.stringify({ reason }),
  })) as ApiResponse<AdminReview>;
  return unwrap(response);
}

// ────────────────── Analytics ──────────────────
export async function fetchAnalytics(): Promise<AdminAnalyticsData> {
  const response = (await api.getAnalytics()) as unknown as ApiResponse<AdminAnalyticsData>;
  return unwrap(response);
}

// ────────────────── System Health ──────────────────
export async function fetchSystemHealth(): Promise<SystemHealthStatus> {
  const response = (await api.request('/api/admin/system/health')) as ApiResponse<SystemHealthStatus>;
  return unwrap(response);
}

export async function fetchErrorLogs(limit = 50): Promise<unknown[]> {
  const response = (await api.request(`/api/admin/system/errors?limit=${limit}`)) as ApiResponse<unknown[]>;
  return unwrap(response) || [];
}

// ────────────────── Notifications ──────────────────
export async function fetchNotifications(): Promise<NotificationAlert[]> {
  const response = (await api.request('/api/admin/notifications')) as ApiResponse<NotificationAlert[]>;
  return unwrap(response) || [];
}

export async function acknowledgeNotification(notificationId: string): Promise<void> {
  const response = (await api.request(`/api/admin/notifications/${notificationId}/acknowledge`, {
    method: 'PUT',
  })) as ApiResponse<null>;
  unwrap(response);
}

// ────────────────── Offer Email ──────────────────
export async function sendOfferEmail(
  userId: string,
  pgId: string,
  offerMessage: string,
  discount?: number
): Promise<{ sent: boolean; userId: string; pgId: string }> {
  const response = (await api.request('/api/admin/send-offer-email', {
    method: 'POST',
    body: JSON.stringify({ userId, pgId, offerMessage, discount }),
  })) as ApiResponse<{ sent: boolean; userId: string; pgId: string }>;
  return unwrap(response);
}

// ────────────────── Audit Logs ──────────────────
export async function fetchAuditLogs(
  pagination: PaginationParams
): Promise<PaginatedResponse<AuditLog>> {
  const query = buildQuery({
    page: pagination.page,
    limit: pagination.limit,
    sortBy: pagination.sortBy || 'createdAt',
    sortOrder: pagination.sortOrder || 'desc',
  });
  const response = (await api.request(`/api/admin/audit-logs${query}`)) as ApiResponse<{ items: AuditLog[]; total: number }>;
  const data = unwrap(response);
  return {
    items: data.items || [],
    total: data.total || 0,
    page: pagination.page,
    limit: pagination.limit,
    totalPages: Math.ceil((data.total || 0) / pagination.limit) || 1,
  };
}

