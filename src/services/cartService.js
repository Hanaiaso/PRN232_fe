import { ENDPOINTS, TEST_USER_ID } from '@/api/endpoints';

export const cartService = {
    getCart: async () => {
        try {
            const response = await fetch(ENDPOINTS.CART.GET_CART(TEST_USER_ID));
            if (!response.ok) throw new Error('Failed to fetch cart');
            const data = await response.json();
            return data.items || [];
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    addToCart: async (product) => {
        try {
            const response = await fetch(ENDPOINTS.CART.ADD, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: TEST_USER_ID,
                    productId: product.id,
                    productVariantId: product.variantId || 0, // Fallback if no variant logic yet
                    quantity: 1
                })
            });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Failed to add to cart');
            }
            return true;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    updateQuantity: async (cartItemId, quantity) => {
        try {
            const response = await fetch(ENDPOINTS.CART.UPDATE, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cartItemId,
                    quantity
                })
            });
            if (!response.ok) throw new Error('Failed to update quantity');
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    },

    removeItem: async (cartItemId) => {
        try {
            const response = await fetch(ENDPOINTS.CART.REMOVE(cartItemId), {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to remove item');
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    },

    clearCart: async () => {
        try {
            const response = await fetch(ENDPOINTS.CART.CLEAR(TEST_USER_ID), {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to clear cart');
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    },

    getCheckoutSummary: async (cartItemIds) => {
        try {
            const response = await fetch(ENDPOINTS.CART.SUMMARY, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartItemIds })
            });
            if (!response.ok) throw new Error('Failed to get summary');
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    placeOrder: async (cartItemIds) => {
        try {
            const response = await fetch(ENDPOINTS.CART.PLACE_ORDER, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartItemIds, userId: TEST_USER_ID, addressId: 26 })
            });
            if (!response.ok) throw new Error('Failed to place order');
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    createPayPalOrder: async (orderId) => {
        try {
            const response = await fetch(ENDPOINTS.CART.PAYPAL_CREATE(orderId), {
                method: 'POST'
            });
            if (!response.ok) throw new Error('Failed to create PayPal order');
            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    capturePayPalPayment: async ({ payPalOrderId, orderId }) => {
        try {
            const response = await fetch(ENDPOINTS.CART.PAYPAL_CAPTURE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ PayPalOrderId: payPalOrderId, OrderId: parseInt(orderId, 10) })
            });
            if (!response.ok) throw new Error('Failed to capture payment');
            return await response.json();
        } catch (error) {
            throw error;
        }
    }
};
