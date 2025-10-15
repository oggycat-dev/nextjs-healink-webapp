/**
 * Environment Configuration Helper
 * 
 * This file provides utilities for working with environment variables
 * and debugging configuration issues.
 */

import { 
  API_GATEWAY_URL, 
  APP_CONFIG, 
  API_CONFIG,
  AUTH_SERVICE_URL,
  USER_SERVICE_URL,
  CONTENT_SERVICE_URL,
  SUBSCRIPTION_SERVICE_URL,
  PAYMENT_SERVICE_URL,
} from './api-config';

/**
 * Get all environment configuration
 */
export const getEnvConfig = () => ({
  // API URLs
  api: {
    gateway: API_GATEWAY_URL,
    auth: AUTH_SERVICE_URL,
    user: USER_SERVICE_URL,
    content: CONTENT_SERVICE_URL,
    subscription: SUBSCRIPTION_SERVICE_URL,
    payment: PAYMENT_SERVICE_URL,
  },
  
  // App settings
  app: APP_CONFIG,
  
  // API settings
  apiConfig: API_CONFIG,
  
  // Environment info
  environment: {
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
  },
});

/**
 * Log environment configuration (only in development)
 */
export const logEnvConfig = () => {
  if (API_CONFIG.enableDebug && typeof window !== 'undefined') {
    const config = getEnvConfig();
    
    console.group('🔧 Environment Configuration');
    console.log('📡 API Gateway:', config.api.gateway);
    console.log('🏠 App URL:', config.app.url);
    console.log('🔐 Token Key:', config.app.tokenKey);
    console.log('⚙️ Environment:', config.environment);
    console.log('🐛 Debug Mode:', API_CONFIG.enableDebug);
    console.log('📊 Log Level:', API_CONFIG.logLevel);
    console.groupEnd();
  }
};

/**
 * Validate environment configuration
 */
export const validateEnvConfig = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check required variables
  if (!API_GATEWAY_URL) {
    errors.push('NEXT_PUBLIC_API_GATEWAY_URL is not defined');
  }
  
  if (!APP_CONFIG.url) {
    errors.push('NEXT_PUBLIC_APP_URL is not defined');
  }
  
  // Validate URL format
  try {
    new URL(API_GATEWAY_URL);
  } catch {
    errors.push('NEXT_PUBLIC_API_GATEWAY_URL is not a valid URL');
  }
  
  try {
    new URL(APP_CONFIG.url);
  } catch {
    errors.push('NEXT_PUBLIC_APP_URL is not a valid URL');
  }
  
  // Check for localhost in production
  if (process.env.NODE_ENV === 'production') {
    if (API_GATEWAY_URL.includes('localhost')) {
      errors.push('Production environment using localhost API URL');
    }
    if (APP_CONFIG.url.includes('localhost')) {
      errors.push('Production environment using localhost App URL');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Get API health check URL
 */
export const getHealthCheckUrl = () => `${API_GATEWAY_URL}/health`;

/**
 * Check if API is reachable
 */
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(getHealthCheckUrl(), {
      method: 'GET',
      cache: 'no-cache',
    });
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};

/**
 * Get environment info for debugging
 */
export const getDebugInfo = () => ({
  timestamp: new Date().toISOString(),
  config: getEnvConfig(),
  validation: validateEnvConfig(),
  userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'N/A',
  url: typeof window !== 'undefined' ? window.location.href : 'N/A',
});

// Auto-log in development on module load
if (typeof window !== 'undefined' && API_CONFIG.enableDebug) {
  logEnvConfig();
}
