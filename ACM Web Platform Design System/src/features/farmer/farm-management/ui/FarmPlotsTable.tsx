import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge, Skeleton } from '@/shared/ui';
import { useNavigate } from 'react-router-dom';
import type { Plot } from '@/entities/plot';

interface FarmPlotsTableProps {
    plots: Plot[];
    isLoading?: boolean;
}

/**
 * Get status badge variant based on plot status
 */
function getStatusBadgeVariant(status: string | null | undefined): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (status?.toUpperCase()) {
        case 'IN_USE':
            return 'default';
        case 'IDLE':
        case 'AVAILABLE':
            return 'secondary';
        case 'FALLOW':
        case 'MAINTENANCE':
            return 'outline';
        default:
            return 'outline';
    }
}

/**
 * Get human-readable status label
 */
function getStatusLabel(status: string | null | undefined): string {
    switch (status?.toUpperCase()) {
        case 'IN_USE':
            return 'In Use';
        case 'IDLE':
            return 'Idle';
        case 'AVAILABLE':
            return 'Available';
        case 'FALLOW':
            return 'Fallow';
        case 'MAINTENANCE':
            return 'Maintenance';
        default:
            return status || 'Unknown';
    }
}

/**
 * Table showing plots belonging to a farm
 */
export function FarmPlotsTable({ plots, isLoading = false }: FarmPlotsTableProps) {
    const navigate = useNavigate();

    // Loading state
    if (isLoading) {
        return (
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Plot Name</TableHead>
                            <TableHead className="text-right">Area (ha)</TableHead>
                            <TableHead>Soil Type</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[1, 2, 3].map((i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }

    // Empty state
    if (!plots || plots.length === 0) {
        return (
            <div className="rounded-md border border-dashed p-8 text-center text-gray-500">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No plots yet</h3>
                <p>Create your first plot to start managing your farm land.</p>
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Plot Name</TableHead>
                        <TableHead className="text-right">Area (ha)</TableHead>
                        <TableHead>Soil Type</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {plots.map((plot) => (
                        <TableRow
                            key={plot.id}
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => navigate(`/farmer/plots/${plot.id}`)}
                        >
                            <TableCell className="font-medium">
                                {plot.plotName}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                                {plot.area != null ? plot.area.toFixed(2) : '-'}
                            </TableCell>
                            <TableCell>
                                {plot.soilType || '-'}
                            </TableCell>
                            <TableCell>
                                <Badge variant={getStatusBadgeVariant(plot.status)}>
                                    {getStatusLabel(plot.status)}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}



