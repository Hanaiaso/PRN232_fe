import { get } from '../client';

const BASE = '/api/categories';

/**
 * Fetch all categories.
 */
export const getCategories = async () => {
  const response = await get(BASE);
  return response?.data || response || [];
};
