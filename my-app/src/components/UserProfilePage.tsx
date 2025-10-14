"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { subscriptionService } from "@/services/subscription.service";
import { creatorService } from "@/services/creator.service";
import { useRouter } from "next/navigation";
import type { UserSubscription, SubscriptionPlan } from "@/types/subscription.types";
import type { MyApplicationStatus } from "@/types/creator.types";
import CreatorApplicationForm from "./CreatorApplicationForm";

type TabType = "profile" | "subscription" | "payment" | "creator";

export default function UserProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan | null>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);
  
  // Creator application states
  const [creatorApplication, setCreatorApplication] = useState<MyApplicationStatus | null>(null);
  const [isLoadingCreatorApp, setIsLoadingCreatorApp] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  // Profile edit states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  // Password change states
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (user) {
      setEditedProfile({
        fullName: user.fullName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && activeTab === "subscription") {
      fetchSubscription();
    }
  }, [isAuthenticated, activeTab]);

  useEffect(() => {
    if (isAuthenticated && activeTab === "creator") {
      fetchCreatorApplication();
    }
  }, [isAuthenticated, activeTab]);

  const fetchSubscription = async () => {
    setIsLoadingSubscription(true);
    try {
      const data = await subscriptionService.getMySubscription();
      setSubscription(data);
      
      // Fetch subscription plan details
      if (data && data.subscriptionPlanId) {
        try {
          const planData = await subscriptionService.getSubscriptionPlanById(data.subscriptionPlanId);
          setSubscriptionPlan(planData);
        } catch (error) {
          console.error("Error fetching subscription plan:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setIsLoadingSubscription(false);
    }
  };

  const handleSaveProfile = async () => {
    // TODO: Implement update profile API call
    console.log("Saving profile:", editedProfile);
    setIsEditingProfile(false);
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp");
      return;
    }
    // TODO: Implement change password API call
    console.log("Changing password");
    setIsChangingPassword(false);
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const fetchCreatorApplication = async () => {
    setIsLoadingCreatorApp(true);
    try {
      const data = await creatorService.getMyApplicationStatus();
      setCreatorApplication(data);
    } catch (error) {
      console.error("Error fetching creator application:", error);
    } finally {
      setIsLoadingCreatorApp(false);
    }
  };

  const handleApplicationSuccess = () => {
    // Save current scroll position
    const currentScrollY = window.scrollY;
    
    setShowApplicationForm(false);
    fetchCreatorApplication();
    
    // Restore scroll position after state update
    setTimeout(() => {
      window.scrollTo({ top: currentScrollY, behavior: 'instant' });
    }, 50);
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;
    
    if (!confirm("Bạn có chắc chắn muốn hủy gói đăng ký?")) return;

    try {
      await subscriptionService.cancelSubscription(subscription.id, {
        reason: "User requested cancellation",
        cancelAtPeriodEnd: true,
      });
      alert("Đã hủy gói đăng ký thành công");
      fetchSubscription();
    } catch (error) {
      console.error("Error canceling subscription:", error);
      alert("Có lỗi xảy ra khi hủy gói đăng ký");
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-[#604B3B]">Đang tải...</div>
      </div>
    );
  }

  if (!user) return null;

  const tabs = [
    { id: "profile" as TabType, label: "Thông tin cá nhân", icon: "👤" },
    { id: "subscription" as TabType, label: "Gói đăng ký", icon: "💳" },
    { id: "payment" as TabType, label: "Lịch sử thanh toán", icon: "📊" },
    { id: "creator" as TabType, label: "Trở thành Creator", icon: "✨" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FBE7BA]/20 to-white py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#604B3B] sm:text-4xl">
            Tài khoản của tôi
          </h1>
          <p className="mt-2 text-[#604B3B]/70">
            Quản lý thông tin cá nhân và đăng ký
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex flex-wrap justify-center gap-2 sm:gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveTab(tab.id);
              }}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all sm:px-6 sm:py-3 sm:text-base ${
                activeTab === tab.id
                  ? "bg-[#604B3B] text-white shadow-lg"
                  : "bg-white text-[#604B3B] hover:bg-[#FBE7BA]/30"
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4 border-b border-[#604B3B]/10 pb-8">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#FBE7BA] text-4xl font-bold text-[#604B3B]">
                  {user.fullName?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-[#604B3B]">{user.fullName}</h2>
                  <p className="text-sm text-[#604B3B]/70">{user.email}</p>
                </div>
              </div>

              {/* Profile Information */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-[#604B3B]">
                    Thông tin cá nhân
                  </h3>
                  {!isEditingProfile && (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="rounded-lg bg-[#D0BF98] px-4 py-2 text-sm font-medium text-[#604B3B] transition-colors hover:bg-[#c9b083]"
                    >
                      Chỉnh sửa
                    </button>
                  )}
                </div>

                {isEditingProfile ? (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#604B3B]">
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        value={editedProfile.fullName}
                        onChange={(e) =>
                          setEditedProfile({ ...editedProfile, fullName: e.target.value })
                        }
                        className="w-full rounded-lg border border-[#D0BF98] px-4 py-2 text-[#604B3B] focus:border-[#604B3B] focus:outline-none focus:ring-2 focus:ring-[#604B3B]/20"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#604B3B]">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editedProfile.email}
                        disabled
                        className="w-full rounded-lg border border-[#D0BF98] bg-gray-50 px-4 py-2 text-[#604B3B]/50"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#604B3B]">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        value={editedProfile.phoneNumber}
                        onChange={(e) =>
                          setEditedProfile({ ...editedProfile, phoneNumber: e.target.value })
                        }
                        className="w-full rounded-lg border border-[#D0BF98] px-4 py-2 text-[#604B3B] focus:border-[#604B3B] focus:outline-none focus:ring-2 focus:ring-[#604B3B]/20"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#604B3B]">
                        Địa chỉ
                      </label>
                      <textarea
                        value={editedProfile.address}
                        onChange={(e) =>
                          setEditedProfile({ ...editedProfile, address: e.target.value })
                        }
                        rows={3}
                        className="w-full rounded-lg border border-[#D0BF98] px-4 py-2 text-[#604B3B] focus:border-[#604B3B] focus:outline-none focus:ring-2 focus:ring-[#604B3B]/20"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveProfile}
                        className="flex-1 rounded-lg bg-[#604B3B] px-4 py-2 font-medium text-white transition-colors hover:bg-[#4a3a2d]"
                      >
                        Lưu thay đổi
                      </button>
                      <button
                        onClick={() => setIsEditingProfile(false)}
                        className="flex-1 rounded-lg border border-[#D0BF98] px-4 py-2 font-medium text-[#604B3B] transition-colors hover:bg-[#FBE7BA]/30"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <InfoRow label="Họ và tên" value={user.fullName || "Chưa cập nhật"} />
                    <InfoRow label="Email" value={user.email || "Chưa cập nhật"} />
                    <InfoRow label="Số điện thoại" value={user.phoneNumber || "Chưa cập nhật"} />
                    <InfoRow label="Địa chỉ" value={user.address || "Chưa cập nhật"} />
                  </div>
                )}
              </div>

              {/* Change Password */}
              <div className="space-y-4 border-t border-[#604B3B]/10 pt-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-[#604B3B]">
                    Đổi mật khẩu
                  </h3>
                  {!isChangingPassword && (
                    <button
                      onClick={() => setIsChangingPassword(true)}
                      className="rounded-lg bg-[#D0BF98] px-4 py-2 text-sm font-medium text-[#604B3B] transition-colors hover:bg-[#c9b083]"
                    >
                      Đổi mật khẩu
                    </button>
                  )}
                </div>

                {isChangingPassword && (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#604B3B]">
                        Mật khẩu hiện tại
                      </label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, currentPassword: e.target.value })
                        }
                        className="w-full rounded-lg border border-[#D0BF98] px-4 py-2 text-[#604B3B] focus:border-[#604B3B] focus:outline-none focus:ring-2 focus:ring-[#604B3B]/20"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#604B3B]">
                        Mật khẩu mới
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, newPassword: e.target.value })
                        }
                        className="w-full rounded-lg border border-[#D0BF98] px-4 py-2 text-[#604B3B] focus:border-[#604B3B] focus:outline-none focus:ring-2 focus:ring-[#604B3B]/20"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[#604B3B]">
                        Xác nhận mật khẩu mới
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                        }
                        className="w-full rounded-lg border border-[#D0BF98] px-4 py-2 text-[#604B3B] focus:border-[#604B3B] focus:outline-none focus:ring-2 focus:ring-[#604B3B]/20"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleChangePassword}
                        className="flex-1 rounded-lg bg-[#604B3B] px-4 py-2 font-medium text-white transition-colors hover:bg-[#4a3a2d]"
                      >
                        Đổi mật khẩu
                      </button>
                      <button
                        onClick={() => {
                          setIsChangingPassword(false);
                          setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                        }}
                        className="flex-1 rounded-lg border border-[#D0BF98] px-4 py-2 font-medium text-[#604B3B] transition-colors hover:bg-[#FBE7BA]/30"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Subscription Tab */}
          {activeTab === "subscription" && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-[#604B3B]">
                Gói đăng ký hiện tại
              </h3>

              {isLoadingSubscription ? (
                <div className="py-12 text-center text-[#604B3B]/70">
                  Đang tải thông tin đăng ký...
                </div>
              ) : subscription ? (
                <div className="space-y-6">
                  {/* Current Subscription Card */}
                  <div className="rounded-xl border-2 border-[#604B3B] bg-gradient-to-br from-[#FBE7BA]/30 to-white p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h4 className="text-xl font-bold text-[#604B3B]">
                          {subscription.planName}
                        </h4>
                        <p className="text-sm text-[#604B3B]/70">
                          {getSubscriptionStatusText(subscription.subscriptionStatus)}
                        </p>
                      </div>
                      <div className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        subscription.subscriptionStatus === 2
                          ? "bg-green-100 text-green-700"
                          : subscription.subscriptionStatus === 3
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {getSubscriptionStatusBadge(subscription.subscriptionStatus)}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      {subscriptionPlan && (
                        <>
                          <InfoRow
                            label="Giá"
                            value={subscriptionService.formatPrice(subscriptionPlan.amount, subscriptionPlan.currency)}
                          />
                          <InfoRow
                            label="Chu kỳ"
                            value={subscriptionService.getBillingPeriodText(
                              subscriptionPlan.billingPeriodCount,
                              subscriptionPlan.billingPeriodUnit
                            )}
                          />
                        </>
                      )}
                      {subscription.currentPeriodStart && (
                        <InfoRow
                          label="Bắt đầu"
                          value={new Date(subscription.currentPeriodStart).toLocaleDateString("vi-VN")}
                        />
                      )}
                      {subscription.currentPeriodEnd && (
                        <InfoRow
                          label="Kết thúc"
                          value={new Date(subscription.currentPeriodEnd).toLocaleDateString("vi-VN")}
                        />
                      )}
                    </div>

                    {subscription.subscriptionStatus === 2 && (
                      <div className="mt-6 flex gap-3">
                        <button
                          onClick={() => router.push("/subscription")}
                          className="flex-1 rounded-lg bg-[#604B3B] px-4 py-2 font-medium text-white transition-colors hover:bg-[#4a3a2d]"
                        >
                          Nâng cấp
                        </button>
                        <button
                          onClick={handleCancelSubscription}
                          className="flex-1 rounded-lg border border-red-500 px-4 py-2 font-medium text-red-500 transition-colors hover:bg-red-50"
                        >
                          Hủy đăng ký
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Subscription Features */}
                  {subscriptionPlan?.featureConfig && (
                    <div className="rounded-xl bg-[#FBE7BA]/20 p-6">
                      <h4 className="mb-4 font-semibold text-[#604B3B]">
                        Tính năng gói đăng ký
                      </h4>
                      <ul className="space-y-2">
                        {subscriptionService.getFeaturesArray(subscriptionPlan.featureConfig).map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-[#604B3B]">
                            <span className="text-green-600">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="mb-4 text-[#604B3B]/70">
                    Bạn chưa có gói đăng ký nào
                  </p>
                  <button
                    onClick={() => router.push("/subscription")}
                    className="rounded-lg bg-[#604B3B] px-6 py-3 font-medium text-white transition-colors hover:bg-[#4a3a2d]"
                  >
                    Xem các gói đăng ký
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Payment History Tab */}
          {activeTab === "payment" && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-[#604B3B]">
                Lịch sử thanh toán
              </h3>
              <div className="py-12 text-center text-[#604B3B]/70">
                Tính năng đang được phát triển
              </div>
            </div>
          )}

          {/* Creator Application Tab */}
          {activeTab === "creator" && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-[#604B3B]">
                {creatorApplication ? "Trạng thái đơn đăng ký" : "Đăng ký trở thành Content Creator"}
              </h3>

              {isLoadingCreatorApp ? (
                <div className="py-12 text-center text-[#604B3B]/70">
                  Đang tải thông tin...
                </div>
              ) : creatorApplication ? (
                // Show application status
                <div className="space-y-6">
                  {/* Status Card */}
                  <div className="rounded-xl border-2 border-[#604B3B] bg-gradient-to-br from-[#FBE7BA]/30 to-white p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h4 className="text-xl font-bold text-[#604B3B]">
                          Đơn đăng ký của bạn
                        </h4>
                        <p className="mt-1 text-sm text-[#604B3B]/70">
                          {creatorApplication.statusDescription}
                        </p>
                      </div>
                      <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                        creatorService.getStatusBadgeColor(creatorApplication.status)
                      }`}>
                        <span>{creatorService.getStatusIcon(creatorApplication.status)}</span>
                        <span>{creatorApplication.status}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      {creatorApplication.submittedAt && (
                        <InfoRow
                          label="Ngày nộp đơn"
                          value={new Date(creatorApplication.submittedAt).toLocaleDateString("vi-VN")}
                        />
                      )}
                      {creatorApplication.reviewedAt && (
                        <InfoRow
                          label="Ngày xét duyệt"
                          value={new Date(creatorApplication.reviewedAt).toLocaleDateString("vi-VN")}
                        />
                      )}
                      {creatorApplication.rejectionReason && (
                        <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4">
                          <p className="font-semibold text-red-700">Lý do từ chối:</p>
                          <p className="text-red-600">{creatorApplication.rejectionReason}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Application Details */}
                  <div className="rounded-xl bg-[#FBE7BA]/20 p-6">
                    <h4 className="mb-4 font-semibold text-[#604B3B]">
                      Thông tin đơn đăng ký
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-[#604B3B]/70 mb-1">
                          Kinh nghiệm
                        </p>
                        <p className="text-sm text-[#604B3B] whitespace-pre-wrap">
                          {creatorApplication.experience}
                        </p>
                      </div>

                      {creatorApplication.portfolio && (
                        <div>
                          <p className="text-sm font-semibold text-[#604B3B]/70 mb-1">
                            Portfolio
                          </p>
                          <a
                            href={creatorApplication.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[#604B3B] underline hover:text-[#826B39]"
                          >
                            {creatorApplication.portfolio}
                          </a>
                        </div>
                      )}

                      <div>
                        <p className="text-sm font-semibold text-[#604B3B]/70 mb-1">
                          Động lực
                        </p>
                        <p className="text-sm text-[#604B3B] whitespace-pre-wrap">
                          {creatorApplication.motivation}
                        </p>
                      </div>

                      {creatorApplication.socialMedia && creatorApplication.socialMedia.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold text-[#604B3B]/70 mb-2">
                            Mạng xã hội
                          </p>
                          <div className="space-y-1">
                            {creatorApplication.socialMedia.map((link, index) => (
                              <a
                                key={index}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-sm text-[#604B3B] underline hover:text-[#826B39]"
                              >
                                {link}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {creatorApplication.additionalInfo && (
                        <div>
                          <p className="text-sm font-semibold text-[#604B3B]/70 mb-1">
                            Thông tin bổ sung
                          </p>
                          <p className="text-sm text-[#604B3B] whitespace-pre-wrap">
                            {creatorApplication.additionalInfo}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action based on status */}
                  {creatorApplication.status === "Rejected" && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowApplicationForm(true);
                      }}
                      className="w-full rounded-lg bg-[#604B3B] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#4a3a2d]"
                    >
                      Nộp đơn lại
                    </button>
                  )}
                  
                  {creatorApplication.status === "Pending" && (
                    <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 text-center text-sm text-yellow-700">
                      Đơn của bạn đang được xem xét. Chúng tôi sẽ phản hồi trong vòng 3-5 ngày làm việc.
                    </div>
                  )}

                  {creatorApplication.status === "Approved" && (
                    <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                      <p className="text-center text-sm text-green-700 mb-3">
                        🎉 Chúc mừng! Bạn đã trở thành Content Creator của Healink
                      </p>
                      <button
                        onClick={() => router.push("/creator/dashboard")}
                        className="w-full rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700"
                      >
                        Đi tới Creator Dashboard
                      </button>
                    </div>
                  )}
                </div>
              ) : showApplicationForm ? (
                // Show application form
                <CreatorApplicationForm
                  onSuccess={handleApplicationSuccess}
                  onCancel={() => setShowApplicationForm(false)}
                />
              ) : (
                // Show initial state - benefits and apply button
                <>
                  <div className="rounded-xl bg-gradient-to-br from-[#FBE7BA]/30 to-white p-6">
                    <h4 className="mb-4 text-lg font-semibold text-[#604B3B]">
                      Lợi ích khi trở thành Creator
                    </h4>
                    <ul className="space-y-3">
                      {[
                        "Tạo và xuất bản podcast của riêng bạn",
                        "Kiếm tiền từ nội dung của bạn",
                        "Tiếp cận hàng triệu người nghe",
                        "Công cụ phân tích chi tiết",
                        "Hỗ trợ từ đội ngũ Healink",
                      ].map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-xl">✨</span>
                          <span className="text-[#604B3B]">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border-2 border-[#D0BF98] bg-white p-6">
                    <h4 className="mb-4 text-lg font-semibold text-[#604B3B]">
                      Yêu cầu
                    </h4>
                    <ul className="space-y-2 text-sm text-[#604B3B]/80">
                      <li>• Có kinh nghiệm tạo nội dung âm thanh</li>
                      <li>• Portfolio hoặc mẫu podcast mẫu</li>
                      <li>• Cam kết tạo nội dung chất lượng</li>
                      <li>• Tuân thủ quy định cộng đồng</li>
                    </ul>
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowApplicationForm(true);
                    }}
                    className="w-full rounded-lg bg-[#604B3B] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#4a3a2d]"
                  >
                    Nộp đơn đăng ký
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper Components
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-[#604B3B]/10 py-3">
      <span className="font-medium text-[#604B3B]/70">{label}</span>
      <span className="text-[#604B3B]">{value}</span>
    </div>
  );
}

// Helper Functions
function getSubscriptionStatusText(status: number): string {
  switch (status) {
    case 1:
      return "Đang chờ";
    case 2:
      return "Đang hoạt động";
    case 3:
      return "Đã hủy";
    case 4:
      return "Hết hạn";
    case 5:
      return "Đã tạm dừng";
    default:
      return "Không xác định";
  }
}

function getSubscriptionStatusBadge(status: number): string {
  switch (status) {
    case 1:
      return "Chờ";
    case 2:
      return "Hoạt động";
    case 3:
      return "Đã hủy";
    case 4:
      return "Hết hạn";
    case 5:
      return "Tạm dừng";
    default:
      return "N/A";
  }
}
