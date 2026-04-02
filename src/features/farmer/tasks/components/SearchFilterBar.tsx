import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FilterState } from '../types';

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  uniqueAssignees: string[];
  uniquePlots: string[];
}

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  uniqueAssignees,
  uniquePlots,
}: SearchFilterBarProps) {
  const hasActiveFilters = filters.status !== 'all'
    || filters.type !== 'all'
    || filters.assignee !== 'all'
    || filters.plot !== 'all'
    || searchQuery.length > 0;

  return (
    <Card className="border border-border rounded-xl shadow-sm">
      <CardContent className="px-6 py-4">
        <div className="flex flex-wrap items-center justify-start gap-4">
          {/* Search Input */}
          <div className="relative w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm công việc (tối thiểu 2 ký tự)..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 rounded-md border-border focus:border-primary"
            />
          </div>

          <Select
            value={filters.status}
            onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
          >
            <SelectTrigger className="rounded-xl border-border w-[180px]">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="todo">Sắp làm</SelectItem>
              <SelectItem value="in-progress">Đang làm</SelectItem>
              <SelectItem value="overdue">Trễ hạn</SelectItem>
              <SelectItem value="completed">Hoàn thành</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.type}
            onValueChange={(value) => onFiltersChange({ ...filters, type: value })}
          >
            <SelectTrigger className="rounded-xl border-border w-[180px]">
              <SelectValue placeholder="Tất cả loại việc" />
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

          <Select
            value={filters.assignee}
            onValueChange={(value) => onFiltersChange({ ...filters, assignee: value })}
          >
            <SelectTrigger className="rounded-xl border-border w-[180px]">
              <SelectValue placeholder="Tất cả nhân sự" />
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

          <Select
            value={filters.plot}
            onValueChange={(value) => onFiltersChange({ ...filters, plot: value })}
          >
            <SelectTrigger className="rounded-xl border-border w-[180px]">
              <SelectValue placeholder="Tất cả lô đất" />
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

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onFiltersChange({ status: 'all', type: 'all', assignee: 'all', plot: 'all' });
                onSearchChange('');
              }}
              className="h-9 px-3 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
            >
              Xóa lọc
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}



