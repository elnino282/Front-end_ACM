import { Star, ExternalLink, Clock, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Document, DocumentType } from "../types";

interface DocumentCardProps {
    document: Document;
    isHovered: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onPreview: (doc: Document) => void;
    onToggleFavorite: (docId: string) => void;
    onDownload: (doc: Document) => void;
    onOpen?: (doc: Document) => void;
    getDocumentIcon: (type: DocumentType) => JSX.Element;
}

export function DocumentCard({
    document,
    isHovered,
    onMouseEnter,
    onMouseLeave,
    onPreview,
    onToggleFavorite,
    onDownload,
    onOpen,
    getDocumentIcon,
}: DocumentCardProps) {
    const handleOpen = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onOpen) {
            onOpen(document);
        } else {
            onDownload(document);
        }
    };

    return (
        <Card
            className="border-border rounded-2xl shadow-sm hover:shadow-lg transition-all cursor-pointer group relative overflow-hidden"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={() => onPreview(document)}
        >
            {/* Thumbnail */}
            <div
                className="h-40 flex items-center justify-center text-6xl relative"
                style={{
                    background:
                        "linear-gradient(to bottom right, color-mix(in oklab, var(--primary) 10%, transparent), color-mix(in oklab, var(--secondary) 10%, transparent))",
                }}
            >
                {document.thumbnail}

                {/* Hover Overlay with Open Button */}
                {isHovered && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 animate-in fade-in duration-200">
                        <Button
                            size="lg"
                            className="bg-primary text-white hover:bg-primary/90 rounded-xl"
                            onClick={handleOpen}
                        >
                            <ExternalLink className="w-5 h-5 mr-2" />
                            Open
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="bg-card text-foreground hover:bg-muted/50 rounded-xl"
                            onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                onPreview(document);
                            }}
                        >
                            <Eye className="w-5 h-5 mr-2" />
                            Preview
                        </Button>
                    </div>
                )}
            </div>

            <CardContent className="pt-4">
                {/* Type Icon and Favorite */}
                <div className="flex items-start justify-between mb-2">
                    {getDocumentIcon(document.type)}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 -mt-1 -mr-2"
                        onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            onToggleFavorite(document.id);
                        }}
                    >
                        <Star
                            className={`w-4 h-4 ${document.isFavorite
                                ? "text-accent fill-current"
                                : "text-muted-foreground"
                                }`}
                        />
                    </Button>
                </div>

                {/* Title */}
                <h4 className="text-sm font-medium text-foreground mb-2 line-clamp-2 min-h-[40px]">
                    {document.title}
                </h4>

                {/* Tags (Crop/Stage/Topic) */}
                <div className="flex flex-wrap gap-1 mb-3 min-h-[24px]">
                    {document.crop && (
                        <Badge
                            variant="outline"
                            className="text-xs bg-primary/10 text-primary border-primary/20"
                        >
                            {document.crop}
                        </Badge>
                    )}
                    {document.stage && (
                        <Badge
                            variant="outline"
                            className="text-xs bg-secondary/10 text-secondary border-secondary/20"
                        >
                            {document.stage}
                        </Badge>
                    )}
                    {document.topic && document.topic !== "General" && (
                        <Badge
                            variant="outline"
                            className="text-xs bg-accent/10 text-accent border-accent/20"
                        >
                            {document.topic}
                        </Badge>
                    )}
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(document.updatedAt).toLocaleDateString()}
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={handleOpen}
                    >
                        <ExternalLink className="w-4 h-4 text-secondary" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}



