"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

type AuthMode = "login" | "register";
type ContactMethod = "phone" | "email";


const socialProviders = [
  {
    name: "Facebook",
    href: "https://www.facebook.com",
    icon: "/icons/facebook.svg",
  },
  {
    name: "Google",
    href: "https://www.google.com",
    icon: "/icons/twitter.svg",
  },
];

const loginFields = [
  {
    id: "login-email",
    label: "Email của bạn",
    type: "email",
    placeholder: "name@email.com",
  },
  {
    id: "login-password",
    label: "Mật khẩu",
    type: "password",
    placeholder: "Nhập mật khẩu",
  },
];

const registerFields = [
  {
    id: "register-name",
    label: "Họ và tên",
    type: "text",
    placeholder: "Nhập họ và tên",
  },
  {
    id: "register-email",
    label: "Email của bạn",
    type: "email",
    placeholder: "name@email.com",
  },
  {
    id: "register-phone",
    label: "Số điện thoại",
    type: "tel",
    placeholder: "Nhập số điện thoại",
  },
  {
    id: "register-password",
    label: "Mật khẩu",
    type: "password",
    placeholder: "Nhập mật khẩu",
  },
  {
    id: "register-confirm",
    label: "Xác nhận mật khẩu",
    type: "password",
    placeholder: "Nhập lại mật khẩu",
  },
];

export default function AuthPage() {
  const router = useRouter();
  const { isAuthenticated, login, register } = useAuth();
  
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [contactMethod, setContactMethod] = useState<ContactMethod>("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form data states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  const fields = authMode === "login" ? loginFields : registerFields;

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (authMode === "login") {
        // Login
        if (contactMethod === "email") {
          await login(email, password);
        } else {
          // Phone login not implemented yet
          setError("Đăng nhập bằng số điện thoại chưa được hỗ trợ");
          setIsLoading(false);
          return;
        }
        
        // Redirect to home after successful login
        router.push("/");
      } else {
        // Register
        if (password !== confirmPassword) {
          setError("Mật khẩu xác nhận không khớp");
          setIsLoading(false);
          return;
        }

        const registerData = contactMethod === "email" 
          ? {
              email,
              password,
              fullName,
              confirmPassword,
              phoneNumber: "", // Required by API but not used for email registration
              grantType: 0,
            }
          : {
              email: "", // Required by API but not used for phone registration
              phoneNumber,
              password,
              fullName,
              confirmPassword,
              grantType: 1,
            };

        await register(registerData);
        
        // After successful registration, redirect to verify OTP
        router.push(`/verify-otp?contact=${contactMethod === "email" ? email : phoneNumber}`);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

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
          <nav className="relative flex items-center justify-between">
            {(["Số điện thoại", "Email"] as const).map((label, index) => {
              const method: ContactMethod = index === 0 ? "phone" : "email";
              const isActive = contactMethod === method;

              return (
                <button
                  key={method}
                  type="button"
                  onClick={() => setContactMethod(method)}
                  className={`relative flex-1 py-2 text-center text-sm font-medium uppercase tracking-[0.3em] transition-colors sm:text-base ${
                    isActive ? "text-[#604B3B]" : "text-[#D0BF98]"
                  }`}
                  aria-pressed={isActive}
                >
                  {label}
                </button>
              );
            })}
            <span
              className="pointer-events-none absolute bottom-0 left-0 h-[3px] w-full rounded-full bg-[#D0BF98]"
              aria-hidden
            />
            <span
              className={`pointer-events-none absolute bottom-0 h-[3px] rounded-full bg-[#604B3B] transition-transform duration-300 ease-out ${
                contactMethod === "phone" ? "translate-x-0 w-[45%]" : "translate-x-full w-[45%]"
              }`}
              aria-hidden
            />
          </nav>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {authMode === "login" ? (
                <>
                  <label htmlFor="login-email" className="block">
                    <span className="block text-sm font-semibold text-[#D0BF98]">
                      {contactMethod === "email" ? "Email của bạn" : "Số điện thoại"}
                    </span>
                    <input
                      id="login-email"
                      name="login-email"
                      type={contactMethod === "email" ? "email" : "tel"}
                      placeholder={contactMethod === "email" ? "name@email.com" : "0987654321"}
                      value={contactMethod === "email" ? email : phoneNumber}
                      onChange={(e) => contactMethod === "email" ? setEmail(e.target.value) : setPhoneNumber(e.target.value)}
                      required
                      className="mt-2 h-12 w-full rounded-full border border-[#604B3B] px-5 text-sm text-[#604B3B] placeholder:text-[#D0BF98] focus:border-[#604B3B] focus:outline-none focus:ring-2 focus:ring-[#D0BF98]/60"
                    />
                  </label>
                  <label htmlFor="login-password" className="block">
                    <span className="block text-sm font-semibold text-[#D0BF98]">
                      Mật khẩu
                    </span>
                    <input
                      id="login-password"
                      name="login-password"
                      type="password"
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="mt-2 h-12 w-full rounded-full border border-[#604B3B] px-5 text-sm text-[#604B3B] placeholder:text-[#D0BF98] focus:border-[#604B3B] focus:outline-none focus:ring-2 focus:ring-[#D0BF98]/60"
                    />
                  </label>
                </>
              ) : (
                <>
                  <label htmlFor="register-name" className="block">
                    <span className="block text-sm font-semibold text-[#D0BF98]">
                      Họ và tên
                    </span>
                    <input
                      id="register-name"
                      name="register-name"
                      type="text"
                      placeholder="Nhập họ và tên"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="mt-2 h-12 w-full rounded-full border border-[#604B3B] px-5 text-sm text-[#604B3B] placeholder:text-[#D0BF98] focus:border-[#604B3B] focus:outline-none focus:ring-2 focus:ring-[#D0BF98]/60"
                    />
                  </label>
                  <label htmlFor="register-contact" className="block">
                    <span className="block text-sm font-semibold text-[#D0BF98]">
                      {contactMethod === "email" ? "Email của bạn" : "Số điện thoại"}
                    </span>
                    <input
                      id="register-contact"
                      name="register-contact"
                      type={contactMethod === "email" ? "email" : "tel"}
                      placeholder={contactMethod === "email" ? "name@email.com" : "0987654321"}
                      value={contactMethod === "email" ? email : phoneNumber}
                      onChange={(e) => contactMethod === "email" ? setEmail(e.target.value) : setPhoneNumber(e.target.value)}
                      required
                      className="mt-2 h-12 w-full rounded-full border border-[#604B3B] px-5 text-sm text-[#604B3B] placeholder:text-[#D0BF98] focus:border-[#604B3B] focus:outline-none focus:ring-2 focus:ring-[#D0BF98]/60"
                    />
                  </label>
                  <label htmlFor="register-password" className="block">
                    <span className="block text-sm font-semibold text-[#D0BF98]">
                      Mật khẩu
                    </span>
                    <input
                      id="register-password"
                      name="register-password"
                      type="password"
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="mt-2 h-12 w-full rounded-full border border-[#604B3B] px-5 text-sm text-[#604B3B] placeholder:text-[#D0BF98] focus:border-[#604B3B] focus:outline-none focus:ring-2 focus:ring-[#D0BF98]/60"
                    />
                  </label>
                  <label htmlFor="register-confirm" className="block">
                    <span className="block text-sm font-semibold text-[#D0BF98]">
                      Xác nhận mật khẩu
                    </span>
                    <input
                      id="register-confirm"
                      name="register-confirm"
                      type="password"
                      placeholder="Nhập lại mật khẩu"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="mt-2 h-12 w-full rounded-full border border-[#604B3B] px-5 text-sm text-[#604B3B] placeholder:text-[#D0BF98] focus:border-[#604B3B] focus:outline-none focus:ring-2 focus:ring-[#D0BF98]/60"
                    />
                  </label>
                </>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center rounded-full bg-[#D0BF98] px-6 py-3 text-base font-semibold uppercase tracking-[0.3em] text-[#604B3B] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#c9b083] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isLoading ? "Đang xử lý..." : authMode === "login" ? "Đăng nhập" : "Đăng ký"}
            </button>
          </form>

          <div className="space-y-6 text-center">
            <div className="relative flex items-center justify-center">
              <span className="mx-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#604B3B]">
                Hoặc
              </span>
              <span className="absolute left-0 h-px w-1/3 bg-[#604B3B]/40" aria-hidden />
              <span className="absolute right-0 h-px w-1/3 bg-[#604B3B]/40" aria-hidden />
            </div>

            <div className="flex items-center justify-center gap-6">
              {socialProviders.map((provider) => (
                <a
                  key={provider.name}
                  href={provider.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#604B3B] text-[#604B3B] transition-transform duration-200 hover:-translate-y-0.5"
                  aria-label={`Đăng nhập với ${provider.name}`}
                >
                  <Image src={provider.icon} alt={provider.name} width={24} height={24} />
                </a>
              ))}
            </div>

            <p className="text-base text-[#D0BF98]">
              {authMode === "login"
                ? "Bạn chưa có tài khoản ? "
                : "Bạn đã có tài khoản ? "}
              <button
                type="button"
                onClick={() =>
                  setAuthMode((mode) => (mode === "login" ? "register" : "login"))
                }
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
