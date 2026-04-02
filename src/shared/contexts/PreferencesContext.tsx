import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { DEFAULT_PREFERENCES, usePreferencesMe, type Preferences } from '@/entities/preferences';

interface PreferencesContextValue {
    preferences: Preferences;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

interface PreferencesProviderProps {
    children: ReactNode;
}

export function PreferencesProvider({ children }: PreferencesProviderProps) {
    const { data, isLoading, error, refetch } = usePreferencesMe();

    const preferences = data ?? DEFAULT_PREFERENCES;

    useEffect(() => {
        if (error) {
            console.error('Failed to load preferences:', error);
        }
    }, [error]);

    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.lang = preferences.locale;
        }
    }, [preferences.locale]);

    const value = useMemo<PreferencesContextValue>(() => ({
        preferences,
        isLoading,
        error: error ?? null,
        refetch,
    }), [preferences, isLoading, error, refetch]);

    return (
        <PreferencesContext.Provider value={value}>
            {children}
        </PreferencesContext.Provider>
    );
}

export function usePreferences(): PreferencesContextValue {
    const context = useContext(PreferencesContext);
    if (!context) {
        throw new Error('usePreferences must be used within a PreferencesProvider');
    }
    return context;
}

export function useCurrency() {
    return usePreferences().preferences.currency;
}

export function useWeightUnit() {
    return usePreferences().preferences.weightUnit;
}

export function useLocale() {
    return usePreferences().preferences.locale;
}
