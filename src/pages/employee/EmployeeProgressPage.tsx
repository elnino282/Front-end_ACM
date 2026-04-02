import { useEmployeeProgressLogs } from "@/entities/labor";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui";

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString("vi-VN");
  } catch {
    return value;
  }
};

export function EmployeeProgressPage() {
  const { data, isLoading } = useEmployeeProgressLogs({ page: 0, size: 200 });
  const logs = data?.items ?? [];

  return (
    <div className="p-6">
      <Card className="rounded-2xl border border-border">
        <CardHeader>
          <CardTitle>Lịch sử cập nhật tiến độ</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Đang tải dữ liệu tiến độ...</p>
          ) : logs.length === 0 ? (
            <p className="text-sm text-muted-foreground">Bạn chưa gửi cập nhật tiến độ nào.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Công việc</TableHead>
                  <TableHead>Mùa vụ</TableHead>
                  <TableHead>Tiến độ</TableHead>
                  <TableHead>Ghi chú</TableHead>
                  <TableHead>Thời gian</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.taskTitle || `Task #${log.taskId}`}</TableCell>
                    <TableCell>{log.seasonName || "-"}</TableCell>
                    <TableCell>{log.progressPercent}%</TableCell>
                    <TableCell className="max-w-[360px] truncate">{log.note || "-"}</TableCell>
                    <TableCell>{formatDate(log.loggedAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
