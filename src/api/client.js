// API Client - centralized fetch utility with token attach + auto-refresh
import { API_CONFIG } from './config';
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  removeTokens
} from './token';

const defaultHeaders = {
  'Content-Type': 'application/json'
};

async function doFetch(url, config) {
  const response = await fetch(url, config);
  return response;
}

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const headers = {
    ...defaultHeaders,
    ...options.headers
  };

  // Attach Authorization if access token exists
  const accessToken = getAccessToken();
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  const config = {
    ...options,
    headers
  };

  let response = await doFetch(url, config);

  // Handle 401 -> try refresh
  if (response.status === 401) {
    // try refresh token
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      try {
        const rtResponse = await fetch(`${API_CONFIG.BASE_URL}/api/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });

        if (rtResponse.ok) {
          const rtData = await rtResponse.json();
          setAccessToken(rtData.accessToken);
          setRefreshToken(rtData.refreshToken);

          // retry original request with new token
          config.headers.Authorization = `Bearer ${rtData.accessToken}`;
          response = await doFetch(url, config);
        } else {
          // refresh failed - clear tokens
          removeTokens();
          throw new Error('Refresh token invalid');
        }
      } catch (e) {
        removeTokens();
        throw e;
      }
    }
  }

  if (!response.ok) {
    // try parse json error
    let errorText = `${response.status} ${response.statusText}`;
    try {
      const json = await response.json();
      errorText = json?.message || JSON.stringify(json) || errorText;
    } catch (e) {
      // ignore
    }
    const error = new Error(`API Error: ${errorText}`);
    error.status = response.status;
    throw error;
  }

  // no content
  if (response.status === 204) return null;

  const data = await response.json();
  return data;
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
