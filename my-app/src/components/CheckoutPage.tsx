"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { subscriptionService } from "@/services/subscription.service";
import { useAuth } from "@/contexts/AuthContext";
import type { SubscriptionPlan } from "@/types/subscription.types";

interface PaymentMethodOption {
  id: string;
  name: string;
  description: string | null;
  type: number;
  typeName: string;
  providerName: string;
  icon: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();

  const planId = searchParams.get("planId");

  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodOption[]>([]);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string>("");
  const [agreeTos, setAgreeTos] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/auth");
        return;
      }

      if (!planId) {
        setError("No plan selected. Please choose a subscription plan.");
        setIsLoading(false);
        return;
      }

      const fetchPlanDetails = async () => {
        try {
          const response = await subscriptionService.getSubscriptionPlans();
          const selectedPlan = response.items.find((p: SubscriptionPlan) => p.id === planId);

          if (!selectedPlan) {
            setError("Invalid plan selected.");
          } else {
            setPlan(selectedPlan);
          }
        } catch (err) {
          console.error("Error fetching plan details:", err);
          setError("Failed to load plan details. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchPlanDetails();
    }
  }, [isAuthenticated, authLoading, planId, router]);

  // Fetch payment methods
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await subscriptionService.getPaymentMethods();
        // Filter only Active payment methods
        const activeMethods = response.items
          .filter((method: any) => method.status === "Active")
          .map((method: any) => ({
            id: method.id,
            name: method.name,
            description: method.description,
            type: method.type,
            typeName: method.typeName,
            providerName: method.providerName,
            icon: getPaymentIcon(method.type, method.providerName),
          }));

        setPaymentMethods(activeMethods);
        
        // Auto-select first available payment method
        if (activeMethods.length > 0) {
          setSelectedPaymentMethodId(activeMethods[0].id);
        }
      } catch (err) {
        console.error("Error fetching payment methods:", err);
      }
    };

    if (isAuthenticated) {
      fetchPaymentMethods();
    }
  }, [isAuthenticated]);

  // Map payment type and provider to icon
  const getPaymentIcon = (type: number, providerName: string): string => {
    // PaymentType enum: CreditCard=1, Cash=2, EWallet=3, BankTransfer=4
    if (type === 3) {
      // E-Wallet
      if (providerName?.toLowerCase().includes("momo")) return "📱";
      if (providerName?.toLowerCase().includes("vnpay")) return "💳";
      return "📱";
    }
    if (type === 1) return "💳"; // Credit Card
    if (type === 2) return "💵"; // Cash
    if (type === 4) return "🏦"; // Bank Transfer
    return "💳";
  };

  const fetchPlan = async () => {
    if (!planId) {
      setError("Không tìm thấy gói đăng ký");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const planData = await subscriptionService.getSubscriptionPlanById(planId);
      setPlan(planData);
    } catch (err) {
      console.error("Error fetching plan:", err);
      setError("Không thể tải thông tin gói đăng ký");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!plan || !agreeTos || !selectedPaymentMethodId) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Register subscription with selected payment method
      const response = await subscriptionService.registerSubscription({
        subscriptionPlanId: plan.id,
        paymentMethodId: selectedPaymentMethodId,
      });

      if (response.paymentUrl) {
        // Redirect to payment gateway
        window.location.href = response.paymentUrl;
      } else {
        throw new Error("Không nhận được URL thanh toán");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || "Có lỗi xảy ra trong quá trình thanh toán");
    } finally {
      setIsProcessing(false);
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

  if (error || !plan) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-lg text-red-600">{error || "Không tìm thấy gói đăng ký"}</p>
          <button
            onClick={() => router.push("/subscription")}
            className="mt-4 rounded-lg bg-[#604B3B] px-6 py-2 text-white hover:bg-[#4d3c2f]"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const features = subscriptionService.parseFeatures(plan.featureConfig);
  const totalAmount = plan.amount;
  const isFree = totalAmount === 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FBE7BA] to-white py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#604B3B] hover:text-[#4d3c2f]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Quay lại</span>
          </button>
          <h1 className="mt-6 text-3xl font-bold text-[#604B3B] sm:text-4xl">
            Thanh toán
          </h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-[#604B3B]/20 bg-white/80 p-8 backdrop-blur-sm">
              <h2 className="mb-6 text-xl font-bold text-[#604B3B]">
                Thông tin đăng ký
              </h2>

              {/* Plan Details */}
              <div className="mb-6 rounded-2xl border border-[#D0BF98] bg-[#FBE7BA]/30 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#604B3B]">
                      {plan.displayName}
                    </h3>
                    <p className="mt-1 text-sm text-[#604B3B]/70">
                      {plan.description}
                    </p>
                    {plan.trialDays > 0 && (
                      <p className="mt-2 text-sm font-semibold text-green-600">
                        🎁 Dùng thử {plan.trialDays} ngày miễn phí
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#604B3B]">
                      {subscriptionService.formatPrice(plan.amount, plan.currency)}
                    </div>
                    <div className="text-sm text-[#604B3B]/70">
                      {subscriptionService.getBillingPeriodText(
                        plan.billingPeriodCount,
                        plan.billingPeriodUnit
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <h3 className="mb-4 text-lg font-semibold text-[#604B3B]">
                  Phương thức thanh toán
                </h3>
                {paymentMethods.length === 0 ? (
                  <div className="rounded-xl border-2 border-[#D0BF98]/50 p-4 text-center text-[#604B3B]/70">
                    Đang tải phương thức thanh toán...
                  </div>
                ) : (
                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all ${
                          selectedPaymentMethodId === method.id
                            ? "border-[#604B3B] bg-[#FBE7BA]/30"
                            : "border-[#D0BF98]/50 hover:border-[#D0BF98]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={selectedPaymentMethodId === method.id}
                          onChange={(e) => setSelectedPaymentMethodId(e.target.value)}
                          className="h-5 w-5 text-[#604B3B] focus:ring-[#604B3B]"
                        />
                        <span className="text-2xl">{method.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium text-[#604B3B]">{method.name}</div>
                          {method.description && (
                            <div className="text-sm text-[#604B3B]/70">{method.description}</div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTos}
                  onChange={(e) => setAgreeTos(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-[#604B3B] text-[#604B3B] focus:ring-[#604B3B]"
                />
                <span className="text-sm text-[#604B3B]/70">
                  Tôi đồng ý với{" "}
                  <a href="/terms" className="text-[#604B3B] underline hover:text-[#4d3c2f]">
                    Điều khoản dịch vụ
                  </a>{" "}
                  và{" "}
                  <a href="/privacy" className="text-[#604B3B] underline hover:text-[#4d3c2f]">
                    Chính sách bảo mật
                  </a>
                </span>
              </label>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-3xl border border-[#604B3B]/20 bg-white/80 p-8 backdrop-blur-sm">
              <h2 className="mb-6 text-xl font-bold text-[#604B3B]">
                Tổng quan
              </h2>

              {/* Price Summary */}
              <div className="mb-6 space-y-3 border-b border-[#D0BF98] pb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-[#604B3B]/70">Gói đăng ký</span>
                  <span className="font-semibold text-[#604B3B]">
                    {subscriptionService.formatPrice(plan.amount, plan.currency)}
                  </span>
                </div>
                {plan.trialDays > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Dùng thử miễn phí</span>
                    <span className="font-semibold">
                      -{subscriptionService.formatPrice(plan.amount, plan.currency)}
                    </span>
                  </div>
                )}
              </div>

              <div className="mb-6 flex justify-between text-lg font-bold text-[#604B3B]">
                <span>Tổng cộng</span>
                <span>
                  {plan.trialDays > 0
                    ? "0đ"
                    : subscriptionService.formatPrice(totalAmount, plan.currency)}
                </span>
              </div>

              {plan.trialDays > 0 && (
                <p className="mb-6 text-xs text-[#604B3B]/70">
                  Bạn sẽ không bị tính phí trong {plan.trialDays} ngày dùng thử. Sau đó,{" "}
                  {subscriptionService.formatPrice(plan.amount, plan.currency)}{" "}
                  {subscriptionService.getBillingPeriodText(plan.billingPeriodCount, plan.billingPeriodUnit)}
                </p>
              )}

              <button
                onClick={handleCheckout}
                disabled={isProcessing || !agreeTos}
                className="w-full rounded-full bg-[#604B3B] px-6 py-3 text-center font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#4d3c2f] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Đang xử lý...</span>
                  </span>
                ) : isFree || plan.trialDays > 0 ? (
                  "Bắt đầu dùng thử"
                ) : (
                  "Thanh toán"
                )}
              </button>

              <p className="mt-4 text-center text-xs text-[#604B3B]/70">
                🔒 Thanh toán an toàn và bảo mật
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
