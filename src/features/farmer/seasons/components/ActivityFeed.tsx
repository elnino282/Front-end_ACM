import { Calendar, CheckCircle2, DollarSign, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity } from '../types';

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'task':
        return <CheckCircle2 className="w-4 h-4 text-primary" />;
      case 'expense':
        return <DollarSign className="w-4 h-4 text-secondary" />;
      case 'incident':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'season':
        return <Calendar className="w-4 h-4 text-accent" />;
    }
  };

  return (
    <Card className="border-border acm-rounded-lg acm-card-shadow">
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
        <CardDescription>Timeline of recent actions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted transition-colors">
              <div className="mt-1">{getActivityIcon(activity.type)}</div>
              <div className="flex-1">
                <div className="text-sm text-foreground">{activity.action}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {activity.user} • {activity.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}




