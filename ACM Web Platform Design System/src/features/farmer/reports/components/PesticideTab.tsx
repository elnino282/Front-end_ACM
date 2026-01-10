import { AlertTriangle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { PesticideStatus } from "../types";

// TODO: Replace with API data when available
const PESTICIDE_RECORDS: any[] = [];

interface PesticideTabProps {
    getPesticideStatusBadge: (status: PesticideStatus) => {
        className: string;
        label: string;
    };
}

export function PesticideTab({ getPesticideStatusBadge }: PesticideTabProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg text-foreground mb-1">
                        Pesticide & Compliance
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Track PHI compliance and chemical usage
                    </p>
                </div>
                <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    3 lots need review
                </Badge>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted hover:bg-muted">
                            <TableHead className="text-foreground">Lot ID</TableHead>
                            <TableHead className="text-foreground">Chemical</TableHead>
                            <TableHead className="text-foreground text-right">
                                Quantity (L)
                            </TableHead>
                            <TableHead className="text-foreground text-right">
                                PHI (days)
                            </TableHead>
                            <TableHead className="text-foreground text-right">
                                Days Remaining
                            </TableHead>
                            <TableHead className="text-foreground">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {PESTICIDE_RECORDS.map((record) => {
                            const statusBadge = getPesticideStatusBadge(record.status);
                            return (
                                <TableRow key={record.id} className="hover:bg-muted/50">
                                    <TableCell className="numeric text-foreground">
                                        {record.lotId}
                                    </TableCell>
                                    <TableCell className="text-foreground">
                                        {record.chemical}
                                    </TableCell>
                                    <TableCell className="text-right numeric text-foreground">
                                        {record.quantity.toFixed(1)}
                                    </TableCell>
                                    <TableCell className="text-right numeric text-foreground">
                                        {record.phi}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span
                                            className={`numeric ${record.daysRemaining < 0
                                                ? "text-destructive"
                                                : record.daysRemaining <= 5
                                                    ? "text-accent"
                                                    : "text-primary"
                                                }`}
                                        >
                                            {record.daysRemaining}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={statusBadge.className}>
                                            {statusBadge.label}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-accent mt-0.5" />
                    <div>
                        <p className="text-sm text-foreground mb-1">Compliance Reminder</p>
                        <p className="text-xs text-muted-foreground">
                            PHI (Pre-Harvest Interval) must be observed before harvesting.
                            Lots marked in red have violated the PHI period and require
                            review before sale.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}



