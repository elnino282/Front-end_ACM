import { AppShell } from '@/features/shared/layout';
import { AI_FloatButton } from '@/features/shared/aiButton/AI_FloatButton';

import type { AdminView } from './types';
import { useAdminPortalShell } from './hooks/useAdminPortalShell';
import { AdminPortalContent } from './components/AdminPortalContent';

export function AdminPortalWithShell() {
  const {
    currentView,
    aiChatOpen,
    breadcrumbs,
    userName,
    userEmail,
    setCurrentView,
    setAiChatOpen,
    handleLogout,
  } = useAdminPortalShell('dashboard');

  return (
    <AppShell
      portalType="ADMIN"
      currentView={currentView}
      onViewChange={(view) => setCurrentView(view as AdminView)}
      breadcrumbs={breadcrumbs}
      userName={userName}
      userEmail={userEmail}
      aiDrawerExternalOpen={aiChatOpen}
      onAiDrawerChange={setAiChatOpen}
      onLogout={handleLogout}
    >
      <AdminPortalContent currentView={currentView} />

      {/* Global AI Assistant Float Button */}
      <AI_FloatButton onClick={() => setAiChatOpen(true)} />
    </AppShell>
  );
}
