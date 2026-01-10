import { useState, useEffect } from 'react';
import type { AppShellProps, Language, Notification, PortalConfig } from '../model/types';
import { portalConfig, initialNotifications, SEARCH_DEBOUNCE_DELAY, SEARCH_MIN_LENGTH } from '../lib/config';
import { useTheme } from '@/hooks/useTheme';

const LANGUAGE_STORAGE_KEY = 'acm_language';

const getStoredLanguage = (): Language => {
    if (typeof window === 'undefined') {
        return 'en';
    }

    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return stored === 'vi' ? 'vi' : 'en';
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
    const [searchQuery, setSearchQuery] = useState('');
    const [searchDebounced, setSearchDebounced] = useState('');
    const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    // User Preferences
    const { theme, setTheme } = useTheme();
    const [language, setLanguage] = useState<Language>(() => getStoredLanguage());

    // Data State
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

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

    useEffect(() => {
        if (typeof document === 'undefined') {
            return;
        }

        document.documentElement.lang = language;
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }, [language]);

    /**
     * Effect: Search Debouncing
     * Debounces search query to avoid excessive API calls
     */
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.length >= SEARCH_MIN_LENGTH || searchQuery.length === 0) {
                setSearchDebounced(searchQuery);
            }
        }, SEARCH_DEBOUNCE_DELAY);

        return () => clearTimeout(timer);
    }, [searchQuery]);

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
     * Effect: Execute Search
     * Triggers search when debounced query changes
     */
    useEffect(() => {
        if (searchDebounced) {
            handleSearch(searchDebounced);
        }
    }, [searchDebounced]);

    /**
     * Handler: Search
     * Implements cross-entity search logic
     */
    const handleSearch = (query: string) => {
        console.log('Searching for:', query);
        // TODO: Implement actual cross-entity search logic
    };

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
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    /**
     * Handler: Mark All Notifications as Read
     */
    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    /**
     * Handler: Open Notifications Drawer
     */
    const handleNotificationsOpen = () => {
        setNotificationsOpen(true);
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
        searchQuery,
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
    };
}
