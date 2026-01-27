import {
  useAddFavorite,
  useDocumentsList,
  useRecordDocumentOpen,
  useRemoveFavorite,
  type Document as ApiDocument,
  type DocumentListParams,
} from "@/entities/document";
import {
  BookOpen,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { Document, DocumentType } from "../types";

const mapApiToDocument = (doc: ApiDocument): Document => ({
  id: String(doc.documentId),
  documentId: doc.documentId,
  title: doc.title,
  url: doc.url,
  type: mapDocumentType(doc.documentType),
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

const mapDocumentType = (type: string | null | undefined): DocumentType => {
  switch (type?.toUpperCase()) {
    case "GUIDE":
      return "guide";
    case "TEMPLATE":
      return "pdf";
    case "ANNOUNCEMENT":
      return "pdf";
    case "SYSTEM_HELP":
      return "guide";
    default:
      return "guide";
  }
};

interface UseDocumentsParams {
  tab?: "all" | "favorites" | "recent";
  q?: string;
  type?: string;
  crop?: string;
  stage?: string;
  topic?: string;
  sort?: string;
}

export function useDocuments(params?: UseDocumentsParams) {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [hoveredDocId, setHoveredDocId] = useState<string | null>(null);

  // Build API params from external params
  const apiParams: DocumentListParams = useMemo(
    () => ({
      tab: params?.tab || "all",
      q: params?.q,
      type: params?.type,
      crop: params?.crop,
      stage: params?.stage,
      topic: params?.topic,
      sort: params?.sort as DocumentListParams["sort"],
      page: 0,
      size: 50,
    }),
    [
      params?.tab,
      params?.q,
      params?.type,
      params?.crop,
      params?.stage,
      params?.topic,
      params?.sort,
    ],
  );

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

  // Documents are already filtered by backend, return directly
  const filteredDocuments = documents;

  const handleToggleFavorite = useCallback(
    (docId: string) => {
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
    },
    [documents, addFavoriteMutation, removeFavoriteMutation],
  );

  const handleOpenDocument = useCallback(
    (doc: Document) => {
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
    },
    [recordOpenMutation],
  );

  const handleDownload = useCallback(
    (doc: Document) => {
      // For documents as links, "download" means open in new tab
      handleOpenDocument(doc);
    },
    [handleOpenDocument],
  );

  const handlePreview = useCallback((doc: Document) => {
    setSelectedDoc(doc);
    setIsPreviewOpen(true);
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

  const getRelatedDocuments = useCallback(
    (doc: Document) => {
      if (!doc.relatedDocs) return [];
      return documents.filter((d) => doc.relatedDocs?.includes(d.id));
    },
    [documents],
  );

  useEffect(() => {
    if (error) {
      toast.error("Failed to load documents", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }, [error]);

  const isEmpty = useMemo(
    () => documents.length === 0 && !isLoading,
    [documents.length, isLoading],
  );

  return {
    // State
    selectedDoc,
    isPreviewOpen,
    hoveredDocId,
    filteredDocuments,
    isLoading,
    isEmpty,

    // Setters
    setIsPreviewOpen,
    setHoveredDocId,
    setSelectedDoc,

    // Handlers
    handleToggleFavorite,
    handleDownload,
    handlePreview,
    handleOpenDocument,

    // Utilities
    getDocumentIcon,
    getRelatedDocuments,
  };
}
