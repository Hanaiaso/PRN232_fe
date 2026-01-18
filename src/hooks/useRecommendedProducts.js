import { useEffect, useState } from 'react';
import { getRecommendedProducts } from '@/api/endpoints/product';

const useRecommendedProducts = (itemsCount = 6) => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRecommendedProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Call API to fetch recommended products
      const products = await getRecommendedProducts(itemsCount);
      setRecommendedProducts(products);
      setLoading(false);
    } catch (e) {
      setError('Failed to fetch recommended products');
      setLoading(false);
      console.error(e);
    }
  };

  useEffect(() => {
    if (recommendedProducts.length === 0) {
      fetchRecommendedProducts();
    }
  }, []);

  return {
    recommendedProducts, fetchRecommendedProducts, isLoading, error
  };
};

export default useRecommendedProducts;
