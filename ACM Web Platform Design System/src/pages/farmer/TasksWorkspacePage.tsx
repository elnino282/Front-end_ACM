import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, ClipboardList, Search, Calendar } from 'lucide-react';
import { taskApi, taskKeys } from '@/entities/task';
import type { TaskListParams } from '@/entities/task';
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Card,
  CardContent,
  PageContainer,
  PageHeader,
  AsyncState,
  ConfirmDialog,
  DataTablePagination,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
} from '@/shared/ui';
import { useDebounce } from '@/shared/lib';
import { toast } from 'sonner';

export function TasksWorkspacePage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<TaskListParams>({
    page: 0,
    size: 20,
    sortBy: 'createdAt',
    sortDirection: 'desc',
  });
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);

  // Dialog states
  const [startConfirmOpen, setStartConfirmOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [completionDate, setCompletionDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  // Fetch tasks using workspace API (no seasonId filter by default)
  const {
    data: tasksData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: taskKeys.listWorkspace({ ...filters, q: debouncedSearch || undefined }),
    queryFn: () => taskApi.listWorkspace({ ...filters, q: debouncedSearch || undefined }),
  });

  // Start task mutation
  const startTaskMutation = useMutation({
    mutationFn: (id: number) => taskApi.updateStatus(id, { status: 'IN_PROGRESS' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.listWorkspace() });
      toast.success('Task started successfully');
      setStartConfirmOpen(false);
      setSelectedTaskId(null);
    },
    onError: () => {
      toast.error('Failed to start task');
    },
  });

  // Complete task mutation
  const completeTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { actualEndDate?: string } }) =>
      taskApi.updateStatus(id, { status: 'DONE', actualEndDate: data.actualEndDate }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.listWorkspace() });
      toast.success('Task completed successfully');
      setCompleteDialogOpen(false);
      setSelectedTaskId(null);
    },
    onError: () => {
      toast.error('Failed to complete task');
    },
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      PENDING: 'outline',
      IN_PROGRESS: 'default',
      DONE: 'secondary',
      CANCELLED: 'destructive',
      OVERDUE: 'destructive',
    };

    return (
      <Badge variant={variants[status] || 'default'}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const handleOpenStartConfirm = (id: number) => {
    setSelectedTaskId(id);
    setStartConfirmOpen(true);
  };

  const handleStartTask = () => {
    if (selectedTaskId) {
      startTaskMutation.mutate(selectedTaskId);
    }
  };

  const handleOpenCompleteDialog = (id: number) => {
    setSelectedTaskId(id);
    setCompletionDate(new Date().toISOString().split('T')[0]);
    setCompleteDialogOpen(true);
  };

  const handleCompleteTask = () => {
    if (selectedTaskId && completionDate) {
      completeTaskMutation.mutate({
        id: selectedTaskId,
        data: { actualEndDate: completionDate },
      });
    }
  };

  // Get items from API response (handle different response formats)
  const items = tasksData?.items ?? [];
  const totalElements = tasksData?.totalElements ?? 0;
  const totalPages = tasksData?.totalPages ?? 0;

  return (
    <PageContainer>
      <Card className="mb-6 border border-border rounded-xl shadow-sm">
        <CardContent className="px-6 py-4">
          <PageHeader
            className="mb-0"
            icon={<ClipboardList className="w-8 h-8" />}
            title="Tasks Workspace"
            subtitle="Manage and track all your farm tasks"
            actions={
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </Button>
            }
          />
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="px-6 py-4">
          <div className="flex flex-wrap items-center justify-start gap-4">
            <div className="relative w-[320px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-10"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  status: value === 'all' ? undefined : (value as any),
                  page: 0,
                }))
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="DONE">Done</SelectItem>
                <SelectItem value="OVERDUE">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Table */}
      <Card>
      <CardContent className="px-6 py-4">
          <AsyncState
            isLoading={isLoading}
            isEmpty={items.length === 0}
            error={error as Error | null}
            onRetry={() => refetch()}
            loadingText="Loading tasks..."
            emptyIcon={<ClipboardList className="w-6 h-6 text-[#777777]" />}
            emptyTitle="No tasks found"
            emptyDescription="Create your first task to get started with managing your farm activities."
            emptyAction={
              <Button className="mt-2">
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </Button>
            }
          >
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Season</TableHead>
                    <TableHead>Planned Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((task) => (
                    <TableRow key={task.taskId}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>{task.seasonName || 'No Season'}</TableCell>
                      <TableCell>{task.plannedDate || '-'}</TableCell>
                      <TableCell>{task.dueDate || '-'}</TableCell>
                      <TableCell>{getStatusBadge(task.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {task.status === 'PENDING' && (
                            <Button
                              size="sm"
                              onClick={() => handleOpenStartConfirm(task.taskId)}
                              disabled={startTaskMutation.isPending}
                            >
                              Start
                            </Button>
                          )}
                          {(task.status === 'IN_PROGRESS' || task.status === 'OVERDUE') && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleOpenCompleteDialog(task.taskId)}
                              disabled={completeTaskMutation.isPending}
                            >
                              Complete
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 0 && (
              <DataTablePagination
                currentPage={filters.page ?? 0}
                totalPages={totalPages}
                totalItems={totalElements}
                pageSize={filters.size ?? 20}
                onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
                onPageSizeChange={(size) => setFilters((prev) => ({ ...prev, size, page: 0 }))}
              />
            )}
          </AsyncState>
        </CardContent>
      </Card>

      {/* Start Task Confirmation Dialog */}
      <ConfirmDialog
        open={startConfirmOpen}
        onOpenChange={setStartConfirmOpen}
        title="Start Task"
        description="Are you sure you want to start this task? The task status will be changed to 'In Progress'."
        confirmText="Start Task"
        onConfirm={handleStartTask}
        isLoading={startTaskMutation.isPending}
      />

      {/* Complete Task Dialog with Date Input */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Task</DialogTitle>
            <DialogDescription>
              Enter the completion date to mark this task as done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="completionDate">Completion Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="completionDate"
                  type="date"
                  value={completionDate}
                  onChange={(e) => setCompletionDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCompleteDialogOpen(false)}
              disabled={completeTaskMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCompleteTask}
              disabled={completeTaskMutation.isPending || !completionDate}
            >
              {completeTaskMutation.isPending ? 'Completing...' : 'Complete Task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
