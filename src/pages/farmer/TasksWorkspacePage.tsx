import type { TaskListParams } from '@/entities/task';
import { taskApi, taskKeys } from '@/entities/task';
import { useI18n } from '@/hooks/useI18n';
import { useDebounce } from '@/shared/lib';
import {
    AsyncState,
    Badge,
    Button,
    Card,
    CardContent,
    ConfirmDialog,
    DataTablePagination,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Input,
    Label,
    PageContainer,
    PageHeader,
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
} from '@/shared/ui';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Calendar, ClipboardList, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function TasksWorkspacePage() {
  const queryClient = useQueryClient();
  const { t } = useI18n();
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
      toast.success(t('tasks.toast.startSuccess'));
      setStartConfirmOpen(false);
      setSelectedTaskId(null);
    },
    onError: () => {
      toast.error(t('tasks.toast.startError'));
    },
  });

  // Complete task mutation
  const completeTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { actualEndDate?: string } }) =>
      taskApi.updateStatus(id, { status: 'DONE', actualEndDate: data.actualEndDate }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.listWorkspace() });
      toast.success(t('tasks.toast.completeSuccess'));
      setCompleteDialogOpen(false);
      setSelectedTaskId(null);
    },
    onError: () => {
      toast.error(t('tasks.toast.completeError'));
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
            title={t('tasks.title')}
            subtitle={t('tasks.subtitle')}
            actions={
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                {t('tasks.createButton')}
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
                placeholder={t('tasks.searchPlaceholder')}
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
                <SelectValue placeholder={t('tasks.filters.allStatuses')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('tasks.filters.allStatuses')}</SelectItem>
                <SelectItem value="PENDING">{t('tasks.status.pending')}</SelectItem>
                <SelectItem value="IN_PROGRESS">{t('tasks.status.inProgress')}</SelectItem>
                <SelectItem value="DONE">{t('tasks.status.done')}</SelectItem>
                <SelectItem value="OVERDUE">{t('tasks.status.overdue')}</SelectItem>
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
            loadingText={t('tasks.loading')}
            emptyIcon={<ClipboardList className="w-6 h-6 text-[#777777]" />}
            emptyTitle={t('tasks.empty.title')}
            emptyDescription={t('tasks.empty.description')}
            emptyAction={
              <Button className="mt-2">
                <Plus className="w-4 h-4 mr-2" />
                {t('tasks.createButton')}
              </Button>
            }
          >
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('tasks.table.title')}</TableHead>
                    <TableHead>{t('tasks.table.season')}</TableHead>
                    <TableHead>{t('tasks.table.plannedDate')}</TableHead>
                    <TableHead>{t('tasks.table.dueDate')}</TableHead>
                    <TableHead>{t('tasks.table.status')}</TableHead>
                    <TableHead className="text-right">{t('tasks.table.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((task) => (
                    <TableRow key={task.taskId}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>{task.seasonName || t('tasks.noSeason')}</TableCell>
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
                              {t('tasks.actions.start')}
                            </Button>
                          )}
                          {(task.status === 'IN_PROGRESS' || task.status === 'OVERDUE') && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleOpenCompleteDialog(task.taskId)}
                              disabled={completeTaskMutation.isPending}
                            >
                              {t('tasks.actions.complete')}
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
        title={t('tasks.dialog.startTitle')}
        description={t('tasks.dialog.startDescription')}
        confirmText={t('tasks.dialog.startConfirm')}
        onConfirm={handleStartTask}
        isLoading={startTaskMutation.isPending}
      />

      {/* Complete Task Dialog with Date Input */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('tasks.dialog.completeTitle')}</DialogTitle>
            <DialogDescription>
              {t('tasks.dialog.completeDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="completionDate">{t('tasks.dialog.completionDateLabel')}</Label>
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
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleCompleteTask}
              disabled={completeTaskMutation.isPending || !completionDate}
            >
              {completeTaskMutation.isPending ? t('tasks.dialog.completing') : t('tasks.dialog.completeConfirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
