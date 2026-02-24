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
 * Fetch Laravel Sanctum CSRF cookie and return token for X-XSRF-TOKEN header.
 * Call this before login/register or any state-changing request that returns 419 CSRF.
 */
export const getCsrfToken = async () => {
  const base = NEXT_PUBLIC_API_URL || '';
  try {
    await fetch(`${base}/sanctum/csrf-cookie`, { credentials: 'include' });
    const match = typeof document !== 'undefined' && document.cookie && document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    const raw = match ? match[1] : null;
    if (raw) {
      try {
        const token = decodeURIComponent(raw);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/d1c02dd7-cbd9-4eee-9fc7-69ffe71fb03e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'apiSlice.js:getCsrfToken',message:'CSRF token obtained',data:{hasToken:true},timestamp:Date.now(),hypothesisId:'H3'})}).catch(()=>{});
        // #endregion
        return token;
      } catch {
        return raw;
      }
    }
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/d1c02dd7-cbd9-4eee-9fc7-69ffe71fb03e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'apiSlice.js:getCsrfToken',message:'CSRF token not readable',data:{hasToken:false},timestamp:Date.now(),hypothesisId:'H4'})}).catch(()=>{});
    // #endregion
  } catch (e) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/d1c02dd7-cbd9-4eee-9fc7-69ffe71fb03e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'apiSlice.js:getCsrfToken',message:'sanctum/csrf-cookie request failed',data:{error:String(e && e.message)},timestamp:Date.now(),hypothesisId:'H5'})}).catch(()=>{});
    // #endregion
  }
  return null;
};

/**
 * API function that receives endpoint and method
 * @param {string} endpoint - API endpoint URL
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE, PATCH)
 * @param {object} data - Request body data (optional, for POST/PUT/PATCH)
 * @param {object} params - Query parameters (optional, for GET requests)
 * @param {object} headers - Custom headers (optional)
 * @param {object} options - Optional request options, e.g. { withCredentials: true }
 * @returns {Promise} - Axios response
 */
export const apiRequest = async (endpoint, method = 'GET', data = null, params = null, headers = {}, options = {}) => {
  try {
    const config = {
      url: endpoint,
      method: method.toUpperCase(),
      headers: {
        ...axiosInstance.defaults.headers,
        ...headers,
      },
    };
    if (options.withCredentials !== undefined) {
      config.withCredentials = options.withCredentials;
    }
    if (options.baseURL !== undefined) {
      config.baseURL = options.baseURL;
    }

    // Add data for POST, PUT, PATCH requests
    if (data && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      config.data = data;
    }

    // Add params for GET requests
    if (params && method.toUpperCase() === 'GET') {
      config.params = params;
    }

    // #region agent log
    const base = options.baseURL !== undefined ? options.baseURL : (axiosInstance.defaults.baseURL || '');
    const fullUrl = (base || '') + endpoint;
    fetch('http://127.0.0.1:7242/ingest/d1c02dd7-cbd9-4eee-9fc7-69ffe71fb03e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'apiSlice.js:apiRequest',message:'API request outgoing',data:{url:fullUrl,method:config.method,hasXsrfHeader:!!headers['X-XSRF-TOKEN'],withCredentials:config.withCredentials ?? axiosInstance.defaults.withCredentials},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
    // #endregion

    const response = await axiosInstance(config);

    // #region agent log
    const isCsrfError = response && (response.status === 419 || (response.data && String(JSON.stringify(response.data)).includes('CSRF')));
    if (isCsrfError) {
      fetch('http://127.0.0.1:7242/ingest/d1c02dd7-cbd9-4eee-9fc7-69ffe71fb03e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'apiSlice.js:apiRequest',message:'CSRF or 419 response',data:{status:response.status,body:response.data},timestamp:Date.now(),hypothesisId:'H2'})}).catch(()=>{});
    }
    // #endregion

    return response;
  } catch (error) {
    // #region agent log
    const errCsrf = error.response && (error.response.status === 419 || (error.response.data && String(JSON.stringify(error.response.data)).includes('CSRF')));
    if (errCsrf) {
      fetch('http://127.0.0.1:7242/ingest/d1c02dd7-cbd9-4eee-9fc7-69ffe71fb03e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'apiSlice.js:apiRequest',message:'CSRF or 419 in catch',data:{status:error.response.status,body:error.response.data},timestamp:Date.now(),hypothesisId:'H2'})}).catch(()=>{});
    }
    // #endregion
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
