import { Download, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { MetricData } from '../types';

interface MetricsTableProps {
    metricsData: MetricData[];
}

export const MetricsTable: React.FC<MetricsTableProps> = ({ metricsData }) => {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Detailed Metrics</CardTitle>
                        <CardDescription>Module-wise performance indicators</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export Table
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Module</TableHead>
                                <TableHead>Metric</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead>Change</TableHead>
                                <TableHead>Last Updated</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {metricsData.map((metric) => (
                                <TableRow key={metric.id}>
                                    <TableCell className="font-medium">{metric.module}</TableCell>
                                    <TableCell>{metric.metric}</TableCell>
                                    <TableCell className="font-numeric">{metric.value}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            {metric.change >= 0 ? (
                                                <TrendingUp className="w-4 h-4 text-emerald-600" />
                                            ) : (
                                                <TrendingDown className="w-4 h-4 text-red-600" />
                                            )}
                                            <span className={metric.change >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                                                {Math.abs(metric.change)}%
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {metric.lastUpdated}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};
