import { TrendingUp, TrendingDown, Wheat, DollarSign, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function KPICards() {
    const kpis = [
        {
            title: "Yield per ha",
            value: "7.2",
            unit: "tons/ha",
            trend: { value: "5%", isPositive: true },
            icon: Wheat,
        },
        {
            title: "Total Cost",
            value: "₫125M",
            unit: "this season",
            trend: { value: "8%", isPositive: false },
            icon: DollarSign,
        },
        {
            title: "On-time Tasks",
            value: "92%",
            unit: "completed on time",
            trend: { value: "3%", isPositive: true },
            icon: CheckCircle2,
        },
        {
            title: "Net Profit",
            value: "₫45.2M",
            unit: "this season",
            trend: { value: "12%", isPositive: true },
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
                            <p className={`${kpi.value.length > 6 ? 'text-2xl' : 'text-3xl'} numeric text-foreground`}>
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



