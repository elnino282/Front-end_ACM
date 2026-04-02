export type SettingsSection =
    | 'system'
    | 'roles'
    | 'security'
    | 'notifications'
    | 'integrations'
    | 'backup'
    | 'audit';

export interface Role {
    id: string;
    name: string;
    description: string;
    userCount: number;
}

export interface Permission {
    module: string;
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
}

export interface Device {
    id: string;
    type: 'desktop' | 'mobile' | 'tablet';
    browser: string;
    location: string;
    lastActive: string;
    current: boolean;
}

export interface NotificationSetting {
    id: string;
    topic: string;
    email: boolean;
    inApp: boolean;
    sms: boolean;
}

export type IntegrationStatus = 'connected' | 'disconnected' | 'error';

export interface Integration {
    enabled: boolean;
    apiKey: string;
    status: IntegrationStatus;
}

export interface BackupPoint {
    id: string;
    date: string;
    size: string;
    type: 'auto' | 'manual';
    status: 'success' | 'failed';
}

export interface AuditLog {
    id: string;
    time: string;
    admin: string;
    action: string;
    module: string;
    result: 'success' | 'failed';
}

export interface SystemPreferences {
    language: string;
    timeZone: string;
    unitSystem: string;
    dateFormat: string;
    currency: string;
    theme: string;
}

export interface SecuritySettings {
    enable2FA: boolean;
    sessionTimeout: boolean;
    passwordPolicy: boolean;
}

export interface SectionNavItem {
    id: SettingsSection;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}
