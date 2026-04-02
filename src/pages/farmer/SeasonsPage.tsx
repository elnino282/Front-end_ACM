import { useI18n } from "@/hooks/useI18n";
import { usePreferences } from "@/shared/contexts";
import { convertWeight, getWeightUnitLabel, useDebounce } from "@/shared/lib";
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
} from "@/shared/ui";
import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { Calendar, Plus, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { farmsApi } from "../../api/farmsApi";
import { seasonsApi } from "../../api/seasonsApi";
import type { SeasonSearchParams } from "../../types/Season";

export function SeasonsPage() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const { preferences } = usePreferences();
  const unitLabel = getWeightUnitLabel(preferences.weightUnit);
  const formatYieldValue = (valueKg?: number | null) => {
    if (valueKg == null) return "-";
    const converted = convertWeight(valueKg, preferences.weightUnit);
    const maximumFractionDigits = preferences.weightUnit === "G" ? 0 : 2;
    return new Intl.NumberFormat(preferences.locale, {
      maximumFractionDigits,
    }).format(converted);
  };
  const [filters, setFilters] = useState<SeasonSearchParams>({
    page: 0,
    size: 20,
  });
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);

  // Dialog states
  const [startConfirmOpen, setStartConfirmOpen] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(null);
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  // Fetch seasons with keepPreviousData to prevent empty flash
  const {
    data: seasonsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["seasons", { ...filters, q: debouncedSearch || undefined }],
    queryFn: () =>
      seasonsApi.searchSeasons({ ...filters, q: debouncedSearch || undefined }),
    placeholderData: keepPreviousData,
  });

  // Fetch farms for filter
  const { data: farms } = useQuery({
    queryKey: ["farms"],
    queryFn: () => farmsApi.getMyFarms(),
  });

  // Query key helper
  const currentQueryKey = [
    "seasons",
    { ...filters, q: debouncedSearch || undefined },
  ];

  // Start season mutation with optimistic update
  const startSeasonMutation = useMutation({
    mutationFn: (id: number) => seasonsApi.startSeason(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["seasons"] });
      const previousSeasons = queryClient.getQueryData(currentQueryKey);

      // Optimistic update: change status to ACTIVE
      queryClient.setQueryData(currentQueryKey, (old: any) =>
        old
          ? {
              ...old,
              content: old.content?.map((s: any) =>
                s.id === id ? { ...s, status: "ACTIVE" } : s,
              ),
            }
          : old,
      );
      return { previousSeasons };
    },
    onError: (_err, _id, context: any) => {
      if (context?.previousSeasons) {
        queryClient.setQueryData(currentQueryKey, context.previousSeasons);
      }
      toast.error(t('seasons.toast.startError'));
    },
    onSuccess: () => {
      toast.success(t('seasons.toast.startSuccess'));
      setStartConfirmOpen(false);
      setSelectedSeasonId(null);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["seasons"] });
    },
  });

  // Complete season mutation with optimistic update
  const completeSeasonMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      seasonsApi.completeSeason(id, data),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ["seasons"] });
      const previousSeasons = queryClient.getQueryData(currentQueryKey);

      queryClient.setQueryData(currentQueryKey, (old: any) =>
        old
          ? {
              ...old,
              content: old.content?.map((s: any) =>
                s.id === id ? { ...s, status: "COMPLETED" } : s,
              ),
            }
          : old,
      );
      return { previousSeasons };
    },
    onError: (error: any, _variables, context: any) => {
      if (context?.previousSeasons) {
        queryClient.setQueryData(currentQueryKey, context.previousSeasons);
      }
      toast.error(error.response?.data?.message || t('seasons.toast.completeError'));
    },
    onSuccess: () => {
      toast.success(t('seasons.toast.completeSuccess'));
      setCompleteDialogOpen(false);
      setSelectedSeasonId(null);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["seasons"] });
    },
  });

  // Cancel season mutation with optimistic update
  const cancelSeasonMutation = useMutation({
    mutationFn: (id: number) => seasonsApi.cancelSeason(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["seasons"] });
      const previousSeasons = queryClient.getQueryData(currentQueryKey);

      queryClient.setQueryData(currentQueryKey, (old: any) =>
        old
          ? {
              ...old,
              content: old.content?.map((s: any) =>
                s.id === id ? { ...s, status: "CANCELLED" } : s,
              ),
            }
          : old,
      );
      return { previousSeasons };
    },
    onError: (_err, _id, context: any) => {
      if (context?.previousSeasons) {
        queryClient.setQueryData(currentQueryKey, context.previousSeasons);
      }
      toast.error(t('seasons.toast.cancelError'));
    },
    onSuccess: () => {
      toast.success(t('seasons.toast.cancelSuccess'));
      setCancelConfirmOpen(false);
      setSelectedSeasonId(null);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["seasons"] });
    },
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      PLANNED: "outline",
      ACTIVE: "default",
      COMPLETED: "secondary",
      CANCELLED: "destructive",
      ARCHIVED: "secondary",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
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
    setEndDate(new Date().toISOString().split("T")[0]);
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
            title={t('seasons.title')}
            subtitle={t('seasons.subtitle')}
            actions={
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                {t('seasons.createButton')}
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
                placeholder={t('seasons.searchPlaceholder')}
                className="pl-10 rounded-xl border-border focus:border-primary"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            <Select
              value={filters.farmId?.toString() || "all"}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  farmId: value === "all" ? undefined : parseInt(value),
                  page: 0,
                }))
              }
            >
              <SelectTrigger className="rounded-xl border-border w-[180px]">
                <SelectValue placeholder={t('seasons.filters.allFarms')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('seasons.filters.allFarms')}</SelectItem>
                {farms?.map((farm) => (
                  <SelectItem key={farm.id} value={farm.id.toString()}>
                    {farm.farmName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.status || "all"}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  status: value === "all" ? undefined : (value as any),
                  page: 0,
                }))
              }
            >
              <SelectTrigger className="rounded-xl border-border w-[180px]">
                <SelectValue placeholder={t('seasons.filters.allStatuses')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('seasons.filters.allStatuses')}</SelectItem>
                <SelectItem value="PLANNED">{t('seasons.status.planned')}</SelectItem>
                <SelectItem value="ACTIVE">{t('seasons.status.active')}</SelectItem>
                <SelectItem value="COMPLETED">{t('seasons.status.completed')}</SelectItem>
                <SelectItem value="CANCELLED">{t('seasons.status.cancelled')}</SelectItem>
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
            loadingText={t('seasons.loading')}
            emptyIcon={<Calendar className="w-6 h-6 text-[#777777]" />}
            emptyTitle={t('seasons.empty.title')}
            emptyDescription={t('seasons.empty.description')}
            emptyAction={
              <Button className="mt-2">
                <Plus className="w-4 h-4 mr-2" />
                {t('seasons.createButton')}
              </Button>
            }
          >
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('seasons.table.name')}</TableHead>
                    <TableHead>{t('seasons.table.crop')}</TableHead>
                    <TableHead>{t('seasons.table.plot')}</TableHead>
                    <TableHead>{t('seasons.table.startDate')}</TableHead>
                    <TableHead>{t('seasons.table.status')}</TableHead>
                    <TableHead>{t('seasons.table.expectedYield')} ({unitLabel})</TableHead>
                    <TableHead className="text-right">{t('seasons.table.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {seasons.map((season) => (
                    <TableRow key={season.id}>
                      <TableCell className="font-medium">
                        {season.seasonName}
                      </TableCell>
                      <TableCell>
                        {season.cropName || `Crop ${season.cropId}`}
                      </TableCell>
                      <TableCell>
                        {season.plotName || `Plot ${season.plotId}`}
                      </TableCell>
                      <TableCell>{season.startDate}</TableCell>
                      <TableCell>{getStatusBadge(season.status)}</TableCell>
                      <TableCell>
                        {formatYieldValue(season.expectedYieldKg)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {season.status === "PLANNED" && (
                            <Button
                              size="sm"
                              onClick={() => handleOpenStartConfirm(season.id)}
                              disabled={startSeasonMutation.isPending}
                            >
                              {t('seasons.actions.start')}
                            </Button>
                          )}
                          {season.status === "ACTIVE" && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() =>
                                handleOpenCompleteDialog(season.id)
                              }
                              disabled={completeSeasonMutation.isPending}
                            >
                              {t('seasons.actions.complete')}
                            </Button>
                          )}
                          {(season.status === "PLANNED" ||
                            season.status === "ACTIVE") && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleOpenCancelConfirm(season.id)}
                              disabled={cancelSeasonMutation.isPending}
                            >
                              {t('seasons.actions.cancel')}
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
                onPageChange={(page) =>
                  setFilters((prev) => ({ ...prev, page }))
                }
                onPageSizeChange={(size) =>
                  setFilters((prev) => ({ ...prev, size, page: 0 }))
                }
              />
            )}
          </AsyncState>
        </CardContent>
      </Card>

      {/* Start Season Confirmation Dialog */}
      <ConfirmDialog
        open={startConfirmOpen}
        onOpenChange={setStartConfirmOpen}
        title={t('seasons.dialog.startTitle')}
        description={t('seasons.dialog.startDescription')}
        confirmText={t('seasons.dialog.startConfirm')}
        onConfirm={handleStartSeason}
        isLoading={startSeasonMutation.isPending}
      />

      {/* Cancel Season Confirmation Dialog */}
      <ConfirmDialog
        open={cancelConfirmOpen}
        onOpenChange={setCancelConfirmOpen}
        title={t('seasons.dialog.cancelTitle')}
        description={t('seasons.dialog.cancelDescription')}
        confirmText={t('seasons.dialog.cancelConfirm')}
        variant="destructive"
        onConfirm={handleCancelSeason}
        isLoading={cancelSeasonMutation.isPending}
      />

      {/* Complete Season Dialog with Date Input */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('seasons.dialog.completeTitle')}</DialogTitle>
            <DialogDescription>
              {t('seasons.dialog.completeDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="endDate">{t('seasons.dialog.endDateLabel')}</Label>
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
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleCompleteSeason}
              disabled={completeSeasonMutation.isPending || !endDate}
            >
              {completeSeasonMutation.isPending
                ? t('seasons.dialog.completing')
                : t('seasons.dialog.completeConfirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
