import { ArrowLeft, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Crop } from '../types';

interface TimelineViewProps {
    crop: Crop;
    onBack: () => void;
}

export function TimelineView({ crop, onBack }: TimelineViewProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" onClick={onBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Crops
                </Button>
                <div>
                    <h2>
                        {crop.cropType} {crop.variety && `- ${crop.variety}`}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {crop.plot} {crop.season && `· ${crop.season}`}
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Growth Stage Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Coming Soon Placeholder */}
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Clock className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h4 className="mb-2 text-muted-foreground">Coming Soon</h4>
                        <p className="text-sm text-muted-foreground max-w-md">
                            Growth stage timeline will be available when connected to real-time API. Track sowing, vegetative, reproductive, and harvest stages with actionable insights.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}




