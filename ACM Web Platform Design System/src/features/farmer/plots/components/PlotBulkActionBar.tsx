import { X, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { PlotStatus } from "../types";

interface PlotBulkActionBarProps {
    selectedCount: number;
    onClearSelection: () => void;
    onBulkDelete: () => void;
    onBulkStatusChange: (status: PlotStatus) => void;
    onBulkExport?: () => void;
}

/**
 * PlotBulkActionBar Component
 * 
 * Floating action bar that appears when one or more plots are selected.
 * Provides bulk operations: delete, change status, and export.
 */
export function PlotBulkActionBar({
    selectedCount,
    onClearSelection,
    onBulkDelete,
    onBulkStatusChange,
    onBulkExport,
}: PlotBulkActionBarProps) {
    if (selectedCount === 0) return null;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5">
            <div className="bg-card rounded-lg shadow-lg border border-gray-200 px-4 py-3 flex items-center gap-4">
                {/* Selected Count */}
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-md">
                    <span className="text-sm font-medium text-blue-900">
                        {selectedCount} selected
                    </span>
                </div>

                {/* Divider */}
                <div className="h-6 w-px bg-gray-300" />

                {/* Change Status */}
                <Select onValueChange={(value) => onBulkStatusChange(value as PlotStatus)}>
                    <SelectTrigger className="w-[160px] h-9">
                        <SelectValue placeholder="Change Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="dormant">Dormant</SelectItem>
                        <SelectItem value="planned">Planned</SelectItem>
                    </SelectContent>
                </Select>

                {/* Export (Optional) */}
                {onBulkExport && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onBulkExport}
                        className="h-9"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                )}

                {/* Delete */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onBulkDelete}
                    className="h-9 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                </Button>

                {/* Divider */}
                <div className="h-6 w-px bg-gray-300" />

                {/* Clear Selection */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearSelection}
                    className="h-9 w-9 p-0"
                >
                    <X className="w-4 h-4" />
                    <span className="sr-only">Clear selection</span>
                </Button>
            </div>
        </div>
    );
}



