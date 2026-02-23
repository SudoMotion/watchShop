import { apiRequest } from './apiSlice';

export const useLoginMutation = async (body) => apiRequest('/api/customer/login', 'POST', body);

export const useRegisterMutation = async (body) => apiRequest('/api/customer/register', 'POST', body);
