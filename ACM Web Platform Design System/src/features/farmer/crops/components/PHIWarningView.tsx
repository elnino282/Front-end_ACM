import { AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Crop } from '../types';

interface PHIWarningViewProps {
    crops: Crop[];
}

export function PHIWarningView({ crops }: PHIWarningViewProps) {
    const cropsWithPHI = crops.filter((crop) => crop.phiAlert);

    if (cropsWithPHI.length === 0) {
        return (
            <div className="space-y-6">
                <div>
                    <h2>PHI Warning Management</h2>
                    <p className="text-sm text-muted-foreground">Pre-Harvest Interval tracking and alerts</p>
                </div>

                <Card className="border-dashed border-2">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                            <CheckCircle className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h3 className="mb-2">No Active PHI Restrictions</h3>
                        <p className="text-sm text-muted-foreground">
                            All crops are clear for harvest. PHI warnings will appear here when pesticides are applied.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2>PHI Warning Management</h2>
                <p className="text-sm text-muted-foreground">Pre-Harvest Interval tracking and alerts</p>
            </div>

            {cropsWithPHI.map((crop) => (
                <Card key={crop.id} className="border-amber-200">
                    <CardHeader className="bg-amber-50/50">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                                <AlertTriangle className="w-6 h-6 text-amber-600" />
                            </div>
                            <div className="flex-1">
                                <CardTitle className="text-amber-900">
                                    {crop.cropType} - {crop.variety}
                                </CardTitle>
                                <CardDescription className="text-amber-700">
                                    {crop.plot} · Active PHI Restriction
                                </CardDescription>
                            </div>
                            <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                                {crop.phiAlert!.daysRemaining} days remaining
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Last Pesticide Use</p>
                                <p className="font-medium">{new Date(crop.phiAlert!.lastPesticideUse).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Pesticide Name</p>
                                <p className="font-medium">{crop.phiAlert!.pesticideName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Required PHI</p>
                                <p className="font-medium">{crop.phiAlert!.requiredPHI} days</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground mb-1">Earliest Safe Harvest</p>
                                <p className="font-medium text-emerald-600">
                                    {new Date(crop.phiAlert!.earliestSafeHarvest).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <Alert className="border-blue-200 bg-blue-50">
                            <Zap className="w-4 h-4 text-blue-600" />
                            <AlertDescription className="text-blue-900">
                                <strong>Important:</strong> Do not harvest this crop before{' '}
                                {new Date(crop.phiAlert!.earliestSafeHarvest).toLocaleDateString()} to comply with safety regulations.
                                Harvesting during PHI period may result in unsafe residue levels.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}




