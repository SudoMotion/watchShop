import { apiRequest } from './apiSlice';

export const getMiniCart = async (params = {}) =>
  apiRequest('/api/product/mini/cart', 'GET', null, params);

export const getCartProduct = async (params = {}) =>
  apiRequest('/api/get-cart-product', 'GET', null, params);

export const addCartAjax = async (id, params = {}) =>
  apiRequest(`/api/add-cart-ajax/${id}`, 'GET', null, params);

export const addCart = async (body) =>
  apiRequest('/api/add-cart', 'POST', body);

export const cartIncrement = async (rowId, params = {}) =>
  apiRequest(`/api/cart-increment/${rowId}`, 'GET', null, params);

export const cartDecrement = async (rowId, params = {}) =>
  apiRequest(`/api/cart-decrement/${rowId}`, 'GET', null, params);

export const miniCartRemove = async (rowId, params = {}) =>
  apiRequest(`/api/mini/cart/remove/${rowId}`, 'GET', null, params);

export const cartRemove = async (rowId, params = {}) =>
  apiRequest(`/api/cart-remove/${rowId}`, 'GET', null, params);

export const clearCart = async (params = {}) =>
  apiRequest('/api/clear-cart', 'GET', null, params);

export const couponApply = async (couponName) =>
  apiRequest('/api/coupon-apply', 'POST', { coupon_name: couponName });
