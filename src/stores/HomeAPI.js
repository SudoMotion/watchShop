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
/**
 * Homepage popup (CMS / marketing). Returns null if missing or error.
 * Adjust field access if your API wraps differently.
 */
export const getPopup = async () => {
  const response = await apiRequest("/api/homepage-popu", "GET");
  const raw = response?.data?.data ?? response?.data ?? null;
  if (response?.status >= 400 || raw == null) return null;
  if (typeof raw === "object" && !Array.isArray(raw)) {
    const popup = raw.popup ?? raw.data ?? raw;
    if (popup && typeof popup === "object" && !Array.isArray(popup)) {
      return popup;
    }
  }
  return null;
};

export default {
  getHome,
  getPopup,
};
