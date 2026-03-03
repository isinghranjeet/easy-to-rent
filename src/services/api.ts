/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/api.ts

const API_BASE_URL = 'http://localhost:10000';

// ────────────────────── Types ──────────────────────
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'owner';
  phone?: string;
  status?: string;
  profileImage?: string;
  bio?: string;
  lastLogin?: string;
  createdAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'user' | 'owner';
}

export interface PGListing {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  city: string;
  locality?: string;
  address: string;
  distance?: string;
  price: number;
  type: 'boys' | 'girls' | 'co-ed' | 'family';
  images: string[];
  gallery?: string[];
  amenities: string[];
  roomTypes?: string[];
  published: boolean;
  verified: boolean;
  featured: boolean;
  rating: number;
  reviewCount: number;
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  ownerId?: string;
  contactPhone?: string;
  contactEmail?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

// ────────────────────── Service ──────────────────────
export class ApiService {
  private token: string | null = null;
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // ── Token management ──
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // ── Generic request ──
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const config: RequestInit = {
      ...options,
      headers,
      mode: 'cors',
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Dispatch an unauthorized event for 401s
        if (response.status === 401) {
          this.clearToken();
          window.dispatchEvent(new Event('unauthorized'));
        }
        throw new Error(data.message || data.error || 'Request failed');
      }

      return data as T;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // ────────────────── Auth Endpoints ──────────────────

  /**
   * POST /api/auth/login
   * Backend response: { success, message, data: { _id, name, email, role, phone, token, lastLogin } }
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.request<ApiResponse<any>>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data) {
      const { token, ...userData } = response.data;
      this.setToken(token);
      return {
        success: true,
        message: response.message,
        data: {
          token,
          user: userData as User,
        },
      };
    }

    throw new Error(response.message || 'Login failed');
  }

  /**
   * POST /api/auth/register
   * Backend response: { success, message, data: { _id, name, email, role, phone, token } }
   */
  async register(credentials: RegisterCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.request<ApiResponse<any>>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data) {
      const { token, ...userData } = response.data;
      this.setToken(token);
      return {
        success: true,
        message: response.message,
        data: {
          token,
          user: userData as User,
        },
      };
    }

    throw new Error(response.message || 'Registration failed');
  }

  /**
   * GET /api/auth/profile  (protected)
   * Uses the stored JWT to fetch the current user's profile.
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>('/api/auth/profile');
  }

  /**
   * Logout — clear token locally (no backend call needed).
   */
  async logout(): Promise<void> {
    this.clearToken();
  }

  // ────────────────── Wishlist Endpoints (server-synced) ──────────────────

  /** GET /api/auth/wishlist */
  async getWishlist(): Promise<ApiResponse<string[]>> {
    return this.request<ApiResponse<string[]>>('/api/wishlist');
  }

  /** POST /api/wishlist/:pgId */
  async addToWishlist(pgId: string): Promise<ApiResponse<string[]>> {
    return this.request<ApiResponse<string[]>>(`/api/wishlist/${pgId}`, {
      method: 'POST',
    });
  }

  /** DELETE /api/wishlist/:pgId */
  async removeFromWishlist(pgId: string): Promise<ApiResponse<string[]>> {
    return this.request<ApiResponse<string[]>>(`/api/wishlist/${pgId}`, {
      method: 'DELETE',
    });
  }

  // ────────────────── Admin Endpoints ──────────────────

  /** GET /api/auth/users (admin only) */
  async getAllUsers(): Promise<ApiResponse<{ count: number; items: User[] }>> {
    return this.request<ApiResponse<{ count: number; items: User[] }>>('/api/auth/users');
  }

  /** GET /api/auth/users/:id (admin only) */
  async getUserById(id: string): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>(`/api/auth/users/${id}`);
  }

  /** DELETE /api/auth/users/:id (admin only) */
  async deleteUser(id: string): Promise<ApiResponse<{ deletedId: string }>> {
    return this.request<ApiResponse<{ deletedId: string }>>(`/api/auth/users/${id}`, {
      method: 'DELETE',
    });
  }

  /** PUT /api/auth/users/:id/status (admin only) */
  async updateUserStatus(id: string, status: string): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>(`/api/auth/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // ────────────────── Owner / PG Endpoints ──────────────────

  /** GET /api/pg/my-listings (owner's own listings) */
  async getMyListings(): Promise<ApiResponse<{ items: PGListing[]; total: number }>> {
    return this.request<ApiResponse<{ items: PGListing[]; total: number }>>('/api/pg/my-listings');
  }

  /** POST /api/pg (create new PG listing) */
  async createPGListing(data: Partial<PGListing>): Promise<ApiResponse<PGListing>> {
    return this.request<ApiResponse<PGListing>>('/api/pg', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /** PUT /api/pg/:id (update PG listing) */
  async updatePGListing(id: string, data: Partial<PGListing>): Promise<ApiResponse<PGListing>> {
    return this.request<ApiResponse<PGListing>>(`/api/pg/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /** DELETE /api/pg/:id */
  async deletePGListing(id: string): Promise<ApiResponse<{ id: string }>> {
    return this.request<ApiResponse<{ id: string }>>(`/api/pg/${id}`, {
      method: 'DELETE',
    });
  }

  // ────────────────── Utility ──────────────────

  async testConnection() {
    const testEndpoints = ['/api/health', '/health', '/'];
    for (const endpoint of testEndpoints) {
      try {
        const response = await fetch(`${this.baseURL}${endpoint}`);
        if (response.ok) {
          const data = await response.json();
          return { success: true, endpoint, data };
        }
      } catch {
        // continue
      }
    }
    return { success: false, message: 'Could not connect to API' };
  }
}

export const api = new ApiService();