// /* eslint-disable @typescript-eslint/no-explicit-any */
// // src/services/api.ts

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://eassy-to-rent-backend.onrender.com';

// // ────────────────────── Types ──────────────────────
// export interface User {
//   _id: string;
//   name: string;
//   email: string;
//   role: 'user' | 'admin' | 'owner';
//   phone?: string;
//   status?: string;
//   profileImage?: string;
//   bio?: string;
//   lastLogin?: string;
//   createdAt?: string;
// }

// export interface LoginCredentials {
//   email: string;
//   password: string;
// }

// export interface RegisterCredentials {
//   name: string;
//   email: string;
//   password: string;
//   phone?: string;
//   role?: 'user' | 'owner';
// }

// export interface PGListing {
//   _id: string;
//   name: string;
//   slug?: string;
//   description?: string;
//   city: string;
//   locality?: string;
//   address: string;
//   distance?: string;
//   price: number;
//   type: 'boys' | 'girls' | 'co-ed' | 'family';
//   images: string[];
//   gallery?: string[];
//   amenities: string[];
//   roomTypes?: string[];
//   published: boolean;
//   verified: boolean;
//   featured: boolean;
//   rating: number;
//   reviewCount: number;
//   ownerName?: string;
//   ownerPhone?: string;
//   ownerEmail?: string;
//   ownerId?: string;
//   contactPhone?: string;
//   contactEmail?: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

// interface ApiResponse<T = any> {
//   success: boolean;
//   message: string;
//   data: T;
// }

// // ────────────────────── Service ──────────────────────
// export class ApiService {
//   private token: string | null = null;
//   public baseURL: string;

//   constructor() {
//     this.baseURL = API_BASE_URL;
//   }

//   // ── Token management ──
//   setToken(token: string) {
//     this.token = token;
//     localStorage.setItem('auth_token', token);
//   }

//   getToken(): string | null {
//     if (!this.token) {
//       this.token = localStorage.getItem('auth_token');
//     }
//     return this.token;
//   }

//   clearToken() {
//     this.token = null;
//     localStorage.removeItem('auth_token');
//   }

//   // ── Generic request ──
//   public async request<T>(
//     endpoint: string,
//     options: RequestInit = {}
//   ): Promise<T> {
//     const url = `${this.baseURL}${endpoint}`;
//     const token = this.getToken();

//     const isFormData = options.body instanceof FormData;

//     const headers: HeadersInit = {
//       ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
//       'Accept': 'application/json',
//       ...(token && { Authorization: `Bearer ${token}` }),
//       ...options.headers,
//     };

//     const config: RequestInit = {
//       method: 'GET', // Default method
//       ...options,
//       headers,
//       mode: 'cors',
//     };

//     const method = config.method;
//     console.log(`🌐 [API_REQUEST] ${method} ${url}`);
//     if (isFormData) {
//       console.log('📦 [API_REQUEST] Body is FormData');
//       for (const [key, value] of (options.body as FormData).entries()) {
//         console.log(`   - ${key}:`, value instanceof File ? `File (${value.name}, ${value.size} bytes)` : value);
//       }
//     }

//     try {
//       const response = await fetch(url, config);
      
//       // Handle non-JSON responses or empty bodies
//       const contentType = response.headers.get('content-type');
//       let data: any = {};
      
//       if (contentType && contentType.includes('application/json')) {
//         data = await response.json();
//       } else {
//         const text = await response.text();
//         data = { message: text || 'No response body' };
//       }

//       if (!response.ok) {
//         console.warn(`⚠️ [API_ERROR] ${response.status} ${response.statusText} for ${method} ${url}`);
//         // Dispatch an unauthorized event for 401s
//         if (response.status === 401) {
//           this.clearToken();
//           window.dispatchEvent(new Event('unauthorized'));
//         }
//         const error: any = new Error(data.message || data.error || `Request failed with status ${response.status}`);
//         error.status = response.status;
//         error.errors = data.errors; // Capture detailed validation errors
//         throw error;
//       }

//       return data as T;
//     } catch (error: any) {
//       console.error(`❌ [API_FAILURE] ${method} ${url}:`, error.message);
//       throw error;
//     }
//   }

//   // ────────────────── Auth Endpoints ──────────────────

//   /**
//    * POST /api/auth/login
//    * Backend response: { success, message, data: { _id, name, email, role, phone, token, lastLogin } }
//    */
//   async login(credentials: LoginCredentials): Promise<ApiResponse<any>> {
//     const response = await this.request<ApiResponse<any>>('/api/auth/login', {
//       method: 'POST',
//       body: JSON.stringify(credentials),
//     });

//     if (response.success && response.data) {
//       // If OTP is required, return the response without storing token
//       if (response.data.requireOtp) {
//         return {
//           success: true,
//           message: response.message,
//           data: { requireOtp: true, email: response.data.email },
//         };
//       }

//       const { token, ...userData } = response.data;
//       this.setToken(token);
//       return {
//         success: true,
//         message: response.message,
//         data: {
//           token,
//           user: userData as User,
//         },
//       };
//     }

//     throw new Error(response.message || 'Login failed');
//   }

//   async verifyLoginOtp(email: string, otp: string): Promise<ApiResponse<{ user: User; token: string }>> {
//     const response = await this.request<ApiResponse<any>>('/api/auth/verify-login-otp', {
//       method: 'POST',
//       body: JSON.stringify({ email, otp }),
//     });

//     if (response.success && response.data) {
//       const { token, ...userData } = response.data;
//       this.setToken(token);
//       return {
//         success: true,
//         message: response.message,
//         data: {
//           token,
//           user: userData as User,
//         },
//       };
//     }

//     throw new Error(response.message || 'OTP verification failed');
//   }

//   async forgotPassword(email: string): Promise<ApiResponse<{ email: string }>> {
//     return this.request<ApiResponse<{ email: string }>>('/api/auth/forgot-password', {
//       method: 'POST',
//       body: JSON.stringify({ email }),
//     });
//   }

//   async resetPassword(email: string, otp: string, newPassword: string): Promise<ApiResponse<{ email: string }>> {
//     return this.request<ApiResponse<{ email: string }>>('/api/auth/reset-password', {
//       method: 'POST',
//       body: JSON.stringify({ email, otp, newPassword }),
//     });
//   }

//   /**
//    * POST /api/auth/register
//    * Backend response: { success, message, data: { _id, name, email, role, phone, token } }
//    */
//   async register(credentials: RegisterCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
//     const response = await this.request<ApiResponse<any>>('/api/auth/register', {
//       method: 'POST',
//       body: JSON.stringify(credentials),
//     });

//     if (response.success && response.data) {
//       const { token, ...userData } = response.data;
//       this.setToken(token);
//       return {
//         success: true,
//         message: response.message,
//         data: {
//           token,
//           user: userData as User,
//         },
//       };
//     }

//     throw new Error(response.message || 'Registration failed');
//   }

//   /**
//    * GET /api/auth/profile  (protected)
//    * Uses the stored JWT to fetch the current user's profile.
//    */
//   async getCurrentUser(): Promise<ApiResponse<User>> {
//     return this.request<ApiResponse<User>>('/api/auth/profile');
//   }

//   /**
//    * Logout — clear token locally (no backend call needed).
//    */
//   async logout(): Promise<void> {
//     this.clearToken();
//   }

//   // ────────────────── Wishlist Endpoints (server-synced) ──────────────────

//   /** GET /api/auth/wishlist */
//   async getWishlist(): Promise<ApiResponse<string[]>> {
//     return this.request<ApiResponse<string[]>>('/api/wishlist');
//   }

//   /** POST /api/wishlist/:pgId */
//   async addToWishlist(pgId: string): Promise<ApiResponse<string[]>> {
//     return this.request<ApiResponse<string[]>>(`/api/wishlist/${pgId}`, {
//       method: 'POST',
//     });
//   }

//   /** DELETE /api/wishlist/:pgId */
//   async removeFromWishlist(pgId: string): Promise<ApiResponse<string[]>> {
//     return this.request<ApiResponse<string[]>>(`/api/wishlist/${pgId}`, {
//       method: 'DELETE',
//     });
//   }

//   // ────────────────── Admin Endpoints ──────────────────

//   /** GET /api/auth/users (admin only) */
//   async getAllUsers(): Promise<ApiResponse<{ count: number; items: User[] }>> {
//     return this.request<ApiResponse<{ count: number; items: User[] }>>('/api/auth/users');
//   }

//   /** GET /api/auth/users/:id (admin only) */
//   async getUserById(id: string): Promise<ApiResponse<User>> {
//     return this.request<ApiResponse<User>>(`/api/auth/users/${id}`);
//   }

//   /** DELETE /api/auth/users/:id (admin only) */
//   async deleteUser(id: string): Promise<ApiResponse<{ deletedId: string }>> {
//     return this.request<ApiResponse<{ deletedId: string }>>(`/api/auth/users/${id}`, {
//       method: 'DELETE',
//     });
//   }

//   /** PUT /api/auth/users/:id/status (admin only) */
//   async updateUserStatus(id: string, status: string): Promise<ApiResponse<User>> {
//     return this.request<ApiResponse<User>>(`/api/auth/users/${id}/status`, {
//       method: 'PUT',
//       body: JSON.stringify({ status }),
//     });
//   }

//   // ────────────────── Owner / PG Endpoints ──────────────────

//   /** GET /api/pg/my-listings (owner's own listings) */
//   async getMyListings(): Promise<ApiResponse<{ items: PGListing[]; total: number }>> {
//     return this.request<ApiResponse<{ items: PGListing[]; total: number }>>('/api/pg/my-listings');
//   }

//   /** POST /api/pg (create new PG listing) */
//   async createPGListing(data: Partial<PGListing> | FormData): Promise<ApiResponse<PGListing>> {
//     const body = data instanceof FormData ? data : JSON.stringify(data);
//     return this.request<ApiResponse<PGListing>>('/api/pg', {
//       method: 'POST',
//       body,
//     });
//   }

//   /** PUT /api/pg/:id (update PG listing) */
//   async updatePGListing(id: string, data: Partial<PGListing> | FormData): Promise<ApiResponse<PGListing>> {
//     const body = data instanceof FormData ? data : JSON.stringify(data);
//     return this.request<ApiResponse<PGListing>>(`/api/pg/${id}`, {
//       method: 'PUT',
//       body,
//     });
//   }

//   /** DELETE /api/pg/:id */
//   async deletePGListing(id: string): Promise<ApiResponse<{ id: string }>> {
//     return this.request<ApiResponse<{ id: string }>>(`/api/pg/${id}`, {
//       method: 'DELETE',
//     });
//   }

//   async getStats(): Promise<ApiResponse<any>> {
//     return this.request<ApiResponse<any>>('/api/pg/admin/stats'); // Backend has /api/pg/admin/stats
//   }

//   // ────────────────── Utility ──────────────────

//   async testConnection() {
//     const testEndpoints = ['/api/health', '/health', '/'];
//     for (const endpoint of testEndpoints) {
//       try {
//         const response = await fetch(`${this.baseURL}${endpoint}`);
//         if (response.ok) {
//           const data = await response.json();
//           return { success: true, endpoint, data };
//         }
//       } catch {
//         // continue
//       }
//     }
//     return { success: false, message: 'Could not connect to API' };
//   }
// }

// export const api = new ApiService();













/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/api.ts

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://eassy-to-rent-backend.onrender.com';

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

// ────────────────────── Cache Class ──────────────────────
class RequestCache {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheDuration: number = 5 * 60 * 1000; // 5 minutes default
  private pendingRequests: Map<string, Promise<any>> = new Map();

  constructor(duration?: number) {
    if (duration) this.cacheDuration = duration;
  }

  getKey(endpoint: string, options: RequestInit = {}): string {
    // Create unique cache key based on endpoint, method, and body
    const method = options.method || 'GET';
    const body = options.body ? JSON.stringify(options.body) : '';
    return `${method}:${endpoint}:${body}`;
  }

  get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      console.log(`📦 [CACHE_HIT] ${key}`);
      return cached.data as T;
    }
    if (cached) {
      console.log(`🗑️ [CACHE_EXPIRED] ${key}`);
      this.cache.delete(key);
    }
    return null;
  }

  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    console.log(`💾 [CACHE_SET] ${key}`);
  }

  clear(): void {
    this.cache.clear();
    console.log('🧹 [CACHE_CLEARED]');
  }

  clearPattern(pattern: RegExp): void {
    for (const key of this.cache.keys()) {
      if (pattern.test(key)) {
        this.cache.delete(key);
        console.log(`🗑️ [CACHE_DELETED] ${key}`);
      }
    }
  }

  // For deduplicating simultaneous requests
  getPendingRequest<T>(key: string): Promise<T> | undefined {
    return this.pendingRequests.get(key);
  }

  setPendingRequest(key: string, promise: Promise<any>): void {
    this.pendingRequests.set(key, promise);
    // Clean up after promise resolves
    promise.finally(() => {
      this.pendingRequests.delete(key);
    });
  }
}

// ────────────────────── Service ──────────────────────
export class ApiService {
  private token: string | null = null;
  public baseURL: string;
  private cache: RequestCache;
  private retryCount: number = 3;
  private retryDelay: number = 1000; // 1 second

  constructor() {
    this.baseURL = API_BASE_URL;
    this.cache = new RequestCache(5 * 60 * 1000); // 5 minutes cache
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
    // Clear cache on logout
    this.cache.clear();
  }

  // ── Cache management ──
  clearCache() {
    this.cache.clear();
  }

  clearPGCache() {
    // Clear all PG related cache
    this.cache.clearPattern(/\/api\/pg/);
  }

  // ── Retry logic with exponential backoff ──
  private async retryRequest<T>(
    fn: () => Promise<T>,
    retries: number = this.retryCount
  ): Promise<T> {
    try {
      return await fn();
    } catch (error: any) {
      if (retries > 0 && error.status === 429) {
        // Rate limit hit - wait with exponential backoff
        const delay = this.retryDelay * Math.pow(2, this.retryCount - retries);
        console.log(`⏳ Rate limited, retrying in ${delay}ms... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retryRequest(fn, retries - 1);
      }
      throw error;
    }
  }

  // ── Generic request with caching and deduplication ──
  public async request<T>(
    endpoint: string,
    options: RequestInit = {},
    skipCache: boolean = false
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const isFormData = options.body instanceof FormData;
    const method = options.method || 'GET';
    
    // Create cache key
    const cacheKey = this.cache.getKey(endpoint, options);
    
    // Only cache GET requests
    const isGetRequest = method === 'GET';
    
    // Check cache for GET requests
    if (isGetRequest && !skipCache) {
      const cached = this.cache.get<T>(cacheKey);
      if (cached) {
        return cached;
      }
      
      // Check for pending request (deduplication)
      const pending = this.cache.getPendingRequest<T>(cacheKey);
      if (pending) {
        console.log(`🔄 [REQUEST_DEDUP] ${method} ${url}`);
        return pending;
      }
    }

    const headers: HeadersInit = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      'Accept': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const config: RequestInit = {
      method,
      ...options,
      headers,
      mode: 'cors',
    };

    console.log(`🌐 [API_REQUEST] ${method} ${url}`);
    
    // Create request promise with retry logic
    const makeRequest = async (): Promise<T> => {
      try {
        const response = await fetch(url, config);
        
        // Handle non-JSON responses or empty bodies
        const contentType = response.headers.get('content-type');
        let data: any = {};
        
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          const text = await response.text();
          data = { message: text || 'No response body' };
        }

        if (!response.ok) {
          console.warn(`⚠️ [API_ERROR] ${response.status} ${response.statusText} for ${method} ${url}`);
          
          // Handle rate limiting
          if (response.status === 429) {
            const error: any = new Error(data.message || 'Too many requests');
            error.status = 429;
            throw error;
          }
          
          // Handle unauthorized
          if (response.status === 401) {
            this.clearToken();
            window.dispatchEvent(new Event('unauthorized'));
          }
          
          const error: any = new Error(data.message || data.error || `Request failed with status ${response.status}`);
          error.status = response.status;
          error.errors = data.errors;
          throw error;
        }

        // Cache successful GET responses
        if (isGetRequest) {
          this.cache.set(cacheKey, data);
        }

        return data as T;
      } catch (error: any) {
        console.error(`❌ [API_FAILURE] ${method} ${url}:`, error.message);
        throw error;
      }
    };

    // Execute request with retry logic
    const requestPromise = this.retryRequest(makeRequest);
    
    // Store pending request for deduplication
    if (isGetRequest) {
      this.cache.setPendingRequest(cacheKey, requestPromise);
    }
    
    return requestPromise;
  }

  // ────────────────── Auth Endpoints ──────────────────

  async login(credentials: LoginCredentials): Promise<ApiResponse<any>> {
    const response = await this.request<ApiResponse<any>>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data) {
      if (response.data.requireOtp) {
        return {
          success: true,
          message: response.message,
          data: { requireOtp: true, email: response.data.email },
        };
      }

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

  async verifyLoginOtp(email: string, otp: string): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.request<ApiResponse<any>>('/api/auth/verify-login-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
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

    throw new Error(response.message || 'OTP verification failed');
  }

  async forgotPassword(email: string): Promise<ApiResponse<{ email: string }>> {
    return this.request<ApiResponse<{ email: string }>>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(email: string, otp: string, newPassword: string): Promise<ApiResponse<{ email: string }>> {
    return this.request<ApiResponse<{ email: string }>>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword }),
    });
  }

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

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>('/api/auth/profile');
  }

  async logout(): Promise<void> {
    this.clearToken();
  }

  // ────────────────── Wishlist Endpoints ──────────────────

  async getWishlist(): Promise<ApiResponse<string[]>> {
    return this.request<ApiResponse<string[]>>('/api/wishlist');
  }

  async addToWishlist(pgId: string): Promise<ApiResponse<string[]>> {
    const response = await this.request<ApiResponse<string[]>>(`/api/wishlist/${pgId}`, {
      method: 'POST',
    });
    // Clear PG cache after wishlist update
    this.clearPGCache();
    return response;
  }

  async removeFromWishlist(pgId: string): Promise<ApiResponse<string[]>> {
    const response = await this.request<ApiResponse<string[]>>(`/api/wishlist/${pgId}`, {
      method: 'DELETE',
    });
    // Clear PG cache after wishlist update
    this.clearPGCache();
    return response;
  }

  // ────────────────── PG Endpoints with Caching ──────────────────

  async getPGs(params?: Record<string, any>): Promise<ApiResponse<{ items: PGListing[]; total: number }>> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<ApiResponse<{ items: PGListing[]; total: number }>>(`/api/pg${queryString}`);
  }

  async getMyListings(): Promise<ApiResponse<{ items: PGListing[]; total: number }>> {
    return this.request<ApiResponse<{ items: PGListing[]; total: number }>>('/api/pg/my-listings');
  }

  async createPGListing(data: Partial<PGListing> | FormData): Promise<ApiResponse<PGListing>> {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    const response = await this.request<ApiResponse<PGListing>>('/api/pg', {
      method: 'POST',
      body,
    });
    // Clear PG cache after creation
    this.clearPGCache();
    return response;
  }

  async updatePGListing(id: string, data: Partial<PGListing> | FormData): Promise<ApiResponse<PGListing>> {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    const response = await this.request<ApiResponse<PGListing>>(`/api/pg/${id}`, {
      method: 'PUT',
      body,
    });
    // Clear PG cache after update
    this.clearPGCache();
    return response;
  }

  async deletePGListing(id: string): Promise<ApiResponse<{ id: string }>> {
    const response = await this.request<ApiResponse<{ id: string }>>(`/api/pg/${id}`, {
      method: 'DELETE',
    });
    // Clear PG cache after deletion
    this.clearPGCache();
    return response;
  }

  async getStats(): Promise<ApiResponse<any>> {
    return this.request<ApiResponse<any>>('/api/pg/admin/stats');
  }

  // ────────────────── Admin Endpoints ──────────────────

  async getAllUsers(): Promise<ApiResponse<{ count: number; items: User[] }>> {
    return this.request<ApiResponse<{ count: number; items: User[] }>>('/api/auth/users');
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>(`/api/auth/users/${id}`);
  }

  async deleteUser(id: string): Promise<ApiResponse<{ deletedId: string }>> {
    const response = await this.request<ApiResponse<{ deletedId: string }>>(`/api/auth/users/${id}`, {
      method: 'DELETE',
    });
    // Clear user cache after deletion
    this.cache.clearPattern(/\/api\/auth\/users/);
    return response;
  }

  async updateUserStatus(id: string, status: string): Promise<ApiResponse<User>> {
    const response = await this.request<ApiResponse<User>>(`/api/auth/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    // Clear user cache after update
    this.cache.clearPattern(/\/api\/auth\/users/);
    return response;
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