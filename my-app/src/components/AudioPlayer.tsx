"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import type { PodcastItem } from "@/types/podcast.types";

interface AudioPlayerProps {
  podcast: PodcastItem;
  onClose: () => void;
}

export default function AudioPlayer({ podcast, onClose }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(podcast.likeCount || 0);
  const [viewCount, setViewCount] = useState(podcast.viewCount || 0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const time = parseFloat(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const vol = parseFloat(e.target.value);
    audio.volume = vol;
    setVolume(vol);
    setIsMuted(vol === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + seconds));
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-b from-[#604B3B] via-[#6B5646] to-[#4a3a2d] flex flex-col">
      {/* Audio element */}
      <audio ref={audioRef} src={podcast.audioUrl || ""} />

      {/* Header with close button */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center bg-gradient-to-b from-black/30 to-transparent z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors group"
          >
            <svg className="h-6 w-6 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Quay lại</span>
          </button>
        </div>
        <div className="text-sm text-white/70">Now Playing</div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center px-8 py-20">
        <div className="max-w-4xl w-full">
          <div className="grid md:grid-cols-5 gap-12 items-center">
            {/* Podcast artwork */}
            <div className="md:col-span-2">
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl transform transition-transform hover:scale-105">
                {podcast.thumbnailUrl ? (
                  <Image
                    src={podcast.thumbnailUrl}
                    alt={podcast.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#FBE7BA] via-[#D0BF98] to-[#B99B5C] flex flex-col items-center justify-center p-8">
                    <div className="relative w-full h-full flex items-center justify-center">
                      {/* Modern podcast icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-48 h-48 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                          <div className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                            <svg className="h-20 w-20 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                      {/* Decorative circles */}
                      <div className="absolute top-4 left-4 w-16 h-16 rounded-full bg-white/5 backdrop-blur-sm"></div>
                      <div className="absolute bottom-4 right-4 w-24 h-24 rounded-full bg-white/5 backdrop-blur-sm"></div>
                      <div className="absolute top-1/3 right-8 w-12 h-12 rounded-full bg-white/5 backdrop-blur-sm"></div>
                    </div>
                  </div>
                )}
                {/* Animated glow effect when playing */}
                {isPlaying && (
                  <div className="absolute inset-0 bg-gradient-to-t from-[#FBE7BA]/20 to-transparent animate-pulse"></div>
                )}
              </div>
            </div>

            {/* Podcast info & controls */}
            <div className="md:col-span-3 space-y-8">
              {/* Category badge */}
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#FBE7BA]/20 backdrop-blur-sm">
                <span className="text-sm font-medium text-[#FBE7BA]">Chủ đề: Tâm lý</span>
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                {podcast.title}
              </h1>

              {/* Host info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <svg className="w-7 h-7 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-base font-semibold text-white">
                    {podcast.hostName || "Unknown Host"}
                  </p>
                  {podcast.guestName && (
                    <p className="text-sm text-white/70">
                      Khách mời: {podcast.guestName}
                    </p>
                  )}
                </div>
              </div>

              {/* Stats - Views & Likes */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-white/70">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="text-sm font-medium">{viewCount.toLocaleString()}</span>
                </div>
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    isLiked 
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <svg className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-sm font-medium">{likeCount.toLocaleString()}</span>
                </button>
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="relative h-2 bg-white/10 rounded-full backdrop-blur-sm overflow-hidden group cursor-pointer">
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div
                    className="absolute h-full bg-gradient-to-r from-[#FBE7BA] to-[#D0BF98] rounded-full transition-all"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                  <div
                    className="absolute w-4 h-4 bg-white rounded-full top-1/2 -translate-y-1/2 -ml-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ left: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-white/70">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Main controls */}
              <div className="flex items-center justify-center gap-6">
                {/* Rewind 10s */}
                <button
                  onClick={() => skip(-10)}
                  className="group transition-transform hover:scale-110"
                  title="Lùi 10s"
                >
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center transition-colors group-hover:bg-white/20">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
                      <text x="9" y="15" fill="white" fontSize="8" fontWeight="bold">10</text>
                    </svg>
                  </div>
                </button>

                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="group transition-transform hover:scale-110"
                >
                  <div className="w-20 h-20 rounded-full bg-[#FBE7BA] flex items-center justify-center shadow-2xl transition-all group-hover:bg-[#f0d89e] group-hover:shadow-[#FBE7BA]/50">
                    {isPlaying ? (
                      <svg className="w-10 h-10 text-[#604B3B]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                      </svg>
                    ) : (
                      <svg className="w-10 h-10 text-[#604B3B] ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </div>
                </button>

                {/* Forward 10s */}
                <button
                  onClick={() => skip(10)}
                  className="group transition-transform hover:scale-110"
                  title="Tua 10s"
                >
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center transition-colors group-hover:bg-white/20">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/>
                      <text x="9" y="15" fill="white" fontSize="8" fontWeight="bold">10</text>
                    </svg>
                  </div>
                </button>
              </div>

              {/* Volume control */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={toggleMute}
                  className="w-10 h-10 text-white hover:text-[#FBE7BA] transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    {isMuted ? (
                      <path d="M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 101.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7zM16.5 12A4.5 4.5 0 0014 7.97v1.79l2.48 2.48c.01-.08.02-.16.02-.24z"/>
                    ) : (
                      <path d="M3 10v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.34-1.71-.71L7 9H4c-.55 0-1 .45-1 1zm13.5 2A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 4.45v.2c0 .38.25.71.6.85C17.18 6.53 19 9.06 19 12s-1.82 5.47-4.4 6.5c-.36.14-.6.47-.6.85v.2c0 .63.63 1.07 1.21.85C18.6 19.11 21 15.84 21 12s-2.4-7.11-5.79-8.4c-.58-.23-1.21.22-1.21.85z"/>
                    )}
                  </svg>
                </button>
                <div className="relative w-32 h-1.5 bg-white/10 rounded-full backdrop-blur-sm overflow-hidden">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div
                    className="absolute h-full bg-white rounded-full transition-all"
                    style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/30 to-transparent">
        <div className="max-w-4xl mx-auto text-center text-white/50 text-sm">
          Đang phát trên Healink
        </div>
      </div>
    </div>
  );
}
