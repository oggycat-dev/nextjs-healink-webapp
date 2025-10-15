"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface SubscriptionPlanInfo {
  subscriptionPlanId: string;
  subscriptionPlanName: string;
  billingPeriodCount: string;
  billingPeriodUnit: string;
  internalTransactionId?: string;
  transactionType?: string;
  gatewayType?: string;
}

interface PaymentResult {
  resultCode: string;
  orderId: string | null;
  transId: string | null;
  amount: string | null;
  message: string | null;
  orderInfo: string | null;
  partnerCode: string | null;
  requestId: string | null;
  orderType: string | null;
  payType: string | null;
  responseTime: string | null;
  extraData: string | null;
  planInfo: SubscriptionPlanInfo | null;
}

export default function PaymentReturn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Parse query parameters from MoMo return URL
    const resultCode = searchParams.get("resultCode") || "";
    const orderId = searchParams.get("orderId");
    const transId = searchParams.get("transId");
    const amount = searchParams.get("amount");
    const message = searchParams.get("message");
    const orderInfo = searchParams.get("orderInfo");
    const partnerCode = searchParams.get("partnerCode");
    const requestId = searchParams.get("requestId");
    const orderType = searchParams.get("orderType");
    const payType = searchParams.get("payType");
    const responseTime = searchParams.get("responseTime");
    const extraData = searchParams.get("extraData");

    // Decode extraData (Base64 encoded JSON)
    let planInfo: SubscriptionPlanInfo | null = null;
    if (extraData) {
      try {
        const decodedData = atob(decodeURIComponent(extraData));
        planInfo = JSON.parse(decodedData);
      } catch (error) {
        console.error("Failed to decode extraData:", error);
      }
    }

    setPaymentResult({
      resultCode,
      orderId,
      transId,
      amount,
      message,
      orderInfo,
      partnerCode,
      requestId,
      orderType,
      payType,
      responseTime,
      extraData,
      planInfo,
    });

    setIsLoading(false);
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#F7F2F2] to-[#FBE7BA]">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#604B3B] border-t-transparent mx-auto"></div>
          <p className="text-[#604B3B] font-medium">Đang xử lý kết quả thanh toán...</p>
        </div>
      </div>
    );
  }

  if (!paymentResult) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#F7F2F2] to-[#FBE7BA]">
        <div className="text-center space-y-4">
          <p className="text-red-600 text-lg font-semibold">Không tìm thấy thông tin thanh toán</p>
          <Link
            href="/subscription"
            className="inline-block rounded-full bg-[#604B3B] px-8 py-3 text-white font-semibold hover:bg-[#4d3c2f] transition-colors"
          >
            Quay lại trang gói đăng ký
          </Link>
        </div>
      </div>
    );
  }

  const isSuccess = paymentResult.resultCode === "0";

  const formatPlanName = (name: string) => {
    const planNames: { [key: string]: string } = {
      'yearly-premium': 'Yearly Premium',
      'monthly-premium': 'Monthly Premium',
      'free': 'Free Plan'
    };
    return planNames[name] || name;
  };

  const formatBillingPeriod = (count: string, unit: string) => {
    const unitMap: { [key: string]: string } = {
      'Year': 'năm',
      'Month': 'tháng',
      'Day': 'ngày'
    };
    return `${count} ${unitMap[unit] || unit.toLowerCase()}`;
  };

  const formatDateTime = (timestamp: string | null) => {
    if (!timestamp) return '';
    try {
      const date = new Date(parseInt(timestamp));
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F2F2] via-[#FBE7BA] to-[#E8D4BA] py-12">
      <div className="mx-auto max-w-4xl px-6">
        {/* Success/Failure Card */}
        <div className="glass-card rounded-3xl p-8 md:p-12 shadow-2xl space-y-8">
          {/* Icon & Title Section */}
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              {isSuccess ? (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-xl">
                  <svg
                    className="h-14 w-14 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-xl">
                  <svg
                    className="h-14 w-14 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              )}
            </div>

            <div>
              <h1 className={`text-4xl md:text-5xl font-bold mb-3 ${isSuccess ? "text-green-700" : "text-red-700"}`}>
                {isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại"}
              </h1>
              <p className="text-lg text-[#604B3B]">
                {isSuccess
                  ? "Cảm ơn bạn đã đăng ký gói Premium. Bạn đã có thể sử dụng đầy đủ các tính năng của Healink."
                  : paymentResult.message || "Giao dịch không thành công. Vui lòng thử lại sau."}
              </p>
            </div>
          </div>

          {/* Subscription Plan Info */}
          {isSuccess && paymentResult.planInfo && (
            <div className="rounded-2xl bg-gradient-to-br from-[#FFF4D7] to-[#FFE0E0] p-6 border-2 border-white/60 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#604B3B]">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#604B3B]">Thông tin gói đăng ký</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-[#826B39]">Gói đăng ký</p>
                  <p className="text-lg font-bold text-[#604B3B]">
                    {formatPlanName(paymentResult.planInfo.subscriptionPlanName)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-[#826B39]">Thời hạn</p>
                  <p className="text-lg font-bold text-[#604B3B]">
                    {formatBillingPeriod(
                      paymentResult.planInfo.billingPeriodCount,
                      paymentResult.planInfo.billingPeriodUnit
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Transaction Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#826B39]">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#604B3B]">Chi tiết giao dịch</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentResult.orderId && (
                <div className="rounded-xl bg-white/60 p-4 backdrop-blur-sm border border-white/80">
                  <p className="text-xs text-[#826B39] mb-1">Mã đơn hàng</p>
                  <p className="text-sm font-mono font-semibold text-[#604B3B] break-all">{paymentResult.orderId}</p>
                </div>
              )}
              
              {paymentResult.transId && (
                <div className="rounded-xl bg-white/60 p-4 backdrop-blur-sm border border-white/80">
                  <p className="text-xs text-[#826B39] mb-1">Mã giao dịch MoMo</p>
                  <p className="text-sm font-mono font-semibold text-[#604B3B]">{paymentResult.transId}</p>
                </div>
              )}
              
              {paymentResult.amount && (
                <div className="rounded-xl bg-white/60 p-4 backdrop-blur-sm border border-white/80">
                  <p className="text-xs text-[#826B39] mb-1">Số tiền thanh toán</p>
                  <p className="text-2xl font-bold text-green-700">
                    {parseInt(paymentResult.amount).toLocaleString('vi-VN')}đ
                  </p>
                </div>
              )}

              {paymentResult.payType && (
                <div className="rounded-xl bg-white/60 p-4 backdrop-blur-sm border border-white/80">
                  <p className="text-xs text-[#826B39] mb-1">Phương thức</p>
                  <p className="text-sm font-semibold text-[#604B3B] uppercase">{paymentResult.payType}</p>
                </div>
              )}

              {paymentResult.responseTime && (
                <div className="rounded-xl bg-white/60 p-4 backdrop-blur-sm border border-white/80 md:col-span-2">
                  <p className="text-xs text-[#826B39] mb-1">Thời gian giao dịch</p>
                  <p className="text-sm font-semibold text-[#604B3B]">{formatDateTime(paymentResult.responseTime)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            {isSuccess ? (
              <>
                <Link
                  href="/podcast"
                  className="rounded-full bg-[#604B3B] px-8 py-3 text-white font-semibold hover:bg-[#4d3c2f] transition-all hover:scale-105"
                >
                  Khám phá Podcast
                </Link>
                <Link
                  href="/profile"
                  className="rounded-full bg-white px-8 py-3 text-[#604B3B] font-semibold border-2 border-[#604B3B] hover:bg-[#FBE7BA] transition-all hover:scale-105"
                >
                  Xem hồ sơ của tôi
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/subscription"
                  className="rounded-full bg-[#604B3B] px-8 py-3 text-white font-semibold hover:bg-[#4d3c2f] transition-all hover:scale-105"
                >
                  Thử lại
                </Link>
                <Link
                  href="/"
                  className="rounded-full bg-white px-8 py-3 text-[#604B3B] font-semibold border-2 border-[#604B3B] hover:bg-[#FBE7BA] transition-all hover:scale-105"
                >
                  Về trang chủ
                </Link>
              </>
            )}
          </div>

          {/* Support Link */}
          <p className="text-sm text-[#826B39] pt-4">
            Cần hỗ trợ?{" "}
            <Link href="/about" className="text-[#604B3B] font-semibold hover:underline">
              Liên hệ chúng tôi
            </Link>
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 opacity-10">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="50" fill="#604B3B" />
          </svg>
        </div>
        <div className="absolute bottom-20 right-10 opacity-10">
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="50" fill="#826B39" />
          </svg>
        </div>
      </div>
    </div>
  );
}

