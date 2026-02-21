/**
 * Product API - connects to the real .NET backend
 * Base: http://localhost:5000/api/product
 */
import { get, post, put, del } from '../client';

const BASE = '/api/product';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Normalize a ProductDto from the backend into the shape used by FE components.
 * Backend:  { id, title, description, categoryId, categoryName, sellerId,
 *             sellerName, isAuction, auctionEndTime, minPrice, maxPrice,
 *             totalStock, averageRating, reviewCount, variants[] }
 * FE shape: { id, name, description, brand, price, originalPrice, image,
 *             imageCollection, sizes, availableColors, ... }
 */
export const normalizeProduct = (p) => {
  if (!p) return null;

  // Use the first variant's image (if any) as the primary image
  const primaryVariant = p.variants && p.variants.length > 0 ? p.variants[0] : null;
  const image = primaryVariant?.variantImageUrl || null;

  // Build imageCollection from variants
  const imageCollection = (p.variants || [])
    .filter((v) => v.variantImageUrl)
    .map((v, i) => ({ id: v.id || i + 1, url: v.variantImageUrl }));

  return {
    id: p.id,
    name: p.title || '',
    description: p.description || '',
    brand: p.sellerName || p.categoryName || '',
    price: p.minPrice || 0,
    originalPrice: p.maxPrice || p.minPrice || 0,
    image,
    images: imageCollection.map((img) => img.url),
    imageCollection,
    // sizes / colors – not yet in BE DTO; keep defaults so UI doesn't break
    sizes: [],
    availableColors: [],
    // metadata
    categoryId: p.categoryId,
    categoryName: p.categoryName || '',
    sellerId: p.sellerId,
    sellerName: p.sellerName || '',
    isAuction: p.isAuction || false,
    auctionEndTime: p.auctionEndTime || null,
    totalStock: p.totalStock || 0,
    rating: p.averageRating || 0,
    reviews: p.reviewCount || 0,
    isFeatured: false,
    isRecommended: false,
    inStock: (p.totalStock || 0) > 0,
    variants: p.variants || [],
    // keep raw fields for admin forms
    title: p.title || '',
    minPrice: p.minPrice || 0,
    maxPrice: p.maxPrice || 0,
  };
};

/**
 * Normalize the paged API response.
 * BE returns: ApiResponse<PagingResponse<ProductDto>>
 *   { success, statusCode, message, data: { pageIndex, pageSize, totalRecords, items: [...] } }
 */
const normalizePaged = (response) => {
  // Unwrap ApiResponse wrapper first
  const paging = response?.data || response || {};
  const rawItems = paging.items || paging.products || paging || [];
  const items = Array.isArray(rawItems) ? rawItems.map(normalizeProduct) : [];
  return {
    products: items,
    total: paging.totalRecords || items.length,
    lastKey: null,
  };
};

// ---------------------------------------------------------------------------
// Public API functions
// ---------------------------------------------------------------------------

/**
 * Fetch a page of products (public).
 * @param {Object} params – ProductSearchDto fields as query params
 */
export const getProducts = async (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') query.append(k, v);
  });
  const qs = query.toString() ? `?${query.toString()}` : '';
  const response = await get(`${BASE}${qs}`);
  return normalizePaged(response);
};

/**
 * Fetch a single product by ID (public).
 */
export const getProductById = async (id) => {
  const response = await get(`${BASE}/${id}`);
  return normalizeProduct(response?.data || response);
};

/**
 * Fetch the authenticated seller's own products.
 */
export const getMyProducts = async (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') query.append(k, v);
  });
  const qs = query.toString() ? `?${query.toString()}` : '';
  const response = await get(`${BASE}/my-products${qs}`);
  return normalizePaged(response);
};

/**
 * Create a new product (SELLER / ADMIN).
 * @param {Object} dto – { title, description, categoryId, isAuction, auctionEndTime }
 */
export const createProduct = async (dto) => {
  const response = await post(BASE, dto);
  return normalizeProduct(response?.data || response);
};

/**
 * Update an existing product (SELLER / ADMIN).
 * @param {number} id
 * @param {Object} dto – { title, description, categoryId, isAuction, auctionEndTime }
 */
export const updateProduct = async (id, dto) => {
  const response = await put(`${BASE}/${id}`, dto);
  return response?.data || response;
};

/**
 * Delete a product (SELLER / ADMIN).
 */
export const deleteProduct = async (id) => {
  const response = await del(`${BASE}/${id}`);
  return response;
};

/**
 * Fetch products by category (public).
 */
export const getProductsByCategory = async (categoryId, params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') query.append(k, v);
  });
  const qs = query.toString() ? `?${query.toString()}` : '';
  const response = await get(`${BASE}/category/${categoryId}${qs}`);
  return normalizePaged(response);
};

// ---------------------------------------------------------------------------
// Convenience wrappers used by existing hooks / sagas
// ---------------------------------------------------------------------------

/** Used by useFeaturedProducts hook and productSaga GET_PRODUCTS */
export const getFeaturedProducts = async (limit = 6) => {
  try {
    const result = await getProducts({ isAuction: false, pageSize: limit, pageNumber: 1 });
    return result.products;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};

/** Used by useRecommendedProducts hook */
export const getRecommendedProducts = async (limit = 6) => {
  try {
    const result = await getProducts({ isAuction: false, pageSize: limit, pageNumber: 2 });
    return result.products;
  } catch (error) {
    console.error('Error fetching recommended products:', error);
    throw error;
  }
};

export default {
  getProducts,
  getProductById,
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getFeaturedProducts,
  getRecommendedProducts,
  normalizeProduct,
};
