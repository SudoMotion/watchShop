import { apiRequest } from './apiSlice';

/**
 * Home API
 * Functions that call API endpoints and return responses
 */

/**
 * Get home data
 * @returns {Promise} - API response
 */
export const getHome = async () => {
    const response = await apiRequest('/api/home', 'GET');
    return response.data;
};

export default {
  getHome,
};
