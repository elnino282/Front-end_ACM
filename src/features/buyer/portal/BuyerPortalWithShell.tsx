import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { AppShell } from '@/widgets/layout';
import { useCartStore } from '@/entities/cart';
import type { LayoutMode } from './hooks/useBuyerLayoutMode';

interface BuyerPortalWithShellProps {
  onLayoutToggle?: () => void;
  layoutMode?: LayoutMode;
}

export function BuyerPortalWithShell({ onLayoutToggle }: BuyerPortalWithShellProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = useCartStore(state => state.getItemCount());

  // Derive current view from URL
  const pathParts = location.pathname.split('/');
  const currentView = pathParts[2] || 'dashboard';

  const handleViewChange = (view: string) => {
    if (view === 'shop') {
      navigate('/shop');
    } else {
      navigate(`/buyer/${view}`);
    }
  };

  return (
    <AppShell
      portalType="BUYER"
      currentView={currentView}
      onViewChange={handleViewChange}
      userName={user?.profile?.fullName || user?.username || 'Buyer'}
      userEmail={user?.email || user?.profile?.email || ''}
      onLogout={() => {
        logout();
        navigate('/sign-in');
      }}
    >
      <Outlet />
    </AppShell>
  );
}
