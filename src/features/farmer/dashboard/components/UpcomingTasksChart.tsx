import { AlertTriangle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UpcomingTaskDay } from "../types";

interface UpcomingTasksChartProps {
  upcomingTasks: UpcomingTaskDay[];
}

/**
 * Upcoming Tasks Chart Component
 *
 * Displays a 7-day bar chart visualization showing:
 * - Task count per day
 * - Overdue task indicators
 * - Summary statistics
 *
 * Uses a simple bar chart implementation with tooltips for detailed information.
 */
export function UpcomingTasksChart({ upcomingTasks }: UpcomingTasksChartProps) {
  const maxCount = Math.max(...upcomingTasks.map((d) => d.count));

  return (
    <Card className="border-border rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle>Upcoming Tasks (7 Days)</CardTitle>
        <CardDescription>
          Workload distribution for the next week
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Chart */}
          <div className="flex items-end justify-between gap-3 h-40">
            {upcomingTasks.map((day, index) => {
              const height = (day.count / maxCount) * 100;
              const hasOverdue = day.overdue > 0;

              return (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex-1 flex flex-col items-center gap-2 cursor-pointer group">
                        <div className="relative w-full">
                          <div
                            className={`w-full rounded-t-xl transition-all group-hover:opacity-80 ${
                              hasOverdue ? "bg-destructive" : "bg-primary"
                            }`}
                            style={{
                              height: `${height}%`,
                              minHeight: "24px",
                            }}
                          >
                            {hasOverdue && (
                              <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                                <AlertTriangle className="w-4 h-4 text-destructive" />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="numeric text-sm text-foreground">
                            {day.count}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {day.day}
                          </div>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{day.count} tasks scheduled</p>
                      {hasOverdue && (
                        <p className="text-xs text-destructive">
                          {day.overdue} overdue
                        </p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>

          {/* Summary */}
          <div className="pt-3 border-t border-border flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">
                Total:{" "}
                <span className="numeric text-foreground">
                  {upcomingTasks.reduce((sum, d) => sum + d.count, 0)}
                </span>
              </span>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-muted-foreground">
                Overdue:{" "}
                <span className="numeric text-destructive">
                  {upcomingTasks.reduce((sum, d) => sum + d.overdue, 0)}
                </span>
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



