import { Clock, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity } from "../types";

interface RecentActivityTimelineProps {
  activities: Activity[];
  getActivityIcon: (type: string) => JSX.Element;
}

/**
 * Recent Activity Timeline Component
 *
 * Displays a chronological timeline of recent farm activities with:
 * - Activity type icons
 * - Action description
 * - User who performed the action
 * - Timestamp
 * - Connecting lines between activities
 */
export function RecentActivityTimeline({
  activities,
  getActivityIcon,
}: RecentActivityTimelineProps) {
  return (
    <Card className="border-border rounded-2xl shadow-sm mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest actions and updates across your farm
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-secondary">
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={activity.id} className="flex items-start gap-4">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-card border-2 border-border flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
                {index < activities.length - 1 && (
                  <div className="absolute left-4 top-8 w-0.5 h-8 bg-border"></div>
                )}
              </div>
              <div className="flex-1 pb-4">
                <p className="text-sm text-foreground mb-1">
                  {activity.action}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{activity.user}</span>
                  <span>•</span>
                  <Clock className="w-3 h-3" />
                  <span>{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}



