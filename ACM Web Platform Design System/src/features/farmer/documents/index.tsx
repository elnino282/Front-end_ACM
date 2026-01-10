import { Search, Filter, FileText } from "lucide-react";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/shared/ui";
import { useDocuments } from "./hooks/useDocuments";
import { DocumentFilters } from "./components/DocumentFilters";
import { DocumentGrid } from "./components/DocumentGrid";
import { EmptyState } from "./components/EmptyState";
import { DocumentPreview } from "./components/DocumentPreview";

export function Documents() {
    const {
        searchQuery,
        activeTab,
        selectedDoc,
        isPreviewOpen,
        isFilterOpen,
        hoveredDocId,
        filters,
        filteredDocuments,
        activeFilterCount,
        isLoading,
        isEmpty,
        setSearchQuery,
        setActiveTab,
        setIsPreviewOpen,
        setIsFilterOpen,
        setHoveredDocId,
        setSelectedDoc,
        handleToggleFavorite,
        handleDownload,
        handlePreview,
        handleOpenDocument,
        handleFilterChange,
        clearAllFilters,
        getDocumentIcon,
        getRelatedDocuments,
    } = useDocuments();

    return (
        <div className="min-h-screen bg-background pb-20">
            <div className="max-w-[1920px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-0">
                    {/* Left Sidebar - Filters */}
                    <DocumentFilters
                        filters={filters}
                        activeFilterCount={activeFilterCount}
                        isFilterOpen={isFilterOpen}
                        onFilterChange={handleFilterChange}
                        onClearFilters={clearAllFilters}
                    />

                    {/* Main Content */}
                    <main className="p-6">
                        <Card className="mb-6 border border-border rounded-xl shadow-sm">
                            <CardContent className="px-6 py-4">
                                <PageHeader
                                    className="mb-0"
                                    icon={<FileText className="w-8 h-8" />}
                                    title="Documents"
                                    subtitle="Access farming guides, tutorials, and resources"
                                />
                            </CardContent>
                        </Card>

                        {/* Search & Filters */}
                        <Card className="border-border rounded-2xl shadow-sm mb-6">
                            <CardContent className="px-6 py-4">
                                <div className="flex flex-wrap items-center justify-start gap-4">
                                    <div className="relative w-[320px]">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search documents..."
                                            value={searchQuery}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                                            className="pl-10 rounded-xl border-border focus:border-primary"
                                        />
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="lg:hidden rounded-xl border-primary text-primary"
                                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    >
                                        <Filter className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                        {/* Tabs and Content */}
                        <Card className="border-border rounded-2xl shadow-sm">
                            <CardContent className="px-6 py-4">
                                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "all" | "favorites" | "recent")}>
                                    <TabsList className="w-full md:w-auto grid grid-cols-3 mb-6 bg-muted rounded-xl p-1">
                                        <TabsTrigger
                                            value="all"
                                            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-primary"
                                        >
                                            All Documents
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="favorites"
                                            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-primary"
                                        >
                                            ⭐ Favorites
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="recent"
                                            className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-primary"
                                        >
                                            🕐 Recent
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value={activeTab} className="mt-0">
                                        {isLoading ? (
                                            <div className="p-6 text-sm text-muted-foreground">
                                                Loading documents...
                                            </div>
                                        ) : isEmpty || filteredDocuments.length === 0 ? (
                                            <EmptyState
                                                searchQuery={searchQuery}
                                                activeFilterCount={activeFilterCount}
                                                onClearAll={() => {
                                                    setSearchQuery("");
                                                    clearAllFilters();
                                                }}
                                            />
                                        ) : (
                                            <DocumentGrid
                                                documents={filteredDocuments}
                                                hoveredDocId={hoveredDocId}
                                                onHoverChange={setHoveredDocId}
                                                onPreview={handlePreview}
                                                onToggleFavorite={handleToggleFavorite}
                                                onDownload={handleDownload}
                                                onOpen={handleOpenDocument}
                                                getDocumentIcon={getDocumentIcon}
                                            />
                                        )}
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </main>
                </div>
            </div>

            {/* Preview Drawer */}
            <DocumentPreview
                document={selectedDoc}
                isOpen={isPreviewOpen}
                onOpenChange={setIsPreviewOpen}
                onDownload={handleDownload}
                getDocumentIcon={getDocumentIcon}
                getRelatedDocuments={getRelatedDocuments}
                onSelectRelated={setSelectedDoc}
            />
        </div>
    );
}





