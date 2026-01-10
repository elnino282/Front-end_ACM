import { Globe, Shield, Bell, Plug, Database, FileText, Lock } from 'lucide-react';
import type {
    Role,
    Permission,
    Device,
    NotificationSetting,
    BackupPoint,
    AuditLog,
    SectionNavItem,
    Integration,
} from './types';

export const INITIAL_ROLES: Role[] = [
    { id: '1', name: 'Admin', description: 'Full system access', userCount: 5 },
    { id: '2', name: 'Farmer', description: 'Farm management access', userCount: 342 },
    { id: '3', name: 'Buyer', description: 'Marketplace access', userCount: 156 },
    { id: '4', name: 'Viewer', description: 'Read-only access', userCount: 23 },
];

export const INITIAL_PERMISSIONS: Record<string, Permission> = {
    plots: { module: 'Plot Management', view: true, create: true, edit: true, delete: true },
    seasons: { module: 'Season Management', view: true, create: true, edit: true, delete: false },
    tasks: { module: 'Task Workspace', view: true, create: true, edit: true, delete: true },
    expenses: { module: 'Expense Management', view: true, create: true, edit: false, delete: false },
    harvest: { module: 'Harvest Management', view: true, create: true, edit: true, delete: false },
    sales: { module: 'Sale Management', view: true, create: false, edit: false, delete: false },
    documents: { module: 'Document Management', view: true, create: true, edit: true, delete: true },
    reports: { module: 'Reports & Analytics', view: true, create: false, edit: false, delete: false },
};

export const INITIAL_DEVICES: Device[] = [
    {
        id: '1',
        type: 'desktop',
        browser: 'Chrome on Windows',
        location: 'Ho Chi Minh City, Vietnam',
        lastActive: '2025-11-11 15:30 (Active now)',
        current: true,
    },
    {
        id: '2',
        type: 'mobile',
        browser: 'Safari on iPhone',
        location: 'Hanoi, Vietnam',
        lastActive: '2025-11-11 10:20',
        current: false,
    },
    {
        id: '3',
        type: 'tablet',
        browser: 'Chrome on iPad',
        location: 'Da Nang, Vietnam',
        lastActive: '2025-11-10 18:45',
        current: false,
    },
];

export const INITIAL_NOTIFICATION_SETTINGS: NotificationSetting[] = [
    { id: '1', topic: 'System Updates', email: true, inApp: true, sms: false },
    { id: '2', topic: 'Security Alerts', email: true, inApp: true, sms: true },
    { id: '3', topic: 'New User Registration', email: true, inApp: true, sms: false },
    { id: '4', topic: 'Document Upload', email: false, inApp: true, sms: false },
    { id: '5', topic: 'Weekly Reports', email: true, inApp: false, sms: false },
    { id: '6', topic: 'Backup Completion', email: true, inApp: true, sms: false },
    { id: '7', topic: 'Critical Errors', email: true, inApp: true, sms: true },
];

export const INITIAL_INTEGRATIONS: Record<string, Integration> = {
    weather: {
        enabled: true,
        apiKey: 'wapi_1234567890abcdef',
        status: 'connected',
    },
    market: {
        enabled: true,
        apiKey: 'mapi_0987654321fedcba',
        status: 'connected',
    },
    payment: {
        enabled: false,
        apiKey: '',
        status: 'disconnected',
    },
    iot: {
        enabled: true,
        apiKey: 'iot_abc123xyz789',
        status: 'connected',
    },
    ai: {
        enabled: true,
        apiKey: 'ai_assistant_key_xyz',
        status: 'connected',
    },
};

export const INITIAL_BACKUP_POINTS: BackupPoint[] = [
    { id: '1', date: '2025-11-11 02:00', size: '4.2 GB', type: 'auto', status: 'success' },
    { id: '2', date: '2025-11-10 02:00', size: '4.1 GB', type: 'auto', status: 'success' },
    { id: '3', date: '2025-11-09 15:30', size: '3.9 GB', type: 'manual', status: 'success' },
    { id: '4', date: '2025-11-09 02:00', size: '4.0 GB', type: 'auto', status: 'success' },
    { id: '5', date: '2025-11-08 02:00', size: '3.8 GB', type: 'auto', status: 'failed' },
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
    {
        id: '1',
        time: '2025-11-11 15:30',
        admin: 'admin@acm.com',
        action: 'Updated security settings',
        module: 'Security',
        result: 'success',
    },
    {
        id: '2',
        time: '2025-11-11 14:20',
        admin: 'admin@acm.com',
        action: 'Created new role: Auditor',
        module: 'Role & Permission',
        result: 'success',
    },
    {
        id: '3',
        time: '2025-11-11 10:15',
        admin: 'admin@acm.com',
        action: 'Manual backup initiated',
        module: 'Backup & Restore',
        result: 'success',
    },
    {
        id: '4',
        time: '2025-11-10 16:45',
        admin: 'admin@acm.com',
        action: 'Updated integration settings',
        module: 'Integrations',
        result: 'success',
    },
    {
        id: '5',
        time: '2025-11-10 09:30',
        admin: 'admin@acm.com',
        action: 'Reset notification settings',
        module: 'Notifications',
        result: 'failed',
    },
];

export const SECTION_NAV: SectionNavItem[] = [
    { id: 'system', label: 'System Preferences', icon: Globe },
    { id: 'roles', label: 'Role & Permission', icon: Shield },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'integrations', label: 'Integrations', icon: Plug },
    { id: 'backup', label: 'Backup & Restore', icon: Database },
    { id: 'audit', label: 'Audit Log', icon: FileText },
];
