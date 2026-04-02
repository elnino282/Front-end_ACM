import type { Plot as ApiPlot } from "@/entities/plot";
import type { Plot, PlotStatus } from "./types";

// ═══════════════════════════════════════════════════════════════
// PLOT STATUS MAPPING
// ═══════════════════════════════════════════════════════════════

/**
 * Map backend status string to PlotStatus type
 * Handles both English and Vietnamese status names
 */
export const mapStatusToPlotStatus = (status?: string): PlotStatus => {
  if (!status) return "planned";
  const normalized = status.toLowerCase();
  if (normalized === "active" || normalized === "đang hoạt động") return "active";
  if (normalized === "dormant" || normalized === "ngủ đông") return "dormant";
  if (normalized === "at-risk" || normalized === "rủi ro") return "at-risk";
  return "planned";
};

/**
 * Map PlotStatus to backend statusId
 */
export const mapPlotStatusToId = (status: PlotStatus): number => {
  const statusIdMap: Record<PlotStatus, number> = {
    active: 1,
    dormant: 2,
    planned: 3,
    "at-risk": 4,
  };
  return statusIdMap[status];
};

// ═══════════════════════════════════════════════════════════════
// API TRANSFORMERS
// ═══════════════════════════════════════════════════════════════

/**
 * Transform API plot response to feature-local Plot type
 * Backend returns soilType and status as strings
 */
export const transformApiToFeature = (apiPlot: ApiPlot): Plot => ({
  id: String(apiPlot.id),
  name: apiPlot.plotName,
  area: apiPlot.area ?? 0,
  soilType: apiPlot.soilType ?? "Unknown",
  pH: 7.0, // Default - would come from soil data API
  status: mapStatusToPlotStatus(apiPlot.status),
  createdDate: apiPlot.createdAt?.split('T')[0] ?? new Date().toISOString().split('T')[0],
  seasons: [],
});

// ═══════════════════════════════════════════════════════════════
// MAP VISUALIZATION
// ═══════════════════════════════════════════════════════════════

/**
 * Get polygon border color based on plot status
 */
export function getPolygonColor(status: PlotStatus): string {
  switch (status) {
    case "active":
      return "var(--primary)";
    case "dormant":
      return "var(--accent)";
    case "planned":
      return "var(--secondary)";
    case "at-risk":
      return "var(--destructive)";
  }
}



