import { apiRequest } from './apiSlice';

export const getCurrentUser = async (token, params = {}) =>
  apiRequest('/api/user', 'GET', null, params, {
    Authorization: token ? `Bearer ${token}` : '',
  });
