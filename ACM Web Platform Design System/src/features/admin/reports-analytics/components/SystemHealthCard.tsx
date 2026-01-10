import { Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { SystemHealthMetric } from '../types';

interface SystemHealthCardProps {
    systemHealth: SystemHealthMetric[];
    getHealthStatus: (status: string) => string;
}

export const SystemHealthCard: React.FC<SystemHealthCardProps> = ({
    systemHealth,
    getHealthStatus,
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    System Health
                </CardTitle>
                <CardDescription>Real-time platform performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {systemHealth.map((item, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm">{item.metric}</span>
                            <span className={`text-sm font-numeric ${getHealthStatus(item.status)}`}>
                                {item.value}{item.unit}
                            </span>
                        </div>
                        <Progress value={item.value} className="h-2" />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};
