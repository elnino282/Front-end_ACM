import { Button } from '@/shared/ui';

interface EmptyStateProps {
    onCreateFarm: () => void;
}

/**
 * Empty state when no farms exist
 */
export function EmptyState({ onCreateFarm }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="max-w-md">
                <svg
                    className="mx-auto h-24 w-24 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                </svg>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">No farms found</h3>
                <p className="mt-2 text-sm text-gray-500">
                    Get started by creating your first farm.
                </p>
                <div className="mt-6">
                    <Button onClick={onCreateFarm}>
                        Create Farm
                    </Button>
                </div>
            </div>
        </div>
    );
}



