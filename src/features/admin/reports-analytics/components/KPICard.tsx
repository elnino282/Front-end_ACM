import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import type { KPIData } from '../types';

interface KPICardProps {
    kpi: KPIData;
    index: number;
}

export const KPICard: React.FC<KPICardProps> = ({ kpi, index }) => {
    const Icon = kpi.icon;
    const TrendIcon = kpi.trend === 'up' ? ArrowUpRight : ArrowDownRight;

    return (
        <Card className="relative overflow-hidden">
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${kpi.bgColor} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${kpi.textColor}`} />
                    </div>
                    <Badge
                        variant={kpi.trend === 'up' ? 'default' : 'secondary'}
                        className={`gap-1 ${kpi.trend === 'up'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                            }`}
                    >
                        <TrendIcon className="w-3 h-3" />
                        {Math.abs(kpi.change)}%
                    </Badge>
                </div>
                <div className="mb-3">
                    <h2 className="font-numeric mb-1">{kpi.value}</h2>
                    <p className="text-xs text-muted-foreground">{kpi.title}</p>
                    <p className="text-xs text-muted-foreground">{kpi.subtitle}</p>
                </div>
                {/* Mini Trendline */}
                <div className="h-8">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={kpi.trendData.map((val) => ({ value: val }))}>
                            <defs>
                                <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={kpi.color} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={kpi.color} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke={kpi.color}
                                fill={`url(#gradient-${index})`}
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};
