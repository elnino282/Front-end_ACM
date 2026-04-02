export type SeasonStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'ARCHIVED';

export interface Season {
  id: string;
  name: string;
  crop: string;
  variety: string;
  cropId?: number;
  varietyId?: number | null;
  plotId?: number;
  plotName?: string | null;
  farmName?: string | null;
  linkedPlots: number;
  startDate: string;
  plannedHarvestDate?: string | null;
  endDate?: string | null;
  initialPlantCount?: number | null;
  currentPlantCount?: number | null;
  expectedYieldKg?: number | null;
  actualYieldKg?: number | null;
  notes?: string | null;
  yieldPerHa: number | null;
  budgetTotal: number;
  actualCost: number;
  status: SeasonStatus;
  onTimePercentage: number;
  tasksTotal: number;
  tasksCompleted: number;
  incidentCount: number;
  documentCount: number;
}

export interface Activity {
  id: string;
  action: string;
  user: string;
  time: string;
  type: 'task' | 'expense' | 'incident' | 'season';
}

export interface FilterState {
  crop: string;
  status: SeasonStatus | 'all';
  year: string;
}



