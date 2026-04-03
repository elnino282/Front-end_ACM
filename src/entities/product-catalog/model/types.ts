// Product Catalog Entity - Type definitions
// Public-facing product data for buyer catalog

export interface CatalogProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  shortDescription: string;
  price: number;
  unit: string;
  stock: number;
  images: string[];
  sellerId: string;
  farmId: string;
  seasonId: string;
  lotId: string;
  region: string;
  traceable: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt?: string;
  status: 'draft' | 'published' | 'hidden';
}

export interface CatalogCategory {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

export interface ProductListParams {
  category?: string;
  search?: string;
  page?: number;
  size?: number;
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
  traceableOnly?: boolean;
}

export interface FarmInfo {
  id: string;
  name: string;
  region: string;
  address: string;
}

export interface LotInfo {
  id: string;
  code: string;
  harvestDate: string;
  seasonName: string;
}
