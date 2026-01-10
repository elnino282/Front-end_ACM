import type { SaleListParams } from './types';

export const saleKeys = {
    all: ['sale'] as const,
    // Farmer sales
    farmerLists: () => [...saleKeys.all, 'farmer', 'list'] as const,
    farmerList: (params?: SaleListParams) => [...saleKeys.farmerLists(), params] as const,
    // Buyer sales
    buyerLists: () => [...saleKeys.all, 'buyer', 'list'] as const,
    buyerList: (params?: SaleListParams) => [...saleKeys.buyerLists(), params] as const,
    // Details
    details: () => [...saleKeys.all, 'detail'] as const,
    detail: (id: number) => [...saleKeys.details(), id] as const,
};
