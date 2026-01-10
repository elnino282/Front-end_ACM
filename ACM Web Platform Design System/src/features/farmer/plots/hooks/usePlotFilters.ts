import { useState, useMemo, useCallback } from "react";
import { useCrops } from "@/entities/crop";
import { useSoilTypes } from "@/entities/soil-type";
import { usePlotStatuses } from "@/entities/plot-status";
import type { Plot } from "../types";

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export type FilterOption = {
    value: string;
    label: string;
};

export interface UsePlotFiltersReturn {
    // Filter state
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filterCrop: string;
    setFilterCrop: (crop: string) => void;
    filterStatus: string;
    setFilterStatus: (status: string) => void;
    filterSoilType: string;
    setFilterSoilType: (type: string) => void;

    // Filter options from API
    cropOptions: FilterOption[];
    soilTypeOptions: FilterOption[];
    statusOptions: FilterOption[];
    isLoadingFilterOptions: boolean;

    // Handlers
    handleClearFilters: () => void;

    // Computed filtered data
    getFilteredPlots: (plots: Plot[]) => Plot[];
}

// ═══════════════════════════════════════════════════════════════
// HOOK IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════

/**
 * Custom hook for plot filtering logic
 * Separates filter concerns from the main usePlotManagement hook
 */
export const usePlotFilters = (): UsePlotFiltersReturn => {
    // ─────────────────────────────────────────────────────────────
    // API HOOKS - FILTER OPTIONS
    // ─────────────────────────────────────────────────────────────

    const { data: cropsData, isLoading: isLoadingCrops } = useCrops();
    const { data: soilTypesData, isLoading: isLoadingSoilTypes } = useSoilTypes();
    const { data: plotStatusesData, isLoading: isLoadingStatuses } = usePlotStatuses();

    // ─────────────────────────────────────────────────────────────
    // FILTER STATE
    // ─────────────────────────────────────────────────────────────

    const [searchQuery, setSearchQuery] = useState("");
    const [filterCrop, setFilterCrop] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterSoilType, setFilterSoilType] = useState("all");

    // ─────────────────────────────────────────────────────────────
    // FILTER OPTIONS TRANSFORMATION
    // ─────────────────────────────────────────────────────────────

    const cropOptions = useMemo<FilterOption[]>(() => {
        const options: FilterOption[] = [{ value: "all", label: "All Plots" }];
        if (cropsData && cropsData.length > 0) {
            cropsData.forEach((crop) => {
                options.push({
                    value: crop.cropName,
                    label: crop.cropName,
                });
            });
        }
        return options;
    }, [cropsData]);

    const soilTypeOptions = useMemo<FilterOption[]>(() => {
        const options: FilterOption[] = [{ value: "all", label: "All Soil Types" }];
        if (soilTypesData && soilTypesData.length > 0) {
            soilTypesData.forEach((soilType) => {
                options.push({
                    value: soilType.soilName,
                    label: soilType.soilName,
                });
            });
        }
        return options;
    }, [soilTypesData]);

    const statusOptions = useMemo<FilterOption[]>(() => {
        const options: FilterOption[] = [{ value: "all", label: "All Status" }];
        if (plotStatusesData && plotStatusesData.length > 0) {
            plotStatusesData.forEach((status) => {
                options.push({
                    value: status.statusName,
                    label: status.statusName,
                });
            });
        }
        return options;
    }, [plotStatusesData]);

    const isLoadingFilterOptions = isLoadingCrops || isLoadingSoilTypes || isLoadingStatuses;

    // ─────────────────────────────────────────────────────────────
    // HANDLERS
    // ─────────────────────────────────────────────────────────────

    const handleClearFilters = useCallback(() => {
        setSearchQuery("");
        setFilterCrop("all");
        setFilterStatus("all");
        setFilterSoilType("all");
    }, []);

    // ─────────────────────────────────────────────────────────────
    // FILTER LOGIC
    // ─────────────────────────────────────────────────────────────

    const getFilteredPlots = useCallback((plots: Plot[]): Plot[] => {
        return plots.filter((plot) => {
            const matchesSearch =
                searchQuery === "" ||
                plot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                plot.id.toLowerCase().includes(searchQuery.toLowerCase());

            // Crop filter - plots don't have crop field in response, so always match
            const matchesCrop = filterCrop === "all" || true;

            // Status filter - compare with plot.status
            const matchesStatus =
                filterStatus === "all" ||
                (plot.status && plot.status.toLowerCase() === filterStatus.toLowerCase());

            // Soil type filter - compare with plot.soilType
            const matchesSoilType =
                filterSoilType === "all" ||
                (plot.soilType && plot.soilType.toLowerCase() === filterSoilType.toLowerCase());

            return matchesSearch && matchesCrop && matchesStatus && matchesSoilType;
        });
    }, [searchQuery, filterCrop, filterStatus, filterSoilType]);

    return {
        // State
        searchQuery,
        setSearchQuery,
        filterCrop,
        setFilterCrop,
        filterStatus,
        setFilterStatus,
        filterSoilType,
        setFilterSoilType,

        // Options
        cropOptions,
        soilTypeOptions,
        statusOptions,
        isLoadingFilterOptions,

        // Handlers
        handleClearFilters,
        getFilteredPlots,
    };
};



