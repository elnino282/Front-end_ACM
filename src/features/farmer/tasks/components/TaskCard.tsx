import { useState } from 'react';
import { Edit, Trash2, Check, MoreVertical, MapPin, Clock, Paperclip } from 'lucide-react';
import { useDrag } from 'react-dnd';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useI18n } from '@/hooks/useI18n';
import type { Task } from '../types';
import { TASK_TYPES } from '../constants';

interface TaskCardProps {
  task: Task;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onDelete }: TaskCardProps) {
  const { t } = useI18n();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const TaskIcon = TASK_TYPES[task.type].icon;
  const taskColor = TASK_TYPES[task.type].color;

  return (
    <div
      ref={drag}
      className={`bg-card border border-border rounded-xl p-3 cursor-move acm-card-shadow hover:shadow-lg transition-all group ${
        isDragging ? 'opacity-50' : ''
      }`}
      style={{ borderLeftWidth: '4px', borderLeftColor: taskColor }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-1">
          <TaskIcon className="w-4 h-4" style={{ color: taskColor }} />
          <h4 className="text-sm text-foreground line-clamp-2">{task.title}</h4>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="acm-rounded-sm">
            <DropdownMenuItem className="cursor-pointer">
              <Edit className="w-4 h-4 mr-2" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Check className="w-4 h-4 mr-2" />
              Hoàn thành
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-destructive" onClick={() => setDeleteDialogOpen(true)}>
              <Trash2 className="w-4 h-4 mr-2" />
              {t('common.delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="acm-rounded-sm">
            <AlertDialogHeader>
              <AlertDialogTitle>{t('tasks.dialog.deleteTitle')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('tasks.dialog.deleteDescription', { taskName: task.title })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="acm-rounded-sm">{t('common.cancel')}</AlertDialogCancel>
              <AlertDialogAction
                className="acm-rounded-sm bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => {
                  onDelete(task.id);
                  setDeleteDialogOpen(false);
                }}
              >
                {t('common.delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          <span>{task.plot}</span>
          <span>•</span>
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs px-1.5 py-0">
            {task.crop}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          {task.attachments > 0 && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Paperclip className="w-3 h-3" />
                <span className="numeric">{task.attachments}</span>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {task.assigneeInitials}
            </AvatarFallback>
          </Avatar>
          {task.priority === 'high' && (
            <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs px-1.5 py-0">
              Cao
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}



