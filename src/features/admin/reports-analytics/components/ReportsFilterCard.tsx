import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ReportFilters {
  dateFrom: string;
  dateTo: string;
  farmId: string;
  plotId: string;
  cropId: string;
  varietyId: string;
}

interface FilterOption {
  value: string;
  label: string;
}

interface ReportsFilterCardProps {
  filters: ReportFilters;
  onFiltersChange: (filters: ReportFilters) => void;
  onApply: () => void;
  onReset: () => void;
  farms?: FilterOption[];
  plots?: FilterOption[];
  crops?: FilterOption[];
  varieties?: FilterOption[];
  isPlotDisabled?: boolean;
  isVarietyDisabled?: boolean;
  hasPendingChanges?: boolean;
}

export const ReportsFilterCard: React.FC<ReportsFilterCardProps> = ({
  filters,
  onFiltersChange,
  onApply,
  onReset,
  farms = [],
  plots = [],
  crops = [],
  varieties = [],
  isPlotDisabled = false,
  isVarietyDisabled = false,
  hasPendingChanges = false,
}) => {
  const handleChange = (key: keyof ReportFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Card className="!rounded-[18px] border-border bg-card shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-end gap-4 flex-wrap">
          {/* Date Range - Inline */}
          <div className="flex items-center gap-1.5 h-9 px-3 rounded-[14px] border border-border bg-card min-w-[260px]">
            <svg
              className="w-4 h-4 text-muted-foreground flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <Input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleChange("dateFrom", e.target.value)}
              className="h-7 border-0 bg-transparent text-sm p-0 focus-visible:ring-0 w-[110px] text-foreground"
            />
            <span className="text-muted-foreground text-sm">to</span>
            <Input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleChange("dateTo", e.target.value)}
              className="h-7 border-0 bg-transparent text-sm p-0 focus-visible:ring-0 w-[110px] text-foreground"
            />
          </div>

          {/* Farm Select */}
          <div className="flex flex-col gap-1.5 min-w-[140px]">
            <Select
              value={filters.farmId}
              onValueChange={(value) => handleChange("farmId", value)}
            >
              <SelectTrigger className="h-9 rounded-[14px] border-border bg-card text-foreground text-sm">
                <SelectValue placeholder="All farms" />
              </SelectTrigger>
              <SelectContent className="rounded-[14px]">
                <SelectItem value="all">All farms</SelectItem>
                {farms.map((farm) => (
                  <SelectItem key={farm.value} value={farm.value}>
                    {farm.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Plot Select */}
          <div className="flex flex-col gap-1.5 min-w-[120px]">
            <Select
              value={filters.plotId}
              onValueChange={(value) => handleChange("plotId", value)}
              disabled={isPlotDisabled}
            >
              <SelectTrigger
                className={`h-9 rounded-[14px] border-border bg-card text-foreground text-sm ${isPlotDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <SelectValue placeholder="All plots" />
              </SelectTrigger>
              <SelectContent className="rounded-[14px]">
                <SelectItem value="all">All plots</SelectItem>
                {plots.map((plot) => (
                  <SelectItem key={plot.value} value={plot.value}>
                    {plot.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Crop Select */}
          <div className="flex flex-col gap-1.5 min-w-[120px]">
            <Select
              value={filters.cropId}
              onValueChange={(value) => handleChange("cropId", value)}
            >
              <SelectTrigger className="h-9 rounded-[14px] border-border bg-card text-foreground text-sm">
                <SelectValue placeholder="All crops" />
              </SelectTrigger>
              <SelectContent className="rounded-[14px]">
                <SelectItem value="all">All crops</SelectItem>
                {crops.map((crop) => (
                  <SelectItem key={crop.value} value={crop.value}>
                    {crop.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Variety Select */}
          <div className="flex flex-col gap-1.5 min-w-[140px]">
            <Select
              value={filters.varietyId}
              onValueChange={(value) => handleChange("varietyId", value)}
              disabled={isVarietyDisabled}
            >
              <SelectTrigger
                className={`h-9 rounded-[14px] border-border bg-card text-foreground text-sm ${isVarietyDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <SelectValue placeholder="All varieties" />
              </SelectTrigger>
              <SelectContent className="rounded-[14px]">
                <SelectItem value="all">All varieties</SelectItem>
                {varieties.map((variety) => (
                  <SelectItem key={variety.value} value={variety.value}>
                    {variety.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 ml-auto">
            {hasPendingChanges && (
              <span className="text-xs text-warning bg-warning/10 border border-warning/30 px-2 py-0.5 rounded-full">
                Unsaved changes
              </span>
            )}
            <button
              onClick={onReset}
              className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors"
            >
              Reset
            </button>
            <Button
              size="sm"
              onClick={onApply}
              className="h-9 px-4 rounded-[14px] bg-[#3ba55d] hover:bg-[#2e8b4a] text-white font-medium text-sm"
            >
              Apply
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
