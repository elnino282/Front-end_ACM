import { MoreVertical, Edit, Copy, Play, CheckCircle2, Ban, Archive, Trash2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Season, SeasonStatus } from '../types';

interface SeasonTableProps {
  seasons: Season[];
  selectedSeasons: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectSeason: (seasonId: string, checked: boolean) => void;
  onViewDetails: (season: Season) => void;
  onDelete: (seasonId: string) => void;
  onDuplicate: (season: Season) => void;
  onStartSeason: (season: Season) => void;
  onCompleteSeason: (season: Season) => void;
  onCancelSeason: (season: Season) => void;
  onArchiveSeason: (season: Season) => void;
  getStatusColor: (status: SeasonStatus) => string;
  getStatusLabel: (status: SeasonStatus) => string;
  formatDateRange: (startDate: string, endDate: string) => string;
  calculateProgress: (startDate: string, endDate: string) => number;
}

export function SeasonTable({
  seasons,
  selectedSeasons,
  onSelectAll,
  onSelectSeason,
  onViewDetails,
  onDelete,
  onDuplicate,
  onStartSeason,
  onCompleteSeason,
  onCancelSeason,
  onArchiveSeason,
  getStatusColor,
  getStatusLabel,
  formatDateRange,
  calculateProgress,
}: SeasonTableProps) {
  return (
    <div className="max-w-[1800px] mx-auto p-6">
      <Card className="border-border acm-rounded-lg acm-card-shadow">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border bg-muted">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        seasons.length > 0 &&
                        seasons.every((s) => selectedSeasons.includes(s.id))
                      }
                      onCheckedChange={onSelectAll}
                    />
                  </TableHead>
                  <TableHead className="font-semibold text-foreground">Season Name</TableHead>
                  <TableHead className="font-semibold text-foreground">Crop / Variety</TableHead>
                  <TableHead className="font-semibold text-foreground">Plots</TableHead>
                  <TableHead className="font-semibold text-foreground">Duration</TableHead>
                  <TableHead className="font-semibold text-foreground text-right">Yield/ha</TableHead>
                  <TableHead className="font-semibold text-foreground">Budget vs Actual</TableHead>
                  <TableHead className="font-semibold text-foreground">Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {seasons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                      No seasons found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  seasons.map((season) => {
                    const budgetPercentage = (season.actualCost / season.budgetTotal) * 100;
                    const effectiveEndDate = season.endDate || season.plannedHarvestDate || season.startDate;
                    const dateProgress = calculateProgress(season.startDate, effectiveEndDate);
                    const canStart = season.status === 'PLANNED';
                    const canComplete = season.status === 'ACTIVE';
                    const canCancel = season.status === 'PLANNED' || season.status === 'ACTIVE';
                    const canArchive = season.status === 'COMPLETED';

                    return (
                      <TableRow
                        key={season.id}
                        className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={(e) => {
                          if (!(e.target as HTMLElement).closest('button, input')) {
                            onViewDetails(season);
                          }
                        }}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox
                            checked={selectedSeasons.includes(season.id)}
                            onCheckedChange={(checked) =>
                              onSelectSeason(season.id, checked as boolean)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <button className="text-primary hover:underline text-left">
                            {season.name}
                          </button>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge className="bg-primary/10 text-primary border-primary/20 w-fit acm-rounded-sm">
                              {season.crop}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{season.variety}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-2 cursor-help">
                                  <MapPin className="w-4 h-4 text-muted-foreground" />
                                  <span className="numeric text-sm">{season.linkedPlots}</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>{season.linkedPlots} plots linked</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>
                          <div className="min-w-[180px]">
                            <div className="text-xs text-muted-foreground mb-1">
                              {formatDateRange(season.startDate, effectiveEndDate)}
                            </div>
                            <div className="relative">
                              <Progress value={dateProgress} className="h-1.5" />
                              <span className="numeric text-xs text-muted-foreground mt-1 inline-block">
                                {dateProgress}%
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {season.yieldPerHa !== null ? (
                            <span className="numeric">{season.yieldPerHa.toFixed(1)}</span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="min-w-[150px]">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                              <span className="numeric">${season.actualCost.toLocaleString()}</span>
                              <span className="numeric">${season.budgetTotal.toLocaleString()}</span>
                            </div>
                            <Progress
                              value={Math.min(budgetPercentage, 100)}
                              className="h-1.5"
                            />
                            <span className={`numeric text-xs mt-1 inline-block ${
                              budgetPercentage > 100 ? 'text-destructive' : 'text-muted-foreground'
                            }`}>
                              {budgetPercentage.toFixed(0)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(season.status)} acm-rounded-sm`}>
                            {getStatusLabel(season.status)}
                          </Badge>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="acm-rounded-sm">
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => onViewDetails(season)}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => onDuplicate(season)}
                              >
                                <Copy className="w-4 h-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              {canStart && (
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => onStartSeason(season)}
                                >
                                  <Play className="w-4 h-4 mr-2" />
                                  Start Season
                                </DropdownMenuItem>
                              )}
                              {canComplete && (
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => onCompleteSeason(season)}
                                >
                                  <CheckCircle2 className="w-4 h-4 mr-2" />
                                  Complete Season
                                </DropdownMenuItem>
                              )}
                              {canCancel && (
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => onCancelSeason(season)}
                                >
                                  <Ban className="w-4 h-4 mr-2" />
                                  Cancel Season
                                </DropdownMenuItem>
                              )}
                              {canArchive && (
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => onArchiveSeason(season)}
                                >
                                  <Archive className="w-4 h-4 mr-2" />
                                  Archive
                                </DropdownMenuItem>
                              )}
                              {(canCancel || canArchive) && <DropdownMenuSeparator />}
                              <DropdownMenuItem
                                className="cursor-pointer text-destructive focus:text-destructive"
                                onClick={() => onDelete(season.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



