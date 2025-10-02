# Healink Authentication Integration

## 📋 Overview
Successfully integrated .NET API microservices authentication into the Next.js Healink webapp. The authentication system includes user registration, login, logout, OTP verification, password reset, and JWT token management.

## 🏗️ Architecture

### Files Created

#### 1. **API Configuration** (`/src/lib/api-config.ts`)
- Central configuration for API endpoints
- Base URL: `http://localhost:5010`
- Endpoints:
  - `/api/user/auth/register` - User registration
  - `/api/user/auth/login` - User login
  - `/api/user/auth/logout` - User logout
  - `/api/user/auth/refresh-token` - Token refresh
  - `/api/user/auth/verify-otp` - OTP verification
  - `/api/user/auth/reset-password` - Password reset
- Enums:
  - `OtpSentChannel`: Email (1), SMS (2)
  - `GrantType`: Password (0), RefreshToken (1)
- Storage keys for localStorage

#### 2. **TypeScript Types** (`/src/types/auth.types.ts`)
Complete type definitions matching .NET API structure:
- `RegisterRequest` - Registration form data
- `LoginRequest` - Login credentials with device info
- `VerifyOtpRequest` - OTP verification
- `ResetPasswordRequest` - Password reset
- `AuthResponse` - API response with tokens and user data
- `UserData` - User profile information
- `ApiError` - Error handling

#### 3. **Authentication Service** (`/src/services/auth.service.ts`)
Core authentication logic:
- **Authentication Methods:**
  - `register()` - Create new account
  - `login()` - User authentication
  - `verifyOtp()` - Verify OTP code
  - `resetPassword()` - Password recovery
  - `logout()` - End session
  - `refreshToken()` - Renew access token

- **Token Management:**
  - `getAccessToken()`, `setAccessToken()` - Access token
  - `getRefreshToken()`, `setRefreshToken()` - Refresh token
  - `getUserData()`, `setUserData()` - User data
  - `clearAuth()` - Clear all auth data
  - `isAuthenticated()` - Check auth status

- **Helpers:**
  - `getUserAgent()` - Browser detection
  - `getIpAddress()` - IP address from ipify.org API
  - `handleResponse()` - Error handling

#### 4. **Auth Context** (`/src/contexts/AuthContext.tsx`)
React Context for global authentication state:
- **State Management:**
  - `user` - Current user data
  - `isAuthenticated` - Auth status
  - `isLoading` - Loading state
  - `error` - Error messages

- **Methods:**
  - `login(email, password)` - Login user
  - `register(data)` - Register new user
  - `logout()` - Logout user
  - `clearError()` - Clear error state

- **Automatic:**
  - Auth state restoration on app load
  - Redirect to `/` on successful login
  - Redirect to `/auth?tab=login&message=registration_success` after registration

#### 5. **Auth Page Component** (`/src/components/AuthPage.tsx`)
Complete authentication UI:
- **Features:**
  - Toggle between login and registration
  - Form validation (email format, password length, phone number)
  - Real-time error display
  - Loading states with spinner
  - Conditional field rendering
  - Social login placeholders (Google, Facebook)
  - Security notice

- **Fields:**
  - Login: Email, Password
  - Register: Full Name, Email, Phone Number, Password, Confirm Password

- **Validation:**
  - Email: Required, valid format
  - Password: Required, min 6 characters
  - Full Name: Required (register only)
  - Phone: Required, 10 digits (register only)
  - Confirm Password: Must match password

#### 6. **Root Layout** (`/src/app/layout.tsx`)
- Wrapped entire app with `<AuthProvider>`
- Global auth state available to all components

#### 7. **Environment Variables** (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:5010
NEXT_PUBLIC_APP_NAME=Healink
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🔒 Authentication Flow

### Registration Flow
1. User fills registration form (email, password, confirmPassword, fullName, phoneNumber)
2. Client validates form data
3. Calls `authService.register()` with otpSentChannel
4. API creates account and sends OTP
5. Redirects to login with success message
6. (Future: OTP verification page)

### Login Flow
1. User enters email and password
2. Client calls `authService.login()`
3. Service adds userAgent and ipAddress automatically
4. API validates credentials and returns tokens
5. Tokens stored in localStorage
6. User data stored in localStorage
7. AuthContext updates state
8. Redirects to homepage `/`

### Logout Flow
1. User clicks logout
2. Calls `authService.logout()`
3. API invalidates refresh token
4. Client clears all localStorage data
5. AuthContext resets state
6. Redirects to login page

### Token Refresh Flow
1. When access token expires (401 error)
2. Call `authService.refreshToken()`
3. Uses stored refresh token
4. Gets new access token
5. Updates localStorage
6. Retries original request

## 🎨 Design Features
- Glassmorphism UI with backdrop blur
- Warm earth-tone color palette (#F8F5F0, #D0BF98, #604B3B)
- Responsive design (mobile-first)
- Smooth transitions and hover effects
- Emoji icons for visual appeal
- Loading spinner animations
- Error state styling (red borders/text)
- Security badge with encryption notice

## 📦 Data Storage
All data stored in browser's `localStorage`:
- `healink_access_token` - JWT access token
- `healink_refresh_token` - JWT refresh token
- `healink_user_data` - User profile JSON

## 🧪 Testing Instructions

### Prerequisites
1. .NET API backend running at `http://localhost:5010`
2. API endpoints accessible and CORS configured
3. Next.js dev server: `npm run dev`

### Test Cases

#### 1. **User Registration**
```
1. Navigate to /auth
2. Click "Đăng ký" tab
3. Fill form:
   - Full Name: "Nguyễn Văn A"
   - Email: "test@example.com"
   - Phone: "0123456789"
   - Password: "password123"
   - Confirm Password: "password123"
4. Click "Đăng ký"
5. Verify:
   - Loading spinner appears
   - Redirects to /auth with login tab
   - Success message visible
```

#### 2. **Form Validation**
```
1. Try empty email → See "Email là bắt buộc"
2. Try invalid email (no @) → See "Email không hợp lệ"
3. Try short password (< 6 chars) → See "Mật khẩu phải có ít nhất 6 ký tự"
4. Try mismatched passwords → See "Mật khẩu xác nhận không khớp"
5. Try invalid phone (not 10 digits) → See "Số điện thoại phải có 10 chữ số"
```

#### 3. **User Login**
```
1. Navigate to /auth
2. Ensure "Đăng nhập" tab is active
3. Fill form:
   - Email: "test@example.com"
   - Password: "password123"
4. Click "Đăng nhập"
5. Verify:
   - Loading spinner appears
   - Redirects to / (homepage)
   - User data in localStorage
   - Tokens in localStorage
```

#### 4. **Persistent Login**
```
1. Login successfully
2. Refresh page (F5)
3. Verify:
   - User remains logged in
   - No redirect to auth page
   - User data persists
```

#### 5. **Logout**
```
1. While logged in
2. Call logout from any component using useAuth
3. Verify:
   - Tokens cleared from localStorage
   - User data cleared
   - Redirects to /auth
```

#### 6. **API Error Handling**
```
1. Login with wrong password
2. Verify:
   - Error message displays in red box
   - Form remains filled
   - No redirect occurs
3. Correct the password
4. Verify:
   - Error clears on input
   - Login succeeds
```

## 🔧 Usage in Components

### Using Auth State
```typescript
import { useAuth } from "@/contexts/AuthContext";

export default function MyComponent() {
  const { user, isAuthenticated, isLoading, error } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }
  
  return <div>Welcome {user?.fullName}</div>;
}
```

### Protected Route Example
```typescript
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, isLoading, router]);
  
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;
  
  return <div>Protected Content</div>;
}
```

### Manual API Calls
```typescript
import { authService } from "@/services/auth.service";

// Check if user is logged in
if (authService.isAuthenticated()) {
  const user = authService.getUserData();
  console.log("User:", user);
}

// Get tokens for API calls
const token = authService.getAccessToken();
fetch("/api/some-endpoint", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

## 🚀 Next Steps

### Immediate
1. ✅ Test registration with backend API
2. ✅ Test login flow
3. ✅ Verify token storage
4. ✅ Test error handling

### Recommended Additions
1. **OTP Verification Page** (`/auth/verify-otp`)
   - Input for OTP code
   - Resend OTP button
   - Timer countdown
   
2. **Password Reset Flow** (`/auth/reset-password`)
   - Email input page
   - OTP verification
   - New password form
   
3. **Protected Route Middleware**
   ```typescript
   // middleware.ts
   export function middleware(request: NextRequest) {
     const token = request.cookies.get("accessToken");
     if (!token && isProtectedRoute(request.nextUrl.pathname)) {
       return NextResponse.redirect(new URL("/auth", request.url));
     }
   }
   ```

4. **Auto Token Refresh**
   ```typescript
   // Add interceptor to handle 401 responses
   if (response.status === 401) {
     const newToken = await authService.refreshToken();
     // Retry request with new token
   }
   ```

5. **Remember Me Feature**
   - Checkbox on login
   - Store preference in localStorage
   - Skip auto-logout

6. **Social OAuth**
   - Google OAuth implementation
   - Facebook OAuth implementation
   - Button click handlers

## 📝 API Contracts

### Register Request
```json
POST /api/user/auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "fullName": "Nguyễn Văn A",
  "phoneNumber": "0123456789",
  "otpSentChannel": 1  // 1=Email, 2=SMS
}
```

### Login Request
```json
POST /api/user/auth/login
{
  "email": "user@example.com",
  "password": "password123",
  "grantType": 0,  // 0=Password, 1=RefreshToken
  "userAgent": "Mozilla/5.0...",
  "ipAddress": "192.168.1.1"
}
```

### Expected Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "Nguyễn Văn A",
      "phoneNumber": "0123456789",
      "avatar": "https://...",
      "role": "User"
    }
  }
}
```

## 🐛 Common Issues

### Issue: CORS Error
**Solution:** Ensure .NET API has CORS configured:
```csharp
services.AddCors(options => {
  options.AddPolicy("AllowAll", builder => {
    builder.AllowAnyOrigin()
           .AllowAnyMethod()
           .AllowAnyHeader();
  });
});
```

### Issue: 401 Unauthorized
**Solution:** Check token in request headers:
```typescript
headers: {
  "Authorization": `Bearer ${authService.getAccessToken()}`
}
```

### Issue: LocalStorage not working
**Solution:** Ensure component uses "use client" directive:
```typescript
"use client";  // Must be at top of file
```

### Issue: Context not available
**Solution:** Verify AuthProvider wraps the component in layout.tsx

### Issue: IP address fetch fails
**Solution:** Fallback to "unknown" if ipify.org is blocked

## 📄 Environment Setup
Ensure `.env.local` exists with:
```env
NEXT_PUBLIC_API_URL=http://localhost:5010
NEXT_PUBLIC_APP_NAME=Healink
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Restart dev server after changing `.env.local`:
```bash
npm run dev
```

## ✅ Checklist
- [x] API configuration created
- [x] TypeScript types defined
- [x] Authentication service implemented
- [x] React Context created
- [x] Auth UI component built
- [x] Root layout wrapped with provider
- [x] Environment variables configured
- [x] Form validation added
- [x] Error handling implemented
- [x] Loading states added
- [ ] Backend API tested
- [ ] Registration flow tested
- [ ] Login flow tested
- [ ] Logout tested
- [ ] Token refresh implemented

---

**Created:** December 2024  
**Status:** Ready for testing  
**Next:** Test with running .NET backend API
