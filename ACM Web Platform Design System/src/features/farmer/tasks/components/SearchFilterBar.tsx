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
              placeholder="Search tasks (min 2 characters)..."
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
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.type}
            onValueChange={(value) => onFiltersChange({ ...filters, type: value })}
          >
            <SelectTrigger className="rounded-xl border-border w-[180px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="irrigation">Irrigation</SelectItem>
              <SelectItem value="fertilizing">Fertilizing</SelectItem>
              <SelectItem value="spraying">Spraying</SelectItem>
              <SelectItem value="scouting">Scouting</SelectItem>
              <SelectItem value="harvesting">Harvesting</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.assignee}
            onValueChange={(value) => onFiltersChange({ ...filters, assignee: value })}
          >
            <SelectTrigger className="rounded-xl border-border w-[180px]">
              <SelectValue placeholder="All Assignees" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignees</SelectItem>
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
              <SelectValue placeholder="All Plots" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plots</SelectItem>
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
              Clear All
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}



