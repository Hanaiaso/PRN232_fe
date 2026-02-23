import { get, post, put, del } from '../api/client';

const BASE = '/api/cart';

export const cartService = {
    getCart: async () => {
        try {
            const response = await get(`${BASE}`);
            return response.items || [];
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    addToCart: async (product) => {
        try {
            await post(`${BASE}/add`, {
                productId: product.id,
                productVariantId: product.variantId || 0,
                quantity: 1
            });
            return true;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    updateQuantity: async (cartItemId, quantity) => {
        try {
            await put(`${BASE}/update-quantity`, {
                cartItemId,
                quantity
            });
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    },

    removeItem: async (cartItemId) => {
        try {
            await del(`${BASE}/items/${cartItemId}`);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    },

    clearCart: async () => {
        try {
            await del(`${BASE}/clear`);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    },

    getCheckoutSummary: async (cartItemIds) => {
        try {
            const response = await post(`${BASE}/summary`, { cartItemIds });
            return response;
        } catch (error) {
            throw error;
        }
    },

    placeOrder: async (cartItemIds) => {
        try {
            const response = await post(`${BASE}/place-order`, { cartItemIds, addressId: 26 });
            return response;
        } catch (error) {
            throw error;
        }
    },

    createPayPalOrder: async (orderId) => {
        try {
            // Note: post without body is valid in our client.js
            const response = await post(`${BASE}/paypal/create-from-order/${orderId}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    capturePayPalPayment: async ({ payPalOrderId, orderId }) => {
        try {
            const response = await post(`${BASE}/paypal/capture-payment`, {
                PayPalOrderId: payPalOrderId,
                OrderId: parseInt(orderId, 10)
            });
            return response;
        } catch (error) {
            throw error;
        }
    }
};
