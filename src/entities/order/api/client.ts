import type { BuyerOrder, CreateOrderRequest, OrderListParams } from '../model/types';
import type { PageResponse } from '@/shared/api/types';
import { mockOrders } from './mock-data';

const USE_MOCK = true;
const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export const orderApi = {
  /** GET /api/v1/buyer/orders — List buyer's orders */
  list: async (params?: OrderListParams): Promise<PageResponse<BuyerOrder>> => {
    if (USE_MOCK) {
      await delay(300);
      let results = [...mockOrders];
      if (params?.status) {
        results = results.filter(o => o.status === params.status);
      }
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const page = params?.page ?? 0;
      const size = params?.size ?? 20;
      return {
        items: results.slice(page * size, (page + 1) * size),
        page,
        size,
        totalElements: results.length,
        totalPages: Math.ceil(results.length / size),
      };
    }
    throw new Error('Real API not implemented');
  },

  /** GET /api/v1/buyer/orders/:id — Order detail */
  getById: async (id: string): Promise<BuyerOrder | null> => {
    if (USE_MOCK) {
      await delay(200);
      return mockOrders.find(o => o.id === id) ?? null;
    }
    throw new Error('Real API not implemented');
  },

  /** POST /api/v1/buyer/orders — Create order */
  create: async (data: CreateOrderRequest): Promise<BuyerOrder> => {
    if (USE_MOCK) {
      await delay(500);
      const newOrder: BuyerOrder = {
        id: `o${Date.now()}`,
        buyerId: 'u1',
        sellerId: 'u2',
        items: data.items.map(item => ({
          ...item,
          productName: 'Sản phẩm',
          productImage: '',
          productSlug: '',
          price: 0,
        })),
        total: 0,
        shippingFee: 30000,
        status: 'pending',
        address: data.address,
        phone: data.phone,
        paymentMethod: data.paymentMethod,
        note: data.note,
        createdAt: new Date().toISOString(),
      };
      return newOrder;
    }
    throw new Error('Real API not implemented');
  },
};
