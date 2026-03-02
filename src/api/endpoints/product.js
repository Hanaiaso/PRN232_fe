<<<<<<< Updated upstream
// Product API Configuration
export const PRODUCT_CONFIG = {
  BASE_URL: 'https://fakestoreapi.com',
  ENDPOINTS: {
    LIST: '/products',
    BY_ID: (id) => `/products/${id}`,
    BY_CATEGORY: (category) => `/products/category/${category}`,
    CATEGORIES: '/products/categories'
  }
=======
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
    // Auction fields
    currentHighestBid: p.currentHighestBid || 0,
    bidCount: p.bidCount || 0,
    // keep raw fields for admin forms
    title: p.title || '',
    minPrice: p.minPrice || 0,
    maxPrice: p.maxPrice || 0,
  };
>>>>>>> Stashed changes
};

// Product API Client
import { get } from '../client';

/**
 * Get featured products from FakeStore API
 * @param {number} limit - Number of products to fetch
 * @returns {Promise} - Array of products
 */
export const getFeaturedProducts = async (limit = 6) => {
  try {
    const products = await get(PRODUCT_CONFIG.ENDPOINTS.LIST + '?limit=10');
    
    const transformedProducts = products.slice(0, limit).map((product, index) => ({
      id: `prod-${product.id}`,
      name: product.title,
      brand: 'FakeStore Brand',
      price: product.price * 20,
      originalPrice: product.price * 25,
      image: product.image,
      images: [product.image],
      description: product.description.substring(0, 100) + '...',
      category: product.category,
      isFeatured: index < 6,
      isRecommended: false,
      inStock: true,
      rating: product.rating?.rate || 4.5,
      reviews: product.rating?.count || Math.floor(Math.random() * 50 + 10),
      imageCollection: [
        { id: 1, url: product.image },
        { id: 2, url: product.image },
        { id: 3, url: product.image }
      ],
      sizes: ['48', '50', '52', '54', '56', '58'],
      availableColors: ['#000000', '#8B4513', '#FFD700']
    }));

    return transformedProducts;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};

/**
 * Get recommended products from FakeStore API
 * @param {number} limit - Number of products to fetch
 * @returns {Promise} - Array of products
 */
export const getRecommendedProducts = async (limit = 6) => {
  try {
    const products = await get(PRODUCT_CONFIG.ENDPOINTS.LIST + '?limit=10');
    
    const transformedProducts = products.slice(limit, limit + 6).map((product) => ({
      id: `prod-rec-${product.id}`,
      name: product.title,
      brand: 'FakeStore Brand',
      price: product.price * 20,
      originalPrice: product.price * 25,
      image: product.image,
      images: [product.image],
      description: product.description.substring(0, 100) + '...',
      category: product.category,
      isFeatured: false,
      isRecommended: true,
      inStock: true,
      rating: product.rating?.rate || 4.5,
      reviews: product.rating?.count || Math.floor(Math.random() * 50 + 10),
      imageCollection: [
        { id: 1, url: product.image },
        { id: 2, url: product.image },
        { id: 3, url: product.image }
      ],
      sizes: ['48', '50', '52', '54', '56', '58'],
      availableColors: ['#000000', '#8B4513', '#FFD700']
    }));

    return transformedProducts;
  } catch (error) {
    console.error('Error fetching recommended products:', error);
    throw error;
  }
};

/**
 * Get single product by ID
 * @param {string} id - Product ID
 * @returns {Promise} - Product object
 */
export const getProductById = async (id) => {
  try {
    const product = await get(PRODUCT_CONFIG.ENDPOINTS.BY_ID(id));
    
    return {
      id: `prod-${product.id}`,
      name: product.title,
      brand: 'FakeStore Brand',
      price: product.price * 20,
      originalPrice: product.price * 25,
      image: product.image,
      images: [product.image],
      description: product.description,
      fullDescription: product.description,
      category: product.category,
      isFeatured: false,
      isRecommended: false,
      inStock: true,
      rating: product.rating?.rate || 4.5,
      reviews: product.rating?.count || 0,
      imageCollection: [
        { id: 1, url: product.image },
        { id: 2, url: product.image },
        { id: 3, url: product.image }
      ],
      sizes: ['48', '50', '52', '54', '56', '58'],
      availableColors: ['#000000', '#8B4513', '#FFD700']
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export default {
  PRODUCT_CONFIG,
  getFeaturedProducts,
  getRecommendedProducts,
  getProductById
};
