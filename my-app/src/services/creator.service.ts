import { apiClient, handleApiError, ApiResponse } from '@/lib/api-config';
import type {
  CreatorApplicationRequest,
  CreatorApplicationResponse,
  MyApplicationStatus,
} from '@/types/creator.types';

class CreatorService {
  /**
   * Submit creator application
   */
  async submitApplication(data: CreatorApplicationRequest): Promise<CreatorApplicationResponse> {
    try {
      const response = await apiClient.post<ApiResponse<CreatorApplicationResponse>>(
        '/api/CreatorApplications',
        data
      );

      if (response.data.isSuccess && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to submit creator application');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get my application status
   */
  async getMyApplicationStatus(): Promise<MyApplicationStatus | null> {
    try {
      const response = await apiClient.get<ApiResponse<MyApplicationStatus>>(
        '/api/CreatorApplications/my-status'
      );

      if (response.data.isSuccess && response.data.data) {
        return response.data.data;
      }

      return null;
    } catch (error) {
      // If 404, user hasn't submitted application yet
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get status badge color
   */
  getStatusBadgeColor(status: string): string {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'Approved':
        return 'bg-green-100 text-green-700';
      case 'Rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  /**
   * Get status icon
   */
  getStatusIcon(status: string): string {
    switch (status) {
      case 'Pending':
        return '⏳';
      case 'Approved':
        return '✅';
      case 'Rejected':
        return '❌';
      default:
        return '📝';
    }
  }
}

// Export singleton instance
export const creatorService = new CreatorService();
