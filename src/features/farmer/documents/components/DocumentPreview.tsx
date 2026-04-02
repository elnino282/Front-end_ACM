import {
    Download,
    Share2,
    Printer,
    ZoomIn,
    ZoomOut,
    ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { Document, DocumentType } from "../types";

interface DocumentPreviewProps {
    document: Document | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onDownload: (doc: Document) => void;
    getDocumentIcon: (type: DocumentType) => JSX.Element;
    getRelatedDocuments: (doc: Document) => Document[];
    onSelectRelated: (doc: Document) => void;
}

export function DocumentPreview({
    document,
    isOpen,
    onOpenChange,
    onDownload,
    getDocumentIcon,
    getRelatedDocuments,
    onSelectRelated,
}: DocumentPreviewProps) {
    if (!document) return null;

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="w-full sm:max-w-2xl overflow-y-auto border-l-2 border-primary/20"
            >
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2 text-foreground pr-8">
                        {getDocumentIcon(document.type)}
                        {document.title}
                    </SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    {/* Preview Area */}
                    <Card className="border-border rounded-2xl overflow-hidden">
                        <div
                            className="h-96 flex items-center justify-center"
                            style={{
                                background:
                                    "linear-gradient(to bottom right, color-mix(in oklab, var(--primary) 5%, transparent), color-mix(in oklab, var(--secondary) 5%, transparent))",
                            }}
                        >
                            <div className="text-center">
                                <div className="text-8xl mb-4">{document.thumbnail}</div>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {document.type.toUpperCase()} Preview
                                </p>
                                <div className="flex gap-2 justify-center">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl border-border"
                                    >
                                        <ZoomIn className="w-4 h-4 mr-2" />
                                        Zoom In
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl border-border"
                                    >
                                        <ZoomOut className="w-4 h-4 mr-2" />
                                        Zoom Out
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button
                            className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl"
                            onClick={() => onDownload(document)}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                        </Button>
                        <Button
                            variant="outline"
                            className="rounded-xl border-border"
                        >
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                        </Button>
                        <Button
                            variant="outline"
                            className="rounded-xl border-border"
                        >
                            <Printer className="w-4 h-4 mr-2" />
                            Print
                        </Button>
                    </div>

                    {/* Metadata */}
                    <Card className="border-border rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-base text-foreground">
                                Document Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <Label className="text-xs text-muted-foreground">Description</Label>
                                <p className="text-sm text-foreground mt-1">
                                    {document.description}
                                </p>
                            </div>

                            <Separator className="bg-border" />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs text-muted-foreground">File Size</Label>
                                    <p className="text-sm text-foreground mt-1">
                                        {document.fileSize}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground">Author</Label>
                                    <p className="text-sm text-foreground mt-1">
                                        {document.author}
                                    </p>
                                </div>
                            </div>

                            {document.crop && (
                                <>
                                    <Separator className="bg-border" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-xs text-muted-foreground">Crop</Label>
                                            <p className="text-sm text-foreground mt-1">
                                                {document.crop}
                                            </p>
                                        </div>
                                        {document.stage && (
                                            <div>
                                                <Label className="text-xs text-muted-foreground">Stage</Label>
                                                <p className="text-sm text-foreground mt-1">
                                                    {document.stage}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            <Separator className="bg-border" />

                            <div>
                                <Label className="text-xs text-muted-foreground">Tags</Label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {document.tags.map((tag, index) => (
                                        <Badge
                                            key={index}
                                            className="bg-primary/10 text-primary border-primary/20"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <Separator className="bg-border" />

                            <div>
                                <Label className="text-xs text-muted-foreground">Last Updated</Label>
                                <p className="text-sm text-foreground mt-1">
                                    {new Date(document.updatedAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Related Documents */}
                    {getRelatedDocuments(document).length > 0 && (
                        <Card className="border-border rounded-2xl">
                            <CardHeader>
                                <CardTitle className="text-base text-foreground">
                                    Related Documents
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {getRelatedDocuments(document).map((relatedDoc) => (
                                        <div
                                            key={relatedDoc.id}
                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted cursor-pointer transition-colors"
                                            onClick={() => onSelectRelated(relatedDoc)}
                                        >
                                            <div className="text-2xl">{relatedDoc.thumbnail}</div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-foreground truncate">
                                                    {relatedDoc.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {relatedDoc.type.toUpperCase()}
                                                </p>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}



