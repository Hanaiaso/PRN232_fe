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

    getCheckoutSummary: async (cartItemIds, addressId = null, couponId = null) => {
        try {
            const payload = { cartItemIds };
            if (addressId) payload.addressId = addressId;
            if (couponId) payload.couponId = couponId;
            const response = await post(`${BASE}/summary`, payload);
            return response;
        } catch (error) {
            throw error;
        }
    },

    placeOrder: async (cartItemIds, addressId, couponId = null) => {
        try {
            const payload = { cartItemIds, addressId };
            if (couponId) payload.couponId = couponId;
            const response = await post(`${BASE}/place-order`, payload);
            return response;
        } catch (error) {
            throw error;
        }
    },

    validateCoupon: async (code, subTotal) => {
        try {
            const response = await get(`${BASE}/coupon/${code}?subTotal=${subTotal}`);
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
