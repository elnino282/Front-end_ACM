import { Farm } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { MapPin, Wheat } from 'lucide-react';

interface FarmListProps {
    farms: Farm[];
    selectedFarmId?: number;
    onSelectFarm: (farm: Farm) => void;
    isLoading: boolean;
}

export function FarmList({ farms, selectedFarmId, onSelectFarm, isLoading }: FarmListProps) {
    if (isLoading) {
        return <div className="p-4 text-center">Loading farms...</div>;
    }

    return (
        <Card className="h-full border-r-0 rounded-r-none">
            <CardHeader className="pb-4">
                <CardTitle>My Farms</CardTitle>
                <CardDescription>Manage your farms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {farms.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No farms found. Create one to get started.
                    </div>
                ) : (
                    farms.map(farm => (
                        <div
                            key={farm.id}
                            onClick={() => onSelectFarm(farm)}
                            className={`p-4 rounded-lg border cursor-pointer transition-all hover:bg-gray-50 ${
                                selectedFarmId === farm.id ? 'bg-primary/5 border-primary shadow-sm' : 'bg-card'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <Wheat className="h-4 w-4 text-primary" />
                                    <span className="font-semibold">{farm.farmName}</span>
                                </div>
                                <Badge variant={farm.active ? 'default' : 'secondary'} className={farm.active ? "bg-green-600" : ""}>
                                    {farm.active ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>
                            
                            <div className="text-sm text-gray-500 space-y-1">
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    <span className="truncate">{farm.wardName}, {farm.provinceName}</span>
                                </div>
                                <div>Area: {farm.area} ha</div>
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}



