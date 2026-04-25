// src/admin/utils/rbacHelpers.ts
// Role-Based Access Control helpers

import type { AdminRole, Permission } from '@/admin/types';

export const ROLE_HIERARCHY: Record<AdminRole, number> = {
  admin: 100,
  moderator: 50,
  owner: 30,
  user: 10,
};

export const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  admin: [
    'dashboard:view',
    'users:view', 'users:manage', 'users:delete',
    'pgs:view', 'pgs:manage', 'pgs:delete',
    'bookings:view', 'bookings:manage',
    'reviews:view', 'reviews:moderate',
    'analytics:view',
    'system:view',
    'notifications:view',
    'settings:manage',
  ],
  moderator: [
    'dashboard:view',
    'users:view',
    'pgs:view', 'pgs:manage',
    'bookings:view', 'bookings:manage',
    'reviews:view', 'reviews:moderate',
    'notifications:view',
  ],
  owner: [
    'dashboard:view',
    'pgs:view', 'pgs:manage',
    'bookings:view', 'bookings:manage',
    'reviews:view',
    'notifications:view',
  ],
  user: [
    'dashboard:view',
    'bookings:view',
    'notifications:view',
  ],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: AdminRole | string, permission: Permission): boolean {
  const normalizedRole = (role as AdminRole) || 'user';
  const permissions = ROLE_PERMISSIONS[normalizedRole] || [];
  return permissions.includes(permission);
}

/**
 * Check if a role has any of the given permissions
 */
export function hasAnyPermission(role: AdminRole | string, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

/**
 * Check if a role has all of the given permissions
 */
export function hasAllPermissions(role: AdminRole | string, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: AdminRole | string): Permission[] {
  const normalizedRole = (role as AdminRole) || 'user';
  return ROLE_PERMISSIONS[normalizedRole] || [];
}

/**
 * Check if roleA outranks roleB
 */
export function outranks(roleA: AdminRole | string, roleB: AdminRole | string): boolean {
  const rankA = ROLE_HIERARCHY[(roleA as AdminRole) || 'user'] || 0;
  const rankB = ROLE_HIERARCHY[(roleB as AdminRole) || 'user'] || 0;
  return rankA > rankB;
}

/**
 * Check if a user can manage another user based on roles
 */
export function canManageUser(managerRole: AdminRole | string, targetRole: AdminRole | string): boolean {
  // Admins can manage everyone
  if (managerRole === 'admin') return true;
  // Cannot manage same or higher rank
  return outranks(managerRole, targetRole);
}

/**
 * Permission guard hook helper
 * Returns a checker function for the current role
 */
export function createPermissionChecker(role: AdminRole | string) {
  return {
    can: (permission: Permission) => hasPermission(role, permission),
    canAny: (permissions: Permission[]) => hasAnyPermission(role, permissions),
    canAll: (permissions: Permission[]) => hasAllPermissions(role, permissions),
    canManage: (targetRole: AdminRole | string) => canManageUser(role, targetRole),
    isAdmin: () => role === 'admin',
    isModeratorOrAbove: () => hasPermission(role, 'reviews:moderate'),
  };
}

