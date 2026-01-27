/**
 * useI18n Hook
 * 
 * Centralized hook for i18n functionality.
 * Provides type-safe translation function and language switching.
 */

import {
    changeLanguage,
    getCurrentLocale,
    LANGUAGE_DISPLAY_NAMES,
    SUPPORTED_LOCALES,
    type SupportedLocale
} from '@/i18n';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export interface UseI18nReturn {
    /** Translation function */
    t: (key: string, options?: Record<string, unknown>) => string;
    /** Current locale (e.g., 'en-US', 'vi-VN') */
    locale: SupportedLocale;
    /** Current language code (e.g., 'en', 'vi') */
    languageCode: string;
    /** Change the application language */
    setLocale: (locale: SupportedLocale) => Promise<void>;
    /** List of supported locales */
    supportedLocales: readonly SupportedLocale[];
    /** Display names for locales */
    localeDisplayNames: typeof LANGUAGE_DISPLAY_NAMES;
    /** Whether translations are loading */
    isLoading: boolean;
}

/**
 * Custom hook for internationalization
 * 
 * @example
 * ```tsx
 * const { t, locale, setLocale } = useI18n();
 * 
 * return (
 *   <div>
 *     <h1>{t('common.appName')}</h1>
 *     <p>Current locale: {locale}</p>
 *     <button onClick={() => setLocale('vi-VN')}>Switch to Vietnamese</button>
 *   </div>
 * );
 * ```
 */
export function useI18n(): UseI18nReturn {
    const { t, i18n, ready } = useTranslation();
    
    const locale = useMemo(() => getCurrentLocale(), [i18n.language]);
    
    const setLocale = useCallback(async (newLocale: SupportedLocale) => {
        await changeLanguage(newLocale);
    }, []);
    
    return {
        t: t as (key: string, options?: Record<string, unknown>) => string,
        locale,
        languageCode: i18n.language,
        setLocale,
        supportedLocales: SUPPORTED_LOCALES,
        localeDisplayNames: LANGUAGE_DISPLAY_NAMES,
        isLoading: !ready,
    };
}

/**
 * Hook for locale-aware formatting
 * Uses Intl API for number, date, and currency formatting
 */
export function useFormatters() {
    const { locale } = useI18n();
    
    const formatNumber = useCallback(
        (value: number, options?: Intl.NumberFormatOptions) => {
            return new Intl.NumberFormat(locale, options).format(value);
        },
        [locale]
    );
    
    const formatCurrency = useCallback(
        (value: number, currency: string = 'VND') => {
            return new Intl.NumberFormat(locale, {
                style: 'currency',
                currency,
                minimumFractionDigits: currency === 'VND' ? 0 : 2,
                maximumFractionDigits: currency === 'VND' ? 0 : 2,
            }).format(value);
        },
        [locale]
    );
    
    const formatDate = useCallback(
        (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => {
            const dateObj = typeof date === 'string' || typeof date === 'number' 
                ? new Date(date) 
                : date;
            return new Intl.DateTimeFormat(locale, options).format(dateObj);
        },
        [locale]
    );
    
    const formatRelativeTime = useCallback(
        (value: number, unit: Intl.RelativeTimeFormatUnit) => {
            return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(value, unit);
        },
        [locale]
    );
    
    const formatWeight = useCallback(
        (value: number, unit: 'KG' | 'G' | 'TON') => {
            const unitMap = { KG: 'kg', G: 'g', TON: 't' };
            return `${formatNumber(value)} ${unitMap[unit]}`;
        },
        [formatNumber]
    );
    
    return {
        formatNumber,
        formatCurrency,
        formatDate,
        formatRelativeTime,
        formatWeight,
    };
}
