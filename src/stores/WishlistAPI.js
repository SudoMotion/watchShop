import { apiRequest } from './apiSlice';

export const getWishlistPage = async (params = {}) =>
  apiRequest('/api/wishlist-page', 'GET', null, params);

export const addToWishlist = async (productId) =>
  apiRequest('/api/wishlist', 'POST', { product_id: productId });

export const getWishlistCount = async (params = {}) =>
  apiRequest('/api/wishlist-count', 'GET', null, params);
