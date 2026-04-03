import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Truck, CreditCard } from 'lucide-react';
import { useBuyerOrderDetail } from '@/entities/order';
import type { OrderStatus } from '@/entities/order';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/shared/ui';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date));
}

function getStatusBadge(status: OrderStatus) {
  const map: Record<OrderStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    pending: { label: 'Chờ xác nhận', variant: 'outline' },
    confirmed: { label: 'Đã xác nhận', variant: 'secondary' },
    preparing: { label: 'Đang chuẩn bị', variant: 'secondary' },
    delivering: { label: 'Đang giao', variant: 'default' },
    completed: { label: 'Hoàn thành', variant: 'default' },
    cancelled: { label: 'Đã hủy', variant: 'destructive' },
  };
  const config = map[status] ?? { label: status, variant: 'outline' as const };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function OrderDetailView() {
  const { id } = useParams();
  const { data: order, isLoading } = useBuyerOrderDetail(id);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-8 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map(i => <Card key={i} className="animate-pulse"><CardContent className="p-6"><div className="h-20 bg-gray-100 rounded" /></CardContent></Card>)}
        </div>
      </div>
    );
  }

  if (!order) {
    return <div className="container mx-auto py-20 text-center text-gray-500">Đơn hàng không tồn tại.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link to="/buyer/orders" className="text-emerald-600 hover:underline flex items-center gap-1 text-sm font-medium">
          <ArrowLeft size={16} /> Quay lại danh sách
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chi tiết đơn hàng #{order.id.toUpperCase()}</h1>
          <p className="text-gray-500 mt-1">Đặt ngày {formatDate(order.createdAt)}</p>
        </div>
        <div>{getStatusBadge(order.status)}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-gray-500">
              <MapPin size={16} /> Địa chỉ nhận hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-1">{order.address}</p>
            <p className="text-sm text-gray-600 flex items-center gap-1"><Phone size={14} /> {order.phone}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-gray-500">
              <Truck size={16} /> Vận chuyển
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium text-gray-900 mb-1">Giao hàng tiêu chuẩn</p>
            <p className="text-sm text-gray-600">Dự kiến giao trong 2-3 ngày</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-gray-500">
              <CreditCard size={16} /> Thanh toán
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium text-gray-900 mb-1">{order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản'}</p>
            <p className="text-sm text-gray-600">{order.status === 'completed' ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Sản phẩm</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200">
            {order.items.map((item, index) => (
              <div key={index} className="p-6 flex items-center gap-4">
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="w-20 h-20 object-cover rounded-md bg-gray-100"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1">
                  <Link to={`/shop/products/${item.productSlug}`} className="font-medium text-gray-900 hover:text-emerald-600">
                    {item.productName}
                  </Link>
                  <div className="text-sm text-gray-500 mt-1">
                    {formatCurrency(item.price)} x {item.quantity}
                  </div>
                </div>
                <div className="font-bold text-gray-900">
                  {formatCurrency(item.quantity * item.price)}
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="w-full sm:w-1/2 ml-auto space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Tạm tính:</span>
                <span className="font-medium">{formatCurrency(order.total - order.shippingFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phí vận chuyển:</span>
                <span className="font-medium">{formatCurrency(order.shippingFee)}</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                <span className="font-bold text-gray-900">Tổng cộng:</span>
                <span className="text-xl font-bold text-emerald-600">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline">Liên hệ người bán</Button>
        {order.status === 'completed' && <Button>Đánh giá sản phẩm</Button>}
      </div>
    </div>
  );
}
