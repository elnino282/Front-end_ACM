// Supplies Entity - Public API
// Only export what components need to use

// Types
export type {
    Supplier,
    SupplyItem,
    SupplyLot,
    StockInRequest,
    StockInResponse,
    SuppliersParams,
    SupplyItemsParams,
    SupplyLotsParams,
} from './model/types';

// Schemas (for validation)
export {
    SupplierSchema,
    SupplyItemSchema,
    SupplyLotSchema,
    StockInRequestSchema,
    StockInResponseSchema,
} from './model/schemas';

// Query Keys
export { suppliesKeys } from './model/keys';

// API Client
export { suppliesApi } from './api/client';

// React Query Hooks
export {
    useSuppliers,
    useAllSuppliers,
    useSupplyItems,
    useAllSupplyItems,
    useSupplyLots,
    useStockIn,
} from './api/hooks';
