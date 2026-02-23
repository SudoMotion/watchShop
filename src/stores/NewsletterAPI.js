import { apiRequest } from './apiSlice';

export const newsletterStore = async (body) =>
  apiRequest('/api/newsletter/store', 'POST', body);

export const subscribeStore = async (body) =>
  apiRequest('/api/subscribe-store', 'POST', body);
