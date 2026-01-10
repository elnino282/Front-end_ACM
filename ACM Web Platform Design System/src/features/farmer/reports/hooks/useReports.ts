import { useState } from "react";
import { toast } from "sonner";
import type {
    ReportSection,
    YieldViewMode,
    ExportFormat,
    FilterState,
    PesticideStatus,
    YieldBySeason,
    YieldByCrop,
    YieldByPlot,
} from "../types";
import { DEFAULT_FILTERS } from "../constants";

// TODO: Replace with API data when available
const YIELD_BY_SEASON: any[] = [];
const YIELD_BY_CROP: any[] = [];
const YIELD_BY_PLOT: any[] = [];

export function useReports() {
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

    const getYieldChartData = ():
        | YieldBySeason[]
        | YieldByCrop[]
        | YieldByPlot[] => {
        switch (yieldViewMode) {
            case "season":
                return YIELD_BY_SEASON;
            case "crop":
                return YIELD_BY_CROP;
            case "plot":
                return YIELD_BY_PLOT;
            default:
                return YIELD_BY_SEASON;
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



