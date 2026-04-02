import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip as RechartsTooltip,
} from 'recharts';
import type { SeasonStatusData } from '../types';

interface SeasonStatusChartProps {
    seasonStatusData: SeasonStatusData[];
}

export const SeasonStatusChart: React.FC<SeasonStatusChartProps> = ({ seasonStatusData }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Season Status</CardTitle>
                <CardDescription>Distribution of season states</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={seasonStatusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            label={(entry) => `${entry.name}: ${entry.value}`}
                        >
                            {seasonStatusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <RechartsTooltip />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
