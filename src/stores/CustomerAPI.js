import { apiRequest } from './apiSlice';

export const login = async (body) => apiRequest('/api/customer/login', 'POST', body);

export const register = async (body) => apiRequest('/api/customer/register', 'POST', body);

export const getForgotPasswordForm = async (params = {}) =>
  apiRequest('/api/customer/password/forgot', 'GET', null, params);

export const sendForgotPasswordLink = async (body) =>
  apiRequest('/api/customer/password/forgot', 'POST', body);

export const getResetPasswordForm = async (token, phone, params = {}) =>
  apiRequest(`/api/customer/password/reset/${token}/${phone}`, 'GET', null, params);

export const getOtpForm = async (token, phone, params = {}) =>
  apiRequest(`/api/customer/password/otp/${token}/${phone}`, 'GET', null, params);

export const resetPassword = async (body) =>
  apiRequest('/api/customer/password/reset', 'POST', body);

export const checkOtp = async (body) =>
  apiRequest('/api/customer/otp/check', 'POST', body);

export const updatePassword = async (body) =>
  apiRequest('/api/customer/password/update', 'POST', body);

export const getDashboard = async (params = {}) =>
  apiRequest('/api/customer/dashboard', 'GET', null, params);

export const getAddress = async (params = {}) =>
  apiRequest('/api/customer/address', 'GET', null, params);

export const updateAddress = async (id, body) =>
  apiRequest(`/api/customer/address/update/${id}`, 'PUT', body);

export const getOrderList = async (params = {}) =>
  apiRequest('/api/customer/order', 'GET', null, params);

export const getOrderSuccess = async (id, params = {}) =>
  apiRequest(`/api/customer/order/success/${id}`, 'GET', null, params);

export const getOrderDetail = async (id, params = {}) =>
  apiRequest(`/api/customer/order/show/${id}`, 'GET', null, params);

export const getOrderPrint = async (id, params = {}) =>
  apiRequest(`/api/customer/order/print/${id}`, 'GET', null, params);

export const getChangePasswordForm = async (params = {}) =>
  apiRequest('/api/customer/change/password', 'GET', null, params);

export const customerUpdatePassword = async (body) =>
  apiRequest('/api/customer/update/password', 'POST', body);

export const logout = async (params = {}) =>
  apiRequest('/api/customer/logout', 'GET', null, params);

export const getShipAmount = async (id, params = {}) =>
  apiRequest(`/api/get-shipamount/${id}`, 'GET', null, params);

export const checkoutStore = async (body) =>
  apiRequest('/api/checkout/store', 'POST', body);

export const getCheckoutData = async (params = {}) =>
  apiRequest('/api/products/checkout', 'GET', null, params);

export const wishlistDelete = async (id, params = {}) =>
  apiRequest(`/api/wishlist-delete/${id}`, 'GET', null, params);

export const cancelOrder = async (id, params = {}) =>
  apiRequest(`/api/customer/Canceled/${id}`, 'GET', null, params);
