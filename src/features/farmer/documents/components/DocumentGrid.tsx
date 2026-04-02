import type { Document, DocumentType } from "../types";
import { DocumentCard } from "./DocumentCard";

interface DocumentGridProps {
    documents: Document[];
    hoveredDocId: string | null;
    onHoverChange: (docId: string | null) => void;
    onPreview: (doc: Document) => void;
    onToggleFavorite: (docId: string) => void;
    onDownload: (doc: Document) => void;
    onOpen?: (doc: Document) => void;
    getDocumentIcon: (type: DocumentType) => JSX.Element;
}

export function DocumentGrid({
    documents,
    hoveredDocId,
    onHoverChange,
    onPreview,
    onToggleFavorite,
    onDownload,
    onOpen,
    getDocumentIcon,
}: DocumentGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {documents.map((doc) => (
                <DocumentCard
                    key={doc.id}
                    document={doc}
                    isHovered={hoveredDocId === doc.id}
                    onMouseEnter={() => onHoverChange(doc.id)}
                    onMouseLeave={() => onHoverChange(null)}
                    onPreview={onPreview}
                    onToggleFavorite={onToggleFavorite}
                    onDownload={onDownload}
                    onOpen={onOpen}
                    getDocumentIcon={getDocumentIcon}
                />
            ))}
        </div>
    );
}



