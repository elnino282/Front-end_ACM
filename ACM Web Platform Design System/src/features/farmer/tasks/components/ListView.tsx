import { Edit, Trash2, Check, MoreVertical, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import type { Task } from '../types';
import { TASK_TYPES, STATUS_COLORS, STATUS_LABELS } from '../constants';

interface ListViewProps {
  tasks: Task[];
  selectedTasks: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectTask: (taskId: string, checked: boolean) => void;
  onDelete: (taskId: string) => void;
}

export function ListView({ tasks, selectedTasks, onSelectAll, onSelectTask, onDelete }: ListViewProps) {
  return (
    <Card className="border-border acm-rounded-lg acm-card-shadow">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border bg-muted">
                <TableHead className="w-12">
                  <Checkbox
                    checked={tasks.length > 0 && tasks.every((t) => selectedTasks.includes(t.id))}
                    onCheckedChange={onSelectAll}
                  />
                </TableHead>
                <TableHead className="font-semibold text-foreground">Task Name</TableHead>
                <TableHead className="font-semibold text-foreground">Type</TableHead>
                <TableHead className="font-semibold text-foreground">Crop / Plot</TableHead>
                <TableHead className="font-semibold text-foreground">Assignee</TableHead>
                <TableHead className="font-semibold text-foreground">Due Date</TableHead>
                <TableHead className="font-semibold text-foreground">Status</TableHead>
                <TableHead className="font-semibold text-foreground">Attachments</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                    No tasks found
                  </TableCell>
                </TableRow>
              ) : (
                tasks.map((task) => {
                  const TaskIcon = TASK_TYPES[task.type].icon;
                  const taskColor = TASK_TYPES[task.type].color;

                  return (
                    <TableRow key={task.id} className="border-b border-border hover:bg-muted/50">
                      <TableCell>
                        <Checkbox
                          checked={selectedTasks.includes(task.id)}
                          onCheckedChange={(checked) => onSelectTask(task.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-foreground">{task.title}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <TaskIcon className="w-4 h-4" style={{ color: taskColor }} />
                          <span className="text-sm text-muted-foreground">{TASK_TYPES[task.type].label}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge className="bg-primary/10 text-primary border-primary/20 w-fit acm-rounded-sm text-xs">
                            {task.crop}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{task.plot}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {task.assigneeInitials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">{task.assignee}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${STATUS_COLORS[task.status]} acm-rounded-sm`}>
                          {STATUS_LABELS[task.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {task.attachments > 0 ? (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Paperclip className="w-4 h-4" />
                            <span className="numeric">{task.attachments}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="acm-rounded-sm">
                            <DropdownMenuItem className="cursor-pointer">
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Check className="w-4 h-4 mr-2" />
                              Complete
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-destructive" onClick={() => onDelete(task.id)}>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}



