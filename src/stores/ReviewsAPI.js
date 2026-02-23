import { apiRequest } from './apiSlice';

export const submitReview = async (body) =>
  apiRequest('/api/review-product', 'POST', body);

export const getReviewList = async (productId, params = {}) =>
  apiRequest(`/api/review-list/${productId}`, 'GET', null, params);
