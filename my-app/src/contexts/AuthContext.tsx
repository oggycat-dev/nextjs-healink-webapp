'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/auth.service';
import type {
  AuthContextType,
  UserProfile,
  RegisterRequest,
  VerifyOtpRequest,
} from '@/types/auth.types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    try {
      console.log('[AuthContext] Checking authentication...');
      const isAuth = authService.isAuthenticated();
      console.log('[AuthContext] Is authenticated:', isAuth);
      
      if (!isAuth) {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      console.log('[AuthContext] Fetching user profile...');
      const response = await authService.getProfile();
      
      console.log('[AuthContext] Profile response:', {
        isSuccess: response.isSuccess,
        hasData: !!response.data,
        userData: response.data ? { email: response.data.email, fullName: response.data.fullName } : null
      });
      
      if (response.isSuccess && response.data) {
        setUser(response.data);
        setIsAuthenticated(true);
        console.log('[AuthContext] User state updated successfully');
      } else {
        setUser(null);
        setIsAuthenticated(false);
        console.log('[AuthContext] Profile fetch failed, clearing auth state');
      }
    } catch (error) {
      console.error('[AuthContext] Failed to fetch profile:', error);
      // If 401, clear auth state
      if (error instanceof Error && error.message.includes('401')) {
        console.log('[AuthContext] 401 error, logging out...');
        authService.logout();
      }
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      console.log('[AuthContext] Attempting login...', { email });
      const response = await authService.login({ email, password });
      
      console.log('[AuthContext] Login response:', {
        isSuccess: response.isSuccess,
        hasData: !!response.data,
        message: response.message
      });
      
      if (!response.isSuccess) {
        throw new Error(response.message || 'Login failed');
      }

      // Fetch user profile after successful login
      console.log('[AuthContext] Fetching profile after login...');
      await fetchProfile();
      console.log('[AuthContext] Profile fetched successfully');
    } catch (error) {
      console.error('[AuthContext] Login error:', error);
      throw error;
    }
  };

  // Register function
  const register = async (data: RegisterRequest) => {
    try {
      const response = await authService.register(data);
      
      if (!response.isSuccess) {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      throw error;
    }
  };

  // Verify OTP function
  const verifyOtp = async (data: VerifyOtpRequest) => {
    try {
      const response = await authService.verifyOtp(data);
      
      if (!response.isSuccess) {
        throw new Error(response.message || 'OTP verification failed');
      }
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      
      // Redirect to home or login page
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  };

  // Refresh token function
  const refreshToken = async () => {
    try {
      await authService.refreshToken();
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, logout user
      await logout();
    }
  };

  // Auto refresh token before expiration
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkTokenExpiration = () => {
      if (typeof window === 'undefined') return;

      const expiresAt = localStorage.getItem('expiresAt');
      if (!expiresAt) return;

      const expirationTime = new Date(expiresAt).getTime();
      const now = new Date().getTime();
      const timeUntilExpiration = expirationTime - now;

      // Refresh token 5 minutes before expiration
      const refreshThreshold = 5 * 60 * 1000; // 5 minutes in milliseconds

      if (timeUntilExpiration <= refreshThreshold && timeUntilExpiration > 0) {
        refreshToken();
      } else if (timeUntilExpiration <= 0) {
        // Token already expired
        logout();
      }
    };

    // Check immediately
    checkTokenExpiration();

    // Check every minute
    const interval = setInterval(checkTokenExpiration, 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    verifyOtp,
    logout,
    refreshToken,
    fetchProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// HOC to protect routes (use in page components)
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: { redirectTo?: string; requireRoles?: string[] }
) {
  return function ProtectedRoute(props: P) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const redirectTo = options?.redirectTo || '/auth';
    const requireRoles = options?.requireRoles;

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        if (typeof window !== 'undefined') {
          window.location.href = redirectTo;
        }
      }

      // Check roles if specified
      if (!isLoading && isAuthenticated && requireRoles && user) {
        const userRoles = authService.getUserRoles();
        const hasRequiredRole = requireRoles.some((role) =>
          userRoles.includes(role)
        );

        if (!hasRequiredRole) {
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
        }
      }
    }, [isLoading, isAuthenticated, user]);

    if (isLoading) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#604B3B] border-r-transparent"></div>
            <p className="mt-4 text-[#604B3B]">Loading...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}
