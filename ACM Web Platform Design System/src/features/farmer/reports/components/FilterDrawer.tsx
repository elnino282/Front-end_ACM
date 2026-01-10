import { Filter } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { FilterState } from "../types";
import {
    PLOT_OPTIONS,
    CROP_TYPE_OPTIONS,
    SEASON_OPTIONS,
    TIME_RANGE_OPTIONS,
} from "../constants";

interface FilterDrawerProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    filters: FilterState;
    onFiltersChange: (filters: FilterState) => void;
    onApplyFilters: () => void;
    onClearFilters: () => void;
}

export function FilterDrawer({
    isOpen,
    onOpenChange,
    filters,
    onFiltersChange,
    onApplyFilters,
    onClearFilters,
}: FilterDrawerProps) {
    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="w-[320px] sm:max-w-[320px] overflow-y-auto border-l-2 border-primary/20"
            >
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2 text-foreground">
                        <Filter className="w-5 h-5 text-primary" />
                        Filter Reports
                    </SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="plot-filter" className="text-foreground">
                            Plot Selector
                        </Label>
                        <Select>
                            <SelectTrigger
                                id="plot-filter"
                                className="rounded-xl border-border"
                            >
                                <SelectValue placeholder="Select plots" />
                            </SelectTrigger>
                            <SelectContent>
                                {PLOT_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="crop-filter" className="text-foreground">
                            Crop Type
                        </Label>
                        <Select
                            value={filters.cropType}
                            onValueChange={(value: string) =>
                                onFiltersChange({ ...filters, cropType: value })
                            }
                        >
                            <SelectTrigger
                                id="crop-filter"
                                className="rounded-xl border-border"
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {CROP_TYPE_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="season-filter" className="text-foreground">
                            Season
                        </Label>
                        <Select
                            value={filters.season}
                            onValueChange={(value: string) =>
                                onFiltersChange({ ...filters, season: value })
                            }
                        >
                            <SelectTrigger
                                id="season-filter"
                                className="rounded-xl border-border"
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Seasons</SelectItem>
                                {SEASON_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="time-filter" className="text-foreground">
                            Time Range
                        </Label>
                        <Select
                            value={filters.timeRange}
                            onValueChange={(value: string) =>
                                onFiltersChange({ ...filters, timeRange: value })
                            }
                        >
                            <SelectTrigger
                                id="time-filter"
                                className="rounded-xl border-border"
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {TIME_RANGE_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center justify-between">
                        <Label htmlFor="closed-seasons" className="text-foreground">
                            Include Closed Seasons
                        </Label>
                        <Switch
                            id="closed-seasons"
                            checked={filters.includeClosedSeasons}
                            onCheckedChange={(checked: boolean) =>
                                onFiltersChange({ ...filters, includeClosedSeasons: checked })
                            }
                        />
                    </div>
                </div>

                <div className="mt-8 flex gap-3">
                    <Button
                        variant="outline"
                        className="flex-1 rounded-xl border-border"
                        onClick={onClearFilters}
                    >
                        Clear
                    </Button>
                    <Button
                        className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl"
                        onClick={onApplyFilters}
                    >
                        Apply
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}



