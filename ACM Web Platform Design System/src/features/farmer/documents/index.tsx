import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/hooks/useI18n";
import { PageHeader } from "@/shared/ui";
import { FileText } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DocumentFilterBar } from "./components/DocumentFilterBar";
import { DocumentGrid } from "./components/DocumentGrid";
import { DocumentPreview } from "./components/DocumentPreview";
import { EmptyState } from "./components/EmptyState";
import { useDocumentFilters } from "./hooks/useDocumentFilters";
import { useDocuments } from "./hooks/useDocuments";

export function Documents() {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  // URL-based filter management
  const {
    filters,
    setFilter,
    clearFilters,
    hasActiveFilters,
    activeFilterCount,
    apiParams,
  } = useDocumentFilters();

  // Document data and handlers
  const {
    selectedDoc,
    isPreviewOpen,
    hoveredDocId,
    filteredDocuments,
    isLoading,
    isEmpty,
    setIsPreviewOpen,
    setHoveredDocId,
    setSelectedDoc,
    handleToggleFavorite,
    handleDownload,
    handlePreview,
    handleOpenDocument,
    getDocumentIcon,
    getRelatedDocuments,
  } = useDocuments(apiParams);

  const documentIdParam = Number(searchParams.get("documentId"));
  const parsedDocumentId = Number.isFinite(documentIdParam)
    ? documentIdParam
    : null;

  const handlePreviewOpenChange = (open: boolean) => {
    // If preview was opened via deep-link (?documentId=...), clear it so closing stays closed.
    if (!open && searchParams.get("documentId")) {
      const next = new URLSearchParams(searchParams);
      next.delete("documentId");
      setSearchParams(next, { replace: true });
    }
    setIsPreviewOpen(open);
  };

  useEffect(() => {
    if (!parsedDocumentId) return;
    if (selectedDoc?.documentId === parsedDocumentId && isPreviewOpen) return;
    const match = filteredDocuments.find(
      (doc) => doc.documentId === parsedDocumentId,
    );
    if (match) {
      setSelectedDoc(match);
      setIsPreviewOpen(true);
    }
  }, [
    parsedDocumentId,
    selectedDoc?.documentId,
    isPreviewOpen,
    filteredDocuments,
    setSelectedDoc,
    setIsPreviewOpen,
  ]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-[1920px] mx-auto p-6">
        {/* Page Header */}
        <Card className="mb-6 border border-border rounded-xl shadow-sm">
          <CardContent className="px-6 py-4">
            <PageHeader
              className="mb-0"
              icon={<FileText className="w-8 h-8" />}
              title={t('documents.title')}
              subtitle={t('documents.subtitle')}
            />
          </CardContent>
        </Card>

        {/* Compact Filter Bar */}
        <div className="mb-6">
          <DocumentFilterBar
            filters={filters}
            onFilterChange={setFilter}
            onClearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {/* Tabs and Content */}
        <Card className="border-border rounded-2xl shadow-sm">
          <CardContent className="px-6 py-4">
            <Tabs
              value={filters.tab}
              onValueChange={(value) =>
                setFilter("tab", value as "all" | "favorites" | "recent")
              }
            >
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

              <TabsContent value={filters.tab} className="mt-0">
                {isLoading ? (
                  <div className="p-6 text-sm text-muted-foreground">
                    Loading documents...
                  </div>
                ) : isEmpty || filteredDocuments.length === 0 ? (
                  <EmptyState
                    searchQuery={filters.q}
                    activeFilterCount={activeFilterCount}
                    onClearAll={clearFilters}
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
      </div>

      {/* Preview Drawer */}
      <DocumentPreview
        document={selectedDoc}
        isOpen={isPreviewOpen}
        onOpenChange={handlePreviewOpenChange}
        onDownload={handleDownload}
        getDocumentIcon={getDocumentIcon}
        getRelatedDocuments={getRelatedDocuments}
        onSelectRelated={setSelectedDoc}
      />
    </div>
  );
}
