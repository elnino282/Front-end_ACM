import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { KPIData } from '../types';

interface KPICardsProps {
  kpiData: KPIData[];
}

/**
 * KPICards Component
 * 
 * Displays key performance indicators in a responsive grid layout.
 * Each card shows an icon, title, value, and trend indicator.
 */
export const KPICards = ({ kpiData }: KPICardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpiData.map((kpi, index) => {
        const Icon = kpi.icon;
        const TrendIcon = kpi.trend === 'up' ? ArrowUpRight : ArrowDownRight;
        
        return (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${kpi.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${kpi.textColor}`} />
                </div>
                <Badge
                  variant={kpi.trend === 'up' ? 'default' : 'destructive'}
                  className="gap-1"
                >
                  <TrendIcon className="w-3 h-3" />
                  {kpi.change}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{kpi.title}</p>
                <h2 className="font-numeric">{kpi.value}</h2>
              </div>
            </CardContent>
            <div
              className="absolute bottom-0 left-0 right-0 h-1"
              style={{ backgroundColor: kpi.color }}
            />
          </Card>
        );
      })}
    </div>
  );
};

