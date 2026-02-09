import { apiRequest } from './apiSlice';

/**
 * Product API
 * Functions that call product API endpoints and return responses
 */

/**
 * Get men's watches (paginated)
 * @param {object} params - Query parameters (page, limit, etc.)
 * @returns {Promise} - API response
 */
export const getMensProducts = async (params = {}) => {
  try {
    const response = await apiRequest('/api/products/mens', 'GET', null, params);
    return response.data;
  } catch (error) {
    console.error('Error fetching men\'s products:', error);
    return null;
  }
};

/**
 * Get ladies' watches (paginated)
 * @param {object} params - Query parameters (page, limit, etc.)
 * @returns {Promise} - API response
 */
export const getLadiesProducts = async (params = {}) => {
  try {
    const response = await apiRequest('/api/products/ladies', 'GET', null, params);
    return response.data;
  } catch (error) {
    console.error('Error fetching ladies products:', error);
    return null;
  }
};

/**
 * Get all products (paginated)
 * @param {object} params - Query parameters (page, limit, etc.)
 * @returns {Promise} - API response
 */
export const getAllProducts = async (params = {}) => {
  try {
    const response = await apiRequest('/api/products/all', 'GET', null, params);
    return response.data;
  } catch (error) {
    console.error('Error fetching all products:', error);
    return null;
  }
};

/**
 * Shop by category
 * @param {string} category - Category slug
 * @param {object} params - Query parameters (page, limit, etc.)
 * @returns {Promise} - API response
 */
export const getProductsByCategory = async (category, params = {}) => {
  try {
    const response = await apiRequest(`/api/products/category/${category}`, 'GET', null, params);
    return response.data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return null;
  }
};

/**
 * Products by brand
 * @param {string} brand - Brand slug
 * @param {object} params - Query parameters (page, limit, etc.)
 * @returns {Promise} - API response
 */
export const getProductsByBrand = async (brand, params = {}) => {
  try {
    const response = await apiRequest(`/api/products/brand/${brand}`, 'GET', null, params);
    return response.data;
  } catch (error) {
    console.error('Error fetching products by brand:', error);
    return null;
  }
};

/**
 * Category products
 * @param {string} cat - Category slug
 * @param {object} params - Query parameters (page, limit, etc.)
 * @returns {Promise} - API response
 */
export const getProductsByCat = async (cat, params = {}) => {
  try {
    const response = await apiRequest(`/api/products/cat/${cat}`, 'GET', null, params);
    return response.data;
  } catch (error) {
    console.error('Error fetching products by cat:', error);
    return null;
  }
};

/**
 * Get discounted products
 * @param {object} params - Query parameters (page, limit, etc.)
 * @returns {Promise} - API response
 */
export const getDiscountProducts = async (params = {}) => {
  try {
    const response = await apiRequest('/api/products/discount', 'GET', null, params);
    return response.data;
  } catch (error) {
    console.error('Error fetching discount products:', error);
    return null;
  }
};

/**
 * Get trending products
 * @param {number} is_trending - Trending type (1 or 2)
 * @param {object} params - Query parameters (page, limit, etc.)
 * @returns {Promise} - API response
 */
export const getTrendingProducts = async (is_trending = 1, params = {}) => {
  try {
    const response = await apiRequest(`/api/products/trending/${is_trending}`, 'GET', null, params);
    return response.data;
  } catch (error) {
    console.error('Error fetching trending products:', error);
    return null;
  }
};

/**
 * Get offer products
 * @param {object} params - Query parameters (page, limit, etc.)
 * @returns {Promise} - API response
 */
export const getOfferProducts = async (params = {}) => {
  try {
    const response = await apiRequest('/api/products/offer', 'GET', null, params);
    return response.data;
  } catch (error) {
    console.error('Error fetching offer products:', error);
    return null;
  }
};

/**
 * Get best deal products
 * @param {object} params - Query parameters (page, limit, etc.)
 * @returns {Promise} - API response
 */
export const getBestDealProducts = async (params = {}) => {
  try {
    const response = await apiRequest('/api/products/best-deal', 'GET', null, params);
    return response.data;
  } catch (error) {
    console.error('Error fetching best deal products:', error);
    return null;
  }
};

/**
 * Get new arrival products
 * @param {object} params - Query parameters (page, limit, etc.)
 * @returns {Promise} - API response
 */
export const getNewArrivalProducts = async (params = {}) => {
  try {
    const response = await apiRequest('/api/products/new-arrival', 'GET', null, params);
    return response.data;
  } catch (error) {
    console.error('Error fetching new arrival products:', error);
    return null;
  }
};

/**
 * Get single product detail by slug
 * @param {string} slug - Product slug
 * @returns {Promise} - API response
 */
export const getProductBySlug = async (slug) => {
  try {
    const response = await apiRequest(`/api/products/show/${slug}`, 'GET');
    return response.data;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
};

/**
 * Get all product slugs (for generateStaticParams).
 * Paginates through getAllProducts and collects slugs.
 * @param {string} [slug] - Optional slug to pass to the API (e.g. for filtering).
 * @returns {Promise<string[]>}
 */
export const getAllProductSlugs = async (slug) => {
  const slugs = [];
  let page = 1;
  const perPage = 100;
  let hasMore = true;

  while (hasMore) {
    const params = { page, limit: perPage };
    if (slug) params.slug = slug;
    const res = await getAllProducts(params);
    if (!res) break;

    const list = Array.isArray(res) ? res : res?.data ?? res?.products ?? [];
    const total = res?.total ?? res?.meta?.total ?? list.length;
    const lastPage = res?.last_page ?? res?.meta?.last_page ?? (Math.ceil(total / perPage) || 1);

    for (const item of list) {
      const itemSlug = item?.slug ?? item?.product_slug;
      if (itemSlug) slugs.push(itemSlug);
    }

    hasMore = page < lastPage && list.length === perPage;
    page += 1;
  }

  return slugs;
};

export default {
  getMensProducts,
  getLadiesProducts,
  getAllProducts,
  getProductsByCategory,
  getProductsByBrand,
  getProductsByCat,
  getDiscountProducts,
  getTrendingProducts,
  getOfferProducts,
  getBestDealProducts,
  getNewArrivalProducts,
  getProductBySlug,
  getAllProductSlugs,
};
