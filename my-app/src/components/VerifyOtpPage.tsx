"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { OtpSentChannel, OtpType } from "@/types/auth.types";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyOtp, login } = useAuth();

  const contact = searchParams.get("contact") || "";
  const channel = parseInt(searchParams.get("channel") || "1") as OtpSentChannel;
  const type = parseInt(searchParams.get("type") || "1") as OtpType;

  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);
    setError(null);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    
    // Only accept 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtpCode(newOtp);
      
      // Focus last input
      const lastInput = document.getElementById("otp-5");
      lastInput?.focus();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const code = otpCode.join("");
    
    if (code.length !== 6) {
      setError("Vui lòng nhập đầy đủ 6 số OTP");
      return;
    }

    setIsSubmitting(true);

    try {
      await verifyOtp({
        contact,
        otpCode: code,
        otpSentChannel: channel,
        otpType: type,
      });

      setSuccess("Xác thực thành công! Đang chuyển hướng...");

      // If registration OTP, redirect to login
      // If password reset OTP, redirect to reset password form
      setTimeout(() => {
        if (type === OtpType.Registration) {
          router.push("/auth");
        } else {
          router.push("/auth"); // Or reset password page
        }
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Xác thực OTP thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0 || isResending) return;

    setIsResending(true);
    setError(null);

    try {
      // Call resend OTP API (you'll need to implement this in your auth service)
      // For now, just reset the timer
      setResendTimer(60);
      setSuccess("Mã OTP mới đã được gửi!");
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể gửi lại mã OTP");
    } finally {
      setIsResending(false);
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
            Xác thực OTP
          </h1>
          <p className="text-base text-[#D0BF98]">
            Mã OTP đã được gửi đến{" "}
            <span className="font-semibold text-[#604B3B]">
              {channel === OtpSentChannel.Email ? "email" : "số điện thoại"}:{" "}
              {contact}
            </span>
          </p>
        </header>

        <div className="space-y-8 rounded-[2.5rem] border border-[#604B3B]/20 bg-white/80 p-8 shadow-[0_20px_60px_rgba(96,75,59,0.08)] backdrop-blur-sm sm:p-10">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-600">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* OTP Input */}
            <div className="flex justify-center gap-3">
              {otpCode.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="h-14 w-14 rounded-xl border-2 border-[#604B3B] text-center text-2xl font-bold text-[#604B3B] transition-colors focus:border-[#D0BF98] focus:outline-none focus:ring-2 focus:ring-[#D0BF98]/60 sm:h-16 sm:w-16"
                  required
                />
              ))}
            </div>

            {/* Timer and Resend */}
            <div className="text-center text-sm text-[#D0BF98]">
              {resendTimer > 0 ? (
                <p>
                  Gửi lại mã sau{" "}
                  <span className="font-semibold text-[#604B3B]">
                    {resendTimer}s
                  </span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="font-semibold text-[#604B3B] underline-offset-4 transition-colors hover:text-[#3f2c1d] disabled:opacity-50"
                >
                  {isResending ? "Đang gửi..." : "Gửi lại mã OTP"}
                </button>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || otpCode.some(d => !d)}
              className="flex w-full items-center justify-center rounded-full bg-[#D0BF98] px-6 py-3 text-base font-semibold uppercase tracking-[0.3em] text-[#604B3B] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#c9b083] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Đang xác thực...</span>
                </span>
              ) : (
                "Xác thực"
              )}
            </button>
          </form>

          {/* Back to login */}
          <div className="text-center text-sm text-[#D0BF98]">
            <a
              href="/auth"
              className="font-semibold text-[#604B3B] underline-offset-4 transition-colors hover:text-[#3f2c1d]"
            >
              ← Quay lại đăng nhập
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
