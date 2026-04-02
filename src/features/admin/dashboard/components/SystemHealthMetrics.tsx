import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SystemHealthMetric } from '../types';
import { getStatusColor } from '../constants';

interface SystemHealthMetricsProps {
  metrics: SystemHealthMetric[];
}

/**
 * SystemHealthMetrics Component
 * 
 * Displays real-time system performance metrics with color-coded status indicators.
 * Each metric shows a progress bar and percentage value.
 */
export const SystemHealthMetrics = ({ metrics }: SystemHealthMetricsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Health</CardTitle>
        <CardDescription>Real-time platform performance metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">{item.metric}</span>
              <span className={`text-sm font-numeric ${getStatusColor(item.status)}`}>
                {item.value}%
              </span>
            </div>
            <Progress value={item.value} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

