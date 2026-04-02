import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RecentActivity } from '../types';

interface RecentActivitiesTableProps {
  activities: RecentActivity[];
}

/**
 * RecentActivitiesTable Component
 * 
 * Displays a table of recent user activities across the platform.
 * Shows user avatar, action details, timestamp, and user type badge.
 */
export const RecentActivitiesTable = ({ activities }: RecentActivitiesTableProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest user actions across the platform</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{activity.user}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{activity.action}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {activity.details}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {activity.time}
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={activity.userType === 'farmer' ? 'default' : 'secondary'}
                    className={
                      activity.userType === 'farmer'
                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'
                    }
                  >
                    {activity.userType}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

