import { BarChart3, PieChart as PieChartIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
} from "recharts";
import type { ChartDataPoint } from "../types";

interface HarvestChartsProps {
    dailyTrend: ChartDataPoint[];
    gradeDistribution: ChartDataPoint[];
}

export function HarvestCharts({
    dailyTrend,
    gradeDistribution,
}: HarvestChartsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Daily Harvest Trend */}
            <Card className="border-border rounded-2xl shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base text-foreground flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        Daily Harvest Trend
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={dailyTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis dataKey="date" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                            <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                            <RechartsTooltip
                                formatter={(value: number) => `${value.toLocaleString()} kg`}
                            />
                            <Bar dataKey="quantity" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Grade Distribution */}
            <Card className="border-border rounded-2xl shadow-sm">
                <CardHeader>
                    <CardTitle className="text-base text-foreground flex items-center gap-2">
                        <PieChartIcon className="w-5 h-5 text-secondary" />
                        Grade Distribution
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={gradeDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {gradeDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <RechartsTooltip />
                        </PieChart>
                    </ResponsiveContainer>

                    <div className="mt-4 space-y-2">
                        {gradeDistribution.map((item) => (
                            <div
                                key={item.name}
                                className="flex items-center justify-between text-xs"
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    ></div>
                                    <span className="text-muted-foreground">{item.name}</span>
                                </div>
                                <span className="numeric text-foreground">
                                    {item.value} {item.value === 1 ? "batch" : "batches"}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}



