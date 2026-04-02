import { Fragment, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Package, AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { adminDashboardApi } from '@/services/api.admin';
import { usePreferences } from '@/shared/contexts';

const WINDOW_OPTIONS = ['7', '14', '30', '60', '90'];

/**
 * InventoryHealthCards - Display inventory health per farm with expiry warnings
 *
 * Features:
 * - Window days and expired-only controls
 * - Drill-down navigation to admin inventory page
 * - Loading skeletons and error state
 */
export function InventoryHealthCards() {
    const navigate = useNavigate();
    const { preferences } = usePreferences();
    const [windowDays, setWindowDays] = useState('30');
    const [expiredOnly, setExpiredOnly] = useState(false);
    const includeExpiring = !expiredOnly;

    const query = useQuery({
        queryKey: ['adminDashboard', 'inventoryHealth', windowDays, includeExpiring],
        queryFn: () =>
            adminDashboardApi.getInventoryHealth({
                windowDays: Number(windowDays),
                includeExpiring,
                limit: 5,
            }),
    });

    const farms = query.data?.farms ?? [];
    const formatNumber = useMemo(
        () => (value: number) => new Intl.NumberFormat(preferences.locale).format(value),
        [preferences.locale]
    );

    const buildInventoryUrl = (farmId?: number) => {
        const params = new URLSearchParams();
        if (farmId != null) {
            params.set('farmId', String(farmId));
        }
        params.set('windowDays', windowDays);
        params.set('status', includeExpiring ? 'RISK' : 'EXPIRED');
        return `/admin/inventory?${params.toString()}`;
    };

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader className="space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-blue-500" />
                            <CardTitle className="text-lg">Inventory Health</CardTitle>
                            {query.isFetching && (
                                <RefreshCw className="h-4 w-4 text-muted-foreground animate-spin" />
                            )}
                        </div>
                        <CardDescription>
                            Stock items expiring or expired by farm
                        </CardDescription>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 justify-start sm:justify-end">
                        <Select value={windowDays} onValueChange={setWindowDays}>
                            <SelectTrigger className="h-8 w-[92px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {WINDOW_OPTIONS.map((option) => (
                                    <SelectItem key={option} value={option}>
                                        {option} days
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Switch checked={expiredOnly} onCheckedChange={setExpiredOnly} />
                            <span>Expired only</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600"
                            onClick={() => navigate(buildInventoryUrl())}
                        >
                            View all
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {query.isLoading && (
                    <div className="space-y-3">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-10 w-full" />
                        ))}
                    </div>
                )}

                {query.isError && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Failed to load inventory health</AlertTitle>
                        <AlertDescription className="mt-2 flex items-center justify-between gap-3">
                            <span>{query.error?.message || 'Please try again.'}</span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => query.refetch()}
                            >
                                Retry
                            </Button>
                        </AlertDescription>
                    </Alert>
                )}

                {!query.isLoading && !query.isError && farms.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="rounded-full bg-emerald-50 p-3 mb-3">
                            <Package className="h-6 w-6 text-emerald-500" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">
                            No expiring/expired stock in selected window
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-4"
                            onClick={() => navigate(buildInventoryUrl())}
                        >
                            Open Inventory
                        </Button>
                    </div>
                )}

                {!query.isLoading && !query.isError && farms.length > 0 && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Farm</TableHead>
                                <TableHead>Expired</TableHead>
                                {includeExpiring && <TableHead>Expiring</TableHead>}
                                <TableHead className="text-right">Qty at risk</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {farms.map((farm) => {
                                const topLots = farm.topRiskLots?.slice(0, 2) ?? [];
                                const colSpan = includeExpiring ? 5 : 4;

                                return (
                                    <Fragment key={farm.farmId}>
                                        <TableRow>
                                            <TableCell className="font-medium">{farm.farmName}</TableCell>
                                            <TableCell>
                                                {farm.expiredLots > 0 ? (
                                                    <Badge variant="destructive">{farm.expiredLots}</Badge>
                                                ) : (
                                                    <span className="text-muted-foreground">0</span>
                                                )}
                                            </TableCell>
                                            {includeExpiring && (
                                                <TableCell>
                                                    {farm.expiringLots > 0 ? (
                                                        <Badge variant="outline" className="text-amber-600 border-amber-300">
                                                            {farm.expiringLots}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-muted-foreground">0</span>
                                                    )}
                                                </TableCell>
                                            )}
                                            <TableCell className="text-right font-mono">
                                                {formatNumber(Number(farm.qtyAtRisk || 0))}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => navigate(buildInventoryUrl(farm.farmId))}
                                                >
                                                    View
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                        {topLots.length > 0 && (
                                            <TableRow>
                                                <TableCell colSpan={colSpan} className="text-xs text-muted-foreground">
                                                    {topLots.map((lot) => (
                                                        <span key={lot.lotId} className="mr-4">
                                                            {lot.itemName} · {lot.expiryDate}
                                                        </span>
                                                    ))}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </Fragment>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
