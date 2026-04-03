import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ShoppingCart, Package, Search, LayoutGrid, PanelLeft } from 'lucide-react';
import { useCartStore } from '@/entities/cart';
import { useAuth } from '@/features/auth';
import { Button } from '@/shared/ui';
import type { LayoutMode } from './hooks/useBuyerLayoutMode';

interface BuyerPublicLayoutProps {
  onLayoutToggle?: () => void;
  layoutMode?: LayoutMode;
}

export function BuyerPublicLayout({ onLayoutToggle, layoutMode }: BuyerPublicLayoutProps) {
  const { user, isAuthenticated } = useAuth();
  const cartCount = useCartStore(state => state.getItemCount());
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/shop" className="flex items-center gap-2">
              <div className="bg-emerald-600 text-white p-1.5 rounded-md">
                <Package size={24} />
              </div>
              <span className="text-xl font-bold text-emerald-800 hidden sm:inline-block">FarmTrace</span>
            </Link>

            <div className="hidden md:flex items-center gap-4 text-sm font-medium text-gray-600">
              <Link to="/shop" className="hover:text-emerald-600">Sản phẩm</Link>
              {isAuthenticated && <Link to="/buyer/orders" className="hover:text-emerald-600">Đơn hàng</Link>}
            </div>
          </div>

          <div className="flex-1 max-w-md mx-4 hidden lg:block">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="search"
                placeholder="Tìm kiếm nông sản..."
                className="w-full bg-gray-100 rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Layout toggle */}
            {onLayoutToggle && (
              <Button variant="ghost" size="icon" onClick={onLayoutToggle} title="Chuyển bố cục">
                {layoutMode === 'public' ? <PanelLeft size={20} /> : <LayoutGrid size={20} />}
              </Button>
            )}

            {/* Cart */}
            <Link to="/shop/cart" className="relative p-2 text-gray-600 hover:text-emerald-600">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-sm font-medium text-gray-700">{user?.profile?.fullName || user?.username}</span>
                <Button variant="outline" size="sm" onClick={() => navigate('/buyer/dashboard')}>Dashboard</Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/sign-in')}>Đăng nhập</Button>
                <Button size="sm" onClick={() => navigate('/sign-up')} className="hidden sm:inline-flex">Đăng ký</Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link to="/shop" className="flex items-center gap-2 mb-4">
                <div className="bg-emerald-600 text-white p-1.5 rounded-md">
                  <Package size={24} />
                </div>
                <span className="text-xl font-bold text-white">FarmTrace</span>
              </Link>
              <p className="text-sm text-gray-400 mb-4">
                Nền tảng giao dịch nông sản minh bạch, kết nối trực tiếp từ nông trại đến bàn ăn.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Khám phá</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/shop" className="hover:text-emerald-400">Tất cả sản phẩm</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Hỗ trợ</h3>
              <ul className="space-y-2 text-sm">
                <li><span className="hover:text-emerald-400 cursor-pointer">Câu hỏi thường gặp</span></li>
                <li><span className="hover:text-emerald-400 cursor-pointer">Chính sách vận chuyển</span></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Liên hệ</h3>
              <ul className="space-y-2 text-sm">
                <li><span className="hover:text-emerald-400 cursor-pointer">Email: support@farmtrace.vn</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} FarmTrace. Đồ án sinh viên.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
