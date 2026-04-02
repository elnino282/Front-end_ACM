import { AppShell } from "@/features/shared/layout";
import { EmployeePortalContent } from "./components/EmployeePortalContent";
import { useEmployeePortalShell } from "./hooks/useEmployeePortalShell";

export function EmployeePortalWithShell() {
  const {
    currentView,
    setCurrentView,
    aiChatOpen,
    setAiChatOpen,
    userName,
    userEmail,
    breadcrumbs,
    handleLogout,
  } = useEmployeePortalShell();

  return (
    <AppShell
      portalType="EMPLOYEE"
      currentView={currentView}
      onViewChange={setCurrentView}
      breadcrumbs={breadcrumbs}
      userName={userName}
      userEmail={userEmail}
      aiDrawerExternalOpen={aiChatOpen}
      onAiDrawerChange={setAiChatOpen}
      onLogout={handleLogout}
    >
      <EmployeePortalContent />
    </AppShell>
  );
}
