import { API_CONFIG } from './config';

// API base uses Vite env variable VITE_API_URL (see .env)
export const API_BASE_URL = `${API_CONFIG.BASE_URL}/api`;

// Default User ID for testing - kept if needed by other components, though mostly obsolete

export const ENDPOINTS = {
    // NOTE: Cart and Order endpoints now use relative paths within their services.
};
