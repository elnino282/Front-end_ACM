import { Plus, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SeedLogViewProps {
    onAddSeedUsage: () => void;
}

export function SeedLogView({ onAddSeedUsage }: SeedLogViewProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2>Seed Usage Log</h2>
                    <p className="text-sm text-muted-foreground">Track seed purchases and usage across all crops</p>
                </div>
                <Button className="bg-primary hover:bg-primary/90" onClick={onAddSeedUsage} disabled>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Seed Usage
                </Button>
            </div>

            <Card>
                <CardContent className="p-16">
                    {/* Coming Soon Placeholder */}
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Clock className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h4 className="mb-2 text-muted-foreground">Coming Soon</h4>
                        <p className="text-sm text-muted-foreground max-w-md">
                            Seed usage tracking will be available soon. Monitor seed purchases, batch numbers, and costs across all your crops.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}




