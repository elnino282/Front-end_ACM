/**
 * i18n Configuration
 * 
 * Internationalization setup using i18next with React integration.
 * Supports English (en-US) and Vietnamese (vi-VN) locales.
 * 
 * Language Detection Priority:
 * 1. User preference from API/context (locale in preferences)
 * 2. localStorage value
 * 3. Browser language
 * 4. Default fallback: en-US
 */

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

// Supported locales configuration
export const SUPPORTED_LOCALES = ['en-US', 'vi-VN'] as const;
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

export const DEFAULT_LOCALE: SupportedLocale = 'en-US';

// Language code mapping (short code -> full locale)
export const LANGUAGE_LOCALE_MAP: Record<string, SupportedLocale> = {
    'en': 'en-US',
    'en-US': 'en-US',
    'vi': 'vi-VN',
    'vi-VN': 'vi-VN',
};

// Display names for language menu
export const LANGUAGE_DISPLAY_NAMES: Record<SupportedLocale, { native: string; english: string }> = {
    'en-US': { native: 'English', english: 'English' },
    'vi-VN': { native: 'Tiếng Việt', english: 'Vietnamese' },
};

// Storage key for language preference
export const LANGUAGE_STORAGE_KEY = 'acm_language';

/**
 * Get the i18next language code from a locale
 * en-US -> en, vi-VN -> vi
 */
export function getLanguageCode(locale: string): string {
    return locale.split('-')[0];
}

/**
 * Get the full locale from a language code
 * en -> en-US, vi -> vi-VN
 */
export function getLocaleFromLanguageCode(code: string): SupportedLocale {
    return LANGUAGE_LOCALE_MAP[code] ?? DEFAULT_LOCALE;
}

/**
 * Check if a locale is supported
 */
export function isSupportedLocale(locale: string): locale is SupportedLocale {
    return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

/**
 * Normalize any locale string to a supported locale
 */
export function normalizeLocale(locale: string | null | undefined): SupportedLocale {
    if (!locale) return DEFAULT_LOCALE;
    
    // Direct match
    if (isSupportedLocale(locale)) return locale;
    
    // Map from short code
    if (LANGUAGE_LOCALE_MAP[locale]) return LANGUAGE_LOCALE_MAP[locale];
    
    // Try to match by language prefix
    const langCode = locale.split('-')[0].toLowerCase();
    if (LANGUAGE_LOCALE_MAP[langCode]) return LANGUAGE_LOCALE_MAP[langCode];
    
    return DEFAULT_LOCALE;
}

// Initialize i18next
i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        // Resources will be loaded from public/locales
        backend: {
            loadPath: '/locales/{{lng}}.json',
        },
        
        // Language configuration
        fallbackLng: 'en',
        supportedLngs: ['en', 'vi'],
        
        // Detection options
        detection: {
            order: ['localStorage', 'navigator'],
            lookupLocalStorage: LANGUAGE_STORAGE_KEY,
            caches: ['localStorage'],
            convertDetectedLanguage: (lng) => {
                // Convert detected language to our short codes
                const locale = normalizeLocale(lng);
                return getLanguageCode(locale);
            },
        },
        
        // Namespace configuration
        ns: ['translation'],
        defaultNS: 'translation',
        
        // Interpolation settings
        interpolation: {
            escapeValue: false, // React already escapes
        },
        
        // React specific options
        react: {
            useSuspense: true,
        },
        
        // Debug in development
        debug: import.meta.env.DEV,
    });

/**
 * Change the application language
 * Updates both i18next and localStorage
 */
export async function changeLanguage(locale: SupportedLocale): Promise<void> {
    const langCode = getLanguageCode(locale);
    await i18n.changeLanguage(langCode);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, langCode);
    document.documentElement.lang = langCode;
}

/**
 * Get the current locale as a full locale code
 */
export function getCurrentLocale(): SupportedLocale {
    return getLocaleFromLanguageCode(i18n.language);
}

export default i18n;
