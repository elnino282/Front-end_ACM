import type { BuyerAddress, CreateAddressRequest, AddressListParams } from '../model/types';
import { mockAddresses } from './mock-data';

// 🔶 Toggle: set false when backend API is ready
const USE_MOCK = true;
const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export const addressApi = {
  /** GET /api/v1/buyer/addresses — List buyer's addresses */
  list: async (params?: AddressListParams): Promise<BuyerAddress[]> => {
    if (USE_MOCK) {
      await delay(200);
      return [...mockAddresses];
    }
    // Real API — uncomment when ready
    // const response = await httpClient.get('/api/v1/buyer/addresses', { params });
    // return response.data;
    throw new Error('Real API not implemented');
  },

  /** GET /api/v1/buyer/addresses/:id — Address detail */
  getById: async (id: string): Promise<BuyerAddress | null> => {
    if (USE_MOCK) {
      await delay(100);
      return mockAddresses.find(a => a.id === id) ?? null;
    }
    throw new Error('Real API not implemented');
  },

  /** POST /api/v1/buyer/addresses — Create address */
  create: async (data: CreateAddressRequest): Promise<BuyerAddress> => {
    if (USE_MOCK) {
      await delay(300);
      const newAddress: BuyerAddress = {
        id: `addr-${Date.now()}`,
        ...data,
        isDefault: data.isDefault ?? false,
      };
      mockAddresses.push(newAddress);
      return newAddress;
    }
    throw new Error('Real API not implemented');
  },

  /** GET /api/v1/buyer/addresses/default — Get default address */
  getDefault: async (): Promise<BuyerAddress | null> => {
    if (USE_MOCK) {
      await delay(100);
      return mockAddresses.find(a => a.isDefault) ?? null;
    }
    throw new Error('Real API not implemented');
  },
};
