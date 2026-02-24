import { apiRequest } from './apiSlice';

/** Use server proxy to avoid CORS blocking sanctum/csrf-cookie; proxy handles CSRF. */
export const useLoginMutation = async (body) => {
  return apiRequest('/api/auth/login', 'POST', body, null, {}, { baseURL: '' });
};

export const useRegisterMutation = async (body) => {
  return apiRequest('/api/auth/register', 'POST', body, null, {}, { baseURL: '' });
};
