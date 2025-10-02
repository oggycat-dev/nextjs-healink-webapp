import { API_CONFIG, STORAGE_KEYS, OtpSentChannel, GrantType } from '@/lib/api-config';
import {
  RegisterRequest,
  LoginRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
  AuthResponse,
  ApiError,
} from '@/types/auth.types';

class AuthService {
  private getHeaders(includeAuth = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getAccessToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();

    if (!response.ok) {
      const error: ApiError = {
        message: data.message || 'An error occurred',
        errors: data.errors || [],
        statusCode: response.status,
      };
      throw error;
    }

    return data;
  }

  // Get User Agent and IP Address
  private getUserAgent(): string {
    return typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown';
  }

  private async getIpAddress(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || '0.0.0.0';
    } catch {
      return '0.0.0.0';
    }
  }

  // Register
  async register(data: Omit<RegisterRequest, 'otpSentChannel'>): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REGISTER}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          ...data,
          otpSentChannel: OtpSentChannel.Email, // Default to Email
        }),
      });

      return await this.handleResponse<AuthResponse>(response);
    } catch (error) {
      throw error;
    }
  }

  // Login
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const ipAddress = await this.getIpAddress();
      const userAgent = this.getUserAgent();

      const loginData: LoginRequest = {
        email,
        password,
        grantType: GrantType.Password,
        userAgent,
        ipAddress,
      };

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(loginData),
      });

      const result = await this.handleResponse<AuthResponse>(response);

      // Save tokens and user data to localStorage
      if (result.success && result.data) {
        if (result.data.accessToken) {
          this.setAccessToken(result.data.accessToken);
        }
        if (result.data.refreshToken) {
          this.setRefreshToken(result.data.refreshToken);
        }
        if (result.data.user) {
          this.setUserData(result.data.user);
        }
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  // Verify OTP
  async verifyOtp(contact: string, otpCode: string, otpType: number = 1): Promise<AuthResponse> {
    try {
      const otpData: VerifyOtpRequest = {
        contact,
        otpCode,
        otpSentChannel: OtpSentChannel.Email,
        otpType, // 1 = Registration
      };

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.VERIFY_OTP}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(otpData),
      });

      return await this.handleResponse<AuthResponse>(response);
    } catch (error) {
      throw error;
    }
  }

  // Reset Password
  async resetPassword(data: Omit<ResetPasswordRequest, 'otpSentChannel'>): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          ...data,
          otpSentChannel: OtpSentChannel.Email,
        }),
      });

      return await this.handleResponse<AuthResponse>(response);
    } catch (error) {
      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGOUT}`, {
        method: 'POST',
        headers: this.getHeaders(true),
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuth();
    }
  }

  // Refresh Token
  async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ refreshToken }),
      });

      const result = await this.handleResponse<AuthResponse>(response);

      if (result.success && result.data?.accessToken) {
        this.setAccessToken(result.data.accessToken);
        if (result.data.refreshToken) {
          this.setRefreshToken(result.data.refreshToken);
        }
      }

      return result;
    } catch (error) {
      this.clearAuth();
      throw error;
    }
  }

  // Token Management
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  setAccessToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    }
  }

  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  setRefreshToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
    }
  }

  getUserData(): any {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  }

  setUserData(user: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    }
  }

  clearAuth(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export const authService = new AuthService();
