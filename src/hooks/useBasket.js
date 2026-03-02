import { displayActionMessage } from '@/helpers/utils';
import { useDispatch, useSelector } from 'react-redux';
import { addToBasket as dispatchAddToBasket, removeFromBasket, setBasketItems } from '@/redux/actions/basketActions';
import { cartService } from '@/services/cartService';
import { useEffect } from 'react';

const useBasket = (id) => {
  const { basket } = useSelector((state) => ({ basket: state.basket }));
  const dispatch = useDispatch();

  const isItemOnBasket = (productId) => !!basket.find((item) => item.productId === productId);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const items = await cartService.getCart();
    // Map backend items to frontend structure if necessary
    // Backend: { cartItemId, productId, productTitle, quantity, unitPrice, ... }
    // Frontend expects: { id: productId, ...someOtherFields }
    // We might need to adjust reducer or mapping here.
    // For now, let's assume we map `productTitle` -> `name`, `unitPrice` -> `price`
    const mappedItems = items.map(item => ({
      ...item,
      // Map Backend -> Frontend
      cartItemId: item.cartItemId,
      id: item.productId,
      name: item.productTitle,
      price: item.unitPrice,
      quantity: item.quantity,
      image: item.variantImageUrl || '', // Real field from Backend
      selectedSize: item.selectedSize || '', // Real field if mapped
      selectedColor: item.selectedColor || '', // Real field if mapped
      maxQuantity: item.stockQuantity || 100
    }));
    dispatch(setBasketItems(mappedItems));
  };

  const addToBasket = async (product) => {
    if (isItemOnBasket(product.id)) {
      // Find cartItemId to remove
      const item = basket.find(i => i.productId === product.id);
      if (item && item.cartItemId) {
        await cartService.removeItem(item.cartItemId);
        displayActionMessage('Item removed from basket', 'info');
        await fetchCart();
      }
    } else {
      try {
        await cartService.addToCart(product);
        displayActionMessage('Item added to basket', 'success');
        await fetchCart();
      } catch (e) {
        displayActionMessage('Failed to add to basket', 'error');
      }
    }
  };

  const removeFromBasket = async (cartItemId) => {
    try {
      if (cartItemId) { // Backend ID
        await cartService.removeItem(cartItemId);
      } else {
        // Fallback for logic where product.id might be passed (toggle from product view)
        // If passed product ID, we need to find the item in current basket
        // But this function generally expects cartItemId per new design
        // For now, let's keep it simple.
      }
      displayActionMessage('Item removed from basket', 'info');
      await fetchCart();
    } catch (e) {
      displayActionMessage('Failed to remove item', 'error');
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      await cartService.updateQuantity(cartItemId, quantity);
      await fetchCart();
    } catch (e) {
      displayActionMessage('Failed to update quantity', 'error');
    }
  };

  const clearBasket = async () => {
    try {
      await cartService.clearCart();
      dispatch(setBasketItems([]));
      displayActionMessage('Basket cleared', 'info');
    } catch (e) {
      displayActionMessage('Failed to clear basket', 'error');
    }
  };

  return { basket, isItemOnBasket, addToBasket, removeFromBasket, updateQuantity, clearBasket };
};

export default useBasket;
