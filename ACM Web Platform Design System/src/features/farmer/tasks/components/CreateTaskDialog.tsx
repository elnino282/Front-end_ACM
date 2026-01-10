import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { useEffect, useState } from 'react';

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (data: { title: string; plannedDate: string; dueDate: string; description?: string }) => void;
  uniquePlots: string[];
  uniqueAssignees: string[];
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  onCreateTask,
  uniquePlots,
  uniqueAssignees,
}: CreateTaskDialogProps) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!open) {
      setTitle('');
      setDueDate('');
      setNotes('');
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="acm-rounded-lg max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>Add a new task to the workspace</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="col-span-2 space-y-2">
            <Label>Task Title</Label>
            <Input
              placeholder="e.g., Irrigate Plot A3"
              className="border-border acm-rounded-sm"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Task Type</Label>
            <Select>
              <SelectTrigger className="border-border acm-rounded-sm">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="irrigation">Irrigation</SelectItem>
                <SelectItem value="fertilizing">Fertilizing</SelectItem>
                <SelectItem value="spraying">Spraying</SelectItem>
                <SelectItem value="scouting">Scouting</SelectItem>
                <SelectItem value="harvesting">Harvesting</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Plot</Label>
            <Select>
              <SelectTrigger className="border-border acm-rounded-sm">
                <SelectValue placeholder="Select plot" />
              </SelectTrigger>
              <SelectContent>
                {uniquePlots.map((plot) => (
                  <SelectItem key={plot} value={plot}>
                    {plot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Assignee</Label>
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
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Input
              type="date"
              className="border-border acm-rounded-sm"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Notes</Label>
            <Textarea
              placeholder="Additional task details..."
              className="border-border acm-rounded-sm"
              rows={3}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="acm-rounded-sm">
            Cancel
          </Button>
          <Button
            onClick={() => onCreateTask({
              title: title.trim(),
              plannedDate: dueDate,
              dueDate,
              description: notes.trim() || undefined,
            })}
            className="bg-primary hover:bg-primary/90 text-primary-foreground acm-rounded-sm"
          >
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}



