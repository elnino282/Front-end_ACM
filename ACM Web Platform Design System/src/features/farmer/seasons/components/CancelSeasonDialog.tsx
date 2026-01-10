import { useEffect, useState } from 'react';
import { Ban } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import type { Season } from '../types';

interface CancelSeasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  season: Season | null;
  onConfirm: (data: { reason?: string; forceCancel?: boolean }) => void;
  isSubmitting?: boolean;
}

export function CancelSeasonDialog({
  open,
  onOpenChange,
  season,
  onConfirm,
  isSubmitting = false,
}: CancelSeasonDialogProps) {
  const [reason, setReason] = useState('');
  const [forceCancel, setForceCancel] = useState(false);

  useEffect(() => {
    if (!open) return;
    setReason('');
    setForceCancel(false);
  }, [open, season?.id]);

  const handleSubmit = () => {
    if (!season || isSubmitting) return;
    onConfirm({
      reason: reason.trim() || undefined,
      forceCancel,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="acm-rounded-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ban className="w-5 h-5 text-destructive" />
            Cancel Season
          </DialogTitle>
          <DialogDescription>
            Cancelling a season is irreversible. Provide a reason if needed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="cancelReason">Reason (Optional)</Label>
            <Textarea
              id="cancelReason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Weather conditions or crop change"
              className="border-border acm-rounded-sm"
              rows={4}
            />
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              checked={forceCancel}
              onCheckedChange={(checked) => setForceCancel(Boolean(checked))}
              className="mt-1"
            />
            <div className="text-sm text-muted-foreground">
              Force cancel even if harvest records exist.
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="acm-rounded-sm"
          >
            Keep Season
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-destructive hover:bg-destructive/90 text-white acm-rounded-sm"
          >
            {isSubmitting ? 'Cancelling...' : 'Cancel Season'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}



