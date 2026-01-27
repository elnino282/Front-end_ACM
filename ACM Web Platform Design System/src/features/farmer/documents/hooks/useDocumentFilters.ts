import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

export type DocumentSortOption = "NEWEST" | "MOST_VIEWED" | "RECOMMENDED";

export interface DocumentFiltersState {
  q: string;
  type: string | undefined;
  cropId: string | undefined;
  stage: string | undefined;
  topic: string | undefined;
  sort: DocumentSortOption;
  tab: "all" | "favorites" | "recent";
}

export function useDocumentFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [debouncedQ, setDebouncedQ] = useState("");

  // Read filters from URL
  const filters: DocumentFiltersState = useMemo(
    () => ({
      q: searchParams.get("q") || "",
      type: searchParams.get("type") || undefined,
      cropId: searchParams.get("cropId") || undefined,
      stage: searchParams.get("stage") || undefined,
      topic: searchParams.get("topic") || undefined,
      sort: (searchParams.get("sort") as DocumentSortOption) || "NEWEST",
      tab: (searchParams.get("tab") as "all" | "favorites" | "recent") || "all",
    }),
    [searchParams],
  );

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQ(filters.q);
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.q]);

  // Update a single filter
  const setFilter = useCallback(
    <K extends keyof DocumentFiltersState>(
      key: K,
      value: DocumentFiltersState[K],
    ) => {
      setSearchParams(
        (prev) => {
          const newParams = new URLSearchParams(prev);
          if (
            value === undefined ||
            value === "" ||
            (value === "all" && key === "tab")
          ) {
            newParams.delete(key);
          } else {
            newParams.set(key, String(value));
          }
          return newParams;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  // Check if any filter is active
  const hasActiveFilters = useMemo(() => {
    return Boolean(
      filters.q ||
      filters.type ||
      filters.cropId ||
      filters.stage ||
      filters.topic ||
      filters.sort !== "NEWEST",
    );
  }, [filters]);

  // Count active filters (excluding tab and sort)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.q) count++;
    if (filters.type) count++;
    if (filters.cropId) count++;
    if (filters.stage) count++;
    if (filters.topic) count++;
    return count;
  }, [filters]);

  // Build API params (use debounced q)
  const apiParams = useMemo(
    () => ({
      tab: filters.tab,
      q: debouncedQ.length >= 2 ? debouncedQ : undefined,
      type: filters.type,
      crop: filters.cropId, // API uses 'crop' param, not 'cropId'
      stage: filters.stage,
      topic: filters.topic,
      sort: filters.sort,
    }),
    [
      filters.tab,
      debouncedQ,
      filters.type,
      filters.cropId,
      filters.stage,
      filters.topic,
      filters.sort,
    ],
  );

  return {
    filters,
    debouncedQ,
    setFilter,
    clearFilters,
    hasActiveFilters,
    activeFilterCount,
    apiParams,
  };
}
