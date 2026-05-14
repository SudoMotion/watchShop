import { apiRequest } from './apiSlice';

const authHeader = (token) => ({
  Authorization: token ? `Bearer ${token}` : '',
});

/** @deprecated or legacy — kept for callers still using /api/user */
export const getCurrentUser = async (token, params = {}) =>
  apiRequest('/api/user', 'GET', null, params, authHeader(token));

/**
 * Current customer (JSON) — GET /api/customer/me
 * @see src/_lib/doc.txt §1
 */
export const getCustomerProfile = async (token, params = {}) =>
  apiRequest('/api/customer/me', 'GET', null, params, authHeader(token));

/**
 * Update customer profile — PATCH /api/customer/profile
 * Body: at least one of name, email, address, phone (optional nested { data: { ... } })
 * @see src/_lib/doc.txt §2
 */
export const updateCustomerProfile = async (token, body, params = {}) =>
  apiRequest('/api/customer/profile', 'PATCH', body, params, authHeader(token));

/**
 * Paginated order history — GET /api/customer/orders
 * Query: page, per_page (default 15, max 50)
 * @see src/_lib/doc.txt §3
 */
export const getCustomerOrders = async (token, params = {}) =>
  apiRequest('/api/customer/orders', 'GET', null, params, authHeader(token));
