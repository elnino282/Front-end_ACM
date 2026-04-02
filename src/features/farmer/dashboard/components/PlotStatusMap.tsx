import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plot } from "../types";

interface PlotStatusMapProps {
  plots: Plot[];
  getHealthColor: (health: string) => string;
}

/**
 * Plot Status Map Component
 *
 * Displays a color-coded visualization of all plots showing:
 * - Plot name and location
 * - Crop type and growth stage
 * - Health status indicator
 * - Plot area in hectares
 * - Health status legend
 */
export function PlotStatusMap({ plots, getHealthColor }: PlotStatusMapProps) {
  return (
    <Card className="border-border rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>Plot Status Map</CardTitle>
        <CardDescription>Color-coded by crop health</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {plots.map((plot) => (
            <div
              key={plot.id}
              className="flex items-center justify-between p-3 rounded-xl border border-border hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${getHealthColor(plot.health)}`}
                ></div>
                <div>
                  <div className="text-sm text-foreground">{plot.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {plot.crop} • {plot.stage}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm numeric text-foreground">
                  {plot.area} ha
                </div>
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="pt-3 border-t border-border flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
              <span className="text-muted-foreground">Healthy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-accent"></div>
              <span className="text-muted-foreground">Warning</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-destructive"></div>
              <span className="text-muted-foreground">Critical</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



