/**
 * API Configuration
 * Set Vite env variable VITE_API_URL to override (e.g. in .env)
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
};
