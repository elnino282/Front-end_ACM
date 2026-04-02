import React from "react";
import { Sprout } from "lucide-react";
import type { AgriAlert } from "../types";

interface AgriAlertsProps {
    agriAlerts: AgriAlert[];
    getAlertIcon: (type: string) => JSX.Element;
    getAlertColor: (severity: string) => string;
}

/**
 * Agricultural Alerts Component
 * Displays farming-specific weather alerts and recommendations
 */
export const AgriAlerts = React.memo<AgriAlertsProps>(
    ({ agriAlerts, getAlertIcon, getAlertColor }) => {
        if (agriAlerts.length === 0) return null;

        return (
            <div className="mb-4 space-y-2">
                <div className="flex items-center gap-1.5 mb-2">
                    <Sprout className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground">Agricultural Alerts</span>
                </div>
                {agriAlerts.map((alert, index) => (
                    <div
                        key={index}
                        className={`p-3 rounded-xl border-l-4 ${getAlertColor(alert.severity)}`}
                    >
                        <div className="flex items-start gap-2">
                            <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
                            <div className="flex-1">
                                <div className="text-sm text-foreground mb-0.5">
                                    {alert.title}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {alert.description}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
);

AgriAlerts.displayName = "AgriAlerts";



