"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { subscriptionService } from "@/services/subscription.service";
import type { UserSubscription, SubscriptionPlan } from "@/types/subscription.types";

export default function ProfileSubscriptionPage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();

  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      router.push("/auth?redirect=/profile/subscription");
      return;
    }

    if (isAuthenticated) {
      fetchSubscription();
    }
  }, [isAuthenticated, authLoading]);

  const fetchSubscription = async () => {
    try {
      setIsLoading(true);
      const sub = await subscriptionService.getCurrentSubscription();
      setSubscription(sub);

      if (sub?.subscriptionPlanId) {
        const planData = await subscriptionService.getSubscriptionPlanById(sub.subscriptionPlanId);
        setPlan(planData);
      }
    } catch (err) {
      console.error("Error fetching subscription:", err);
      setError("Không thể tải thông tin đăng ký");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription || !window.confirm("Bạn có chắc muốn hủy đăng ký? Bạn vẫn có thể sử dụng đến hết kỳ hiện tại.")) {
      return;
    }

    try {
      setIsCancelling(true);
      await subscriptionService.cancelSubscription(subscription.id);
      await fetchSubscription(); // Refresh
      alert("Hủy đăng ký thành công!");
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Không thể hủy đăng ký. Vui lòng thử lại.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleReactivate = async () => {
    if (!subscription) return;

    try {
      setIsCancelling(true);
      await subscriptionService.reactivateSubscription(subscription.id);
      await fetchSubscription();
      alert("Kích hoạt lại thành công!");
    } catch (err) {
      console.error("Reactivate error:", err);
      alert("Không thể kích hoạt lại. Vui lòng thử lại.");
    } finally {
      setIsCancelling(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#604B3B] border-r-transparent"></div>
          <p className="mt-4 text-[#604B3B]">Đang tải...</p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: number) => {
    // SubscriptionStatus enum: InTrial=1, Active=2, PastDue=3, Canceled=4, Paused=5
    const statusMap: Record<number, { bg: string; text: string; label: string }> = {
      1: { bg: "bg-blue-100", text: "text-blue-800", label: "Dùng thử" },
      2: { bg: "bg-green-100", text: "text-green-800", label: "Đang hoạt động" },
      3: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Quá hạn" },
      4: { bg: "bg-red-100", text: "text-red-800", label: "Đã hủy" },
      5: { bg: "bg-gray-100", text: "text-gray-800", label: "Tạm dừng" },
    };

    const config = statusMap[status] || statusMap[3];
    return (
      <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FBE7BA] to-white py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-[#604B3B] hover:text-[#4d3c2f]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Quay lại</span>
          </button>
          <h1 className="mt-6 text-3xl font-bold text-[#604B3B] sm:text-4xl">
            Đăng ký của tôi
          </h1>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {!subscription ? (
          // No subscription
          <div className="rounded-3xl border border-[#604B3B]/20 bg-white/80 p-12 text-center backdrop-blur-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FBE7BA]">
              <svg className="h-8 w-8 text-[#604B3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-bold text-[#604B3B]">
              Chưa có gói đăng ký
            </h2>
            <p className="mb-6 text-[#604B3B]/70">
              Đăng ký ngay để truy cập toàn bộ nội dung premium của Healink!
            </p>
            <button
              onClick={() => router.push("/subscription")}
              className="inline-block rounded-full bg-[#604B3B] px-8 py-3 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4d3c2f]"
            >
              Xem các gói đăng ký
            </button>
          </div>
        ) : (
          // Has subscription
          <div className="space-y-6">
            {/* Current Plan Card */}
            <div className="rounded-3xl border border-[#604B3B]/20 bg-white/80 p-8 backdrop-blur-sm">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#604B3B]">
                    {plan?.displayName || subscription.planDisplayName}
                  </h2>
                  <p className="mt-1 text-[#604B3B]/70">
                    {plan?.description}
                  </p>
                </div>
                {getStatusBadge(subscription.subscriptionStatus)}
              </div>

              {/* Subscription Details */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-[#FBE7BA]/30 p-4">
                  <p className="mb-1 text-sm text-[#604B3B]/70">Giá</p>
                  <p className="text-xl font-bold text-[#604B3B]">
                    {subscriptionService.formatPrice(plan?.amount || 0)}
                    {plan && (
                      <span className="text-sm font-normal text-[#604B3B]/70">
                        {subscriptionService.getBillingPeriodText(plan.billingPeriodCount, plan.billingPeriodUnit)}
                      </span>
                    )}
                  </p>
                </div>

                <div className="rounded-xl bg-[#FBE7BA]/30 p-4">
                  <p className="mb-1 text-sm text-[#604B3B]/70">Ngày bắt đầu</p>
                  <p className="text-xl font-bold text-[#604B3B]">
                    {subscription.currentPeriodStart ? formatDate(subscription.currentPeriodStart) : 'N/A'}
                  </p>
                </div>

                <div className="rounded-xl bg-[#FBE7BA]/30 p-4">
                  <p className="mb-1 text-sm text-[#604B3B]/70">Ngày hết hạn</p>
                  <p className="text-xl font-bold text-[#604B3B]">
                    {subscription.currentPeriodEnd ? formatDate(subscription.currentPeriodEnd) : 'N/A'}
                  </p>
                </div>

                <div className="rounded-xl bg-[#FBE7BA]/30 p-4">
                  <p className="mb-1 text-sm text-[#604B3B]/70">Tự động gia hạn</p>
                  <p className="text-xl font-bold text-[#604B3B]">
                    {subscription.renewalBehavior === 1 ? "Có ✓" : "Không ✗"}
                  </p>
                </div>
              </div>

              {/* Trial Info */}
              {subscription.subscriptionStatus === 1 && (
                <div className="mt-4 rounded-xl bg-blue-50 p-4">
                  <p className="text-sm text-blue-800">
                    🎁 Bạn đang trong thời gian dùng thử miễn phí. Sau {subscription.currentPeriodEnd ? formatDate(subscription.currentPeriodEnd) : ''}, gói đăng ký sẽ tự động gia hạn nếu bạn bật tính năng tự động gia hạn.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex flex-wrap gap-3">
                {subscription.subscriptionStatus === 2 && (
                  <>
                    {subscription.renewalBehavior === 1 ? (
                      <button
                        onClick={handleCancelSubscription}
                        disabled={isCancelling}
                        className="rounded-full border border-red-600 px-6 py-2 font-semibold text-red-600 transition-all duration-200 hover:bg-red-50 disabled:opacity-50"
                      >
                        {isCancelling ? "Đang xử lý..." : "Hủy tự động gia hạn"}
                      </button>
                    ) : (
                      <button
                        onClick={handleReactivate}
                        disabled={isCancelling}
                        className="rounded-full bg-green-600 px-6 py-2 font-semibold text-white transition-all duration-200 hover:bg-green-700 disabled:opacity-50"
                      >
                        {isCancelling ? "Đang xử lý..." : "Bật lại tự động gia hạn"}
                      </button>
                    )}
                  </>
                )}

                {(subscription.subscriptionStatus === 4 || subscription.subscriptionStatus === 3) && (
                  <button
                    onClick={() => router.push("/subscription")}
                    className="rounded-full bg-[#604B3B] px-6 py-2 font-semibold text-white transition-all duration-200 hover:bg-[#4d3c2f]"
                  >
                    Gia hạn ngay
                  </button>
                )}
              </div>
            </div>

            {/* Features */}
            {plan && (
              <div className="rounded-3xl border border-[#604B3B]/20 bg-white/80 p-8 backdrop-blur-sm">
                <h3 className="mb-4 text-xl font-bold text-[#604B3B]">
                  Quyền lợi của bạn
                </h3>
                <ul className="space-y-3">
                  {subscriptionService.getFeaturesArray(plan.featureConfig).map((feature: string, index: number) => (
                    <li key={index} className="flex items-center gap-3">
                      <svg className="h-5 w-5 flex-shrink-0 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-[#604B3B]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Upgrade Option */}
            {subscription.subscriptionStatus === 2 && plan?.displayName !== "Premium" && (
              <div className="rounded-3xl border-2 border-[#D0BF98] bg-gradient-to-r from-[#FBE7BA] to-[#D0BF98] p-8 text-center">
                <h3 className="mb-2 text-2xl font-bold text-[#604B3B]">
                  ⭐ Nâng cấp lên Premium
                </h3>
                <p className="mb-4 text-[#604B3B]/80">
                  Trải nghiệm tốt nhất với tất cả tính năng cao cấp!
                </p>
                <button
                  onClick={() => router.push("/subscription")}
                  className="rounded-full bg-[#604B3B] px-8 py-3 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4d3c2f]"
                >
                  Xem các gói
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
