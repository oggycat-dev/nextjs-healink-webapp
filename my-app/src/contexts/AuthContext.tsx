"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { UserData, ApiError } from '@/types/auth.types';

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phoneNumber: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated on mount
    const initAuth = () => {
      try {
        const userData = authService.getUserData();
        const isAuth = authService.isAuthenticated();
        
        if (isAuth && userData) {
          setUser(userData);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.login(email, password);
      
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        router.push('/');
      } else {
        throw new Error(response.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      const error = err as ApiError;
      setError(error.message || 'Đã xảy ra lỗi khi đăng nhập');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.register(data);
      
      if (response.success) {
        // Registration successful, redirect to OTP verification page
        router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
      } else {
        throw new Error(response.message || 'Đăng ký thất bại');
      }
    } catch (err) {
      const error = err as ApiError;
      // Only show error if it's NOT the OTP verification message
      if (!error.message?.includes('OTP') && !error.message?.includes('registration started')) {
        setError(error.message || 'Đã xảy ra lỗi khi đăng ký');
      } else {
        // If it's OTP message, redirect to OTP page anyway
        router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      router.push('/auth');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
