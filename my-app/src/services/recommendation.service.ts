import { apiClient, API_ENDPOINTS } from '@/lib/api-config';
import type { ApiResponse } from '@/lib/api-config';
import type {
  PodcastRecommendationResponse,
  GetRecommendationsParams,
} from '@/types/recommendation.types';

class RecommendationService {
  /**
   * Get AI-powered podcast recommendations for current user
   */
  async getMyRecommendations(
    params?: GetRecommendationsParams
  ): Promise<ApiResponse<PodcastRecommendationResponse>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.limit) {
        queryParams.append('limit', params.limit.toString());
      }
      
      if (params?.includeListened !== undefined) {
        queryParams.append('includeListened', params.includeListened.toString());
      }

      const url = params 
        ? `${API_ENDPOINTS.RECOMMENDATIONS.MY_RECOMMENDATIONS}?${queryParams.toString()}`
        : API_ENDPOINTS.RECOMMENDATIONS.MY_RECOMMENDATIONS;

      const response = await apiClient.get<ApiResponse<PodcastRecommendationResponse>>(url);
      
      return response.data;
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const recommendationService = new RecommendationService();

