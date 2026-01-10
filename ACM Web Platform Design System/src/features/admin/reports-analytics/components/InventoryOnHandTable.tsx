import { Warehouse, AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { InventoryOnHandReport } from '@/services/api.admin';

interface InventoryOnHandTableProps {
    data: InventoryOnHandReport[];
    isLoading?: boolean;
}

export const InventoryOnHandTable: React.FC<InventoryOnHandTableProps> = ({ data, isLoading }) => {
    if (isLoading) {
        return (
            <Card className="col-span-full">
                <CardHeader>
                    <CardTitle>Inventory On-Hand Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[...Array(4)].map((_, i) => (
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
                    <CardTitle>Inventory On-Hand Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        <Warehouse className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No inventory data available.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Calculate totals
    const totals = data.reduce(
        (acc, item) => ({
            totalQuantity: acc.totalQuantity + (Number(item.totalQuantityOnHand) || 0),
            totalLots: acc.totalLots + item.totalLots,
            expiredLots: acc.expiredLots + item.expiredLots,
            expiringSoonLots: acc.expiringSoonLots + item.expiringSoonLots,
        }),
        { totalQuantity: 0, totalLots: 0, expiredLots: 0, expiringSoonLots: 0 }
    );

    return (
        <Card className="col-span-full">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Warehouse className="w-5 h-5" />
                        <span>Inventory On-Hand Summary</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        {totals.expiredLots > 0 && (
                            <Badge variant="destructive" className="flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                {totals.expiredLots} expired lots
                            </Badge>
                        )}
                        {totals.expiringSoonLots > 0 && (
                            <Badge variant="outline" className="flex items-center gap-1 text-amber-600 border-amber-300">
                                <Clock className="w-3 h-3" />
                                {totals.expiringSoonLots} expiring soon
                            </Badge>
                        )}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Warehouse</TableHead>
                            <TableHead>Farm</TableHead>
                            <TableHead className="text-right">Total Lots</TableHead>
                            <TableHead className="text-right">Quantity On-Hand</TableHead>
                            <TableHead className="text-right">Expired</TableHead>
                            <TableHead className="text-right">Expiring Soon</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.warehouseId}>
                                <TableCell className="font-medium">{item.warehouseName}</TableCell>
                                <TableCell>{item.farmName || '-'}</TableCell>
                                <TableCell className="text-right">{item.totalLots}</TableCell>
                                <TableCell className="text-right font-mono">
                                    {Number(item.totalQuantityOnHand).toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    {item.expiredLots > 0 ? (
                                        <Badge variant="destructive">{item.expiredLots}</Badge>
                                    ) : (
                                        <span className="text-muted-foreground">0</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    {item.expiringSoonLots > 0 ? (
                                        <Badge variant="outline" className="text-amber-600 border-amber-300">
                                            {item.expiringSoonLots}
                                        </Badge>
                                    ) : (
                                        <span className="text-muted-foreground">0</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {/* Totals Row */}
                        <TableRow className="bg-muted/50 font-semibold">
                            <TableCell colSpan={2}>Total</TableCell>
                            <TableCell className="text-right">{totals.totalLots}</TableCell>
                            <TableCell className="text-right font-mono">{totals.totalQuantity.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{totals.expiredLots}</TableCell>
                            <TableCell className="text-right">{totals.expiringSoonLots}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
