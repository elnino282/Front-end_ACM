import { useEmployeePayrollRecords } from "@/entities/labor";
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

const formatMoney = (value?: number | null) => {
  if (value === undefined || value === null) return "-";
  return value.toLocaleString("vi-VN");
};

export function EmployeePayrollPage() {
  const { data, isLoading } = useEmployeePayrollRecords({ page: 0, size: 200 });
  const payroll = data?.items ?? [];

  return (
    <div className="p-6">
      <Card className="rounded-2xl border border-border">
        <CardHeader>
          <CardTitle>Bảng lương của tôi</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Đang tải bảng lương...</p>
          ) : payroll.length === 0 ? (
            <p className="text-sm text-muted-foreground">Chưa có dữ liệu lương.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mùa vụ</TableHead>
                  <TableHead>Kỳ lương</TableHead>
                  <TableHead>Task hoàn thành</TableHead>
                  <TableHead>Đơn giá / task</TableHead>
                  <TableHead>Tổng lương</TableHead>
                  <TableHead>Ngày tính</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payroll.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.seasonName || "-"}</TableCell>
                    <TableCell>
                      {record.periodStart || "-"} - {record.periodEnd || "-"}
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
    </div>
  );
}
