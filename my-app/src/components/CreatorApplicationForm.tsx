"use client";

import { useState, FormEvent } from "react";
import { creatorService } from "@/services/creator.service";
import type { SocialMediaLinks } from "@/types/creator.types";

interface CreatorApplicationFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CreatorApplicationForm({
  onSuccess,
  onCancel,
}: CreatorApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [experience, setExperience] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [motivation, setMotivation] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [socialMedia, setSocialMedia] = useState<SocialMediaLinks>({
    facebook: "",
    youtube: "",
    instagram: "",
    tiktok: "",
    twitter: "",
    website: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError(null);

    if (!experience.trim()) {
      setError("Vui lòng mô tả kinh nghiệm của bạn");
      return;
    }
    if (!motivation.trim()) {
      setError("Vui lòng chia sẻ động lực của bạn");
      return;
    }

    setIsSubmitting(true);

    try {
      const filteredSocialMedia: Record<string, string> = {};
      Object.entries(socialMedia).forEach(([key, value]) => {
        if (value.trim()) {
          filteredSocialMedia[key] = value.trim();
        }
      });

      const response = await creatorService.submitApplication({
        experience: experience.trim(),
        portfolio: portfolio.trim() || undefined,
        motivation: motivation.trim(),
        social_media: filteredSocialMedia,
        additional_info: additionalInfo.trim() || undefined,
      });

      console.log("API Response:", response);

      // Show success modal if we get a response (API call succeeded)
      setShowSuccessModal(true);
      
    } catch (err: any) {
      console.error("Error submitting application:", err);
      
      // Check if error message indicates success (API returned 200 but threw due to response format)
      if (err.message && err.message.includes("thành công")) {
        setShowSuccessModal(true);
      } else {
        setError(err.message || "Có lỗi xảy ra. Vui lòng thử lại sau.");
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 max-w-md rounded-2xl bg-white p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h3 className="mb-3 text-center text-2xl font-bold text-[#604B3B]">
              Đăng ký thành công! 🎉
            </h3>
            
            <p className="mb-6 text-center text-[#604B3B]/70">
              Đơn đăng ký làm Content Creator đã được nộp thành công. Chúng tôi sẽ xem xét và phản hồi trong vòng <strong>3-5 ngày làm việc</strong>.
            </p>
            
            <div className="mb-6 rounded-xl bg-[#FBE7BA]/30 p-4">
              <p className="text-sm text-[#604B3B]/80">
                <strong>Bước tiếp theo:</strong>
              </p>
              <ul className="mt-2 space-y-1 text-sm text-[#604B3B]/70">
                <li>✓ Kiểm tra email để nhận thông báo</li>
                <li>✓ Theo dõi trạng thái trong trang Profile</li>
                <li>✓ Chuẩn bị nội dung podcast đầu tiên</li>
              </ul>
            </div>
            
            <button
              onClick={() => {
                setShowSuccessModal(false);
                onSuccess();
              }}
              className="w-full rounded-lg bg-[#604B3B] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#4a3a2d]"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" id="creator-application-form">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600" id="error-message">
          {error}
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#604B3B]">
          Kinh nghiệm tạo nội dung <span className="text-red-500">*</span>
        </label>
        <textarea
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="Ví dụ: Có 2 năm kinh nghiệm làm podcaster, đã sản xuất hơn 50 tập podcast về chủ đề sức khỏe tinh thần..."
          rows={4}
          required
          className="w-full rounded-lg border border-[#D0BF98] px-4 py-3 text-[#604B3B] placeholder:text-[#D0BF98] focus:border-[#604B3B] focus:outline-none focus:ring-2 focus:ring-[#604B3B]/20"
        />
        <p className="mt-1 text-xs text-[#604B3B]/60">
          Mô tả chi tiết kinh nghiệm làm việc và tạo nội dung của bạn
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#604B3B]">
          Portfolio / Mẫu podcast
        </label>
        <input
          type="url"
          value={portfolio}
          onChange={(e) => setPortfolio(e.target.value)}
          placeholder="https://example.com/my-portfolio"
          className="w-full rounded-lg border border-[#D0BF98] px-4 py-3 text-[#604B3B] placeholder:text-[#D0BF98] focus:border-[#604B3B] focus:outline-none focus:ring-2 focus:ring-[#604B3B]/20"
        />
        <p className="mt-1 text-xs text-[#604B3B]/60">
          Link đến portfolio, website cá nhân, hoặc mẫu podcast của bạn
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#604B3B]">
          Động lực trở thành Creator <span className="text-red-500">*</span>
        </label>
        <textarea
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
          placeholder="Chia sẻ lý do bạn muốn trở thành Content Creator trên Healink và kế hoạch nội dung của bạn..."
          rows={4}
          required
          className="w-full rounded-lg border border-[#D0BF98] px-4 py-3 text-[#604B3B] placeholder:text-[#D0BF98] focus:border-[#604B3B] focus:outline-none focus:ring-2 focus:ring-[#604B3B]/20"
        />
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-[#604B3B]">
          Mạng xã hội (không bắt buộc)
        </h4>
        
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { key: "facebook" as const, label: "Facebook", icon: "📘" },
            { key: "youtube" as const, label: "YouTube", icon: "📺" },
            { key: "instagram" as const, label: "Instagram", icon: "📷" },
            { key: "tiktok" as const, label: "TikTok", icon: "🎵" },
            { key: "twitter" as const, label: "Twitter/X", icon: "🐦" },
            { key: "website" as const, label: "Website", icon: "🌐" },
          ].map(({ key, label, icon }) => (
            <div key={key}>
              <label className="mb-1 flex items-center gap-2 text-xs font-medium text-[#604B3B]/70">
                <span>{icon}</span>
                <span>{label}</span>
              </label>
              <input
                type="url"
                value={socialMedia[key]}
                onChange={(e) =>
                  setSocialMedia({ ...socialMedia, [key]: e.target.value })
                }
                placeholder={`https://${key === "website" ? "example.com" : key + ".com"}/your-profile`}
                className="w-full rounded-lg border border-[#D0BF98] px-3 py-2 text-sm text-[#604B3B] placeholder:text-[#D0BF98] focus:border-[#604B3B] focus:outline-none focus:ring-2 focus:ring-[#604B3B]/20"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#604B3B]">
          Thông tin bổ sung
        </label>
        <textarea
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          placeholder="Bất kỳ thông tin nào khác bạn muốn chia sẻ..."
          rows={3}
          className="w-full rounded-lg border border-[#D0BF98] px-4 py-3 text-[#604B3B] placeholder:text-[#D0BF98] focus:border-[#604B3B] focus:outline-none focus:ring-2 focus:ring-[#604B3B]/20"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 rounded-lg bg-[#604B3B] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#4a3a2d] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Đang gửi..." : "Nộp đơn đăng ký"}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onCancel();
          }}
          disabled={isSubmitting}
          className="flex-1 rounded-lg border-2 border-[#D0BF98] px-6 py-3 font-semibold text-[#604B3B] transition-colors hover:bg-[#FBE7BA]/30 disabled:opacity-50"
        >
          Hủy
        </button>
      </div>

      <div className="rounded-lg bg-[#FBE7BA]/20 p-4 text-xs text-[#604B3B]/70">
        Bằng cách nộp đơn, bạn đồng ý với{" "}
        <a href="#" className="text-[#604B3B] underline">
          điều khoản dịch vụ
        </a>{" "}
        và{" "}
        <a href="#" className="text-[#604B3B] underline">
          quy định cộng đồng
        </a>{" "}
        của Healink.
      </div>
    </form>
    </>
  );
}
