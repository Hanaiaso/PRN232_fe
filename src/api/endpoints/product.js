// Product API Configuration
export const PRODUCT_CONFIG = {
  BASE_URL: 'https://fakestoreapi.com',
  ENDPOINTS: {
    LIST: '/products',
    BY_ID: (id) => `/products/${id}`,
    BY_CATEGORY: (category) => `/products/category/${category}`,
    CATEGORIES: '/products/categories'
  }
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
