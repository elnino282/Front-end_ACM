import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { CostReport } from '@/services/api.admin';

interface CostAnalysisChartProps {
    data: CostReport[];
    isLoading?: boolean;
}

export const CostAnalysisChart: React.FC<CostAnalysisChartProps> = ({ data, isLoading }) => {
    // Transform data for the chart
    const chartData = data.map(item => ({
        name: item.seasonName || `Season ${item.seasonId}`,
        expense: Number(item.totalExpense) || 0,
        costPerKg: Number(item.costPerKg) || 0,
        yield: Number(item.totalYieldKg) || 0,
    }));

    if (isLoading) {
        return (
            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle>Cost Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[300px] w-full" />
                </CardContent>
            </Card>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle>Cost Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                        <p>No cost data available for the selected year.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Cost Analysis by Season</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12 }}
                            angle={-20}
                            textAnchor="end"
                            height={60}
                        />
                        <YAxis
                            yAxisId="left"
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => `${value.toLocaleString()}/kg`}
                        />
                        <Tooltip
                            formatter={(value: number, name: string) => {
                                if (name === 'expense') return [`${value.toLocaleString()} VND`, 'Total Expense'];
                                if (name === 'costPerKg') return [`${value.toLocaleString()} VND/kg`, 'Cost per Kg'];
                                return [value, name];
                            }}
                        />
                        <Legend />
                        <Bar
                            yAxisId="left"
                            dataKey="expense"
                            name="Total Expense"
                            fill="#F59E0B"
                            radius={[4, 4, 0, 0]}
                        />
                        <Bar
                            yAxisId="right"
                            dataKey="costPerKg"
                            name="Cost/Kg"
                            fill="#3B82F6"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
