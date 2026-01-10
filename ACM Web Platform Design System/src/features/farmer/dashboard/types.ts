/**
 * Task status options
 */
export type TaskStatus = "not-started" | "in-progress" | "completed";

/**
 * Plot health status indicators
 */
export type PlotHealth = "healthy" | "warning" | "critical";

/**
 * Incident severity levels
 */
export type IncidentSeverity = "high" | "medium" | "low";

/**
 * Activity type classification
 */
export type ActivityType = "task" | "expense" | "incident" | "season";

/**
 * Task item with assignment and status tracking
 */
export interface Task {
  id: string;
  title: string;
  plot: string;
  type: string;
  assignee: string;
  due: string;
  status: TaskStatus;
  checked: boolean;
}

/**
 * Plot information with crop and health status
 */
export interface Plot {
  id: string;
  name: string;
  crop: string;
  stage: string;
  health: PlotHealth;
  area: number;
}

/**
 * Inventory item with stock levels
 */
export interface InventoryItem {
  id: string;
  name: string;
  current: number;
  minimum: number;
  unit: string;
}

/**
 * Incident report with severity and location
 */
export interface Incident {
  id: string;
  title: string;
  severity: IncidentSeverity;
  plot: string;
  time: string;
}

/**
 * Activity log entry
 */
export interface Activity {
  id: string;
  action: string;
  user: string;
  time: string;
  type: ActivityType;
}

/**
 * Upcoming task data point for timeline visualization
 */
export interface UpcomingTaskDay {
  day: string;
  count: number;
  overdue: number;
}




