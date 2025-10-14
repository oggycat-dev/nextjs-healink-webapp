import { apiClient, API_ENDPOINTS, handleApiError, ApiResponse, PaginationResult } from '@/lib/api-config';
import type {
  SubscriptionPlan,
  SubscriptionPlanFilter,
  UserSubscription,
  CreateSubscriptionRequest,
  RegisterSubscriptionResponse,
  CancelSubscriptionRequest,
  PaymentIntent,
  SubscriptionInvoice,
} from '@/types/subscription.types';

class SubscriptionService {
  /**
   * Get all subscription plans
   */
  async getSubscriptionPlans(filter?: SubscriptionPlanFilter): Promise<PaginationResult<SubscriptionPlan>> {
    try {
      const params = {
        pageNumber: filter?.pageNumber || 1,
        pageSize: filter?.pageSize || 10,
        searchTerm: filter?.searchTerm,
        sortBy: filter?.sortBy || 'amount',
        sortDirection: filter?.sortDirection || 'asc',
        isActive: filter?.isActive ?? true,
        billingPeriodUnit: filter?.billingPeriodUnit,
        minAmount: filter?.minAmount,
        maxAmount: filter?.maxAmount,
        hasTrialPeriod: filter?.hasTrialPeriod,
        minTrialDays: filter?.minTrialDays,
        currency: filter?.currency,
      };

      // Remove undefined values
      Object.keys(params).forEach(key => {
        if (params[key as keyof typeof params] === undefined) {
          delete params[key as keyof typeof params];
        }
      });

      const response = await apiClient.get(
        API_ENDPOINTS.SUBSCRIPTION.PLANS,
        { params }
      );

      // Backend returns PaginationResult with isSuccess wrapper
      const data = response.data;
      
      if (data && data.items) {
        return {
          items: data.items,
          pageNumber: data.currentPage || 1,
          pageSize: data.pageSize || 10,
          totalRecords: data.totalItems || 0,
          totalPages: data.totalPages || 1,
          hasPreviousPage: data.hasPrevious || false,
          hasNextPage: data.hasNext || false,
        };
      }

      throw new Error(data?.message || 'Failed to fetch subscription plans');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get subscription plan by ID
   */
  async getSubscriptionPlanById(id: string): Promise<SubscriptionPlan> {
    try {
      const response = await apiClient.get<ApiResponse<SubscriptionPlan>>(
        `${API_ENDPOINTS.SUBSCRIPTION.PLANS}/${id}`
      );

      if (response.data.isSuccess && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Subscription plan not found');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get user's current subscription
   */
  async getMySubscription(): Promise<UserSubscription | null> {
    try {
      const response = await apiClient.get<ApiResponse<UserSubscription>>(
        API_ENDPOINTS.SUBSCRIPTION.MY_SUBSCRIPTION
      );

      if (response.data.isSuccess) {
        return response.data.data;
      }

      return null;
    } catch (error) {
      // If no subscription found, return null instead of throwing
      console.log('No active subscription found');
      return null;
    }
  }

  /**
   * Alias for getMySubscription
   */
  async getCurrentSubscription(): Promise<UserSubscription | null> {
    return this.getMySubscription();
  }

  /**
   * Reactivate cancelled subscription
   */
  async reactivateSubscription(subscriptionId: string): Promise<UserSubscription> {
    try {
      const response = await apiClient.post<ApiResponse<UserSubscription>>(
        `${API_ENDPOINTS.SUBSCRIPTION.MY_SUBSCRIPTION}/reactivate`,
        {}
      );

      if (response.data.isSuccess && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to reactivate subscription');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Register a new subscription (returns payment URL for redirect)
   */
  async registerSubscription(data: CreateSubscriptionRequest): Promise<RegisterSubscriptionResponse> {
    try {
      const response = await apiClient.post<ApiResponse<RegisterSubscriptionResponse>>(
        API_ENDPOINTS.SUBSCRIPTION.REGISTER,
        data
      );

      if (response.data.isSuccess && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to register subscription');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * @deprecated Use registerSubscription instead
   */
  async createSubscription(data: CreateSubscriptionRequest): Promise<UserSubscription> {
    // For backward compatibility, redirect to registerSubscription
    console.warn('createSubscription is deprecated. Use registerSubscription instead.');
    const result = await this.registerSubscription(data);
    // Return a dummy UserSubscription object for now
    return {
      id: result.subscriptionId,
      subscriptionPlanId: data.subscriptionPlanId,
      planDisplayName: result.subscriptionPlanName,
    } as UserSubscription;
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string, data?: CancelSubscriptionRequest): Promise<void> {
    try {
      const response = await apiClient.post<ApiResponse<void>>(
        `${API_ENDPOINTS.SUBSCRIPTION.MY_SUBSCRIPTION}/cancel`,
        data
      );

      if (!response.data.isSuccess) {
        throw new Error(response.data.message || 'Failed to cancel subscription');
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Create payment intent for subscription
   */
  async createPaymentIntent(subscriptionPlanId: string): Promise<PaymentIntent> {
    try {
      const response = await apiClient.post<ApiResponse<PaymentIntent>>(
        '/api/payment/create-intent',
        { subscriptionPlanId }
      );

      if (response.data.isSuccess && response.data.data) {
        return response.data.data;
      }

      throw new Error(response.data.message || 'Failed to create payment intent');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get subscription invoices
   */
  async getSubscriptionInvoices(subscriptionId: string): Promise<SubscriptionInvoice[]> {
    try {
      const response = await apiClient.get<ApiResponse<SubscriptionInvoice[]>>(
        `/api/user/subscriptions/${subscriptionId}/invoices`
      );

      if (response.data.isSuccess && response.data.data) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      return [];
    }
  }

  /**
   * Parse feature config JSON string
   */
  parseFeatures(featureConfig: string): Record<string, any> {
    try {
      return JSON.parse(featureConfig);
    } catch {
      return {};
    }
  }

  /**
   * Get features as display strings array
   */
  getFeaturesArray(featureConfig: string): string[] {
    const features = this.parseFeatures(featureConfig);
    const displayFeatures: string[] = [];

    // Convert feature object to readable strings
    if (features.maxPodcasts === -1 || features.maxPodcasts > 1000) {
      displayFeatures.push('Nghe không giới hạn podcast');
    } else if (features.maxPodcasts) {
      displayFeatures.push(`Nghe tối đa ${features.maxPodcasts} podcast`);
    }

    if (features.offlineDownload) {
      displayFeatures.push('Tải về để nghe offline');
    }

    if (features.noAds) {
      displayFeatures.push('Trải nghiệm không quảng cáo');
    }

    if (features.hd) {
      displayFeatures.push('Chất lượng âm thanh HD');
    }

    if (features.exclusiveContent) {
      displayFeatures.push('Nội dung độc quyền');
    }

    if (features.flashcards) {
      displayFeatures.push('Flashcards ghi nhớ');
    }

    if (features.journal) {
      displayFeatures.push('Nhật ký sức khỏe');
    }

    if (features.personalPodcast) {
      displayFeatures.push('Podcast cá nhân hóa');
    }

    return displayFeatures;
  }

  /**
   * Check if user has active subscription
   */
  hasActiveSubscription(subscription: UserSubscription | null): boolean {
    if (!subscription) return false;
    return subscription.subscriptionStatus === 2; // Active
  }

  /**
   * Format price with currency
   */
  formatPrice(amount: number, currency: string = 'VND'): string {
    if (currency === 'VND') {
      return `${amount.toLocaleString('vi-VN')}đ`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  /**
   * Get billing period text
   */
  getBillingPeriodText(count: number, unit: number): string {
    const unitText = unit === 1 ? 'tháng' : 'năm';
    return count === 1 ? `/${unitText}` : `/${count} ${unitText}`;
  }

  /**
   * Calculate trial end date
   */
  getTrialEndDate(trialDays: number): string {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + trialDays);
    return endDate.toLocaleDateString('vi-VN');
  }

  /**
   * Check if subscription is expiring soon (within 7 days)
   */
  isExpiringSoon(subscription: UserSubscription): boolean {
    if (!subscription.currentPeriodEnd) return false;
    
    const endDate = new Date(subscription.currentPeriodEnd);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  }

  /**
   * Get days until subscription expires
   */
  getDaysUntilExpiry(subscription: UserSubscription): number {
    if (!subscription.currentPeriodEnd) return 0;
    
    const endDate = new Date(subscription.currentPeriodEnd);
    const now = new Date();
    return Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }

  /**
   * Get available payment methods
   */
  async getPaymentMethods(): Promise<PaginationResult<any>> {
    try {
      const response = await apiClient.get(
        '/api/user/payment-methods'
      );

      const data = response.data;
      
      if (data && data.items) {
        return {
          items: data.items,
          pageNumber: data.currentPage || 1,
          pageSize: data.pageSize || 10,
          totalRecords: data.totalItems || 0,
          totalPages: data.totalPages || 1,
          hasPreviousPage: data.hasPrevious || false,
          hasNextPage: data.hasNext || false,
        };
      }

      return {
        items: [],
        pageNumber: 1,
        pageSize: 10,
        totalRecords: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      };
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
      return {
        items: [],
        pageNumber: 1,
        pageSize: 10,
        totalRecords: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      };
    }
  }
}

// Export singleton instance
export const subscriptionService = new SubscriptionService();
