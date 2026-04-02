import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { expenseKeys, useAllFarmerExpenses } from "@/entities/expense";
import { useSeasonEmployees } from "@/entities/labor";
import {
  LOG_TYPES,
  useCreateFieldLog,
  useFieldLogsBySeason,
} from "@/entities/field-log";
import { harvestKeys, useAllFarmerHarvests } from "@/entities/harvest";
import { useSeasonById } from "@/entities/season";
import { useCreateTask, useTasksBySeason } from "@/entities/task";
import { ExpenseFormModal } from "@/features/farmer/expense-management/components/ExpenseFormModal";
import { useExpenseManagement } from "@/features/farmer/expense-management/hooks/useExpenseManagement";
import { AddBatchDialog } from "@/features/farmer/harvests/components/AddBatchDialog";
import { useHarvestManagement } from "@/features/farmer/harvests/hooks/useHarvestManagement";
import { CreateTaskDialog } from "@/features/farmer/tasks/components/CreateTaskDialog";
import { useI18n } from "@/hooks/useI18n";
import { useSeason } from "@/shared/contexts";
import {
  AlertCircle,
  BarChart3,
  Beaker,
  Calendar,
  ClipboardList,
  DollarSign,
  Droplets,
  FileText,
  PackageCheck,
  Sprout,
  TestTubeDiagonal,
  Wheat,
} from "lucide-react";
import { type ComponentType, useCallback, useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleDateString("vi-VN");
  } catch {
    return value;
  }
};

const getSeasonStatusLabel = (status?: string) => {
  switch (status) {
    case "PLANNED":
      return "Lên kế hoạch";
    case "ACTIVE":
      return "Đang canh tác";
    case "COMPLETED":
      return "Hoàn thành";
    case "CANCELLED":
      return "Đã hủy";
    case "ARCHIVED":
      return "Lưu trữ";
    default:
      return "Không xác định";
  }
};

const getSeasonStatusClassName = (status?: string) => {
  switch (status) {
    case "PLANNED":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "ACTIVE":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "COMPLETED":
      return "bg-green-100 text-green-700 border-green-200";
    case "CANCELLED":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const getHarvestWorkflowLabel = (progressPercent: number) => {
  if (progressPercent >= 100) return "Đã thu hoạch xong";
  if (progressPercent > 0) return "Đang thu hoạch";
  return "Chưa thu hoạch";
};

const WORKSPACE_MODULE_TABS = [
  { key: "tasks", path: "tasks", labelKey: "nav.tasks", fallbackLabel: "Cong viec", icon: ClipboardList },
  { key: "field-logs", path: "field-logs", labelKey: "nav.fieldLogs", fallbackLabel: "Nhat ky dong ruong", icon: FileText },
  { key: "expenses", path: "expenses", labelKey: "nav.expenses", fallbackLabel: "Chi phi", icon: DollarSign },
  { key: "harvest", path: "harvest", labelKey: "nav.harvest", fallbackLabel: "Thu hoach", icon: Wheat },
  { key: "nutrient-inputs", path: "nutrient-inputs", labelKey: "nav.nutrientInputs", fallbackLabel: "Nutrient Inputs", icon: Beaker },
  { key: "irrigation-water-analyses", path: "irrigation-water-analyses", labelKey: "nav.irrigationWaterAnalysis", fallbackLabel: "Irrigation Analysis", icon: Droplets },
  { key: "soil-tests", path: "soil-tests", labelKey: "nav.soilTests", fallbackLabel: "Soil Tests", icon: TestTubeDiagonal },
  { key: "reports", path: "reports", labelKey: "nav.reports", fallbackLabel: "Bao cao", icon: BarChart3 },
] as const;

const getTodayDate = () => new Date().toISOString().split("T")[0];

interface FieldLogFormState {
  logDate: string;
  logType: string;
  notes: string;
}

const initialFieldLogFormState = (): FieldLogFormState => ({
  logDate: getTodayDate(),
  logType: "",
  notes: "",
});

export function SeasonWorkspaceLayout() {
  const { t } = useI18n();
  const { seasonId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { selectedSeason, setSelectedSeasonId } = useSeason();

  const seasonIdNumber = Number(seasonId);
  const hasValidSeasonId = Number.isFinite(seasonIdNumber) && seasonIdNumber > 0;
  const scopedSeasonId = hasValidSeasonId ? seasonIdNumber : 0;

  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isFieldLogDialogOpen, setIsFieldLogDialogOpen] = useState(false);
  const [fieldLogFormData, setFieldLogFormData] = useState<FieldLogFormState>(initialFieldLogFormState);

  const { data: seasonDetail, isLoading: isSeasonLoading } = useSeasonById(seasonIdNumber, {
    enabled: hasValidSeasonId,
  });

  const { data: tasksData } = useTasksBySeason(
    seasonIdNumber,
    {
      page: 0,
      size: 200,
      sortBy: "dueDate",
      sortDirection: "asc",
    },
    { enabled: hasValidSeasonId }
  );

  const { data: expensesData } = useAllFarmerExpenses(
    {
      seasonId: seasonIdNumber,
      page: 0,
      size: 1,
    },
    { enabled: hasValidSeasonId }
  );

  const { data: logsData } = useFieldLogsBySeason(
    seasonIdNumber,
    {
      page: 0,
      size: 1,
    },
    { enabled: hasValidSeasonId }
  );

  const { data: harvestData } = useAllFarmerHarvests(
    {
      seasonId: seasonIdNumber,
      page: 0,
      size: 200,
    },
    { enabled: hasValidSeasonId }
  );

  const { data: seasonEmployeesData } = useSeasonEmployees(
    scopedSeasonId,
    { page: 0, size: 200 },
    { enabled: hasValidSeasonId }
  );

  const {
    isAddExpenseOpen,
    setIsAddExpenseOpen,
    selectedExpense,
    selectedSeason: expenseSelectedSeason,
    setSelectedSeason: setExpenseSelectedSeason,
    formData: expenseFormData,
    setFormData: setExpenseFormData,
    showValidationErrors: showExpenseValidationErrors,
    seasonOptions,
    taskOptions,
    supplierOptions,
    isLoadingTasks: isLoadingExpenseTasks,
    handleTaskChange: handleExpenseTaskChange,
    handleAddExpense,
    resetForm: resetExpenseForm,
    handleOpenAddExpense,
  } = useExpenseManagement();

  const {
    selectedSeason: harvestSelectedSeason,
    setSelectedSeason: setHarvestSelectedSeason,
    isAddBatchOpen,
    setIsAddBatchOpen,
    formData: harvestFormData,
    setFormData: setHarvestFormData,
    handleAddBatch,
    resetForm: resetHarvestForm,
  } = useHarvestManagement();

  const createTaskMutation = useCreateTask(scopedSeasonId, {
    onSuccess: () => {
      toast.success("Đã tạo công việc");
      setIsTaskDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Không thể tạo công việc");
    },
  });

  const resetFieldLogForm = useCallback(() => {
    setFieldLogFormData(initialFieldLogFormState());
  }, []);

  const createFieldLogMutation = useCreateFieldLog(scopedSeasonId, {
    onSuccess: () => {
      toast.success(t("fieldLogs.toast.createSuccess"));
      setIsFieldLogDialogOpen(false);
      resetFieldLogForm();
    },
    onError: (error) => {
      toast.error(error.message || t("fieldLogs.toast.createError"));
    },
  });

  useEffect(() => {
    if (!hasValidSeasonId) return;
    if (selectedSeason?.id === seasonIdNumber) return;
    setSelectedSeasonId(seasonIdNumber);
  }, [hasValidSeasonId, seasonIdNumber, selectedSeason?.id, setSelectedSeasonId]);

  useEffect(() => {
    if (!hasValidSeasonId) return;

    const scopedIdAsString = String(seasonIdNumber);
    if (expenseSelectedSeason !== scopedIdAsString) {
      setExpenseSelectedSeason(scopedIdAsString);
    }
    if (harvestSelectedSeason !== scopedIdAsString) {
      setHarvestSelectedSeason(scopedIdAsString);
    }
  }, [
    expenseSelectedSeason,
    harvestSelectedSeason,
    hasValidSeasonId,
    seasonIdNumber,
    setExpenseSelectedSeason,
    setHarvestSelectedSeason,
  ]);

  const season = seasonDetail ?? selectedSeason ?? null;
  const tasks = tasksData?.items ?? [];
  const expensesCount = expensesData?.totalElements ?? 0;
  const logsCount = logsData?.totalElements ?? 0;
  const harvestBatches = harvestData?.items ?? [];
  const harvestCount = harvestData?.totalElements ?? harvestBatches.length;

  const pendingTasks = tasks.filter((task) => task.status === "PENDING").length;
  const inProgressTasks = tasks.filter((task) => task.status === "IN_PROGRESS").length;
  const overdueTasks = tasks.filter((task) => task.status === "OVERDUE").length;
  const completedTasks = tasks.filter((task) => task.status === "DONE").length;

  const upcomingTask = useMemo(() => {
    const nextTask = [...tasks]
      .filter((task) => task.status !== "DONE" && !!task.dueDate)
      .sort((a, b) => String(a.dueDate).localeCompare(String(b.dueDate)))[0];

    if (!nextTask) return null;
    return `${nextTask.title} (${formatDate(nextTask.dueDate)})`;
  }, [tasks]);

  const uniqueTaskPlots = useMemo(
    () => (season?.plotName ? [season.plotName] : []),
    [season?.plotName]
  );

  const taskAssigneeOptions = useMemo(
    () =>
      (seasonEmployeesData?.items ?? [])
        .filter((employee) => employee.active !== false && !!employee.employeeUserId)
        .map((employee) => ({
          userId: employee.employeeUserId,
          displayName:
            employee.employeeName ||
            employee.employeeUsername ||
            employee.employeeEmail ||
            `Employee #${employee.employeeUserId}`,
        })),
    [seasonEmployeesData]
  );

  const totalHarvestedKg = harvestBatches.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
  const expectedYieldKg = season?.expectedYieldKg ?? 0;
  const harvestProgressPercent =
    expectedYieldKg > 0
      ? Math.min(100, Math.round((totalHarvestedKg / expectedYieldKg) * 100))
      : harvestCount === 0
        ? 0
        : season?.status === "COMPLETED"
          ? 100
          : 50;

  const harvestWorkflowLabel = getHarvestWorkflowLabel(harvestProgressPercent);

  const handleQuickTaskCreate = useCallback(
    (data: {
      title: string;
      plannedDate: string;
      dueDate: string;
      description?: string;
      assigneeUserId?: number;
    }) => {
      if (!hasValidSeasonId) {
        toast.error("Mùa vụ không hợp lệ.");
        return;
      }

      const title = data.title.trim();
      if (!title) {
        toast.error(t("tasks.validation.titleRequired"));
        return;
      }

      if (!data.dueDate) {
        toast.error(t("tasks.validation.dueDateRequired"));
        return;
      }

      createTaskMutation.mutate({
        title,
        plannedDate: data.plannedDate || data.dueDate,
        dueDate: data.dueDate,
        description: data.description,
        assigneeUserId: data.assigneeUserId,
      });
    },
    [createTaskMutation, hasValidSeasonId, t]
  );

  const handleOpenExpenseModal = useCallback(() => {
    if (!hasValidSeasonId) return;
    setExpenseSelectedSeason(String(seasonIdNumber));
    handleOpenAddExpense();
    setExpenseFormData((prev) => ({
      ...prev,
      linkedSeasonId: seasonIdNumber,
      linkedSeason: season?.seasonName ?? prev.linkedSeason,
      linkedPlotId: season?.plotId ?? prev.linkedPlotId,
    }));
  }, [
    handleOpenAddExpense,
    hasValidSeasonId,
    season?.plotId,
    season?.seasonName,
    seasonIdNumber,
    setExpenseFormData,
    setExpenseSelectedSeason,
  ]);

  const handleExpenseModalOpenChange = useCallback(
    (open: boolean) => {
      setIsAddExpenseOpen(open);
      if (!open) {
        queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      }
    },
    [queryClient, setIsAddExpenseOpen]
  );

  const handleOpenFieldLogDialog = useCallback(() => {
    if (!hasValidSeasonId) return;
    resetFieldLogForm();
    setIsFieldLogDialogOpen(true);
  }, [hasValidSeasonId, resetFieldLogForm]);

  const handleSubmitFieldLog = useCallback(() => {
    if (!fieldLogFormData.logDate || !fieldLogFormData.logType) {
      toast.error(t("fieldLogs.validation.fillRequired"));
      return;
    }

    const selectedDate = new Date(fieldLogFormData.logDate);
    const seasonStartDate = season?.startDate ? new Date(season.startDate) : null;
    const seasonEndDate = season?.endDate
      ? new Date(season.endDate)
      : season?.plannedHarvestDate
        ? new Date(season.plannedHarvestDate)
        : null;

    if (seasonStartDate && selectedDate < seasonStartDate) {
      toast.error(
        `Ngày ghi phải sau hoặc bằng ngày bắt đầu mùa vụ (${formatDate(season?.startDate)})`
      );
      return;
    }

    if (seasonEndDate && selectedDate > seasonEndDate) {
      toast.error(
        `Ngày ghi phải trước hoặc bằng ngày kết thúc mùa vụ (${formatDate(season?.endDate ?? season?.plannedHarvestDate)})`
      );
      return;
    }

    createFieldLogMutation.mutate({
      logDate: fieldLogFormData.logDate,
      logType: fieldLogFormData.logType,
      notes: fieldLogFormData.notes.trim() || undefined,
    });
  }, [createFieldLogMutation, fieldLogFormData, season?.endDate, season?.plannedHarvestDate, season?.startDate, t]);

  const handleOpenHarvestModal = useCallback(() => {
    if (!hasValidSeasonId) return;
    setHarvestSelectedSeason(String(seasonIdNumber));
    resetHarvestForm();
    setIsAddBatchOpen(true);
  }, [hasValidSeasonId, resetHarvestForm, seasonIdNumber, setHarvestSelectedSeason, setIsAddBatchOpen]);

  const handleHarvestModalOpenChange = useCallback(
    (open: boolean) => {
      setIsAddBatchOpen(open);
      if (!open) {
        queryClient.invalidateQueries({ queryKey: harvestKeys.lists() });
      }
    },
    [queryClient, setIsAddBatchOpen]
  );

  if (!hasValidSeasonId) {
    return (
      <div className="p-6">
        <Card className="border border-destructive/20 bg-destructive/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm text-foreground">Mùa vụ không hợp lệ.</p>
                <Button variant="outline" onClick={() => navigate("/farmer/seasons")}>
                  Quay lại danh sách mùa vụ
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Card className="border border-border rounded-2xl shadow-sm">
        <CardContent className="p-6 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Workspace mùa vụ</p>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl text-foreground">
                  {isSeasonLoading ? t("common.loading") : season?.seasonName ?? `Mùa vụ #${seasonIdNumber}`}
                </h1>
                <Badge className={getSeasonStatusClassName(season?.status)}>
                  {getSeasonStatusLabel(season?.status)}
                </Badge>
                <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                  {harvestWorkflowLabel}
                </Badge>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => setIsTaskDialogOpen(true)}>
                <ClipboardList className="w-4 h-4 mr-2" />
                Thêm công việc
              </Button>
              <Button variant="outline" onClick={handleOpenExpenseModal}>
                <DollarSign className="w-4 h-4 mr-2" />
                Ghi chi phí
              </Button>
              <Button variant="outline" onClick={handleOpenFieldLogDialog}>
                <FileText className="w-4 h-4 mr-2" />
                Tạo nhật ký
              </Button>
              <Button variant="outline" onClick={handleOpenHarvestModal}>
                <Wheat className="w-4 h-4 mr-2" />
                Thu hoạch
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            <div className="rounded-xl border border-border p-4 bg-card">
              <p className="text-xs text-muted-foreground mb-1">Cây trồng</p>
              <p className="text-sm text-foreground flex items-center gap-2">
                <Sprout className="w-4 h-4 text-emerald-600" />
                {season?.cropName ?? "-"}
              </p>
            </div>
            <div className="rounded-xl border border-border p-4 bg-card">
              <p className="text-xs text-muted-foreground mb-1">Lô đất</p>
              <p className="text-sm text-foreground">{season?.plotName ?? "-"}</p>
            </div>
            <div className="rounded-xl border border-border p-4 bg-card">
              <p className="text-xs text-muted-foreground mb-1">Thời gian mùa vụ</p>
              <p className="text-sm text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                {formatDate(season?.startDate)} - {formatDate(season?.endDate ?? season?.plannedHarvestDate)}
              </p>
            </div>
            <div className="rounded-xl border border-border p-4 bg-card">
              <p className="text-xs text-muted-foreground mb-1">Công việc sắp tới</p>
              <p className="text-sm text-foreground line-clamp-2">{upcomingTask ?? "Không có công việc sắp tới"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
            <MetricCard icon={ClipboardList} label="Sắp làm" value={pendingTasks} />
            <MetricCard icon={PackageCheck} label="Đang làm" value={inProgressTasks} />
            <MetricCard icon={AlertCircle} label="Trễ hạn" value={overdueTasks} />
            <MetricCard icon={PackageCheck} label="Hoàn thành" value={completedTasks} />
            <MetricCard icon={DollarSign} label="Chi phí" value={expensesCount} />
            <MetricCard icon={FileText} label="Nhật ký" value={logsCount} />
            <MetricCard icon={Wheat} label="Đợt thu hoạch" value={harvestCount} />
            <MetricCard icon={Sprout} label="Sản lượng thu" value={Math.round(totalHarvestedKg)} suffix="kg" />
          </div>

          <div className="rounded-xl border border-border p-4 bg-card">
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="text-sm text-foreground">Tiến độ thu hoạch (ước tính theo sản lượng)</p>
              <p className="text-sm text-foreground">{harvestProgressPercent}%</p>
            </div>
            <Progress value={harvestProgressPercent} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Đã thu: {Math.round(totalHarvestedKg)} kg
              {expectedYieldKg > 0 ? ` / Mục tiêu: ${Math.round(expectedYieldKg)} kg` : ""}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        {WORKSPACE_MODULE_TABS.filter((tab) => tab.path !== "reports" || harvestProgressPercent >= 100).map((tab) => (
          <NavLink
            key={tab.key}
            to={`/farmer/seasons/${seasonIdNumber}/workspace/${tab.path}`}
          >
            {({ isActive }) => {
              const Icon = tab.icon;
              const translatedLabel = t(tab.labelKey);
              const label = translatedLabel === tab.labelKey ? tab.fallbackLabel : translatedLabel;
              return (
                <Button
                  variant={isActive ? "default" : "outline"}
                  className="rounded-xl"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </Button>
              );
            }}
          </NavLink>
        ))}
      </div>

      <CreateTaskDialog
        open={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        onCreateTask={handleQuickTaskCreate}
        seasonId={scopedSeasonId}
        hideSeasonSelector={true}
        uniquePlots={uniqueTaskPlots}
        assigneeOptions={taskAssigneeOptions}
      />

      <ExpenseFormModal
        isOpen={isAddExpenseOpen}
        setIsOpen={handleExpenseModalOpenChange}
        selectedExpense={selectedExpense}
        formData={expenseFormData}
        setFormData={setExpenseFormData}
        handleAddExpense={handleAddExpense}
        resetForm={resetExpenseForm}
        showValidationErrors={showExpenseValidationErrors}
        seasonOptions={seasonOptions}
        taskOptions={taskOptions}
        supplierOptions={supplierOptions}
        isLoadingTasks={isLoadingExpenseTasks}
        onTaskChange={handleExpenseTaskChange}
        isSeasonLocked={true}
        lockedSeasonLabel={season?.seasonName}
      />

      <Dialog
        open={isFieldLogDialogOpen}
        onOpenChange={(open) => {
          setIsFieldLogDialogOpen(open);
          if (!open) {
            resetFieldLogForm();
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("fieldLogs.dialog.createTitle")}</DialogTitle>
            <DialogDescription>
              {t("fieldLogs.dialog.createDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="workspace-log-date">
                {t("fieldLogs.form.logDate")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="workspace-log-date"
                type="date"
                value={fieldLogFormData.logDate}
                onChange={(event) => setFieldLogFormData((prev) => ({ ...prev, logDate: event.target.value }))}
              />
              {season && (
                <p className="text-xs text-muted-foreground">
                  Season range: {formatDate(season.startDate)} - {formatDate(season.endDate ?? season.plannedHarvestDate)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="workspace-log-type">
                {t("fieldLogs.form.logType")} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={fieldLogFormData.logType}
                onValueChange={(value) => setFieldLogFormData((prev) => ({ ...prev, logType: value }))}
              >
                <SelectTrigger id="workspace-log-type" className="rounded-xl border-border">
                  <SelectValue placeholder={t("fieldLogs.form.selectType")} />
                </SelectTrigger>
                <SelectContent>
                  {LOG_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="workspace-log-notes">{t("fieldLogs.form.notes")}</Label>
              <Textarea
                id="workspace-log-notes"
                rows={4}
                placeholder={t("fieldLogs.form.notesPlaceholder")}
                value={fieldLogFormData.notes}
                onChange={(event) => setFieldLogFormData((prev) => ({ ...prev, notes: event.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsFieldLogDialogOpen(false);
                resetFieldLogForm();
              }}
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleSubmitFieldLog}
              disabled={createFieldLogMutation.isPending}
            >
              {createFieldLogMutation.isPending ? `${t("common.loading")}...` : t("common.create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddBatchDialog
        open={isAddBatchOpen}
        onOpenChange={handleHarvestModalOpenChange}
        formData={harvestFormData}
        onFormChange={setHarvestFormData}
        onSubmit={handleAddBatch}
        isSeasonLocked={true}
        lockedSeasonLabel={season?.seasonName}
        onCancel={() => {
          handleHarvestModalOpenChange(false);
          resetHarvestForm();
        }}
      />

      <Outlet />
    </div>
  );
}

interface MetricCardProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: number;
  suffix?: string;
}

function MetricCard({ icon: Icon, label, value, suffix }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-border p-3 bg-card">
      <div className="flex items-center gap-2 text-muted-foreground mb-1">
        <Icon className="w-4 h-4" />
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-base text-foreground">
        {value}
        {suffix ? ` ${suffix}` : ""}
      </p>
    </div>
  );
}
