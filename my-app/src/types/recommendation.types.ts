/**
 * Types for AI-powered Podcast Recommendation Service
 */

export interface RecommendationItem {
  podcastId: string;
  title: string;
  topic: string;
  predictedRating: number; // 1-5 scale
  confidenceScore: number; // 0-1 scale
  recommendationReason: string;
  category?: string;
  durationMinutes?: number;
  contentUrl?: string;
}

export interface PodcastRecommendationResponse {
  userId: string;
  recommendations: RecommendationItem[];
  totalFound: number;
  filteredListened: boolean;
  generatedAt: string;
}

export interface GetRecommendationsParams {
  limit?: number; // 1-50, default 10
  includeListened?: boolean; // default false
}

