import { Plot, Farm } from '../types';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { AlertCircle } from 'lucide-react';

interface PlotListProps {
    farm?: Farm;
    plots: Plot[];
    onCreatePlot: () => void;
    isLoading: boolean;
}

export function PlotList({ farm, plots, onCreatePlot, isLoading }: PlotListProps) {
    if (!farm) {
        return (
            <div className="flex h-full items-center justify-center text-gray-400">
                <div className="text-center">
                    <p className="text-lg font-medium">No Farm Selected</p>
                    <p>Select a farm to view its plots</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return <div className="p-4 text-center">Loading plots...</div>;
    }

    return (
        <Card className="h-full border-l-0 rounded-l-none">
            <CardHeader className="pb-4">
                <CardTitle>{farm.farmName} - Plots</CardTitle>
                <CardDescription>Manage plots for this farm</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Warning for inactive farm */}
                {!farm.active && (
                    <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 rounded-md flex items-center gap-2 text-sm border border-yellow-200">
                        <AlertCircle className="h-4 w-4" />
                        This farm is inactive. Activate it to create plots.
                    </div>
                )}

                {plots.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-lg">
                        <p>No plots found in this farm.</p>
                        {farm.active && (
                            <Button variant="link" onClick={onCreatePlot}>Create one now</Button>
                        )}
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Area (ha)</TableHead>
                                <TableHead>Soil Type</TableHead>
                                <TableHead>Status</TableHead>
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



