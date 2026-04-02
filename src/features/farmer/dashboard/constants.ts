import { Task, Plot, InventoryItem, Incident, Activity, UpcomingTaskDay } from "./types";

// Note: MOCK_INVENTORY removed - now using entity API hooks

export const DEFAULT_SEASON = "1"; // Default ID

export const HEALTH_COLORS = {
  healthy: "bg-primary/10 text-primary",
  warning: "bg-accent/10 text-accent",
  critical: "bg-destructive/10 text-destructive",
  default: "bg-muted/50 text-muted-foreground",
};

export const SEVERITY_STYLES = {
  high: "border-destructive/20 bg-destructive/10",
  medium: "border-accent/20 bg-accent/10",
  low: "border-secondary/20 bg-secondary/10",
  default: "border-border bg-muted/50",
};

export const SEVERITY_ICON_COLORS = {
  high: "text-destructive",
  medium: "text-accent",
  low: "text-secondary",
  default: "text-muted-foreground",
};

export const ACTIVITY_ICON_COLORS = {
  task: "text-secondary",
  expense: "text-primary",
  incident: "text-destructive",
  season: "text-accent",
  default: "text-muted-foreground",
};

export const STATUS_BADGE_STYLES = {
  "not-started": "bg-muted/50 text-muted-foreground hover:bg-muted",
  "in-progress": "bg-accent/10 text-accent hover:bg-muted",
  completed: "bg-primary/10 text-primary hover:bg-muted",
};

export const STATUS_BADGE_LABELS = {
  "not-started": "Not Started",
  "in-progress": "In Progress",
  completed: "Completed",
};



