"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { podcastService } from "@/services/podcast.service";
import Image from "next/image";

interface PodcastDetailPageProps {
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
  viewCount: number;
  likeCount: number;
  createdAt: string;
  publishedAt?: string;
}

export default function PodcastDetailPage({ podcastId }: PodcastDetailPageProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [podcast, setPodcast] = useState<PodcastData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const viewTrackedRef = useRef(false); // Track if view has been incremented

  useEffect(() => {
    fetchPodcast();
  }, [podcastId]);

  // Increment view count when podcast is loaded
  useEffect(() => {
    if (podcast && !viewTrackedRef.current) {
      viewTrackedRef.current = true;
      podcastService.incrementView(podcastId);
    }
  }, [podcast, podcastId]);

  const fetchPodcast = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("accessToken");
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`http://localhost:5010/api/content/podcasts/${podcastId}`, {
        headers,
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Không tìm thấy podcast");
        }
        throw new Error(`Failed to fetch podcast: ${response.status}`);
      }

      const data: PodcastData = await response.json();
      setPodcast(data);
    } catch (err: any) {
      console.error("Error fetching podcast:", err);
      setError(err.message || "Có lỗi xảy ra khi tải podcast");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      router.push("/auth");
      return;
    }
    
    try {
      // Call API to toggle like
      const newLikeCount = await podcastService.toggleLike(podcastId);
      
      // Update UI
      setIsLiked(!isLiked);
      if (podcast) {
        setPodcast({ ...podcast, likeCount: newLikeCount });
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
      // Optionally show error message to user
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-[#604B3B]">Đang tải...</div>
      </div>
    );
  }

  if (error || !podcast) {
    return (
      <div className="py-12">
        <div className="mx-auto max-w-4xl px-4">
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-600">
            {error || "Không tìm thấy podcast"}
          </div>
          <button
            onClick={() => router.push("/podcast")}
            className="mt-4 text-[#604B3B] hover:underline"
          >
            ← Quay lại danh sách podcast
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Blurred Background */}
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${podcast.thumbnailUrl || "/images/default-podcast.jpg"})`,
            filter: 'blur(150px) saturate(0.8)',
            transform: 'scale(1.5)',
          }}
        />
        {/* Dark overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/80 to-black/90" />
      </div>

      {/* Content */}
      <div className="relative py-12">
        <div className="mx-auto max-w-6xl px-4">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-white/90 transition-colors hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại
          </button>

          {/* Main Player Card */}
          <div className="overflow-hidden rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 p-8 shadow-2xl md:p-12">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Left: Artwork */}
            <div className="flex items-center justify-center">
              <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src={podcast.thumbnailUrl || "/images/default-podcast.jpg"}
                  alt={podcast.title}
                  className="h-full w-full object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            </div>

            {/* Right: Info & Controls */}
            <div className="flex flex-col justify-between">
              {/* Episode Info */}
              <div>
                {podcast.seriesName && (
                  <div className="mb-3 inline-block rounded-full bg-[#FBE7BA]/20 px-4 py-1.5 text-sm font-medium text-[#FBE7BA]">
                    {podcast.seriesName} {podcast.episodeNumber && `• Tập ${podcast.episodeNumber}`}
                  </div>
                )}
                <h1 className="mb-4 text-4xl font-bold leading-tight text-white md:text-5xl">
                  {podcast.title}
                </h1>
                {podcast.hostName && (
                  <p className="mb-2 text-lg text-[#FBE7BA]/90">
                    🎙️ {podcast.hostName}
                  </p>
                )}
                {podcast.guestName && (
                  <p className="mb-4 text-lg text-[#FBE7BA]/90">
                    👤 Khách mời: {podcast.guestName}
                  </p>
                )}
                <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-white/70">
                  <span>{formatDate(podcast.publishedAt || podcast.createdAt)}</span>
                  <span>•</span>
                  <span>👁️ {podcast.viewCount.toLocaleString()} lượt nghe</span>
                  <span>•</span>
                  <span>❤️ {podcast.likeCount.toLocaleString()}</span>
                </div>
              </div>

              {/* Player Controls */}
              <div className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/20 accent-[#FBE7BA]"
                    style={{
                      background: `linear-gradient(to right, #FBE7BA 0%, #FBE7BA ${(currentTime / duration) * 100}%, rgba(255,255,255,0.2) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.2) 100%)`
                    }}
                  />
                  <div className="flex justify-between text-sm text-white/70">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={() => {
                      if (audioRef.current) audioRef.current.currentTime -= 15;
                    }}
                    className="group transition-transform hover:scale-110"
                    title="Lùi 15s"
                  >
                    <div className="rounded-full bg-white/10 p-3 backdrop-blur-sm transition-colors group-hover:bg-white/20">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                      </svg>
                    </div>
                  </button>

                  <button
                    onClick={togglePlayPause}
                    className="group transition-transform hover:scale-110"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FBE7BA] shadow-lg transition-all group-hover:bg-[#f0d89e] group-hover:shadow-xl">
                      {isPlaying ? (
                        <svg className="h-8 w-8 text-[#604B3B]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                      ) : (
                        <svg className="h-8 w-8 text-[#604B3B]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      if (audioRef.current) audioRef.current.currentTime += 15;
                    }}
                    className="group transition-transform hover:scale-110"
                    title="Tua 15s"
                  >
                    <div className="rounded-full bg-white/10 p-3 backdrop-blur-sm transition-colors group-hover:bg-white/20">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                      </svg>
                    </div>
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleLike}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all ${
                      isLiked
                        ? "bg-red-500 text-white shadow-lg shadow-red-500/50"
                        : "bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                    }`}
                  >
                    {isLiked ? "❤️" : "🤍"} {isLiked ? "Đã thích" : "Thích"}
                  </button>
                  {podcast.transcriptUrl && (
                    <a
                      href={podcast.transcriptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                    >
                      📄 Transcript
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Audio Element (hidden) */}
        <audio
          ref={audioRef}
          src={podcast.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />

        {/* Content Section */}
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-8 shadow-lg">
              <h2 className="mb-4 text-2xl font-bold text-white">Giới thiệu</h2>
              <p className="whitespace-pre-line leading-relaxed text-white/80">
                {podcast.description}
              </p>
            </div>

            {/* Tags */}
            {podcast.tags && podcast.tags.length > 0 && (
              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-8 shadow-lg">
                <h3 className="mb-4 text-xl font-bold text-white">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {podcast.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white border border-white/30 transition-colors hover:bg-white/30"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Share */}
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-bold text-white">Chia sẻ</h3>
              <div className="space-y-2">
                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1877F2] px-4 py-3 font-medium text-white transition-transform hover:scale-105">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 font-medium text-white transition-transform hover:scale-105">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </button>
                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#604B3B] px-4 py-3 font-medium text-white transition-transform hover:scale-105">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Copy link
                </button>
              </div>
            </div>

            {/* Related (placeholder) */}
            <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-bold text-white">Podcast liên quan</h3>
              <p className="text-sm text-white/60">Đang cập nhật...</p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
