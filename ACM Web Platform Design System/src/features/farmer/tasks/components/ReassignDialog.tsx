import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ReassignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  onReassign: () => void;
  uniqueAssignees: string[];
}

export function ReassignDialog({
  open,
  onOpenChange,
  selectedCount,
  onReassign,
  uniqueAssignees,
}: ReassignDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="acm-rounded-lg">
        <DialogHeader>
          <DialogTitle>Reassign Tasks</DialogTitle>
          <DialogDescription>
            Assign {selectedCount} selected tasks to a new team member
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2">
          <Label>New Assignee</Label>
          <Select>
            <SelectTrigger className="border-border acm-rounded-sm">
              <SelectValue placeholder="Select assignee" />
            </SelectTrigger>
            <SelectContent>
              {uniqueAssignees.map((assignee) => (
                <SelectItem key={assignee} value={assignee}>
                  {assignee}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="acm-rounded-sm">
            Cancel
          </Button>
          <Button
            onClick={onReassign}
            className="bg-primary hover:bg-primary/90 text-primary-foreground acm-rounded-sm"
          >
            Reassign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}



