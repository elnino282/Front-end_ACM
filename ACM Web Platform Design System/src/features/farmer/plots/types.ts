/**
 * View mode options for plot display
 */
export type ViewMode = "list" | "map";

/**
 * Plot status options
 */
export type PlotStatus = "active" | "dormant" | "planned" | "at-risk";

/**
 * Sortable column names
 */
export type SortColumn = "name" | "area" | "pH" | "status";

/**
 * Sort direction
 */
export type SortDirection = "asc" | "desc";

/**
 * Sort state interface
 */
export interface SortState {
  column: SortColumn | null;
  direction: SortDirection;
}

/**
 * Plot interface with all required properties
 */
export interface Plot {
  id: string;
  name: string;
  area: number;
  soilType: string;
  pH: number;
  status: PlotStatus;
  crop?: string;
  cropVariety?: string;
  coordinates?: { lat: number; lng: number }[];
  createdDate: string;
  organicMatter?: number;
  electricalConductivity?: number;
  soilTestDate?: string;
  seasons?: LinkedSeason[];
}

/**
 * Linked season information for a plot
 */
export interface LinkedSeason {
  id: string;
  name: string;
  crop: string;
  status: string;
  startDate: string;
  endDate?: string;
}




