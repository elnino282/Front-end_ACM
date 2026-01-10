export const inventoryKeys = {
    all: ['inventory'] as const,
    warehouses: () => [...inventoryKeys.all, 'warehouses'] as const,
    locations: (warehouseId: number) => [...inventoryKeys.all, 'locations', warehouseId] as const,
    onHand: (params: { warehouseId: number; locationId?: number; lotId?: number; q?: string; page?: number; size?: number }) => 
        [...inventoryKeys.all, 'on-hand', params] as const,
    movements: (params: { warehouseId: number; type?: string; from?: string; to?: string; page?: number; size?: number }) =>
        [...inventoryKeys.all, 'movements', params] as const,
    lotOnHand: (lotId: number, warehouseId: number, locationId?: number) =>
        [...inventoryKeys.all, 'lot-on-hand', lotId, warehouseId, locationId] as const,
};
