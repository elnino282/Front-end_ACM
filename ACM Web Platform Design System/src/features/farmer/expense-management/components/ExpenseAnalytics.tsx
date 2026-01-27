import { TrendingUp, PieChart as PieChartIcon, BarChart3, ListTodo } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { usePreferences, useOptionalSeason } from "@/shared/contexts";
import { formatMoney, convertToDisplayCurrency } from "@/shared/lib";
import {
    useExpenseAnalyticsByCategory,
    useExpenseAnalyticsByTask,
    useExpenseAnalyticsByVendor,
    useExpenseAnalyticsTimeSeries,
} from "@/entities/expense";
import { CATEGORY_COLORS } from "../constants";

export function ExpenseAnalytics() {
    const { preferences } = usePreferences();
    const seasonContext = useOptionalSeason();
    const seasonId = seasonContext?.selectedSeasonId ?? null;
    const hasSeason = !!seasonId;

    const baseParams = hasSeason ? { seasonId } : undefined;

    const { data: categoryData = [] } = useExpenseAnalyticsByCategory(baseParams, { enabled: hasSeason });
    const { data: taskData = [] } = useExpenseAnalyticsByTask(baseParams, { enabled: hasSeason });
    const { data: vendorData = [] } = useExpenseAnalyticsByVendor(baseParams, { enabled: hasSeason });
    const { data: timeSeries = [] } = useExpenseAnalyticsTimeSeries(
        { ...baseParams, granularity: "MONTH" },
        { enabled: hasSeason }
    );

    const formatValue = (value: number) =>
        formatMoney(convertToDisplayCurrency(value, preferences.currency), preferences.currency, preferences.locale);

    const categoryChartData = categoryData.map((item) => ({
        name: item.category,
        value: item.totalAmount,
        color: CATEGORY_COLORS[item.category] || "var(--muted-foreground)",
    }));

    const vendorChartData = vendorData.map((item) => ({
        name: item.vendorName ?? "Unassigned",
        value: item.totalAmount,
    }));

    const timeSeriesData = timeSeries.map((item) => ({
        period: item.label ?? item.periodStart,
        total: item.totalAmount,
    }));

    if (!hasSeason) {
        return (
            <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground">
                Select a season to view analytics.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card className="border-border rounded-xl">
                <CardHeader>
                    <CardTitle className="text-base text-foreground flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Expense Trend (Monthly)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={timeSeriesData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis
                                dataKey="period"
                                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                            />
                            <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                            <RechartsTooltip formatter={(value: number) => formatValue(value)} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="total"
                                stroke="var(--primary)"
                                strokeWidth={3}
                                name="Total"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-border rounded-xl">
                    <CardHeader>
                        <CardTitle className="text-base text-foreground flex items-center gap-2">
                            <PieChartIcon className="w-5 h-5 text-secondary" />
                            Category Breakdown
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {categoryChartData.length === 0 ? (
                            <div className="text-sm text-muted-foreground">No category data yet.</div>
                        ) : (
                            <>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={categoryChartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={3}
                                            dataKey="value"
                                        >
                                            {categoryChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip formatter={(value: number) => formatValue(value)} />
                                    </PieChart>
                                </ResponsiveContainer>

                                <div className="mt-4 space-y-2">
                                    {categoryChartData.map((item) => (
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
                                                {formatValue(item.value)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-border rounded-xl">
                    <CardHeader>
                        <CardTitle className="text-base text-foreground flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-accent" />
                            Vendor Spend
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {vendorChartData.length === 0 ? (
                            <div className="text-sm text-muted-foreground">No vendor data yet.</div>
                        ) : (
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={vendorChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                                        angle={-35}
                                        textAnchor="end"
                                        height={70}
                                    />
                                    <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                                    <RechartsTooltip formatter={(value: number) => formatValue(value)} />
                                    <Bar dataKey="value" fill="var(--primary)" name="Total" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card className="border-border rounded-xl">
                <CardHeader>
                    <CardTitle className="text-base text-foreground flex items-center gap-2">
                        <ListTodo className="w-5 h-5 text-primary" />
                        Task Spend
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {taskData.length === 0 ? (
                        <div className="text-sm text-muted-foreground">No task-linked expenses yet.</div>
                    ) : (
                        <div className="space-y-2 text-sm">
                            {taskData.map((task) => (
                                <div key={`${task.taskId ?? "none"}-${task.taskTitle}`} className="flex items-center justify-between">
                                    <span className="text-muted-foreground">{task.taskTitle ?? "Unassigned"}</span>
                                    <span className="numeric text-foreground">{formatValue(task.totalAmount)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
