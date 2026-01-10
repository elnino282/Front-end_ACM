import {
    PieChart,
    Pie,
    Cell,
    BarChart as RechartsBarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

// TODO: Replace with API data when available
const COST_DISTRIBUTION: any[] = [];
const MONTHLY_COSTS: any[] = [];

export function CostTab() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg text-foreground mb-1">Cost Analysis</h3>
                <p className="text-sm text-muted-foreground">
                    Breakdown of expenses by category and month
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Donut Chart */}
                <div>
                    <h4 className="text-sm text-foreground mb-4">Cost Distribution</h4>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={COST_DISTRIBUTION}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {COST_DISTRIBUTION.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <RechartsTooltip
                                formatter={(value: number) => `₫${(value / 1000000).toFixed(1)}M`}
                            />
                        </PieChart>
                    </ResponsiveContainer>

                    <div className="space-y-2 mt-4">
                        {COST_DISTRIBUTION.map((item) => (
                            <div
                                key={item.name}
                                className="flex items-center justify-between text-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-muted-foreground">{item.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="numeric text-foreground">
                                        {item.percentage}%
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        ₫{(item.value / 1000000).toFixed(1)}M
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stacked Bar Chart */}
                <div>
                    <h4 className="text-sm text-foreground mb-4">Monthly Comparison</h4>
                    <ResponsiveContainer width="100%" height={350}>
                        <RechartsBarChart data={MONTHLY_COSTS}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis
                                dataKey="month"
                                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                            />
                            <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                            <RechartsTooltip
                                formatter={(value: number) => `₫${(value / 1000000).toFixed(1)}M`}
                            />
                            <Legend />
                            <Bar dataKey="seeds" stackId="a" fill="var(--chart-1)" />
                            <Bar dataKey="fertilizer" stackId="a" fill="var(--chart-4)" />
                            <Bar dataKey="labor" stackId="a" fill="var(--chart-3)" />
                            <Bar dataKey="fuel" stackId="a" fill="var(--chart-2)" />
                            <Bar dataKey="machinery" stackId="a" fill="var(--chart-5)" />
                        </RechartsBarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}



