/**
 * FarmsCardView Component
 * 
 * Mobile-optimized card layout for farm list
 */

import { Badge, AddressDisplay, Checkbox } from '@/shared/ui';
import { FarmActionsMenu } from './FarmActionsMenu';
import { FarmBulkActionBar } from './FarmBulkActionBar';
import type { Farm } from '@/entities/farm';
import { MapPin, Maximize2 } from 'lucide-react';

interface FarmsCardViewProps {
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
 * FarmsCardView Component
 * 
 * Card-based layout optimized for mobile and tablet devices with:
 * - Touch-friendly card design
 * - Inline selection checkboxes
 * - Prominent farm information
 * - Easy-to-tap action buttons
 */
export function FarmsCardView({
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
}: FarmsCardViewProps) {
    // Selection state
    const isAllSelected = farms.length > 0 && selectedFarms.length === farms.length;
    const isSomeSelected = selectedFarms.length > 0 && selectedFarms.length < farms.length;

    // Format area value
    const formatArea = (area: string | number | null | undefined): string => {
        if (!area) return '—';
        const numArea = typeof area === 'string' ? parseFloat(area) : area;
        return isNaN(numArea) ? '—' : `${numArea.toFixed(2)} ha`;
    };

    return (
        <>
            {/* Select All Header */}
            <div className="bg-card rounded-lg border border-gray-200 shadow-sm p-4 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Checkbox
                        checked={isAllSelected ? true : isSomeSelected ? "indeterminate" : false}
                        onCheckedChange={onToggleAllSelection}
                        className="border-gray-400"
                    />
                    <span className="text-sm font-medium text-gray-700">
                        {isSomeSelected ? `${selectedFarms.length} selected` : 'Select all'}
                    </span>
                </div>
                <p className="text-sm text-gray-500">
                    {farms.length} farm{farms.length !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Cards Grid */}
            <div className="space-y-4">
                {farms.map((farm) => {
                    const isSelected = selectedFarms.includes(farm.id);

                    return (
                        <div
                            key={farm.id}
                            className={`
                                bg-card rounded-lg border shadow-sm transition-all duration-200
                                ${isSelected
                                    ? 'border-blue-500 ring-2 ring-blue-100'
                                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                                }
                            `}
                        >
                            {/* Card Header with Selection and Actions */}
                            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={() => onToggleSelection(farm.id)}
                                        className="border-gray-400"
                                    />
                                    <Badge variant={farm.active ? 'default' : 'secondary'}>
                                        {farm.active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                                <FarmActionsMenu
                                    farm={farm}
                                    onView={onView}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            </div>

                            {/* Card Body - Clickable */}
                            <div
                                onClick={() => onView(farm.id)}
                                className="px-4 py-4 cursor-pointer active:bg-gray-50 transition-colors"
                            >
                                {/* Farm Name */}
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                    {farm.name}
                                </h3>

                                {/* Farm Details Grid */}
                                <div className="space-y-2.5">
                                    {/* Area */}
                                    {farm.area && (
                                        <div className="flex items-start gap-2">
                                            <Maximize2 className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Area</p>
                                                <p className="text-sm font-mono text-gray-900">
                                                    {formatArea(farm.area)}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Address */}
                                    {farm.wardId && (
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
                                                <p className="text-sm text-gray-900">
                                                    <AddressDisplay
                                                        wardCode={farm.wardId}
                                                        variant="compact"
                                                    />
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Farm ID */}
                                    <div className="pt-2 border-t border-gray-100">
                                        <p className="text-xs text-gray-400">
                                            ID: #{farm.id}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="mt-6 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-center text-gray-600">
                    Showing <span className="font-semibold text-gray-900">{farms.length}</span> farm{farms.length !== 1 ? 's' : ''}
                    {selectedFarms.length > 0 && (
                        <span className="ml-2">
                            • <span className="font-semibold text-blue-600">{selectedFarms.length}</span> selected
                        </span>
                    )}
                </p>
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







