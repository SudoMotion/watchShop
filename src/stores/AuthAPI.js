import { apiRequest } from './apiSlice';

export const useLoginMutation = async (body) => {
  return apiRequest('/api/auth/login', 'POST', body, null, {}, { baseURL: '' });
};

export const useRegisterMutation = async (body) => {
  return apiRequest('/api/auth/register', 'POST', body, null, {}, { baseURL: '' });
};

export const useSendOtpMutation = async (body) => {
  return apiRequest('/api/otp/send', 'POST', body);
};

export const useVerifyOtpMutation = async (body) => {
  return apiRequest('/api/otp/verify', 'POST', body);
};
