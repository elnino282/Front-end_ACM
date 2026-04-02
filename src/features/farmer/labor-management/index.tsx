import {
  useAddSeasonEmployee,
  useAssignTaskToEmployee,
  useEmployeeDirectory,
  useRecalculateSeasonPayroll,
  useRemoveSeasonEmployee,
  useSeasonEmployees,
  useSeasonPayrollRecords,
  useSeasonProgressLogs,
} from "@/entities/labor";
import { useTasksBySeason } from "@/entities/task";
import { useMySeasons } from "@/entities/season/api/hooks";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/ui";
import { Calendar, RefreshCw, Trash2, UserPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString("vi-VN");
  } catch {
    return value;
  }
};

const formatMoney = (value?: number | null) => {
  if (value === undefined || value === null) return "-";
  return value.toLocaleString("vi-VN");
};

const getTaskStatusLabel = (status?: string) => {
  switch (status) {
    case "PENDING":
      return "Chờ thực hiện";
    case "IN_PROGRESS":
      return "Đang thực hiện";
    case "DONE":
      return "Hoàn thành";
    case "OVERDUE":
      return "Quá hạn";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return status ?? "-";
  }
};

const getTaskStatusClassName = (status?: string) => {
  switch (status) {
    case "DONE":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "OVERDUE":
      return "bg-red-100 text-red-700 border-red-200";
    case "CANCELLED":
      return "bg-slate-100 text-slate-600 border-slate-200";
    default:
      return "bg-amber-100 text-amber-700 border-amber-200";
  }
};

export function LaborManagementPage() {
  // Season selection - local state with useMySeasons
  const { data: mySeasons, isLoading: isSeasonsLoading } = useMySeasons();
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(null);
  const seasonId = selectedSeasonId ?? 0;

  // Auto-select first season when data loads
  useEffect(() => {
    if (!isSeasonsLoading && mySeasons && mySeasons.length > 0 && selectedSeasonId === null) {
      setSelectedSeasonId(mySeasons[0].seasonId);
    }
  }, [isSeasonsLoading, mySeasons, selectedSeasonId]);

  const selectedSeasonName = useMemo(() => {
    if (!selectedSeasonId || !mySeasons) return null;
    const found = mySeasons.find((s) => s.seasonId === selectedSeasonId);
    return found ? `${found.seasonName}${found.status ? ` (${found.status})` : ""}` : null;
  }, [selectedSeasonId, mySeasons]);

  const [selectedDirectoryEmployeeId, setSelectedDirectoryEmployeeId] = useState<string>("");
  const [wagePerTask, setWagePerTask] = useState<string>("");
  const [taskAssigneeDraft, setTaskAssigneeDraft] = useState<Record<number, string>>({});

  const { data: employeeDirectoryData, isLoading: isEmployeeDirectoryLoading } = useEmployeeDirectory(
    { page: 0, size: 200 },
    { enabled: seasonId > 0 }
  );

  const { data: seasonEmployeesData, isLoading: isSeasonEmployeesLoading } = useSeasonEmployees(
    seasonId,
    { page: 0, size: 200 },
    { enabled: seasonId > 0 }
  );

  const { data: tasksData, isLoading: isTasksLoading } = useTasksBySeason(
    seasonId,
    { page: 0, size: 200, sortBy: "dueDate", sortDirection: "asc" },
    { enabled: seasonId > 0 }
  );

  const { data: progressData, isLoading: isProgressLoading } = useSeasonProgressLogs(
    seasonId,
    { page: 0, size: 100 },
    { enabled: seasonId > 0 }
  );

  const { data: payrollData, isLoading: isPayrollLoading } = useSeasonPayrollRecords(
    seasonId,
    { page: 0, size: 100 },
    { enabled: seasonId > 0 }
  );

  const addSeasonEmployeeMutation = useAddSeasonEmployee(seasonId, {
    onSuccess: () => {
      toast.success("Đã thêm nhân công vào mùa vụ");
      setSelectedDirectoryEmployeeId("");
      setWagePerTask("");
    },
    onError: (error) => toast.error(error.message || "Không thể thêm nhân công"),
  });

  const removeSeasonEmployeeMutation = useRemoveSeasonEmployee(seasonId, {
    onSuccess: () => toast.success("Đã xóa nhân công khỏi mùa vụ"),
    onError: (error) => toast.error(error.message || "Không thể xóa nhân công"),
  });

  const assignTaskMutation = useAssignTaskToEmployee(seasonId, {
    onSuccess: () => toast.success("Đã phân công công việc"),
    onError: (error) => toast.error(error.message || "Không thể phân công công việc"),
  });

  const recalculatePayrollMutation = useRecalculateSeasonPayroll(seasonId, {
    onSuccess: () => toast.success("Đã tính lại bảng lương"),
    onError: (error) => toast.error(error.message || "Không thể tính lại bảng lương"),
  });

  const seasonEmployees = seasonEmployeesData?.items ?? [];
  const tasks = tasksData?.items ?? [];
  const progressLogs = progressData?.items ?? [];
  const payrollRecords = payrollData?.items ?? [];

  const seasonEmployeeIds = useMemo(
    () => new Set(seasonEmployees.map((employee) => employee.employeeUserId)),
    [seasonEmployees]
  );

  const availableDirectoryEmployees = useMemo(
    () =>
      (employeeDirectoryData?.items ?? []).filter(
        (employee) => !seasonEmployeeIds.has(employee.userId)
      ),
    [employeeDirectoryData, seasonEmployeeIds]
  );

  const activeSeasonEmployees = useMemo(
    () =>
      seasonEmployees
        .filter((employee) => employee.active !== false)
        .map((employee) => ({
          userId: employee.employeeUserId,
          label:
            employee.employeeName ||
            employee.employeeUsername ||
            employee.employeeEmail ||
            `Employee #${employee.employeeUserId}`,
        })),
    [seasonEmployees]
  );

  const handleAddSeasonEmployee = () => {
    if (!selectedDirectoryEmployeeId) {
      toast.error("Vui lòng chọn nhân công");
      return;
    }

    const parsedWage = wagePerTask.trim().length ? Number(wagePerTask) : undefined;
    if (parsedWage !== undefined && (Number.isNaN(parsedWage) || parsedWage < 0)) {
      toast.error("Đơn giá theo task không hợp lệ");
      return;
    }

    addSeasonEmployeeMutation.mutate({
      employeeUserId: Number(selectedDirectoryEmployeeId),
      wagePerTask: parsedWage,
    });
  };

  const handleAssignTask = (taskId: number) => {
    const selectedAssigneeId = taskAssigneeDraft[taskId];
    if (!selectedAssigneeId) {
      toast.error("Vui lòng chọn nhân công để phân công");
      return;
    }

    assignTaskMutation.mutate({
      taskId,
      employeeUserId: Number(selectedAssigneeId),
    });
  };

  const isLoadingBase = isEmployeeDirectoryLoading || isSeasonEmployeesLoading;

  if (isSeasonsLoading) {
    return (
      <div className="p-6">
        <Card className="rounded-2xl border border-border">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Đang tải danh sách mùa vụ...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!mySeasons || mySeasons.length === 0) {
    return (
      <div className="p-6">
        <Card className="rounded-2xl border border-border">
          <CardContent className="p-6 space-y-3">
            <h2 className="text-lg text-foreground">Chưa có mùa vụ nào</h2>
            <p className="text-sm text-muted-foreground">
              Vui lòng tạo một mùa vụ trước khi quản lý nhân công.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Card className="rounded-2xl border border-border">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Quản lý Nhân công</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedSeasonName
                  ? `Mùa vụ hiện tại: ${selectedSeasonName}`
                  : "Chọn mùa vụ để bắt đầu"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <Select
                value={selectedSeasonId?.toString() ?? ""}
                onValueChange={(val) => setSelectedSeasonId(Number(val))}
              >
                <SelectTrigger className="w-[260px]">
                  <SelectValue placeholder="Chọn mùa vụ..." />
                </SelectTrigger>
                <SelectContent>
                  {mySeasons.map((season) => (
                    <SelectItem
                      key={season.seasonId}
                      value={season.seasonId.toString()}
                    >
                      {season.seasonName}{" "}
                      {season.status && `(${season.status})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="employees" className="space-y-4">
        <TabsList>
          <TabsTrigger value="employees">Danh sách nhân công</TabsTrigger>
          <TabsTrigger value="assignment">Phân công & tiến độ</TabsTrigger>
          <TabsTrigger value="payroll">Bảng lương</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <Card className="rounded-2xl border border-border">
            <CardHeader>
              <CardTitle className="text-base">Thêm nhân công vào mùa vụ</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Nhân công khả dụng</Label>
                <Select
                  value={selectedDirectoryEmployeeId}
                  onValueChange={setSelectedDirectoryEmployeeId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn nhân công" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDirectoryEmployees.map((employee) => (
                      <SelectItem key={employee.userId} value={String(employee.userId)}>
                        {employee.fullName || employee.username || employee.email || `Employee #${employee.userId}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Đơn giá / task (VND)</Label>
                <Input
                  type="number"
                  min={0}
                  value={wagePerTask}
                  onChange={(event) => setWagePerTask(event.target.value)}
                  placeholder="Ví dụ: 150000"
                />
              </div>

              <div className="flex items-end">
                <Button
                  className="w-full"
                  onClick={handleAddSeasonEmployee}
                  disabled={addSeasonEmployeeMutation.isPending || !selectedDirectoryEmployeeId}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Thêm nhân công
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-border">
            <CardHeader>
              <CardTitle className="text-base">Nhân công trong mùa vụ</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingBase ? (
                <p className="text-sm text-muted-foreground">Đang tải danh sách nhân công...</p>
              ) : seasonEmployees.length === 0 ? (
                <p className="text-sm text-muted-foreground">Chưa có nhân công trong mùa vụ này.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nhân công</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Đơn giá / task</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {seasonEmployees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          {employee.employeeName || employee.employeeUsername || `Employee #${employee.employeeUserId}`}
                        </TableCell>
                        <TableCell>{employee.employeeEmail ?? "-"}</TableCell>
                        <TableCell>{formatMoney(employee.wagePerTask)}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              employee.active === false
                                ? "bg-slate-100 text-slate-600 border-slate-200"
                                : "bg-emerald-100 text-emerald-700 border-emerald-200"
                            }
                          >
                            {employee.active === false ? "Tạm khóa" : "Đang hoạt động"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeSeasonEmployeeMutation.mutate(employee.employeeUserId)}
                            disabled={removeSeasonEmployeeMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Xóa
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignment" className="space-y-4">
          <Card className="rounded-2xl border border-border">
            <CardHeader>
              <CardTitle className="text-base">Phân công công việc</CardTitle>
            </CardHeader>
            <CardContent>
              {isTasksLoading ? (
                <p className="text-sm text-muted-foreground">Đang tải công việc...</p>
              ) : tasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">Chưa có công việc trong mùa vụ này.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Công việc</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Đang giao cho</TableHead>
                      <TableHead>Phân công mới</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.map((task) => {
                      const fallbackCurrentAssignee = task.userName || (task.userId ? `User #${task.userId}` : "-");
                      const currentSelection =
                        taskAssigneeDraft[task.taskId] ??
                        (activeSeasonEmployees.some((employee) => employee.userId === task.userId)
                          ? String(task.userId)
                          : "");
                      return (
                        <TableRow key={task.taskId}>
                          <TableCell>{task.title}</TableCell>
                          <TableCell>
                            <Badge className={getTaskStatusClassName(task.status)}>
                              {getTaskStatusLabel(task.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>{fallbackCurrentAssignee}</TableCell>
                          <TableCell>
                            <Select
                              value={currentSelection}
                              onValueChange={(value) =>
                                setTaskAssigneeDraft((prev) => ({
                                  ...prev,
                                  [task.taskId]: value,
                                }))
                              }
                            >
                              <SelectTrigger className="w-[260px]">
                                <SelectValue placeholder="Chọn nhân công" />
                              </SelectTrigger>
                              <SelectContent>
                                {activeSeasonEmployees.map((employee) => (
                                  <SelectItem key={employee.userId} value={String(employee.userId)}>
                                    {employee.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              onClick={() => handleAssignTask(task.taskId)}
                              disabled={assignTaskMutation.isPending || !currentSelection}
                            >
                              Gán việc
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-border">
            <CardHeader>
              <CardTitle className="text-base">Theo dõi tiến độ nhân công</CardTitle>
            </CardHeader>
            <CardContent>
              {isProgressLoading ? (
                <p className="text-sm text-muted-foreground">Đang tải dữ liệu tiến độ...</p>
              ) : progressLogs.length === 0 ? (
                <p className="text-sm text-muted-foreground">Chưa có báo cáo tiến độ nào.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nhân công</TableHead>
                      <TableHead>Công việc</TableHead>
                      <TableHead>Tiến độ</TableHead>
                      <TableHead>Ghi chú</TableHead>
                      <TableHead>Thời gian</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {progressLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.employeeName || `Employee #${log.employeeUserId}`}</TableCell>
                        <TableCell>{log.taskTitle || `Task #${log.taskId}`}</TableCell>
                        <TableCell>{log.progressPercent}%</TableCell>
                        <TableCell className="max-w-[320px] truncate">{log.note || "-"}</TableCell>
                        <TableCell>{formatDate(log.loggedAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4">
          <Card className="rounded-2xl border border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Tính lương tự động</CardTitle>
              <Button
                onClick={() => recalculatePayrollMutation.mutate(undefined)}
                disabled={recalculatePayrollMutation.isPending}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Tính lại bảng lương
              </Button>
            </CardHeader>
            <CardContent>
              {isPayrollLoading ? (
                <p className="text-sm text-muted-foreground">Đang tải bảng lương...</p>
              ) : payrollRecords.length === 0 ? (
                <p className="text-sm text-muted-foreground">Chưa có dữ liệu bảng lương.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nhân công</TableHead>
                      <TableHead>Kỳ lương</TableHead>
                      <TableHead>Task hoàn thành</TableHead>
                      <TableHead>Đơn giá / task</TableHead>
                      <TableHead>Tổng lương</TableHead>
                      <TableHead>Cập nhật</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payrollRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.employeeName || `Employee #${record.employeeUserId}`}</TableCell>
                        <TableCell>
                          {record.periodStart ?? "-"} - {record.periodEnd ?? "-"}
                        </TableCell>
                        <TableCell>
                          {record.totalCompletedTasks} / {record.totalAssignedTasks}
                        </TableCell>
                        <TableCell>{formatMoney(record.wagePerTask)}</TableCell>
                        <TableCell>{formatMoney(record.totalAmount)}</TableCell>
                        <TableCell>{formatDate(record.generatedAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
