import type { BuyerOrder } from '../model/types';

// 🔶 Mock orders — remove when backend API is ready
export const mockOrders: BuyerOrder[] = [
  {
    id: 'o1',
    buyerId: 'u1',
    sellerId: 'u2',
    items: [
      { productId: 'p1', productName: 'Cà chua Cherry VietGAP', productImage: 'https://picsum.photos/seed/tomato/800/800', productSlug: 'ca-chua-cherry-vietgap', quantity: 2, price: 45000 },
      { productId: 'p3', productName: 'Xà lách thủy canh', productImage: 'https://picsum.photos/seed/lettuce/800/800', productSlug: 'xa-lach-thuy-canh', quantity: 1, price: 35000 },
    ],
    total: 155000,
    shippingFee: 30000,
    status: 'delivering',
    address: '123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM',
    phone: '0901234567',
    paymentMethod: 'COD',
    createdAt: '2024-06-01T14:30:00Z',
  },
  {
    id: 'o2',
    buyerId: 'u1',
    sellerId: 'u2',
    items: [
      { productId: 'p2', productName: 'Sầu riêng Ri6', productImage: 'https://picsum.photos/seed/durian/800/800', productSlug: 'sau-rieng-ri6', quantity: 3, price: 120000 },
    ],
    total: 410000,
    shippingFee: 50000,
    status: 'completed',
    address: '123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM',
    phone: '0901234567',
    paymentMethod: 'Bank Transfer',
    createdAt: '2024-05-28T09:15:00Z',
  },
  {
    id: 'o3',
    buyerId: 'u1',
    sellerId: 'u2',
    items: [
      { productId: 'p5', productName: 'Nấm đùi gà organic', productImage: 'https://picsum.photos/seed/mushroom/800/800', productSlug: 'nam-dui-ga-organic', quantity: 1, price: 75000 },
      { productId: 'p4', productName: 'Bưởi da xanh Bến Tre', productImage: 'https://picsum.photos/seed/pomelo/800/800', productSlug: 'buoi-da-xanh-ben-tre', quantity: 2, price: 55000 },
    ],
    total: 215000,
    shippingFee: 30000,
    status: 'pending',
    address: '456 Nguyễn Văn Linh, Phường Tân Phong, Quận 7, TP.HCM',
    phone: '0901234567',
    paymentMethod: 'COD',
    createdAt: '2024-06-10T16:00:00Z',
  },
];
