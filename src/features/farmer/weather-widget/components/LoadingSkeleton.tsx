import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading Skeleton Component
 * Displays skeleton loading state while fetching weather data
 */
export const LoadingSkeleton = React.memo(() => {
    return (
        <div className="p-5 space-y-4">
            <div className="flex items-center gap-4">
                <Skeleton className="h-20 w-20 rounded-2xl" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-24 rounded-xl" />
                <Skeleton className="h-24 rounded-xl" />
                <Skeleton className="h-24 rounded-xl" />
                <Skeleton className="h-24 rounded-xl" />
            </div>
        </div>
    );
});

LoadingSkeleton.displayName = "LoadingSkeleton";



