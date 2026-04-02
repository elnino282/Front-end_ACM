import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDocumentsMeta } from "@/entities/document";
import { Search, X } from "lucide-react";
import type {
  DocumentFiltersState,
  DocumentSortOption,
} from "../hooks/useDocumentFilters";

// Type chip options
const TYPE_CHIPS = [
  { value: "", label: "All" },
  { value: "GUIDE", label: "Guides" },
  { value: "TEMPLATE", label: "Templates" },
  { value: "ANNOUNCEMENT", label: "Announcements" },
  { value: "SYSTEM_HELP", label: "System Help" },
] as const;

// Sort options
const SORT_OPTIONS = [
  { value: "NEWEST", label: "Newest" },
  { value: "MOST_VIEWED", label: "Most viewed" },
  { value: "RECOMMENDED", label: "Recommended" },
] as const;

// Fallback options if meta is not loaded
const DEFAULT_STAGES = ["Planting", "Growing", "Harvest", "Post-Harvest"];
const DEFAULT_TOPICS = [
  "Best Practices",
  "Pest Management",
  "Water Management",
  "Soil Management",
  "Farm Planning",
  "Climate Adaptation",
];

interface DocumentFilterBarProps {
  filters: DocumentFiltersState;
  onFilterChange: <K extends keyof DocumentFiltersState>(
    key: K,
    value: DocumentFiltersState[K],
  ) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function DocumentFilterBar({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
}: DocumentFilterBarProps) {
  const { data: meta } = useDocumentsMeta();

  const stages = meta?.stages?.length ? meta.stages : DEFAULT_STAGES;
  const topics = meta?.topics?.length ? meta.topics : DEFAULT_TOPICS;
  const crops = meta?.crops ?? [];

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-card rounded-xl border border-border">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px] max-w-[320px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search documents..."
          value={filters.q}
          onChange={(e) => onFilterChange("q", e.target.value)}
          className="pl-10 rounded-lg border-border focus:border-primary"
        />
      </div>

      {/* Type Chips */}
      <div className="flex items-center gap-1 flex-wrap">
        {TYPE_CHIPS.map((chip) => (
          <Button
            key={chip.value}
            variant={
              filters.type === chip.value ||
              (!filters.type && chip.value === "")
                ? "default"
                : "outline"
            }
            size="sm"
            onClick={() => onFilterChange("type", chip.value || undefined)}
            className={`rounded-full px-3 text-xs font-medium transition-all ${
              filters.type === chip.value ||
              (!filters.type && chip.value === "")
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-background hover:bg-muted"
            }`}
          >
            {chip.label}
          </Button>
        ))}
      </div>

      {/* Crop Dropdown */}
      <Select
        value={filters.cropId || "all"}
        onValueChange={(value) =>
          onFilterChange("cropId", value === "all" ? undefined : value)
        }
      >
        <SelectTrigger className="w-[140px] rounded-lg border-border">
          <SelectValue placeholder="All crops" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All crops</SelectItem>
          {crops.map((crop) => (
            <SelectItem key={crop.id} value={String(crop.id)}>
              {crop.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Stage Dropdown */}
      <Select
        value={filters.stage || "all"}
        onValueChange={(value) =>
          onFilterChange("stage", value === "all" ? undefined : value)
        }
      >
        <SelectTrigger className="w-[130px] rounded-lg border-border">
          <SelectValue placeholder="All stages" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All stages</SelectItem>
          {stages.map((stage) => (
            <SelectItem key={stage} value={stage}>
              {stage}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Topic Dropdown */}
      <Select
        value={filters.topic || "all"}
        onValueChange={(value) =>
          onFilterChange("topic", value === "all" ? undefined : value)
        }
      >
        <SelectTrigger className="w-[150px] rounded-lg border-border">
          <SelectValue placeholder="All topics" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All topics</SelectItem>
          {topics.map((topic) => (
            <SelectItem key={topic} value={topic}>
              {topic}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort Dropdown */}
      <Select
        value={filters.sort}
        onValueChange={(value) =>
          onFilterChange("sort", value as DocumentSortOption)
        }
      >
        <SelectTrigger className="w-[140px] rounded-lg border-border">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-muted-foreground hover:text-foreground gap-1"
        >
          <X className="w-3 h-3" />
          Clear filters
        </Button>
      )}
    </div>
  );
}
