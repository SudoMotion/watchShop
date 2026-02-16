import { apiRequest } from './apiSlice';

export const getBlogList = async (params = {}) => {
  try {
    const response = await apiRequest('/api/blog', 'GET', null, params);
    return response.data;
  } catch (error) {
    console.error('Error fetching blog list:', error);
    return null;
  }
};

export const getBlogMagazine = async (params = {}) => {
  try {
    const response = await apiRequest('/api/blog/magazine', 'GET', null, params);
    return response.data;
  } catch (error) {
    console.error('Error fetching magazine blogs:', error);
    return null;
  }
};

export const getBlogDetails = async (id, params = {}) => {
  try {
    const response = await apiRequest(`/api/blog/details/${id}`, 'GET', null, params);
    return response.data;
  } catch (error) {
    console.error('Error fetching blog details:', error);
    return null;
  }
};
