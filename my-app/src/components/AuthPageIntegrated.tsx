"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { OtpSentChannel } from "@/types/auth.types";

type AuthMode = "login" | "register";

export default function AuthPageIntegrated() {
  const router = useRouter();
  const { login, register, isLoading } = useAuth();
  
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null); // Clear error when user types
  };

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(formData.email, formData.password);
      // Redirect to home after successful login
      router.push('/');
    } catch (err) {
      // Error message is already handled by handleApiError in auth service
      setError(err instanceof Error ? err.message : 'Sai tài khoản hoặc mật khẩu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    // Validate phone number if provided
    if (formData.phoneNumber) {
      const phoneRegex = /^(0[0-9]{9}|84[0-9]{9,10}|\+84[0-9]{9,10})$/;
      if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ''))) {
        setError("Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng (VD: 0987654321 hoặc +84987654321)");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber || "",
        otpSentChannel: OtpSentChannel.Email, // Set cứng nhận OTP qua Email
      });

      // Redirect to OTP verification - luôn dùng email
      router.push(`/verify-otp?contact=${encodeURIComponent(formData.email)}&channel=${OtpSentChannel.Email}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  const loginFields = [
    {
      id: "email",
      label: "Email của bạn",
      type: "email",
      placeholder: "name@email.com",
      value: formData.email,
    },
    {
      id: "password",
      label: "Mật khẩu",
      type: "password",
      placeholder: "Nhập mật khẩu",
      value: formData.password,
    },
  ];

  const registerFields = [
    {
      id: "fullName",
      label: "Họ và tên",
      type: "text",
      placeholder: "Nhập họ và tên",
      value: formData.fullName,
    },
    {
      id: "email",
      label: "Email của bạn",
      type: "email",
      placeholder: "name@email.com",
      value: formData.email,
    },
    {
      id: "phoneNumber",
      label: "Số điện thoại",
      type: "tel",
      placeholder: "0987654321",
      value: formData.phoneNumber,
      required: false, // Không bắt buộc
    },
    {
      id: "password",
      label: "Mật khẩu",
      type: "password",
      placeholder: "Nhập mật khẩu (tối thiểu 6 ký tự)",
      value: formData.password,
    },
    {
      id: "confirmPassword",
      label: "Xác nhận mật khẩu",
      type: "password",
      placeholder: "Nhập lại mật khẩu",
      value: formData.confirmPassword,
    },
  ];

  const fields = authMode === "login" ? loginFields : registerFields;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center bg-white py-12 text-[#604B3B] sm:py-16">
      <section className="w-full max-w-[32rem] space-y-10 px-4">
        <header className="space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#D0BF98]">
            Healink
          </p>
          <h1 className="text-3xl font-bold capitalize text-[#604B3B] sm:text-[44px]">
            {authMode === "login" ? "Đăng nhập" : "Đăng ký"}
          </h1>
        </header>

        <div className="space-y-8 rounded-[2.5rem] border border-[#604B3B]/20 bg-white/80 p-8 shadow-[0_20px_60px_rgba(96,75,59,0.08)] backdrop-blur-sm sm:p-10">
          {authMode === "register"}

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={authMode === "login" ? handleLoginSubmit : handleRegisterSubmit} className="space-y-6">
            <div className="space-y-4">
              {fields.map((field) => {
                const isRequired = 'required' in field ? (field as any).required !== false : true;
                return (
                  <label key={field.id} htmlFor={field.id} className="block">
                    <span className="block text-sm font-semibold text-[#D0BF98]">
                      {field.label}
                    </span>
                    <input
                      id={field.id}
                      name={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={field.value}
                      onChange={handleInputChange}
                      className="mt-2 h-12 w-full rounded-full border border-[#604B3B] px-5 text-sm text-[#604B3B] placeholder:text-[#D0BF98] focus:border-[#604B3B] focus:outline-none focus:ring-2 focus:ring-[#D0BF98]/60"
                      required={isRequired}
                    />
                  </label>
                );
              })}
            </div>

            {authMode === "login" && (
              <div className="flex flex-col justify-between gap-4 text-sm text-[#D0BF98] sm:flex-row sm:items-center">
                <label className="flex items-center gap-3 font-medium">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-[#604B3B] text-[#604B3B] focus:ring-[#604B3B]"
                    defaultChecked
                  />
                  <span>Ghi nhớ mật khẩu</span>
                </label>
                <a
                  href="#forgot-password"
                  className="text-sm font-medium text-[#D0BF98] underline-offset-4 transition-colors hover:text-[#604B3B]"
                >
                  Quên mật khẩu ?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="flex w-full items-center justify-center rounded-full bg-[#D0BF98] px-6 py-3 text-base font-semibold uppercase tracking-[0.3em] text-[#604B3B] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#c9b083] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Đang xử lý...</span>
                </span>
              ) : (
                authMode === "login" ? "Đăng nhập" : "Đăng ký"
              )}
            </button>
          </form>

          <div className="space-y-6 text-center">
            <p className="text-base text-[#D0BF98]">
              {authMode === "login"
                ? "Bạn chưa có tài khoản ? "
                : "Bạn đã có tài khoản ? "}
              <button
                type="button"
                onClick={() => {
                  setAuthMode((mode) => (mode === "login" ? "register" : "login"));
                  setError(null);
                }}
                className="font-semibold text-[#604B3B] underline-offset-4 transition-colors hover:text-[#3f2c1d]"
              >
                {authMode === "login" ? "Đăng ký" : "Đăng nhập"}
              </button>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
