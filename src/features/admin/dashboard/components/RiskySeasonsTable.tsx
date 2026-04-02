import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { TransformedRiskySeason, RiskLevel } from '../types';

interface RiskySeasonsTableProps {
    seasons: TransformedRiskySeason[];
}

/**
 * Get badge variant based on risk level
 */
const getRiskBadgeVariant = (level: RiskLevel): 'destructive' | 'default' | 'secondary' => {
    switch (level) {
        case 'high':
            return 'destructive';
        case 'medium':
            return 'default';
        case 'low':
            return 'secondary';
    }
};

/**
 * Get risk level label
 */
const getRiskLabel = (level: RiskLevel) => {
    switch (level) {
        case 'high':
            return '🔴 High';
        case 'medium':
            return '🟠 Medium';
        case 'low':
            return '🟢 Low';
    }
};

/**
 * RiskySeasonsTable - Display top risky seasons with drill-down navigation
 */
export function RiskySeasonsTable({ seasons }: RiskySeasonsTableProps) {
    const navigate = useNavigate();

    const handleRowClick = (seasonId: number) => {
        navigate(`/admin/seasons/${seasonId}`);
    };

    return (
        <Card className="border-0 shadow-sm">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <CardTitle className="text-lg">Risky Seasons</CardTitle>
                </div>
                <CardDescription>
                    Seasons with incidents or overdue tasks requiring attention
                </CardDescription>
            </CardHeader>
            <CardContent>
                {seasons.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="rounded-full bg-emerald-50 p-3 mb-3">
                            <AlertTriangle className="h-6 w-6 text-emerald-500" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">No risky seasons detected</p>
                        <p className="text-xs text-muted-foreground mt-1">All seasons are running smoothly</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Season</TableHead>
                                <TableHead>Farm / Plot</TableHead>
                                <TableHead className="text-center">Incidents</TableHead>
                                <TableHead className="text-center">Overdue</TableHead>
                                <TableHead className="text-center">Risk</TableHead>
                                <TableHead className="w-8"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {seasons.map((season) => (
                                <TableRow
                                    key={season.seasonId}
                                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                                    onClick={() => handleRowClick(season.seasonId)}
                                >
                                    <TableCell className="font-medium">
                                        {season.seasonName}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {season.farmName ?? '—'} / {season.plotName ?? '—'}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={season.incidentCount > 0 ? 'destructive' : 'secondary'}>
                                            {season.incidentCount}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={season.overdueTaskCount > 0 ? 'destructive' : 'secondary'}>
                                            {season.overdueTaskCount}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={getRiskBadgeVariant(season.riskLevel)}>
                                            {getRiskLabel(season.riskLevel)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
