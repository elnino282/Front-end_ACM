/**
 * widgets/layout - Application Shell Widget
 * 
 * Provides the main layout structure for all portal types (Farmer, Buyer).
 * This is a composition widget that combines header, sidebar, and content areas.
 * 
 * @module @widgets/layout
 */

// Main component
export { AppShell } from './ui/AppShell';

// Types (for page compositions)
export type {
    AppShellProps,
    PortalType,
    BreadcrumbPath,
    Theme,
    Language,
} from './model/types';

// Configuration (for customization)
export { portalConfig, languageNames } from './lib/config';
