import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button, AddressDisplay } from '@/shared/ui';
import type { FarmDetailResponse } from '@/entities/farm';
import { Pencil, Plus, Trash2 } from 'lucide-react';

interface FarmInfoCardProps {
    farm: FarmDetailResponse;
    canEdit: boolean;
    canDelete: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onCreatePlot: () => void;
}

/**
 * Farm information card component
 */
export function FarmInfoCard({
    farm,
    canEdit,
    canDelete,
    onEdit,
    onDelete,
    onCreatePlot,
}: FarmInfoCardProps) {
    return (
        <Card>
            <CardHeader>
                <div>
                    <CardTitle>{farm.name}</CardTitle>
                    <CardDescription>Farm ID: #{farm.id}</CardDescription>
                </div>
                <CardAction className="flex flex-wrap gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onCreatePlot}
                        disabled={!farm.active}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Plot
                    </Button>
                    {canEdit && (
                        <Button variant="outline" size="sm" onClick={onEdit}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                    )}
                    {canDelete && (
                        <Button variant="outline" size="sm" onClick={onDelete}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                    )}
                </CardAction>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Owner</p>
                        <p className="mt-1 text-sm">@{farm.ownerUsername}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Status</p>
                        <div className="mt-1">
                            <Badge variant={farm.active ? 'default' : 'secondary'}>
                                {farm.active ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Area</p>
                        <p className="mt-1 text-sm font-mono">
                            {farm.area ? `${farm.area} ha` : 'Not specified'}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Address</p>
                        <p className="mt-1 text-sm">
                            <AddressDisplay
                                wardCode={farm.wardId}
                                variant="full"
                                showIcon={true}
                                fallback="Not specified"
                            />
                        </p>
                    </div>
                    {farm.totalPlots !== undefined && (
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Plots</p>
                            <p className="mt-1 text-sm font-mono">{farm.totalPlots}</p>
                        </div>
                    )}
                    {farm.activePlots !== undefined && (
                        <div>
                            <p className="text-sm font-medium text-gray-500">Active Plots</p>
                            <p className="mt-1 text-sm font-mono">{farm.activePlots}</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}



