import { get, post } from '../client';

const BASE = '/api/reviews';

/**
 * Fetch all reviews for a specific product.
 * @param {string|number} productId
 */
export const getReviewsByProduct = async (productId) => {
  const response = await get(`${BASE}/product/${productId}`);
  return response?.data || response || [];
};

/**
 * Create a new review.
 * @param {object} dto - { productId, rating, comment }
 */
export const createReview = async (dto) => {
  const response = await post(BASE, dto);
  return response?.data || response;
};

/**
 * Check if current user can review the product
 * @param {number|string} productId 
 */
export const checkCanReview = (productId) => get(`${BASE}/can-review/${productId}`);
