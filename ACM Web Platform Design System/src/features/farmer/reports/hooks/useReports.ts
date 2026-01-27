import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
    ReportSection,
    YieldViewMode,
    ExportFormat,
    FilterState,
    PesticideStatus,
} from "../types";
import { DEFAULT_FILTERS } from "../constants";
import {
    adminReportsApi,
    reportsKeys,
} from "@/services/api.admin";
import { useSeason } from "@/shared/contexts";

export function useReports() {
    const { selectedSeasonId } = useSeason();
    
    // Main state
    const [activeSection, setActiveSection] = useState<ReportSection>("yield");
    const [selectedSeason, setSelectedSeason] = useState("spring-2025");
    const [yieldViewMode, setYieldViewMode] = useState<YieldViewMode>("season");

    // Modal and drawer state
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    // Export form state
    const [exportFormat, setExportFormat] = useState<ExportFormat>("excel");
    const [includeCharts, setIncludeCharts] = useState(true);
    const [includeNotes, setIncludeNotes] = useState(false);

    // Filter state
    const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

    // Year filter - default to current year
    const selectedYear = new Date().getFullYear();

    // ═══════════════════════════════════════════════════════════════
    // REAL API QUERIES
    // ═══════════════════════════════════════════════════════════════

    const yieldParams = { year: selectedYear };
    const costParams = { year: selectedYear };
    const revenueParams = { year: selectedYear };

    const { data: yieldReport, isLoading: yieldLoading, error: yieldError } = useQuery({
        queryKey: reportsKeys.yield(yieldParams),
        queryFn: () => adminReportsApi.getYieldReport(yieldParams),
        staleTime: 1000 * 60 * 5,
    });

    const { data: costReport, isLoading: costLoading, error: costError } = useQuery({
        queryKey: reportsKeys.cost(costParams),
        queryFn: () => adminReportsApi.getCostReport(costParams),
        staleTime: 1000 * 60 * 5,
    });

    const { data: revenueReport, isLoading: revenueLoading, error: revenueError } = useQuery({
        queryKey: reportsKeys.revenue(revenueParams),
        queryFn: () => adminReportsApi.getRevenueReport(revenueParams),
        staleTime: 1000 * 60 * 5,
    });

    // ═══════════════════════════════════════════════════════════════
    // COMPUTED DATA
    // ═══════════════════════════════════════════════════════════════

    // Transform yield report for chart display
    const yieldBySeason = useMemo(() => {
        if (!yieldReport) return [];
        return yieldReport.map(item => ({
            season: item.seasonName || `Season ${item.seasonId}`,
            expected: Number(item.expectedYieldKg) || 0,
            actual: Number(item.actualYieldKg) || 0,
            variance: Number(item.variancePercent) || 0,
        }));
    }, [yieldReport]);

    const yieldByCrop = useMemo(() => {
        if (!yieldReport) return [];
        // Group by crop
        const cropMap = new Map<string, { expected: number; actual: number }>();
        yieldReport.forEach(item => {
            const crop = item.cropName || 'Unknown';
            const existing = cropMap.get(crop) || { expected: 0, actual: 0 };
            cropMap.set(crop, {
                expected: existing.expected + (Number(item.expectedYieldKg) || 0),
                actual: existing.actual + (Number(item.actualYieldKg) || 0),
            });
        });
        return Array.from(cropMap.entries()).map(([crop, data]) => ({
            crop,
            expected: data.expected,
            actual: data.actual,
        }));
    }, [yieldReport]);

    const yieldByPlot = useMemo(() => {
        if (!yieldReport) return [];
        // Group by plot
        const plotMap = new Map<string, { expected: number; actual: number }>();
        yieldReport.forEach(item => {
            const plot = item.plotName || 'Unknown';
            const existing = plotMap.get(plot) || { expected: 0, actual: 0 };
            plotMap.set(plot, {
                expected: existing.expected + (Number(item.expectedYieldKg) || 0),
                actual: existing.actual + (Number(item.actualYieldKg) || 0),
            });
        });
        return Array.from(plotMap.entries()).map(([plot, data]) => ({
            plot,
            expected: data.expected,
            actual: data.actual,
        }));
    }, [yieldReport]);

    // Loading and error states
    const isLoading = yieldLoading || costLoading || revenueLoading;
    const hasError = yieldError || costError || revenueError;

    // Handlers
    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            setIsExporting(false);
            setIsExportModalOpen(false);
            toast.success("Report Exported Successfully ✅", {
                description: `Your ${exportFormat.toUpperCase()} report has been generated.`,
            });
        }, 2000);
    };

    const handleApplyFilters = () => {
        setIsFilterDrawerOpen(false);
        toast.success("Filters Applied", {
            description: "Report data has been updated based on your filters.",
        });
    };

    const handleClearFilters = () => {
        setFilters(DEFAULT_FILTERS);
        toast.info("Filters Cleared", {
            description: "All filters have been reset to default values.",
        });
    };

    const getYieldChartData = () => {
        switch (yieldViewMode) {
            case "season":
                return yieldBySeason;
            case "crop":
                return yieldByCrop;
            case "plot":
                return yieldByPlot;
            default:
                return yieldBySeason;
        }
    };

    const getPesticideStatusBadge = (status: PesticideStatus) => {
        const statusConfig = {
            safe: {
                className: "bg-primary/10 text-primary border-primary/20",
                label: "🟢 Safe",
            },
            approaching: {
                className: "bg-accent/10 text-accent border-accent/20",
                label: "🟠 Approaching",
            },
            violated: {
                className: "bg-destructive/10 text-destructive border-destructive/20",
                label: "🔴 Violated",
            },
        };

        return statusConfig[status];
    };

    return {
        // State
        activeSection,
        selectedSeason,
        yieldViewMode,
        isFilterDrawerOpen,
        isExportModalOpen,
        isExporting,
        exportFormat,
        includeCharts,
        includeNotes,
        filters,

        // API Data
        yieldReport: yieldReport ?? [],
        costReport: costReport ?? [],
        revenueReport: revenueReport ?? [],
        
        // Loading/Error
        isLoading,
        hasError,

        // Setters
        setActiveSection,
        setSelectedSeason,
        setYieldViewMode,
        setIsFilterDrawerOpen,
        setIsExportModalOpen,
        setExportFormat,
        setIncludeCharts,
        setIncludeNotes,
        setFilters,

        // Handlers
        handleExport,
        handleApplyFilters,
        handleClearFilters,
        getYieldChartData,
        getPesticideStatusBadge,
    };
}




