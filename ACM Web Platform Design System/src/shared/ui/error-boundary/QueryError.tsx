import { AlertCircle, RefreshCw } from 'lucide-react';

interface QueryErrorProps {
    error: Error | null;
    onRetry?: () => void;
    className?: string;
}

/**
 * Inline error display for query/form errors.
 * Use inside components for non-blocking error display.
 */
export function QueryError({ error, onRetry, className = '' }: QueryErrorProps) {
    if (!error) return null;

    return (
        <div className={`flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl ${className}`}>
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-red-800">
                    Error loading data
                </p>
                <p className="text-sm text-red-600 mt-1">
                    {error.message || 'An unexpected error occurred'}
                </p>
            </div>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="flex-shrink-0 inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
                >
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                    Retry
                </button>
            )}
        </div>
    );
}
