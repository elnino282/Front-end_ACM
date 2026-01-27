/**
 * I18nProvider
 * 
 * Provides internationalization context to the application.
 * Handles language synchronization with user preferences.
 */

import i18n, { changeLanguage, getCurrentLocale, normalizeLocale } from '@/i18n';
import { Suspense, useEffect, type ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';

interface I18nProviderProps {
    children: ReactNode;
    /** Initial locale from user preferences (server-side) */
    preferredLocale?: string;
}

/**
 * Loading fallback component
 * Prevents flash of untranslated content
 */
function I18nLoadingFallback() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
    );
}

/**
 * I18n Provider Component
 * 
 * Wraps the application with i18next provider and handles:
 * - Initial language detection
 * - Syncing with user preferences
 * - Suspense boundary for async translation loading
 */
export function I18nProvider({ children, preferredLocale }: I18nProviderProps) {
    // Sync language with user preferences when they change
    useEffect(() => {
        if (preferredLocale) {
            const normalized = normalizeLocale(preferredLocale);
            const current = getCurrentLocale();
            
            if (normalized !== current) {
                changeLanguage(normalized);
            }
        }
    }, [preferredLocale]);
    
    return (
        <I18nextProvider i18n={i18n}>
            <Suspense fallback={<I18nLoadingFallback />}>
                {children}
            </Suspense>
        </I18nextProvider>
    );
}
