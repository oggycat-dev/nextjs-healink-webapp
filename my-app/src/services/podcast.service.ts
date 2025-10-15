import { apiClient, API_ENDPOINTS, handleApiError, ApiResponse, PaginationResult } from '@/lib/api-config';
import { fileService } from './file.service';
import type {
  PodcastItem,
  PodcastDetail,
  PodcastCategory,
  PodcastFilter,
  CategoryFilter,
  GenerateUploadUrlRequest,
  GenerateUploadUrlResponse,
  CreatePodcastRequest,
  FlashCard,
} from '@/types/podcast.types';

class PodcastService {
  /**
   * Convert S3 URLs in podcast item to presigned URLs
   * NOT NEEDED: Backend middleware already returns presigned URLs
   */
  private async convertPodcastUrls(podcast: PodcastItem): Promise<PodcastItem> {
    // Backend middleware already converts S3 URLs to presigned URLs
    // No need for frontend conversion
    return podcast;
  }

  /**
   * Convert S3 URLs in multiple podcasts
   */
  private async convertPodcastsUrls(podcasts: PodcastItem[]): Promise<PodcastItem[]> {
    try {
      return await Promise.all(podcasts.map(p => this.convertPodcastUrls(p)));
    } catch (error) {
      console.error('Error converting podcasts URLs:', error);
      return podcasts;
    }
  }

  /**
   * Get list of podcasts with pagination and filters
   */
  async getPodcasts(filter?: PodcastFilter): Promise<PaginationResult<PodcastItem>> {
    try {
      const params = {
        page: filter?.page || 1,
        pageSize: filter?.pageSize || 10,
        searchTerm: filter?.searchTerm,
        categoryId: filter?.categoryId,
        creatorId: filter?.creatorId,
        status: filter?.status,
        isPublished: filter?.isPublished ?? true, // Default to published only
        sortBy: filter?.sortBy || 'publishedAt',
        sortOrder: filter?.sortOrder || 'desc',
        startDate: filter?.startDate,
        endDate: filter?.endDate,
      };

      // Remove undefined values
      Object.keys(params).forEach(key => {
        if (params[key as keyof typeof params] === undefined) {
          delete params[key as keyof typeof params];
        }
      });

      // Call Gateway with /api/content/user/podcasts
      const response = await apiClient.get(
        API_ENDPOINTS.CONTENT.PODCASTS,
        { params }
      );

      // Backend returns GetPodcastsResponse: { podcasts, totalCount, page, pageSize }
      const data = response.data;
      
      if (data && data.podcasts) {
        // Convert S3 URLs to presigned URLs
        const podcastsWithPresignedUrls = await this.convertPodcastsUrls(data.podcasts);
        
        return {
          items: podcastsWithPresignedUrls,
          pageNumber: data.page || 1,
          pageSize: data.pageSize || 10,
          totalRecords: data.totalCount || 0,
          totalPages: Math.ceil((data.totalCount || 0) / (data.pageSize || 10)),
          hasPreviousPage: (data.page || 1) > 1,
          hasNextPage: (data.page || 1) < Math.ceil((data.totalCount || 0) / (data.pageSize || 10)),
        };
      }

      throw new Error('Failed to fetch podcasts');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get podcast by ID
   */
  async getPodcastById(id: string): Promise<PodcastDetail> {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.CONTENT.PODCAST_DETAIL(id)
      );

      // Backend returns raw podcast data (not wrapped in ApiResponse)
      if (response.data && response.data.id) {
        const podcast = await this.convertPodcastUrls(response.data as any);
        return podcast as PodcastDetail;
      }

      throw new Error('Podcast not found');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get my podcasts (for content creators)
   */
  async getMyPodcasts(filter?: PodcastFilter): Promise<PaginationResult<PodcastItem>> {
    try {
      const params = {
        page: filter?.page || 1,
        pageSize: filter?.pageSize || 10,
        searchTerm: filter?.searchTerm,
        status: filter?.status,
        sortBy: filter?.sortBy || 'createdAt',
        sortOrder: filter?.sortOrder || 'desc',
      };

      // Remove undefined values
      Object.keys(params).forEach(key => {
        if (params[key as keyof typeof params] === undefined) {
          delete params[key as keyof typeof params];
        }
      });

      const response = await apiClient.get<ApiResponse<PaginationResult<PodcastItem>>>(
        API_ENDPOINTS.CONTENT.MY_PODCASTS,
        { params }
      );

      if (response.data.isSuccess && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to fetch my podcasts');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get all categories
   * Note: Categories endpoint not available in backend yet
   */
  async getCategories(filter?: CategoryFilter): Promise<PaginationResult<PodcastCategory>> {
    try {
      // Categories endpoint not implemented in backend yet
      // Return empty result for now
      console.log('Categories endpoint not available in backend');
      return {
        items: [],
        pageNumber: 1,
        pageSize: filter?.pageSize || 100,
        totalRecords: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return {
        items: [],
        pageNumber: 1,
        pageSize: filter?.pageSize || 100,
        totalRecords: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      };
    }
  }

  /**
   * Generate pre-signed URL for file upload
   */
  async generateUploadUrl(data: GenerateUploadUrlRequest): Promise<GenerateUploadUrlResponse> {
    try {
      const response = await apiClient.post<ApiResponse<GenerateUploadUrlResponse>>(
        API_ENDPOINTS.CONTENT.UPLOAD_URL,
        data
      );

      if (response.data.isSuccess && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to generate upload URL');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Upload file to S3 using pre-signed URL
   */
  async uploadFileToS3(uploadUrl: string, file: File): Promise<void> {
    try {
      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });
    } catch (error) {
      throw new Error('Failed to upload file to S3');
    }
  }

  /**
   * Create new podcast
   */
  async createPodcast(data: CreatePodcastRequest): Promise<PodcastDetail> {
    try {
      const response = await apiClient.post<ApiResponse<PodcastDetail>>(
        API_ENDPOINTS.CONTENT.PODCASTS,
        data
      );

      if (response.data.isSuccess && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to create podcast');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get trending podcasts
   */
  async getTrendingPodcasts(limit: number = 10): Promise<PodcastItem[]> {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.CONTENT.PODCASTS_TRENDING,
        { params: { page: 1, pageSize: limit } }
      );

      const data = response.data;
      if (data && data.podcasts) {
        // Convert S3 URLs to presigned URLs
        return await this.convertPodcastsUrls(data.podcasts);
      }
      return [];
    } catch (error) {
      console.error('Error fetching trending podcasts:', error);
      return [];
    }
  }

  /**
   * Get new releases
   */
  async getNewReleases(limit: number = 10): Promise<PodcastItem[]> {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.CONTENT.PODCASTS_LATEST,
        { params: { page: 1, pageSize: limit } }
      );

      const data = response.data;
      if (data && data.podcasts) {
        // Convert S3 URLs to presigned URLs
        return await this.convertPodcastsUrls(data.podcasts);
      }
      return [];
    } catch (error) {
      console.error('Error fetching new podcasts:', error);
      return [];
    }
  }

  /**
   * Get podcasts by category
   */
  async getPodcastsByCategory(categoryId: string, limit: number = 10): Promise<PodcastItem[]> {
    try {
      const result = await this.getPodcasts({
        page: 1,
        pageSize: limit,
        categoryId,
        isPublished: true,
        sortBy: 'publishedAt',
        sortOrder: 'desc',
      });
      return result.items;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Search podcasts
   */
  async searchPodcasts(searchTerm: string, page: number = 1, pageSize: number = 10): Promise<PaginationResult<PodcastItem>> {
    try {
      return await this.getPodcasts({
        page,
        pageSize,
        searchTerm,
        isPublished: true,
        sortBy: 'publishedAt',
        sortOrder: 'desc',
      });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Increment view count for a podcast
   * This should be called when user starts viewing/playing a podcast
   */
  async incrementView(podcastId: string): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.CONTENT.PODCAST_INCREMENT_VIEW(podcastId));
      console.log('View count incremented for podcast:', podcastId);
    } catch (error) {
      // Silently fail - don't block user experience if view tracking fails
      console.error('Failed to increment view count:', error);
    }
  }

  /**
   * Toggle like/unlike for a podcast (requires authentication)
   * Returns the new like count
   */
  async toggleLike(podcastId: string): Promise<number> {
    try {
      const response = await apiClient.post<{ likes: number }>(
        API_ENDPOINTS.CONTENT.PODCAST_TOGGLE_LIKE(podcastId)
      );
      
      if (response.data && typeof response.data.likes === 'number') {
        return response.data.likes;
      }
      
      throw new Error('Invalid response from toggle like API');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Format duration from seconds to MM:SS or HH:MM:SS
   */
  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}

// Export singleton instance
export const podcastService = new PodcastService();
