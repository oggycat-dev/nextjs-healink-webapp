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

  // Form data
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
    e.stopPropagation(); // Prevent event bubbling
    setError(null);

    // Validation
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
      // Filter out empty social media links
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

      if (response.success) {
        alert("Đơn đăng ký đã được gửi thành công! Chúng tôi sẽ xem xét và phản hồi trong vòng 3-5 ngày làm việc.");
        onSuccess();
      } else {
        setError(response.message || "Có lỗi xảy ra khi gửi đơn đăng ký");
        // Scroll to error message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      console.error("Error submitting application:", err);
      setError(err.message || "Có lỗi xảy ra. Vui lòng thử lại sau.");
      // Scroll to error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" id="creator-application-form">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600" id="error-message">
          {error}
        </div>
      )}

      {/* Experience */}
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

      {/* Portfolio */}
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

      {/* Motivation */}
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

      {/* Social Media Links */}
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

      {/* Additional Info */}
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
        </textarea>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          onClick={(e) => {
            // Prevent any parent handlers from running
            e.stopPropagation();
          }}
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

      {/* Terms */}
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
  );
}
