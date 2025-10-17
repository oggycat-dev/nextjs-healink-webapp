"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import UploadPodcastForm from "./UploadPodcastForm";
import { creatorService } from "@/services/creator.service";

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
  const [stats, setStats] = useState<null | {
    totalPodcasts: number;
    publishedPodcasts: number;
    pendingPodcasts: number;
    rejectedPodcasts: number;
    totalViews: number;
    totalLikes: number;
    topPodcasts: Array<{ id: string; title: string; viewCount: number; likeCount: number; publishedAt?: string }>
  }>(null);

  // Filters for statistics
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [seriesFilter, setSeriesFilter] = useState<string>("");

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
    if (activeTab === "statistics" && isAuthenticated) {
      fetchStats();
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

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await creatorService.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || "Không tải được thống kê");
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
              {/* Filters */}
              <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-4">
                <input
                  type="text"
                  placeholder="Tìm theo tên podcast"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-lg border border-[#D0BF98] px-3 py-2 text-sm text-[#604B3B] focus:border-[#604B3B] focus:outline-none focus:ring-2 focus:ring-[#604B3B]/20"
                />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="rounded-lg border border-[#D0BF98] px-3 py-2 text-sm text-[#604B3B] focus:border-[#604B3B] focus:outline-none focus:ring-2 focus:ring-[#604B3B]/20"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="rounded-lg border border-[#D0BF98] px-3 py-2 text-sm text-[#604B3B] focus:border-[#604B3B] focus:outline-none focus:ring-2 focus:ring-[#604B3B]/20"
                />
                <input
                  type="text"
                  placeholder="Lọc theo Series"
                  value={seriesFilter}
                  onChange={(e) => setSeriesFilter(e.target.value)}
                  className="rounded-lg border border-[#D0BF98] px-3 py-2 text-sm text-[#604B3B] focus:border-[#604B3B] focus:outline-none focus:ring-2 focus:ring-[#604B3B]/20"
                />
              </div>

              {/* Compute filtered data */}
              {(() => {
                const inRange = (d: string | undefined) => {
                  if (!d) return true;
                  const t = new Date(d).getTime();
                  if (startDate && t < new Date(startDate).getTime()) return false;
                  if (endDate && t > new Date(endDate + "T23:59:59").getTime()) return false;
                  return true;
                };

                const filtered = podcasts
                  .filter(p => (!searchTerm || p.title.toLowerCase().includes(searchTerm.toLowerCase())))
                  .filter(p => (!seriesFilter || (p.seriesName || "").toLowerCase().includes(seriesFilter.toLowerCase())))
                  .filter(p => inRange(p.publishedAt || p.createdAt));

                const topByViews = [...filtered]
                  .sort((a, b) => b.viewCount - a.viewCount)
                  .slice(0, 8);

                // Aggregate by month (YYYY-MM) using publishedAt or createdAt
                const buckets: Record<string, { views: number; likes: number } > = {};
                filtered.forEach(p => {
                  const dateStr = (p.publishedAt || p.createdAt).slice(0, 7);
                  if (!buckets[dateStr]) buckets[dateStr] = { views: 0, likes: 0 };
                  buckets[dateStr].views += p.viewCount || 0;
                  buckets[dateStr].likes += p.likeCount || 0;
                });
                const series = Object.keys(buckets).sort().map(key => ({ key, ...buckets[key] }));

                const maxView = Math.max(1, ...topByViews.map(p => p.viewCount));
                const maxLike = Math.max(1, ...topByViews.map(p => p.likeCount));

                return (
                  <>
                    {/* KPI cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="rounded-xl border border-[#D0BF98] bg-white p-6">
                        <div className="text-sm text-[#604B3B]/60">Tổng podcast (lọc)</div>
                        <div className="mt-2 text-3xl font-bold text-[#604B3B]">{filtered.length}</div>
                      </div>
                      <div className="rounded-xl border border-[#D0BF98] bg-white p-6">
                        <div className="text-sm text-[#604B3B]/60">Tổng lượt nghe (lọc)</div>
                        <div className="mt-2 text-3xl font-bold text-[#604B3B]">{filtered.reduce((s,p)=>s+p.viewCount,0)}</div>
                      </div>
                      <div className="rounded-xl border border-[#D0BF98] bg-white p-6">
                        <div className="text-sm text-[#604B3B]/60">Tổng lượt thích (lọc)</div>
                        <div className="mt-2 text-3xl font-bold text-[#604B3B]">{filtered.reduce((s,p)=>s+p.likeCount,0)}</div>
                      </div>
                    </div>

                    {/* Charts */}
                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                      {/* Bar chart: top by views */}
                      <div className="rounded-xl border border-[#D0BF98] bg-white p-6">
                        <div className="mb-4 text-lg font-semibold text-[#604B3B]">Top podcast theo lượt nghe</div>
                        {topByViews.length === 0 ? (
                          <div className="text-[#604B3B]/70">Chưa có dữ liệu</div>
                        ) : (
                          <div className="space-y-3">
                            {topByViews.map((p) => (
                              <div key={p.id} className="">
                                <div className="mb-1 flex items-center justify-between text-sm text-[#604B3B]">
                                  <span className="truncate pr-2">{p.title}</span>
                                  <span className="text-[#604B3B]/70">👁️ {p.viewCount} • ❤️ {p.likeCount}</span>
                                </div>
                                <div className="h-3 w-full rounded-full bg-[#FBE7BA]/50">
                                  <div
                                    className="h-3 rounded-full bg-[#604B3B]"
                                    style={{ width: `${(p.viewCount / maxView) * 100}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Simple line-area chart using SVG */}
                      <div className="rounded-xl border border-[#D0BF98] bg-white p-6">
                        <div className="mb-4 text-lg font-semibold text-[#604B3B]">Xu hướng theo tháng (nghe & thích)</div>
                        {series.length === 0 ? (
                          <div className="text-[#604B3B]/70">Chưa có dữ liệu</div>
                        ) : (
                          <ChartArea series={series} />
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}
              {isLoading ? (
                <div className="py-12 text-center text-[#604B3B]/70">Đang tải...</div>
              ) : error ? (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-600">{error}</div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-[#D0BF98] bg-white p-6">
                      <div className="text-sm text-[#604B3B]/60">Tổng podcast</div>
                      <div className="mt-2 text-3xl font-bold text-[#604B3B]">{stats?.totalPodcasts ?? 0}</div>
                    </div>
                    <div className="rounded-xl border border-[#D0BF98] bg-white p-6">
                      <div className="text-sm text-[#604B3B]/60">Tổng lượt nghe</div>
                      <div className="mt-2 text-3xl font-bold text-[#604B3B]">{stats?.totalViews ?? 0}</div>
                    </div>
                    <div className="rounded-xl border border-[#D0BF98] bg-white p-6">
                      <div className="text-sm text-[#604B3B]/60">Tổng lượt thích</div>
                      <div className="mt-2 text-3xl font-bold text-[#604B3B]">{stats?.totalLikes ?? 0}</div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#D0BF98] bg-white p-6">
                    <div className="mb-4 text-lg font-semibold text-[#604B3B]">Top podcast</div>
                    {stats?.topPodcasts?.length ? (
                      <div className="divide-y divide-[#FBE7BA]">
                        {stats.topPodcasts.map((p) => (
                          <div key={p.id} className="flex items-center justify-between py-3">
                            <div className="truncate pr-4 text-[#604B3B]">{p.title}</div>
                            <div className="flex gap-4 text-sm text-[#604B3B]/70">
                              <span>👁️ {p.viewCount}</span>
                              <span>❤️ {p.likeCount}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[#604B3B]/70">Chưa có dữ liệu</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ChartArea({ series }: { series: Array<{ key: string; views: number; likes: number }> }) {
  // Simple responsive SVG area/line chart
  const width = 600;
  const height = 220;
  const padding = 32;
  const maxY = Math.max(1, ...series.map(s => Math.max(s.views, s.likes)));

  const xStep = (width - padding * 2) / Math.max(1, series.length - 1);
  const y = (v: number) => height - padding - (v / maxY) * (height - padding * 2);

  const path = (key: 'views' | 'likes') => {
    return series
      .map((s, i) => `${i === 0 ? 'M' : 'L'} ${padding + i * xStep} ${y(s[key])}`)
      .join(' ');
  };

  return (
    <div className="overflow-x-auto">
      <svg width={width} height={height} className="min-w-[600px]">
        {/* Axes */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#D0BF98" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#D0BF98" />

        {/* Lines */}
        <path d={path('views')} fill="none" stroke="#604B3B" strokeWidth={2} />
        <path d={path('likes')} fill="none" stroke="#D0BF98" strokeWidth={2} />

        {/* Points */}
        {series.map((s, i) => (
          <>
            <circle key={`v-${i}`} cx={padding + i * xStep} cy={y(s.views)} r={3} fill="#604B3B" />
            <circle key={`l-${i}`} cx={padding + i * xStep} cy={y(s.likes)} r={3} fill="#D0BF98" />
            <text key={`t-${i}`} x={padding + i * xStep} y={height - padding + 14} textAnchor="middle" fontSize="10" fill="#604B3B">{s.key}</text>
          </>
        ))}
      </svg>
      <div className="mt-2 flex items-center gap-4 text-xs text-[#604B3B]/70">
        <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#604B3B] inline-block" /> Lượt nghe</div>
        <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#D0BF98] inline-block" /> Lượt thích</div>
      </div>
    </div>
  );
}
