import {
    Home, MapPin, Calendar, CheckSquare, DollarSign, Package,
    ShoppingCart, BarChart3, Settings, Sprout, FileText,
    Shield, Warehouse, Users, AlertTriangle, Bell
} from 'lucide-react';
import type { PortalType, PortalConfig } from '../model/types';

/**
 * Portal Configurations
 * Defines navigation and styling for each portal type
 */
export const portalConfig: Record<PortalType, PortalConfig> = {
    ADMIN: {
        name: 'Admin Portal',
        color: '#4263EB',
        icon: Shield,
        emoji: '🔐',
        navigation: [
            { id: 'dashboard', label: 'Admin Dashboard', icon: Home },
            { id: 'inventory', label: 'Inventory', icon: Package },
            { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
            { id: 'alerts', label: 'Alerts Center', icon: Bell },
            { id: 'users-roles', label: 'Users & Roles', icon: Users },
            { id: 'farms-plots', label: 'Farms & Plots', icon: Warehouse },
            { id: 'crops-varieties', label: 'Crops & Varieties', icon: Sprout },
            { id: 'reports', label: 'Reports', icon: BarChart3 },
            { id: 'documents', label: 'Documents', icon: FileText },
        ],
    },
    FARMER: {
        name: 'Farmer Portal',
        color: '#2F9E44',
        icon: Sprout,
        emoji: '🌾',
        navigation: [
            { id: 'dashboard', label: 'Dashboard', icon: Home },
            { id: 'farms', label: 'Farms & Plots', icon: Warehouse },
            { id: 'seasons', label: 'Seasons', icon: Calendar },
            { id: 'suppliers-supplies', label: 'Suppliers & Supplies', icon: Users },
            { id: 'inventory', label: 'Inventory', icon: Warehouse },
            { id: 'documents', label: 'Documents', icon: FileText },
            { id: 'incidents', label: 'Incidents', icon: Shield },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'ai-assistant', label: 'AI Assistant', icon: Sprout },
        ],
    },
    BUYER: {
        name: 'Buyer Portal',
        color: '#0CA678',
        icon: ShoppingCart,
        emoji: '🛒',
        navigation: [
            { id: 'dashboard', label: 'Dashboard', icon: Home },
            { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart },
            { id: 'orders', label: 'My Orders', icon: Package },
            { id: 'traceability', label: 'Traceability', icon: MapPin },
            { id: 'reports', label: 'Reports', icon: BarChart3 },
            { id: 'settings', label: 'Settings', icon: Settings },
        ],
    },
};

/**
 * Language Names Mapping
 */
export const languageNames = {
    en: 'English',
    vi: 'Vietnamese',
};

/**
 * Search Debounce Delay (ms)
 */
export const SEARCH_DEBOUNCE_DELAY = 300;

/**
 * Search Minimum Length
 */
export const SEARCH_MIN_LENGTH = 2;


