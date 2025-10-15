"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";

interface EditPodcastFormProps {
  podcastId: string;
}

interface PodcastData {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  audioUrl: string;
  duration: string;
  transcriptUrl?: string;
  hostName?: string;
  guestName?: string;
  episodeNumber?: number;
  seriesName?: string;
  tags?: string[];
  emotionCategories?: number[];
  topicCategories?: number[];
}

export default function EditPodcastForm({ podcastId }: EditPodcastFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [podcast, setPodcast] = useState<PodcastData | null>(null);

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
  const [showSuccess, setShowSuccess] = useState(false);

  const emotionOptions = [
    { label: "Hạnh phúc", value: 1 }, // Happiness
    { label: "Buồn bã", value: 2 }, // Sadness
    { label: "Lo lắng", value: 3 }, // Anxiety
    { label: "Tức giận", value: 4 }, // Anger
    { label: "Sợ hãi", value: 5 }, // Fear
    { label: "Yêu thương", value: 6 }, // Love
    { label: "Hy vọng", value: 7 }, // Hope
    { label: "Biết ơn", value: 8 }, // Gratitude
    { label: "Chánh niệm", value: 9 }, // Mindfulness
    { label: "Tự thương yêu", value: 10 }, // SelfCompassion
  ];

  const topicOptions = [
    { label: "Sức khỏe tâm thần", value: 1 }, // MentalHealth
    { label: "Mối quan hệ", value: 2 }, // Relationships
    { label: "Tự chăm sóc", value: 3 }, // SelfCare
    { label: "Chánh niệm", value: 4 }, // Mindfulness
    { label: "Phát triển bản thân", value: 5 }, // PersonalGrowth
    { label: "Cân bằng công việc", value: 6 }, // WorkLifeBalance
    { label: "Căng thẳng", value: 7 }, // Stress
    { label: "Trầm cảm", value: 8 }, // Depression
    { label: "Lo âu", value: 9 }, // Anxiety
    { label: "Trị liệu", value: 10 }, // Therapy
  ];

  // Fetch podcast data
  useEffect(() => {
    fetchPodcast();
  }, [podcastId]);

  const fetchPodcast = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:5010/api/content/creator/podcasts/${podcastId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch podcast");
      }

      const data: PodcastData = await response.json();
      setPodcast(data);

      // Pre-fill form
      setTitle(data.title);
      setDescription(data.description);
      setHostName(data.hostName || "");
      setGuestName(data.guestName || "");
      setEpisodeNumber(data.episodeNumber);
      setSeriesName(data.seriesName || "");
      setTranscriptUrl(data.transcriptUrl || "");
      setTags(data.tags?.join(", ") || "");
      
      // Parse duration string to seconds
      if (data.duration) {
        const parts = data.duration.split(':');
        if (parts.length === 3) {
          const hours = parseInt(parts[0]);
          const mins = parseInt(parts[1]);
          const secs = parseInt(parts[2]);
          setDuration(hours * 3600 + mins * 60 + secs);
        } else if (parts.length === 2) {
          const mins = parseInt(parts[0]);
          const secs = parseInt(parts[1]);
          setDuration(mins * 60 + secs);
        } else {
          setDuration(parseInt(data.duration));
        }
      }

      // Set emotion categories (already numbers from API)
      if (data.emotionCategories && data.emotionCategories.length > 0) {
        setEmotionCategories(data.emotionCategories);
      }

      // Set topic categories (already numbers from API)
      if (data.topicCategories && data.topicCategories.length > 0) {
        setTopicCategories(data.topicCategories);
      }
    } catch (err: any) {
      console.error("Error fetching podcast:", err);
      setError(err.message || "Có lỗi xảy ra khi tải podcast");
    } finally {
      setIsLoading(false);
    }
  };

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

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("Title", title.trim());
      formData.append("Description", description.trim());
      formData.append("Duration", duration.toString());
      
      if (audioFile) {
        formData.append("AudioFile", audioFile);
      }
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
      
      // Add categories (convert numbers to strings for FormData)
      emotionCategories.forEach(cat => {
        formData.append("EmotionCategories", cat.toString());
      });
      topicCategories.forEach(cat => {
        formData.append("TopicCategories", cat.toString());
      });

      const token = localStorage.getItem("accessToken");
      const response = await fetch(`http://localhost:5010/api/content/creator/podcasts/${podcastId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update podcast");
      }

      // Show success notification
      setShowSuccess(true);
      
      // Redirect after 3 seconds
      setTimeout(() => {
        router.push("/creator/dashboard");
      }, 3000);
      
    } catch (err: any) {
      console.error("Error updating podcast:", err);
      setError(err.message || "Có lỗi xảy ra khi cập nhật podcast");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
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

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-[#604B3B]">Đang tải...</div>
      </div>
    );
  }

  if (error && !podcast) {
    return (
      <div className="py-12">
        <div className="mx-auto max-w-4xl px-4">
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-600">
            {error}
          </div>
        </div>
      </div>
    );
  }

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
                Cập nhật thành công! ✨
              </h3>
              <p className="mb-1 text-[#604B3B]/80">
                Podcast của bạn đã được cập nhật
              </p>
              <p className="text-sm text-[#604B3B]/60">
                Các thay đổi đã được lưu
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

      <div className="py-12">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#604B3B]">Chỉnh sửa Podcast</h1>
            <p className="mt-2 text-[#604B3B]/70">
              Cập nhật thông tin podcast của bạn
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                  {error}
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
                rows={4}
                required
                className="w-full rounded-lg border border-[#D0BF98] px-4 py-3 text-[#604B3B] placeholder:text-[#D0BF98] focus:border-[#604B3B] focus:outline-none focus:ring-2 focus:ring-[#604B3B]/20"
              />
            </div>

            {/* Current Audio */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#604B3B]">
                File âm thanh hiện tại
              </label>
              <div className="rounded-lg border border-[#D0BF98] bg-[#FBE7BA]/10 p-4">
                <audio controls className="w-full">
                  <source src={podcast?.audioUrl} type="audio/mpeg" />
                </audio>
                <p className="mt-2 text-xs text-[#604B3B]/60">
                  Thời lượng: {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
                </p>
              </div>
            </div>

            {/* Replace Audio File */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#604B3B]">
                Thay đổi file âm thanh (không bắt buộc)
              </label>
              <input
                type="file"
                accept="audio/mp3,audio/mpeg,audio/wav,audio/ogg,audio/m4a,audio/mp4"
                onChange={handleAudioChange}
                className="w-full rounded-lg border border-[#D0BF98] px-4 py-3 text-[#604B3B] file:mr-4 file:rounded-full file:border-0 file:bg-[#604B3B] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#4a3a2d]"
              />
              {audioFile && (
                <p className="mt-2 text-sm text-green-600">
                  ✓ {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            {/* Current Thumbnail */}
            {podcast?.thumbnailUrl && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#604B3B]">
                  Ảnh bìa hiện tại
                </label>
                <img
                  src={podcast.thumbnailUrl}
                  alt="Current thumbnail"
                  className="h-40 w-40 rounded-lg object-cover"
                />
              </div>
            )}

            {/* Replace Thumbnail */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#604B3B]">
                Thay đổi ảnh bìa (không bắt buộc)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                className="w-full rounded-lg border border-[#D0BF98] px-4 py-3 text-[#604B3B] file:mr-4 file:rounded-full file:border-0 file:bg-[#D0BF98] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#604B3B] hover:file:bg-[#c9b083]"
              />
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

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-lg bg-[#604B3B] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#4a3a2d] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Đang cập nhật..." : "Lưu thay đổi"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/creator/dashboard")}
                disabled={isSubmitting}
                className="flex-1 rounded-lg border-2 border-[#D0BF98] px-6 py-3 font-semibold text-[#604B3B] transition-colors hover:bg-[#FBE7BA]/30 disabled:opacity-50"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <style jsx>{`
      @keyframes progress {
        from { width: 100%; }
        to { width: 0%; }
      }
    `}</style>
    </>
  );
}
