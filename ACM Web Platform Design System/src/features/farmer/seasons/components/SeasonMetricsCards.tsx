import { TrendingUp, Calendar, Package, BarChart3 } from 'lucide-react';
import type { Season } from '../types';

interface SeasonMetricsCardsProps {
  seasons: Season[];
}

export function SeasonMetricsCards({ seasons }: SeasonMetricsCardsProps) {
  // Calculate metrics
  const totalSeasons = seasons.length;
  const activeSeasons = seasons.filter(s => s.status === 'ACTIVE').length;
  
  // Harvest due in next 30 days
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const harvestDue = seasons.filter(s => {
    if (!s.endDate) return false;
    const harvestDate = new Date(s.endDate);
    return harvestDate >= now && harvestDate <= thirtyDaysFromNow;
  }).length;

  // Total expected yield from active seasons
  const expectedYield = seasons
    .filter(s => s.status === 'ACTIVE')
    .reduce((sum, s) => sum + (s.yieldPerHa || 0), 0);

  const metrics = [
    {
      title: 'Total Seasons',
      value: totalSeasons,
      subtitle: `${seasons.filter(s => s.status === 'COMPLETED').length} completed`,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Seasons',
      value: activeSeasons,
      subtitle: `${((activeSeasons/totalSeasons || 0) * 100).toFixed(0)}% of total`,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Harvest Due',
      value: harvestDue,
      subtitle: 'Next 30 days',
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Expected Yield',
      value: `${expectedYield.toFixed(0)} kg`,
      subtitle: 'Active seasons',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div
            key={metric.title}
            className="bg-card rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">{metric.title}</span>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <Icon className={`w-4 h-4 ${metric.color}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {metric.value}
            </div>
            <div className="text-xs text-gray-500">{metric.subtitle}</div>
          </div>
        );
      })}
    </div>
  );
}



