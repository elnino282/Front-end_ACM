import { Badge } from '@/components/ui/badge';
import { EnhancedTask, TaskStatus } from '../types';
import { TASK_TYPES } from '../constants';

interface TaskSplitViewProps {
    tasks: EnhancedTask[];
    selectedTasks: string[];
    onSelectTask: (taskId: string, checked: boolean) => void;
    onComplete: (taskId: string) => void;
    getStatusColor: (status: TaskStatus) => string;
    getStatusLabel: (status: TaskStatus) => string;
}

export function TaskSplitView({
    tasks,
    selectedTasks,
    onSelectTask,
    getStatusColor,
    getStatusLabel,
}: TaskSplitViewProps) {
    return (
        <div className="grid grid-cols-2 gap-4 p-4">
            {/* Condensed Table */}
            <div className="border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-[400px]">
                    <table className="w-full">
                        <thead className="bg-muted border-b border-border sticky top-0">
                            <tr>
                                <th className="px-3 py-2 text-left text-xs text-foreground">Task</th>
                                <th className="px-3 py-2 text-left text-xs text-foreground">Due</th>
                                <th className="px-3 py-2 text-left text-xs text-foreground">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.slice(0, 6).map((task) => {
                                const TaskTypeIcon = TASK_TYPES[task.type].icon;
                                const typeColor = TASK_TYPES[task.type].color;

                                return (
                                    <tr
                                        key={task.id}
                                        className={`border-b border-border hover:bg-muted/50 cursor-pointer ${selectedTasks.includes(task.id) ? 'bg-primary/5' : ''
                                            }`}
                                        onClick={() => onSelectTask(task.id, !selectedTasks.includes(task.id))}
                                    >
                                        <td className="px-3 py-2">
                                            <div className="flex items-center gap-2">
                                                <TaskTypeIcon className="w-3 h-3" style={{ color: typeColor }} />
                                                <div className="flex flex-col">
                                                    <span className="numeric text-[0.65rem] text-muted-foreground">
                                                        {task.taskId}
                                                    </span>
                                                    <span className="text-xs text-foreground truncate max-w-[150px]">
                                                        {task.title}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2">
                                            <div className="flex items-center gap-1">
                                                <div
                                                    className={`w-1.5 h-1.5 rounded-full ${task.isOverdue ? 'bg-destructive' : 'bg-primary'
                                                        }`}
                                                />
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(task.dueDate).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-2">
                                            <Badge
                                                className={`${getStatusColor(task.status)} acm-rounded-sm text-xs px-1.5 py-0`}
                                            >
                                                {getStatusLabel(task.status).split(' ')[0]}
                                            </Badge>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Compressed Calendar */}
            <div className="border border-border rounded-lg p-3">
                <div className="text-sm mb-3 text-foreground">Week View</div>
                <div className="grid grid-cols-7 gap-1">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                        <div key={index} className="text-center text-xs text-muted-foreground mb-2">
                            {day}
                        </div>
                    ))}
                    {Array.from({ length: 7 }).map((_, index) => {
                        const day = new Date();
                        day.setDate(day.getDate() - day.getDay() + 1 + index);
                        const dayTasks = tasks.filter(
                            (task) => task.dueDate === day.toISOString().split('T')[0]
                        );

                        return (
                            <div
                                key={index}
                                className="aspect-square border border-border rounded p-1 text-center"
                            >
                                <div className="text-xs text-foreground">{day.getDate()}</div>
                                {dayTasks.length > 0 && (
                                    <div className="flex justify-center mt-1">
                                        <div className="w-1 h-1 rounded-full bg-primary" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}



