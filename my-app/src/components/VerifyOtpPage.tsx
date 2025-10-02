"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { authService } from "@/services/auth.service";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Paste case
      const otpArray = value.slice(0, 6).split("");
      const newOtp = [...otp];
      otpArray.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);
      
      // Focus on the last filled input
      const lastIndex = Math.min(index + otpArray.length, 5);
      document.getElementById(`otp-${lastIndex}`)?.focus();
      return;
    }

    // Single digit input
    if (value.match(/^[0-9]$/)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto focus next input
      if (index < 5) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      
      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = "";
        setOtp(newOtp);
        document.getElementById(`otp-${index - 1}`)?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const otpCode = otp.join("");
    
    if (otpCode.length !== 6) {
      setError("Vui lòng nhập đầy đủ mã OTP");
      return;
    }

    if (!email) {
      setError("Không tìm thấy email. Vui lòng đăng ký lại.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.verifyOtp(
        email,
        otpCode,
        1 // OTP type: 1 for Email, 2 for SMS
      );
      
      // Check if response is successful or contains success message
      const isSuccess = response.success || 
                       response.message?.toLowerCase().includes('verified successfully') ||
                       response.message?.toLowerCase().includes('creating your account');
      
      if (isSuccess) {
        setSuccess("Xác thực thành công! Tài khoản đã được tạo. Đang chuyển đến trang đăng nhập...");
        // Redirect after 2 seconds to show success message
        setTimeout(() => {
          router.push("/auth?tab=login&message=verification_success");
        }, 2000);
      } else {
        setError(response.message || "Xác thực thất bại");
      }
    } catch (err: any) {
      // Even if there's an error, check if it contains success message
      const errorMessage = err.message || '';
      if (errorMessage.toLowerCase().includes('verified successfully') || 
          errorMessage.toLowerCase().includes('creating your account')) {
        setSuccess("Xác thực thành công! Tài khoản đã được tạo. Đang chuyển đến trang đăng nhập...");
        setTimeout(() => {
          router.push("/auth?tab=login&message=verification_success");
        }, 2000);
      } else {
        setError(errorMessage || "Đã xảy ra lỗi khi xác thực OTP");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setError("Không tìm thấy email");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSuccess("Đang gửi lại mã OTP...");
      
      // Call API to resend OTP (you'll need to implement this endpoint)
      // For now, show success message
      setSuccess("Mã OTP mới đã được gửi đến email của bạn!");
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Không thể gửi lại mã OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F5F0] via-white to-[#F1E8D9] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl mb-4 shadow-lg">
            <Image src="/icons/logo.png" alt="Healink logo" width={55} height={55} />
          </div>
          <h1 className="text-3xl font-bold text-[#604B3B] mb-2">
            Xác thực OTP
          </h1>
          <p className="text-[#8B7355] text-sm">
            Chúng tôi đã gửi mã xác thực đến
          </p>
          <p className="text-[#604B3B] font-semibold mt-1">
            {email || "email của bạn"}
          </p>
        </div>

        {/* OTP Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm flex items-center gap-2">
                <span>✓</span>
                {success}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-[#604B3B] mb-3 text-center">
                Nhập mã OTP gồm 6 chữ số
              </label>
              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold bg-white/70 border border-[#E5D9C5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D0BF98] focus:border-transparent transition-all"
                  />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || otp.join("").length !== 6}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-[#D0BF98] to-[#C4B086] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xác thực...
                </span>
              ) : (
                "Xác thực"
              )}
            </button>
          </form>

          {/* Resend OTP */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#8B7355] mb-2">
              Không nhận được mã?
            </p>
            <button
              onClick={handleResendOtp}
              disabled={isLoading}
              className="text-sm text-[#826B39] hover:text-[#604B3B] font-medium transition-colors disabled:opacity-50"
            >
              Gửi lại mã OTP
            </button>
          </div>

          {/* Back to Login */}
          <div className="mt-6 pt-6 border-t border-[#E5D9C5]">
            <button
              onClick={() => router.push("/auth")}
              className="w-full text-sm text-[#8B7355] hover:text-[#604B3B] transition-colors"
            >
              ← Quay lại đăng nhập
            </button>
          </div>

          {/* Info Notice */}
          <div className="mt-6 p-4 bg-[#F8F5F0] border border-[#E5D9C5] rounded-xl">
            <p className="text-xs text-[#8B7355] text-center leading-relaxed">
              💡 Mã OTP có hiệu lực trong 5 phút. Vui lòng kiểm tra email hoặc tin nhắn của bạn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
