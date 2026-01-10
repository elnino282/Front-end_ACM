import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function LoadingState() {
    return (
        <div className="space-y-4">
            {/* Filters skeleton */}
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>

            {/* Table skeleton */}
            <Card>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        {/* Table header */}
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-10 w-24" />
                        </div>

                        {/* Table rows */}
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-4 py-3 border-b">
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-4 flex-1" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-8 w-20" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}



