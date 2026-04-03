// Buyer Order Entity - Type definitions

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'completed' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  productSlug: string;
  quantity: number;
  price: number;
}

export interface BuyerOrder {
  id: string;
  buyerId: string;
  sellerId: string;
  items: OrderItem[];
  total: number;
  shippingFee: number;
  status: OrderStatus;
  address: string;
  phone: string;
  paymentMethod: 'COD' | 'Bank Transfer';
  note?: string;
  createdAt: string;
}

export interface CreateOrderRequest {
  items: Array<{ productId: string; quantity: number }>;
  address: string;
  phone: string;
  fullName: string;
  paymentMethod: 'COD' | 'Bank Transfer';
  note?: string;
}

export interface OrderListParams {
  status?: OrderStatus;
  page?: number;
  size?: number;
}
