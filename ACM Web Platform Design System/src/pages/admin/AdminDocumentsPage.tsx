import { useState, useEffect } from 'react';
import {
    FileText,
    Search,
    RefreshCw,
    AlertCircle,
    Plus,
    Edit,
    X,
    ExternalLink,
    Loader2,
    MoreVertical,
    Ban,
    CheckCircle2,
    Trash2,
    AlertTriangle,
} from 'lucide-react';
import {
    adminDocumentApi,
    type AdminDocument,
    type AdminDocumentCreateRequest,
} from '@/services/api.admin';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

// Document Type options
const DOCUMENT_TYPES = ['POLICY', 'GUIDE', 'MANUAL', 'LEGAL', 'OTHER'] as const;
type DocumentType = (typeof DOCUMENT_TYPES)[number];

// Status options
const DOCUMENT_STATUSES = ['ACTIVE', 'INACTIVE'] as const;
type DocumentStatus = (typeof DOCUMENT_STATUSES)[number];

// Type badges styling
const typeBadgeColors: Record<DocumentType, string> = {
    POLICY: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    GUIDE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    MANUAL: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    LEGAL: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    OTHER: 'bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400',
};

// Status badges styling
const statusBadgeColors: Record<DocumentStatus, string> = {
    ACTIVE: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    INACTIVE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export function AdminDocumentsPage() {
    // Data states
    const [documents, setDocuments] = useState<AdminDocument[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Pagination states
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('');

    // Modal states
    const [showForm, setShowForm] = useState(false);
    const [editingDocument, setEditingDocument] = useState<AdminDocument | null>(null);
    const [formLoading, setFormLoading] = useState(false);

    // Form fields
    const [formTitle, setFormTitle] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formUrl, setFormUrl] = useState('');
    const [formType, setFormType] = useState<DocumentType>('POLICY');
    const [formStatus, setFormStatus] = useState<DocumentStatus>('ACTIVE');
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // Confirmation dialog (Deactivate - Soft Delete)
    const [deactivateConfirm, setDeactivateConfirm] = useState<AdminDocument | null>(null);
    const [deactivateLoading, setDeactivateLoading] = useState(false);

    // Hard Delete confirmation dialog
    const [hardDeleteConfirm, setHardDeleteConfirm] = useState<AdminDocument | null>(null);
    const [hardDeleteLoading, setHardDeleteLoading] = useState(false);
    const [hardDeleteConfirmText, setHardDeleteConfirmText] = useState('');

    // Toast notification
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // Fetch documents
    const fetchDocuments = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await adminDocumentApi.list({
                q: searchQuery.length >= 2 ? searchQuery : undefined,
                type: filterType || undefined,
                status: filterStatus || undefined,
                page,
                size,
            });
            setDocuments(response.items);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
        } catch (err: any) {
            console.error('Failed to load documents:', err);
            setError(err?.response?.data?.message || 'Failed to load documents');
        } finally {
            setLoading(false);
        }
    };

    // Effect: Load on mount and when filters change
    useEffect(() => {
        fetchDocuments();
    }, [page, searchQuery, filterType, filterStatus]);

    // Debounced search
    const [debouncedSearch, setDebouncedSearch] = useState('');
    useEffect(() => {
        const timer = setTimeout(() => {
            if (debouncedSearch !== searchQuery) {
                setSearchQuery(debouncedSearch);
                setPage(0);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [debouncedSearch]);

    // Open form for create/edit
    const openForm = (doc?: AdminDocument) => {
        if (doc) {
            setEditingDocument(doc);
            setFormTitle(doc.title);
            setFormDescription(doc.description || '');
            setFormUrl(doc.documentUrl);
            setFormType(doc.documentType as DocumentType);
            setFormStatus(doc.status as DocumentStatus);
        } else {
            setEditingDocument(null);
            setFormTitle('');
            setFormDescription('');
            setFormUrl('');
            setFormType('POLICY');
            setFormStatus('ACTIVE');
        }
        setFormErrors({});
        setShowForm(true);
    };

    // Validate form
    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        if (!formTitle.trim() || formTitle.length < 3) {
            errors.title = 'Title must be at least 3 characters';
        }

        if (!formUrl.trim()) {
            errors.url = 'Document URL is required';
        } else {
            try {
                new URL(formUrl);
            } catch {
                errors.url = 'Must be a valid URL';
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Save document
    const handleSave = async () => {
        if (!validateForm()) return;

        setFormLoading(true);
        try {
            const payload: AdminDocumentCreateRequest = {
                title: formTitle.trim(),
                description: formDescription.trim() || undefined,
                documentUrl: formUrl.trim(),
                documentType: formType,
                status: formStatus,
            };

            if (editingDocument) {
                await adminDocumentApi.update(editingDocument.id, payload);
                setToast({ type: 'success', message: 'Document updated successfully' });
            } else {
                await adminDocumentApi.create(payload);
                setToast({ type: 'success', message: 'Document created successfully' });
            }

            setShowForm(false);
            fetchDocuments();
        } catch (err: any) {
            console.error('Failed to save document:', err);
            setToast({
                type: 'error',
                message: err?.response?.data?.message || 'Failed to save document',
            });
        } finally {
            setFormLoading(false);
        }
    };

    // Deactivate document (soft delete)
    const handleDeactivate = async () => {
        if (!deactivateConfirm) return;

        setDeactivateLoading(true);
        try {
            await adminDocumentApi.delete(deactivateConfirm.id);
            setToast({ type: 'success', message: `Document "${deactivateConfirm.title}" deactivated` });
            setDeactivateConfirm(null);
            fetchDocuments();
        } catch (err: any) {
            console.error('Failed to deactivate document:', err);
            setToast({
                type: 'error',
                message: err?.response?.data?.message || 'Failed to deactivate document',
            });
        } finally {
            setDeactivateLoading(false);
        }
    };

    // Hard delete document (permanent)
    const handleHardDelete = async () => {
        if (!hardDeleteConfirm || hardDeleteConfirmText !== 'DELETE') return;

        setHardDeleteLoading(true);
        try {
            await adminDocumentApi.hardDelete(hardDeleteConfirm.id);
            setToast({ type: 'success', message: `Document "${hardDeleteConfirm.title}" permanently deleted` });
            setHardDeleteConfirm(null);
            setHardDeleteConfirmText('');
            fetchDocuments();
        } catch (err: any) {
            console.error('Failed to hard delete document:', err);
            setToast({
                type: 'error',
                message: err?.response?.data?.message || 'Failed to permanently delete document',
            });
        } finally {
            setHardDeleteLoading(false);
        }
    };

    // Reset filters
    const resetFilters = () => {
        setDebouncedSearch('');
        setSearchQuery('');
        setFilterType('');
        setFilterStatus('');
        setPage(0);
    };

    // Auto-hide toast
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    // Format date
    const formatDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return '-';
        try {
            return new Date(dateStr).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-1">Documents</h1>
                <p className="text-muted-foreground">
                    Manage system-wide documents and references
                </p>
            </div>

            {/* Filters & Actions */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px] max-w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        value={debouncedSearch}
                        onChange={(e) => setDebouncedSearch(e.target.value)}
                        placeholder="Search by title (min 2 chars)"
                        className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>

                {/* Type Filter */}
                <select
                    value={filterType}
                    onChange={(e) => {
                        setFilterType(e.target.value);
                        setPage(0);
                    }}
                    className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
                >
                    <option value="">All Types</option>
                    {DOCUMENT_TYPES.map((t) => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}
                </select>

                {/* Status Filter */}
                <select
                    value={filterStatus}
                    onChange={(e) => {
                        setFilterStatus(e.target.value);
                        setPage(0);
                    }}
                    className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
                >
                    <option value="">All Statuses</option>
                    {DOCUMENT_STATUSES.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>

                {/* Reset Filters */}
                {(searchQuery || filterType || filterStatus) && (
                    <button
                        onClick={resetFilters}
                        className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                    >
                        Reset
                    </button>
                )}

                <div className="flex-1" />

                {/* Create Button */}
                <button
                    onClick={() => openForm()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Create Document
                </button>

                {/* Refresh */}
                <button
                    onClick={fetchDocuments}
                    className="p-2 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    title="Refresh"
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 mb-4">
                <span className="text-sm text-muted-foreground">
                    {totalElements} document{totalElements !== 1 ? 's' : ''} found
                </span>
            </div>

            {/* Table */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-muted/50 border-b border-border">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                Title
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                Type
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                Status
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                URL
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                Created
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                                    Loading documents...
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-12 text-center">
                                    <div className="flex flex-col items-center gap-2 text-destructive">
                                        <AlertCircle className="h-6 w-6" />
                                        {error}
                                        <button
                                            onClick={fetchDocuments}
                                            className="text-sm text-primary hover:underline"
                                        >
                                            Try again
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ) : documents.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    No documents found
                                </td>
                            </tr>
                        ) : (
                            documents.map((doc) => (
                                <tr
                                    key={doc.id}
                                    className="border-b border-border hover:bg-muted/30 transition-colors"
                                >
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-sm">{doc.title}</div>
                                        {doc.description && (
                                            <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                                {doc.description}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeBadgeColors[doc.documentType as DocumentType] ||
                                                typeBadgeColors.OTHER
                                                }`}
                                        >
                                            {doc.documentType}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeColors[doc.status as DocumentStatus] ||
                                                statusBadgeColors.INACTIVE
                                                }`}
                                        >
                                            {doc.status === 'ACTIVE' ? (
                                                <CheckCircle2 className="h-3 w-3" />
                                            ) : (
                                                <Ban className="h-3 w-3" />
                                            )}
                                            {doc.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <a
                                            href={doc.documentUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                                        >
                                            <ExternalLink className="h-3 w-3" />
                                            Open
                                        </a>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">
                                        {formatDate(doc.createdAt)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button
                                                    className="p-2 rounded-lg hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                    aria-label="Actions"
                                                >
                                                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuItem
                                                    onClick={() => openForm(doc)}
                                                    className="cursor-pointer"
                                                >
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => setDeactivateConfirm(doc)}
                                                    className="cursor-pointer text-destructive focus:text-destructive"
                                                    disabled={doc.status === 'INACTIVE'}
                                                >
                                                    <Ban className="mr-2 h-4 w-4" />
                                                    Deactivate
                                                </DropdownMenuItem>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <span className="w-full">
                                                                <DropdownMenuItem
                                                                    onClick={() => setHardDeleteConfirm(doc)}
                                                                    className="cursor-pointer text-destructive focus:text-destructive"
                                                                    disabled={doc.status !== 'INACTIVE'}
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Hard Delete
                                                                </DropdownMenuItem>
                                                            </span>
                                                        </TooltipTrigger>
                                                        {doc.status !== 'INACTIVE' && (
                                                            <TooltipContent side="left">
                                                                <p>Please deactivate the document</p>
                                                                <p>before permanently deleting it.</p>
                                                            </TooltipContent>
                                                        )}
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-muted-foreground">
                        Page {page + 1} of {totalPages}
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="px-3 py-1 border border-border rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted/50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                            disabled={page >= totalPages - 1}
                            className="px-3 py-1 border border-border rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted/50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Create/Edit Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md mx-4">
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <h3 className="text-lg font-semibold">
                                {editingDocument ? 'Edit Document' : 'Create Document'}
                            </h3>
                            <button
                                onClick={() => setShowForm(false)}
                                className="p-1 hover:bg-muted rounded"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Title <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formTitle}
                                    onChange={(e) => setFormTitle(e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg bg-background text-sm ${formErrors.title ? 'border-destructive' : 'border-border'
                                        }`}
                                    placeholder="Enter title"
                                />
                                {formErrors.title && (
                                    <p className="text-xs text-destructive mt-1">{formErrors.title}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    value={formDescription}
                                    onChange={(e) => setFormDescription(e.target.value)}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm min-h-[60px] resize-none"
                                    placeholder="Optional description"
                                />
                            </div>

                            {/* Document URL */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Document URL <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="url"
                                    value={formUrl}
                                    onChange={(e) => setFormUrl(e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg bg-background text-sm ${formErrors.url ? 'border-destructive' : 'border-border'
                                        }`}
                                    placeholder="https://..."
                                />
                                {formErrors.url && (
                                    <p className="text-xs text-destructive mt-1">{formErrors.url}</p>
                                )}
                            </div>

                            {/* Document Type & Status - 2 columns */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Type <span className="text-destructive">*</span>
                                    </label>
                                    <select
                                        value={formType}
                                        onChange={(e) => setFormType(e.target.value as DocumentType)}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
                                    >
                                        {DOCUMENT_TYPES.map((t) => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Status <span className="text-destructive">*</span>
                                    </label>
                                    <select
                                        value={formStatus}
                                        onChange={(e) => setFormStatus(e.target.value as DocumentStatus)}
                                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
                                    >
                                        {DOCUMENT_STATUSES.map((s) => (
                                            <option key={s} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 p-4 border-t border-border">
                            <button
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted/50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={formLoading}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 disabled:opacity-50"
                            >
                                {formLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                                {editingDocument ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Deactivate Confirmation Dialog */}
            {deactivateConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-4 border-b border-border">
                            <h2 className="text-lg font-semibold text-destructive">Deactivate Document</h2>
                        </div>
                        <div className="p-4">
                            <p className="text-sm text-muted-foreground mb-4">
                                Are you sure you want to deactivate{' '}
                                <strong className="text-foreground">"{deactivateConfirm.title}"</strong>?
                            </p>
                            <p className="text-xs text-muted-foreground">
                                This will set the document status to INACTIVE. The document will not be visible
                                to users but can be reactivated later.
                            </p>
                        </div>
                        <div className="flex justify-end gap-2 p-4 border-t border-border">
                            <button
                                onClick={() => setDeactivateConfirm(null)}
                                disabled={deactivateLoading}
                                className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted/50 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeactivate}
                                disabled={deactivateLoading}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm hover:bg-destructive/90 disabled:opacity-50"
                            >
                                {deactivateLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Deactivating...
                                    </>
                                ) : (
                                    <>
                                        <Ban className="h-4 w-4" />
                                        Deactivate
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hard Delete Confirmation Dialog */}
            {hardDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-4 border-b border-border bg-destructive/5">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-destructive" />
                                <h2 className="text-lg font-semibold text-destructive">Permanently Delete Document</h2>
                            </div>
                        </div>
                        <div className="p-4 space-y-4">
                            <p className="text-sm text-foreground">
                                You are about to permanently delete{' '}
                                <strong>"{hardDeleteConfirm.title}"</strong>.
                            </p>
                            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                                <p className="text-sm text-destructive font-medium">
                                    ⚠️ This action cannot be undone!
                                </p>
                                <p className="text-xs text-destructive/80 mt-1">
                                    The document will be permanently removed from the database and cannot be recovered.
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Type <strong className="text-destructive">DELETE</strong> to confirm:
                                </label>
                                <input
                                    type="text"
                                    value={hardDeleteConfirmText}
                                    onChange={(e) => setHardDeleteConfirmText(e.target.value)}
                                    placeholder='Type "DELETE" to confirm'
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-destructive/20"
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 p-4 border-t border-border">
                            <button
                                onClick={() => {
                                    setHardDeleteConfirm(null);
                                    setHardDeleteConfirmText('');
                                }}
                                disabled={hardDeleteLoading}
                                className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted/50 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleHardDelete}
                                disabled={hardDeleteConfirmText !== 'DELETE' || hardDeleteLoading}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {hardDeleteLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="h-4 w-4" />
                                        Permanently Delete
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <div
                    className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${toast.type === 'success'
                        ? 'bg-green-600 text-white'
                        : 'bg-destructive text-destructive-foreground'
                        }`}
                >
                    {toast.type === 'success' ? (
                        <CheckCircle2 className="h-4 w-4" />
                    ) : (
                        <AlertCircle className="h-4 w-4" />
                    )}
                    <span className="text-sm">{toast.message}</span>
                    <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    );
}

export default AdminDocumentsPage;
