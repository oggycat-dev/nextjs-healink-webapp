import { userServiceClient, API_ENDPOINTS } from '@/lib/api-config';

interface PresignedUrlRequest {
  fileUrl: string;
  expirationMinutes?: number;
}

interface PresignedUrlResponse {
  presignedUrl?: string;
  url?: string;
  signedUrl?: string;
  expiresAt?: string;
  expirationTime?: string;
}

class FileService {
  /**
   * Cache for presigned URLs to avoid repeated API calls
   */
  private urlCache = new Map<string, { url: string; expiresAt: number }>();

  /**
   * Generate presigned URL for S3 file
   */
  async getPresignedUrl(fileUrl: string, expirationMinutes: number = 60): Promise<string> {
    try {
      // Return original URL if not an S3 URL
      if (!fileUrl || !fileUrl.includes('amazonaws.com')) {
        return fileUrl;
      }

      // Check if user is authenticated (has token)
      const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('accessToken');
      if (!hasToken) {
        console.warn('User not authenticated, returning original S3 URL');
        return fileUrl;
      }

      // Check cache first
      const cached = this.urlCache.get(fileUrl);
      if (cached && cached.expiresAt > Date.now()) {
        return cached.url;
      }

      // Call API to get presigned URL
      const response = await userServiceClient.post<PresignedUrlResponse>(
        API_ENDPOINTS.FILE.PRESIGNED_URL,
        {
          fileUrl,
          expirationMinutes,
        } as PresignedUrlRequest
      );

      // Try different possible response field names
      const presignedUrl = response.data.presignedUrl 
        || response.data.url 
        || response.data.signedUrl 
        || (response.data as any).PresignedUrl
        || (response.data as any).Url;

      if (!presignedUrl) {
        console.warn('No presigned URL in response, using original URL:', response.data);
        return fileUrl;
      }
      
      // Cache the URL (expire 5 minutes before actual expiration to be safe)
      const expiresAt = Date.now() + (expirationMinutes - 5) * 60 * 1000;
      this.urlCache.set(fileUrl, { url: presignedUrl, expiresAt });

      return presignedUrl;
    } catch (error) {
      console.error('Error getting presigned URL:', error);
      // Return original URL as fallback
      return fileUrl;
    }
  }

  /**
   * Batch process multiple URLs
   */
  async getPresignedUrls(fileUrls: string[], expirationMinutes: number = 60): Promise<string[]> {
    try {
      const promises = fileUrls.map(url => this.getPresignedUrl(url, expirationMinutes));
      return await Promise.all(promises);
    } catch (error) {
      console.error('Error getting presigned URLs:', error);
      return fileUrls; // Return original URLs as fallback
    }
  }

  /**
   * Clear URL cache
   */
  clearCache(): void {
    this.urlCache.clear();
  }

  /**
   * Remove expired entries from cache
   */
  cleanupCache(): void {
    const now = Date.now();
    for (const [key, value] of this.urlCache.entries()) {
      if (value.expiresAt <= now) {
        this.urlCache.delete(key);
      }
    }
  }
}

export const fileService = new FileService();
