import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  BarChart3,
  Beaker,
  ClipboardList,
  DollarSign,
  Droplets,
  FileText,
  TestTubeDiagonal,
  Wheat,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const MODULE_CARDS = [
  {
    title: "Task Workspace",
    description: "Track tasks by status: pending, in progress, overdue, and done.",
    icon: ClipboardList,
    path: "tasks",
  },
  {
    title: "Expenses",
    description: "Log operational costs linked to the active season and tasks.",
    icon: DollarSign,
    path: "expenses",
  },
  {
    title: "Field Logs",
    description: "Capture field activities by date for quick daily review.",
    icon: FileText,
    path: "field-logs",
  },
  {
    title: "Harvest",
    description: "Record harvest batches and monitor season harvest progress.",
    icon: Wheat,
    path: "harvest",
  },
  {
    title: "Nutrient Inputs",
    description: "Input nutrient data for mineral and organic sources.",
    icon: Beaker,
    path: "nutrient-inputs",
  },
  {
    title: "Irrigation Analysis",
    description: "Input irrigation water analysis for NO3/NH4/Total N metrics.",
    icon: Droplets,
    path: "irrigation-water-analyses",
  },
  {
    title: "Soil Tests",
    description: "Input soil test values (SOM, nitrate, ammonium, mineral N).",
    icon: TestTubeDiagonal,
    path: "soil-tests",
  },
  {
    title: "Reports",
    description: "Season reports are unlocked when harvest progress reaches 100%.",
    icon: BarChart3,
    path: "reports",
  },
] as const;

export function SeasonWorkspaceOverview() {
  const { seasonId } = useParams();
  const navigate = useNavigate();
  const seasonIdNumber = Number(seasonId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {MODULE_CARDS.map((module) => {
        const Icon = module.icon;
        return (
          <Card key={module.path} className="border border-border rounded-2xl shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-foreground flex items-center gap-2">
                <Icon className="w-5 h-5 text-primary" />
                {module.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground min-h-[66px]">{module.description}</p>
              <Button
                className="w-full rounded-xl"
                variant="outline"
                onClick={() => navigate(`/farmer/seasons/${seasonIdNumber}/workspace/${module.path}`)}
              >
                Open module
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
