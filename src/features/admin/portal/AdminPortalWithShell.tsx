import { AI_FloatButton } from "@/features/shared/aiButton/AI_FloatButton";
import { AppShell } from "@/features/shared/layout";

import { AdminPortalContent } from "./components/AdminPortalContent";
import { useAdminPortalShell } from "./hooks/useAdminPortalShell";
import type { AdminView } from "./types";

export function AdminPortalWithShell() {
  const {
    currentView,
    aiChatOpen,
    breadcrumbs,
    userName,
    userEmail,
    handleViewChange,
    setAiChatOpen,
    handleLogout,
  } = useAdminPortalShell("dashboard");

  return (
    <AppShell
      portalType="ADMIN"
      currentView={currentView}
      onViewChange={(view) => handleViewChange(view as AdminView)}
      breadcrumbs={breadcrumbs}
      userName={userName}
      userEmail={userEmail}
      aiDrawerExternalOpen={aiChatOpen}
      onAiDrawerChange={setAiChatOpen}
      onLogout={handleLogout}
    >
      <AdminPortalContent currentView={currentView} />

      {/* Global AI Assistant Float Button */}
      <AI_FloatButton
        onClick={() => setAiChatOpen(true)}
        isHidden={aiChatOpen}
      />
    </AppShell>
  );
}
