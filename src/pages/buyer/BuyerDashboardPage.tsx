import { Link } from 'react-router-dom';
import { ShoppingBag, Package, TrendingUp, Clock } from 'lucide-react';
import { useBuyerOrders } from '@/entities/order';
import { useCartStore } from '@/entities/cart';
import { useAuth } from '@/features/auth';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/shared/ui';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
}

/**
 * Buyer Dashboard Page
 * Overview: recent orders, quick stats, quick actions
 */
export function BuyerDashboardPage() {
  const { user } = useAuth();
  const { data: orderData } = useBuyerOrders();
  const cartItemCount = useCartStore(state => state.getItemCount());
  const orders = orderData?.items ?? [];

  const totalSpent = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Xin chào, {user?.profile?.fullName || user?.username || 'Buyer'} 👋
        </h1>
        <p className="text-gray-500 mt-1">Tổng quan tài khoản mua sắm của bạn</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 rounded-full">
              <ShoppingBag className="text-emerald-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng đơn hàng</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Clock className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Đang xử lý</p>
              <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-full">
              <TrendingUp className="text-amber-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tổng chi tiêu</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(totalSpent)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <Package className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Giỏ hàng</p>
              <p className="text-2xl font-bold text-gray-900">{cartItemCount} sản phẩm</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Hành động nhanh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/shop">
              <Button variant="outline" className="w-full justify-start gap-2">
                <ShoppingBag size={18} /> Tiếp tục mua sắm
              </Button>
            </Link>
            <Link to="/buyer/orders">
              <Button variant="outline" className="w-full justify-start gap-2 mt-2">
                <Package size={18} /> Xem đơn hàng
              </Button>
            </Link>
            {cartItemCount > 0 && (
              <Link to="/shop/cart">
                <Button className="w-full justify-start gap-2 mt-2">
                  <ShoppingBag size={18} /> Xem giỏ hàng ({cartItemCount})
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Đơn hàng gần đây</CardTitle>
            <Link to="/buyer/orders">
              <Button variant="ghost" size="sm" className="text-emerald-600">Xem tất cả</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Chưa có đơn hàng nào</p>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 3).map(order => (
                  <Link key={order.id} to={`/buyer/orders/${order.id}`} className="block">
                    <div className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-gray-900">#{order.id.toUpperCase()}</p>
                        <p className="text-xs text-gray-500">{order.items.length} sản phẩm</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-emerald-600">{formatCurrency(order.total)}</p>
                        <p className="text-xs text-gray-500 capitalize">{order.status}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
