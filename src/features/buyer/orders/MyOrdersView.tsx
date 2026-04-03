import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import { useBuyerOrders } from '@/entities/order';
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

export function MyOrdersView() {
  const { data: orderData, isLoading } = useBuyerOrders();
  const orders = orderData?.items ?? [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {[1, 2].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="bg-gray-50"><div className="h-4 bg-gray-200 rounded w-1/3" /></CardHeader>
            <CardContent className="p-4"><div className="h-16 bg-gray-100 rounded" /></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Đơn hàng của tôi</h1>

      <div className="space-y-6">
        {orders.map(order => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50 border-b border-gray-200 flex flex-row items-center justify-between py-4">
              <div>
                <CardTitle className="text-sm font-medium text-gray-500">
                  Mã đơn: <span className="text-gray-900 font-bold">#{order.id.toUpperCase()}</span>
                </CardTitle>
                <div className="text-xs text-gray-500 mt-1">
                  Đặt ngày: {formatDate(order.createdAt)}
                </div>
              </div>
              <div>{getStatusBadge(order.status)}</div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {order.items.map((item, index) => (
                  <div key={index} className="p-4 flex items-center gap-4">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded-md bg-gray-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.productName}</h4>
                      <div className="text-sm text-gray-500 mt-1">
                        Số lượng: {item.quantity} x {formatCurrency(item.price)}
                      </div>
                    </div>
                    <div className="font-medium text-gray-900">
                      {formatCurrency(item.quantity * item.price)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Tổng tiền ({order.items.length} sản phẩm): <span className="text-lg font-bold text-emerald-600 ml-2">{formatCurrency(order.total)}</span>
                </div>
                <Link to={`/buyer/orders/${order.id}`}>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    Xem chi tiết <ChevronRight size={16} />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
            <p className="text-gray-500 mb-6">Bạn chưa thực hiện giao dịch nào.</p>
            <Link to="/shop">
              <Button>Bắt đầu mua sắm</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
