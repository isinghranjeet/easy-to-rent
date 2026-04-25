// src/admin/utils/formatters.ts
// Date, currency, number, and status formatters

import { format, formatDistanceToNow, parseISO } from 'date-fns';

// ────────────────── Currency ──────────────────
export const formatCurrency = (amount: number, compact = false): string => {
  if (compact && amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (compact && amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatCompactNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

// ────────────────── Dates ──────────────────
export const formatDate = (date: string | Date, pattern = 'dd MMM yyyy'): string => {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, pattern);
  } catch {
    return '—';
  }
};

export const formatDateTime = (date: string | Date): string => {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'dd MMM yyyy, hh:mm a');
  } catch {
    return '—';
  }
};

export const formatRelativeTime = (date: string | Date): string => {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return '—';
  }
};

export const formatTimeAgo = (date: string | Date): string => {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(date);
  } catch {
    return '—';
  }
};

// ────────────────── Percentage / Trend ──────────────────
export const formatPercentage = (value: number, decimals = 1): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
};

export const calculateTrend = (current: number, previous: number): { value: number; type: 'up' | 'down' | 'neutral' } => {
  if (previous === 0) return { value: current > 0 ? 100 : 0, type: current > 0 ? 'up' : 'neutral' };
  const change = ((current - previous) / previous) * 100;
  if (Math.abs(change) < 0.1) return { value: 0, type: 'neutral' };
  return { value: Math.abs(change), type: change >= 0 ? 'up' : 'down' };
};

// ────────────────── Status Colors (Tailwind classes) ──────────────────
export const getStatusColor = (status: string): { bg: string; text: string; border: string } => {
  const safeStatus = status || 'unknown';
  const map: Record<string, { bg: string; text: string; border: string }> = {
    active: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    inactive: { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200' },
    suspended: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
    pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    rejected: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
    confirmed: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    completed: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    cancelled: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
    paid: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    failed: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
    refunded: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    processing: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    live: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    draft: { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200' },
    featured: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    verified: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    healthy: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    degraded: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    down: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
    info: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    warning: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    critical: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  };
  return map[safeStatus.toLowerCase()] || { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200' };
};

// ────────────────── Role Colors ──────────────────
export const getRoleColor = (role: string): { bg: string; text: string; border: string } => {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    admin: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
    moderator: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' },
    owner: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
    user: { bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-200' },
  };
  return map[role.toLowerCase()] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };
};

// ────────────────── Activity Event Colors ──────────────────
export const getActivityColor = (type: string): { bg: string; text: string; icon: string } => {
  const map: Record<string, { bg: string; text: string; icon: string }> = {
    pg_created: { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'Home' },
    booking_created: { bg: 'bg-purple-50', text: 'text-purple-700', icon: 'Calendar' },
    payment_success: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'CreditCard' },
    payment_failure: { bg: 'bg-red-50', text: 'text-red-700', icon: 'AlertTriangle' },
    user_signup: { bg: 'bg-sky-50', text: 'text-sky-700', icon: 'UserPlus' },
    review_submitted: { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: 'Star' },
    review_approved: { bg: 'bg-green-50', text: 'text-green-700', icon: 'CheckCircle' },
    review_rejected: { bg: 'bg-red-50', text: 'text-red-700', icon: 'XCircle' },
    user_suspended: { bg: 'bg-red-50', text: 'text-red-700', icon: 'ShieldOff' },
    pg_featured: { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: 'Award' },
    pg_verified: { bg: 'bg-green-50', text: 'text-green-700', icon: 'ShieldCheck' },
    system_alert: { bg: 'bg-orange-50', text: 'text-orange-700', icon: 'AlertOctagon' },
  };
  return map[type] || { bg: 'bg-gray-50', text: 'text-gray-600', icon: 'Activity' };
};

