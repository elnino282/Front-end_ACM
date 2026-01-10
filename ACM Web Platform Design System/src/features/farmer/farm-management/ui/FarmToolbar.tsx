import { Building2, Plus, Search } from "lucide-react";
import {
    Button,
    Input,
    Card,
    CardContent,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui";

interface FarmToolbarProps {
    // Search
    searchQuery: string;
    setSearchQuery: (query: string) => void;

    // Filters
    activeFilter: boolean | null;
    setActiveFilter: (value: boolean | null) => void;

    // Actions
    onCreateFarm: () => void;

    // Counts
    filteredCount: number;
    totalCount: number;
    selectedCount?: number;

    // Handlers
    onClearFilters: () => void;
}

/**
 * FarmToolbar Component
 * 
 * Unified toolbar that combines header, search, filters, and actions.
 * Provides a clean, scannable interface for farm management.
 */
export function FarmToolbar({
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    onCreateFarm,
    onClearFilters,
}: FarmToolbarProps) {
    const hasActiveFilters = searchQuery || activeFilter !== null;

    return (
        <div className="space-y-4">
            <Card className="border border-border rounded-xl shadow-sm">
                <CardContent className="px-6 py-4">
                    {/* Header Row: Title + Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* Title Section */}
                        <div className="flex-shrink-0">
                            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2 leading-tight">
                                <Building2 className="w-6 h-6 text-emerald-600" />
                                Farms
                            </h1>
                            <p className="text-sm text-slate-600 mt-1">
                                Manage your farm properties
                            </p>
                        </div>

                        {/* Primary Action */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <Button
                                onClick={onCreateFarm}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                size="sm"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create Farm
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border border-border rounded-xl shadow-sm">
                <CardContent className="px-6 py-4">
                    <div className="flex flex-wrap items-center justify-start gap-4">
                        {/* Search Bar */}
                        <div className="relative w-[320px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search farms..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 rounded-xl border-border focus:border-primary"
                            />
                        </div>

                        <Select
                            value={activeFilter === null ? "all" : activeFilter ? "active" : "inactive"}
                            onValueChange={(value) => {
                                if (value === "all") {
                                    setActiveFilter(null);
                                } else if (value === "active") {
                                    setActiveFilter(true);
                                } else {
                                    setActiveFilter(false);
                                }
                            }}
                        >
                            <SelectTrigger className="rounded-xl border-border w-[180px]">
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Farms</SelectItem>
                                <SelectItem value="active">Active Only</SelectItem>
                                <SelectItem value="inactive">Inactive Only</SelectItem>
                            </SelectContent>
                        </Select>

                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClearFilters}
                                className="h-9 px-3 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                            >
                                Clear All
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
