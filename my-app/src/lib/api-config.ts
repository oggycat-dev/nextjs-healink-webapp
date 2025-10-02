// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5010',
  ENDPOINTS: {
    AUTH: {
      REGISTER: '/api/user/auth/register',
      LOGIN: '/api/user/auth/login',
      LOGOUT: '/api/user/auth/logout',
      REFRESH_TOKEN: '/api/user/auth/refresh-token',
      VERIFY_OTP: '/api/user/auth/verify-otp',
      RESET_PASSWORD: '/api/user/auth/reset-password',
    },
  },
  TIMEOUT: 30000, // 30 seconds
};

// OTP Channel Types
export enum OtpSentChannel {
  Email = 1,
  SMS = 2,
}

// Grant Types for Login
export enum GrantType {
  Password = 0,
  RefreshToken = 1,
}

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'healink_access_token',
  REFRESH_TOKEN: 'healink_refresh_token',
  USER_DATA: 'healink_user_data',
};
