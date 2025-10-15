import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// ========================================
// ENVIRONMENT VARIABLES
// ========================================
// Main API Gateway URL (single source of truth)
export const API_GATEWAY_URL = 
  process.env.NEXT_PUBLIC_API_GATEWAY_URL || 
  'http://localhost:5010';

// Individual service URLs (optional overrides)
export const AUTH_SERVICE_URL = 
  process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 
  API_GATEWAY_URL;

export const USER_SERVICE_URL = 
  process.env.NEXT_PUBLIC_USER_SERVICE_URL || 
  API_GATEWAY_URL;

export const CONTENT_SERVICE_URL = 
  process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || 
  API_GATEWAY_URL;

export const SUBSCRIPTION_SERVICE_URL = 
  process.env.NEXT_PUBLIC_SUBSCRIPTION_SERVICE_URL || 
  API_GATEWAY_URL;

export const PAYMENT_SERVICE_URL = 
  process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL || 
  API_GATEWAY_URL;

export const NOTIFICATION_SERVICE_URL = 
  process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_URL || 
  API_GATEWAY_URL;

// App configuration
export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'Healink',
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Nuôi dưỡng cảm xúc mỗi ngày',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  tokenKey: process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY || 'healink_auth_token',
  refreshTokenKey: process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_KEY || 'healink_refresh_token',
};

// API configuration
export const API_CONFIG = {
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000', 10),
  logLevel: process.env.NEXT_PUBLIC_LOG_LEVEL || 'debug',
  enableDebug: process.env.NEXT_PUBLIC_ENABLE_DEBUG_MODE === 'true',
  enableMockData: process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA === 'true',
};

// Legacy support - will be removed in future
export const API_BASE_URL = API_GATEWAY_URL;

export const API_ENDPOINTS = {
  // Auth endpoints (via Gateway)
  AUTH: {
    REGISTER: '/api/user/auth/register',
    VERIFY_OTP: '/api/user/auth/verify-otp',
    LOGIN: '/api/user/auth/login',
    LOGOUT: '/api/user/auth/logout',
    REFRESH_TOKEN: '/api/user/auth/refresh-token',
    RESET_PASSWORD: '/api/user/auth/reset-password',
  },
  // User profile endpoints (via Gateway)
  USER: {
    PROFILE: '/api/user/profile',
    UPDATE_PROFILE: '/api/user/profile',
  },
  // Content/Podcast endpoints (via Gateway with /api/content prefix)
  CONTENT: {
    PODCASTS: '/api/content/user/podcasts', // Via Gateway to ContentService
    PODCASTS_TRENDING: '/api/content/user/podcasts/trending',
    PODCASTS_LATEST: '/api/content/user/podcasts/latest',
    PODCAST_DETAIL: (id: string) => `/api/content/user/podcasts/${id}`,
    MY_PODCASTS: '/api/content/creator/podcasts/my-podcasts',
    CATEGORIES: '/api/content/categories',
    UPLOAD_URL: '/api/content/upload/generate-upload-url',
  },
  // File/Media endpoints (direct to UserService for presigned URLs)
  FILE: {
    PRESIGNED_URL: '/api/FileUpload/presigned-url', // Generate presigned URL for S3 files
  },
  // Subscription endpoints (via Gateway)
  SUBSCRIPTION: {
    PLANS: '/api/user/subscription-plans', // User endpoint for viewing plans
    MY_SUBSCRIPTION: '/api/user/subscriptions/me', // Get current user's subscription
    REGISTER: '/api/user/subscriptions/register', // Register new subscription (returns payment URL)
  },
  // Order/Payment endpoints (placeholder - adjust based on your actual API)
  ORDERS: {
    LIST: '/api/user/orders',
    DETAIL: (id: string) => `/api/user/orders/${id}`,
    CREATE: '/api/user/orders',
  },
} as const;

// Response wrapper type matching backend
export interface ApiResponse<T = any> {
  isSuccess: boolean;
  message: string;
  data: T | null;
  errors?: string[] | null;
  statusCode?: number;
}

// Pagination response type
export interface PaginationResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// Create axios instance
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_GATEWAY_URL,
    timeout: API_CONFIG.timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - Add auth token
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Get token from localStorage (only on client side)
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - Handle errors and token refresh
  client.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: AxiosError<ApiResponse>) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      // If error is 401 and we haven't retried yet, try to refresh token
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Try to refresh token
          const refreshResponse = await axios.post<ApiResponse<{ accessToken: string; expiresAt: string }>>(
            `${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''}`,
              },
            }
          );

          if (refreshResponse.data.isSuccess && refreshResponse.data.data) {
            const { accessToken, expiresAt } = refreshResponse.data.data;
            
            // Update token in localStorage
            if (typeof window !== 'undefined') {
              localStorage.setItem('accessToken', accessToken);
              localStorage.setItem('expiresAt', expiresAt);
            }

            // Update Authorization header
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }

            // Retry original request
            return client(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, redirect to login
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('expiresAt');
            localStorage.removeItem('roles');
            window.location.href = '/auth';
          }
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
};

// Create content service client (DIRECT to ContentService because Gateway doesn't have routes)
const createContentClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: CONTENT_SERVICE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - Add auth token
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Get token from localStorage (only on client side)
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - Handle errors
  client.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  );

  return client;
};

// Create user service client (DIRECT to UserService for file operations)
const createUserServiceClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: USER_SERVICE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - Add auth token
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Get token from localStorage (only on client side)
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - Handle errors
  client.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  );

  return client;
};

// Export singleton instances
export const apiClient = createApiClient();
export const contentApiClient = createContentClient();
export const userServiceClient = createUserServiceClient();

// Helper function to handle API errors
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse>;
    
    // Check if response has error details
    if (axiosError.response?.data) {
      const { message, errors } = axiosError.response.data;
      
      // Return errors array joined or message
      if (errors && errors.length > 0) {
        return errors.join(', ');
      }
      
      return message || 'An error occurred';
    }
    
    // Network or timeout error
    if (axiosError.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.';
    }
    
    if (axiosError.code === 'ERR_NETWORK') {
      return 'Network error. Please check your connection.';
    }
    
    return axiosError.message || 'An unexpected error occurred';
  }
  
  // Non-axios error
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unknown error occurred';
};

// Helper to check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('accessToken');
  const expiresAt = localStorage.getItem('expiresAt');
  
  if (!token || !expiresAt) return false;
  
  // Check if token is expired
  const expirationTime = new Date(expiresAt).getTime();
  const now = new Date().getTime();
  
  return expirationTime > now;
};

// Helper to get current user roles
export const getUserRoles = (): string[] => {
  if (typeof window === 'undefined') return [];
  
  const rolesStr = localStorage.getItem('roles');
  if (!rolesStr) return [];
  
  try {
    return JSON.parse(rolesStr);
  } catch {
    return [];
  }
};

// Helper to check if user has specific role
export const hasRole = (role: string): boolean => {
  const roles = getUserRoles();
  return roles.includes(role);
};
