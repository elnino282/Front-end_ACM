import { useCallback, useEffect, useMemo, useState } from "react";
import {
    FileText,
    Image as ImageIcon,
    Video,
    FileSpreadsheet,
    BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import { 
    useDocumentsList, 
    useAddFavorite, 
    useRemoveFavorite, 
    useRecordDocumentOpen,
    type Document as ApiDocument,
    type DocumentListParams,
} from "@/entities/document";
import type { Document, Filters, DocumentType } from "../types";

const mapApiToDocument = (doc: ApiDocument): Document => ({
    id: String(doc.documentId),
    documentId: doc.documentId,
    title: doc.title,
    url: doc.url,
    type: "guide",
    thumbnail: "📄",
    tags: [doc.crop, doc.stage, doc.topic].filter(Boolean) as string[],
    crop: doc.crop ?? undefined,
    stage: doc.stage ?? undefined,
    topic: doc.topic ?? "General",
    season: undefined,
    updatedAt: doc.createdAt ?? new Date().toISOString(),
    isFavorite: doc.isFavorited ?? false,
    description: doc.description ?? "",
    fileSize: "N/A",
    author: "System",
    relatedDocs: [],
});

export function useDocuments() {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"all" | "favorites" | "recent">("all");
    const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(true);
    const [hoveredDocId, setHoveredDocId] = useState<string | null>(null);

    const [filters, setFilters] = useState<Filters>({
        crops: [],
        stages: [],
        topics: [],
        types: [],
        seasons: [],
    });

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Build API params
    const apiParams: DocumentListParams = useMemo(() => ({
        tab: activeTab,
        q: debouncedSearchQuery.length >= 2 ? debouncedSearchQuery : undefined,
        crop: filters.crops.length === 1 ? filters.crops[0] : undefined,
        stage: filters.stages.length === 1 ? filters.stages[0] : undefined,
        topic: filters.topics.length === 1 ? filters.topics[0] : undefined,
        page: 0,
        size: 50,
    }), [activeTab, debouncedSearchQuery, filters.crops, filters.stages, filters.topics]);

    // API hooks
    const { data: apiResponse, isLoading, error } = useDocumentsList(apiParams);
    const addFavoriteMutation = useAddFavorite();
    const removeFavoriteMutation = useRemoveFavorite();
    const recordOpenMutation = useRecordDocumentOpen();

    // Transform API response to UI documents
    const documents = useMemo(() => {
        if (!apiResponse?.items) return [];
        return apiResponse.items.map(mapApiToDocument);
    }, [apiResponse]);

    // Client-side filtering for multi-select filters
    const filteredDocuments = useMemo(() => {
        let result = documents;

        // Client-side search filter (for additional text matching)
        if (debouncedSearchQuery.length >= 2) {
            result = result.filter(
                (doc) =>
                    doc.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
                    doc.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
            );
        }

        // Multi-select filter for crops (if more than 1 selected)
        if (filters.crops.length > 1) {
            result = result.filter((doc) =>
                doc.crop ? filters.crops.includes(doc.crop) : false
            );
        }

        // Multi-select filter for stages
        if (filters.stages.length > 1) {
            result = result.filter((doc) =>
                doc.stage ? filters.stages.includes(doc.stage) : false
            );
        }

        // Multi-select filter for topics
        if (filters.topics.length > 1) {
            result = result.filter((doc) => filters.topics.includes(doc.topic));
        }

        // Type filter (client-side only since backend doesn't have type)
        if (filters.types.length > 0) {
            result = result.filter((doc) => filters.types.includes(doc.type));
        }

        return result;
    }, [documents, debouncedSearchQuery, filters]);

    const handleToggleFavorite = useCallback((docId: string) => {
        const doc = documents.find((d) => d.id === docId);
        if (!doc) return;

        const numericId = doc.documentId;
        
        if (doc.isFavorite) {
            removeFavoriteMutation.mutate(numericId, {
                onSuccess: () => {
                    toast.success("Removed from Favorites");
                },
                onError: () => {
                    toast.error("Failed to remove from favorites");
                },
            });
        } else {
            addFavoriteMutation.mutate(numericId, {
                onSuccess: () => {
                    toast.success("Added to Favorites");
                },
                onError: () => {
                    toast.error("Failed to add to favorites");
                },
            });
        }
    }, [documents, addFavoriteMutation, removeFavoriteMutation]);

    const handleOpenDocument = useCallback((doc: Document) => {
        // Record the open for Recent tab
        recordOpenMutation.mutate(doc.documentId, {
            onSuccess: () => {
                // Open URL in new tab
                window.open(doc.url, "_blank", "noopener,noreferrer");
            },
            onError: () => {
                // Still open the document even if recording fails
                window.open(doc.url, "_blank", "noopener,noreferrer");
            },
        });
    }, [recordOpenMutation]);

    const handleDownload = useCallback((doc: Document) => {
        // For documents as links, "download" means open in new tab
        handleOpenDocument(doc);
    }, [handleOpenDocument]);

    const handlePreview = useCallback((doc: Document) => {
        setSelectedDoc(doc);
        setIsPreviewOpen(true);
    }, []);

    const handleFilterChange = useCallback((
        category: keyof Filters,
        value: string,
        checked: boolean
    ) => {
        setFilters((prev) => ({
            ...prev,
            [category]: checked
                ? [...prev[category], value]
                : prev[category].filter((v) => v !== value),
        }));
    }, []);

    const clearAllFilters = useCallback(() => {
        setFilters({
            crops: [],
            stages: [],
            topics: [],
            types: [],
            seasons: [],
        });
        toast.info("Filters Cleared");
    }, []);

    const getDocumentIcon = useCallback((type: DocumentType) => {
        switch (type) {
            case "pdf":
                return <FileText className="w-5 h-5 text-destructive" />;
            case "image":
                return <ImageIcon className="w-5 h-5 text-secondary" />;
            case "video":
                return <Video className="w-5 h-5 text-primary" />;
            case "spreadsheet":
                return <FileSpreadsheet className="w-5 h-5 text-primary" />;
            case "guide":
                return <BookOpen className="w-5 h-5 text-accent" />;
        }
    }, []);

    const getRelatedDocuments = useCallback((doc: Document) => {
        if (!doc.relatedDocs) return [];
        return documents.filter((d) => doc.relatedDocs?.includes(d.id));
    }, [documents]);

    useEffect(() => {
        if (error) {
            toast.error("Failed to load documents", {
                description: error instanceof Error ? error.message : "Unknown error",
            });
        }
    }, [error]);

    const activeFilterCount =
        filters.crops.length +
        filters.stages.length +
        filters.topics.length +
        filters.types.length +
        filters.seasons.length;

    const isEmpty = useMemo(() => documents.length === 0 && !isLoading, [documents.length, isLoading]);

    return {
        // State
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

        // Setters
        setSearchQuery,
        setActiveTab,
        setIsPreviewOpen,
        setIsFilterOpen,
        setHoveredDocId,
        setSelectedDoc,

        // Handlers
        handleToggleFavorite,
        handleDownload,
        handlePreview,
        handleOpenDocument,
        handleFilterChange,
        clearAllFilters,

        // Utilities
        getDocumentIcon,
        getRelatedDocuments,
    };
}



