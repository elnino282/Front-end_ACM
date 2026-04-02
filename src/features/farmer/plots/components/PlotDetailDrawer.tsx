import {
  MapPin,
  Edit,
  GitMerge,
  QrCode,
  Trash2,
  AlertCircle,
  LayoutGrid,
  Droplets,
  TestTube,
  Activity,
  Download,
  Upload,
  FileText,
  Info,
  Sprout,
  Calendar,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { PlotStatusChip } from "./PlotStatusChip";
import { Plot, PlotStatus } from "../types";

interface PlotDetailDrawerProps {
  plot: Plot | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onMerge: () => void;
  onMarkDormant: (plot: Plot) => void;
  onGenerateQR: (plot: Plot) => void;
  onDelete: (plotId: string) => void;
}

/**
 * PlotDetailDrawer Component
 *
 * Side drawer displaying detailed plot information with tabs for different data sections.
 */
export function PlotDetailDrawer({
  plot,
  isOpen,
  onClose,
  onEdit,
  onMerge,
  onMarkDormant,
  onGenerateQR,
  onDelete,
}: PlotDetailDrawerProps) {
  if (!plot) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-foreground">
            <MapPin className="w-5 h-5 text-primary" />
            {plot.name}
          </SheetTitle>
          <SheetDescription>
            Plot ID: {plot.id} • {plot.area.toFixed(1)} hectares
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-4 bg-muted">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="soil">Soil Data</TabsTrigger>
            <TabsTrigger value="seasons">Seasons</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <LayoutGrid className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Area</p>
                      <p className="text-lg text-foreground">
                        {plot.area.toFixed(1)} ha
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted/30 rounded-lg">
                      <Droplets className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Soil Type</p>
                      <p className="text-lg text-foreground">{plot.soilType}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <TestTube className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">pH Level</p>
                      <p className="text-lg text-foreground">{plot.pH.toFixed(1)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/10 rounded-lg">
                      <Activity className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <div className="mt-1"><PlotStatusChip status={plot.status} /></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base">Plot Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Created Date</span>
                  <span className="text-sm text-foreground">
                    {new Date(plot.createdDate).toLocaleDateString()}
                  </span>
                </div>
                {plot.crop && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Current Crop</span>
                    <span className="text-sm text-foreground">{plot.crop}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* QR Code Preview */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base">QR Code</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-foreground" />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onGenerateQR(plot)}
                    className="border-primary text-primary"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download QR
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Soil Data Tab */}
          <TabsContent value="soil" className="space-y-4 mt-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base">Soil Test Results</CardTitle>
                <CardDescription>
                  Last updated:{" "}
                  {plot.soilTestDate
                    ? new Date(plot.soilTestDate).toLocaleDateString()
                    : "No data"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">pH Level</Label>
                    <p className="text-2xl text-foreground mt-1">
                      {plot.pH.toFixed(1)}
                    </p>
                    <p className="text-xs text-primary mt-1">Optimal</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Organic Matter (%)
                    </Label>
                    <p className="text-2xl text-foreground mt-1">
                      {plot.organicMatter?.toFixed(1) || "N/A"}
                    </p>
                    <p className="text-xs text-primary mt-1">Good</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Electrical Conductivity
                    </Label>
                    <p className="text-2xl text-foreground mt-1">
                      {plot.electricalConductivity?.toFixed(1) || "N/A"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">dS/m</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Soil Type</Label>
                    <p className="text-2xl text-foreground mt-1">{plot.soilType}</p>
                  </div>
                </div>

                <Separator className="bg-border" />

                <div className="space-y-2">
                  <Label className="text-sm text-foreground">
                    Upload Soil Test Report
                  </Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 border-primary text-primary"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload PDF/CSV
                    </Button>
                    <Button variant="outline">
                      <FileText className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-secondary/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-secondary mt-0.5" />
                  <div>
                    <p className="text-sm text-foreground">
                      Soil Analysis Recommendation
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Based on your soil data, consider applying organic matter to
                      improve soil structure. Schedule next soil test in 6 months.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Linked Seasons Tab */}
          <TabsContent value="seasons" className="space-y-4 mt-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base">Linked Seasons</CardTitle>
                <CardDescription>
                  Growing seasons associated with this plot
                </CardDescription>
              </CardHeader>
              <CardContent>
                {plot.seasons && plot.seasons.length > 0 ? (
                  <div className="space-y-3">
                    {plot.seasons.map((season) => (
                      <div
                        key={season.id}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Sprout className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm text-foreground">{season.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {season.crop} • Started{" "}
                              {new Date(season.startDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            season.status === "Active"
                              ? "border-primary text-primary"
                              : "border-border text-muted-foreground"
                          }
                        >
                          {season.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
                    <p className="text-sm text-muted-foreground">
                      No seasons linked to this plot
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-3 border-primary text-primary"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Season
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions" className="space-y-3 mt-6">
            <Button
              className="w-full justify-start bg-secondary hover:bg-secondary/90 text-white"
              onClick={() => {
                onClose();
                onEdit();
              }}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Plot Details
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start border-primary text-primary"
              onClick={() => {
                onClose();
                onMerge();
              }}
            >
              <GitMerge className="w-4 h-4 mr-2" />
              Merge/Split Plot
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start border-accent text-accent"
              onClick={() => {
                onMarkDormant(plot);
                onClose();
              }}
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Mark as Dormant
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => onGenerateQR(plot)}
            >
              <QrCode className="w-4 h-4 mr-2" />
              Generate & Print QR Code
            </Button>

            <Separator className="bg-border my-4" />

            <Button
              variant="outline"
              className="w-full justify-start border-red-500 text-red-500 hover:bg-red-50"
              onClick={() => {
                onDelete(plot.id);
                onClose();
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Plot
            </Button>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}




