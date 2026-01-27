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
import { usePreferences } from '@/shared/contexts';
import { convertWeight, formatMoney, getWeightUnitLabel } from '@/shared/lib';
import type { ExpensesData } from '../types';

interface ExpensesYieldChartProps {
    expensesData: ExpensesData[];
}

export const ExpensesYieldChart: React.FC<ExpensesYieldChartProps> = ({ expensesData }) => {
    const { preferences } = usePreferences();
    const unitLabel = getWeightUnitLabel(preferences.weightUnit);
    const displayData = expensesData.map((item) => ({
        ...item,
        yield: convertWeight(item.yield, preferences.weightUnit),
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Expenses & Yield per Season</CardTitle>
                <CardDescription>Comparative analysis of costs and productivity</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={displayData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="season" stroke="#6b7280" />
                        <YAxis yAxisId="left" stroke="#6b7280" />
                        <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
                        <RechartsTooltip
                            formatter={(value: number, name: string) => {
                                if (name === 'expenses') {
                                    return [
                                        formatMoney(value, preferences.currency, preferences.locale),
                                        'Expenses'
                                    ];
                                }
                                if (name === 'yield') {
                                    return [
                                        new Intl.NumberFormat(preferences.locale).format(value),
                                        `Yield (${unitLabel})`
                                    ];
                                }
                                return [value, name];
                            }}
                        />
                        <Legend />
                        <Bar
                            yAxisId="left"
                            dataKey="expenses"
                            fill="#F59E0B"
                            name={`Expenses (${preferences.currency})`}
                            radius={[8, 8, 0, 0]}
                        />
                        <Bar
                            yAxisId="right"
                            dataKey="yield"
                            fill="#10B981"
                            name={`Yield (${unitLabel})`}
                            radius={[8, 8, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
