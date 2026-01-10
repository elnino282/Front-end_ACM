import { useDrop } from 'react-dnd';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Task, TaskStatus } from '../types';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  color: string;
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
}

export function KanbanColumn({ status, title, color, tasks, onTaskMove, onDelete }: KanbanColumnProps) {
  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: (item: { id: string }) => onTaskMove(item.id, status),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`bg-card rounded-xl border-2 transition-all ${
        isOver ? 'border-primary bg-primary/5' : 'border-border'
      }`}
    >
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
            <h3 className="text-sm">{title}</h3>
          </div>
          <Badge className="numeric bg-muted text-foreground border-border">{tasks.length}</Badge>
        </div>
      </div>
      <ScrollArea className="h-[600px] p-3">
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onDelete={onDelete} />
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-8 text-sm text-muted-foreground">No tasks</div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}



