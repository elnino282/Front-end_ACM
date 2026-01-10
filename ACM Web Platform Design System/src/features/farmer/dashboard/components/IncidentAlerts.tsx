import { MapPin, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Incident } from "../types";

interface IncidentAlertsProps {
  incidents: Incident[];
  getSeverityColor: (severity: string) => string;
  getSeverityIcon: (severity: string) => JSX.Element | null;
}

/**
 * Incident Alerts Component
 *
 * Displays recent incidents requiring attention with:
 * - Severity-based color coding
 * - Incident title and description
 * - Location (plot) information
 * - Time since incident occurred
 * - Severity-specific icons
 */
export function IncidentAlerts({
  incidents,
  getSeverityColor,
  getSeverityIcon,
}: IncidentAlertsProps) {
  return (
    <Card className="border-border rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>Incident Alerts</CardTitle>
        <CardDescription>Recent issues requiring attention</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {incidents.map((incident) => (
            <div
              key={incident.id}
              className={`p-3 rounded-xl border-l-4 ${getSeverityColor(incident.severity)} cursor-pointer hover:bg-opacity-80 transition-colors`}
            >
              <div className="flex items-start gap-2">
                {getSeverityIcon(incident.severity)}
                <div className="flex-1">
                  <div className="text-sm text-foreground mb-1">
                    {incident.title}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{incident.plot}</span>
                    <span>•</span>
                    <Clock className="w-3 h-3" />
                    <span>{incident.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}



