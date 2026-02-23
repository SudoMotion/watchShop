import { apiRequest } from './apiSlice';

export const bkashPay = async (params = {}) =>
  apiRequest('/api/bkash/pay', 'GET', null, params);

export const bkashCreatePayment = async (params = {}) =>
  apiRequest('/api/bkash/create', 'GET', null, params);

export const bkashCallback = async (params = {}) =>
  apiRequest('/api/bkash/callback', 'GET', null, params);

export const bkashRefundInfo = async (params = {}) =>
  apiRequest('/api/bkash/refund', 'GET', null, params);

export const bkashRefund = async (body) =>
  apiRequest('/api/bkash/refund', 'POST', body);

