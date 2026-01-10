import { useState, useEffect } from 'react';
import { Building2, MapPin, Search, RefreshCw, AlertCircle, ChevronRight, Filter } from 'lucide-react';
import { adminFarmApi, adminPlotApi } from '@/services/api.admin';

interface Farm {
  id: number;
  name: string;
  area: number | null;
  active: boolean;
  ownerUsername: string | null;
  provinceName: string | null;
  wardName: string | null;
}

interface Plot {
  id: number;
  plotName: string;
  area: number | null;
  soilType: string | null;
  farmId: number;
  farmName: string;
}

interface Season {
  id: number;
  seasonName: string;
  cropName: string;
  status: string;
  startDate: string;
  endDate: string | null;
}

export function FarmsPlotsPage() {
  const [activeTab, setActiveTab] = useState<'farms' | 'plots'>('farms');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [farms, setFarms] = useState<Farm[]>([]);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Detail states
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [farmPlots, setFarmPlots] = useState<Plot[]>([]);
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const [plotSeasons, setPlotSeasons] = useState<Season[]>([]);
  const [showFarmDetail, setShowFarmDetail] = useState(false);
  const [showPlotDetail, setShowPlotDetail] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  // Filter state
  const [farmFilter, setFarmFilter] = useState<number | null>(null);

  const fetchFarms = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminFarmApi.list({ page, size: 20, keyword: searchTerm || undefined });
      if (response?.result?.items) {
        setFarms(response.result.items);
        setTotalPages(response.result.totalPages || 0);
      }
    } catch (err) {
      setError('Failed to load farms');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlots = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminPlotApi.list({
        page,
        size: 20,
        keyword: searchTerm || undefined,
        farmId: farmFilter || undefined
      });
      if (response?.result?.items) {
        setPlots(response.result.items);
        setTotalPages(response.result.totalPages || 0);
      }
    } catch (err) {
      setError('Failed to load plots');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'farms') {
      fetchFarms();
    } else {
      fetchPlots();
    }
  }, [activeTab, page, farmFilter]);

  const handleSearch = () => {
    setPage(0);
    if (activeTab === 'farms') {
      fetchFarms();
    } else {
      fetchPlots();
    }
  };

  const handleViewFarm = async (farm: Farm) => {
    setSelectedFarm(farm);
    setShowFarmDetail(true);
    setDetailLoading(true);
    try {
      // Get farm plots
      const plotsResponse = await adminPlotApi.list({ farmId: farm.id });
      if (plotsResponse?.result?.items) {
        setFarmPlots(plotsResponse.result.items);
      }
    } catch (err) {
      console.error('Failed to load farm plots:', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleViewPlot = async (plot: Plot) => {
    setSelectedPlot(plot);
    setShowPlotDetail(true);
    setDetailLoading(true);
    try {
      const seasonsResponse = await adminPlotApi.getSeasons(plot.id);
      if (seasonsResponse?.result) {
        setPlotSeasons(Array.isArray(seasonsResponse.result) ? seasonsResponse.result : []);
      }
    } catch (err) {
      console.error('Failed to load plot seasons:', err);
      setPlotSeasons([]);
    } finally {
      setDetailLoading(false);
    }
  };

  const STATUS_COLORS: Record<string, string> = {
    PLANNED: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    COMPLETED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  const renderFarms = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search farms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-sm w-64"
            />
          </div>
          <button
            onClick={handleSearch}
            className="inline-flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm hover:bg-muted/50"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>
        <button
          onClick={fetchFarms}
          className="inline-flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm hover:bg-muted/50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Owner</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Area (ha)</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Location</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center">
                  <div className="flex flex-col items-center gap-2 text-destructive">
                    <AlertCircle className="h-6 w-6" />
                    {error}
                    <button onClick={fetchFarms} className="text-sm text-primary hover:underline">
                      Try again
                    </button>
                  </div>
                </td>
              </tr>
            ) : farms.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  No farms found
                </td>
              </tr>
            ) : (
              farms.map((farm) => (
                <tr key={farm.id} className="border-b border-border hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm font-medium">{farm.name}</td>
                  <td className="px-4 py-3 text-sm">{farm.ownerUsername || '-'}</td>
                  <td className="px-4 py-3 text-sm">{farm.area?.toFixed(2) || '-'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${farm.active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                      {farm.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {[farm.wardName, farm.provinceName].filter(Boolean).join(', ') || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleViewFarm(farm)}
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                    >
                      View <ChevronRight className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="px-3 py-1 border border-border rounded text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages - 1}
            className="px-3 py-1 border border-border rounded text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );

  const renderPlots = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search plots..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-sm w-64"
            />
          </div>
          <select
            value={farmFilter || ''}
            onChange={(e) => { setFarmFilter(e.target.value ? Number(e.target.value) : null); setPage(0); }}
            className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
          >
            <option value="">All Farms</option>
            {farms.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={fetchPlots}
          className="inline-flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm hover:bg-muted/50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Farm</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Area (ha)</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Soil Type</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center">
                  <div className="flex flex-col items-center gap-2 text-destructive">
                    <AlertCircle className="h-6 w-6" />
                    {error}
                    <button onClick={fetchPlots} className="text-sm text-primary hover:underline">
                      Try again
                    </button>
                  </div>
                </td>
              </tr>
            ) : plots.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  No plots found
                </td>
              </tr>
            ) : (
              plots.map((plot) => (
                <tr key={plot.id} className="border-b border-border hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm font-medium">{plot.plotName || '-'}</td>
                  <td className="px-4 py-3 text-sm">{plot.farmName || '-'}</td>
                  <td className="px-4 py-3 text-sm">{plot.area?.toFixed(2) || '-'}</td>
                  <td className="px-4 py-3 text-sm">{plot.soilType || '-'}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleViewPlot(plot)}
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                    >
                      View Seasons <ChevronRight className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="px-3 py-1 border border-border rounded text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages - 1}
            className="px-3 py-1 border border-border rounded text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Farms & Plots</h1>
        <p className="text-muted-foreground">System-wide overview of all farms and plots</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-border mb-6">
        <button
          onClick={() => { setActiveTab('farms'); setPage(0); setSearchTerm(''); }}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${activeTab === 'farms'
            ? 'border-primary text-primary'
            : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
        >
          <Building2 className="inline-block h-4 w-4 mr-2" />
          Farms
        </button>
        <button
          onClick={() => { setActiveTab('plots'); setPage(0); setSearchTerm(''); fetchFarms(); }}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${activeTab === 'plots'
            ? 'border-primary text-primary'
            : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
        >
          <MapPin className="inline-block h-4 w-4 mr-2" />
          Plots
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'farms' && renderFarms()}
      {activeTab === 'plots' && renderPlots()}

      {/* Farm Detail Drawer */}
      {showFarmDetail && selectedFarm && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm cursor-pointer"
          onClick={() => setShowFarmDetail(false)}
        >
          <div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-lg overflow-auto cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Farm Details</h2>
                <button
                  onClick={() => setShowFarmDetail(false)}
                  className="p-2 hover:bg-muted rounded"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p className="text-sm">{selectedFarm.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Owner</label>
                    <p className="text-sm">{selectedFarm.ownerUsername || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Area</label>
                    <p className="text-sm">{selectedFarm.area?.toFixed(2) || '-'} ha</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <p className="text-sm">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${selectedFarm.active
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800'
                        }`}>
                        {selectedFarm.active ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <h3 className="text-sm font-medium mb-3">Plots ({farmPlots.length})</h3>
                  {detailLoading ? (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Loading plots...
                    </div>
                  ) : farmPlots.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No plots found for this farm</p>
                  ) : (
                    <div className="space-y-2">
                      {farmPlots.map(plot => (
                        <div key={plot.id} className="p-3 bg-muted/30 rounded-lg border border-border">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">{plot.plotName || '-'}</p>
                              <p className="text-xs text-muted-foreground">
                                {plot.area?.toFixed(2) || '-'} ha • {plot.soilType || 'No soil type'}
                              </p>
                            </div>
                            <button
                              onClick={() => { setShowFarmDetail(false); handleViewPlot(plot); }}
                              className="text-xs text-primary hover:underline"
                            >
                              View Seasons
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plot Detail Drawer */}
      {showPlotDetail && selectedPlot && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm cursor-pointer"
          onClick={() => setShowPlotDetail(false)}
        >
          <div
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-lg overflow-auto cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Plot Details</h2>
                <button
                  onClick={() => setShowPlotDetail(false)}
                  className="p-2 hover:bg-muted rounded"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p className="text-sm">{selectedPlot.plotName || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Farm</label>
                    <p className="text-sm">{selectedPlot.farmName || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Area</label>
                    <p className="text-sm">{selectedPlot.area?.toFixed(2) || '-'} ha</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Soil Type</label>
                    <p className="text-sm">{selectedPlot.soilType || '-'}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <h3 className="text-sm font-medium mb-3">Seasons ({plotSeasons.length})</h3>
                  {detailLoading ? (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Loading seasons...
                    </div>
                  ) : plotSeasons.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No seasons found for this plot</p>
                  ) : (
                    <div className="space-y-2">
                      {plotSeasons.map(season => (
                        <div key={season.id} className="p-3 bg-muted/30 rounded-lg border border-border">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">{season.seasonName}</p>
                              <p className="text-xs text-muted-foreground">
                                {season.cropName} • {new Date(season.startDate).toLocaleDateString()}
                              </p>
                            </div>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${STATUS_COLORS[season.status] || 'bg-gray-100 text-gray-800'
                              }`}>
                              {season.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
