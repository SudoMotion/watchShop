import { apiRequest } from './apiSlice';

/**
 * Home API
 * Functions that call API endpoints and return responses
 */

/**
 * Get home data
 * @returns {Promise} - API response
 */
export const getHome = async () => {
  const response = await apiRequest('/api/home', 'GET');

  // Normalize different backend response shapes and fail safe.
  // Some environments return { data: {...} }, others return the object directly.
  const payload = response?.data?.data ?? response?.data ?? null;
  if (response?.status >= 400 || payload == null) return {};
  return payload;
};

export default {
  getHome,
};
