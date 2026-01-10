import { useState } from 'react';
import { toast } from 'sonner';
import { Monitor, Smartphone, Laptop } from 'lucide-react';
import type {
    SettingsSection,
    Role,
    Permission,
    Device,
    NotificationSetting,
    SystemPreferences,
    SecuritySettings,
    Integration,
    BackupPoint,
    AuditLog,
} from '../types';
import {
    INITIAL_ROLES,
    INITIAL_PERMISSIONS,
    INITIAL_DEVICES,
    INITIAL_NOTIFICATION_SETTINGS,
    INITIAL_INTEGRATIONS,
    INITIAL_BACKUP_POINTS,
    INITIAL_AUDIT_LOGS,
} from '../constants';

export function useSystemSettings() {
    const [activeSection, setActiveSection] = useState<SettingsSection>('system');
    const [addRoleModalOpen, setAddRoleModalOpen] = useState(false);
    const [restoreModalOpen, setRestoreModalOpen] = useState(false);
    const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});

    // System Preferences State
    const [systemPrefs, setSystemPrefs] = useState<SystemPreferences>({
        language: 'en',
        timeZone: 'UTC+7',
        unitSystem: 'metric',
        dateFormat: 'dd/MM/yyyy',
        currency: 'VND',
        theme: 'light',
    });

    // Security State
    const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
        enable2FA: true,
        sessionTimeout: true,
        passwordPolicy: true,
    });

    // Data States
    const [roles] = useState<Role[]>(INITIAL_ROLES);
    const [permissions, setPermissions] = useState<Record<string, Permission>>(INITIAL_PERMISSIONS);
    const [devices] = useState<Device[]>(INITIAL_DEVICES);
    const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>(
        INITIAL_NOTIFICATION_SETTINGS
    );
    const [integrations, setIntegrations] = useState<Record<string, Integration>>(INITIAL_INTEGRATIONS);
    const [backupPoints] = useState<BackupPoint[]>(INITIAL_BACKUP_POINTS);
    const [auditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

    // Handlers
    const handleSaveAll = (): void => {
        toast.success('Settings saved', {
            description: 'All settings have been saved successfully.',
        });
    };

    const handleResetToDefault = (): void => {
        toast.success('Settings reset', {
            description: 'All settings have been reset to default values.',
        });
    };

    const handleSaveSystemPrefs = (): void => {
        toast.success('System preferences saved', {
            description: 'Your changes have been applied.',
        });
    };

    const handleApplyToAll = (): void => {
        toast.success('Applied to all users', {
            description: 'System preferences have been applied to all users.',
        });
    };

    const handleTestConnection = (service: string): void => {
        toast.success(`Testing ${service} connection`, {
            description: 'Connection test initiated.',
        });
    };

    const handleTestNotification = (topic: string): void => {
        toast.success('Test notification sent', {
            description: `Test notification for "${topic}" has been sent.`,
        });
    };

    const handleSignOutDevice = (_deviceId: string): void => {
        toast.success('Device signed out', {
            description: 'The selected device has been signed out.',
        });
    };

    const handleSignOutAll = (): void => {
        toast.success('All devices signed out', {
            description: 'All devices except current have been signed out.',
        });
    };

    const handleManualBackup = (): void => {
        toast.success('Backup started', {
            description: 'Manual backup has been initiated.',
        });
    };

    const handleExportConfig = (): void => {
        toast.success('Configuration exported', {
            description: 'System configuration file has been downloaded.',
        });
    };

    const handleImportConfig = (): void => {
        toast.success('Configuration imported', {
            description: 'System configuration has been imported successfully.',
        });
    };

    const handleCreateRole = (): void => {
        toast.success('Role created');
        setAddRoleModalOpen(false);
    };

    const handleConfirmRestore = (): void => {
        toast.success('Restore initiated');
        setRestoreModalOpen(false);
    };

    const toggleApiKeyVisibility = (service: string): void => {
        setShowApiKey({ ...showApiKey, [service]: !showApiKey[service] });
    };

    const updateSystemPref = (key: keyof SystemPreferences, value: string): void => {
        setSystemPrefs({ ...systemPrefs, [key]: value });
    };

    const updateSecuritySetting = (key: keyof SecuritySettings, value: boolean): void => {
        setSecuritySettings({ ...securitySettings, [key]: value });
    };

    const updatePermission = (key: string, field: keyof Permission, value: boolean): void => {
        const perm = permissions[key];
        if (perm && field !== 'module') {
            setPermissions({
                ...permissions,
                [key]: { ...perm, [field]: value },
            });
        }
    };

    const updateNotificationSetting = (id: string, field: keyof NotificationSetting, value: boolean): void => {
        setNotificationSettings(
            notificationSettings.map((s) =>
                s.id === id && field !== 'id' && field !== 'topic' ? { ...s, [field]: value } : s
            )
        );
    };

    const updateIntegration = (service: string, apiKey: string): void => {
        setIntegrations({
            ...integrations,
            [service]: { ...integrations[service], apiKey },
        });
    };

    const getDeviceIcon = (type: Device['type']) => {
        switch (type) {
            case 'desktop':
                return Monitor;
            case 'mobile':
                return Smartphone;
            case 'tablet':
                return Laptop;
        }
    };

    const getStatusBadge = (status: string): string => {
        const colors: Record<string, string> = {
            connected: 'bg-emerald-100 text-emerald-700',
            disconnected: 'bg-gray-100 text-gray-700',
            error: 'bg-red-100 text-red-700',
            success: 'bg-emerald-100 text-emerald-700',
            failed: 'bg-red-100 text-red-700',
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    return {
        // State
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

        // Setters
        setActiveSection,
        setAddRoleModalOpen,
        setRestoreModalOpen,

        // Handlers
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

        // Utilities
        getDeviceIcon,
        getStatusBadge,
    };
}
