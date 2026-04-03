import { z } from 'zod';

export const OrderStatusEnum = z.enum([
  'pending', 'confirmed', 'preparing', 'delivering', 'completed', 'cancelled'
]);

export const OrderItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  productImage: z.string(),
  productSlug: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
});

export const BuyerOrderSchema = z.object({
  id: z.string(),
  buyerId: z.string(),
  sellerId: z.string(),
  items: z.array(OrderItemSchema),
  total: z.number(),
  shippingFee: z.number(),
  status: OrderStatusEnum,
  address: z.string(),
  phone: z.string(),
  paymentMethod: z.enum(['COD', 'Bank Transfer']),
  note: z.string().optional(),
  createdAt: z.string(),
});

export const CreateOrderRequestSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
  })),
  address: z.string().min(1),
  phone: z.string().min(1),
  fullName: z.string().min(1),
  paymentMethod: z.enum(['COD', 'Bank Transfer']),
  note: z.string().optional(),
});
