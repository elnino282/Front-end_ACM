import {
    Wheat,
    DollarSign,
    CheckCircle2,
    AlertTriangle,
} from "lucide-react";
import type {
    SidebarItem,
    ReportSection,
} from "./types";

// Note: Mock chart data removed - now using entity API hooks
// Removed: YIELD_BY_SEASON, YIELD_BY_CROP, YIELD_BY_PLOT, COST_DISTRIBUTION,
// MONTHLY_COSTS, TASK_PERFORMANCE, PESTICIDE_RECORDS

// Sidebar navigation items
export const SIDEBAR_ITEMS: SidebarItem[] = [
    { id: "yield" as ReportSection, label: "Yield & Productivity", icon: Wheat },
    { id: "cost" as ReportSection, label: "Cost Analysis", icon: DollarSign },
    {
        id: "performance" as ReportSection,
        label: "Task Performance",
        icon: CheckCircle2,
    },
    {
        id: "pesticide" as ReportSection,
        label: "Pesticide & Compliance",
        icon: AlertTriangle,
    },
];

// Season options
export const SEASON_OPTIONS = [
    { value: "spring-2025", label: "Spring 2025" },
    { value: "winter-2024", label: "Winter 2024" },
    { value: "fall-2024", label: "Fall 2024" },
    { value: "summer-2024", label: "Summer 2024" },
];

// Yield view mode options
export const YIELD_VIEW_OPTIONS = [
    { value: "season", label: "By Season" },
    { value: "crop", label: "By Crop" },
    { value: "plot", label: "By Plot" },
];

// Filter options
export const PLOT_OPTIONS = [
    { value: "plot-a", label: "Plot A - North Field" },
    { value: "plot-b", label: "Plot B - South Field" },
    { value: "plot-c", label: "Plot C - East Field" },
    { value: "plot-d", label: "Plot D - West Field" },
];

export const CROP_TYPE_OPTIONS = [
    { value: "all", label: "All Crops" },
    { value: "rice", label: "Rice" },
    { value: "corn", label: "Corn" },
    { value: "wheat", label: "Wheat" },
    { value: "soybean", label: "Soybean" },
];

export const TIME_RANGE_OPTIONS = [
    { value: "last-month", label: "Last Month" },
    { value: "last-3-months", label: "Last 3 Months" },
    { value: "last-6-months", label: "Last 6 Months" },
    { value: "last-year", label: "Last Year" },
    { value: "custom", label: "Custom Range" },
];

// Default filter values
export const DEFAULT_FILTERS = {
    plots: [] as string[],
    cropType: "all",
    season: "all",
    timeRange: "last-6-months",
    includeClosedSeasons: false,
};



