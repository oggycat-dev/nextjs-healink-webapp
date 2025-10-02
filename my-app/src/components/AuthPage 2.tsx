"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

type AuthMode = "login" | "register";

const socialProviders = [
  {
    name: "Google",
    href: "https://www.google.com",
    icon: "/icons/facebook.svg",
    color: "bg-[#4285F4] hover:bg-[#357ae8]",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com",
    icon: "/icons/facebook.svg",
    color: "bg-[#1877F2] hover:bg-[#166fe5]",
  },
];

const loginFields = [
  {
    id: "login-email",
    label: "Email",
    type: "email",
    placeholder: "your.email@example.com",
    icon: "📧",
  },
  {
    id: "login-password",
    label: "Mật khẩu",
    type: "password",
    placeholder: "••••••••",
    icon: "🔒",
  },
];

const registerFields = [
  {
    id: "register-name",
    label: "Họ và tên",
    type: "text",
    placeholder: "Nguyễn Văn A",
    icon: "👤",
  },
  {
    id: "register-email",
    label: "Email",
    type: "email",
    placeholder: "your.email@example.com",
    icon: "📧",
  },
  {
    id: "register-password",
    label: "Mật khẩu",
    type: "password",
    placeholder: "••••••••",
    icon: "🔒",
  },
  {
    id: "register-confirm",
    label: "Xác nhận mật khẩu",
    type: "password",
    placeholder: "••••••••",
    icon: "🔒",
  },
];

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const fields = authMode === "login" ? loginFields : registerFields;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F5F0] via-white to-[#F1E8D9] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
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

        {/* Auth Mode Toggle */}
        <div className="flex bg-[#F5F1EC] p-1 rounded-xl mb-8 shadow-inner">
          <button
            onClick={() => setAuthMode("login")}
            className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
              authMode === "login"
                ? "bg-white text-[#604B3B] shadow-md"
                : "text-[#8B7355] hover:text-[#604B3B]"
            }`}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => setAuthMode("register")}
            className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
              authMode === "register"
                ? "bg-white text-[#604B3B] shadow-md"
                : "text-[#8B7355] hover:text-[#604B3B]"
            }`}
          >
            Đăng ký
          </button>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
          {/* Form Fields */}
          <form className="space-y-6">
            <div className="space-y-5">
              {fields.map((field) => (
                <div key={field.id} className="relative">
                  <label htmlFor={field.id} className="block text-sm font-medium text-[#604B3B] mb-2">
                    {field.label}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                      {field.icon}
                    </span>
                    <input
                      id={field.id}
                      name={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      className="w-full pl-12 pr-4 py-3.5 bg-[#F8F5F0]/50 border border-[#E5DCC9] rounded-xl text-[#604B3B] placeholder:text-[#A09080] focus:outline-none focus:ring-2 focus:ring-[#D0BF98] focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              ))}
            </div>

            {authMode === "login" && (
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[#D0BF98] border-[#E5DCC9] rounded focus:ring-[#D0BF98]"
                    defaultChecked
                  />
                  <span className="text-sm text-[#8B7355]">Ghi nhớ đăng nhập</span>
                </label>
                <a
                  href="#forgot-password"
                  className="text-sm text-[#D0BF98] hover:text-[#C4B086] transition-colors duration-200"
                >
                  Quên mật khẩu?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#D0BF98] to-[#C4B086] text-white py-3.5 rounded-xl font-semibold text-sm tracking-wide hover:from-[#C4B086] hover:to-[#B8A478] transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {authMode === "login" ? "Đăng nhập" : "Tạo tài khoản"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E5DCC9]"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-[#A09080] font-medium">Hoặc tiếp tục với</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            {socialProviders.map((provider) => (
              <a
                key={provider.name}
                href={provider.href}
                target="_blank"
                rel="noreferrer"
                className={`flex items-center justify-center px-4 py-3 rounded-xl text-white font-medium text-sm transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl ${provider.color}`}
              >
                <Image src={provider.icon} alt={provider.name} width={20} height={20} className="mr-2" />
                {provider.name}
              </a>
            ))}
          </div>

          {/* Switch Mode */}
          <div className="text-center pt-4">
            <p className="text-sm text-[#8B7355]">
              {authMode === "login" ? "Chưa có tài khoản?" : "Đã có tài khoản?"}{" "}
              <button
                type="button"
                onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                className="text-[#D0BF98] font-semibold hover:text-[#C4B086] transition-colors duration-200"
              >
                {authMode === "login" ? "Đăng ký ngay" : "Đăng nhập"}
              </button>
            </p>
          </div>

          {/* Security Notice */}
          <div className="bg-[#F8F5F0] rounded-lg p-4 mt-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <span className="text-lg">🔐</span>
              </div>
              <div>
                <p className="text-xs text-[#8B7355] leading-relaxed">
                  Thông tin của bạn được bảo vệ bằng mã hóa SSL 256-bit. Chúng tôi cam kết không chia sẻ dữ liệu cá nhân với bên thứ ba.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-[#A09080]">
            Bằng cách {authMode === "login" ? "đăng nhập" : "đăng ký"}, bạn đồng ý với{" "}
            <a href="#terms" className="text-[#D0BF98] hover:text-[#C4B086] transition-colors">
              Điều khoản dịch vụ
            </a>{" "}
            và{" "}
            <a href="#privacy" className="text-[#D0BF98] hover:text-[#C4B086] transition-colors">
              Chính sách bảo mật
            </a>{" "}
            của chúng tôi.
          </p>
        </div>
      </div>
    </div>
  );
}
