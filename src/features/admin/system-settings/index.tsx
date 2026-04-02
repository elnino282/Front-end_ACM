import { useSystemSettings } from './hooks/useSystemSettings';
import { PageHeader } from './components/PageHeader';
import { Sidebar } from './components/Sidebar';
import { SystemPreferencesSection } from './components/SystemPreferencesSection';
import { RolesPermissionsSection } from './components/RolesPermissionsSection';
import { SecuritySettingsSection } from './components/SecuritySettingsSection';
import { NotificationSettingsSection } from './components/NotificationSettingsSection';
import { IntegrationSettingsSection } from './components/IntegrationSettingsSection';
import { BackupRestoreSection } from './components/BackupRestoreSection';
import { AuditLogSection } from './components/AuditLogSection';
import { AddRoleModal } from './components/AddRoleModal';
import { RestoreModal } from './components/RestoreModal';

export function SystemSettings() {
    const {
        activeSection,
        addRoleModalOpen,
        restoreModalOpen,
        showApiKey,
        systemPrefs,
        securitySettings,
        roles,
        permissions,
        devices,
        notificationSettings,
        integrations,
        backupPoints,
        auditLogs,
        setActiveSection,
        setAddRoleModalOpen,
        setRestoreModalOpen,
        handleSaveAll,
        handleResetToDefault,
        handleSaveSystemPrefs,
        handleApplyToAll,
        handleTestConnection,
        handleTestNotification,
        handleSignOutDevice,
        handleSignOutAll,
        handleManualBackup,
        handleExportConfig,
        handleImportConfig,
        handleCreateRole,
        handleConfirmRestore,
        toggleApiKeyVisibility,
        updateSystemPref,
        updateSecuritySetting,
        updatePermission,
        updateNotificationSetting,
        updateIntegration,
        getDeviceIcon,
        getStatusBadge,
    } = useSystemSettings();

    const renderContent = () => {
        switch (activeSection) {
            case 'system':
                return (
                    <SystemPreferencesSection
                        systemPrefs={systemPrefs}
                        onUpdate={updateSystemPref}
                        onSave={handleSaveSystemPrefs}
                        onApplyToAll={handleApplyToAll}
                    />
                );

            case 'roles':
                return (
                    <RolesPermissionsSection
                        roles={roles}
                        permissions={permissions}
                        onPermissionUpdate={updatePermission}
                        onAddRole={() => setAddRoleModalOpen(true)}
                    />
                );

            case 'security':
                return (
                    <SecuritySettingsSection
                        settings={securitySettings}
                        devices={devices}
                        onSettingUpdate={updateSecuritySetting}
                        onSignOutDevice={handleSignOutDevice}
                        onSignOutAll={handleSignOutAll}
                        getDeviceIcon={getDeviceIcon}
                    />
                );

            case 'notifications':
                return (
                    <NotificationSettingsSection
                        settings={notificationSettings}
                        onSettingUpdate={updateNotificationSetting}
                        onTestNotification={handleTestNotification}
                    />
                );

            case 'integrations':
                return (
                    <IntegrationSettingsSection
                        integrations={integrations}
                        showApiKey={showApiKey}
                        onApiKeyUpdate={updateIntegration}
                        onToggleApiKeyVisibility={toggleApiKeyVisibility}
                        onTestConnection={handleTestConnection}
                        getStatusBadge={getStatusBadge}
                    />
                );

            case 'backup':
                return (
                    <BackupRestoreSection
                        backupPoints={backupPoints}
                        onManualBackup={handleManualBackup}
                        onExportConfig={handleExportConfig}
                        onImportConfig={handleImportConfig}
                        onRestore={() => setRestoreModalOpen(true)}
                        getStatusBadge={getStatusBadge}
                    />
                );

            case 'audit':
                return <AuditLogSection logs={auditLogs} getStatusBadge={getStatusBadge} />;

            default:
                return null;
        }
    };

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">
            <PageHeader onSaveAll={handleSaveAll} onResetToDefault={handleResetToDefault} />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
                <div className="lg:col-span-3">{renderContent()}</div>
            </div>

            <AddRoleModal
                open={addRoleModalOpen}
                onOpenChange={setAddRoleModalOpen}
                onCreateRole={handleCreateRole}
            />

            <RestoreModal
                open={restoreModalOpen}
                onOpenChange={setRestoreModalOpen}
                onConfirmRestore={handleConfirmRestore}
            />
        </div>
    );
}
