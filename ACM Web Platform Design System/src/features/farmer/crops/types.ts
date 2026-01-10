export type ViewMode = 'list' | 'timeline' | 'tasks' | 'seedlog' | 'phiwarning';

export interface PHIAlert {
    lastPesticideUse: string;
    pesticideName: string;
    requiredPHI: number;
    earliestSafeHarvest: string;
    daysRemaining: number;
}

export interface Crop {
    id: string;
    cropType: string;
    variety: string;
    plot: string;
    season: string;
    sowingDate: string;
    expectedHarvest: string;
    currentStage: string;
    daysAfterSowing: number;
    phiAlert?: PHIAlert;
    seedSource?: string;
    seedLot?: string;
    sowingDensity?: string;
    notes?: string;
}

export interface GrowthStage {
    id: string;
    name: string;
    icon: any;
    startDate: string;
    endDate: string;
    duration: number;
    color: string;
    recommendedActions: string[];
}

export interface Task {
    id: string;
    stage: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
}

export interface SeedUsage {
    id: string;
    date: string;
    seedType: string;
    batch: string;
    quantity: string;
    cost: string;
    notes: string;
}

export interface WeatherForecast {
    day: string;
    temp: string;
    condition: string;
    icon: any;
    rain: string;
}

export interface CropFormData {
    cropType: string;
    variety: string;
    plot: string;
    season: string;
    seedSource: string;
    seedLot: string;
    sowingDate: string;
    sowingDensity: string;
    notes: string;
}

export interface FilterState {
    plotFilter: string;
    seasonFilter: string;
    cropTypeFilter: string;
    varietyFilter: string;
    searchQuery: string;
}




