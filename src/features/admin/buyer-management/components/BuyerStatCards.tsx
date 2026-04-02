import { ShoppingCart, CheckCircle, Clock, Ban } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { BuyerStats } from '../types';

interface BuyerStatCardsProps {
    stats: BuyerStats;
}

export function BuyerStatCards({ stats }: BuyerStatCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">Total Buyers</p>
                        <h2 className="font-numeric">{stats.total}</h2>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-emerald-600" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">Active</p>
                        <h2 className="font-numeric">{stats.active}</h2>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-amber-600" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">Pending KYC</p>
                        <h2 className="font-numeric">{stats.pendingKYC}</h2>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                            <Ban className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">Suspended/Closed</p>
                        <h2 className="font-numeric">{stats.locked}</h2>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
