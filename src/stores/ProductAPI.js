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
 * Get categories
 * @param {object} params - Optional query parameters
 * @returns {Promise} - API response
 */
export const getCategories = async (params = {}) => {
  try {
    const response = await apiRequest('/api/get-category', 'GET', null, params);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
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

export const getMovements = async (body = {}) => {
  try {
    const response = await apiRequest('/api/get-movements', 'POST', body);
    return response.data;
  } catch (error) {
    console.error('Error fetching movements:', error);
    return null;
  }
};

export function normalizeMovementsList(res) {
  if (res == null) return [];
  const raw = Array.isArray(res) ? res : res?.data ?? res?.movements ?? res?.labels ?? [];
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (typeof item === 'string') {
        const s = item.trim();
        return s ? { value: s, label: s } : null;
      }
      const value = String(item.slug ?? item.value ?? item.id ?? '').trim();
      const label = String(item.name ?? item.title ?? item.label ?? value).trim();
      return value ? { value, label } : null;
    })
    .filter(Boolean);
}

export function normalizeBrandLabelsList(res) {
  if (res == null) return [];
  const raw = Array.isArray(res) ? res : res?.data ?? res?.brands ?? res?.labels ?? [];
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (typeof item === 'string') {
        const s = item.trim();
        return s ? { slug: s, name: s } : null;
      }
      const slug = String(
        item.slug ??
          item.brand_slug ??
          item.value ??
          item.id ??
          item.brand?.slug ??
          ''
      ).trim();
      const name = String(
        item.name ??
          item.title ??
          item.label ??
          item.brand?.name ??
          slug
      ).trim();
      return slug ? { slug, name: name || slug } : null;
    })
    .filter(Boolean);
}

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
export const postSearchProducts = async (body = {}) => {
  try {
    const response = await apiRequest('/api/product/get', 'POST', body);
    return response.data;
  } catch (error) {
    console.error('Error fetching search products:', error);
    return null;
  }
};
export const getCategoryLabels = async (params = {}) => {
  try {
    const response = await apiRequest('/api/category-labels', 'GET', null, params);
    return response.data;
  } catch (error) {
    console.error('Error fetching search products:', error);
    return null;
  }
};
export const getbrandLabels = async (params = {}) => {
  try {
    const response = await apiRequest('/api/brand-labels', 'GET', null, params);
    return response.data;
  } catch (error) {
    console.error('Error fetching search products:', error);
    return null;
  }
};
export const getBestDeals = async (body = {}) => {
  try {
    const response = await apiRequest('/api/page-product-lists/best-deal',);
    return response.data;
  } catch (error) {
    console.error('Error fetching search products:', error);
    return null;
  }
};
export const getLimitedEdition = async (params = {}) => {
  try {
    const response = await apiRequest(
      '/api/page-product-lists/limited-edition',
      'GET',
      null,
      params,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching limited edition products:', error);
    return null;
  }
};
export const getTrendingNow1 = async (body = {}) => {
  try {
    const response = await apiRequest('/api/page-product-lists/trending-now-1',);
    return response.data;
  } catch (error) {
    console.error('Error fetching search products:', error);
    return null;
  }
};
export const getTrendingNow2 = async (body = {}) => {
  try {
    const response = await apiRequest('/api/page-product-lists/trending-now-2',);
    return response.data;
  } catch (error) {
    console.error('Error fetching search products:', error);
    return null;
  }
};
export const getRecommendedProducts = async (body = {}) => {
  try {
    const response = await apiRequest('/api/page-product-lists/recommended-product',);
    return response.data;
  } catch (error) {
    console.error('Error fetching recomended products:', error);
    return null;
  }
};

export default {
  getMensProducts,
  getLadiesProducts,
  getAllProducts,
  getCategories,
  getProductsByCategory,
  getProductsByBrand,
  getMovements,
  getProductsByCat,
  getDiscountProducts,
  getTrendingProducts,
  getOfferProducts,
  getBestDealProducts,
  getNewArrivalProducts,
  getProductBySlug,
  getAllProductSlugs,
  postSearchProducts,
  getCategoryLabels,
  getbrandLabels,
  normalizeBrandLabelsList,
  getBestDeals,
  getLimitedEdition,
  getTrendingNow1,
  getTrendingNow2,
  getRecommendedProducts,
};
