import { Card, CardContent } from "@/components/ui/card";
import { usePreferences } from "@/shared/contexts";
import { convertToDisplayCurrency, formatMoney, formatWeight } from "@/shared/lib";
import { CheckCircle2, DollarSign, TrendingDown, TrendingUp, Wheat } from "lucide-react";

/**
 * KPI Cards Component
 * 
 * TODO: Replace placeholder values with real data from API
 * - Use useReports hook to get yield, cost, and revenue data
 * - Connect to backend APIs: /api/v1/reports/yield, /api/v1/reports/cost, /api/v1/reports/revenue
 * - Calculate KPIs from actual season data
 */
export interface KPICardsProps {
    totalCost?: number;
    netProfit?: number;
    yieldPerHaKg?: number;
    onTimeTasksPercent?: number;
}

export function KPICards({
    totalCost = 0,
    netProfit = 0,
    yieldPerHaKg = 0,
    onTimeTasksPercent = 0,
}: KPICardsProps) {
    const { preferences } = usePreferences();
    const yieldPerHaLabel = yieldPerHaKg > 0 
        ? `${formatWeight(yieldPerHaKg, preferences.weightUnit, preferences.locale)}/ha`
        : "—";

    const kpis = [
        {
            title: "Yield per ha",
            value: yieldPerHaLabel,
            unit: "per hectare",
            trend: { value: "—", isPositive: true },
            icon: Wheat,
        },
        {
            title: "Total Cost",
            value: totalCost > 0 
                ? formatMoney(convertToDisplayCurrency(totalCost, preferences.currency), preferences.currency, preferences.locale)
                : "—",
            unit: "this season",
            trend: { value: "—", isPositive: false },
            icon: DollarSign,
        },
        {
            title: "On-time Tasks",
            value: onTimeTasksPercent > 0 ? `${onTimeTasksPercent}%` : "—",
            unit: "completed on time",
            trend: { value: "—", isPositive: true },
            icon: CheckCircle2,
        },
        {
            title: "Net Profit",
            value: netProfit !== 0
                ? formatMoney(convertToDisplayCurrency(netProfit, preferences.currency), preferences.currency, preferences.locale)
                : "—",
            unit: "this season",
            trend: { value: "—", isPositive: netProfit >= 0 },
            icon: TrendingUp,
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {kpis.map((kpi) => {
                const Icon = kpi.icon;
                const TrendIcon = kpi.trend.isPositive ? TrendingUp : TrendingDown;
                const trendColor = kpi.trend.isPositive ? "text-primary" : "text-destructive";

                return (
                    <Card
                        key={kpi.title}
                        className="border-border rounded-2xl shadow-sm overflow-hidden"
                    >
                        <div
                            className="h-1"
                            style={{
                                background: "linear-gradient(to right, var(--primary), var(--chart-4))",
                            }}
                        />
                        <CardContent className="px-6 py-4">
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Icon className="w-6 h-6 text-primary" />
                                </div>
                                <div className={`flex items-center gap-1 ${trendColor}`}>
                                    <TrendIcon className="w-4 h-4" />
                                    <span className="text-xs">{kpi.trend.value}</span>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">{kpi.title}</p>
                            <p className={`${kpi.value.length > 6 ? "text-2xl" : "text-3xl"} numeric text-foreground`}>
                                {kpi.value}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{kpi.unit}</p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
