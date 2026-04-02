import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FilterState } from '../types';

interface FilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  uniqueAssignees: string[];
  uniquePlots: string[];
}

export function FilterDrawer({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  uniqueAssignees,
  uniquePlots,
}: FilterDrawerProps) {
  const handleClearAll = () => {
    onFiltersChange({ status: 'all', type: 'all', assignee: 'all', plot: 'all' });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle>Lọc công việc</SheetTitle>
          <SheetDescription>Tinh chỉnh danh sách công việc theo bộ lọc</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label>Trạng thái</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
            >
              <SelectTrigger className="border-border acm-rounded-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="todo">Sắp làm</SelectItem>
                <SelectItem value="in-progress">Đang làm</SelectItem>
                <SelectItem value="overdue">Trễ hạn</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Loại công việc</Label>
            <Select
              value={filters.type}
              onValueChange={(value) => onFiltersChange({ ...filters, type: value })}
            >
              <SelectTrigger className="border-border acm-rounded-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại việc</SelectItem>
                <SelectItem value="irrigation">Tưới</SelectItem>
                <SelectItem value="fertilizing">Bón phân</SelectItem>
                <SelectItem value="spraying">Phun thuốc</SelectItem>
                <SelectItem value="scouting">Thăm đồng</SelectItem>
                <SelectItem value="harvesting">Thu hoạch</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Người làm</Label>
            <Select
              value={filters.assignee}
              onValueChange={(value) => onFiltersChange({ ...filters, assignee: value })}
            >
              <SelectTrigger className="border-border acm-rounded-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả nhân sự</SelectItem>
                {uniqueAssignees.map((assignee) => (
                  <SelectItem key={assignee} value={assignee}>
                    {assignee}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Lô đất</Label>
            <Select
              value={filters.plot}
              onValueChange={(value) => onFiltersChange({ ...filters, plot: value })}
            >
              <SelectTrigger className="border-border acm-rounded-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả lô đất</SelectItem>
                {uniquePlots.map((plot) => (
                  <SelectItem key={plot} value={plot}>
                    {plot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 acm-rounded-sm" onClick={handleClearAll}>
              Xóa lọc
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground acm-rounded-sm"
              onClick={() => onOpenChange(false)}
            >
              Áp dụng
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}



