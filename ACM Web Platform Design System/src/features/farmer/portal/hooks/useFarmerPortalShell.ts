import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth';
import type { BreadcrumbPath } from '@/features/shared/layout/types';
import type { FarmerView } from '../types';
import { getFarmerBreadcrumbLabel } from '../constants';

interface UseFarmerPortalShellReturn {
  currentView: FarmerView;
  setCurrentView: (view: FarmerView) => void;
  aiChatOpen: boolean;
  setAiChatOpen: (open: boolean) => void;
  userName: string;
  userEmail: string;
  breadcrumbs: BreadcrumbPath[];
  handleLogout: () => void;
}

/**
 * Custom hook for farmer portal shell state and business logic
 */
export function useFarmerPortalShell(): UseFarmerPortalShellReturn {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentView, setCurrentView] = useState<FarmerView>('dashboard');
  const [aiChatOpen, setAiChatOpen] = useState(false);

  /**
   * Sync currentView from URL path on mount and location changes
   */
  useEffect(() => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    if (pathParts[0] === 'farmer' && pathParts[1]) {
      const viewFromPath = pathParts[1] as FarmerView;
      setCurrentView(viewFromPath);
    }
  }, [location.pathname]);

  // Get user info from auth context, with fallback defaults
  const userName = user?.email?.split('@')[0] || 'John Doe';
  const userEmail = user?.email || 'john.doe@farm.com';

  /**
   * Build breadcrumbs based on current view
   */
  const breadcrumbs: BreadcrumbPath[] = [
    { label: 'Home', href: 'dashboard' },
  ];

  if (currentView !== 'dashboard') {
    breadcrumbs.push({
      label: getFarmerBreadcrumbLabel(currentView),
    });
  }

  /**
   * Handle view change with URL navigation sync
   */
  const handleViewChange = (view: FarmerView): void => {
    setCurrentView(view);
    navigate(`/farmer/${view}`);
  };

  /**
   * Handle user logout with navigation and toast notification
   */
  const handleLogout = async (): Promise<void> => {
    await logout();
    toast.success('Signed out successfully');
    navigate('/sign-in', { replace: true });
  };

  return {
    currentView,
    setCurrentView: handleViewChange,
    aiChatOpen,
    setAiChatOpen,
    userName,
    userEmail,
    breadcrumbs,
    handleLogout,
  };
}



