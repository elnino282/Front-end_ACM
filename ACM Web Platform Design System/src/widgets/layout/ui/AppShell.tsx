import { useAppShell } from '../hooks/useAppShell';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { NotificationsDrawer } from './NotificationsDrawer';
import { AiDrawer } from './AiDrawer';
import type { AppShellProps } from '../model/types';

/**
 * AppShell Component
 * 
 * Main application shell providing consistent layout across all portals.
 * Refactored into modular architecture following Clean Code principles.
 * 
 * Responsibilities:
 * - Wire logic from custom hook
 * - Compose sub-components
 * - Manage layout structure
 * 
 * Architecture:
 * - Single Responsibility: Container only
 * - Separation of Concerns: Logic in hook, UI in sub-components
 * - Colocation: All related code in widget directory
 */
export function AppShell({
    portalType,
    currentView,
    onViewChange,
    children,
    breadcrumbs = [],
    userName = 'John Doe',
    userEmail = 'john.doe@farm.com',
    userAvatar,
    onAiDrawerChange,
    aiDrawerExternalOpen,
    onLogout,
}: AppShellProps) {
    // Extract all state and logic from custom hook
    const {
        sidebarCollapsed,
        searchQuery,
        aiDrawerOpen,
        notificationsOpen,
        theme,
        language,
        notifications,
        config,
        unreadCount,
        setSearchQuery,
        handleToggleSidebar,
        handleAiDrawerChange,
        handleAiDrawerOpen,
        setNotificationsOpen,
        handleNotificationsOpen,
        markNotificationAsRead,
        markAllAsRead,
        setTheme,
        setLanguage,
    } = useAppShell({
        portalType,
        currentView,
        onViewChange,
        children,
        breadcrumbs,
        userName,
        userEmail,
        userAvatar,
        onAiDrawerChange,
        aiDrawerExternalOpen,
    });

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-muted/30">
            {/* Top Navigation Bar */}
            <Header
                config={config}
                breadcrumbs={breadcrumbs}
                sidebarCollapsed={sidebarCollapsed}
                searchQuery={searchQuery}
                unreadCount={unreadCount}
                userName={userName}
                userEmail={userEmail}
                userAvatar={userAvatar}
                portalType={portalType}
                theme={theme}
                language={language}
                onToggleSidebar={handleToggleSidebar}
                onViewChange={onViewChange}
                onSearchChange={setSearchQuery}
                onAiDrawerOpen={handleAiDrawerOpen}
                onNotificationsOpen={handleNotificationsOpen}
                onThemeChange={setTheme}
                onLanguageChange={setLanguage}
                onLogout={onLogout}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Side Navigation */}
                <Sidebar
                    navigationItems={config.navigation}
                    currentView={currentView}
                    collapsed={sidebarCollapsed}
                    portalColor={config.color}
                    onNavigate={onViewChange}
                    onToggleCollapse={handleToggleSidebar}
                />

                {/* Page Content */}
                <main className="flex-1 overflow-auto">{children}</main>
            </div>

            {/* AI Assistant Drawer */}
            <AiDrawer
                open={aiDrawerOpen}
                onOpenChange={handleAiDrawerChange}
                portalColor={config.color}
            />

            {/* Notifications Drawer */}
            <NotificationsDrawer
                open={notificationsOpen}
                onOpenChange={setNotificationsOpen}
                notifications={notifications}
                unreadCount={unreadCount}
                onMarkAsRead={markNotificationAsRead}
                onMarkAllAsRead={markAllAsRead}
            />
        </div>
    );
}
