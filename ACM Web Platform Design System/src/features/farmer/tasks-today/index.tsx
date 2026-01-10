import { Card, CardContent } from '@/components/ui/card';
import { useTasksToday } from './hooks/useTasksToday';
import { HeaderBar } from './components/HeaderBar';
import { ViewSwitcher } from './components/ViewSwitcher';
import { TaskTableView } from './components/TaskTableView';
import { TaskCalendarView } from './components/TaskCalendarView';
import { TaskSplitView } from './components/TaskSplitView';

interface TasksTodayEnhancedProps {
    selectedSeason: string;
}

export function TasksTodayEnhanced({ selectedSeason }: TasksTodayEnhancedProps) {
    const {
        viewMode,
        calendarMode,
        selectedTasks,
        currentWeek,
        tasks,
        setViewMode,
        setCalendarMode,
        setCurrentWeek,
        handleCompleteTask,
        handleSelectAll,
        handleSelectTask,
        handleMarkSelectedDone,
        handleShiftSelected,
        getStatusColor,
        getStatusLabel,
    } = useTasksToday();

    return (
        <Card className="border-border acm-rounded-lg acm-card-shadow">
            <div>
                <HeaderBar selectedSeason={selectedSeason} />
                <div className="px-4 pb-4">
                    <ViewSwitcher viewMode={viewMode} onViewModeChange={setViewMode} />
                </div>
            </div>

            <CardContent className="p-0">
                {viewMode === 'table' && (
                    <TaskTableView
                        tasks={tasks.slice(0, 10)}
                        selectedTasks={selectedTasks}
                        onSelectAll={handleSelectAll}
                        onSelectTask={handleSelectTask}
                        onComplete={handleCompleteTask}
                        onMarkSelectedDone={handleMarkSelectedDone}
                        onShiftSelected={handleShiftSelected}
                        getStatusColor={getStatusColor}
                        getStatusLabel={getStatusLabel}
                    />
                )}

                {viewMode === 'calendar' && (
                    <TaskCalendarView
                        tasks={tasks}
                        mode={calendarMode}
                        currentWeek={currentWeek}
                        onModeChange={setCalendarMode}
                        onWeekChange={setCurrentWeek}
                        onComplete={handleCompleteTask}
                        getStatusColor={getStatusColor}
                    />
                )}

                {viewMode === 'split' && (
                    <TaskSplitView
                        tasks={tasks}
                        selectedTasks={selectedTasks}
                        onSelectTask={handleSelectTask}
                        onComplete={handleCompleteTask}
                        getStatusColor={getStatusColor}
                        getStatusLabel={getStatusLabel}
                    />
                )}
            </CardContent>
        </Card>
    );
}



