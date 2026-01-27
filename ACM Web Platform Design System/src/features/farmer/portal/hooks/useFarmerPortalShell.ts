import { useProfileMe } from '@/entities/user';
import { useAuth } from '@/features/auth';
import type { BreadcrumbPath } from '@/features/shared/layout/types';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getFarmerBreadcrumbLabel } from '../constants';
import type { FarmerView } from '../types';

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
  const { data: profile } = useProfileMe();
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

  // Get user info - prioritize React Query profile data for instant updates after mutations
  // Then fallback to session data, then extract from email, then default
  const profileFullName = profile?.fullName?.trim();
  const sessionFullName = user?.profile?.fullName?.trim();
  const emailUsername = user?.email?.split('@')[0];
  const userName = profileFullName || sessionFullName || emailUsername || 'Farmer';
  const userEmail = profile?.email || user?.email || 'farmer@acm-platform.com';

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
   * Also clears activeSeasonId to force season selection on next login
   */
  const handleLogout = async (): Promise<void> => {
    // Clear active season to enforce selection on next login
    localStorage.removeItem('activeSeasonId');
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



