import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronDown, Table as TableIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export interface YieldDataItem {
    group: string;
    expected: number;
    actual: number;
    varianceKg: number;
    variancePercent: number;
}

export interface CostDataItem {
    group: string;
    totalCost: number;
    costPerKg: number;
}

export interface RevenueDataItem {
    group: string;
    revenue: number;
    profit: number;
    profitMargin: number;
}

export interface ProfitDataItem {
    group: string;
    revenue: number;
    expense: number;
    grossProfit: number;
    profitMargin: number | null;
}

interface ReportsChartTabsProps {
    yieldData: YieldDataItem[];
    costData?: CostDataItem[];
    revenueData?: RevenueDataItem[];
    profitData?: ProfitDataItem[];
    activeTab: 'yield' | 'cost' | 'revenue' | 'profit';
    onTabChange: (tab: 'yield' | 'cost' | 'revenue' | 'profit') => void;
    onReset?: () => void;
    isLoading?: boolean;
}

const formatNumber = (num: number) => new Intl.NumberFormat('vi-VN').format(num);

// Empty state component
const EmptyState: React.FC<{ onReset?: () => void }> = ({ onReset }) => (
    <div className="h-[320px] flex flex-col items-center justify-center text-[#6b7280]">
        <p className="mb-2 text-sm">No data for selected filters</p>
        {onReset && (
            <Button variant="link" onClick={onReset} className="text-[#2563eb] text-sm">
                Reset filters
            </Button>
        )}
    </div>
);

// Loading spinner
const LoadingSpinner: React.FC = () => (
    <div className="h-[320px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2563eb]" />
    </div>
);

export const ReportsChartTabs: React.FC<ReportsChartTabsProps> = ({
    yieldData,
    costData = [],
    revenueData = [],
    profitData = [],
    activeTab,
    onTabChange,
    onReset,
    isLoading = false
}) => {
    const [showTable, setShowTable] = useState(false);
    const [groupBy, setGroupBy] = useState<'season' | 'farm' | 'crop'>('season');

    return (
        <div className="space-y-6">
            {/* Tab Header with Controls */}
            <div className="flex items-center justify-between">
                {/* Tab List */}
                <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as 'yield' | 'cost' | 'revenue' | 'profit')}>
                    <TabsList className="h-10 p-1 rounded-[18px] bg-[#f3efe6] border-0">
                        <TabsTrigger
                            value="yield"
                            className="h-8 px-4 rounded-[18px] text-sm font-medium text-[#6b7280] data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#1f2937] transition-all"
                        >
                            Yield
                        </TabsTrigger>
                        <TabsTrigger
                            value="cost"
                            className="h-8 px-4 rounded-[18px] text-sm font-medium text-[#6b7280] data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#1f2937] transition-all"
                        >
                            Cost
                        </TabsTrigger>
                        <TabsTrigger
                            value="revenue"
                            className="h-8 px-4 rounded-[18px] text-sm font-medium text-[#6b7280] data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#1f2937] transition-all"
                        >
                            Revenue
                        </TabsTrigger>
                        <TabsTrigger
                            value="profit"
                            className="h-8 px-4 rounded-[18px] text-sm font-medium text-[#6b7280] data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#1f2937] transition-all"
                        >
                            Profit
                        </TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Show Table Toggle */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTable(!showTable)}
                    className="h-8 px-3 rounded-[14px] border-[#e0e0e0] bg-[#f8f8f4] hover:bg-[#f0f0ec] text-[#333] font-medium text-sm"
                >
                    Show table
                    <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showTable ? 'rotate-180' : ''}`} />
                </Button>
            </div>

            {/* Chart Card */}
            <Card className="!rounded-[18px] border-[#e0e0e0] bg-white shadow-sm">
                <CardContent className="p-6">
                    {/* Chart Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex flex-col gap-0.5">
                            <h3 className="text-xl font-medium text-[#1f2937]">
                                {activeTab === 'yield' && 'Expected vs Actual Yield'}
                                {activeTab === 'cost' && 'Cost Analysis'}
                                {activeTab === 'revenue' && 'Revenue Analysis'}
                                {activeTab === 'profit' && 'Profit Analysis'}
                            </h3>
                            <p className="text-sm text-[#6b7280]">
                                {activeTab === 'yield' && 'Variance analysis by season'}
                                {activeTab === 'cost' && 'Total costs breakdown by season'}
                                {activeTab === 'revenue' && 'Revenue and profit by season'}
                                {activeTab === 'profit' && 'Revenue, expense and profit comparison'}
                            </p>
                        </div>

                        {/* Group By Select */}
                        <Select value={groupBy} onValueChange={(v) => setGroupBy(v as 'season' | 'farm' | 'crop')}>
                            <SelectTrigger className="h-9 w-[140px] rounded-[14px] border-[#e0e0e0] bg-white text-sm">
                                <SelectValue placeholder="By Season" />
                            </SelectTrigger>
                            <SelectContent className="rounded-[14px]">
                                <SelectItem value="season">By Season</SelectItem>
                                <SelectItem value="farm">By Farm</SelectItem>
                                <SelectItem value="crop">By Crop</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Yield Chart */}
                    {activeTab === 'yield' && (
                        isLoading ? (
                            <LoadingSpinner />
                        ) : yieldData.length === 0 ? (
                            <EmptyState onReset={onReset} />
                        ) : (
                            <ResponsiveContainer width="100%" height={320}>
                                <BarChart
                                    data={yieldData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                                    barGap={4}
                                    barCategoryGap="12%"
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                    <XAxis
                                        dataKey="group"
                                        tick={({ x, y, payload }) => {
                                            const label = payload.value;
                                            const shortLabel = label.length > 18 ? label.slice(0, 18) + '…' : label;
                                            return (
                                                <g transform={`translate(${x},${y})`}>
                                                    <title>{label}</title>
                                                    <text
                                                        x={0}
                                                        y={0}
                                                        dy={16}
                                                        textAnchor="middle"
                                                        fill="#6b7280"
                                                        fontSize={12}
                                                    >
                                                        {shortLabel}
                                                    </text>
                                                </g>
                                            );
                                        }}
                                        tickLine={false}
                                        axisLine={{ stroke: '#e5e7eb' }}
                                        height={50}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12, fill: '#6b7280' }}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                                    />
                                    <Tooltip
                                        formatter={(value: number, name: string) => {
                                            const label = name === 'actual' ? 'Actual (kg)' : 'Expected (kg)';
                                            return [formatNumber(value), label];
                                        }}
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: '1px solid #e0e0e0',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            padding: '12px',
                                        }}
                                        cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        wrapperStyle={{ paddingTop: '20px' }}
                                        formatter={(value: string) => (
                                            <span className={`text-base ${value === 'actual' ? 'text-[#3ba55d]' : 'text-[#9ca3af]'}`}>
                                                {value === 'actual' ? 'Actual' : 'Expected'}
                                            </span>
                                        )}
                                    />
                                    <Bar
                                        dataKey="actual"
                                        name="actual"
                                        fill="#4ade80"
                                        radius={[6, 6, 0, 0]}
                                        maxBarSize={60}
                                    />
                                    <Bar
                                        dataKey="expected"
                                        name="expected"
                                        fill="#9ca3af"
                                        radius={[6, 6, 0, 0]}
                                        maxBarSize={60}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )
                    )}

                    {/* Cost Chart */}
                    {activeTab === 'cost' && (
                        isLoading ? (
                            <LoadingSpinner />
                        ) : costData.length === 0 ? (
                            <EmptyState onReset={onReset} />
                        ) : (
                            <ResponsiveContainer width="100%" height={320}>
                                <BarChart
                                    data={costData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                                    barCategoryGap="18%"
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                    <XAxis
                                        dataKey="group"
                                        tick={({ x, y, payload }) => {
                                            const label = payload.value;
                                            const shortLabel = label.length > 18 ? label.slice(0, 18) + '…' : label;
                                            return (
                                                <g transform={`translate(${x},${y})`}>
                                                    <title>{label}</title>
                                                    <text x={0} y={0} dy={16} textAnchor="middle" fill="#6b7280" fontSize={12}>
                                                        {shortLabel}
                                                    </text>
                                                </g>
                                            );
                                        }}
                                        tickLine={false}
                                        axisLine={{ stroke: '#e5e7eb' }}
                                        height={50}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12, fill: '#6b7280' }}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                                    />
                                    <Tooltip
                                        formatter={(value: number) => [formatNumber(value) + ' VND', 'Total Cost']}
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: '1px solid #e0e0e0',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            padding: '12px',
                                        }}
                                        cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        wrapperStyle={{ paddingTop: '20px' }}
                                    />
                                    <Bar
                                        dataKey="totalCost"
                                        name="Total Cost (VND)"
                                        fill="#f59e0b"
                                        radius={[6, 6, 0, 0]}
                                        maxBarSize={100}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )
                    )}

                    {/* Revenue Chart */}
                    {activeTab === 'revenue' && (
                        isLoading ? (
                            <LoadingSpinner />
                        ) : revenueData.length === 0 ? (
                            <EmptyState onReset={onReset} />
                        ) : (
                            <ResponsiveContainer width="100%" height={320}>
                                <BarChart
                                    data={revenueData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                                    barGap={4}
                                    barCategoryGap="12%"
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                    <XAxis
                                        dataKey="group"
                                        tick={({ x, y, payload }) => {
                                            const label = payload.value;
                                            const shortLabel = label.length > 18 ? label.slice(0, 18) + '…' : label;
                                            return (
                                                <g transform={`translate(${x},${y})`}>
                                                    <title>{label}</title>
                                                    <text x={0} y={0} dy={16} textAnchor="middle" fill="#6b7280" fontSize={12}>
                                                        {shortLabel}
                                                    </text>
                                                </g>
                                            );
                                        }}
                                        tickLine={false}
                                        axisLine={{ stroke: '#e5e7eb' }}
                                        height={50}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12, fill: '#6b7280' }}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                                    />
                                    <Tooltip
                                        formatter={(value: number, name: string) => {
                                            const labels: Record<string, string> = {
                                                revenue: 'Revenue',
                                                profit: 'Profit'
                                            };
                                            return [formatNumber(value) + ' VND', labels[name] || name];
                                        }}
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: '1px solid #e0e0e0',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            padding: '12px',
                                        }}
                                        cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        wrapperStyle={{ paddingTop: '20px' }}
                                    />
                                    <Bar
                                        dataKey="revenue"
                                        name="Revenue (VND)"
                                        fill="#4ade80"
                                        radius={[6, 6, 0, 0]}
                                        maxBarSize={80}
                                    />
                                    <Bar
                                        dataKey="profit"
                                        name="Profit (VND)"
                                        fill="#2563eb"
                                        radius={[6, 6, 0, 0]}
                                        maxBarSize={80}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )
                    )}

                    {/* Profit Chart */}
                    {activeTab === 'profit' && (
                        isLoading ? (
                            <LoadingSpinner />
                        ) : profitData.length === 0 ? (
                            <EmptyState onReset={onReset} />
                        ) : (
                            <ResponsiveContainer width="100%" height={320}>
                                <BarChart
                                    data={profitData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                                    barGap={4}
                                    barCategoryGap="15%"
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                    <XAxis
                                        dataKey="group"
                                        tick={({ x, y, payload }) => {
                                            const label = payload.value;
                                            const shortLabel = label.length > 18 ? label.slice(0, 18) + '…' : label;
                                            return (
                                                <g transform={`translate(${x},${y})`}>
                                                    <title>{label}</title>
                                                    <text x={0} y={0} dy={16} textAnchor="middle" fill="#6b7280" fontSize={12}>
                                                        {shortLabel}
                                                    </text>
                                                </g>
                                            );
                                        }}
                                        tickLine={false}
                                        axisLine={{ stroke: '#e5e7eb' }}
                                        height={50}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12, fill: '#6b7280' }}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                                    />
                                    <Tooltip
                                        formatter={(value: number, name: string) => {
                                            const labels: Record<string, string> = {
                                                revenue: 'Revenue',
                                                expense: 'Expense',
                                                grossProfit: 'Gross Profit'
                                            };
                                            return [formatNumber(value) + ' VND', labels[name] || name];
                                        }}
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: '1px solid #e0e0e0',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            padding: '12px',
                                        }}
                                        cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        wrapperStyle={{ paddingTop: '20px' }}
                                    />
                                    <Bar
                                        dataKey="revenue"
                                        name="Revenue (VND)"
                                        fill="#4ade80"
                                        radius={[6, 6, 0, 0]}
                                        maxBarSize={70}
                                    />
                                    <Bar
                                        dataKey="expense"
                                        name="Expense (VND)"
                                        fill="#f59e0b"
                                        radius={[6, 6, 0, 0]}
                                        maxBarSize={70}
                                    />
                                    <Bar
                                        dataKey="grossProfit"
                                        name="Gross Profit (VND)"
                                        fill="#2563eb"
                                        radius={[6, 6, 0, 0]}
                                        maxBarSize={70}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )
                    )}
                </CardContent>
            </Card>

            {/* Data Tables (Collapsible) */}
            {showTable && (
                <Card className="!rounded-[18px] border-[#e0e0e0] bg-white shadow-sm">
                    <CardContent className="p-6">
                        {/* Yield Table */}
                        {activeTab === 'yield' && (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-b border-[#e0e0e0] hover:bg-transparent">
                                        <TableHead className="text-sm font-medium text-[#1f2937]">Season</TableHead>
                                        <TableHead className="text-sm font-medium text-[#1f2937] text-right">Expected (kg)</TableHead>
                                        <TableHead className="text-sm font-medium text-[#1f2937] text-right">Actual (kg)</TableHead>
                                        <TableHead className="text-sm font-medium text-[#1f2937] text-right">Variance (kg)</TableHead>
                                        <TableHead className="text-sm font-medium text-[#1f2937] text-right">Variance (%)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {yieldData.map((item, index) => (
                                        <TableRow key={index} className="border-b border-[#f3f4f6] hover:bg-[#fafafa]">
                                            <TableCell className="text-sm text-[#333] font-medium">{item.group}</TableCell>
                                            <TableCell className="text-sm text-[#6b7280] text-right">{formatNumber(item.expected)}</TableCell>
                                            <TableCell className="text-sm text-[#333] text-right">{formatNumber(item.actual)}</TableCell>
                                            <TableCell className={`text-sm text-right font-medium ${item.varianceKg >= 0 ? 'text-[#3ba55d]' : 'text-[#fb2c36]'}`}>
                                                {item.varianceKg >= 0 ? '+' : ''}{formatNumber(item.varianceKg)}
                                            </TableCell>
                                            <TableCell className={`text-sm text-right font-medium ${item.variancePercent >= 0 ? 'text-[#3ba55d]' : 'text-[#fb2c36]'}`}>
                                                {item.variancePercent >= 0 ? '+' : ''}{item.variancePercent.toFixed(1)}%
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}

                        {/* Cost Table */}
                        {activeTab === 'cost' && (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-b border-[#e0e0e0] hover:bg-transparent">
                                        <TableHead className="text-sm font-medium text-[#1f2937]">Season</TableHead>
                                        <TableHead className="text-sm font-medium text-[#1f2937] text-right">Total Cost (VND)</TableHead>
                                        <TableHead className="text-sm font-medium text-[#1f2937] text-right">Cost per kg (VND)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {costData.map((item, index) => (
                                        <TableRow key={index} className="border-b border-[#f3f4f6] hover:bg-[#fafafa]">
                                            <TableCell className="text-sm text-[#333] font-medium">{item.group}</TableCell>
                                            <TableCell className="text-sm text-[#333] text-right">{formatNumber(item.totalCost)}</TableCell>
                                            <TableCell className="text-sm text-[#6b7280] text-right">{formatNumber(item.costPerKg)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}

                        {/* Revenue Table */}
                        {activeTab === 'revenue' && (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-b border-[#e0e0e0] hover:bg-transparent">
                                        <TableHead className="text-sm font-medium text-[#1f2937]">Season</TableHead>
                                        <TableHead className="text-sm font-medium text-[#1f2937] text-right">Revenue (VND)</TableHead>
                                        <TableHead className="text-sm font-medium text-[#1f2937] text-right">Profit (VND)</TableHead>
                                        <TableHead className="text-sm font-medium text-[#1f2937] text-right">Margin (%)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {revenueData.map((item, index) => (
                                        <TableRow key={index} className="border-b border-[#f3f4f6] hover:bg-[#fafafa]">
                                            <TableCell className="text-sm text-[#333] font-medium">{item.group}</TableCell>
                                            <TableCell className="text-sm text-[#333] text-right">{formatNumber(item.revenue)}</TableCell>
                                            <TableCell className={`text-sm text-right font-medium ${item.profit >= 0 ? 'text-[#3ba55d]' : 'text-[#fb2c36]'}`}>
                                                {item.profit >= 0 ? '+' : ''}{formatNumber(item.profit)}
                                            </TableCell>
                                            <TableCell className={`text-sm text-right font-medium ${item.profitMargin >= 0 ? 'text-[#3ba55d]' : 'text-[#fb2c36]'}`}>
                                                {item.profitMargin.toFixed(1)}%
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}

                        {/* Profit Table */}
                        {activeTab === 'profit' && (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-b border-[#e0e0e0] hover:bg-transparent">
                                        <TableHead className="text-sm font-medium text-[#1f2937]">Season</TableHead>
                                        <TableHead className="text-sm font-medium text-[#1f2937] text-right">Revenue (VND)</TableHead>
                                        <TableHead className="text-sm font-medium text-[#1f2937] text-right">Expense (VND)</TableHead>
                                        <TableHead className="text-sm font-medium text-[#1f2937] text-right">Gross Profit (VND)</TableHead>
                                        <TableHead className="text-sm font-medium text-[#1f2937] text-right">Margin (%)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[...profitData]
                                        .sort((a, b) => b.grossProfit - a.grossProfit)
                                        .map((item, index) => (
                                            <TableRow key={index} className="border-b border-[#f3f4f6] hover:bg-[#fafafa]">
                                                <TableCell className="text-sm text-[#333] font-medium">{item.group}</TableCell>
                                                <TableCell className="text-sm text-[#333] text-right">{formatNumber(item.revenue)}</TableCell>
                                                <TableCell className="text-sm text-[#f59e0b] text-right">{formatNumber(item.expense)}</TableCell>
                                                <TableCell className={`text-sm text-right font-medium ${item.grossProfit >= 0 ? 'text-[#3ba55d]' : 'text-[#fb2c36]'}`}>
                                                    {item.grossProfit >= 0 ? '+' : ''}{formatNumber(item.grossProfit)}
                                                </TableCell>
                                                <TableCell className={`text-sm text-right font-medium ${(item.profitMargin ?? 0) >= 0 ? 'text-[#3ba55d]' : 'text-[#fb2c36]'}`}>
                                                    {item.profitMargin != null ? `${item.profitMargin.toFixed(1)}%` : 'N/A'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
