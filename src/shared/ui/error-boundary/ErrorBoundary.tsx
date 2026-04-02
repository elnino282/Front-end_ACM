import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onReset?: () => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

/**
 * Full-page Error Boundary with Retry functionality.
 * Use for wrapping major routes/pages.
 * 
 * For mutations: Use toast notifications (sonner)
 * For forms: Use inline error display
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log error to monitoring service
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
        this.props.onReset?.();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-background p-6">
                    <div className="max-w-md w-full bg-card rounded-2xl shadow-lg p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
                            <AlertTriangle className="w-8 h-8 text-destructive" />
                        </div>

                        <h2 className="text-xl font-semibold text-foreground mb-2">
                            Something went wrong
                        </h2>

                        <p className="text-muted-foreground mb-6">
                            {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={this.handleRetry}
                                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Try Again
                            </button>

                            <button
                                onClick={this.handleGoHome}
                                className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-border text-foreground font-medium hover:bg-muted transition-colors"
                            >
                                <Home className="w-4 h-4 mr-2" />
                                Go Home
                            </button>
                        </div>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mt-6 text-left">
                                <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground">
                                    Error Details
                                </summary>
                                <pre className="mt-2 p-4 bg-muted rounded-lg text-xs text-destructive overflow-auto max-h-40">
                                    {this.state.error.stack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
