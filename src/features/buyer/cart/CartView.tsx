import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/entities/cart';
import { useProducts } from '@/entities/product-catalog';
import { Button, Card, CardContent } from '@/shared/ui';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

export function CartView() {
  const { items, updateQuantity, removeItem } = useCartStore();
  const { data: productData } = useProducts({ size: 100 });
  const products = productData?.items ?? [];
  const navigate = useNavigate();

  const cartItems = items.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product);

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + (item.product?.price ?? 0) * item.quantity;
  }, 0);

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={48} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Giỏ hàng trống</h2>
        <p className="text-gray-500 mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
        <Button onClick={() => navigate('/shop')}>Tiếp tục mua sắm</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Giỏ hàng của bạn</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4 flex items-center gap-4">
                <img
                  src={item.product?.images[0]}
                  alt={item.product?.name}
                  className="w-24 h-24 object-cover rounded-md bg-gray-100"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1">
                  <Link to={`/shop/products/${item.product?.slug}`} className="font-semibold text-gray-900 hover:text-emerald-600 line-clamp-1">
                    {item.product?.name}
                  </Link>
                  <div className="text-emerald-600 font-bold mt-1">
                    {formatCurrency(item.product?.price || 0)}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-200 rounded-md">
                    <button className="p-1 hover:bg-gray-50 text-gray-600" onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}>
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button className="p-1 hover:bg-gray-50 text-gray-600" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                      <Plus size={16} />
                    </button>
                  </div>

                  <button onClick={() => removeItem(item.productId)} className="text-red-500 hover:text-red-700 p-2">
                    <Trash2 size={20} />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="w-full lg:w-80 shrink-0">
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4">Tổng đơn hàng</h3>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tạm tính:</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Phí giao hàng:</span>
                  <span className="font-medium">Chưa tính</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Tổng cộng:</span>
                  <span className="text-xl font-bold text-emerald-600">{formatCurrency(subtotal)}</span>
                </div>
              </div>
              <Button className="w-full" size="lg" onClick={() => navigate('/buyer/checkout')}>
                Tiến hành thanh toán
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
