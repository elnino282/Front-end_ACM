import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Season } from "@/entities/season";
import { useI18n } from "@/hooks/useI18n";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui";
import { Calendar, Leaf, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSeason } from "../contexts/SeasonContext";

interface SeasonPickerModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  seasons: Season[];
}

/**
 * SeasonPickerModal - Modal dialog for selecting a season.
 *
 * Features:
 * - Lists all available seasons grouped by status
 * - Empty state with CTA to create first season
 * - Persists selection via context
 */
export function SeasonPickerModal({
  isOpen,
  onOpenChange,
  seasons,
}: SeasonPickerModalProps) {
  const { t } = useI18n();
  const { setSelectedSeasonId } = useSeason();
  const navigate = useNavigate();

  const handleSelectSeason = (seasonId: number) => {
    setSelectedSeasonId(seasonId);
    onOpenChange(false);
  };

  const handleCreateSeason = () => {
    onOpenChange(false);
    navigate("/farmer/seasons");
  };

  // Group seasons by status
  const activeSeasons = seasons.filter((s) => s.status === "ACTIVE");
  const otherSeasons = seasons.filter((s) => s.status !== "ACTIVE");

  const hasSeasons = seasons.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calendar className="w-5 h-5 text-primary" />
            {t("seasonPicker.title")}
          </DialogTitle>
          <DialogDescription>
            {hasSeasons
              ? t("seasonPicker.description")
              : t("seasonPicker.noSeasonsDescription")}
          </DialogDescription>
        </DialogHeader>

        {hasSeasons ? (
          <ScrollArea className="max-h-[300px] pr-4">
            <div className="space-y-4">
              {/* Active Seasons */}
              {activeSeasons.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    {t("seasonPicker.activeSeasons")}
                  </h4>
                  {activeSeasons.map((season) => (
                    <SeasonCard
                      key={season.id}
                      season={season}
                      onSelect={handleSelectSeason}
                    />
                  ))}
                </div>
              )}

              {/* Other Seasons */}
              {otherSeasons.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    {t("seasonPicker.otherSeasons")}
                  </h4>
                  {otherSeasons.map((season) => (
                    <SeasonCard
                      key={season.id}
                      season={season}
                      onSelect={handleSelectSeason}
                    />
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        ) : (
          /* Empty State */
          <div className="py-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Leaf className="w-8 h-8 text-primary" />
            </div>
            <p className="text-muted-foreground mb-4">
              {t("seasonPicker.noSeasonsDescription")}
            </p>
            <Button onClick={handleCreateSeason} className="rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              {t("seasons.createButton")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface SeasonCardProps {
  season: Season;
  onSelect: (id: number) => void;
}

function SeasonCard({ season, onSelect }: SeasonCardProps) {
  const statusColors: Record<string, string> = {
    ACTIVE: "bg-primary/10 text-primary border-primary/20",
    PLANNED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    COMPLETED: "bg-green-500/10 text-green-600 border-green-500/20",
    CANCELLED: "bg-destructive/10 text-destructive border-destructive/20",
  };
  const statusKey = season.status ?? "PLANNED";

  return (
    <Button
      variant="outline"
      className="w-full justify-start h-auto py-3 px-4 rounded-xl border-2 hover:border-primary/50 transition-colors"
      onClick={() => onSelect(season.id)}
    >
      <div className="flex flex-col items-start gap-1 w-full">
        <div className="flex items-center justify-between w-full">
          <span className="font-medium text-foreground">
            {season.seasonName}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[statusKey] ?? "bg-muted"}`}
          >
            {statusKey}
          </span>
        </div>
        {season.cropName && (
          <span className="text-sm text-muted-foreground">
            {season.cropName}
          </span>
        )}
      </div>
    </Button>
  );
}
