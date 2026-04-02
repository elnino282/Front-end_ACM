import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PlotFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterCrop: string;
  setFilterCrop: (crop: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterSoilType: string;
  setFilterSoilType: (type: string) => void;
  filteredCount: number;
  totalCount: number;
  onClearFilters: () => void;
  // Dynamic filter options from API
  cropOptions: Array<{ value: string; label: string }>;
  soilTypeOptions: Array<{ value: string; label: string }>;
  statusOptions: Array<{ value: string; label: string }>;
  isLoadingFilterOptions?: boolean;
}

/**
 * PlotFilters Component
 *
 * Displays search and filter controls for plots.
 */
export function PlotFilters({
  searchQuery,
  setSearchQuery,
  filterCrop,
  setFilterCrop,
  filterStatus,
  setFilterStatus,
  filterSoilType,
  setFilterSoilType,
  filteredCount,
  totalCount,
  onClearFilters,
  cropOptions,
  soilTypeOptions,
  statusOptions,
  isLoadingFilterOptions = false,
}: PlotFiltersProps) {
  const hasActiveFilters =
    searchQuery || filterCrop !== "all" || filterStatus !== "all" || filterSoilType !== "all";

  return (
    <Card className="border border-gray-200 shadow-md">
      <CardContent className="pt-6 pb-6">
        <div className="flex flex-wrap items-center justify-start gap-4">
          {/* Search */}
          <div className="relative w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search plots by name or ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 pl-10 border-border focus:border-primary"
            />
          </div>

          {/* Crop Filter */}
          <Select value={filterCrop} onValueChange={setFilterCrop} disabled={isLoadingFilterOptions}>
            <SelectTrigger className="border-border focus:border-primary w-[180px]">
              <SelectValue placeholder="Crop" />
            </SelectTrigger>
            <SelectContent>
              {cropOptions.map((crop) => (
                <SelectItem key={crop.value} value={crop.value}>
                  {crop.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={filterStatus} onValueChange={setFilterStatus} disabled={isLoadingFilterOptions}>
            <SelectTrigger className="border-border focus:border-primary w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Soil Type Filter */}
          <Select value={filterSoilType} onValueChange={setFilterSoilType} disabled={isLoadingFilterOptions}>
            <SelectTrigger className="border-border focus:border-primary w-[180px]">
              <SelectValue placeholder="Soil Type" />
            </SelectTrigger>
            <SelectContent>
              {soilTypeOptions.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing {filteredCount} of {totalCount} plots
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-primary hover:bg-primary/10"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}




