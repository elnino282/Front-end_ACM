import {
    useFarmerNotifications,
    useMarkNotificationRead,
    type Notification as FarmerNotification,
} from '@/entities/notification';
import { useTheme } from '@/hooks/useTheme';
import { changeLanguage, getCurrentLocale, getLanguageCode } from '@/i18n';
import { adminAlertApi, type AdminAlert } from '@/services/api.admin';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { portalConfig } from '../lib/config';
import type { AppShellProps, Language, Notification, PortalConfig } from '../model/types';

const LANGUAGE_STORAGE_KEY = 'acm_language';

const getStoredLanguage = (): Language => {
    if (typeof window === 'undefined') {
        return 'en';
    }

    const locale = getCurrentLocale();
    return getLanguageCode(locale) as Language;
};

/**
 * useAppShell Hook
 * 
 * Manages all state and business logic for the AppShell component.
 * Separates concerns by extracting logic from the UI layer.
 * 
 * @param props - AppShell component props
 * @returns State values, computed values, and handler functions
 */
export function useAppShell(props: AppShellProps) {
    const {
        portalType,
        onAiDrawerChange,
        aiDrawerExternalOpen,
    } = props;

    // UI State
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        // Initialize from localStorage with portal-specific key
        const storageKey = `${portalType.toLowerCase()}_sidebar_collapsed`;
        const stored = localStorage.getItem(storageKey);
        return stored ? JSON.parse(stored) : false;
    });
    const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    // User Preferences
    const { theme, setTheme } = useTheme();
    const [language, setLanguage] = useState<Language>(() => getStoredLanguage());
    const queryClient = useQueryClient();

    const farmerNotificationsQuery = useFarmerNotifications({
        enabled: portalType === 'FARMER',
    });
    const markNotificationReadMutation = useMarkNotificationRead();

    const adminAlertsQuery = useQuery({
        queryKey: ['adminAlerts', 'notifications'],
        queryFn: () => adminAlertApi.list({ windowDays: 30, page: 0, limit: 20 }),
        enabled: portalType === 'ADMIN',
        staleTime: 60 * 1000,
    });

    const adminAlertReadMutation = useMutation({
        mutationFn: (id: number) => adminAlertApi.updateStatus(id, 'DISMISSED'),
        onSuccess: (updatedAlert) => {
            queryClient.setQueryData(['adminAlerts', 'notifications'], (oldData: any) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    items: oldData.items?.map((item: AdminAlert) =>
                        item.id === updatedAlert.id ? updatedAlert : item
                    ),
                };
            });
        },
    });

    const formatNotificationTime = (value: string | null | undefined) => {
        if (!value) return 'Just now';
        try {
            return new Date(value).toLocaleString();
        } catch {
            return value;
        }
    };

    const resolveAdminNotificationType = (type?: string | null): Notification['type'] => {
        switch (type) {
            case 'INVENTORY_EXPIRED':
            case 'INVENTORY_EXPIRING':
                return 'inventory';
            case 'INCIDENT_OPEN':
                return 'incident';
            case 'TASK_OVERDUE':
                return 'task';
            case 'BUDGET_OVERSPEND':
                return 'warning';
            default:
                return 'warning';
        }
    };

    const farmerNotifications = useMemo<Notification[]>(() => {
        return (farmerNotificationsQuery.data ?? []).map((item: FarmerNotification) => ({
            id: item.id,
            type: 'warning',
            title: item.title || 'Notification',
            message: item.message || 'No message provided.',
            time: formatNotificationTime(item.createdAt),
            read: Boolean(item.readAt),
        }));
    }, [farmerNotificationsQuery.data]);

    const adminNotifications = useMemo<Notification[]>(() => {
        return (adminAlertsQuery.data?.items ?? []).map((alert: AdminAlert) => ({
            id: alert.id,
            type: resolveAdminNotificationType(alert.type),
            title: alert.title || 'System alert',
            message: alert.message || 'No details available.',
            time: formatNotificationTime(alert.createdAt),
            read: alert.status ? alert.status !== 'NEW' : true,
        }));
    }, [adminAlertsQuery.data]);

    const notifications =
        portalType === 'FARMER'
            ? farmerNotifications
            : portalType === 'ADMIN'
                ? adminNotifications
                : [];

    // Computed Values
    const config: PortalConfig = portalConfig[portalType];
    const unreadCount = notifications.filter((n) => !n.read).length;

    /**
     * Effect: Persist Sidebar State
     * Saves sidebar collapsed state to localStorage whenever it changes
     */
    useEffect(() => {
        const storageKey = `${portalType.toLowerCase()}_sidebar_collapsed`;
        localStorage.setItem(storageKey, JSON.stringify(sidebarCollapsed));
    }, [sidebarCollapsed, portalType]);

    // Language sync is now handled by i18n module, this effect just updates document.lang
    useEffect(() => {
        if (typeof document === 'undefined') {
            return;
        }
        document.documentElement.lang = language;
    }, [language]);

    // Handler to change language with i18n integration
    const handleLanguageChange = useCallback(async (newLanguage: Language) => {
        const locale = newLanguage === 'vi' ? 'vi-VN' : 'en-US';
        await changeLanguage(locale);
        setLanguage(newLanguage);
    }, []);


    /**
     * Effect: Sync External AI Drawer State
     * Syncs AI drawer open state when controlled externally
     */
    useEffect(() => {
        if (aiDrawerExternalOpen !== undefined) {
            setAiDrawerOpen(aiDrawerExternalOpen);
        }
    }, [aiDrawerExternalOpen]);

    /**
     * Handler: Toggle Sidebar
     */
    const handleToggleSidebar = () => {
        setSidebarCollapsed((prev) => !prev);
    };

    /**
     * Handler: AI Drawer Change
     * Handles AI drawer open/close with external callback
     */
    const handleAiDrawerChange = (open: boolean) => {
        setAiDrawerOpen(open);
        onAiDrawerChange?.(open);
    };

    /**
     * Handler: Mark Notification as Read
     */
    const markNotificationAsRead = (id: number) => {
        if (portalType === 'FARMER') {
            markNotificationReadMutation.mutate(id);
            return;
        }
        if (portalType === 'ADMIN') {
            const alert = adminAlertsQuery.data?.items?.find((item) => item.id === id);
            if (alert?.status !== 'NEW') {
                return;
            }
            adminAlertReadMutation.mutate(id);
        }
    };

    /**
     * Handler: Mark All Notifications as Read
     */
    const markAllAsRead = () => {
        if (portalType === 'FARMER') {
            const unreadIds =
                farmerNotificationsQuery.data
                    ?.filter((item) => !item.readAt)
                    .map((item) => item.id) ?? [];
            unreadIds.forEach((id) => markNotificationReadMutation.mutate(id));
            return;
        }
        if (portalType === 'ADMIN') {
            const unreadAlerts =
                adminAlertsQuery.data?.items?.filter((item) => item.status === 'NEW') ?? [];
            unreadAlerts.forEach((alert) => adminAlertReadMutation.mutate(alert.id));
        }
    };

    /**
     * Handler: Open Notifications Drawer
     */
    const handleNotificationsOpen = () => {
        setNotificationsOpen(true);
        if (portalType === 'FARMER') {
            farmerNotificationsQuery.refetch();
        }
        if (portalType === 'ADMIN') {
            adminAlertsQuery.refetch();
        }
    };

    /**
     * Handler: Open AI Drawer
     */
    const handleAiDrawerOpen = () => {
        handleAiDrawerChange(true);
    };

    // Return only what the view needs
    return {
        // UI State
        sidebarCollapsed,
        aiDrawerOpen,
        notificationsOpen,

        // User Preferences
        theme,
        language,

        // Data
        notifications,

        // Computed Values
        config,
        unreadCount,

        // Handlers
        handleToggleSidebar,
        handleAiDrawerChange,
        handleAiDrawerOpen,
        setNotificationsOpen,
        handleNotificationsOpen,
        markNotificationAsRead,
        markAllAsRead,
        setTheme,
        setLanguage: handleLanguageChange,
    };
}
