export type HarvestStatus = "stored" | "sold" | "processing";
export type HarvestGrade = "A" | "B" | "C" | "Premium";

export interface QCMetrics {
    purity: number;
    foreignMatter: number;
    brokenGrains: number;
}

export interface HarvestBatch {
    id: string;
    batchId: string;
    date: string;
    createdAt?: string | null;
    quantity: number;
    grade: HarvestGrade;
    moisture: number;
    linkedSale?: string;
    status: HarvestStatus;
    season: string;
    plot: string;
    crop: string;
    notes?: string;
    qcMetrics?: QCMetrics;
    photo?: string;
}

export interface HarvestFormData {
    batchId: string;
    date: string;
    quantity: string;
    grade: HarvestGrade;
    moisture: string;
    season: string;
    plot: string;
    crop: string;
    status: HarvestStatus;
    notes: string;
    purity: string;
    foreignMatter: string;
    brokenGrains: string;
}

export interface ChartDataPoint {
    date?: string;
    name?: string;
    quantity?: number;
    value?: number;
    color?: string;
}

export interface SummaryStats {
    totalStored: number;
    totalSold: number;
    totalProcessing: number;
    premiumGradePercentage: number;
}



