import axios from 'axios';
import { NEXT_PUBLIC_API_URL } from '@/config';

/**
 * API Slice - Simple API function
 * Receives endpoint and method, fetches and returns response
 */

// Create axios instance
const axiosInstance = axios.create({
  baseURL: NEXT_PUBLIC_API_URL || '',
  withCredentials: false, // Set to false for CORS
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  // CORS configuration
  crossDomain: true,
});

/**
 * API function that receives endpoint and method
 * @param {string} endpoint - API endpoint URL
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE, PATCH)
 * @param {object} data - Request body data (optional, for POST/PUT/PATCH)
 * @param {object} params - Query parameters (optional, for GET requests)
 * @param {object} headers - Custom headers (optional)
 * @returns {Promise} - Axios response
 */
export const apiRequest = async (endpoint, method = 'GET', data = null, params = null, headers = {}) => {
  try {
    const config = {
      url: endpoint,
      method: method.toUpperCase(),
      headers: {
        ...axiosInstance.defaults.headers,
        ...headers,
      },
    };

    // Add data for POST, PUT, PATCH requests
    if (data && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      config.data = data;
    }

    // Add params for GET requests
    if (params && method.toUpperCase() === 'GET') {
      config.params = params;
    }

    const response = await axiosInstance(config);
    return response;
  } catch (error) {
    // Return error response instead of throwing
    if (error.response) {
      // Server responded with error status
      return error.response;
    } else if (error.request) {
      // Request was made but no response received
      return {
        data: null,
        status: 0,
        statusText: 'Network Error',
        error: error.message,
      };
    } else {
      // Something else happened
      return {
        data: null,
        status: 0,
        statusText: 'Error',
        error: error.message,
      };
    }
  }
};

export default apiRequest;
