import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/entities/cart';
import { useProducts } from '@/entities/product-catalog';
import { useCreateOrder } from '@/entities/order';
import { useAuth } from '@/features/auth';
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from '@/shared/ui';
import { toast } from 'sonner';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

export function CheckoutView() {
  const { items, clearCart } = useCartStore();
  const { data: productData } = useProducts({ size: 100 });
  const products = productData?.items ?? [];
  const { user } = useAuth();
  const navigate = useNavigate();
  const createOrder = useCreateOrder();
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Bank Transfer'>('COD');

  const [formData, setFormData] = useState({
    fullName: user?.profile?.fullName || '',
    phone: user?.profile?.phone || '',
    address: '',
    note: '',
  });

  useEffect(() => {
    if (items.length === 0) {
      navigate('/shop/cart');
    }
  }, [items.length, navigate]);

  const shippingFee = 30000;
  const subtotal = items.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);
  const total = subtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOrder.mutateAsync({
        items: items.map(item => ({ productId: item.productId, quantity: item.quantity })),
        address: formData.address,
        phone: formData.phone,
        fullName: formData.fullName,
        paymentMethod,
        note: formData.note || undefined,
      });
      clearCart();
      toast.success('Đặt hàng thành công!');
      navigate('/buyer/orders');
    } catch {
      toast.error('Có lỗi xảy ra khi đặt hàng');
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Thanh toán</h1>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin giao hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                  <Input
                    required
                    placeholder="Nguyễn Văn A"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <Input
                    required
                    placeholder="0901234567"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ giao hàng</label>
                <Input
                  required
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú (tùy chọn)</label>
                <Input
                  placeholder="Ghi chú thêm cho người giao hàng..."
                  value={formData.note}
                  onChange={e => setFormData({ ...formData, note: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Phương thức thanh toán</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input type="radio" name="payment" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="text-emerald-600 focus:ring-emerald-500" />
                <div className="ml-3">
                  <span className="block text-sm font-medium text-gray-900">Thanh toán khi nhận hàng (COD)</span>
                  <span className="block text-sm text-gray-500">Thanh toán bằng tiền mặt khi nhận hàng</span>
                </div>
              </label>

              <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'Bank Transfer' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input type="radio" name="payment" checked={paymentMethod === 'Bank Transfer'} onChange={() => setPaymentMethod('Bank Transfer')} className="text-emerald-600 focus:ring-emerald-500" />
                <div className="ml-3">
                  <span className="block text-sm font-medium text-gray-900">Chuyển khoản ngân hàng</span>
                  <span className="block text-sm text-gray-500">Chuyển khoản trực tiếp vào tài khoản</span>
                </div>
              </label>
            </CardContent>
          </Card>
        </div>

        <div className="w-full lg:w-96 shrink-0">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Đơn hàng của bạn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {items.map(item => {
                  const product = products.find(p => p.id === item.productId);
                  if (!product) return null;
                  return (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div className="flex-1 pr-4">
                        <span className="font-medium text-gray-900">{product.name}</span>
                        <span className="text-gray-500 ml-2">x{item.quantity}</span>
                      </div>
                      <span className="font-medium">{formatCurrency(product.price * item.quantity)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3 text-sm mb-6 border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tạm tính:</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Phí giao hàng:</span>
                  <span className="font-medium">{formatCurrency(shippingFee)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Tổng cộng:</span>
                  <span className="text-xl font-bold text-emerald-600">{formatCurrency(total)}</span>
                </div>
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={createOrder.isPending}>
                {createOrder.isPending ? 'Đang xử lý...' : 'Đặt hàng'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
