import { useState, useCallback, useMemo } from 'react';
import { useFarms, type FarmListParams } from '@/entities/farm';
import { useDebounce } from '@/shared/lib/hooks/useDebounce';

/**
 * Feature hook for farm list with filtering and pagination
 * Wraps entity-level useFarms with state management and debouncing
 */
export function useFarmsList() {
    console.log('[useFarmsList] Hook called');

    const [keyword, setKeyword] = useState<string>('');
    const [activeFilter, setActiveFilter] = useState<boolean | null>(null);
    const [page, setPage] = useState(0);
    const [size] = useState(20);

    // Debounce keyword search to avoid excessive API calls
    const debouncedKeyword = useDebounce(keyword, 400);

    const params: FarmListParams = useMemo(() => {
        const p = {
            keyword: debouncedKeyword || null,
            active: activeFilter,
            page,
            size,
        };
        console.log('[useFarmsList] Params:', p);
        return p;
    }, [debouncedKeyword, activeFilter, page, size]);

    const {
        data: farmsResponse,
        isLoading,
        isError,
        error,
        refetch,
    } = useFarms(params);

    console.log('[useFarmsList] Query result:', {
        farmsResponse,
        isLoading,
        isError,
        error,
        farmsCount: farmsResponse?.content?.length,
    });

    const handleKeywordChange = useCallback((value: string) => {
        setKeyword(value);
        setPage(0); // Reset to first page on search
    }, []);

    const handleActiveFilterChange = useCallback((value: boolean | null) => {
        setActiveFilter(value);
        setPage(0); // Reset to first page on filter change
    }, []);

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage);
    }, []);

    return {
        farms: farmsResponse?.content ?? [],
        pagination: {
            page: farmsResponse?.page ?? 0,
            size: farmsResponse?.size ?? size,
            totalElements: farmsResponse?.totalElements ?? 0,
            totalPages: farmsResponse?.totalPages ?? 0,
        },
        filters: {
            keyword,
            activeFilter,
        },
        setKeyword: handleKeywordChange,
        setActiveFilter: handleActiveFilterChange,
        setPage: handlePageChange,
        isLoading,
        isError,
        error,
        refetch,
    };
}



