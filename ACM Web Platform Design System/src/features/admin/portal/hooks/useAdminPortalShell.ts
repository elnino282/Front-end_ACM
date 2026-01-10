import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useAuth } from '@/features/auth';
import type { BreadcrumbPath } from '@/features/shared/layout/types';

import type { AdminView } from '../types';
import { getAdminBreadcrumbLabel } from '../constants';

export function useAdminPortalShell(initialView: AdminView = 'dashboard') {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [currentView, setCurrentView] = useState<AdminView>(initialView);
  const [aiChatOpen, setAiChatOpen] = useState(false);

  // Fallback defaults if user data is missing
  const userName = user?.email?.split('@')[0] || 'Admin User';
  const userEmail = user?.email || 'admin@acm-platform.com';

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/signin', { replace: true });
  };

  const breadcrumbs: BreadcrumbPath[] = useMemo(() => {
    const items: BreadcrumbPath[] = [{ label: 'Home', href: 'dashboard' }];
    const label = getAdminBreadcrumbLabel(currentView);

    if (label) {
      items.push({ label });
    }

    return items;
  }, [currentView]);

  return {
    // State
    currentView,
    aiChatOpen,

    // Derived Data
    breadcrumbs,
    userName,
    userEmail,

    // Handlers
    setCurrentView,
    setAiChatOpen,
    handleLogout,
  };
}
