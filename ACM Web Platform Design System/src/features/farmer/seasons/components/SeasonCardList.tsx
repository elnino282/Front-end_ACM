import { MoreVertical, MapPin, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import type { Season, SeasonStatus } from '../types';

interface SeasonCardListProps {
  seasons: Season[];
  selectedSeasons: string[];
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

export function SeasonCardList({
  seasons,
  selectedSeasons,
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
}: SeasonCardListProps) {
  
  const getStatusIcon = (status: SeasonStatus) => {
    switch (status) {
      case 'PLANNED': return 'bg-blue-100 text-blue-700';
      case 'ACTIVE': return 'bg-green-100 text-green-700';
      case 'COMPLETED': return 'bg-yellow-100 text-yellow-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      case 'ARCHIVED': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-4 mb-6">
      {seasons.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border-2 border-dashed border-gray-200">
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 bg-gray-50 rounded-full">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No seasons found</h3>
            <p className="text-sm text-gray-500 max-w-sm">
              Start planning your first growing season to track crops, tasks, and yields.
            </p>
          </div>
        </div>
      ) : (
        seasons.map((season) => {
          const progress = calculateProgress(season.startDate, season.endDate || season.startDate);
          const isSelected = selectedSeasons.includes(season.id);
          
          return (
            <div
              key={season.id}
              className={`bg-card rounded-lg border-2 transition-all hover:shadow-md ${
                isSelected ? 'border-green-500 shadow-sm' : 'border-gray-200'
              }`}
            >
              <div className="p-4">
                {/* Header Row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => onSelectSeason(season.id, e.target.checked)}
                      className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    
                    {/* Season Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusIcon(season.status)}`}>
                          {getStatusLabel(season.status)}
                        </span>
                        {season.tasksTotal > 0 && season.tasksCompleted < season.tasksTotal && (
                          <span className="flex items-center gap-1 text-xs text-orange-600">
                            <AlertCircle className="w-3 h-3" />
                            {season.tasksTotal - season.tasksCompleted} tasks pending
                          </span>
                        )}
                      </div>
                      
                      <h3
                        className="text-lg font-semibold text-gray-900 hover:text-green-600 cursor-pointer"
                        onClick={() => onViewDetails(season)}
                      >
                        {season.name}
                      </h3>
                      
                      {/* Farm/Plot Context */}
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {season.farmName || 'Farm'} › {season.plotName || `Plot #${season.plotId}`}
                          {season.plotId && ' › ' + '2.5 ha'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions Menu */}
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Details Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 pt-3 border-t border-gray-100">
                  {/* Timeline */}
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDateRange(season.startDate, season.endDate || season.startDate)}</span>
                    </div>
                    <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`absolute top-0 left-0 h-full rounded-full transition-all ${
                          season.status === 'ACTIVE' ? 'bg-green-500' : 
                          season.status === 'COMPLETED' ? 'bg-yellow-500' : 'bg-blue-400'
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{progress}% complete</div>
                  </div>

                  {/* Crop Info */}
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">{season.crop}</span>
                      {season.variety && season.variety !== 'No variety' && (
                        <span className="text-gray-500"> ({season.variety})</span>
                      )}
                    </div>
                    {season.initialPlantCount && (
                      <div className="text-xs text-gray-500">
                        {season.initialPlantCount} plants
                      </div>
                    )}
                  </div>

                  {/* Yield Info */}
                  <div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <TrendingUp className="w-4 h-4" />
                      <span className="font-medium">
                        {season.actualYieldKg || season.expectedYieldKg || season.yieldPerHa || 0} kg
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {season.actualYieldKg ? 'Actual yield' : 'Expected yield'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}



