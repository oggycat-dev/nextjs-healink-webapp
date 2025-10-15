"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface UploadPodcastFormProps {
  onSuccess: () => void;
}

export default function UploadPodcastForm({ onSuccess }: UploadPodcastFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(0);
  const [hostName, setHostName] = useState("");
  const [guestName, setGuestName] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState<number | undefined>();
  const [seriesName, setSeriesName] = useState("");
  const [transcriptUrl, setTranscriptUrl] = useState("");
  const [tags, setTags] = useState<string>("");
  const [emotionCategories, setEmotionCategories] = useState<number[]>([]);
  const [topicCategories, setTopicCategories] = useState<number[]>([]);

  // Emotion categories matching backend enum
  const emotionOptions = [
    { label: "Hạnh phúc", value: 1 }, // Happiness
    { label: "Buồn bã", value: 2 }, // Sadness
    { label: "Lo âu", value: 3 }, // Anxiety
    { label: "Tức giận", value: 4 }, // Anger
    { label: "Sợ hãi", value: 5 }, // Fear
    { label: "Yêu thương", value: 6 }, // Love
    { label: "Hy vọng", value: 7 }, // Hope
    { label: "Biết ơn", value: 8 }, // Gratitude
    { label: "Chánh niệm", value: 9 }, // Mindfulness
    { label: "Tự thương", value: 10 }, // SelfCompassion
  ];

  // Topic categories matching backend enum
  const topicOptions = [
    { label: "Sức khỏe tâm thần", value: 1 }, // MentalHealth
    { label: "Mối quan hệ", value: 2 }, // Relationships
    { label: "Chăm sóc bản thân", value: 3 }, // SelfCare
    { label: "Chánh niệm", value: 4 }, // Mindfulness
    { label: "Phát triển bản thân", value: 5 }, // PersonalGrowth
    { label: "Cân bằng công việc", value: 6 }, // WorkLifeBalance
    { label: "Căng thẳng", value: 7 }, // Stress
    { label: "Trầm cảm", value: 8 }, // Depression
    { label: "Lo âu", value: 9 }, // Anxiety
    { label: "Trị liệu", value: 10 }, // Therapy
  ];

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      
      // Get duration from audio file
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.onloadedmetadata = () => {
        setDuration(Math.floor(audio.duration));
        URL.revokeObjectURL(audio.src);
      };
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Vui lòng nhập tiêu đề");
      return;
    }
    if (!description.trim()) {
      setError("Vui lòng nhập mô tả");
      return;
    }
    if (!audioFile) {
      setError("Vui lòng chọn file audio");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("Title", title.trim());
      formData.append("Description", description.trim());
      formData.append("AudioFile", audioFile);
      formData.append("Duration", duration.toString());
      
      if (thumbnailFile) {
        formData.append("ThumbnailFile", thumbnailFile);
      }
      if (hostName.trim()) {
        formData.append("HostName", hostName.trim());
      }
      if (guestName.trim()) {
        formData.append("GuestName", guestName.trim());
      }
      if (episodeNumber) {
        formData.append("EpisodeNumber", episodeNumber.toString());
      }
      if (seriesName.trim()) {
        formData.append("SeriesName", seriesName.trim());
      }
      if (transcriptUrl.trim()) {
        formData.append("TranscriptUrl", transcriptUrl.trim());
      }
      
      // Add tags
      if (tags.trim()) {
        tags.split(',').forEach(tag => {
          formData.append("Tags", tag.trim());
        });
      }
      
      // Add categories (convert enum numbers to strings for FormData)
      emotionCategories.forEach(cat => {
        formData.append("EmotionCategories", cat.toString());
      });
      topicCategories.forEach(cat => {
        formData.append("TopicCategories", cat.toString());
      });

      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:5010/api/content/creator/podcasts", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = "Failed to upload podcast";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.Message || JSON.stringify(errorData);
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = `Upload failed: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      
      // Show success notification
      setShowSuccess(true);
      
      // Redirect after 3 seconds
      setTimeout(() => {
        onSuccess();
      }, 3000);
      
    } catch (err: any) {
      console.error("Error uploading podcast:", err);
      setError(err.message || "Có lỗi xảy ra khi tải lên podcast");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const toggleEmotionCategory = (category: number) => {
    setEmotionCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleTopicCategory = (category: number) => {
    setTopicCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <>
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative mx-4 max-w-md rounded-2xl bg-white p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
            {/* Success Icon */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            {/* Success Message */}
            <div className="text-center">
              <h3 className="mb-2 text-2xl font-bold text-[#604B3B]">
                Tải lên thành công! 🎉
              </h3>
              <p className="mb-1 text-[#604B3B]/80">
                Podcast của bạn đã được tải lên thành công
              </p>
              <p className="text-sm text-[#604B3B]/60">
                Đang chờ phê duyệt (1-3 ngày làm việc)
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="mt-6">
              <div className="h-1 overflow-hidden rounded-full bg-green-100">
                <div className="h-full w-full animate-pulse bg-green-600" style={{ animation: 'progress 3s linear forwards' }}></div>
              </div>
              <p className="mt-2 text-center text-xs text-[#604B3B]/50">
                Tự động chuyển trang sau 3 giây...
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

      {uploadProgress > 0 && (
        <div className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-3">
          <div className="mb-2 text-sm text-blue-700">Đang tải lên... {uploadProgress}%</div>
          <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Title */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-[#604B3B]">
          Tiêu đề <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="VD: Tập 1: Cách quản lý cảm xúc tiêu cực"
          required
          className="w-full rounded-lg border border-[#D0BF98] px-4 py-3 text-[#604B3B] placeholder:text-[#D0BF98] focus:border-[#604B3B] focus:outline-none focus:ring-2 focus:ring-[#604B3B]/20"
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-[#604B3B]">
          Mô tả <span className="text-red-500">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Mô tả nội dung podcast của bạn..."
          rows={4}
          required
          className="w-full rounded-lg border border-[#D0BF98] px-4 py-3 text-[#604B3B] placeholder:text-[#D0BF98] focus:border-[#604B3B] focus:outline-none focus:ring-2 focus:ring-[#604B3B]/20"
        />
      </div>

      {/* Audio File */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-[#604B3B]">
          File âm thanh <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          accept="audio/mp3,audio/mpeg,audio/wav,audio/ogg,audio/m4a,audio/mp4,audio/m4a,.m4a"
          onChange={handleAudioChange}
          required
          className="w-full rounded-lg border border-[#D0BF98] px-4 py-3 text-[#604B3B] file:mr-4 file:rounded-full file:border-0 file:bg-[#604B3B] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#4a3a2d]"
        />
        <p className="mt-1 text-xs text-[#604B3B]/60">
          Định dạng: MP3, WAV, OGG, M4A, MP4. Tối đa 500MB
        </p>
        {audioFile && (
          <p className="mt-2 text-sm text-green-600">
            ✓ {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB) - Thời lượng: {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
          </p>
        )}
      </div>

      {/* Thumbnail */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-[#604B3B]">
          Ảnh bìa
        </label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/jpg,image/webp"
          onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
          className="w-full rounded-lg border border-[#D0BF98] px-4 py-3 text-[#604B3B] file:mr-4 file:rounded-full file:border-0 file:bg-[#D0BF98] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#604B3B] hover:file:bg-[#c9b083]"
        />
        <p className="mt-1 text-xs text-[#604B3B]/60">
          Định dạng: JPG, PNG, WEBP. Khuyến nghị: 1400x1400px
        </p>
        {thumbnailFile && (
          <p className="mt-2 text-sm text-green-600">
            ✓ {thumbnailFile.name}
          </p>
        )}
      </div>

      {/* Host & Guest */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#604B3B]">
            Người dẫn chương trình
          </label>
          <input
            type="text"
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            placeholder="VD: Tiến Sỹ Nguyễn Văn A"
            className="w-full rounded-lg border border-[#D0BF98] px-4 py-3 text-[#604B3B] placeholder:text-[#D0BF98] focus:border-[#604B3B] focus:outline-none focus:ring-2 focus:ring-[#604B3B]/20"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#604B3B]">
            Khách mời
          </label>
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="VD: Chuyên gia Trần Thị B"
            className="w-full rounded-lg border border-[#D0BF98] px-4 py-3 text-[#604B3B] placeholder:text-[#D0BF98] focus:border-[#604B3B] focus:outline-none focus:ring-2 focus:ring-[#604B3B]/20"
          />
        </div>
      </div>

      {/* Series & Episode */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#604B3B]">
            Tên Series
          </label>
          <input
            type="text"
            value={seriesName}
            onChange={(e) => setSeriesName(e.target.value)}
            placeholder="VD: Hành trình chữa lành"
            className="w-full rounded-lg border border-[#D0BF98] px-4 py-3 text-[#604B3B] placeholder:text-[#D0BF98] focus:border-[#604B3B] focus:outline-none focus:ring-2 focus:ring-[#604B3B]/20"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#604B3B]">
            Số tập
          </label>
          <input
            type="number"
            value={episodeNumber || ''}
            onChange={(e) => setEpisodeNumber(e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="VD: 1"
            min="1"
            className="w-full rounded-lg border border-[#D0BF98] px-4 py-3 text-[#604B3B] placeholder:text-[#D0BF98] focus:border-[#604B3B] focus:outline-none focus:ring-2 focus:ring-[#604B3B]/20"
          />
        </div>
      </div>

      {/* Transcript URL */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-[#604B3B]">
          Link transcript (bản ghi chép)
        </label>
        <input
          type="url"
          value={transcriptUrl}
          onChange={(e) => setTranscriptUrl(e.target.value)}
          placeholder="https://example.com/transcript.pdf"
          className="w-full rounded-lg border border-[#D0BF98] px-4 py-3 text-[#604B3B] placeholder:text-[#D0BF98] focus:border-[#604B3B] focus:outline-none focus:ring-2 focus:ring-[#604B3B]/20"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-[#604B3B]">
          Tags (phân cách bằng dấu phẩy)
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="VD: meditation, stress, mindfulness"
          className="w-full rounded-lg border border-[#D0BF98] px-4 py-3 text-[#604B3B] placeholder:text-[#D0BF98] focus:border-[#604B3B] focus:outline-none focus:ring-2 focus:ring-[#604B3B]/20"
        />
      </div>

      {/* Emotion Categories */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-[#604B3B]">
          Cảm xúc
        </label>
        <div className="flex flex-wrap gap-2">
          {emotionOptions.map((emotion) => (
            <button
              key={emotion.value}
              type="button"
              onClick={() => toggleEmotionCategory(emotion.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                emotionCategories.includes(emotion.value)
                  ? "bg-[#604B3B] text-white"
                  : "bg-[#FBE7BA]/30 text-[#604B3B] hover:bg-[#FBE7BA]/50"
              }`}
            >
              {emotion.label}
            </button>
          ))}
        </div>
      </div>

      {/* Topic Categories */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-[#604B3B]">
          Chủ đề
        </label>
        <div className="flex flex-wrap gap-2">
          {topicOptions.map((topic) => (
            <button
              key={topic.value}
              type="button"
              onClick={() => toggleTopicCategory(topic.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                topicCategories.includes(topic.value)
                  ? "bg-[#604B3B] text-white"
                  : "bg-[#FBE7BA]/30 text-[#604B3B] hover:bg-[#FBE7BA]/50"
              }`}
            >
              {topic.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-lg bg-[#604B3B] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#4a3a2d] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Đang tải lên..." : "Tải lên podcast"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="flex-1 rounded-lg border-2 border-[#D0BF98] px-6 py-3 font-semibold text-[#604B3B] transition-colors hover:bg-[#FBE7BA]/30 disabled:opacity-50"
        >
          Hủy
        </button>
      </div>

      <div className="rounded-lg bg-[#FBE7BA]/20 p-4 text-xs text-[#604B3B]/70">
        <strong>Lưu ý:</strong> Podcast của bạn sẽ được xem xét trước khi xuất bản. Thời gian duyệt: 1-3 ngày làm việc.
      </div>
    </form>

    <style jsx>{`
      @keyframes progress {
        from { width: 100%; }
        to { width: 0%; }
      }
    `}</style>
    </>
  );
}
