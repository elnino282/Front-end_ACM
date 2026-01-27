import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useI18n } from "@/hooks/useI18n";
import { ChevronRight, Droplets, Eye } from "lucide-react";
import { Task } from "../types";

interface TodaysTasksTableProps {
  tasks: Task[];
  toggleTask: (taskId: string) => void;
  getStatusBadge: (status: string) => JSX.Element | null;
}

/**
 * Today's Tasks Table Component
 *
 * Displays a table of tasks scheduled for today with:
 * - Checkbox for task completion
 * - Task details (title, ID, plot, type)
 * - Assignee with avatar
 * - Due date and status
 * - Action buttons
 */
export function TodaysTasksTable({
  tasks,
  toggleTask,
  getStatusBadge,
}: TodaysTasksTableProps) {
  const { t } = useI18n();

  return (
    <Card className="border-border rounded-2xl shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t('dashboard.todaysTasks.title')}</CardTitle>
            <CardDescription>
              {t('dashboard.todaysTasks.subtitle')}
            </CardDescription>
          </div>
          <Badge className="bg-secondary/10 text-secondary border-secondary/20 px-3 py-1">
            Nov 9
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="w-12"></TableHead>
                <TableHead>{t('tasks.table.title')}</TableHead>
                <TableHead>{t('tasks.table.plot')}</TableHead>
                <TableHead>{t('tasks.table.type')}</TableHead>
                <TableHead>{t('tasks.table.assignee')}</TableHead>
                <TableHead>{t('tasks.table.dueDate')}</TableHead>
                <TableHead>{t('tasks.table.status')}</TableHead>
                <TableHead className="w-24">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id} className="hover:bg-muted/50">
                  <TableCell>
                    <Checkbox
                      checked={task.checked}
                      onCheckedChange={() => toggleTask(task.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm text-foreground">
                        {task.title}
                      </span>
                      <span className="text-xs text-muted-foreground">{task.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {task.plot}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5 text-secondary" />
                      <span className="text-sm text-muted-foreground">
                        {task.type}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                          {task.assignee
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        {task.assignee}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground numeric">
                      {task.due}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(task.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}



