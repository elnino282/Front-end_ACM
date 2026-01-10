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
          <SheetTitle>Filter Tasks</SheetTitle>
          <SheetDescription>Refine your task view with filters</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={filters.status}
              onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
            >
              <SelectTrigger className="border-border acm-rounded-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Task Type</Label>
            <Select
              value={filters.type}
              onValueChange={(value) => onFiltersChange({ ...filters, type: value })}
            >
              <SelectTrigger className="border-border acm-rounded-sm">
                <SelectValue />
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
          </div>

          <div className="space-y-2">
            <Label>Assignee</Label>
            <Select
              value={filters.assignee}
              onValueChange={(value) => onFiltersChange({ ...filters, assignee: value })}
            >
              <SelectTrigger className="border-border acm-rounded-sm">
                <SelectValue />
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
          </div>

          <div className="space-y-2">
            <Label>Plot</Label>
            <Select
              value={filters.plot}
              onValueChange={(value) => onFiltersChange({ ...filters, plot: value })}
            >
              <SelectTrigger className="border-border acm-rounded-sm">
                <SelectValue />
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
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 acm-rounded-sm" onClick={handleClearAll}>
              Clear All
            </Button>
            <Button
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground acm-rounded-sm"
              onClick={() => onOpenChange(false)}
            >
              Apply
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}



