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
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/d1c02dd7-cbd9-4eee-9fc7-69ffe71fb03e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'HomeAPI.js:getHome',message:'getHome response',data:{status:response?.status,dataIsNull:response?.data==null},timestamp:Date.now(),hypothesisId:'H2'})}).catch(()=>{});
    // #endregion
    return response.data;
};

export default {
  getHome,
};
