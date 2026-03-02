import { get, post, put, del } from '../api/client';

const BASE = '/api/user';

export const userService = {
    getAddresses: async () => {
        try {
            const response = await get(`${BASE}/addresses`);
            return response || [];
        } catch (error) {
            console.error(error);
            return [];
        }
    }
};
