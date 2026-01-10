import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    Legend,
} from 'recharts';
import type { ExpensesData } from '../types';

interface ExpensesYieldChartProps {
    expensesData: ExpensesData[];
}

export const ExpensesYieldChart: React.FC<ExpensesYieldChartProps> = ({ expensesData }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Expenses & Yield per Season</CardTitle>
                <CardDescription>Comparative analysis of costs and productivity</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={expensesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="season" stroke="#6b7280" />
                        <YAxis yAxisId="left" stroke="#6b7280" />
                        <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
                        <RechartsTooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="expenses" fill="#F59E0B" name="Expenses ($)" radius={[8, 8, 0, 0]} />
                        <Bar yAxisId="right" dataKey="yield" fill="#10B981" name="Yield (tons)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
