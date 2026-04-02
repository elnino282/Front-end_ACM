import {
  useEmployeeAcceptTask,
  useEmployeeReportTaskProgress,
  useEmployeeTasks,
} from "@/entities/labor";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from "@/shared/ui";
import { useMemo, useState } from "react";
import { toast } from "sonner";

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

export function EmployeeTasksPage() {
  const { data: taskPageData, isLoading } = useEmployeeTasks({ page: 0, size: 200 });
  const [progressTaskId, setProgressTaskId] = useState<number | null>(null);
  const [progressPercent, setProgressPercent] = useState<string>("0");
  const [progressNote, setProgressNote] = useState<string>("");
  const [evidenceUrl, setEvidenceUrl] = useState<string>("");

  const tasks = taskPageData?.items ?? [];
  const selectedTask = useMemo(
    () => tasks.find((task) => task.taskId === progressTaskId) ?? null,
    [progressTaskId, tasks]
  );

  const acceptTaskMutation = useEmployeeAcceptTask({
    onSuccess: () => toast.success("Đã nhận việc"),
    onError: (error) => toast.error(error.message || "Không thể nhận việc"),
  });

  const reportProgressMutation = useEmployeeReportTaskProgress({
    onSuccess: () => {
      toast.success("Đã cập nhật tiến độ");
      setProgressTaskId(null);
      setProgressPercent("0");
      setProgressNote("");
      setEvidenceUrl("");
    },
    onError: (error) => toast.error(error.message || "Không thể cập nhật tiến độ"),
  });

  const handleSubmitProgress = () => {
    if (!progressTaskId) return;
    const parsedPercent = Number(progressPercent);
    if (Number.isNaN(parsedPercent) || parsedPercent < 0 || parsedPercent > 100) {
      toast.error("Tiến độ phải trong khoảng 0-100");
      return;
    }
    reportProgressMutation.mutate({
      taskId: progressTaskId,
      data: {
        progressPercent: parsedPercent,
        note: progressNote.trim() || undefined,
        evidenceUrl: evidenceUrl.trim() || undefined,
      },
    });
  };

  return (
    <div className="p-6 space-y-4">
      <Card className="rounded-2xl border border-border">
        <CardHeader>
          <CardTitle>Việc được giao</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Đang tải danh sách công việc...</p>
          ) : tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">Bạn chưa có công việc nào được giao.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Công việc</TableHead>
                  <TableHead>Mùa vụ</TableHead>
                  <TableHead>Hạn</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.taskId}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{task.title}</p>
                        <p className="text-xs text-muted-foreground">{task.description || "-"}</p>
                      </div>
                    </TableCell>
                    <TableCell>{task.seasonName || "-"}</TableCell>
                    <TableCell>{task.dueDate || "-"}</TableCell>
                    <TableCell>
                      <Badge className={getTaskStatusClassName(task.status)}>
                        {getTaskStatusLabel(task.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {(task.status === "PENDING" || task.status === "OVERDUE") && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => acceptTaskMutation.mutate(task.taskId)}
                          disabled={acceptTaskMutation.isPending}
                        >
                          Nhận việc
                        </Button>
                      )}
                      {task.status !== "CANCELLED" && (
                        <Button size="sm" onClick={() => setProgressTaskId(task.taskId)}>
                          Báo cáo tiến độ
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={progressTaskId !== null} onOpenChange={(open) => !open && setProgressTaskId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Báo cáo tiến độ công việc</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Công việc: <span className="text-foreground">{selectedTask?.title || "-"}</span>
            </p>
            <div className="space-y-2">
              <Label>Tiến độ (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={progressPercent}
                onChange={(event) => setProgressPercent(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Ghi chú</Label>
              <Textarea
                rows={4}
                value={progressNote}
                onChange={(event) => setProgressNote(event.target.value)}
                placeholder="Mô tả tiến độ hiện tại..."
              />
            </div>
            <div className="space-y-2">
              <Label>Link minh chứng (tuỳ chọn)</Label>
              <Input
                value={evidenceUrl}
                onChange={(event) => setEvidenceUrl(event.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProgressTaskId(null)}>
              Hủy
            </Button>
            <Button onClick={handleSubmitProgress} disabled={reportProgressMutation.isPending}>
              Gửi tiến độ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
