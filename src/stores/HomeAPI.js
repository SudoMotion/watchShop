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
export const getNewDynamicSection = async (slug) => {
  try {
    const response = await apiRequest(`/api/default-top-ten-sections`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
};
export const getBannerContent = async (slug) => {
  try {
    const response = await apiRequest(`/api/banner-contents`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
};
export const getHomeMetaContents = async () => {
  try {
    const response = await apiRequest(`/api/home-page-content`, 'GET');
    const payload = response?.data?.data ?? response?.data ?? null;
    if (response?.status >= 400 || payload == null) return null;
    return payload;
  } catch (error) {
    console.error('Error fetching home page content:', error);
    return null;
  }
};
export const getSubcategoryByCategoryId = async (categoryId) => {
  try {
    const id = encodeURIComponent(String(categoryId));
    const response = await apiRequest(`/api/subcategories?category_id=${id}`, 'GET');
    const payload = response?.data?.data ?? response?.data ?? null;
    if (response?.status >= 400 || payload == null) return null;
    return payload;
  } catch (error) {
    console.error('Error fetching subcategories by category id:', error);
    return null;
  }
};
export const getOutlets = async (categoryId) => {
  try {
    const id = encodeURIComponent();
    const response = await apiRequest(`/api/branches`);
    const payload = response?.data?.data ?? response?.data ?? null;
    return response;
  } catch (error) {
    console.error('Error fetching subcategories by category id:', error);
    return null;
  }
};

export default {
  getHome,
  getPopup,
  getNewDynamicSection,
  getBannerContent,
  getHomeMetaContents,
  getSubcategoryByCategoryId,
  getOutlets,
};
