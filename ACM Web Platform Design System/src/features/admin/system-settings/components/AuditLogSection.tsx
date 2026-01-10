import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { AuditLog } from '../types';

interface AuditLogProps {
    logs: AuditLog[];
    getStatusBadge: (status: string) => string;
}

export function AuditLogSection({ logs, getStatusBadge }: AuditLogProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Audit Log</CardTitle>
                <CardDescription>Track all administrative actions and system changes</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Time</TableHead>
                                <TableHead>Admin</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Module</TableHead>
                                <TableHead>Result</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="font-medium">{log.time}</TableCell>
                                    <TableCell>{log.admin}</TableCell>
                                    <TableCell>{log.action}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{log.module}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={getStatusBadge(log.result)}>
                                            {log.result}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
