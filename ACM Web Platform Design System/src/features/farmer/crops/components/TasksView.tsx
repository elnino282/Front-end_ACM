import { ArrowLeft, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Crop } from '../types';

interface TasksViewProps {
    crop: Crop;
    onBack: () => void;
    getStageIcon: (stage: string) => any;
    getPriorityBadge: (priority: string) => string;
}

export function TasksView({ crop, onBack }: TasksViewProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" onClick={onBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Crops
                </Button>
                <div>
                    <h2>Standard Tasks</h2>
                    <p className="text-sm text-muted-foreground">
                        {crop.cropType} {crop.variety && `- ${crop.variety}`} {crop.currentStage && `· Current Stage: ${crop.currentStage}`}
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recommended Tasks by Growth Stage</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Coming Soon Placeholder */}
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Clock className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h4 className="mb-2 text-muted-foreground">Coming Soon</h4>
                        <p className="text-sm text-muted-foreground max-w-md">
                            Standard tasks will be available when connected to agronomy task API. Get proven recommendations for each growth stage.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}




