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
  videoUrl?: string;
  virtualTour?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking {
  _id: string;
  userId: string;
  pgId: PGListing;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  durationMonths: number;
  totalAmount: number;
  discountApplied: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';
  paymentStatus: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
  guestDetails: {
    name: string;
    phone: string;
    email?: string;
    aadharNumber?: string;
    emergencyContact?: string;
  };
  specialRequests?: string;
  reviewed: boolean;
  paymentId?: string;
  paymentProvider?: string;
  paymentCompletedAt?: string;
  createdAt: string;
}

export interface Review {
  _id: string;
  userId: string;
  userName: string;
  pgId: string;
  rating: number;
  comment: string;
  verifiedBooking: boolean;
  createdAt: string;
}

export interface CreditBalance {
  balance: number;
  totalPurchased: number;
  totalUsed: number;
}

export interface AnalyticsData {
  users: {
    total: number;
    active: number;
    suspended: number;
    newToday: number;
    newThisWeek: number;
    newThisMonth: number;
    newThisYear: number;
    dailyActive: Array<{ _id: string; count: number }>;
    roles: Array<{ _id: string; count: number }>;
  };
  bookings: {
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    thisYear: number;
  };
  revenue: {
    total: number;
    monthly: Array<{ _id: string; total: number }>;
  };
  pgs: {
    total: number;
    verified: number;
    pending: number;
    featured: number;
    published: number;
    popularCities: Array<{ _id: string; count: number }>;
    types: Array<{ _id: string; count: number }>;
  };
  wishlist: {
    totalItems: number;
    usersWithWishlist: number;
  };
  reviews: {
    total: number;
    avgRating: number;
  };
}

export interface AuditLog {
  _id: string;
  action: string;
  userId: string;
  userName: string;
  userRole: string;
  ipAddress: string;
  userAgent: string;
  details: any;
  status: 'success' | 'failed';
  createdAt: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

// ────────────────────── Cache Class ──────────────────────
class RequestCache {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheDuration: number = 5 * 60 * 1000;
  private pendingRequests: Map<string, Promise<any>> = new Map();

  constructor(duration?: number) {
    if (duration) this.cacheDuration = duration;
  }

  getKey(endpoint: string, options: RequestInit = {}): string {
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
    this.cache.set(key, { data, timestamp: Date.now() });
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

  getPendingRequest<T>(key: string): Promise<T> | undefined {
    return this.pendingRequests.get(key);
  }

  setPendingRequest(key: string, promise: Promise<any>): void {
    this.pendingRequests.set(key, promise);
    promise.finally(() => this.pendingRequests.delete(key));
  }
}

// ────────────────────── Service ──────────────────────
export class ApiService {
  private token: string | null = null;
  public baseURL: string;
  private cache: RequestCache;
  private retryCount: number = 3;
  private retryDelay: number = 1000;
  private isRefreshing: boolean = false;
  private refreshQueue: Array<() => void> = [];

  constructor() {
    this.baseURL = API_BASE_URL;
    this.cache = new RequestCache(5 * 60 * 1000);
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
    console.log('🔑 [AUTH] Token set in api service');
  }

  setRefreshToken(refreshToken: string) {
    localStorage.setItem('auth_refresh_token', refreshToken);
    console.log('🔑 [AUTH] Refresh token set');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('auth_refresh_token');
  }

  clearRefreshToken() {
    localStorage.removeItem('auth_refresh_token');
    console.log('🗑️ [AUTH] Refresh token cleared');
  }

  getToken(): string | null {
    // Always read fresh from localStorage to avoid stale token
    this.token = localStorage.getItem('auth_token');
    return this.token;
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
    this.clearRefreshToken();
    this.cache.clear();
    console.log('🗑️ [AUTH] Token cleared from api service');
  }

  clearCache() {
    this.cache.clear();
  }

  clearPGCache() {
    this.cache.clearPattern(/\/api\/pg/);
  }

  clearWishlistCache() {
    this.cache.clearPattern(/\/api\/wishlist/);
  }

  private async retryRequest<T>(
    fn: () => Promise<T>,
    retries: number = this.retryCount
  ): Promise<T> {
    try {
      return await fn();
    } catch (error: any) {
      if (retries > 0 && error.status === 429) {
        const delay = this.retryDelay * Math.pow(2, this.retryCount - retries);
        console.log(`⏳ Rate limited, retrying in ${delay}ms... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retryRequest(fn, retries - 1);
      }
      throw error;
    }
  }

  private async processRefreshQueue(success: boolean) {
    const queue = [...this.refreshQueue];
    this.refreshQueue = [];
    queue.forEach(resolve => resolve());
  }

  private async waitForRefresh(): Promise<void> {
    return new Promise((resolve) => {
      this.refreshQueue.push(resolve);
    });
  }

  public async request<T>(
    endpoint: string,
    options: RequestInit = {},
    skipCache: boolean = false
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const isFormData = options.body instanceof FormData;
    const method = options.method || 'GET';
    
    const cacheKey = this.cache.getKey(endpoint, options);
    const isGetRequest = method === 'GET';
    
    if (isGetRequest && !skipCache && !endpoint.includes('/api/wishlist')) {
      const cached = this.cache.get<T>(cacheKey);
      if (cached) return cached;
      
      const pending = this.cache.getPendingRequest<T>(cacheKey);
      if (pending) {
        console.log(`🔄 [REQUEST_DEDUP] ${method} ${url}`);
        return pending;
      }
    }

    // ────────────────── Build Headers Fresh Each Time ──────────────────
    const buildHeaders = (): HeadersInit => {
      const token = this.getToken();
      const headers: HeadersInit = {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        'Accept': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      };
      return headers;
    };

    const buildConfig = (): RequestInit => ({
      method,
      ...options,
      headers: buildHeaders(),
      mode: 'cors',
    });

    console.log(`🌐 [API_REQUEST] ${method} ${url}`);
    
    const makeRequest = async (attempt: number = 1): Promise<T> => {
      const config = buildConfig();
      const currentToken = this.getToken();
      
      // Debug logging
      console.log(`🔍 [AUTH_DEBUG] Attempt ${attempt} for ${endpoint}`);
      console.log(`🔍 [AUTH_DEBUG] Token present: ${!!currentToken}`);
      console.log(`🔍 [AUTH_DEBUG] Token length: ${currentToken?.length || 0}`);
      console.log(`🔍 [AUTH_DEBUG] Authorization header: ${(config.headers as any)?.Authorization || 'NOT SET'}`);

      try {
        const response = await fetch(url, config);
        
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
          
          if (response.status === 429) {
            const error: any = new Error(data.message || 'Too many requests');
            error.status = 429;
            throw error;
          }
          
          if (response.status === 401) {
            console.warn(`🔐 [AUTH] 401 Unauthorized for ${endpoint}`);
            console.warn(`🔐 [AUTH] Token was present: ${!!currentToken}`);
            
            // ────────────────── 401 Retry Logic with Refresh Token ──────────────────
            if (attempt === 1 && currentToken) {
              console.log('🔄 [AUTH] Attempting token refresh for 401...');
              
              // Wait if another request is already refreshing
              if (this.isRefreshing) {
                console.log('⏳ [AUTH] Waiting for in-progress refresh...');
                await this.waitForRefresh();
                console.log('✅ [AUTH] Refresh complete, retrying request...');
                return makeRequest(2);
              }
              
              this.isRefreshing = true;
              try {
                const refreshToken = this.getRefreshToken();
                
                if (refreshToken) {
                  console.log('🔄 [AUTH] Calling /api/auth/refresh with refresh token...');
                  try {
                    const refreshResponse = await fetch(`${this.baseURL}/api/auth/refresh`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ refreshToken }),
                    });
                    
                    if (refreshResponse.ok) {
                      const refreshData = await refreshResponse.json();
                      if (refreshData.success && refreshData.data?.token) {
                        console.log('✅ [AUTH] Token refreshed successfully');
                        this.setToken(refreshData.data.token);
                        if (refreshData.data.refreshToken) {
                          this.setRefreshToken(refreshData.data.refreshToken);
                        }
                        this.isRefreshing = false;
                        await this.processRefreshQueue(true);
                        return makeRequest(2);
                      }
                    } else {
                      const refreshError = await refreshResponse.json();
                      console.error('❌ [AUTH] Refresh failed:', refreshError.message);
                    }
                  } catch (refreshErr: any) {
                    console.error('❌ [AUTH] Refresh request failed:', refreshErr.message);
                  }
                } else {
                  console.log('❌ [AUTH] No refresh token available');
                }
                
                // Refresh failed or no refresh token - logout
                console.log('❌ [AUTH] Token expired or invalid, dispatching unauthorized event');
                this.clearToken();
                window.dispatchEvent(new Event('unauthorized'));
                
                const error: any = new Error(data.message || 'Session expired. Please login again.');
                error.status = 401;
                throw error;
              } finally {
                this.isRefreshing = false;
                await this.processRefreshQueue(false);
              }
            }
            
            // Second attempt also failed or no token
            console.log('❌ [AUTH] 401 on retry or no token available');
            this.clearToken();
            window.dispatchEvent(new Event('unauthorized'));
            
            const error: any = new Error(data.message || 'Unauthorized');
            error.status = 401;
            throw error;
          }
          
          const error: any = new Error(data.message || data.error || `Request failed with status ${response.status}`);
          error.status = response.status;
          error.errors = data.errors;
          throw error;
        }

        if (isGetRequest && !endpoint.includes('/api/wishlist')) {
          this.cache.set(cacheKey, data);
        }

        return data as T;
      } catch (error: any) {
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
          const networkError: any = new Error(
            `Unable to reach API at ${this.baseURL}. Ensure backend is running and VITE_API_URL is correct.`
          );
          networkError.status = 0;
          console.error(`❌ [API_FAILURE] ${method} ${url}:`, networkError.message);
          throw networkError;
        }
        console.error(`❌ [API_FAILURE] ${method} ${url}:`, error.message);
        throw error;
      }
    };

    const requestPromise = this.retryRequest(() => makeRequest(1));
    
    if (isGetRequest && !endpoint.includes('/api/wishlist')) {
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

      const { token, refreshToken, ...userData } = response.data;
      this.setToken(token);
      if (refreshToken) this.setRefreshToken(refreshToken);
      this.clearCache();
      
      return {
        success: true,
        message: response.message,
        data: { token, user: userData as User },
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
      const { token, refreshToken, ...userData } = response.data;
      this.setToken(token);
      if (refreshToken) this.setRefreshToken(refreshToken);
      this.clearCache();
      
      return {
        success: true,
        message: response.message,
        data: { token, user: userData as User },
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
      const { token, refreshToken, ...userData } = response.data;
      this.setToken(token);
      if (refreshToken) this.setRefreshToken(refreshToken);
      return {
        success: true,
        message: response.message,
        data: { token, user: userData as User },
      };
    }

    throw new Error(response.message || 'Registration failed');
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>('/api/auth/profile');
  }

  async logout(): Promise<void> {
    this.clearToken();
    this.clearCache();
  }

  // ────────────────── ✅ NEW: Payment Endpoints ──────────────────

  async createPaymentOrder(bookingId: string, amount: number): Promise<ApiResponse<{ 
    orderId: string; 
    amount: number; 
    currency: string; 
    keyId: string 
  }>> {
    return this.request('/api/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({ bookingId, amount })
    });
  }

  async verifyPayment(data: { 
    bookingId: string; 
    razorpay_order_id: string; 
    razorpay_payment_id: string; 
    razorpay_signature: string 
  }): Promise<ApiResponse<{ booking: Booking }>> {
    return this.request('/api/payments/verify', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getPaymentStatus(bookingId: string): Promise<ApiResponse<{ 
    paymentStatus: string; 
    razorpayOrderId?: string; 
    razorpayPaymentId?: string 
  }>> {
    return this.request(`/api/payments/status/${bookingId}`, { method: 'GET' });
  }

  // ────────────────── Wishlist Endpoints ──────────────────

  async getWishlist(): Promise<ApiResponse<PGListing[]>> {
    const response = await this.request<ApiResponse<PGListing[]>>('/api/wishlist', { method: 'GET' }, true);
    if (response.success && !response.data) response.data = [];
    return response;
  }

  async addToWishlist(pgId: string): Promise<ApiResponse<{ message: string }>> {
    const response = await this.request<ApiResponse<{ message: string }>>('/api/wishlist', {
      method: 'POST',
      body: JSON.stringify({ pgId }),
    });
    this.clearWishlistCache();
    this.clearPGCache();
    return response;
  }

  async removeFromWishlist(pgId: string): Promise<ApiResponse<{ message: string }>> {
    const response = await this.request<ApiResponse<{ message: string }>>(`/api/wishlist/${pgId}`, {
      method: 'DELETE',
    });
    this.clearWishlistCache();
    this.clearPGCache();
    return response;
  }

  async clearWishlist(): Promise<ApiResponse<{ message: string }>> {
    const response = await this.request<ApiResponse<{ message: string }>>('/api/wishlist', { method: 'DELETE' });
    this.clearWishlistCache();
    this.clearPGCache();
    return response;
  }

  async checkInWishlist(pgId: string): Promise<ApiResponse<{ inWishlist: boolean }>> {
    return this.request<ApiResponse<{ inWishlist: boolean }>>(`/api/wishlist/check/${pgId}`, { method: 'GET' });
  }

  // ────────────────── Compare Endpoints ──────────────────

  async getCompareList(): Promise<ApiResponse<PGListing[]>> {
    return this.request('/api/compare', { method: 'GET' });
  }

  async addToCompare(pgId: string): Promise<ApiResponse<{ message: string }>> {
    const response = await this.request('/api/compare', {
      method: 'POST',
      body: JSON.stringify({ pgId })
    });
    this.clearCache();
    return response;
  }

  async removeFromCompare(pgId: string): Promise<ApiResponse<{ message: string }>> {
    const response = await this.request(`/api/compare/${pgId}`, { method: 'DELETE' });
    this.clearCache();
    return response;
  }

  async clearCompare(): Promise<ApiResponse<{ message: string }>> {
    const response = await this.request('/api/compare', { method: 'DELETE' });
    this.clearCache();
    return response;
  }

  async checkInCompare(pgId: string): Promise<ApiResponse<{ inCompare: boolean }>> {
    return this.request(`/api/compare/check/${pgId}`, { method: 'GET' });
  }

  // ────────────────── LOCATION ENDPOINTS ──────────────────

  async getLocations(params?: { search?: string; page?: number; limit?: number }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    return this.request(`/api/locations${queryParams.toString() ? `?${queryParams}` : ''}`, { method: 'GET' });
  }

  async getPopularLocations(limit: number = 10): Promise<ApiResponse<any[]>> {
    return this.request(`/api/locations/popular?limit=${limit}`, { method: 'GET' });
  }

  async searchLocations(query: string, limit: number = 10): Promise<ApiResponse<any[]>> {
    if (!query || query.length < 2) {
      return { success: true, message: 'No results', data: [] };
    }
    return this.request(`/api/locations/search?q=${encodeURIComponent(query)}&limit=${limit}`, { method: 'GET' });
  }

  async getLocationBySlug(slug: string, params?: { 
    page?: number; limit?: number; sort?: string; type?: string; minPrice?: number; maxPrice?: number 
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
    
    return this.request(`/api/locations/${slug}${queryParams.toString() ? `?${queryParams}` : ''}`, { method: 'GET' });
  }

  async filterPGsByLocation(filters: {
    locationIds: string[];
    minPrice?: number;
    maxPrice?: number;
    type?: string;
    amenities?: string[];
    page?: number;
    limit?: number;
    sort?: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/api/locations/filter-pgs', {
      method: 'POST',
      body: JSON.stringify(filters),
    });
  }

  async calculateDistance(pgId: string, userLat: number, userLng: number): Promise<ApiResponse<any>> {
    return this.request('/api/locations/distance', {
      method: 'POST',
      body: JSON.stringify({ pgId, userLat, userLng }),
    });
  }

  // ────────────────── PG Endpoints ──────────────────

  async getPGs(params?: Record<string, any>): Promise<ApiResponse<{ items: PGListing[]; total: number }>> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request<ApiResponse<{ items: PGListing[]; total: number }>>(`/api/pg${queryString}`);
  }

  async getPGById(id: string): Promise<ApiResponse<PGListing>> {
    return this.request<ApiResponse<PGListing>>(`/api/pg/${id}`);
  }

  async getPGBySlug(slug: string): Promise<ApiResponse<PGListing>> {
    return this.request<ApiResponse<PGListing>>(`/api/pg/slug/${slug}`);
  }

  async getMyListings(): Promise<ApiResponse<{ items: PGListing[]; total: number }>> {
    return this.request<ApiResponse<{ items: PGListing[]; total: number }>>('/api/pg/my-listings');
  }

  async createPGListing(data: Partial<PGListing> | FormData): Promise<ApiResponse<PGListing>> {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    const response = await this.request<ApiResponse<PGListing>>('/api/pg', { method: 'POST', body });
    this.clearPGCache();
    return response;
  }

  async updatePGListing(id: string, data: Partial<PGListing> | FormData): Promise<ApiResponse<PGListing>> {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    const response = await this.request<ApiResponse<PGListing>>(`/api/pg/${id}`, { method: 'PUT', body });
    this.clearPGCache();
    return response;
  }

  async deletePGListing(id: string): Promise<ApiResponse<{ id: string }>> {
    const response = await this.request<ApiResponse<{ id: string }>>(`/api/pg/${id}`, { method: 'DELETE' });
    this.clearPGCache();
    return response;
  }

  async getStats(): Promise<ApiResponse<any>> {
    return this.request<ApiResponse<any>>('/api/pg/admin/stats');
  }

  // ────────────────── PAYMENT/CREDIT ENDPOINTS ──────────────────

  async getCreditBalance(): Promise<ApiResponse<CreditBalance>> {
    return this.request('/api/payments/credit-balance', { method: 'GET' });
  }

  async createCallCreditOrder(amount: number = 10): Promise<ApiResponse<{ orderId: string; amount: number; currency: string; keyId: string }>> {
    return this.request('/api/payments/create-call-credit-order', {
      method: 'POST',
      body: JSON.stringify({ amount })
    });
  }

  async verifyCallCreditPayment(data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }): Promise<ApiResponse<{ balance: number }>> {
    return this.request('/api/payments/verify-call-credit', { method: 'POST', body: JSON.stringify(data) });
  }

  async canContact(pgId: string, type: 'call' | 'whatsapp'): Promise<ApiResponse<{ canContact: boolean; balance: number; alreadyContacted?: boolean }>> {
    return this.request('/api/payments/can-contact', { method: 'POST', body: JSON.stringify({ pgId, type }) });
  }

  async useContactCredit(pgId: string, contactType: 'call' | 'whatsapp'): Promise<ApiResponse<{ balance: number; contactNumber: string }>> {
    return this.request('/api/payments/use-contact-credit', { method: 'POST', body: JSON.stringify({ pgId, contactType }) });
  }

  // ────────────────── Contact Endpoints (Auth Protected) ──────────────────

  async initiateContact(pgId: string, type: 'call' | 'whatsapp'): Promise<ApiResponse<{
    allowed: boolean;
    contactNumber: string;
    type: string;
    pgName: string;
    whatsappUrl: string | null;
    callUrl: string | null;
  }>> {
    return this.request('/api/contact/initiate', {
      method: 'POST',
      body: JSON.stringify({ pgId, type }),
    });
  }

  async getContactHistory(): Promise<ApiResponse<any[]>> {
    return this.request('/api/contact/history', { method: 'GET' });
  }

  // ────────────────── BOOKING ENDPOINTS ──────────────────

  async createBooking(bookingData: {
    pgId: string;
    roomType: string;
    checkInDate: string;
    checkOutDate: string;
    durationMonths: number;
    totalAmount: number;
    guestDetails: { name: string; phone: string; email?: string };
    specialRequests?: string;
  }): Promise<ApiResponse<{ bookingId: string; data: Booking }>> {
    const response = await this.request('/api/bookings', { method: 'POST', body: JSON.stringify(bookingData) });
    this.clearCache();
    return response;
  }

  async getUserBookings(): Promise<ApiResponse<Booking[]>> {
    return this.request('/api/bookings/mybookings', { method: 'GET' });
  }

  async getBookingById(bookingId: string): Promise<ApiResponse<Booking>> {
    return this.request(`/api/bookings/${bookingId}`, { method: 'GET' });
  }

  async cancelBooking(bookingId: string, reason?: string): Promise<ApiResponse<{ refundAmount: number }>> {
    const response = await this.request(`/api/bookings/${bookingId}/cancel`, { 
      method: 'PUT', 
      body: JSON.stringify({ reason }) 
    });
    this.clearCache();
    return response;
  }

  async canReview(pgId: string): Promise<ApiResponse<{ canReview: boolean; bookingId?: string }>> {
    return this.request(`/api/bookings/can-review/${pgId}`, { method: 'GET' });
  }

  // ────────────────── REVIEW ENDPOINTS ──────────────────

  async getPGReviews(pgId: string): Promise<ApiResponse<Review[]>> {
    return this.request(`/api/reviews/pg/${pgId}`, { method: 'GET' });
  }

  async submitReview(pgId: string, rating: number, comment: string, title?: string): Promise<ApiResponse<{ reviewId: string }>> {
    const response = await this.request('/api/reviews', { 
      method: 'POST', 
      body: JSON.stringify({ pgId, rating, comment, title: title || `Review for PG` }) 
    });
    this.clearPGCache();
    return response;
  }

  async updateReview(reviewId: string, rating: number, comment: string): Promise<ApiResponse<{ reviewId: string }>> {
    const response = await this.request(`/api/reviews/${reviewId}`, { method: 'PUT', body: JSON.stringify({ rating, comment }) });
    this.clearPGCache();
    return response;
  }

  async deleteReview(reviewId: string): Promise<ApiResponse<{ message: string }>> {
    const response = await this.request(`/api/reviews/${reviewId}`, { method: 'DELETE' });
    this.clearPGCache();
    return response;
  }

  // ────────────────── RECOMMENDATION ENDPOINTS WITH FALLBACK ──────────────────

  async getAdminPicks(limit: number = 10): Promise<ApiResponse<{
    adminPicks: PGListing[];
    count: number;
  }>> {
    try {
      return await this.request(`/api/recommendations/admin-picks?limit=${limit}`, { method: 'GET' });
    } catch (error) {
      console.log('Admin picks API failed, using fallback...');
      const pgResponse = await this.getPGs({ limit, sort: '-rating', featured: true });
      return {
        success: true,
        message: 'Using fallback admin picks',
        data: {
          adminPicks: pgResponse.data?.items || [],
          count: pgResponse.data?.items?.length || 0
        }
      };
    }
  }

  async getPersonalizedRecommendations(limit: number = 10): Promise<ApiResponse<{
    recommendations: PGListing[];
    userPreferences: { cities: string[]; types: string[]; topAmenities: string[] };
  }>> {
    try {
      return await this.request(`/api/recommendations/personalized?limit=${limit}`, { method: 'GET' });
    } catch (error) {
      console.log('Personalized recommendations API failed, using fallback...');
      const pgResponse = await this.getPGs({ limit, sort: '-rating', featured: true });
      return {
        success: true,
        message: 'Using fallback recommendations',
        data: {
          recommendations: pgResponse.data?.items || [],
          userPreferences: { cities: [], types: [], topAmenities: [] }
        }
      };
    }
  }

  async getTrendingPGs(limit: number = 10): Promise<ApiResponse<{
    trending: (PGListing & { bookingCount: number; totalRevenue: number })[];
  }>> {
    try {
      return await this.request(`/api/recommendations/trending?limit=${limit}`, { method: 'GET' });
    } catch (error) {
      console.log('Trending API failed, using fallback...');
      const pgResponse = await this.getPGs({ limit, sort: '-rating' });
      const trendingWithMockData = (pgResponse.data?.items || []).map(pg => ({
        ...pg,
        bookingCount: Math.floor(Math.random() * 100) + 10,
        totalRevenue: pg.price * (Math.floor(Math.random() * 50) + 5)
      }));
      return {
        success: true,
        message: 'Using fallback trending data',
        data: { trending: trendingWithMockData }
      };
    }
  }

  // ────────────────── Price Alert Endpoints ──────────────────

  async getPriceAlerts(): Promise<ApiResponse<any[]>> {
    return this.request('/api/price-alerts', { method: 'GET' });
  }

  async createPriceAlert(pgId: string, desiredPrice: number): Promise<ApiResponse<any>> {
    return this.request('/api/price-alerts', { method: 'POST', body: JSON.stringify({ pgId, desiredPrice }) });
  }

  async updatePriceAlert(alertId: string, desiredPrice: number): Promise<ApiResponse<any>> {
    return this.request(`/api/price-alerts/${alertId}`, { method: 'PUT', body: JSON.stringify({ desiredPrice }) });
  }

  async deletePriceAlert(alertId: string): Promise<ApiResponse<any>> {
    return this.request(`/api/price-alerts/${alertId}`, { method: 'DELETE' });
  }

  // ────────────────── Admin User Management Endpoints ──────────────────

  async getAllUsers(): Promise<ApiResponse<{ count: number; items: User[] }>> {
    return this.request<ApiResponse<{ count: number; items: User[] }>>('/api/users', { method: 'GET' });
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>(`/api/users/${id}`, { method: 'GET' });
  }

  async updateUser(id: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    const response = await this.request<ApiResponse<User>>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    this.clearCache();
    return response;
  }

  async deleteUser(id: string): Promise<ApiResponse<{ deletedId: string }>> {
    const response = await this.request<ApiResponse<{ deletedId: string }>>(`/api/users/${id}`, { method: 'DELETE' });
    this.cache.clearPattern(/\/api\/users/);
    return response;
  }

  async updateUserStatus(id: string, status: string): Promise<ApiResponse<User>> {
    const response = await this.request<ApiResponse<User>>(`/api/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    this.cache.clearPattern(/\/api\/users/);
    return response;
  }

  // ────────────────── Admin Analytics Endpoints ──────────────────

  async getDashboardStats(): Promise<ApiResponse<any>> {
    return this.request('/api/stats/dashboard', { method: 'GET' });
  }

  async getAnalytics(): Promise<ApiResponse<AnalyticsData>> {
    return this.request('/api/stats/analytics', { method: 'GET' });
  }

  // ────────────────── Admin Notification Endpoints ──────────────────

  async sendWishlistReminder(): Promise<ApiResponse<{ message: string }>> {
    return this.request('/api/notifications/wishlist-reminder', { method: 'POST' });
  }

  async sendWishlistReminderToUser(userId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/api/notifications/admin/wishlist-reminder/${userId}`, { method: 'POST' });
  }

  async sendBulkWishlistReminders(): Promise<ApiResponse<{ message: string; data: any }>> {
    return this.request('/api/notifications/admin/bulk-wishlist-reminder', { method: 'POST' });
  }

  async sendBulkOfferEmails(offerMessage?: string, discountCode?: string): Promise<ApiResponse<{ message: string }>> {
    return this.request('/api/notifications/admin/bulk-offer', { 
      method: 'POST', 
      body: JSON.stringify({ offerMessage, discountCode }) 
    });
  }

  async sendBookingConfirmation(bookingDetails: { pgName: string; duration: number; totalAmount: number; moveInDate: string }): Promise<ApiResponse<{ message: string }>> {
    return this.request('/api/notifications/booking-confirmation', { method: 'POST', body: JSON.stringify(bookingDetails) });
  }

  async sendOfferEmail(email: string, name: string): Promise<ApiResponse<{ message: string }>> {
    return this.request('/api/notifications/send-offer', { method: 'POST', body: JSON.stringify({ email, name }) });
  }

  async updateWishlistEmailPreference(enabled: boolean): Promise<ApiResponse<{ wishlistEmailEnabled: boolean }>> {
    return this.request('/api/users/wishlist-email-preference', { method: 'PUT', body: JSON.stringify({ enabled }) });
  }

  async getNotificationStats(): Promise<ApiResponse<any>> {
    return this.request('/api/notifications/admin/stats', { method: 'GET' });
  }

  async testNotification(): Promise<ApiResponse<{ message: string }>> {
    return this.request('/api/notifications/test', { method: 'POST' });
  }

  // ────────────────── PG Demand & Views Endpoints ──────────────────

  async getDemandMeter(pgId: string): Promise<ApiResponse<any>> {
    return this.request(`/api/pg/${pgId}/demand-meter`, { method: 'GET' });
  }

  async incrementViewCount(pgId: string): Promise<ApiResponse<any>> {
    return this.request(`/api/pg/${pgId}/increment-view`, { method: 'POST' });
  }

  // ────────────────── Blog Endpoints ──────────────────

  async getBlogs(params?: { page?: number; limit?: number; category?: string; tag?: string }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.tag) queryParams.append('tag', params.tag);
    
    return this.request(`/api/blogs${queryParams.toString() ? `?${queryParams}` : ''}`, { method: 'GET' });
  }

  async getBlogBySlug(slug: string): Promise<ApiResponse<any>> {
    return this.request(`/api/blogs/${slug}`, { method: 'GET' });
  }

  async createBlog(blogData: any): Promise<ApiResponse<any>> {
    const response = await this.request('/api/blogs', { method: 'POST', body: JSON.stringify(blogData) });
    this.clearCache();
    return response;
  }

  async updateBlog(id: string, blogData: any): Promise<ApiResponse<any>> {
    const response = await this.request(`/api/blogs/${id}`, { method: 'PUT', body: JSON.stringify(blogData) });
    this.clearCache();
    return response;
  }

  async deleteBlog(id: string): Promise<ApiResponse<any>> {
    const response = await this.request(`/api/blogs/${id}`, { method: 'DELETE' });
    this.clearCache();
    return response;
  }

  async getFeaturedBlogs(limit: number = 3): Promise<ApiResponse<any[]>> {
    return this.request(`/api/blogs/featured?limit=${limit}`, { method: 'GET' });
  }

  // ────────────────── Owner Dashboard Endpoints ──────────────────

  async getOwnerListings(): Promise<ApiResponse<{
    items: PGListing[];
    total: number;
    stats: { totalViews: number; totalInquiries: number; totalBookings: number; totalRevenue: number };
  }>> {
    return this.request('/api/pg/owner/listings', { method: 'GET' });
  }

  async getOwnerBookingRequests(): Promise<ApiResponse<Booking[]>> {
    return this.request('/api/bookings/owner/requests', { method: 'GET' });
  }

  async updateBookingStatus(bookingId: string, status: string): Promise<ApiResponse<Booking>> {
    const response = await this.request(`/api/bookings/${bookingId}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
    this.clearCache();
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