"use client";

import { useState, FormEvent, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

type AuthMode = "login" | "register";

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}

export default function AuthPage() {
  const searchParams = useSearchParams();
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const { login, register, error, isLoading, clearError } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Check for success message from URL
  useEffect(() => {
    const message = searchParams.get("message");
    const tab = searchParams.get("tab");
    
    if (tab === "login") {
      setAuthMode("login");
    }
    
    if (message === "verification_success") {
      setSuccessMessage("✓ Xác thực thành công! Tài khoản của bạn đã được kích hoạt. Vui lòng đăng nhập.");
      // Auto clear message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: "" }));
    }
    clearError();
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = "Email là bắt buộc";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      errors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (authMode === "register") {
      if (!formData.fullName) {
        errors.fullName = "Họ và tên là bắt buộc";
      }

      if (!formData.phoneNumber) {
        errors.phoneNumber = "Số điện thoại là bắt buộc";
      } else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
        errors.phoneNumber = "Số điện thoại phải có 10 chữ số";
      }

      if (!formData.confirmPassword) {
        errors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Mật khẩu xác nhận không khớp";
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (authMode === "login") {
        await login(formData.email, formData.password);
      } else {
        await register({
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
        });
      }
    } catch (err) {
      console.error('Auth error:', err);
    }
  };

  const switchMode = (mode: AuthMode) => {
    setAuthMode(mode);
    setFormData({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
    });
    setValidationErrors({});
    clearError();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F5F0] via-white to-[#F1E8D9] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl mb-4 shadow-lg">
            <Image src="/icons/logo.png" alt="Healink logo" width={55} height={55} />
          </div>
          <h1 className="text-3xl font-bold text-[#604B3B] mb-2">
            {authMode === "login" ? "Chào mừng trở lại" : "Tạo tài khoản"}
          </h1>
          <p className="text-[#8B7355] text-sm">
            {authMode === "login" 
              ? "Đăng nhập để tiếp tục hành trình chữa lành của bạn"
              : "Bắt đầu hành trình nuôi dưỡng cảm xúc cùng Healink"
            }
          </p>
        </div>

        <div className="flex bg-[#F5F1EC] p-1 rounded-xl mb-8 shadow-inner">
          <button
            onClick={() => switchMode("login")}
            className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
              authMode === "login"
                ? "bg-white text-[#604B3B] shadow-md"
                : "text-[#8B7355] hover:text-[#604B3B]"
            }`}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => switchMode("register")}
            className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
              authMode === "register"
                ? "bg-white text-[#604B3B] shadow-md"
                : "text-[#8B7355] hover:text-[#604B3B]"
            }`}
          >
            Đăng ký
          </button>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
              <p className="text-green-700 text-sm font-medium flex items-center gap-2">
                <span className="text-lg">✓</span>
                {successMessage}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {authMode === "register" && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-[#604B3B] mb-1.5">
                  Họ và tên
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">👤</span>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Nguyễn Văn A"
                    className={`w-full pl-12 pr-4 py-3 bg-white/70 border ${
                      validationErrors.fullName ? 'border-red-300' : 'border-[#E5D9C5]'
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D0BF98] focus:border-transparent transition-all`}
                  />
                </div>
                {validationErrors.fullName && (
                  <p className="mt-1 text-xs text-red-500">{validationErrors.fullName}</p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#604B3B] mb-1.5">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">📧</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  className={`w-full pl-12 pr-4 py-3 bg-white/70 border ${
                    validationErrors.email ? 'border-red-300' : 'border-[#E5D9C5]'
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D0BF98] focus:border-transparent transition-all`}
                />
              </div>
              {validationErrors.email && (
                <p className="mt-1 text-xs text-red-500">{validationErrors.email}</p>
              )}
            </div>

            {authMode === "register" && (
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-[#604B3B] mb-1.5">
                  Số điện thoại
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">📱</span>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="0123456789"
                    className={`w-full pl-12 pr-4 py-3 bg-white/70 border ${
                      validationErrors.phoneNumber ? 'border-red-300' : 'border-[#E5D9C5]'
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D0BF98] focus:border-transparent transition-all`}
                  />
                </div>
                {validationErrors.phoneNumber && (
                  <p className="mt-1 text-xs text-red-500">{validationErrors.phoneNumber}</p>
                )}
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#604B3B] mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔒</span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-4 py-3 bg-white/70 border ${
                    validationErrors.password ? 'border-red-300' : 'border-[#E5D9C5]'
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D0BF98] focus:border-transparent transition-all`}
                />
              </div>
              {validationErrors.password && (
                <p className="mt-1 text-xs text-red-500">{validationErrors.password}</p>
              )}
            </div>

            {authMode === "register" && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#604B3B] mb-1.5">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔒</span>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-4 py-3 bg-white/70 border ${
                      validationErrors.confirmPassword ? 'border-red-300' : 'border-[#E5D9C5]'
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D0BF98] focus:border-transparent transition-all`}
                  />
                </div>
                {validationErrors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">{validationErrors.confirmPassword}</p>
                )}
              </div>
            )}

            {authMode === "login" && (
              <div className="flex justify-end">
                <a href="#" className="text-sm text-[#826B39] hover:text-[#604B3B] transition-colors">
                  Quên mật khẩu?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-[#D0BF98] to-[#C4B086] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </span>
              ) : (
                authMode === "login" ? "Đăng nhập" : "Đăng ký"
              )}
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-[#E5D9C5]"></div>
            <span className="px-4 text-xs text-[#8B7355]">hoặc</span>
            <div className="flex-1 border-t border-[#E5D9C5]"></div>
          </div>

          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-3 py-3 bg-white border border-[#E5D9C5] rounded-xl hover:bg-gray-50 transition-colors">
              <Image src="/icons/facebook.svg" alt="Google" width={20} height={20} />
              <span className="text-sm font-medium text-[#604B3B]">
                Tiếp tục với Google
              </span>
            </button>
            <button className="w-full flex items-center justify-center gap-3 py-3 bg-white border border-[#E5D9C5] rounded-xl hover:bg-gray-50 transition-colors">
              <Image src="/icons/facebook.svg" alt="Facebook" width={20} height={20} />
              <span className="text-sm font-medium text-[#604B3B]">
                Tiếp tục với Facebook
              </span>
            </button>
          </div>

          <div className="mt-6 p-4 bg-[#F8F5F0] border border-[#E5D9C5] rounded-xl">
            <p className="text-xs text-[#8B7355] text-center leading-relaxed">
              🔒 Thông tin của bạn được bảo mật và mã hóa. Chúng tôi cam kết không chia sẻ dữ liệu cá nhân với bên thứ ba.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
