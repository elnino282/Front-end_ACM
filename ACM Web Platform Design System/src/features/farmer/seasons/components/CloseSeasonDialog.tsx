import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface CloseSeasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  closeReason: string;
  setCloseReason: (reason: string) => void;
  onConfirm: () => void;
}

export function CloseSeasonDialog({
  open,
  onOpenChange,
  closeReason,
  setCloseReason,
  onConfirm,
}: CloseSeasonDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="acm-rounded-lg">
        <DialogHeader>
          <DialogTitle>Close Season</DialogTitle>
          <DialogDescription>
            Please provide a reason for closing this season. This will archive the season and mark it as complete.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="close-reason">Reason for Closing</Label>
          <Textarea
            id="close-reason"
            value={closeReason}
            onChange={(e) => setCloseReason(e.target.value)}
            placeholder="e.g., Harvest completed, Season ended..."
            className="mt-2 border-border acm-rounded-sm"
            rows={4}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="acm-rounded-sm">
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={!closeReason.trim()}
            className="bg-primary hover:bg-primary/90 text-white acm-rounded-sm"
          >
            Close Season
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}




