import { useEffect, useState } from 'react';
import { getFeaturedProducts } from '@/api/endpoints/product';

const useFeaturedProducts = (itemsCount = 6) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Call API to fetch featured products
      const products = await getFeaturedProducts(itemsCount);
      setFeaturedProducts(products);
      setLoading(false);
    } catch (e) {
      setError('Failed to fetch featured products');
      setLoading(false);
      console.error(e);
    }
  };

  useEffect(() => {
    if (featuredProducts.length === 0) {
      fetchFeaturedProducts();
    }
  }, []);

  return {
    featuredProducts, fetchFeaturedProducts, isLoading, error
  };
};

export default useFeaturedProducts;
