import { useEffect, useMemo, useState } from 'react';
import { Edit } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { SeasonUpdateRequest } from '@/entities/season';
import { useVarietiesByCrop } from '@/entities/variety';
import type { Season } from '../types';

interface EditSeasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  season: Season | null;
  onSubmit: (id: number, data: SeasonUpdateRequest) => void;
  isSubmitting?: boolean;
}

const normalizeDate = (value?: string | null) => {
  if (!value) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toISOString().slice(0, 10);
};

export function EditSeasonDialog({
  open,
  onOpenChange,
  season,
  onSubmit,
  isSubmitting = false,
}: EditSeasonDialogProps) {
  const [seasonName, setSeasonName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [plannedHarvestDate, setPlannedHarvestDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPlantCount, setCurrentPlantCount] = useState('');
  const [expectedYieldKg, setExpectedYieldKg] = useState('');
  const [actualYieldKg, setActualYieldKg] = useState('');
  const [notes, setNotes] = useState('');
  const [varietyId, setVarietyId] = useState('');

  const cropId = season?.cropId ?? 0;
  const { data: varieties = [] } = useVarietiesByCrop(cropId);

  const farmLabel = useMemo(() => {
    if (!season) return '-';
    return season.farmName || 'Farm';
  }, [season]);
  const plotLabel = useMemo(() => {
    if (!season) return '-';
    if (season.plotName) return season.plotName;
    if (season.plotId) return `Plot #${season.plotId}`;
    return 'Plot';
  }, [season]);
  const cropLabel = useMemo(() => {
    if (!season) return '-';
    return season.crop || 'Crop';
  }, [season]);

  useEffect(() => {
    if (!open || !season) return;
    setSeasonName(season.name || '');
    setStartDate(normalizeDate(season.startDate));
    setPlannedHarvestDate(normalizeDate(season.plannedHarvestDate));
    setEndDate(normalizeDate(season.endDate));
    const plantCount = season.currentPlantCount ?? season.initialPlantCount;
    setCurrentPlantCount(plantCount != null ? String(plantCount) : '');
    setExpectedYieldKg(season.expectedYieldKg != null ? String(season.expectedYieldKg) : '');
    setActualYieldKg(season.actualYieldKg != null ? String(season.actualYieldKg) : '');
    setNotes(season.notes || '');
    setVarietyId(season.varietyId != null ? String(season.varietyId) : '');
  }, [open, season?.id]);

  const currentPlantValue =
    currentPlantCount === '' ? null : parseInt(currentPlantCount, 10);
  const hasValidPlantCount =
    currentPlantValue !== null &&
    !Number.isNaN(currentPlantValue) &&
    currentPlantValue >= 1;
  const hasValidHarvestDate =
    !plannedHarvestDate || !startDate || plannedHarvestDate >= startDate;
  const hasValidEndDate =
    !endDate || !startDate || endDate >= startDate;
  const expectedYieldValue = expectedYieldKg === '' ? undefined : parseFloat(expectedYieldKg);
  const actualYieldValue = actualYieldKg === '' ? undefined : parseFloat(actualYieldKg);

  const isFormValid =
    seasonName.trim() &&
    startDate &&
    hasValidPlantCount &&
    hasValidHarvestDate &&
    hasValidEndDate;

  const handleSubmit = () => {
    if (!season || !isFormValid) return;
    const id = parseInt(season.id, 10);
    if (Number.isNaN(id) || currentPlantValue === null) return;

    const payload: SeasonUpdateRequest = {
      seasonName: seasonName.trim(),
      startDate,
      plannedHarvestDate: plannedHarvestDate || undefined,
      endDate: endDate || undefined,
      currentPlantCount: currentPlantValue,
      expectedYieldKg: expectedYieldValue,
      actualYieldKg: actualYieldValue,
      notes: notes.trim() || undefined,
      varietyId: varietyId ? parseInt(varietyId, 10) : undefined,
    };

    onSubmit(id, payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Edit className="w-5 h-5 text-primary" />
            Edit Season
          </DialogTitle>
          <DialogDescription>
            Update the details of this season. Crop and plot are read-only.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Farm</Label>
              <Input value={farmLabel} disabled className="border-border" />
            </div>
            <div className="space-y-2">
              <Label>Plot</Label>
              <Input value={plotLabel} disabled className="border-border" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Crop</Label>
              <Input value={cropLabel} disabled className="border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="varietyId">Variety (Optional)</Label>
              <Select
                value={varietyId}
                onValueChange={setVarietyId}
                disabled={!cropId || varieties.length === 0}
              >
                <SelectTrigger className="border-border focus:border-primary">
                  <SelectValue placeholder={
                    !cropId
                      ? 'Select a crop first'
                      : varieties.length === 0
                        ? 'No varieties available'
                        : 'Select variety'
                  } />
                </SelectTrigger>
                <SelectContent>
                  {varieties.map((variety) => (
                    <SelectItem key={variety.id} value={String(variety.id)}>
                      {variety.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seasonName">Season Name *</Label>
            <Input
              id="seasonName"
              value={seasonName}
              onChange={(e) => setSeasonName(e.target.value)}
              required
              className="border-border focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="border-border focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plannedHarvestDate">Planned Harvest</Label>
              <Input
                id="plannedHarvestDate"
                type="date"
                value={plannedHarvestDate}
                onChange={(e) => setPlannedHarvestDate(e.target.value)}
                min={startDate}
                className="border-border focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="border-border focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentPlantCount">Current Plant Count *</Label>
              <Input
                id="currentPlantCount"
                type="number"
                min="1"
                value={currentPlantCount}
                onChange={(e) => setCurrentPlantCount(e.target.value)}
                required
                className="border-border focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedYieldKg">Expected Yield (kg)</Label>
              <Input
                id="expectedYieldKg"
                type="number"
                min="0"
                step="0.1"
                value={expectedYieldKg}
                onChange={(e) => setExpectedYieldKg(e.target.value)}
                className="border-border focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="actualYieldKg">Actual Yield (kg)</Label>
              <Input
                id="actualYieldKg"
                type="number"
                min="0"
                step="0.1"
                value={actualYieldKg}
                onChange={(e) => setActualYieldKg(e.target.value)}
                className="border-border focus:border-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="border-border focus:border-primary"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/90 text-white"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}



