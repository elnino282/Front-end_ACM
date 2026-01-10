import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { YieldReport } from '@/services/api.admin';

interface YieldReportCardProps {
    data: YieldReport[];
    isLoading?: boolean;
}

export const YieldReportCard: React.FC<YieldReportCardProps> = ({ data, isLoading }) => {
    const getVarianceIcon = (variance: number | null) => {
        if (variance === null) return <Minus className="w-4 h-4 text-gray-400" />;
        if (variance > 5) return <TrendingUp className="w-4 h-4 text-emerald-500" />;
        if (variance < -5) return <TrendingDown className="w-4 h-4 text-red-500" />;
        return <Minus className="w-4 h-4 text-gray-400" />;
    };

    const getVarianceBadge = (variance: number | null) => {
        if (variance === null) return <Badge variant="secondary">N/A</Badge>;
        const value = `${variance > 0 ? '+' : ''}${variance.toFixed(1)}%`;
        if (variance > 5) return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">{value}</Badge>;
        if (variance < -5) return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">{value}</Badge>;
        return <Badge variant="secondary">{value}</Badge>;
    };

    if (isLoading) {
        return (
            <Card className="col-span-full">
                <CardHeader>
                    <CardTitle>Yield Performance</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Card className="col-span-full">
                <CardHeader>
                    <CardTitle>Yield Performance</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        <p>No yield data available for the selected year.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-full">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Yield Performance</span>
                    <Badge variant="outline">{data.length} seasons</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Season</TableHead>
                            <TableHead>Crop</TableHead>
                            <TableHead>Plot</TableHead>
                            <TableHead className="text-right">Expected (kg)</TableHead>
                            <TableHead className="text-right">Actual (kg)</TableHead>
                            <TableHead className="text-right">Variance</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.seasonId}>
                                <TableCell className="font-medium">{item.seasonName || `Season ${item.seasonId}`}</TableCell>
                                <TableCell>{item.cropName || '-'}</TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        <div>{item.plotName || '-'}</div>
                                        <div className="text-xs text-muted-foreground">{item.farmName}</div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-mono">
                                    {item.expectedYieldKg != null ? Number(item.expectedYieldKg).toLocaleString() : '-'}
                                </TableCell>
                                <TableCell className="text-right font-mono">
                                    {item.actualYieldKg != null ? Number(item.actualYieldKg).toLocaleString() : '-'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {getVarianceIcon(item.variancePercent)}
                                        {getVarianceBadge(item.variancePercent)}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
