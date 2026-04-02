import { type ReactNode } from 'react';
import { useSeason } from '../contexts/SeasonContext';
import { SeasonPickerModal } from './SeasonPickerModal';

interface SeasonGateProps {
    children: ReactNode;
}

/**
 * SeasonGate - Blocks access to season-dependent features until a season is selected.
 * 
 * Shows a modal for season selection if `requiresSeasonSelection` is true.
 * If no seasons exist, displays an empty state with CTA to create first season.
 */
export function SeasonGate({ children }: SeasonGateProps) {
    const { requiresSeasonSelection, isLoading, seasons } = useSeason();

    // Show picker modal if season selection is required
    if (requiresSeasonSelection && !isLoading) {
        return (
            <>
                {/* Render children in background (dimmed) */}
                <div className="opacity-30 pointer-events-none">
                    {children}
                </div>
                {/* Season picker modal */}
                <SeasonPickerModal 
                    isOpen={true} 
                    onOpenChange={() => {}} 
                    seasons={seasons}
                />
            </>
        );
    }

    return <>{children}</>;
}
