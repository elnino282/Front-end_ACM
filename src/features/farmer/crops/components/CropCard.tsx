import { Calendar, Clock, MapPin, Wheat, TrendingUp, ListChecks, Edit, Trash2, Pill } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Sprout } from 'lucide-react';
import type { Crop } from '../types';

interface CropCardProps {
    crop: Crop;
    onViewTimeline: () => void;
    onViewTasks: () => void;
    onEdit: () => void;
    onDelete: () => void;
    getStageIcon: (stage: string) => any;
    getStageColor: (stage: string) => string;
}

export function CropCard({
    crop,
    onViewTimeline,
    onViewTasks,
    onEdit,
    onDelete,
    getStageIcon,
    getStageColor,
}: CropCardProps) {
    const StageIcon = getStageIcon(crop.currentStage);

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="flex items-center gap-2 mb-1">
                            <Sprout className="w-5 h-5 text-primary" />
                            {crop.cropType}
                        </CardTitle>
                        <CardDescription>{crop.variety}</CardDescription>
                    </div>
                    <Badge variant="secondary" className={getStageColor(crop.currentStage)}>
                        <StageIcon className="w-3 h-3 mr-1" />
                        {crop.currentStage}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                        <p className="text-muted-foreground text-xs mb-1">Plot</p>
                        <p className="font-medium flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {crop.plot}
                        </p>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-xs mb-1">Days After Sowing</p>
                        <p className="font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {crop.daysAfterSowing} days
                        </p>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-xs mb-1">Sowing Date</p>
                        <p className="font-medium flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(crop.sowingDate).toLocaleDateString()}
                        </p>
                    </div>
                    <div>
                        <p className="text-muted-foreground text-xs mb-1">Expected Harvest</p>
                        <p className="font-medium flex items-center gap-1">
                            <Wheat className="w-3 h-3" />
                            {new Date(crop.expectedHarvest).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* PHI Alert */}
                {crop.phiAlert && crop.phiAlert.daysRemaining > 0 && (
                    <Alert className="border-amber-200 bg-amber-50 py-2">
                        <Pill className="w-4 h-4 text-amber-600" />
                        <AlertDescription className="text-xs text-amber-800">
                            PHI Active: {crop.phiAlert.daysRemaining} days remaining until safe harvest
                        </AlertDescription>
                    </Alert>
                )}

                <Separator />

                {/* Quick Actions */}
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={onViewTimeline}>
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Timeline
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={onViewTasks}>
                        <ListChecks className="w-3 h-3 mr-1" />
                        Tasks
                    </Button>
                    <Button variant="outline" size="sm" onClick={onEdit}>
                        <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={onDelete}>
                        <Trash2 className="w-3 h-3" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}




