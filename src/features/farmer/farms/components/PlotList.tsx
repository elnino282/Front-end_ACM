import { useI18n } from '@/hooks/useI18n';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { AlertCircle } from 'lucide-react';
import { Farm, Plot } from '../types';

interface PlotListProps {
    farm?: Farm;
    plots: Plot[];
    onCreatePlot: () => void;
    isLoading: boolean;
}

export function PlotList({ farm, plots, onCreatePlot, isLoading }: PlotListProps) {
    const { t } = useI18n();

    if (!farm) {
        return (
            <div className="flex h-full items-center justify-center text-gray-400">
                <div className="text-center">
                    <p className="text-lg font-medium">{t('plots.noFarmSelected.title')}</p>
                    <p>{t('plots.noFarmSelected.description')}</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return <div className="p-4 text-center">{t('plots.loading')}</div>;
    }

    return (
        <Card className="h-full border-l-0 rounded-l-none">
            <CardHeader className="pb-4">
                <CardTitle>{farm.farmName} - {t('plots.title')}</CardTitle>
                <CardDescription>{t('plots.subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Warning for inactive farm */}
                {!farm.active && (
                    <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 rounded-md flex items-center gap-2 text-sm border border-yellow-200">
                        <AlertCircle className="h-4 w-4" />
                        {t('plots.inactiveFarmWarning')}
                    </div>
                )}

                {plots.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-lg">
                        <p>{t('plots.empty')}</p>
                        {farm.active && (
                            <Button variant="link" onClick={onCreatePlot}>{t('plots.createNow')}</Button>
                        )}
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('plots.table.name')}</TableHead>
                                <TableHead>{t('plots.table.area')}</TableHead>
                                <TableHead>{t('plots.table.soilType')}</TableHead>
                                <TableHead>{t('plots.table.status')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {plots.map(plot => (
                                <TableRow key={plot.id}>
                                    <TableCell className="font-medium">{plot.plotName}</TableCell>
                                    <TableCell>{plot.area}</TableCell>
                                    <TableCell>{plot.soilType || '-'}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={
                                            plot.status === 'IN_USE' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                            plot.status === 'IDLE' ? 'bg-gray-100 text-gray-700' : ''
                                        }>
                                            {plot.status.replace('_', ' ')}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}



