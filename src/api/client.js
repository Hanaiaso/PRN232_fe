// API Client - centralized fetch utility
import { API_CONFIG } from './config';

const defaultHeaders = {
  'Content-Type': 'application/json'
};

/**
 * Generic API call function
 * @param {string} endpoint - API endpoint path
 * @param {object} options - fetch options (method, headers, body, etc.)
 * @returns {Promise} - API response
 */
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
};

/**
 * GET request
 */
export const get = (endpoint, options = {}) => {
  return apiCall(endpoint, { method: 'GET', ...options });
};

/**
 * POST request
 */
export const post = (endpoint, body, options = {}) => {
  return apiCall(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(body),
    ...options 
  });
};

/**
 * PUT request
 */
export const put = (endpoint, body, options = {}) => {
  return apiCall(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(body),
    ...options 
  });
};

/**
 * DELETE request
 */
export const del = (endpoint, options = {}) => {
  return apiCall(endpoint, { method: 'DELETE', ...options });
};

export default {
  apiCall,
  get,
  post,
  put,
  del
};
