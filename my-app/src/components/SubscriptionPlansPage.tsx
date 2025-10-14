"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { subscriptionService } from "@/services/subscription.service";
import { useAuth } from "@/contexts/AuthContext";
import type { SubscriptionPlan, UserSubscription } from "@/types/subscription.types";

const planFeatures = [
  { key: "podcast", label: "Nghe podcast", icon: "🎧" },
  { key: "noAds", label: "Không quảng cáo", icon: "🚫" },
  { key: "flashcard", label: "Flashcard", icon: "🗂️" },
  { key: "journal", label: "Viết nhật ký", icon: "📔" },
  { key: "offlineDownload", label: "Tải offline", icon: "📥" },
  { key: "hd", label: "Chất lượng HD", icon: "🎬" },
  { key: "exclusiveContent", label: "Nội dung độc quyền", icon: "⭐" },
  { key: "personalPodcast", label: "Podcast cá nhân", icon: "🎙️" },
];

export default function SubscriptionPlansPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch all plans
      const plansData = await subscriptionService.getSubscriptionPlans({
        pageSize: 10,
        isActive: true,
      });
      setPlans(plansData.items);

      // Fetch current subscription if authenticated
      if (isAuthenticated) {
        const subscription = await subscriptionService.getMySubscription();
        setCurrentSubscription(subscription);
      }
    } catch (err) {
      console.error("Error fetching subscription data:", err);
      setError("Không thể tải thông tin gói đăng ký. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlan = async (planId: string) => {
    if (!isAuthenticated) {
      // Redirect to login with return URL
      router.push(`/auth?redirect=/checkout?planId=${planId}`);
      return;
    }

    // Redirect to checkout page
    router.push(`/checkout?planId=${planId}`);
  };

  const getPlanFeatures = (plan: SubscriptionPlan): Record<string, boolean> => {
    try {
      return subscriptionService.parseFeatures(plan.featureConfig);
    } catch {
      return {};
    }
  };

  const isCurrentPlan = (planId: string): boolean => {
    return currentSubscription?.subscriptionPlanId === planId;
  };

  const getPlanAccentColors = (index: number) => {
    const colors = [
      {
        background: "bg-white/60 backdrop-blur-xl border-2 border-white/40",
        text: "text-[#1E1E1E]",
        shadow: "shadow-[0_18px_40px_rgba(0,0,0,0.1)]",
        cta: "border-2 border-[#1E1E1E] text-[#1E1E1E] hover:bg-[#1E1E1E] hover:text-white",
      },
      {
        background: "bg-[#604B3B]/95 backdrop-blur-xl border-2 border-[#604B3B]/30",
        text: "text-white",
        shadow: "shadow-[0_18px_40px_rgba(96,75,59,0.3)]",
        cta: "bg-white text-[#604B3B] hover:bg-gray-100",
      },
      {
        background: "bg-[#D0BF98]/90 backdrop-blur-xl border-2 border-white/50",
        text: "text-[#1E1E1E]",
        shadow: "shadow-[0_18px_40px_rgba(208,191,152,0.3)]",
        cta: "bg-[#604B3B] text-white hover:bg-[#4d3c2f]",
      },
    ];
    return colors[index % colors.length];
  };

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 rounded-lg bg-[#604B3B] px-6 py-2 text-white hover:bg-[#4d3c2f]"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FBE7BA] to-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#D0BF98]">
            Gói đăng ký
          </p>
          <h1 className="mt-4 text-4xl font-bold text-[#604B3B] sm:text-5xl lg:text-6xl">
            Chọn gói phù hợp với bạn
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#604B3B]/70">
            Trải nghiệm đầy đủ các tính năng của Healink với các gói đăng ký linh hoạt
          </p>
        </header>

        {/* Current Subscription Banner */}
        {currentSubscription && subscriptionService.hasActiveSubscription(currentSubscription) && (
          <div className="mb-12 rounded-3xl border-2 border-[#604B3B]/20 bg-gradient-to-r from-[#D0BF98]/20 to-[#FBE7BA]/20 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#604B3B]">
                  Gói hiện tại: {currentSubscription.planDisplayName}
                </h3>
                <p className="mt-1 text-sm text-[#604B3B]/70">
                  {currentSubscription.currentPeriodEnd && (
                    <>
                      Có hiệu lực đến:{" "}
                      {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString("vi-VN")}
                    </>
                  )}
                </p>
              </div>
              <button
                onClick={() => router.push("/profile/subscription")}
                className="rounded-full bg-[#604B3B] px-6 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                Quản lý gói
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#604B3B] border-r-transparent"></div>
          </div>
        )}

        {/* Plans Grid */}
        {!isLoading && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan, index) => {
              const features = getPlanFeatures(plan);
              const accent = getPlanAccentColors(index);
              const isCurrent = isCurrentPlan(plan.id);
              const isFree = plan.amount === 0;

              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col overflow-hidden rounded-[2.5rem] p-8 transition-transform duration-300 hover:-translate-y-2 ${accent.background} ${accent.shadow}`}
                >
                  {isCurrent && (
                    <div className="absolute right-4 top-4 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white">
                      Đang dùng
                    </div>
                  )}

                  <div className="mb-8">
                    <h2 className={`text-2xl font-bold ${accent.text}`}>
                      {plan.displayName}
                    </h2>
                    <p className={`mt-2 text-sm ${accent.text} opacity-80`}>
                      {plan.description}
                    </p>
                  </div>

                  <div className="mb-8">
                    <div className={`text-4xl font-bold ${accent.text}`}>
                      {isFree ? (
                        "Miễn phí"
                      ) : (
                        <>
                          {subscriptionService.formatPrice(plan.amount, plan.currency)}
                          <span className="text-lg font-normal">
                            {subscriptionService.getBillingPeriodText(
                              plan.billingPeriodCount,
                              plan.billingPeriodUnit
                            )}
                          </span>
                        </>
                      )}
                    </div>
                    {plan.trialDays > 0 && !isCurrent && (
                      <p className={`mt-2 text-sm ${accent.text} opacity-70`}>
                        Dùng thử {plan.trialDays} ngày miễn phí
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <ul className="mb-8 flex-1 space-y-4">
                    {planFeatures.map((feature) => {
                      const isIncluded = features[feature.key] === true;
                      return (
                        <li
                          key={feature.key}
                          className={`flex items-center gap-3 text-sm ${
                            isIncluded ? accent.text : `${accent.text} opacity-40`
                          }`}
                        >
                          <span className="text-lg">{feature.icon}</span>
                          <span className={isIncluded ? "font-medium" : "line-through"}>
                            {feature.label}
                          </span>
                          {isIncluded ? (
                            <svg
                              className="ml-auto h-5 w-5 flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="ml-auto h-5 w-5 flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </li>
                      );
                    })}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={isCurrent}
                    className={`w-full rounded-full px-6 py-3 text-center text-sm font-semibold uppercase tracking-[0.3em] transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 ${accent.cta}`}
                  >
                    {isCurrent
                      ? "Đang sử dụng"
                      : isFree
                      ? "Bắt đầu miễn phí"
                      : "Đăng ký ngay"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* FAQ Section */}
        <section className="mt-20">
          <h2 className="mb-8 text-center text-3xl font-bold text-[#604B3B]">
            Câu hỏi thường gặp
          </h2>
          <div className="mx-auto max-w-3xl space-y-4">
            {[
              {
                q: "Tôi có thể hủy đăng ký bất cứ lúc nào không?",
                a: "Có, bạn có thể hủy đăng ký bất cứ lúc nào. Bạn vẫn có thể sử dụng dịch vụ đến hết kỳ thanh toán hiện tại.",
              },
              {
                q: "Có được dùng thử miễn phí không?",
                a: "Có, hầu hết các gói đều có thời gian dùng thử miễn phí. Bạn có thể hủy trước khi hết thời gian dùng thử mà không bị tính phí.",
              },
              {
                q: "Tôi có thể thay đổi gói đăng ký không?",
                a: "Có, bạn có thể nâng cấp hoặc hạ cấp gói đăng ký bất cứ lúc nào. Sự thay đổi sẽ có hiệu lực ngay lập tức.",
              },
              {
                q: "Phương thức thanh toán nào được chấp nhận?",
                a: "Chúng tôi chấp nhận thanh toán qua thẻ tín dụng/ghi nợ, chuyển khoản ngân hàng và các ví điện tử phổ biến.",
              },
            ].map((faq, index) => (
              <details
                key={index}
                className="group rounded-2xl border border-[#604B3B]/20 bg-white/60 backdrop-blur-sm"
              >
                <summary className="flex cursor-pointer items-center justify-between p-6 font-semibold text-[#604B3B]">
                  {faq.q}
                  <svg
                    className="h-5 w-5 transition-transform group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <p className="px-6 pb-6 text-[#604B3B]/70">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
