import { get, post } from '../api/client';

const BASE = '/api/Auction';

export const auctionService = {
  /**
   * Get auction detail by ID (detailed version for eBay UI)
   */
  getAuctionFullDetail: async (id) => {
    try {
      const response = await get(`${BASE}/${id}/detail`);
      return response;
    } catch (error) {
      console.error(`Error fetching full auction detail ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get all active auctions
   */
  getAuctions: async () => {
    try {
      const response = await get(BASE);
      return response || [];
    } catch (error) {
      console.error('Error fetching auctions:', error);
      throw error;
    }
  },

  /**
   * Get auction detail by ID
   */
  getAuctionDetail: async (id) => {
    try {
      const response = await get(`${BASE}/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching auction ${id}:`, error);
      throw error;
    }
  },

  /**
   * Place a bid on an auction
   * @param {number|string} id - Auction ID
   * @param {number} amount - Bid amount
   * @param {number|string} bidderId - User ID
   */
  placeBid: async (id, amount, bidderId) => {
    try {
      const response = await post(`${BASE}/${id}/bid`, {
        bidderId: parseInt(bidderId, 10),
        amount: parseFloat(amount)
      });
      return response;
    } catch (error) {
      console.error(`Error placing bid on ${id}:`, error);
      throw error;
    }
  }
};

export default auctionService;
