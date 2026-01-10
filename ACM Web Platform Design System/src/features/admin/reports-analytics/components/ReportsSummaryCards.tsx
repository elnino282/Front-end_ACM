import { Wheat, Coins, Calculator, DollarSign, TrendingUp, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

export interface SummaryStats {
    totalYield: number;
    totalCost: number;
    costPerKg: number | null;
    totalRevenue: number;
    grossProfit: number;
    profitMargin: number | null;
}

interface ReportsSummaryCardsProps {
    stats: SummaryStats;
    isLoading?: boolean;
}

export const ReportsSummaryCards: React.FC<ReportsSummaryCardsProps> = ({
    stats,
    isLoading = false
}) => {
    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('vi-VN').format(num);
    };

    const formatCurrency = (num: number) => {
        return new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(num) + ' ₫';
    };

    const cards = [
        {
            title: 'Actual Yield',
            value: `${formatNumber(stats.totalYield)} kg`,
            subtitle: 'Harvested in period',
            icon: Wheat,
            bgColor: 'bg-[#e8f5e9]',
            iconColor: 'text-[#3ba55d]',
            tooltip: 'Total actual yield harvested in the selected period',
        },
        {
            title: 'Total Cost',
            value: formatCurrency(stats.totalCost),
            subtitle: 'All expenses',
            icon: Coins,
            bgColor: 'bg-[#fff9e6]',
            iconColor: 'text-[#f59e0b]',
            tooltip: 'Sum of all expenses in the selected period',
        },
        {
            title: 'Cost per kg',
            value: stats.costPerKg != null ? formatCurrency(stats.costPerKg) : 'N/A',
            subtitle: 'VND/kg efficiency',
            icon: Calculator,
            bgColor: 'bg-[#e3f2fd]',
            iconColor: 'text-[#2563eb]',
            tooltip: 'Average cost per kilogram produced',
        },
        {
            title: 'Revenue',
            value: formatCurrency(stats.totalRevenue),
            subtitle: 'From harvests',
            icon: DollarSign,
            bgColor: 'bg-[#e8f5e9]',
            iconColor: 'text-[#3ba55d]',
            tooltip: 'Total revenue from harvest sales',
        },
        {
            title: 'Gross Profit',
            value: formatCurrency(stats.grossProfit),
            subtitle: stats.profitMargin != null
                ? `${stats.profitMargin.toFixed(1)}% margin`
                : 'N/A margin',
            icon: TrendingUp,
            bgColor: stats.grossProfit >= 0 ? 'bg-[#e8f5e9]' : 'bg-[#ffebee]',
            iconColor: stats.grossProfit >= 0 ? 'text-[#3ba55d]' : 'text-[#fb2c36]',
            tooltip: 'Revenue minus total costs',
        },
    ];

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                    <Card key={i} className="!rounded-[18px] border-[#e0e0e0] bg-white shadow-sm animate-pulse">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-3 flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-24" />
                                    <div className="h-7 bg-gray-200 rounded w-32" />
                                    <div className="h-3 bg-gray-200 rounded w-20" />
                                </div>
                                <div className="w-9 h-9 bg-gray-200 rounded-2xl" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <TooltipProvider>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {cards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <Card key={index} className="!rounded-[18px] border-[#e0e0e0] bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                            <CardContent className="p-5">
                                <div className="flex items-start gap-3">
                                    {/* Icon Container - Left Side */}
                                    <div className={`w-11 h-11 rounded-full ${card.bgColor} flex items-center justify-center flex-shrink-0`}>
                                        <Icon className={`w-5 h-5 ${card.iconColor}`} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                                        {/* Title with tooltip */}
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-sm font-medium text-[#6b7280]">{card.title}</span>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button className="text-[#9ca3af] hover:text-[#6b7280] transition-colors">
                                                        <Info className="w-3.5 h-3.5" />
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent className="rounded-lg">
                                                    <p className="text-xs">{card.tooltip}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>

                                        {/* Value - Bold */}
                                        <p className="text-xl font-bold text-[#1f2937] leading-tight tracking-tight truncate">
                                            {card.value}
                                        </p>

                                        {/* Subtitle - Lighter */}
                                        <p className="text-xs text-[#9ca3af] leading-4">
                                            {card.subtitle}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </TooltipProvider>
    );
};
