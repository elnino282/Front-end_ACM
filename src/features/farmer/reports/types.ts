export type ReportSection = "yield" | "cost" | "performance" | "pesticide";

export type YieldViewMode = "season" | "crop" | "plot";

export type ExportFormat = "excel" | "pdf" | "csv";

export type PesticideStatus = "safe" | "approaching" | "violated";

export interface PesticideRecord {
    id: string;
    lotId: string;
    chemical: string;
    quantity: number;
    phi: number;
    daysRemaining: number;
    status: PesticideStatus;
}

export interface YieldBySeason {
    season: string;
    yield: number;
    avgYield: number;
}

export interface YieldByCrop {
    crop: string;
    yield: number;
    target: number;
}

export interface YieldByPlot {
    plot: string;
    yield: number;
    area: number;
}

export interface CostDistribution {
    name: string;
    value: number;
    color: string;
    percentage: number;
}

export interface MonthlyCost {
    month: string;
    seeds: number;
    fertilizer: number;
    labor: number;
    fuel: number;
    machinery: number;
}

export interface TaskPerformance {
    month: string;
    onTime: number;
    late: number;
    overdue: number;
}

export interface FilterState {
    plots: string[];
    cropType: string;
    season: string;
    timeRange: string;
    includeClosedSeasons: boolean;
}

export interface SidebarItem {
    id: ReportSection;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}



