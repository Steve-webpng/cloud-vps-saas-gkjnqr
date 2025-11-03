
/**
 * API Configuration
 * 
 * SECURITY WARNING: In production, these keys should be stored as environment variables
 * and accessed through a secure backend. Never commit API keys to version control.
 * 
 * For Expo apps, use expo-constants and app.config.js with environment variables:
 * - GEMINI_API_KEY
 * - STRIPE_PUBLISHABLE_KEY
 * - STRIPE_SECRET_KEY (backend only)
 */

export const API_CONFIG = {
  // Gemini AI Configuration
  gemini: {
    apiKey: 'AIzaSyARtUYzzUlPK8A3wFgujLe-8GIvzxpIicU',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    model: 'gemini-2.0-flash-exp',
  },

  // Stripe Configuration
  stripe: {
    // This is a test key - safe to use in client
    publishableKey: 'pk_test_51SKytVCW724ltV88CNFGg5pOtKhx3iBzU4rbDD3QLqLPQ63BxYHOsXyYTnwTACDeCpc1ju1USxDLX3T9pDnEOb5l00qCKzPFiI',
    // Secret key should ONLY be used on backend/server
    // For demo purposes, we'll simulate backend calls
    secretKey: 'sk_test_51SKytVCW724ltV88CNFGg5pOtKhx3iBzU4rbDD3QLqLPQ63BxYHOsXyYTnwTACDeCpc1ju1USxDLX3T9pDnEOb5l00qCKzPFiI',
  },
};

// Helper to check if APIs are configured
export const isGeminiConfigured = () => {
  return !!API_CONFIG.gemini.apiKey && API_CONFIG.gemini.apiKey.length > 0;
};

export const isStripeConfigured = () => {
  return !!API_CONFIG.stripe.publishableKey && API_CONFIG.stripe.publishableKey.length > 0;
};
