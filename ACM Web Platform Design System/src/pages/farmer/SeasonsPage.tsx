import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Calendar, Search } from 'lucide-react';
import { seasonsApi } from '../../api/seasonsApi';
import { farmsApi } from '../../api/farmsApi';
import type { SeasonSearchParams } from '../../types/Season';
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

export function SeasonsPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<SeasonSearchParams>({
    page: 0,
    size: 20,
  });
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);

  // Dialog states
  const [startConfirmOpen, setStartConfirmOpen] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(null);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  // Fetch seasons
  const {
    data: seasonsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['seasons', { ...filters, q: debouncedSearch || undefined }],
    queryFn: () => seasonsApi.searchSeasons({ ...filters, q: debouncedSearch || undefined }),
  });

  // Fetch farms for filter
  const { data: farms } = useQuery({
    queryKey: ['farms'],
    queryFn: () => farmsApi.getMyFarms(),
  });

  // Start season mutation
  const startSeasonMutation = useMutation({
    mutationFn: (id: number) => seasonsApi.startSeason(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seasons'] });
      toast.success('Season started successfully');
      setStartConfirmOpen(false);
      setSelectedSeasonId(null);
    },
    onError: () => {
      toast.error('Failed to start season');
    },
  });

  // Complete season mutation
  const completeSeasonMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      seasonsApi.completeSeason(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seasons'] });
      toast.success('Season completed successfully');
      setCompleteDialogOpen(false);
      setSelectedSeasonId(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to complete season');
    },
  });

  // Cancel season mutation
  const cancelSeasonMutation = useMutation({
    mutationFn: (id: number) => seasonsApi.cancelSeason(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seasons'] });
      toast.success('Season cancelled successfully');
      setCancelConfirmOpen(false);
      setSelectedSeasonId(null);
    },
    onError: () => {
      toast.error('Failed to cancel season');
    },
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      PLANNED: 'outline',
      ACTIVE: 'default',
      COMPLETED: 'secondary',
      CANCELLED: 'destructive',
      ARCHIVED: 'secondary',
    };
    return (
      <Badge variant={variants[status] || 'default'}>
        {status}
      </Badge>
    );
  };

  const handleOpenStartConfirm = (id: number) => {
    setSelectedSeasonId(id);
    setStartConfirmOpen(true);
  };

  const handleStartSeason = () => {
    if (selectedSeasonId) {
      startSeasonMutation.mutate(selectedSeasonId);
    }
  };

  const handleOpenCompleteDialog = (id: number) => {
    setSelectedSeasonId(id);
    setEndDate(new Date().toISOString().split('T')[0]);
    setCompleteDialogOpen(true);
  };

  const handleCompleteSeason = () => {
    if (selectedSeasonId && endDate) {
      completeSeasonMutation.mutate({
        id: selectedSeasonId,
        data: { endDate, forceComplete: true },
      });
    }
  };

  const handleOpenCancelConfirm = (id: number) => {
    setSelectedSeasonId(id);
    setCancelConfirmOpen(true);
  };

  const handleCancelSeason = () => {
    if (selectedSeasonId) {
      cancelSeasonMutation.mutate(selectedSeasonId);
    }
  };

  const seasons = seasonsData?.content ?? [];
  const totalElements = seasonsData?.totalElements ?? 0;
  const totalPages = seasonsData?.totalPages ?? 0;

  return (
    <PageContainer>
      <Card className="mb-6 border border-border rounded-xl shadow-sm">
        <CardContent className="px-6 py-4">
          <PageHeader
            className="mb-0"
            icon={<Calendar className="w-8 h-8" />}
            title="Seasons"
            subtitle="Manage your farming seasons and track progress"
            actions={
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Season
              </Button>
            }
          />
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="mb-6 border border-border rounded-xl shadow-sm">
        <CardContent className="px-6 py-4">
          <div className="flex flex-wrap items-center justify-start gap-4">
            <div className="relative w-[320px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search seasons..."
                className="pl-10 rounded-xl border-border focus:border-primary"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            <Select
              value={filters.farmId?.toString() || 'all'}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  farmId: value === 'all' ? undefined : parseInt(value),
                  page: 0,
                }))
              }
            >
            <SelectTrigger className="rounded-xl border-border w-[180px]">
              <SelectValue placeholder="All Farms" />
            </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Farms</SelectItem>
                {farms?.map((farm) => (
                  <SelectItem key={farm.id} value={farm.id.toString()}>
                    {farm.farmName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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
            <SelectTrigger className="rounded-xl border-border w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PLANNED">Planned</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Seasons Table */}
      <Card>
      <CardContent className="px-6 py-4">
          <AsyncState
            isLoading={isLoading}
            isEmpty={seasons.length === 0}
            error={error as Error | null}
            onRetry={() => refetch()}
            loadingText="Loading seasons..."
            emptyIcon={<Calendar className="w-6 h-6 text-[#777777]" />}
            emptyTitle="No seasons found"
            emptyDescription="Create your first season to start managing your farm activities."
            emptyAction={
              <Button className="mt-2">
                <Plus className="w-4 h-4 mr-2" />
                Create Season
              </Button>
            }
          >
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Season Name</TableHead>
                    <TableHead>Crop</TableHead>
                    <TableHead>Plot</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expected Yield (kg)</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {seasons.map((season) => (
                    <TableRow key={season.id}>
                      <TableCell className="font-medium">{season.seasonName}</TableCell>
                      <TableCell>{season.cropName || `Crop ${season.cropId}`}</TableCell>
                      <TableCell>{season.plotName || `Plot ${season.plotId}`}</TableCell>
                      <TableCell>{season.startDate}</TableCell>
                      <TableCell>{getStatusBadge(season.status)}</TableCell>
                      <TableCell>{season.expectedYieldKg?.toFixed(2) || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {season.status === 'PLANNED' && (
                            <Button
                              size="sm"
                              onClick={() => handleOpenStartConfirm(season.id)}
                              disabled={startSeasonMutation.isPending}
                            >
                              Start
                            </Button>
                          )}
                          {season.status === 'ACTIVE' && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleOpenCompleteDialog(season.id)}
                              disabled={completeSeasonMutation.isPending}
                            >
                              Complete
                            </Button>
                          )}
                          {(season.status === 'PLANNED' || season.status === 'ACTIVE') && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleOpenCancelConfirm(season.id)}
                              disabled={cancelSeasonMutation.isPending}
                            >
                              Cancel
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

      {/* Start Season Confirmation Dialog */}
      <ConfirmDialog
        open={startConfirmOpen}
        onOpenChange={setStartConfirmOpen}
        title="Start Season"
        description="Are you sure you want to start this season? The season status will be changed to 'Active'."
        confirmText="Start Season"
        onConfirm={handleStartSeason}
        isLoading={startSeasonMutation.isPending}
      />

      {/* Cancel Season Confirmation Dialog */}
      <ConfirmDialog
        open={cancelConfirmOpen}
        onOpenChange={setCancelConfirmOpen}
        title="Cancel Season"
        description="Are you sure you want to cancel this season? This action cannot be undone."
        confirmText="Cancel Season"
        variant="destructive"
        onConfirm={handleCancelSeason}
        isLoading={cancelSeasonMutation.isPending}
      />

      {/* Complete Season Dialog with Date Input */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Season</DialogTitle>
            <DialogDescription>
              Enter the end date to mark this season as completed.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCompleteDialogOpen(false)}
              disabled={completeSeasonMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCompleteSeason}
              disabled={completeSeasonMutation.isPending || !endDate}
            >
              {completeSeasonMutation.isPending ? 'Completing...' : 'Complete Season'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
