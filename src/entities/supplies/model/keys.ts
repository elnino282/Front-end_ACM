import type { SuppliersParams, SupplyItemsParams, SupplyLotsParams } from './types';

export const suppliesKeys = {
    all: ['supplies'] as const,
    suppliers: (params?: SuppliersParams) => [...suppliesKeys.all, 'suppliers', params ?? {}] as const,
    items: (params?: SupplyItemsParams) => [...suppliesKeys.all, 'items', params ?? {}] as const,
    lots: (params?: SupplyLotsParams) => [...suppliesKeys.all, 'lots', params ?? {}] as const,
};
