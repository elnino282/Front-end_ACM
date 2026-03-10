import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useI18n } from "@/hooks/useI18n";
import { BackButton } from "@/shared/ui";
import {
  Archive,
  Ban,
  Calendar,
  CheckCircle2,
  Download,
  Edit,
  HelpCircle,
  Play,
  Plus,
} from "lucide-react";
import { Season, SeasonStatus } from "../types";

interface SeasonHeaderProps {
  viewMode: "list" | "detail";
  selectedSeason: Season | null;
  onNewSeason: () => void;
  onExport: () => void;
  onBack: () => void;
  onEdit?: () => void;
  onStartSeason?: (season: Season) => void;
  onHarvest?: (season: Season) => void;
  onCompleteSeason?: (season: Season) => void;
  onCancelSeason?: (season: Season) => void;
  onArchiveSeason?: (season: Season) => void;
  getStatusColor: (status: SeasonStatus) => string;
  getStatusLabel: (status: SeasonStatus) => string;
  formatDateRange: (startDate: string, endDate: string) => string;
}

export function SeasonHeader({
  viewMode,
  selectedSeason,
  onNewSeason,
  onExport,
  onBack,
  onEdit,
  onStartSeason,
  onHarvest,
  onCompleteSeason,
  onCancelSeason,
  onArchiveSeason,
  getStatusColor,
  getStatusLabel,
  formatDateRange,
}: SeasonHeaderProps) {
  const { t } = useI18n();

  if (viewMode === "detail" && selectedSeason) {
    const canStart = selectedSeason.status === "PLANNED";
    const canComplete = selectedSeason.status === "ACTIVE";
    const canCancel =
      selectedSeason.status === "PLANNED" || selectedSeason.status === "ACTIVE";
    const canEdit =
      selectedSeason.status === "PLANNED" || selectedSeason.status === "ACTIVE";
    const canArchive =
      selectedSeason.status === "COMPLETED" ||
      selectedSeason.status === "CANCELLED";
    const effectiveEndDate =
      selectedSeason.endDate ||
      selectedSeason.plannedHarvestDate ||
      selectedSeason.startDate;

    return (
      <div className="max-w-[1800px] mx-auto px-6 pt-6 mb-4">
        <Card className="border border-border rounded-xl shadow-sm">
          <CardContent className="px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <BackButton
                  iconOnly
                  onClick={onBack}
                  className="acm-rounded-sm"
                />
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl">{selectedSeason.name}</h1>
                    <Badge
                      className={`${getStatusColor(selectedSeason.status)} acm-rounded-sm`}
                    >
                      {getStatusLabel(selectedSeason.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDateRange(
                      selectedSeason.startDate,
                      effectiveEndDate,
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={onEdit}
                  disabled={!onEdit || !canEdit}
                  className="acm-rounded-sm border-border hover:bg-muted"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {t('seasons.actions.edit')}
                </Button>
                {canComplete && onHarvest && (
                  <Button
                    onClick={() => onHarvest(selectedSeason)}
                    className="bg-primary hover:bg-primary/90 text-white acm-rounded-sm acm-button-shadow"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Harvest
                  </Button>
                )}
                {canStart && onStartSeason && (
                  <Button
                    variant="outline"
                    onClick={() => onStartSeason(selectedSeason)}
                    className="acm-rounded-sm border-border hover:bg-muted"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {t('seasons.actions.start')}
                  </Button>
                )}
                {canComplete && onCompleteSeason && (
                  <Button
                    variant="outline"
                    onClick={() => onCompleteSeason(selectedSeason)}
                    className="acm-rounded-sm border-border hover:bg-muted"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {t('seasons.actions.complete')}
                  </Button>
                )}
                {canCancel && onCancelSeason && (
                  <Button
                    variant="outline"
                    onClick={() => onCancelSeason(selectedSeason)}
                    className="acm-rounded-sm border-border hover:bg-muted text-destructive"
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    {t('seasons.actions.cancel')}
                  </Button>
                )}
                {canArchive && onArchiveSeason && (
                  <Button
                    variant="outline"
                    onClick={() => onArchiveSeason(selectedSeason)}
                    className="acm-rounded-sm border-border hover:bg-muted"
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    {t('seasons.actions.archive')}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-[1800px] mx-auto px-6 pt-6 mb-4">
      <Card className="border border-border rounded-xl shadow-sm">
        <CardContent className="px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2 leading-tight">
                <Calendar className="w-6 h-6 text-emerald-600" />
                {t('seasons.pageTitle')}
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                {t('seasons.subtitle')}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="acm-rounded-sm"
                    >
                      <HelpCircle className="w-5 h-5 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{t('seasons.help')}</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button
                variant="outline"
                onClick={onExport}
                className="acm-rounded-sm border-border hover:bg-muted"
              >
                <Download className="w-4 h-4 mr-2" />
                {t('seasons.actions.export')}
              </Button>

              <Button
                className="bg-primary hover:bg-primary/90 text-white acm-rounded-sm acm-button-shadow"
                onClick={onNewSeason}
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('seasons.createButton')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
