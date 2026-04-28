import { apiRequest } from './apiSlice';

export const getSections = async () => {
  try {
    const response = await apiRequest('/api/product-sections');
    return response.data;
  } catch (error) {
    console.error('Error fetching sections:', error);
    return null;
  }
};

export const getSectionDetail = async (id, params = {}) => {
  try {
    const response = await apiRequest(`/api/product-sections/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching section detail:', error);
    return null;
  }
};
export const getNotice = async () => {
  try {
    const response = await apiRequest(`/api/notice`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notice:', error);
    return null;
  }
};
