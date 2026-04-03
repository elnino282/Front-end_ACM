import type { CatalogProduct, ProductListParams, CatalogCategory, FarmInfo, LotInfo } from '../model/types';
import type { PageResponse } from '@/shared/api/types';
import { mockProducts, mockFarms, mockLots } from './mock-data';

// 🔶 Toggle: set false when backend API is ready
const USE_MOCK = true;

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export const productCatalogApi = {
  /** GET /api/v1/products — Public product list */
  list: async (params?: ProductListParams): Promise<PageResponse<CatalogProduct>> => {
    if (USE_MOCK) {
      await delay(300);
      let results = mockProducts.filter(p => p.status === 'published');

      if (params?.category && params.category !== 'all') {
        results = results.filter(p => p.category === params.category);
      }
      if (params?.search) {
        const term = params.search.toLowerCase();
        results = results.filter(p => p.name.toLowerCase().includes(term));
      }
      if (params?.traceableOnly) {
        results = results.filter(p => p.traceable);
      }
      if (params?.sort) {
        switch (params.sort) {
          case 'price_asc': results.sort((a, b) => a.price - b.price); break;
          case 'price_desc': results.sort((a, b) => b.price - a.price); break;
          case 'rating': results.sort((a, b) => b.rating - a.rating); break;
          case 'newest': results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
        }
      }

      const page = params?.page ?? 0;
      const size = params?.size ?? 20;
      const paged = results.slice(page * size, (page + 1) * size);

      return {
        items: paged,
        page,
        size,
        totalElements: results.length,
        totalPages: Math.ceil(results.length / size),
      };
    }

    // Real API — uncomment when ready
    // const response = await httpClient.get('/api/v1/products', { params });
    // return parsePageResponse(response.data, CatalogProductSchema);
    throw new Error('Real API not implemented');
  },

  /** GET /api/v1/products/:slug — Public product detail */
  getBySlug: async (slug: string): Promise<CatalogProduct | null> => {
    if (USE_MOCK) {
      await delay(200);
      return mockProducts.find(p => p.slug === slug && p.status === 'published') ?? null;
    }
    throw new Error('Real API not implemented');
  },

  /** GET /api/v1/categories — Public categories */
  getCategories: async (): Promise<CatalogCategory[]> => {
    if (USE_MOCK) {
      await delay(100);
      const published = mockProducts.filter(p => p.status === 'published');
      const categoryMap = new Map<string, number>();
      for (const p of published) {
        categoryMap.set(p.category, (categoryMap.get(p.category) ?? 0) + 1);
      }
      return Array.from(categoryMap.entries()).map(([name, count], i) => ({
        id: `cat-${i}`,
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        productCount: count,
      }));
    }
    throw new Error('Real API not implemented');
  },

  /** Get farm info for traceability */
  getFarmInfo: async (farmId: string): Promise<FarmInfo | null> => {
    if (USE_MOCK) {
      await delay(50);
      return mockFarms.find(f => f.id === farmId) ?? null;
    }
    throw new Error('Real API not implemented');
  },

  /** Get lot info for traceability */
  getLotInfo: async (lotId: string): Promise<LotInfo | null> => {
    if (USE_MOCK) {
      await delay(50);
      return mockLots.find(l => l.id === lotId) ?? null;
    }
    throw new Error('Real API not implemented');
  },
};
