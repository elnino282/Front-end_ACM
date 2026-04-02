import { Plus, AlertTriangle, Sprout } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CropCard } from './CropCard';
import type { Crop } from '../types';

interface CropListViewProps {
    crops: Crop[];
    allCrops: Crop[];
    onCropAction: (crop: Crop, action: 'timeline' | 'tasks' | 'edit' | 'delete') => void;
    onCreateCrop: () => void;
    getStageIcon: (stage: string) => any;
    getStageColor: (stage: string) => string;
    hasActiveFilters: boolean;
}

export function CropListView({
    crops,
    allCrops,
    onCropAction,
    onCreateCrop,
    getStageIcon,
    getStageColor,
    hasActiveFilters,
}: CropListViewProps) {
    const hasPHIWarnings = allCrops.some((crop) => crop.phiAlert && crop.phiAlert.daysRemaining > 0);

    return (
        <div className="space-y-6">
            {/* PHI Warning Banner */}
            {hasPHIWarnings && (
                <Alert className="border-amber-200 bg-amber-50">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <AlertTitle className="text-amber-900">PHI Warning Active</AlertTitle>
                    <AlertDescription className="text-amber-800">
                        Some crops have active Pre-Harvest Interval restrictions. Check individual crop cards for details.
                    </AlertDescription>
                </Alert>
            )}

            {/* Crop Cards Grid */}
            {crops.length === 0 ? (
                <Card className="border-dashed border-2">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                            <Sprout className="w-12 h-12 text-emerald-600" />
                        </div>
                        <h3 className="mb-2">No crops found</h3>
                        <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
                            {hasActiveFilters
                                ? 'No crops match your current filters. Try adjusting your search criteria.'
                                : 'Start by adding your first crop to track its growth and manage tasks effectively.'}
                        </p>
                        <Button className="bg-primary hover:bg-primary/90" onClick={onCreateCrop}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Your First Crop
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {crops.map((crop) => (
                        <CropCard
                            key={crop.id}
                            crop={crop}
                            onViewTimeline={() => onCropAction(crop, 'timeline')}
                            onViewTasks={() => onCropAction(crop, 'tasks')}
                            onEdit={() => onCropAction(crop, 'edit')}
                            onDelete={() => onCropAction(crop, 'delete')}
                            getStageIcon={getStageIcon}
                            getStageColor={getStageColor}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}




