// Auth related types matching backend API

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phoneNumber: string;
  otpSentChannel?: number; // 1=Email, 2=Phone
}

export interface RegisterResponse {
  isSuccess: boolean;
  message: string;
  data: null;
  errors: string[] | null;
}

export interface VerifyOtpRequest {
  contact: string; // email or phone
  otpCode: string;
  otpSentChannel: number; // 1=Email, 2=Phone
  otpType: number; // 1=Registration, 2=PasswordReset
}

export interface VerifyOtpResponse {
  isSuccess: boolean;
  message: string;
  data: null;
  errors: string[] | null;
}

export interface LoginRequest {
  email: string;
  password: string;
  grantType?: number; // 0=Password, 1=RefreshToken
}

export interface LoginResponse {
  isSuccess: boolean;
  message: string;
  data: {
    accessToken: string;
    expiresAt: string;
    roles: string[];
  } | null;
  errors: string[] | null;
}

export interface RefreshTokenResponse {
  isSuccess: boolean;
  message: string;
  data: {
    accessToken: string;
    expiresAt: string;
    roles: string[];
  } | null;
  errors: string[] | null;
}

export interface LogoutResponse {
  isSuccess: boolean;
  message: string;
  data: null;
  errors: string[] | null;
}

export interface UserProfile {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  avatar: string | null;
  bio: string | null;
  dateOfBirth: string | null;
  gender: number | null; // 0=Unknown, 1=Male, 2=Female, 3=Other
  address: string | null;
  city: string | null;
  country: string | null;
  isContentCreator: boolean;
  creatorApplicationStatus: number | null; // 0=Draft, 1=Pending, 2=Approved, 3=Rejected
  stageOrScreenName: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface UserProfileResponse {
  isSuccess: boolean;
  message: string;
  data: UserProfile | null;
  errors: string[] | null;
}

export interface ResetPasswordRequest {
  contact: string; // email or phone
  otpSentChannel: number; // 1=Email, 2=Phone
}

export interface ResetPasswordResponse {
  isSuccess: boolean;
  message: string;
  data: null;
  errors: string[] | null;
}

// OTP Types
export enum OtpSentChannel {
  Email = 1,
  Phone = 2,
}

export enum OtpType {
  Registration = 1,
  PasswordReset = 2,
}

// Gender enum
export enum Gender {
  Unknown = 0,
  Male = 1,
  Female = 2,
  Other = 3,
}

// Creator Application Status
export enum CreatorApplicationStatus {
  Draft = 0,
  Pending = 1,
  Approved = 2,
  Rejected = 3,
}

// User roles
export enum UserRole {
  User = 'User',
  ContentCreator = 'ContentCreator',
  Admin = 'Admin',
  Staff = 'Staff',
}

// Auth context type
export interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  verifyOtp: (data: VerifyOtpRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}
