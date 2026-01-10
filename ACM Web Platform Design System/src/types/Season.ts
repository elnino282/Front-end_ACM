export type SeasonStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'ARCHIVED';

export interface Season {
  id: number;
  seasonName: string;
  plotId: number;
  plotName?: string;
  cropId: number;
  cropName?: string;
  varietyId?: number;
  varietyName?: string;
  startDate: string;
  plannedHarvestDate?: string;
  endDate?: string;
  status: SeasonStatus;
  initialPlantCount: number;
  currentPlantCount?: number;
  expectedYieldKg?: number;
  actualYieldKg?: number;
  notes?: string;
  pendingTaskCount?: number;
  inProgressTaskCount?: number;
}

export interface SeasonDetail extends Season {
  farmId?: number;
  farmName?: string;
}

export interface CreateSeasonRequest {
  plotId: number;
  cropId: number;
  varietyId?: number;
  seasonName: string;
  startDate: string;
  plannedHarvestDate?: string;
  endDate: string;  // BR102: Made mandatory
  initialPlantCount: number;
  expectedYieldKg?: number;
  notes?: string;
  description?: string;  // BR102: Added description field
}

export interface CompleteSeasonRequest {
  endDate: string;
  actualYieldKg?: number;
  forceComplete?: boolean;
}

export interface CancelSeasonRequest {
  forceCancel?: boolean;
  reason?: string;
}

export interface SeasonSearchParams {
  plotId?: number;
  farmId?: number;
  cropId?: number;
  status?: SeasonStatus;
  from?: string;
  to?: string;
  q?: string;
  page?: number;
  size?: number;
}
