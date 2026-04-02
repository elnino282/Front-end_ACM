import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui";
import { useEffect, useState } from "react";
import { useSeason } from "@/shared/contexts/SeasonContext";
import { usePlots } from "@/entities/plot";
import { useI18n } from "@/hooks/useI18n";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (data: {
    title: string;
    plannedDate: string;
    dueDate: string;
    description?: string;
    seasonId?: number;
    plot?: string;
    taskType?: string;
    assigneeUserId?: number;
  }) => void;
  seasonId?: number;
  hideSeasonSelector?: boolean;
  uniquePlots: string[];
  assigneeOptions: Array<{
    userId: number;
    displayName: string;
  }>;
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  onCreateTask,
  seasonId,
  hideSeasonSelector = false,
  uniquePlots,
  assigneeOptions,
}: CreateTaskDialogProps) {
  const { t } = useI18n();
  const { seasons, activeSeasons, selectedSeasonId } = useSeason();
  const { data: plotsData } = usePlots();

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const [selectedPlot, setSelectedPlot] = useState<string>("");
  const [taskType, setTaskType] = useState("");
  const [assignee, setAssignee] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const effectiveSeasonId = seasonId ?? selectedSeasonId ?? null;

  // Get available plots from API - plotsData is an array directly (PlotArrayResponse)
  const availablePlots = plotsData ?? [];

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setTitle("");
      setDueDate("");
      setNotes("");
      setSelectedSeason("");
      setSelectedPlot("");
      setTaskType("");
      setAssignee("");
      setErrors({});
    } else {
      // Pre-select the currently active season if available
      if (effectiveSeasonId) {
        setSelectedSeason(String(effectiveSeasonId));
      }
    }
  }, [open, effectiveSeasonId]);

  // Validate form before submission
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = t("tasks.validation.titleRequired", "Title is required");
    }

    const seasonIdForSubmit = hideSeasonSelector
      ? effectiveSeasonId
      : (selectedSeason ? Number(selectedSeason) : effectiveSeasonId);

    if (!seasonIdForSubmit) {
      newErrors.season = t("tasks.validation.seasonRequired", "Season is required");
    }

    if (!dueDate) {
      newErrors.dueDate = t("tasks.validation.dueDateRequired", "Due date is required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    const seasonIdForSubmit = hideSeasonSelector
      ? effectiveSeasonId
      : (selectedSeason ? Number(selectedSeason) : effectiveSeasonId);

    // Get plot name from selected plot ID
    const plotName = selectedPlot 
      ? availablePlots.find(p => String(p.id) === selectedPlot)?.plotName 
      : undefined;

    onCreateTask({
      title: title.trim(),
      plannedDate: dueDate,
      dueDate,
      description: notes.trim() || undefined,
      seasonId: seasonIdForSubmit ?? undefined,
      plot: plotName || undefined,
      taskType: taskType || undefined,
      assigneeUserId: assignee ? Number(assignee) : undefined,
    });
  };

  // Use active seasons for dropdown, fallback to all seasons
  const availableSeasons = activeSeasons.length > 0 ? activeSeasons : seasons;
  const lockedSeasonLabel = availableSeasons.find((season) => season.id === effectiveSeasonId)?.seasonName;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="acm-rounded-lg max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("tasks.dialog.createTitle", "Create New Task")}</DialogTitle>
          <DialogDescription>
            {t("tasks.dialog.createDescription", "Add a new task to the workspace")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {/* Task Title */}
          <div className="col-span-2 space-y-2">
            <Label>{t("tasks.form.title", "Task Title")} *</Label>
            <Input
              placeholder={t("tasks.form.titlePlaceholder", "e.g., Irrigate Plot A3")}
              className={`border-border acm-rounded-sm ${errors.title ? "border-destructive" : ""}`}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Season */}
          <div className="space-y-2">
            <Label>{t("tasks.table.season", "Season")} *</Label>
            {hideSeasonSelector ? (
              <div className="rounded-md border border-border px-3 py-2 text-sm bg-muted/30">
                {lockedSeasonLabel ?? (effectiveSeasonId ? `Mùa vụ #${effectiveSeasonId}` : t("tasks.form.selectSeason", "Select season"))}
              </div>
            ) : (
              <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                <SelectTrigger className={`border-border acm-rounded-sm ${errors.season ? "border-destructive" : ""}`}>
                  <SelectValue placeholder={t("tasks.form.selectSeason", "Select season")} />
                </SelectTrigger>
                <SelectContent>
                  {availableSeasons.map((season) => (
                    <SelectItem key={season.id} value={String(season.id)}>
                      {season.seasonName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {errors.season && (
              <p className="text-sm text-destructive">{errors.season}</p>
            )}
          </div>

          {/* Plot Selector */}
          <div className="space-y-2">
            <Label>{t("tasks.table.plot", "Plot")}</Label>
            <Select value={selectedPlot} onValueChange={setSelectedPlot}>
              <SelectTrigger className="border-border acm-rounded-sm">
                <SelectValue placeholder={t("tasks.form.selectPlot", "Select plot")} />
              </SelectTrigger>
              <SelectContent>
                {availablePlots.map((plot) => (
                  <SelectItem key={plot.id} value={String(plot.id)}>
                    {plot.plotName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Task Type */}
          <div className="space-y-2">
            <Label>{t("tasks.table.type", "Task Type")}</Label>
            <Select value={taskType} onValueChange={setTaskType}>
              <SelectTrigger className="border-border acm-rounded-sm">
                <SelectValue placeholder={t("tasks.form.selectType", "Select type")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="irrigation">{t("tasks.types.irrigation", "Irrigation")}</SelectItem>
                <SelectItem value="fertilizing">{t("tasks.types.fertilizing", "Fertilizing")}</SelectItem>
                <SelectItem value="spraying">{t("tasks.types.spraying", "Spraying")}</SelectItem>
                <SelectItem value="scouting">{t("tasks.types.scouting", "Scouting")}</SelectItem>
                <SelectItem value="harvesting">{t("tasks.types.harvesting", "Harvesting")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Assignee */}
          <div className="space-y-2">
            <Label>{t("tasks.table.assignee", "Assignee")}</Label>
            <Select value={assignee} onValueChange={setAssignee}>
              <SelectTrigger className="border-border acm-rounded-sm">
                <SelectValue placeholder={t("tasks.form.selectAssignee", "Select assignee")} />
              </SelectTrigger>
              <SelectContent>
                {assigneeOptions.map((employee) => (
                  <SelectItem key={employee.userId} value={String(employee.userId)}>
                    {employee.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label>{t("tasks.table.dueDate", "Due Date")} *</Label>
            <Input
              type="date"
              className={`border-border acm-rounded-sm ${errors.dueDate ? "border-destructive" : ""}`}
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />
            {errors.dueDate && (
              <p className="text-sm text-destructive">{errors.dueDate}</p>
            )}
          </div>

          {/* Notes */}
          <div className="col-span-2 space-y-2">
            <Label>{t("common.notes", "Notes")}</Label>
            <Textarea
              placeholder={t("tasks.form.notesPlaceholder", "Additional task details...")}
              className="border-border acm-rounded-sm"
              rows={3}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="acm-rounded-sm"
          >
            {t("common.cancel", "Cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/90 text-primary-foreground acm-rounded-sm"
          >
            {t("tasks.createButton", "Create Task")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
