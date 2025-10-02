// Authentication Types

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phoneNumber: string;
  otpSentChannel: number; // 1 = Email, 2 = SMS
}

export interface LoginRequest {
  email: string;
  password: string;
  grantType: number; // 0 = Password, 1 = RefreshToken
  userAgent: string;
  ipAddress: string;
}

export interface VerifyOtpRequest {
  contact: string; // email or phone
  otpCode: string;
  otpSentChannel: number; // 1 = Email, 2 = SMS
  otpType: number; // 1 = Registration, 2 = Reset Password
}

export interface ResetPasswordRequest {
  contact: string; // email or phone
  newPassword: string;
  confirmPassword: string;
  otpSentChannel: number;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
    user?: UserData;
    expiresIn?: number;
  };
  errors?: string[];
}

export interface UserData {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  avatar?: string;
  role?: string;
}

export interface ApiError {
  message: string;
  errors?: string[];
  statusCode: number;
}
