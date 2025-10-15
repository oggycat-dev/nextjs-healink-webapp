"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subscriptionId = searchParams.get("subscriptionId");

  useEffect(() => {
    // Optional: Track conversion
    if (typeof window !== "undefined" && subscriptionId) {
      console.log("Subscription successful:", subscriptionId);
      // Add analytics tracking here
    }
  }, [subscriptionId]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#FBE7BA] to-white px-4">
      <div className="w-full max-w-lg text-center">
        {/* Success Animation */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-12 w-12 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="absolute inset-0 animate-ping rounded-full bg-green-400 opacity-20"></div>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="mb-4 text-3xl font-bold text-[#604B3B] sm:text-4xl">
          🎉 Đăng ký thành công!
        </h1>
        <p className="mb-8 text-lg text-[#604B3B]/70">
          Cảm ơn bạn đã tin tưởng và đăng ký gói của Healink. Bạn đã có thể truy cập toàn bộ
          nội dung premium ngay bây giờ!
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            href="/podcast"
            className="block w-full rounded-full bg-[#604B3B] px-6 py-3 text-center font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4d3c2f]"
          >
            Khám phá Podcast 🎧
          </Link>
          
          <Link
            href="/profile/subscription"
            className="block w-full rounded-full border-2 border-[#604B3B] px-6 py-3 text-center font-semibold text-[#604B3B] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#604B3B]/5"
          >
            Xem chi tiết đăng ký
          </Link>

          <Link
            href="/"
            className="block text-sm text-[#604B3B]/70 hover:text-[#604B3B] hover:underline"
          >
            ← Quay về trang chủ
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-12 rounded-2xl border border-[#604B3B]/20 bg-white/60 p-6 backdrop-blur-sm">
          <h3 className="mb-4 font-semibold text-[#604B3B]">
            📧 Kiểm tra email của bạn
          </h3>
          <p className="text-sm text-[#604B3B]/70">
            Chúng tôi đã gửi email xác nhận và hóa đơn đến địa chỉ email của bạn. Vui lòng
            kiểm tra hộp thư đến hoặc thư rác.
          </p>
        </div>

        {/* Features Reminder */}
        <div className="mt-8 space-y-3">
          <p className="text-sm font-semibold text-[#604B3B]">
            Bạn có thể:
          </p>
          <div className="grid gap-2 text-left text-sm text-[#604B3B]/70">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Nghe tất cả podcast không giới hạn</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Trải nghiệm không quảng cáo</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Tải podcast để nghe offline</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Truy cập nội dung độc quyền</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#604B3B] border-t-transparent mx-auto"></div>
          <p className="text-[#604B3B]">Đang tải...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
