import { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import type { Season } from '../types';

interface StartSeasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  season: Season | null;
  onConfirm: (data: { actualStartDate?: string; currentPlantCount?: number }) => void;
  isSubmitting?: boolean;
}

export function StartSeasonDialog({
  open,
  onOpenChange,
  season,
  onConfirm,
  isSubmitting = false,
}: StartSeasonDialogProps) {
  const [actualStartDate, setActualStartDate] = useState('');
  const [currentPlantCount, setCurrentPlantCount] = useState('');
  const [syncPlantCount, setSyncPlantCount] = useState(false);

  useEffect(() => {
    if (!open) return;
    setActualStartDate('');
    setCurrentPlantCount('');
    setSyncPlantCount(false);
  }, [open, season?.id]);

  const currentPlantValue =
    currentPlantCount === '' ? null : parseInt(currentPlantCount, 10);
  const hasValidPlantCount =
    !syncPlantCount ||
    (currentPlantValue !== null &&
      !Number.isNaN(currentPlantValue) &&
      currentPlantValue >= 1);

  const canSubmit = hasValidPlantCount && !isSubmitting;

  const handleSubmit = () => {
    if (!season || !canSubmit) return;
    onConfirm({
      actualStartDate: actualStartDate || undefined,
      currentPlantCount: syncPlantCount ? currentPlantValue ?? undefined : undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="acm-rounded-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="w-5 h-5 text-primary" />
            Start Season
          </DialogTitle>
          <DialogDescription>
            Activate this planned season. Leave fields empty to keep existing values.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="actualStartDate">Actual Start Date (Optional)</Label>
            <Input
              id="actualStartDate"
              type="date"
              value={actualStartDate}
              onChange={(e) => setActualStartDate(e.target.value)}
              className="border-border acm-rounded-sm"
            />
            <p className="text-xs text-muted-foreground">
              Leave blank to keep the planned start date.
            </p>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              checked={syncPlantCount}
              onCheckedChange={(checked) => setSyncPlantCount(Boolean(checked))}
              className="mt-1"
            />
            <div className="space-y-2 flex-1">
              <Label htmlFor="currentPlantCount">Current Plant Count (Optional)</Label>
              <Input
                id="currentPlantCount"
                type="number"
                min="1"
                value={currentPlantCount}
                onChange={(e) => setCurrentPlantCount(e.target.value)}
                placeholder="e.g., 1200"
                disabled={!syncPlantCount}
                className="border-border acm-rounded-sm"
              />
              <p className="text-xs text-muted-foreground">
                Enable to update the current plant count when the season starts.
              </p>
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
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="bg-primary hover:bg-primary/90 text-white acm-rounded-sm"
          >
            {isSubmitting ? 'Starting...' : 'Start Season'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}



