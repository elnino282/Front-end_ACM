import { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Sprout } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { PlotStatusChip } from "./PlotStatusChip";
import { PlotActionsMenu } from "./PlotActionsMenu";
import { PlotBulkActionBar } from "./PlotBulkActionBar";
import type { Plot, PlotStatus } from "../types";

type SortColumn = "name" | "area" | "pH" | "status" | null;
type SortDirection = "asc" | "desc";

interface PlotListViewProps {
    plots: Plot[];
    selectedPlots: string[];
    onToggleSelection: (id: string) => void;
    onToggleAllSelection: () => void;
    onViewDetails: (plot: Plot) => void;
    onDelete: (id: string) => void;
    onBulkDelete: () => void;
    onBulkStatusChange: (status: PlotStatus) => void;
    onClearSelection: () => void;
    onClearFilters: () => void;
}

/**
 * PlotListView Component
 * 
 * Main table view for plot management with:
 * - Sortable columns
 * - Bulk selection and actions
 * - Responsive design (table on desktop, cards on mobile)
 * - Sticky header
 * - Row hover effects
 */
export function PlotListView({
    plots,
    selectedPlots,
    onToggleSelection,
    onToggleAllSelection,
    onViewDetails,
    onDelete,
    onBulkDelete,
    onBulkStatusChange,
    onClearSelection,
    onClearFilters,
}: PlotListViewProps) {
    const [sortColumn, setSortColumn] = useState<SortColumn>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

    // Tri-state checkbox state
    const isAllSelected = plots.length > 0 && selectedPlots.length === plots.length;
    const isSomeSelected = selectedPlots.length > 0 && selectedPlots.length < plots.length;

    // Sorting logic
    const sortedPlots = useMemo(() => {
        if (!sortColumn) return plots;

        return [...plots].sort((a, b) => {
            let aValue: string | number = "";
            let bValue: string | number = "";

            switch (sortColumn) {
                case "name":
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case "area":
                    aValue = a.area;
                    bValue = b.area;
                    break;
                case "pH":
                    aValue = a.pH;
                    bValue = b.pH;
                    break;
                case "status":
                    aValue = a.status;
                    bValue = b.status;
                    break;
            }

            if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
            if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });
    }, [plots, sortColumn, sortDirection]);

    // Handle column sort
    const handleSort = (column: SortColumn) => {
        if (sortColumn === column) {
            // Toggle direction if same column
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            // New column, default to ascending
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    // Render sort icon
    const renderSortIcon = (column: SortColumn) => {
        if (sortColumn !== column) {
            return <ArrowUpDown className="w-4 h-4 ml-1 opacity-40 group-hover:opacity-60 transition-opacity" />;
        }
        return sortDirection === "asc" ? (
            <ArrowUp className="w-4 h-4 ml-1 text-blue-600" />
        ) : (
            <ArrowDown className="w-4 h-4 ml-1 text-blue-600" />
        );
    };


    return (
        <>
            {/* Desktop Table View (hidden on mobile) */}
            <div className="hidden md:block bg-card rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full table-fixed">
                        {/* Define column widths: Checkbox(12px), Plot Name(20%), Crop(22%), Area(12%), pH(10%), Soil Type(14%), Status(14%), Actions(12px) */}
                        <colgroup>
                            <col className="w-12" />
                            <col className="w-[20%]" />
                            <col className="w-[22%]" />
                            <col className="w-[12%]" />
                            <col className="w-[10%]" />
                            <col className="w-[14%]" />
                            <col className="w-[14%]" />
                            <col className="w-12" />
                        </colgroup>

                        {/* Table Header - Sticky */}
                        <thead className="bg-gray-50 border-b-2 border-gray-200 sticky top-0 z-10">
                            <tr>
                                {/* Checkbox Column */}
                                <th className="px-4 py-3">
                                    <div className="flex items-center justify-center">
                                        <Checkbox
                                            checked={isAllSelected ? true : isSomeSelected ? "indeterminate" : false}
                                            onCheckedChange={onToggleAllSelection}
                                            className="border-gray-400"
                                        />
                                    </div>
                                </th>

                                {/* Plot Name - Sortable */}
                                <th className="px-4 py-3 text-left">
                                    <button
                                        onClick={() => handleSort("name")}
                                        className="group flex items-center text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors uppercase tracking-wider"
                                    >
                                        Plot Name
                                        {renderSortIcon("name")}
                                    </button>
                                </th>

                                {/* Crop */}
                                <th className="px-4 py-3 text-left">
                                    <span className="text-xs font-medium text-slate-600 uppercase tracking-wider">Crop</span>
                                </th>

                                {/* Area - Sortable, Right-aligned */}
                                <th className="px-4 py-3 text-right">
                                    <button
                                        onClick={() => handleSort("area")}
                                        className="group flex items-center justify-end text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors ml-auto uppercase tracking-wider"
                                    >
                                        Area (ha)
                                        {renderSortIcon("area")}
                                    </button>
                                </th>

                                {/* pH - Sortable, Center-aligned */}
                                <th className="px-4 py-3 text-center">
                                    <button
                                        onClick={() => handleSort("pH")}
                                        className="group flex items-center justify-center text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors mx-auto uppercase tracking-wider"
                                    >
                                        pH
                                        {renderSortIcon("pH")}
                                    </button>
                                </th>

                                {/* Soil Type */}
                                <th className="px-4 py-3 text-left">
                                    <span className="text-xs font-medium text-slate-600 uppercase tracking-wider">Soil Type</span>
                                </th>

                                {/* Status - Sortable */}
                                <th className="px-4 py-3 text-left">
                                    <button
                                        onClick={() => handleSort("status")}
                                        className="group flex items-center text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors uppercase tracking-wider"
                                    >
                                        Status
                                        {renderSortIcon("status")}
                                    </button>
                                </th>

                                {/* Actions */}
                                <th className="px-4 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody className="divide-y divide-gray-100">
                            {sortedPlots.map((plot, index) => {
                                const isSelected = selectedPlots.includes(plot.id);

                                return (
                                    <tr
                                        key={plot.id}
                                        onClick={() => onViewDetails(plot)}
                                        className={`
                                            group cursor-pointer transition-all duration-150
                                            ${isSelected
                                                ? "bg-blue-50/50 hover:bg-blue-50/70"
                                                : "bg-card hover:bg-gray-50"
                                            }
                                        `}
                                    >
                                        {/* Checkbox */}
                                        <td className="px-4 py-3.5">
                                            <div className="flex items-center justify-center">
                                                <Checkbox
                                                    checked={isSelected}
                                                    onClick={(e) => e.stopPropagation()}
                                                    onCheckedChange={() => onToggleSelection(plot.id)}
                                                    className="border-gray-400"
                                                />
                                            </div>
                                        </td>

                                        {/* Plot Name - Bold, Truncate */}
                                        <td className="px-4 py-3.5">
                                            <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                                                {plot.name}
                                            </div>
                                        </td>

                                        {/* Crop */}
                                        <td className="px-4 py-3.5">
                                            {plot.crop ? (
                                                <div className="min-w-0">
                                                    <div className="text-sm text-slate-700 truncate">{plot.crop}</div>
                                                    {plot.cropVariety && (
                                                        <div className="text-xs text-slate-500 mt-0.5 truncate">
                                                            {plot.cropVariety}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 text-sm italic">Unassigned</span>
                                            )}
                                        </td>

                                        {/* Area - Right-aligned, Monospace */}
                                        <td className="px-4 py-3.5 text-right">
                                            <span className="font-mono tabular-nums text-sm text-slate-900">
                                                {plot.area.toFixed(2)}
                                            </span>
                                        </td>

                                        {/* pH - Center-aligned, Badge style */}
                                        <td className="px-4 py-3.5">
                                            <div className="flex justify-center">
                                                <span className={`
                                                    inline-flex items-center justify-center px-2.5 py-1 rounded-md font-mono tabular-nums text-xs font-semibold w-14
                                                    ${plot.pH < 6.0 ? "bg-orange-50 text-orange-700 border border-orange-200" :
                                                        plot.pH > 7.5 ? "bg-sky-50 text-sky-700 border border-sky-200" :
                                                            "bg-green-50 text-green-700 border border-green-200"}
                                                `}>
                                                    {plot.pH.toFixed(1)}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Soil Type */}
                                        <td className="px-4 py-3.5">
                                            <span className="text-sm text-slate-600 truncate block">
                                                {plot.soilType}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3.5">
                                            <PlotStatusChip status={plot.status} />
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3.5">
                                            <div onClick={(e) => e.stopPropagation()} className="flex justify-center">
                                                <PlotActionsMenu
                                                    plot={plot}
                                                    onViewDetails={onViewDetails}
                                                    onDelete={onDelete}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Footer with row count */}
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                    <p className="text-sm text-slate-600">
                        Showing <span className="font-semibold text-slate-900">{sortedPlots.length}</span> plot{sortedPlots.length !== 1 ? 's' : ''}
                        {selectedPlots.length > 0 && (
                            <span className="ml-2">
                                • <span className="font-semibold text-blue-600">{selectedPlots.length}</span> selected
                            </span>
                        )}
                    </p>
                </div>
            </div>

            {/* Bulk Action Bar */}
            <PlotBulkActionBar
                selectedCount={selectedPlots.length}
                onClearSelection={onClearSelection}
                onBulkDelete={onBulkDelete}
                onBulkStatusChange={onBulkStatusChange}
            />
        </>
    );
}


