import * as React from "react";
import { Loader2, AlertCircle, InboxIcon, RefreshCw } from "lucide-react";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui/button";

export interface AsyncStateProps {
    /** Whether data is loading */
    isLoading: boolean;
    /** Whether data set is empty */
    isEmpty: boolean;
    /** Error object if request failed */
    error?: Error | null;
    /** Callback to retry the request */
    onRetry?: () => void;
    /** Custom loading text */
    loadingText?: string;
    /** Custom icon for empty state */
    emptyIcon?: React.ReactNode;
    /** Empty state title */
    emptyTitle?: string;
    /** Empty state description */
    emptyDescription?: string;
    /** Optional CTA button for empty state */
    emptyAction?: React.ReactNode;
    /** Additional className */
    className?: string;
    /** Children to render when not loading/empty/error */
    children: React.ReactNode;
}

/**
 * AsyncState Component
 * 
 * Handles loading, empty, and error states consistently.
 * Use as a wrapper around data display components.
 * 
 * @example
 * ```tsx
 * <AsyncState
 *   isLoading={isLoading}
 *   isEmpty={data.length === 0}
 *   error={error}
 *   onRetry={refetch}
 *   emptyTitle="No items found"
 *   emptyDescription="Create your first item to get started."
 *   emptyAction={<Button onClick={onCreate}>Create Item</Button>}
 * >
 *   <DataTable data={data} />
 * </AsyncState>
 * ```
 */
export function AsyncState({
    isLoading,
    isEmpty,
    error,
    onRetry,
    loadingText = "Loading...",
    emptyIcon,
    emptyTitle = "No data found",
    emptyDescription,
    emptyAction,
    className,
    children,
}: AsyncStateProps) {
    // Error state
    if (error) {
        return (
            <div
                className={cn(
                    "flex flex-col items-center justify-center py-12 px-4",
                    className
                )}
            >
                <div className="flex flex-col items-center text-center max-w-md">
                    <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                        <AlertCircle className="w-6 h-6 text-destructive" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                        Something went wrong
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        {error.message || "An unexpected error occurred. Please try again."}
                    </p>
                    {onRetry && (
                        <Button
                            variant="outline"
                            onClick={onRetry}
                            className="gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Retry
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <div
                className={cn(
                    "flex items-center justify-center py-12",
                    className
                )}
            >
                <div className="flex items-center gap-3 text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span className="text-sm">{loadingText}</span>
                </div>
            </div>
        );
    }

    // Empty state
    if (isEmpty) {
        return (
            <div
                className={cn(
                    "flex flex-col items-center justify-center py-12 px-4",
                    className
                )}
            >
                <div className="flex flex-col items-center text-center max-w-md">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                        {emptyIcon || <InboxIcon className="w-6 h-6 text-muted-foreground" />}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                        {emptyTitle}
                    </h3>
                    {emptyDescription && (
                        <p className="text-sm text-muted-foreground mb-4">
                            {emptyDescription}
                        </p>
                    )}
                    {emptyAction}
                </div>
            </div>
        );
    }

    // Normal state - render children
    return <>{children}</>;
}

AsyncState.displayName = "AsyncState";
