import type { HarvestBatch, ChartDataPoint } from "./types";

// Note: MOCK_HARVEST_BATCHES removed - now using entity API hooks

export const DAILY_TREND_DATA: ChartDataPoint[] = [
    { date: "Nov 4", quantity: 3900 },
    { date: "Nov 5", quantity: 2800 },
    { date: "Nov 6", quantity: 4200 },
    { date: "Nov 7", quantity: 3500 },
    { date: "Nov 8", quantity: 5000 },
];

export const GRADE_DISTRIBUTION_COLORS: Record<string, string> = {
    Premium: "var(--primary)",
    "Grade A": "var(--secondary)",
    "Grade B": "var(--accent)",
    "Grade C": "var(--muted-foreground)",
};

export const GRADE_POINTS_MAP: Record<string, number> = {
    Premium: 4,
    A: 3,
    B: 2,
    C: 1,
};

export const PLANNED_YIELD = 25000;

export const SEASON_OPTIONS = [
    { value: "all", label: "All Seasons" },
    { value: "Rice Season 2025", label: "Rice Season 2025" },
    { value: "Corn Season 2025", label: "Corn Season 2025" },
    { value: "Wheat Season 2025", label: "Wheat Season 2025" },
];

export const STATUS_OPTIONS = [
    { value: "stored", label: "Stored" },
    { value: "processing", label: "Processing" },
    { value: "sold", label: "Sold" },
];

export const GRADE_OPTIONS = [
    { value: "Premium", label: "Premium" },
    { value: "A", label: "Grade A" },
    { value: "B", label: "Grade B" },
    { value: "C", label: "Grade C" },
];



