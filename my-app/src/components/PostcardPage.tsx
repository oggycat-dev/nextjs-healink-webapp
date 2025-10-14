"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { podcastService } from "@/services/podcast.service";
import type { PodcastItem, PodcastCategory } from "@/types/podcast.types";
import AudioPlayer from "./AudioPlayer";

interface FlashCard {
  id: number;
  quote: string;
  author: string;
  role: string;
}

const flashCards: FlashCard[] = [
  {
    id: 1,
    quote: "Bạn là nhà,\nđừng bỏ rơi\nchính mình.",
    author: "Trần Văn A",
    role: "Bác sĩ tâm lý",
  },
  {
    id: 2,
    quote: "Hãy sống chậm lại,\nđể cảm nhận từng\nkhoảnh khắc.",
    author: "Nguyễn Thị B",
    role: "Chuyên gia tâm lý",
  },
  {
    id: 3,
    quote: "Yêu thương bản thân\nlà hành trình\nlâu dài.",
    author: "Phạm Văn C",
    role: "Nhà tâm lý học",
  },
];

export default function PostcardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [trendingPodcasts, setTrendingPodcasts] = useState<PodcastItem[]>([]);
  const [newPodcasts, setNewPodcasts] = useState<PodcastItem[]>([]);
  const [categories, setCategories] = useState<PodcastCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryPodcasts, setCategoryPodcasts] = useState<PodcastItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPodcast, setSelectedPodcast] = useState<PodcastItem | null>(null);

  // Check authentication
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch initial data
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch trending and new podcasts
        const [trending, newReleases] = await Promise.all([
          podcastService.getTrendingPodcasts(9).catch((err) => {
            console.log("No trending podcasts:", err);
            return [];
          }),
          podcastService.getNewReleases(9).catch((err) => {
            console.log("No new podcasts:", err);
            return [];
          }),
        ]);

        setTrendingPodcasts(trending);
        setNewPodcasts(newReleases);

        // Try to fetch categories separately (optional)
        try {
          const categoriesData = await podcastService.getCategories({ pageSize: 10 });
          setCategories(categoriesData.items);
        } catch (err) {
          console.log("Categories not available:", err);
          // Categories are optional, continue without them
        }

        // If no data available, show message
        if (trending.length === 0 && newReleases.length === 0) {
          setError("Chưa có podcast nào. Hãy quay lại sau!");
        }
      } catch (err) {
        console.error("Error fetching podcasts:", err);
        setError("Không thể tải podcasts. Vui lòng kiểm tra kết nối backend.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  // Fetch podcasts by category when category is selected
  useEffect(() => {
    if (!isAuthenticated || !selectedCategory) {
      setCategoryPodcasts([]);
      return;
    }

    const fetchCategoryPodcasts = async () => {
      try {
        const podcasts = await podcastService.getPodcastsByCategory(
          selectedCategory,
          9
        );
        setCategoryPodcasts(podcasts);
      } catch (err) {
        console.error("Error fetching category podcasts:", err);
      }
    };

    fetchCategoryPodcasts();
  }, [selectedCategory]);

  const sections = [
    { title: "Podcast thịnh hành", id: "trending", podcasts: trendingPodcasts },
    { title: "Vừa ra mắt", id: "new", podcasts: newPodcasts },
    ...(selectedCategory && categoryPodcasts.length > 0
      ? [
          {
            title: categories.find((c) => c.id === selectedCategory)?.displayName || "Danh mục",
            id: "category",
            podcasts: categoryPodcasts,
          },
        ]
      : []),
  ];

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#604B3B] border-t-transparent mx-auto"></div>
          <p className="text-[#604B3B]">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    );
  }

  // Don't render content if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-[#604B3B] px-6 py-2 text-white hover:bg-[#4d3c2f]"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="mx-auto max-w-[1440px] px-6">
        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`whitespace-nowrap rounded-full px-6 py-2 text-sm font-medium transition-colors ${
                !selectedCategory
                  ? "bg-[#604B3B] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Tất cả
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`whitespace-nowrap rounded-full px-6 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? "bg-[#604B3B] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.displayName}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-8">
          {/* Left Sidebar - Flashcards */}
          <div className="w-[427px] flex-shrink-0 space-y-8">
            {flashCards.map((card) => (
              <div
                key={card.id}
                className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#F5E6D3] to-[#E8D4BA] p-8 shadow-lg"
              >
                <div className="relative z-10 flex flex-col items-center text-center">
                  <p className="whitespace-pre-line text-2xl font-bold leading-tight text-[#2B3F6C]">
                    {card.quote}
                  </p>
                  <div className="mt-8 space-y-1">
                    <p className="text-base font-semibold text-[#604B3B]">
                      {card.author}
                    </p>
                    <p className="text-sm text-[#604B3B]/70">{card.role}</p>
                  </div>
                </div>
                <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-white/20" />
                <div className="absolute -bottom-6 -left-6 h-40 w-40 rounded-full bg-white/10" />
              </div>
            ))}
          </div>

          {/* Main Content - Podcast Sections */}
          <div className="flex-1 space-y-16">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#604B3B] border-r-transparent"></div>
              </div>
            ) : (
              sections.map((section, sectionIndex) => {
                if (!section.podcasts || section.podcasts.length === 0) {
                  return null;
                }

                return (
                  <div key={section.id} className="space-y-8">
                    {/* Section Title */}
                    <div className="flex items-center justify-between">
                      <h2 className="flex-1 text-center text-4xl font-black text-[#000000]">
                        {section.title}
                      </h2>
                      <button className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-black transition-colors duration-200 hover:bg-black hover:text-white">
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Podcast Grid */}
                    <div className="grid grid-cols-3 gap-6">
                      {section.podcasts.map((podcast) => (
                        <div
                          key={podcast.id}
                          className="group cursor-pointer transition-transform duration-200 hover:-translate-y-1"
                          onClick={() => {
                            if (podcast.audioUrl) {
                              setSelectedPodcast(podcast);
                            } else {
                              alert('Audio URL không có sẵn');
                            }
                          }}
                        >
                          {/* Podcast Cover */}
                          <div className="relative mb-4 overflow-hidden rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg">
                            <div className="relative aspect-square">
                              {podcast.thumbnailUrl ? (
                                <Image
                                  src={podcast.thumbnailUrl}
                                  alt={podcast.title}
                                  fill
                                  priority={false}
                                  unoptimized
                                  className="object-cover transition-transform duration-300 group-hover:scale-105 z-10"
                                />
                              ) : null}
                              {/* Fallback placeholder - always show under the image */}
                              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#D0BF98] to-[#B99B5C]">
                                <svg
                                  className="h-20 w-20 text-white/50"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                                  />
                                </svg>
                              </div>
                            </div>

                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/30 group-hover:opacity-100">
                              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
                                <svg
                                  className="h-8 w-8 text-[#604B3B]"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            </div>

                            {/* Duration Badge */}
                            {podcast.duration && (
                              <div className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                                {podcast.duration}
                              </div>
                            )}
                          </div>

                          {/* Podcast Info */}
                          <div className="space-y-2 px-2">
                            <h3 className="line-clamp-2 text-lg font-bold leading-tight text-[#000000] group-hover:text-[#604B3B]">
                              {podcast.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {podcast.hostName || 'Unknown Host'}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                                {(podcast.viewCount || 0).toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                  />
                                </svg>
                                {(podcast.likeCount || 0).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}

            {!isLoading && sections.every(s => !s.podcasts || s.podcasts.length === 0) && (
              <div className="py-20 text-center">
                <p className="text-gray-500">Chưa có podcast nào</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Audio Player Fullscreen */}
      {selectedPodcast && (
        <AudioPlayer
          podcast={selectedPodcast}
          onClose={() => setSelectedPodcast(null)}
        />
      )}
    </div>
  );
}
