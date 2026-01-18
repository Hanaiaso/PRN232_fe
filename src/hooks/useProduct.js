import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import mockImg from '@/img/mock.jpg';

const useProduct = (id) => {
  // get and check if product exists in store
  const storeProduct = useSelector((state) => state.products.items.find((item) => item.id === id));

  const [product, setProduct] = useState(storeProduct);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock product data - always return this data regardless of id param
  const MOCK_PRODUCT_DATA = {
    id: 'prod-001',
    name: 'Premium Eyeglasses',
    brand: 'Salinaka Premium',
    price: 99.99,
    originalPrice: 149.99,
    image: mockImg,
    images: [mockImg, mockImg],
    imageCollection: [
      { id: 1, url: mockImg },
      { id: 2, url: mockImg },
      { id: 3, url: mockImg }
    ],
    description: 'High-quality prescription eyeglasses with anti-scratch coating',
    fullDescription: 'Our premium eyeglasses feature high-quality lenses with anti-scratch coating and UV protection. Perfect for everyday use. These frames are made from premium materials and are designed for long-term comfort and durability.',
    category: 'eyeglasses',
    isFeatured: true,
    isRecommended: false,
    inStock: true,
    rating: 4.5,
    reviews: 12,
    colors: ['Black', 'Brown', 'Gold'],
    availableColors: ['#000000', '#8B4513', '#FFD700'],
    sizes: ['48', '50', '52', '54', '56', '58'],
    quantity: 100,
    tag: 'New',
    badges: ['bestseller', 'limited']
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Always return the same mock product regardless of id param
        setProduct(MOCK_PRODUCT_DATA);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err?.message || 'Something went wrong.');
      }
    })();
  }, [id]);

  return { product, isLoading, error };
};

export default useProduct;
