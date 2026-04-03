// Product Catalog Entity - Public API
// Public-facing product data for buyer catalog browsing

// Types
export type {
  CatalogProduct,
  CatalogCategory,
  ProductListParams,
  FarmInfo,
  LotInfo,
} from './model/types';

// Schemas
export {
  CatalogProductSchema,
  CatalogProductStatusEnum,
  ProductListParamsSchema,
  CatalogCategorySchema,
} from './model/schemas';

// Query Keys
export { productCatalogKeys } from './model/keys';

// API Client
export { productCatalogApi } from './api/client';

// Hooks
export {
  useProducts,
  useProductDetail,
  useCategories,
} from './api/hooks';
