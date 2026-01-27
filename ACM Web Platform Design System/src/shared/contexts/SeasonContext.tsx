import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import { useSeasons, type Season } from '@/entities/season';

// ═══════════════════════════════════════════════════════════════
// SEASON CONTEXT TYPES
// ═══════════════════════════════════════════════════════════════

interface SeasonContextValue {
    /** Currently selected season ID */
    selectedSeasonId: number | null;
    /** Set the selected season ID */
    setSelectedSeasonId: (id: number | null) => void;
    /** Currently selected season data */
    selectedSeason: Season | null;
    /** All available seasons */
    seasons: Season[];
    /** Active seasons (status = ACTIVE) */
    activeSeasons: Season[];
    /** Loading state */
    isLoading: boolean;
    /** Error state */
    error: Error | null;
    /** Refetch seasons */
    refetch: () => void;
    /** Requires explicit season selection before proceeding */
    requiresSeasonSelection: boolean;
}

const SeasonContext = createContext<SeasonContextValue | null>(null);

// ═══════════════════════════════════════════════════════════════
// SEASON PROVIDER
// ═══════════════════════════════════════════════════════════════

interface SeasonProviderProps {
    children: ReactNode;
}

/**
 * SeasonProvider - Provides season context for farmer features
 * 
 * Wraps farmer routes to provide:
 * - List of seasons from API
 * - Currently selected season
 * - Active season filtering
 * 
 * Used by: tasks, harvests, and other season-dependent features
 */
export function SeasonProvider({ children }: SeasonProviderProps) {
    const STORAGE_KEY = 'activeSeasonId';
    
    // Initialize from localStorage if available
    const [selectedSeasonId, setSelectedSeasonIdState] = useState<number | null>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = parseInt(stored, 10);
                if (!isNaN(parsed)) return parsed;
            }
        }
        return null;
    });

    // Wrapper to persist to localStorage when season changes
    const setSelectedSeasonId = (id: number | null) => {
        setSelectedSeasonIdState(id);
        if (typeof window !== 'undefined') {
            if (id !== null) {
                localStorage.setItem(STORAGE_KEY, String(id));
            } else {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
    };

    // Fetch all seasons for current farmer
    const { data: seasonsData, isLoading, error, refetch } = useSeasons();

    // Extract seasons from paginated response
    const seasons = useMemo(() => {
        return seasonsData?.items ?? [];
    }, [seasonsData]);

    // Filter active seasons
    const activeSeasons = useMemo(() => {
        return seasons.filter(s => s.status === 'ACTIVE');
    }, [seasons]);

    // Validate stored season still exists after seasons load
    useEffect(() => {
        if (!isLoading && selectedSeasonId !== null && seasons.length > 0) {
            const seasonExists = seasons.some(s => s.id === selectedSeasonId);
            if (!seasonExists) {
                // Stored season no longer valid, clear it
                setSelectedSeasonId(null);
            }
        }
    }, [isLoading, selectedSeasonId, seasons]);

    // Flag indicating user must select a season before proceeding
    const requiresSeasonSelection = !isLoading && selectedSeasonId === null;

    // Get selected season object
    const selectedSeason = useMemo(() => {
        if (!selectedSeasonId) return null;
        return seasons.find(s => s.id === selectedSeasonId) ?? null;
    }, [selectedSeasonId, seasons]);

    const value: SeasonContextValue = {
        selectedSeasonId,
        setSelectedSeasonId,
        selectedSeason,
        seasons,
        activeSeasons,
        isLoading,
        error: error ?? null,
        refetch,
        requiresSeasonSelection,
    };

    return (
        <SeasonContext.Provider value={value}>
            {children}
        </SeasonContext.Provider>
    );
}

// ═══════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════

/**
 * useSeason - Access season context
 * 
 * Must be used within a SeasonProvider
 */
export function useSeason(): SeasonContextValue {
    const context = useContext(SeasonContext);
    if (!context) {
        throw new Error('useSeason must be used within a SeasonProvider');
    }
    return context;
}

/**
 * useOptionalSeason - Access season context without throwing
 * 
 * Returns null if not within SeasonProvider
 */
export function useOptionalSeason(): SeasonContextValue | null {
    return useContext(SeasonContext);
}
