import { Zap, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CropSidebarProps {
    getStageColor: (stage: string) => string;
}

export function CropSidebar({ getStageColor }: CropSidebarProps) {
    return (
        <Card className="sticky top-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    AI Care Advice
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Coming Soon Placeholder */}
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Clock className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h4 className="mb-2 text-muted-foreground">Coming Soon</h4>
                    <p className="text-sm text-muted-foreground">
                        AI recommendations, weather data, and progress tracking will be available when connected to real-time APIs.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}




