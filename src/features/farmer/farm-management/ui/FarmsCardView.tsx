/**
 * FarmsCardView Component
 * 
 * Mobile-optimized card layout for farm list
 */

import type { Farm } from '@/entities/farm';
import { AddressDisplay, Badge, Checkbox } from '@/shared/ui';
import { MapPin, Maximize2 } from 'lucide-react';
import { FarmActionsMenu } from './FarmActionsMenu';
import { FarmBulkActionBar } from './FarmBulkActionBar';

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
            <div className="bg-card rounded-lg border border-border shadow-sm p-4 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Checkbox
                        checked={isAllSelected ? true : isSomeSelected ? "indeterminate" : false}
                        onCheckedChange={onToggleAllSelection}
                        className="border-muted-foreground"
                    />
                    <span className="text-sm font-medium text-foreground">
                        {isSomeSelected ? `${selectedFarms.length} selected` : 'Select all'}
                    </span>
                </div>
                <p className="text-sm text-muted-foreground">
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
                                    ? 'border-blue-500 ring-2 ring-blue-100 dark:ring-blue-900'
                                    : 'border-border hover:border-muted-foreground hover:shadow-md'
                                }
                            `}
                        >
                            {/* Card Header with Selection and Actions */}
                            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        checked={isSelected}
                                        onCheckedChange={() => onToggleSelection(farm.id)}
                                        className="border-muted-foreground"
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
                                className="px-4 py-4 cursor-pointer active:bg-muted transition-colors"
                            >
                                {/* Farm Name */}
                                <h3 className="text-lg font-semibold text-foreground mb-3">
                                    {farm.name}
                                </h3>

                                {/* Farm Details Grid */}
                                <div className="space-y-2.5">
                                    {/* Area */}
                                    {farm.area && (
                                        <div className="flex items-start gap-2">
                                            <Maximize2 className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Area</p>
                                                <p className="text-sm font-mono text-foreground">
                                                    {formatArea(farm.area)}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Address */}
                                    {farm.wardId && (
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Location</p>
                                                <p className="text-sm text-foreground">
                                                    <AddressDisplay
                                                        wardCode={farm.wardId}
                                                        variant="compact"
                                                    />
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Farm ID */}
                                    <div className="pt-2 border-t border-border">
                                        <p className="text-xs text-muted-foreground">
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
            <div className="mt-6 px-4 py-3 bg-muted rounded-lg border border-border">
                <p className="text-sm text-center text-muted-foreground">
                    Showing <span className="font-semibold text-foreground">{farms.length}</span> farm{farms.length !== 1 ? 's' : ''}
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







