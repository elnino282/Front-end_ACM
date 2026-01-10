import { SeasonHeader } from './SeasonHeader';
import { SeasonFilters } from './SeasonFilters';
import { SeasonTable } from './SeasonTable';
import { SeasonCardList } from './SeasonCardList';
import { SeasonMetricsCards } from './SeasonMetricsCards';
import { Season, SeasonStatus, FilterState } from '../types';

interface SeasonListViewProps {
  // Data
  paginatedSeasons: Season[];
  filteredSeasons: Season[];
  selectedSeasons: string[];
  uniqueCrops: string[];
  uniqueYears: string[];

  // Filters & Search
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Pagination
  currentPage: number;
  setCurrentPage: (page: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (rows: number) => void;
  totalPages: number;

  // Handlers
  handleSelectAll: (checked: boolean) => void;
  handleSelectSeason: (seasonId: string, checked: boolean) => void;
  handleViewDetails: (season: Season) => void;
  handleDeleteSeason: (seasonId: string) => void;
  handleDuplicate: (season: Season) => void;
  handleExportCSV: () => void;
  onNewSeason: () => void;
  onStartSeason: (season: Season) => void;
  onCompleteSeason: (season: Season) => void;
  onCancelSeason: (season: Season) => void;
  onArchiveSeason: (season: Season) => void;

  // Helpers
  getStatusColor: (status: SeasonStatus) => string;
  getStatusLabel: (status: SeasonStatus) => string;
  formatDateRange: (startDate: string, endDate: string) => string;
  calculateProgress: (startDate: string, endDate: string) => number;
}

export function SeasonListView({
  paginatedSeasons,
  filteredSeasons,
  selectedSeasons,
  uniqueCrops,
  uniqueYears,
  filters,
  setFilters,
  searchQuery,
  setSearchQuery,
  currentPage,
  setCurrentPage,
  rowsPerPage,
  setRowsPerPage,
  totalPages,
  handleSelectAll,
  handleSelectSeason,
  handleViewDetails,
  handleDeleteSeason,
  handleDuplicate,
  handleExportCSV,
  onNewSeason,
  onStartSeason,
  onCompleteSeason,
  onCancelSeason,
  onArchiveSeason,
  getStatusColor,
  getStatusLabel,
  formatDateRange,
  calculateProgress,
}: SeasonListViewProps) {
  return (
    <>
      <SeasonHeader
        viewMode="list"
        selectedSeason={null}
        onNewSeason={onNewSeason}
        onExport={handleExportCSV}
        onBack={() => { }}
        getStatusColor={getStatusColor}
        getStatusLabel={getStatusLabel}
        formatDateRange={formatDateRange}
      />

      <div className="max-w-[1800px] mx-auto px-6 space-y-6">
        <SeasonMetricsCards seasons={filteredSeasons} />

        <SeasonFilters
          filters={filters}
          setFilters={setFilters}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          uniqueCrops={uniqueCrops}
          uniqueYears={uniqueYears}
        />

        <SeasonCardList
          seasons={paginatedSeasons}
          selectedSeasons={selectedSeasons}
          onSelectSeason={handleSelectSeason}
          onViewDetails={handleViewDetails}
          onDelete={handleDeleteSeason}
          onDuplicate={handleDuplicate}
          onStartSeason={onStartSeason}
          onCompleteSeason={onCompleteSeason}
          onCancelSeason={onCancelSeason}
          onArchiveSeason={onArchiveSeason}
          getStatusColor={getStatusColor}
          getStatusLabel={getStatusLabel}
          formatDateRange={formatDateRange}
          calculateProgress={calculateProgress}
        />
      </div>
    </>
  );
}



