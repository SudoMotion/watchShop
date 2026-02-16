import { apiRequest } from './apiSlice';

export const getAboutPage = async (params = {}) => {
  try {
    const response = await apiRequest('/api/about', 'GET', null, params);
    return response.data;
  } catch (error) {
    console.error('Error fetching about page:', error);
    return null;
  }
};

export const getOrderInformation = async (params = {}) => {
  try {
    const response = await apiRequest('/api/order-information', 'GET', null, params);
    return response.data;
  } catch (error) {
    console.error('Error fetching order information:', error);
    return null;
  }
};

export const getAuthenticity = async (params = {}) => {
  try {
    const response = await apiRequest('/api/authenticity', 'GET', null, params);
    return response.data;
  } catch (error) {
    console.error('Error fetching authenticity:', error);
    return null;
  }
};

export const getShippingInformation = async (params = {}) => {
  try {
    const response = await apiRequest('/api/shipping-information', 'GET', null, params);
    return response.data;
  } catch (error) {
    console.error('Error fetching shipping information:', error);
    return null;
  }
};

export const getTermsConditions = async (params = {}) => {
  try {
    const response = await apiRequest('/api/terms-conditions', 'GET', null, params);
    return response.data;
  } catch (error) {
    console.error('Error fetching terms & conditions:', error);
    return null;
  }
};

export const getFaq = async (params = {}) => {
  try {
    const response = await apiRequest('/api/faq', 'GET', null, params);
    return response.data;
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    return null;
  }
};

export const getReturnPolicy = async (params = {}) => {
  try {
    const response = await apiRequest('/api/return-policy', 'GET', null, params);
    return response.data;
  } catch (error) {
    console.error('Error fetching return policy:', error);
    return null;
  }
};

export const getPrivacyPolicy = async (params = {}) => {
  try {
    const response = await apiRequest('/api/privacy-policy', 'GET', null, params);
    return response.data;
  } catch (error) {
    console.error('Error fetching privacy policy:', error);
    return null;
  }
};

export const getCustomerService = async (params = {}) => {
  try {
    const response = await apiRequest('/api/customer-service', 'GET', null, params);
    return response.data;
  } catch (error) {
    console.error('Error fetching customer service:', error);
    return null;
  }
};

export const getWarrantyPolicy = async (params = {}) => {
  try {
    const response = await apiRequest('/api/warranty-policy', 'GET', null, params);
    return response.data;
  } catch (error) {
    console.error('Error fetching warranty policy:', error);
    return null;
  }
};

export const getFastestDelivery = async (params = {}) => {
  try {
    const response = await apiRequest('/api/fastest-delivery', 'GET', null, params);
    return response.data;
  } catch (error) {
    console.error('Error fetching fastest delivery:', error);
    return null;
  }
};

export const getPhysicalStore = async (params = {}) => {
  try {
    const response = await apiRequest('/api/physical-store', 'GET', null, params);
    return response.data;
  } catch (error) {
    console.error('Error fetching physical store:', error);
    return null;
  }
};

export const sendContact = async (body) => {
  try {
    const response = await apiRequest('/api/contact/send', 'POST', body);
    return response;
  } catch (error) {
    console.error('Error sending contact:', error);
    return null;
  }
};
