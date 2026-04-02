import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";
import type { YieldViewMode, YieldBySeason, YieldByCrop, YieldByPlot } from "../types";
import { YIELD_VIEW_OPTIONS } from "../constants";
import { usePreferences } from "@/shared/contexts";
import { convertWeight, getWeightUnitLabel } from "@/shared/lib";

interface YieldTabProps {
    yieldViewMode: YieldViewMode;
    onViewModeChange: (mode: YieldViewMode) => void;
    chartData: YieldBySeason[] | YieldByCrop[] | YieldByPlot[];
}

export function YieldTab({
    yieldViewMode,
    onViewModeChange,
    chartData,
}: YieldTabProps) {
    const { preferences } = usePreferences();
    const unitLabel = getWeightUnitLabel(preferences.weightUnit);
    const formatWeightValue = (value: number) => {
        const maximumFractionDigits = preferences.weightUnit === "G" ? 0 : 2;
        return new Intl.NumberFormat(preferences.locale, { maximumFractionDigits }).format(value);
    };

    const displayData = useMemo(() => {
        return chartData.map((item) => {
            const entry = { ...item } as YieldBySeason & YieldByCrop & YieldByPlot;
            if (typeof entry.yield === "number") {
                entry.yield = convertWeight(entry.yield, preferences.weightUnit);
            }
            if (typeof entry.avgYield === "number") {
                entry.avgYield = convertWeight(entry.avgYield, preferences.weightUnit);
            }
            if (typeof entry.target === "number") {
                entry.target = convertWeight(entry.target, preferences.weightUnit);
            }
            return entry;
        });
    }, [chartData, preferences.weightUnit]);

    const getDataKey = () => {
        switch (yieldViewMode) {
            case "season":
                return "season";
            case "crop":
                return "crop";
            case "plot":
                return "plot";
            default:
                return "season";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg text-foreground">Yield & Productivity</h3>
                    <p className="text-sm text-muted-foreground">
                        Track yield performance across seasons, crops, and plots
                    </p>
                </div>
                <Select value={yieldViewMode} onValueChange={onViewModeChange}>
                    <SelectTrigger className="w-[160px] rounded-xl border-border">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {YIELD_VIEW_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={displayData}>
                    <defs>
                        <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey={getDataKey()} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                    <YAxis
                        tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                        tickFormatter={(value) => formatWeightValue(value as number)}
                    />
                    <RechartsTooltip
                        formatter={(value: number) => `${formatWeightValue(value)} ${unitLabel}`}
                        contentStyle={{
                            backgroundColor: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: "12px",
                            padding: "12px",
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="yield"
                        stroke="var(--primary)"
                        strokeWidth={3}
                        fill="url(#yieldGradient)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}



