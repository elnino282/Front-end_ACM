// Recent alerts panel with actions

import { AlertTriangle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Alert, AlertSeverity } from '../types';

interface AlertsPanelProps {
    alerts: Alert[];
    handleAlertAction: (alertId: string, action: 'acknowledge' | 'resolve') => void;
    getSeverityBadge: (severity: AlertSeverity) => string;
    getStatusBadge: (status: Alert['status']) => string;
}

export function AlertsPanel({
    alerts,
    handleAlertAction,
    getSeverityBadge,
    getStatusBadge,
}: AlertsPanelProps) {
    return (
        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Recent Alerts
                </CardTitle>
                <CardDescription>System alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
                {alerts.map((alert) => (
                    <div
                        key={alert.id}
                        className="p-3 rounded-lg border bg-card space-y-2"
                    >
                        <div className="flex items-start justify-between gap-2">
                            <Badge variant="secondary" className={getSeverityBadge(alert.severity)}>
                                {alert.severity}
                            </Badge>
                            <Badge variant="secondary" className={getStatusBadge(alert.status)}>
                                {alert.status}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-sm font-medium mb-1">{alert.type}</p>
                            <p className="text-xs text-muted-foreground mb-2">{alert.message}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {alert.time}
                            </div>
                        </div>
                        {alert.status === 'new' && (
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 text-xs"
                                    onClick={() => handleAlertAction(alert.id, 'acknowledge')}
                                >
                                    Acknowledge
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 text-xs"
                                    onClick={() => handleAlertAction(alert.id, 'resolve')}
                                >
                                    Resolve
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
