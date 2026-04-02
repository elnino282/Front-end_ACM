// Individual KPI metric card with sparkline

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts';
import type { KPIMetric } from '../types';

interface KPIMetricCardProps {
    metric: KPIMetric;
    index: number;
}

export function KPIMetricCard({ metric, index }: KPIMetricCardProps) {
    const Icon = metric.icon;
    const isWarning = parseFloat(metric.value) > metric.threshold;

    return (
        <Card className={isWarning ? 'border-amber-200 bg-amber-50/50' : ''}>
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-lg ${metric.bgColor} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${metric.textColor}`} />
                    </div>
                    <Badge
                        variant={metric.change >= 0 ? 'default' : 'secondary'}
                        className={`text-xs ${metric.change >= 0
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                    >
                        {metric.change >= 0 ? '+' : ''}{metric.change}%
                    </Badge>
                </div>
                <div className="mb-3">
                    <div className="flex items-baseline gap-1">
                        <h2 className="font-numeric">{metric.value}</h2>
                        <span className="text-sm text-muted-foreground">{metric.unit}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{metric.title}</p>
                </div>
                {/* Sparkline */}
                <div className="h-8">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={metric.sparklineData.map((val) => ({ value: val }))}>
                            <defs>
                                <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={metric.color} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={metric.color} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke={metric.color}
                                fill={`url(#gradient-${index})`}
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
