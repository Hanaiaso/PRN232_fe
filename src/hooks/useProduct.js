import { useEffect, useState } from 'react';
import { getProductById } from '@/api/endpoints/product';

const useProduct = (id) => {
  const [product, setProduct] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProductById(id);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err?.message || 'Failed to load product.');
      }
    })();
  }, [id]);

  return { product, isLoading, error };
};

export default useProduct;
