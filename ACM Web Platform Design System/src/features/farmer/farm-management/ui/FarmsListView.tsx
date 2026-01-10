import { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge, AddressDisplay } from "@/shared/ui";
import { FarmActionsMenu } from "./FarmActionsMenu";
import { FarmBulkActionBar } from "./FarmBulkActionBar";
import { FarmsCardView } from "./FarmsCardView";
import { useIsMobile } from "@/components/ui/use-mobile";
import type { Farm } from "@/entities/farm";

type SortColumn = "name" | "area" | "status" | null;
type SortDirection = "asc" | "desc";

interface FarmsListViewProps {
    farms: Farm[];
    selectedFarms: number[];
    onToggleSelection: (id: number) => void;
    onToggleAllSelection: () => void;
    onView: (farmId: number) => void;
    onEdit: (farmId: number) => void;
    onDelete: (farmId: number, farmName: string) => void;
    onBulkDelete: () => void;
    onBulkStatusChange: (status: boolean) => void;
    onClearSelection: () => void;
}

/**
 * FarmsListView Component
 * 
 * Main table view for farm management with:
 * - Sortable columns
 * - Bulk selection and actions
 * - Responsive design
 * - Sticky header
 * - Row hover effects
 */
export function FarmsListView({
    farms,
    selectedFarms,
    onToggleSelection,
    onToggleAllSelection,
    onView,
    onEdit,
    onDelete,
    onBulkDelete,
    onBulkStatusChange,
    onClearSelection,
}: FarmsListViewProps) {
    const isMobile = useIsMobile();
    const [sortColumn, setSortColumn] = useState<SortColumn>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

    // Tri-state checkbox state
    const isAllSelected = farms.length > 0 && selectedFarms.length === farms.length;
    const isSomeSelected = selectedFarms.length > 0 && selectedFarms.length < farms.length;

    // Use card view on mobile devices
    if (isMobile) {
        return (
            <FarmsCardView
                farms={farms}
                selectedFarms={selectedFarms}
                onToggleSelection={onToggleSelection}
                onToggleAllSelection={onToggleAllSelection}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                onBulkDelete={onBulkDelete}
                onBulkStatusChange={onBulkStatusChange}
                onClearSelection={onClearSelection}
            />
        );
    }

    // Sorting logic
    const sortedFarms = useMemo(() => {
        if (!sortColumn) return farms;

        return [...farms].sort((a, b) => {
            let aValue: string | number = "";
            let bValue: string | number = "";

            switch (sortColumn) {
                case "name":
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case "area":
                    // Handle both string and number types
                    aValue = typeof a.area === 'string' ? parseFloat(a.area) || 0 : (a.area || 0);
                    bValue = typeof b.area === 'string' ? parseFloat(b.area) || 0 : (b.area || 0);
                    break;
                case "status":
                    aValue = a.active ? "active" : "inactive";
                    bValue = b.active ? "active" : "inactive";
                    break;
            }

            if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
            if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });
    }, [farms, sortColumn, sortDirection]);

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

    // Format area value
    const formatArea = (area: string | number | null | undefined): string => {
        if (!area) return "—";
        const numArea = typeof area === 'string' ? parseFloat(area) : area;
        return isNaN(numArea) ? "—" : numArea.toFixed(2);
    };

    return (
        <>
            {/* Desktop Table View */}
            <div className="bg-card rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full table-fixed">
                        {/* Define column widths: Checkbox(12px), Name(25%), Area(15%), Address ID(20%), Status(20%), Actions(12px) */}
                        <colgroup>
                            <col className="w-12" />
                            <col className="w-[25%]" />
                            <col className="w-[15%]" />
                            <col className="w-[20%]" />
                            <col className="w-[20%]" />
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

                                {/* Name - Sortable */}
                                <th className="px-4 py-3 text-left">
                                    <button
                                        onClick={() => handleSort("name")}
                                        className="group flex items-center text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors uppercase tracking-wider"
                                    >
                                        Name
                                        {renderSortIcon("name")}
                                    </button>
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

                                {/* Address */}
                                <th className="px-4 py-3 text-left">
                                    <span className="text-xs font-medium text-slate-600 uppercase tracking-wider">Address</span>
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
                            {sortedFarms.map((farm) => {
                                const isSelected = selectedFarms.includes(farm.id);

                                return (
                                    <tr
                                        key={farm.id}
                                        onClick={() => onView(farm.id)}
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
                                                    onCheckedChange={() => onToggleSelection(farm.id)}
                                                    className="border-gray-400"
                                                />
                                            </div>
                                        </td>

                                        {/* Name - Bold, Truncate */}
                                        <td className="px-4 py-3.5">
                                            <div className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                                                {farm.name}
                                            </div>
                                        </td>

                                        {/* Area - Right-aligned, Monospace */}
                                        <td className="px-4 py-3.5 text-right">
                                            <span className="font-mono tabular-nums text-sm text-slate-900">
                                                {formatArea(farm.area)}
                                            </span>
                                        </td>

                                        {/* Address */}
                                        <td className="px-4 py-3.5">
                                            <AddressDisplay
                                                wardCode={farm.wardId}
                                                variant="compact"
                                                className="text-sm text-slate-600"
                                            />
                                        </td>

                                        {/* Status */}
                                        <td className="px-4 py-3.5">
                                            <Badge variant={farm.active ? "default" : "secondary"}>
                                                {farm.active ? "Active" : "Inactive"}
                                            </Badge>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3.5">
                                            <div onClick={(e) => e.stopPropagation()} className="flex justify-center">
                                                <FarmActionsMenu
                                                    farm={farm}
                                                    onView={onView}
                                                    onEdit={onEdit}
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
                        Showing <span className="font-semibold text-slate-900">{sortedFarms.length}</span> farm{sortedFarms.length !== 1 ? 's' : ''}
                        {selectedFarms.length > 0 && (
                            <span className="ml-2">
                                • <span className="font-semibold text-blue-600">{selectedFarms.length}</span> selected
                            </span>
                        )}
                    </p>
                </div>
            </div>

            {/* Bulk Action Bar */}
            <FarmBulkActionBar
                selectedCount={selectedFarms.length}
                onClearSelection={onClearSelection}
                onBulkDelete={onBulkDelete}
                onBulkStatusChange={onBulkStatusChange}
            />
        </>
    );
}



