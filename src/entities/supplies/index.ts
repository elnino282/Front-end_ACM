// Supplies Entity - Public API
// Only export what components need to use

// Types
export type {
  CreateSupplierRequest,
  StockInRequest,
  StockInResponse,
  Supplier,
  SuppliersParams,
  SupplyItem,
  SupplyItemsParams,
  SupplyLot,
  SupplyLotsParams,
  UpdateSupplierRequest,
} from "./model/types";

// Schemas (for validation)
export {
  CreateSupplierRequestSchema,
  StockInRequestSchema,
  StockInResponseSchema,
  SupplierSchema,
  SupplyItemSchema,
  SupplyLotSchema,
  UpdateSupplierRequestSchema,
} from "./model/schemas";

// Query Keys
export { suppliesKeys } from "./model/keys";

// API Client
export { suppliesApi } from "./api/client";

// React Query Hooks
export {
  useAllSuppliers,
  useAllSupplyItems,
  useCreateSupplier,
  useDeleteSupplier,
  useStockIn,
  useSuppliers,
  useSupplyItems,
  useSupplyLots,
  useUpdateSupplier,
} from "./api/hooks";
