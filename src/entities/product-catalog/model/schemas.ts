import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════
// CATALOG PRODUCT SCHEMA
// ═══════════════════════════════════════════════════════════════

export const CatalogProductStatusEnum = z.enum(['draft', 'published', 'hidden']);

export const CatalogProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  category: z.string(),
  description: z.string(),
  shortDescription: z.string(),
  price: z.number().positive(),
  unit: z.string(),
  stock: z.number().int().min(0),
  images: z.array(z.string()),
  sellerId: z.string(),
  farmId: z.string(),
  seasonId: z.string(),
  lotId: z.string(),
  region: z.string(),
  traceable: z.boolean(),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().min(0),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  status: CatalogProductStatusEnum,
});

// ═══════════════════════════════════════════════════════════════
// PRODUCT LIST PARAMS SCHEMA
// ═══════════════════════════════════════════════════════════════

export const ProductListParamsSchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  page: z.number().int().min(0).default(0),
  size: z.number().int().min(1).default(20),
  sort: z.enum(['price_asc', 'price_desc', 'rating', 'newest']).optional(),
  traceableOnly: z.boolean().optional(),
});

// ═══════════════════════════════════════════════════════════════
// CATALOG CATEGORY SCHEMA
// ═══════════════════════════════════════════════════════════════

export const CatalogCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  productCount: z.number().int().min(0),
});
