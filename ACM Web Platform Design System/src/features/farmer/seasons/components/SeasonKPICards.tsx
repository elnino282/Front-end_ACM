import { TrendingUp, DollarSign, CheckCircle2, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { usePreferences } from '@/shared/contexts';
import { formatMoney, formatWeight, convertToDisplayCurrency } from '@/shared/lib';
import { Season } from '../types';

interface SeasonKPICardsProps {
  season: Season;
}

export function SeasonKPICards({ season }: SeasonKPICardsProps) {
  const { preferences } = usePreferences();
  const yieldValue = season.yieldPerHa ?? null;
  const yieldLabel = yieldValue == null
    ? '-'
    : `${formatWeight(yieldValue, preferences.weightUnit, preferences.locale)}/ha`;
  const costPerHa = season.actualCost / season.linkedPlots / 2.5;
  const costPerHaLabel = Number.isFinite(costPerHa)
    ? formatMoney(convertToDisplayCurrency(costPerHa, preferences.currency), preferences.currency, preferences.locale)
    : '-';

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <Card className="border-border acm-rounded-lg acm-card-shadow">
        <CardContent className="px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Yield/ha</span>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div className="numeric text-2xl text-foreground">
            {yieldLabel}
          </div>
          {season.yieldPerHa && (
            <div className="text-xs text-primary mt-1">per hectare</div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border acm-rounded-lg acm-card-shadow">
        <CardContent className="px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Cost/ha</span>
            <DollarSign className="w-4 h-4 text-secondary" />
          </div>
          <div className="numeric text-2xl text-foreground">
            {costPerHaLabel}
          </div>
          <div className="text-xs text-muted-foreground mt-1">per hectare</div>
        </CardContent>
      </Card>

      <Card className="border-border acm-rounded-lg acm-card-shadow">
        <CardContent className="px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">On-time %</span>
            <CheckCircle2 className="w-4 h-4 text-primary" />
          </div>
          <div className="numeric text-2xl text-foreground">{season.onTimePercentage}</div>
          <div className="text-xs text-muted-foreground mt-1">%</div>
        </CardContent>
      </Card>

      <Card className="border-border acm-rounded-lg acm-card-shadow">
        <CardContent className="px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Budget %</span>
            <DollarSign className="w-4 h-4 text-accent" />
          </div>
          <div className={`numeric text-2xl ${
            (season.actualCost / season.budgetTotal) * 100 > 100
              ? 'text-destructive'
              : 'text-foreground'
          }`}>
            {((season.actualCost / season.budgetTotal) * 100).toFixed(0)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">%</div>
        </CardContent>
      </Card>

      <Card className="border-border acm-rounded-lg acm-card-shadow">
        <CardContent className="px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Linked Plots</span>
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <div className="numeric text-2xl text-foreground">{season.linkedPlots}</div>
          <div className="text-xs text-muted-foreground mt-1">plots</div>
        </CardContent>
      </Card>
    </div>
  );
}





