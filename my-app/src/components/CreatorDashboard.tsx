"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import UploadPodcastForm from "./UploadPodcastForm";

type TabType = "my-podcasts" | "upload" | "statistics";

interface Podcast {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
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
  contentStatus: number;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  publishedAt?: string;
  createdBy: string;
}

export default function CreatorDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("my-podcasts");
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is ContentCreator
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth");
    }
    // Temporarily allow all authenticated users
    // } else if (!authLoading && isAuthenticated && !user?.roles?.includes('ContentCreator')) {
    //   router.push("/");
    // }
  }, [isAuthenticated, authLoading, user, router]);

  // Fetch creator's podcasts
  useEffect(() => {
    if (activeTab === "my-podcasts" && isAuthenticated) {
      fetchMyPodcasts();
    }
  }, [activeTab, isAuthenticated]);

  const fetchMyPodcasts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");
      }

      console.log("Fetching with token:", token.substring(0, 20) + "...");
      
      const response = await fetch("http://localhost:5010/api/content/creator/podcasts/my-podcasts?page=1&pageSize=50", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (response.status === 401) {
        throw new Error("Không có quyền truy cập. Vui lòng đăng ký làm Content Creator hoặc đăng nhập lại.");
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Lỗi tải podcast: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Response data:", data);
      setPodcasts(data.podcasts || []);
    } catch (err: any) {
      console.error("Error fetching podcasts:", err);
      setError(err.message || "Có lỗi xảy ra khi tải podcast");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (contentStatus: number) => {
    const statusMap: Record<number, { label: string; className: string }> = {
      0: { label: 'Nháp', className: 'bg-gray-100 text-gray-700' },
      1: { label: 'Chờ duyệt', className: 'bg-yellow-100 text-yellow-700' },
      2: { label: 'Đã duyệt', className: 'bg-green-100 text-green-700' },
      3: { label: 'Bị từ chối', className: 'bg-red-100 text-red-700' },
      4: { label: 'Đã xuất bản', className: 'bg-blue-100 text-blue-700' },
    };

    const statusInfo = statusMap[contentStatus] || { label: `Status ${contentStatus}`, className: 'bg-gray-100 text-gray-700' };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  const formatDuration = (duration: string) => {
    // Duration is in format "HH:MM:SS" or seconds
    if (typeof duration === 'string' && duration.includes(':')) {
      return duration;
    }
    // If it's a number string, convert to MM:SS
    const seconds = parseInt(duration);
    if (isNaN(seconds)) return duration;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-[#604B3B]">Đang tải...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Temporarily allow all authenticated users
  // if (!isAuthenticated || !user?.roles?.includes('ContentCreator')) {
  //   return null;
  // }

  const tabs = [
    { id: "my-podcasts" as TabType, label: "Podcast của tôi", icon: "🎙️" },
    { id: "upload" as TabType, label: "Tải lên podcast mới", icon: "⬆️" },
    { id: "statistics" as TabType, label: "Thống kê", icon: "📊" },
  ];

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#604B3B] sm:text-4xl">
            Quản lý nội dung
          </h1>
          <p className="mt-2 text-[#604B3B]/70">
            Tạo và quản lý podcast của bạn
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex flex-wrap justify-center gap-2 sm:gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={(e) => {
                e.preventDefault();
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
          {/* My Podcasts Tab */}
          {activeTab === "my-podcasts" && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#604B3B]">
                  Podcast của tôi ({podcasts.length})
                </h2>
                <button
                  onClick={() => setActiveTab("upload")}
                  className="rounded-lg bg-[#604B3B] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4a3a2d]"
                >
                  + Tải lên mới
                </button>
              </div>

              {isLoading ? (
                <div className="py-12 text-center text-[#604B3B]/70">
                  Đang tải...
                </div>
              ) : error ? (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-600">
                  {error}
                </div>
              ) : podcasts.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="mb-4 text-[#604B3B]/70">
                    Bạn chưa có podcast nào
                  </p>
                  <button
                    onClick={() => setActiveTab("upload")}
                    className="rounded-lg bg-[#604B3B] px-6 py-3 font-medium text-white transition-colors hover:bg-[#4a3a2d]"
                  >
                    Tải lên podcast đầu tiên
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {podcasts.map((podcast) => (
                    <div
                      key={podcast.id}
                      className="flex gap-4 rounded-lg border border-[#D0BF98] p-4 transition-colors hover:bg-[#FBE7BA]/10"
                    >
                      <img
                        src={podcast.thumbnailUrl || "/images/default-podcast.jpg"}
                        alt={podcast.title}
                        className="h-24 w-24 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="mb-2 flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-bold text-[#604B3B]">
                              {podcast.title}
                            </h3>
                            {podcast.seriesName && (
                              <p className="text-sm text-[#604B3B]/70">
                                {podcast.seriesName} - Tập {podcast.episodeNumber}
                              </p>
                            )}
                          </div>
                          {getStatusBadge(podcast.contentStatus)}
                        </div>
                        <p className="mb-2 line-clamp-2 text-sm text-[#604B3B]/70">
                          {podcast.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-[#604B3B]/60">
                          <span>⏱️ {formatDuration(podcast.duration)}</span>
                          <span>📅 {new Date(podcast.createdAt).toLocaleDateString("vi-VN")}</span>
                          {podcast.hostName && <span>🎤 {podcast.hostName}</span>}
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => router.push(`/creator/podcast/${podcast.id}/edit`)}
                            className="rounded-lg border border-[#604B3B] px-3 py-1.5 text-sm font-medium text-[#604B3B] transition-colors hover:bg-[#604B3B] hover:text-white"
                          >
                            Chỉnh sửa
                          </button>
                          <button
                            onClick={() => router.push(`/podcast/${podcast.id}`)}
                            className="rounded-lg border border-[#D0BF98] px-3 py-1.5 text-sm font-medium text-[#604B3B] transition-colors hover:bg-[#FBE7BA]/30"
                          >
                            Xem chi tiết
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === "upload" && (
            <div>
              <h2 className="mb-6 text-2xl font-bold text-[#604B3B]">
                Tải lên podcast mới
              </h2>
              <UploadPodcastForm 
                onSuccess={() => {
                  setActiveTab("my-podcasts");
                  fetchMyPodcasts();
                }}
              />
            </div>
          )}

          {/* Statistics Tab */}
          {activeTab === "statistics" && (
            <div>
              <h2 className="mb-6 text-2xl font-bold text-[#604B3B]">
                Thống kê
              </h2>
              <div className="rounded-lg bg-[#FBE7BA]/20 p-8 text-center">
                <p className="text-[#604B3B]">
                  Thống kê về lượt nghe, lượt thích, bình luận sẽ được hiển thị ở đây...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
