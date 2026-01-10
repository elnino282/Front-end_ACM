import { ReactNode, ElementType } from 'react';

/**
 * Portal Types
 */
export type PortalType = 'ADMIN' | 'FARMER' | 'BUYER';
export type Theme = 'light' | 'dark';
export type Language = 'en' | 'vi';

/**
 * Navigation Item
 */
export interface NavigationItem {
  id: string;
  label: string;
  icon: ElementType;
  href?: string;
  badge?: number;
  onClick?: () => void;
}

/**
 * Notification
 */
export interface Notification {
  id: number;
  type: 'task' | 'weather' | 'inventory' | 'incident';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

/**
 * Breadcrumb Path
 */
export interface BreadcrumbPath {
  label: string;
  href?: string;
}

/**
 * Portal Configuration
 */
export interface PortalConfig {
  name: string;
  color: string;
  icon: ElementType;
  emoji: string;
  navigation: NavigationItem[];
}

/**
 * Main AppShell Props
 */
export interface AppShellProps {
  portalType: PortalType;
  currentView: string;
  onViewChange: (view: string) => void;
  children: ReactNode;
  breadcrumbs?: BreadcrumbPath[];
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  onAiDrawerChange?: (open: boolean) => void;
  aiDrawerExternalOpen?: boolean;
  onLogout?: () => void;
}

/**
 * Sub-Component Props
 */

export interface HeaderProps {
  config: PortalConfig;
  breadcrumbs: BreadcrumbPath[];
  sidebarCollapsed: boolean;
  searchQuery: string;
  unreadCount: number;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  portalType: PortalType;
  theme: Theme;
  language: Language;
  onToggleSidebar: () => void;
  onViewChange: (view: string) => void;
  onSearchChange: (query: string) => void;
  onAiDrawerOpen: () => void;
  onNotificationsOpen: () => void;
  onThemeChange: (theme: Theme) => void;
  onLanguageChange: (language: Language) => void;
  onLogout?: () => void;
}

export interface SidebarProps {
  navigationItems: NavigationItem[];
  currentView: string;
  collapsed: boolean;
  portalColor: string;
  onNavigate: (view: string) => void;
  onToggleCollapse: () => void;
}

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface ProfileMenuProps {
  userName: string;
  userEmail: string;
  userAvatar?: string;
  portalType: PortalType;
  theme: Theme;
  language: Language;
  onThemeChange: (theme: Theme) => void;
  onLanguageChange: (language: Language) => void;
  onViewChange: (view: string) => void;
  onLogout?: () => void;
}

export interface NotificationsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: number) => void;
  onMarkAllAsRead: () => void;
}

export interface AiDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  portalColor: string;
}
