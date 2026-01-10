import { Download, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { SeasonHeader } from './SeasonHeader';
import { SeasonKPICards } from './SeasonKPICards';
import { SeasonTabs } from './SeasonTabs';
import { ActivityFeed } from './ActivityFeed';
import { Season, SeasonStatus, Activity } from '../types';

interface SeasonDetailViewProps {
  season: Season;
  activities: Activity[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onBack: () => void;
  onEditSeason: (season: Season) => void;
  onStartSeason: (season: Season) => void;
  onCompleteSeason: (season: Season) => void;
  onCancelSeason: (season: Season) => void;
  onArchiveSeason: (season: Season) => void;
  handleExportCSV: () => void;
  getStatusColor: (status: SeasonStatus) => string;
  getStatusLabel: (status: SeasonStatus) => string;
  formatDateRange: (startDate: string, endDate: string) => string;
}

export function SeasonDetailView({
  season,
  activities,
  activeTab,
  setActiveTab,
  onBack,
  onEditSeason,
  onStartSeason,
  onCompleteSeason,
  onCancelSeason,
  onArchiveSeason,
  handleExportCSV,
  getStatusColor,
  getStatusLabel,
  formatDateRange,
}: SeasonDetailViewProps) {
  return (
    <>
      <SeasonHeader
        viewMode="detail"
        selectedSeason={season}
        onNewSeason={() => {}}
        onExport={handleExportCSV}
        onBack={onBack}
        onEdit={() => onEditSeason(season)}
        onStartSeason={onStartSeason}
        onCompleteSeason={onCompleteSeason}
        onCancelSeason={onCancelSeason}
        onArchiveSeason={onArchiveSeason}
        getStatusColor={getStatusColor}
        getStatusLabel={getStatusLabel}
        formatDateRange={formatDateRange}
      />

      {/* Main Content */}
      <div className="max-w-[1800px] mx-auto p-6 space-y-6">
        <SeasonKPICards season={season} />
        <SeasonTabs 
          season={season} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          activities={activities}
        />
        <ActivityFeed activities={activities} />
      </div>

      {/* Sticky Footer */}
      <div className="bg-card border-t border-border px-6 py-4 fixed bottom-0 left-0 right-0 shadow-lg">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <Button variant="outline" onClick={onBack} className="acm-rounded-sm">
            Cancel
          </Button>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleExportCSV}
              className="acm-rounded-sm border-border"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-white acm-rounded-sm"
              onClick={() => toast.success('Changes saved successfully')}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}



