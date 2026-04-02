import { MapPin, List, Plus, MapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ViewMode } from "../types";

interface PlotHeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onAddPlot: () => void;
}

/**
 * PlotHeader Component
 *
 * Displays the header section with title, description, view toggle, and add plot button.
 */
export function PlotHeader({ viewMode, setViewMode, onAddPlot }: PlotHeaderProps) {
  return (
    <Card className="border border-border rounded-xl shadow-sm">
      <CardContent className="px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2 leading-tight">
              <MapPin className="w-6 h-6 text-emerald-600" />
              My Plots
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Manage your agricultural plots and land parcels
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* View Toggle */}
            <div className="inline-flex rounded-lg bg-muted p-1">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`${
                  viewMode === "list"
                    ? "bg-card shadow-sm text-primary"
                    : "hover:bg-card/50"
                }`}
              >
                <List className="w-4 h-4 mr-2" />
                List
              </Button>
              <Button
                variant={viewMode === "map" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("map")}
                className={`${
                  viewMode === "map"
                    ? "bg-card shadow-sm text-primary"
                    : "hover:bg-card/50"
                }`}
              >
                <MapIcon className="w-4 h-4 mr-2" />
                Map
              </Button>
            </div>

            <Button
              onClick={onAddPlot}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Plot
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}




