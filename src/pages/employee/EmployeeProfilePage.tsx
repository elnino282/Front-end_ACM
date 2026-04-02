import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";

export function EmployeeProfilePage() {
  return (
    <div className="p-6">
      <Card className="rounded-2xl border border-border">
        <CardHeader>
          <CardTitle>Hồ sơ nhân công</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Hồ sơ cá nhân đang được cập nhật. Bạn có thể tiếp tục dùng các màn hình nhận việc, tiến độ và bảng lương.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
