import type {
    AITip,
    Payable,
    CategoryData,
    MonthlyTrendData,
    CategoryComparisonData,
} from "./types";

// Note: INITIAL_EXPENSES, AI_TIPS, UPCOMING_PAYABLES, CATEGORY_DATA, 
// MONTHLY_TREND, CATEGORY_COMPARISON removed - now using entity API hooks

// Budget Configuration
export const BUDGET_CONFIG = {
    totalBudget: 50000,
    warningThreshold: 75,
    dangerThreshold: 90,
};

// Category Colors
export const CATEGORY_COLORS: Record<string, string> = {
    Fertilizer: "var(--primary)",
    Seeds: "var(--secondary)",
    Equipment: "var(--accent)",
    Pesticide: "var(--chart-4)",
    Labor: "var(--muted-foreground)",
    Transportation: "var(--primary)",
    Utilities: "var(--secondary)",
    Maintenance: "var(--chart-5)",
    Other: "var(--muted-foreground)",
};

// Select Options
export const SEASON_OPTIONS = [
    { value: "all", label: "All Seasons" },
    { value: "Rice Season 2025", label: "Rice Season 2025" },
    { value: "Corn Season 2025", label: "Corn Season 2025" },
    { value: "Wheat Season 2025", label: "Wheat Season 2025" },
];

export const CATEGORY_OPTIONS = [
    { value: "all", label: "All Categories" },
    { value: "Fertilizer", label: "Fertilizer" },
    { value: "Seeds", label: "Seeds" },
    { value: "Labor", label: "Labor" },
    { value: "Equipment", label: "Equipment" },
    { value: "Pesticide", label: "Pesticide" },
    { value: "Transportation", label: "Transportation" },
    { value: "Utilities", label: "Utilities" },
    { value: "Maintenance", label: "Maintenance" },
    { value: "Other", label: "Other" },
];

export const STATUS_OPTIONS = [
    { value: "all", label: "All Status" },
    { value: "paid", label: "Paid" },
    { value: "unpaid", label: "Unpaid" },
    { value: "pending", label: "Pending" },
    { value: "recorded", label: "Recorded" },
];



