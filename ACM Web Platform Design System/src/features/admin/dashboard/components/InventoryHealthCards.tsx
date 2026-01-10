import { useNavigate } from 'react-router-dom';
import { Package, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/shared/lib';
import type { TransformedInventoryHealth } from '../types';

interface InventoryHealthCardsProps {
    items: TransformedInventoryHealth[];
}

/**
 * InventoryHealthCards - Display inventory health per farm with expiry warnings
 *
 * Features:
 * - Red border + pulse icon when items at risk
 * - Click to navigate to filtered inventory view
 */
export function InventoryHealthCards({ items }: InventoryHealthCardsProps) {
    const navigate = useNavigate();

    const handleCardClick = (farmId: number) => {
        // Navigate to inventory with farm filter and expiry warning filter
        navigate(`/admin/inventory?farmId=${farmId}&filter=expiring`);
    };

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-500" />
                    <CardTitle className="text-lg">Inventory Health</CardTitle>
                </div>
                <CardDescription>
                    Stock items expiring or expired by farm
                </CardDescription>
            </CardHeader>
            <CardContent>
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="rounded-full bg-emerald-50 p-3 mb-3">
                            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">All inventory healthy</p>
                        <p className="text-xs text-muted-foreground mt-1">No expiring items detected</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {items.map((item) => (
                            <div
                                key={item.farmId}
                                onClick={() => handleCardClick(item.farmId)}
                                className={cn(
                                    'p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md',
                                    item.hasWarning
                                        ? 'border-red-300 bg-red-50/50 hover:border-red-400'
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {item.hasWarning && (
                                            <AlertCircle className="h-4 w-4 text-red-500 animate-pulse" />
                                        )}
                                        <span className="font-medium">{item.farmName}</span>
                                    </div>
                                    <Badge variant={item.hasWarning ? 'destructive' : 'secondary'}>
                                        {item.totalAtRisk} at risk
                                    </Badge>
                                </div>
                                <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                        {item.expiredCount} expired
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                        {item.expiringSoonCount} expiring soon
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
