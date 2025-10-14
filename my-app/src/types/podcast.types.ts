// Podcast and Content related types

export interface PodcastCategory {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface PodcastStatistics {
  views: number;
  likes: number;
  shares: number;
  comments: number;
  averageRating: number;
  totalRatings: number;
}

export interface PodcastItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;  // Backend uses thumbnailUrl
  audioUrl: string | null;       // Backend uses audioUrl
  duration: string;              // Backend returns as "HH:MM:SS" string
  transcriptUrl?: string | null;
  hostName?: string | null;
  guestName?: string | null;
  episodeNumber?: number;
  seriesName?: string | null;
  tags?: string[];
  emotionCategories?: number[];
  topicCategories?: number[];
  contentStatus?: number;
  viewCount: number;             // Backend uses viewCount
  likeCount: number;             // Backend uses likeCount
  createdAt: string;
  publishedAt?: string | null;
  createdBy?: string;
  
  // Legacy fields for backward compatibility (optional)
  categoryId?: string;
  categoryName?: string;
  creatorId?: string;
  creatorName?: string;
  creatorAvatar?: string | null;
  status?: PodcastStatus;
  statusName?: string;
  isPublished?: boolean;
  updatedAt?: string | null;
  views?: number;                // Alias for viewCount
  likes?: number;                // Alias for likeCount
  coverImageUrl?: string | null; // Alias for thumbnailUrl
  audioFileUrl?: string | null;  // Alias for audioUrl
}

export interface PodcastDetail extends PodcastItem {
  transcriptUrl: string | null;
  tags: string[];
  statistics: PodcastStatistics;
}

export enum PodcastStatus {
  Draft = 0,
  PendingReview = 1,
  Published = 2,
  Rejected = 3,
  Archived = 4,
}

export interface PodcastFilter {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  categoryId?: string;
  creatorId?: string;
  status?: PodcastStatus;
  isPublished?: boolean;
  sortBy?: 'createdAt' | 'publishedAt' | 'views' | 'likes' | 'title';
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
}

export interface CategoryFilter {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  isActive?: boolean;
  sortBy?: 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

// Flashcard types
export interface FlashCard {
  id: string;
  quote: string;
  author: string;
  authorRole: string;
  imageUrl: string | null;
  backgroundColor: string;
  categoryId: string | null;
  categoryName: string | null;
  isActive: boolean;
  order: number;
  createdAt: string;
}

// Recommendation types
export interface PodcastRecommendation {
  podcastId: string;
  title: string;
  description: string;
  coverImageUrl: string;
  duration: number;
  categoryName: string;
  creatorName: string;
  relevanceScore: number;
  reason: string; // Why recommended
}

export interface RecommendationRequest {
  userId?: string;
  categoryIds?: string[];
  limit?: number;
  includeListeningHistory?: boolean;
}

// Upload types
export interface GenerateUploadUrlRequest {
  fileName: string;
  fileType: FileType;
  contentType: string;
}

export interface GenerateUploadUrlResponse {
  fileId: string;
  uploadUrl: string;
  s3Key: string;
  expiresAt: string;
  expiresInMinutes: number;
}

export enum FileType {
  AudioFile = 0,
  CoverImage = 1,
  Transcript = 2,
  Attachment = 3,
}

export interface CompleteUploadRequest {
  fileId: string;
}

// Create podcast request
export interface CreatePodcastRequest {
  title: string;
  description: string;
  categoryId: string;
  audioFileId: string;
  coverImageId?: string;
  transcriptFileId?: string;
  tags?: string[];
  duration: number;
}

// Podcast search/browse sections
export interface PodcastSection {
  id: string;
  title: string;
  type: 'trending' | 'new' | 'recommended' | 'category';
  podcasts: PodcastItem[];
}
