import { Skeleton } from '@/shared/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

/**
 * DashboardSkeleton - Loading state for Admin Dashboard
 * 
 * Displays skeleton UI that matches the dashboard layout to provide
 * visual continuity during data loading.
 */
export function DashboardSkeleton() {
    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-6">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>

            {/* KPI Cards Skeleton - 4 cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="border-0 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-8 w-16" />
                                </div>
                                <Skeleton className="h-12 w-12 rounded-lg" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Skeleton - 2 columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 border-0 shadow-sm">
                    <CardHeader>
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-56" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[300px] w-full rounded-lg" />
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-48" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[300px] w-full rounded-full mx-auto max-w-[200px]" />
                    </CardContent>
                </Card>
            </div>

            {/* Tables Skeleton - 2 columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                    <Card key={i} className="border-0 shadow-sm">
                        <CardHeader>
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-4 w-56" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[...Array(3)].map((_, j) => (
                                <Skeleton key={j} className="h-12 w-full" />
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
