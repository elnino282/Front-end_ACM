import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wheat, DollarSign, CheckCircle2, AlertTriangle } from "lucide-react";
import { useReports } from "./hooks/useReports";
import { Sidebar } from "./components/Sidebar";
import { HeaderBar } from "./components/HeaderBar";
import { KPICards } from "./components/KPICards";
import { YieldTab } from "./components/YieldTab";
import { CostTab } from "./components/CostTab";
import { PerformanceTab } from "./components/PerformanceTab";
import { PesticideTab } from "./components/PesticideTab";
import { FilterDrawer } from "./components/FilterDrawer";
import { ExportModal } from "./components/ExportModal";
import type { ReportSection } from "./types";

export function Reports() {
    const {
        activeSection, selectedSeason, yieldViewMode, isFilterDrawerOpen,
        isExportModalOpen, isExporting, exportFormat, includeCharts,
        includeNotes, filters, setActiveSection, setSelectedSeason,
        setYieldViewMode, setIsFilterDrawerOpen, setIsExportModalOpen,
        setExportFormat, setIncludeCharts, setIncludeNotes, setFilters,
        handleExport, handleApplyFilters, handleClearFilters,
        getYieldChartData, getPesticideStatusBadge,
    } = useReports();

    const tabConfig = [
        { value: "yield", icon: Wheat, label: "Yield" },
        { value: "cost", icon: DollarSign, label: "Cost" },
        { value: "performance", icon: CheckCircle2, label: "Tasks" },
        { value: "pesticide", icon: AlertTriangle, label: "Pesticide" },
    ];

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="max-w-[1920px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-0">
                    <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

                    <main className="p-6">
                        <HeaderBar
                            selectedSeason={selectedSeason}
                            onSeasonChange={setSelectedSeason}
                            onFilterClick={() => setIsFilterDrawerOpen(true)}
                            onExportClick={() => setIsExportModalOpen(true)}
                        />
                        <KPICards />

                        <Card className="border-border rounded-2xl shadow-sm">
                            <CardContent className="px-6 py-4">
                                <Tabs value={activeSection} onValueChange={(v: string) => setActiveSection(v as ReportSection)}>
                                    <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 mb-6 bg-muted rounded-xl p-1">
                                        {tabConfig.map(({ value, icon: Icon, label }) => (
                                            <TabsTrigger
                                                key={value}
                                                value={value}
                                                className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-primary"
                                            >
                                                <Icon className="w-4 h-4 mr-2" />
                                                <span className="hidden sm:inline">{label}</span>
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>

                                    <TabsContent value="yield" className="mt-0">
                                        <YieldTab yieldViewMode={yieldViewMode} onViewModeChange={setYieldViewMode} chartData={getYieldChartData()} />
                                    </TabsContent>
                                    <TabsContent value="cost" className="mt-0">
                                        <CostTab />
                                    </TabsContent>
                                    <TabsContent value="performance" className="mt-0">
                                        <PerformanceTab />
                                    </TabsContent>
                                    <TabsContent value="pesticide" className="mt-0">
                                        <PesticideTab getPesticideStatusBadge={getPesticideStatusBadge} />
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </main>
                </div>
            </div>

            <FilterDrawer
                isOpen={isFilterDrawerOpen}
                onOpenChange={setIsFilterDrawerOpen}
                filters={filters}
                onFiltersChange={setFilters}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
            />
            <ExportModal
                isOpen={isExportModalOpen}
                onOpenChange={setIsExportModalOpen}
                isExporting={isExporting}
                exportFormat={exportFormat}
                onExportFormatChange={setExportFormat}
                includeCharts={includeCharts}
                onIncludeChartsChange={setIncludeCharts}
                includeNotes={includeNotes}
                onIncludeNotesChange={setIncludeNotes}
                onExport={handleExport}
            />
        </div>
    );
}



