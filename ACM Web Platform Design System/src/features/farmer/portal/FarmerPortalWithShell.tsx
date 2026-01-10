import { AI_FloatButton } from '@/features/shared/aiButton/AI_FloatButton';
import { AppShell } from '@/features/shared/layout';
import { FarmerPortalContent } from './components/FarmerPortalContent';
import { useFarmerPortalShell } from './hooks/useFarmerPortalShell';
import type { FarmerView } from './types';

/**
 * Main farmer portal container with application shell
 * 
 * Integrates:
 * - AppShell layout with navigation
 * - View-based content rendering
 * - AI assistant float button
 * - Authentication and user management
 */
export function FarmerPortalWithShell() {
  const {
    currentView,
    setCurrentView,
    aiChatOpen,
    setAiChatOpen,
    userName,
    userEmail,
    breadcrumbs,
    handleLogout,
  } = useFarmerPortalShell();

  return (
    <AppShell
      portalType="FARMER"
      currentView={currentView}
      onViewChange={(view) => setCurrentView(view as FarmerView)}
      breadcrumbs={breadcrumbs}
      userName={userName}
      userEmail={userEmail}
      aiDrawerExternalOpen={aiChatOpen}
      onAiDrawerChange={setAiChatOpen}
      onLogout={handleLogout}
    >
      <FarmerPortalContent />

      {/* Global AI Assistant Float Button */}
      <AI_FloatButton onClick={() => setAiChatOpen(true)} />
    </AppShell>
  );
}



