import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// TODO: Replace with API data when available
const TASK_PERFORMANCE: any[] = [];

export function PerformanceTab() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg text-foreground mb-1">Task Performance</h3>
                <p className="text-sm text-muted-foreground">
                    Monitor task completion trends and status
                </p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={TASK_PERFORMANCE}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                    <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                    <RechartsTooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="onTime"
                        stroke="var(--primary)"
                        strokeWidth={3}
                        name="On-time %"
                        dot={{ fill: "var(--primary)", r: 5 }}
                    />
                </LineChart>
            </ResponsiveContainer>

            <div className="mt-6">
                <h4 className="text-sm text-foreground mb-4">Task Status Breakdown</h4>
                <div className="overflow-x-auto rounded-xl border border-border">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted hover:bg-muted">
                                <TableHead className="text-foreground">Month</TableHead>
                                <TableHead className="text-foreground text-right">
                                    On-time
                                </TableHead>
                                <TableHead className="text-foreground text-right">Late</TableHead>
                                <TableHead className="text-foreground text-right">
                                    Overdue
                                </TableHead>
                                <TableHead className="text-foreground text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {TASK_PERFORMANCE.map((record, index) => {
                                const total = record.onTime + record.late + record.overdue;
                                return (
                                    <TableRow key={index}>
                                        <TableCell className="text-foreground">
                                            {record.month}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <span className="text-primary numeric">
                                                {record.onTime}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <span className="text-accent numeric">
                                                {record.late}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <span className="text-destructive numeric">
                                                {record.overdue}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right numeric text-foreground">
                                            {total}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}



