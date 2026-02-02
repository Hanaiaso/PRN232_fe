// export const API_BASE_URL = 'http://localhost:5000/api'; // Or your backend URL
// export const API_BASE_URL = 'http://localhost:5000/api'; // Or your backend URL
export const API_BASE_URL = 'http://localhost:5282/api'; // Correct port from launchSettings

// BYPASS AUTH: Hardcoded User ID for Testing
export const TEST_USER_ID = 40;

export const ENDPOINTS = {
    CART: {
        GET_CART: (userId) => `${API_BASE_URL}/cart/${userId}`,
        ADD: `${API_BASE_URL}/cart/add`,
        UPDATE: `${API_BASE_URL}/cart/update-quantity`,
        REMOVE: (itemId) => `${API_BASE_URL}/cart/items/${itemId}`,
        CLEAR: (userId) => `${API_BASE_URL}/cart/clear/${userId}`,
        SUMMARY: `${API_BASE_URL}/cart/summary`,
        PLACE_ORDER: `${API_BASE_URL}/cart/place-order`,
        PAYPAL_CREATE: (orderId) => `${API_BASE_URL}/cart/paypal/create-from-order/${orderId}`,
        PAYPAL_CAPTURE: `${API_BASE_URL}/cart/paypal/capture-payment`
    }
};
