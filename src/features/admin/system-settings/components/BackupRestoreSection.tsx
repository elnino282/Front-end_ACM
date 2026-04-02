import { Database, Download, Upload, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { BackupPoint } from '../types';

interface BackupRestoreProps {
    backupPoints: BackupPoint[];
    onManualBackup: () => void;
    onExportConfig: () => void;
    onImportConfig: () => void;
    onRestore: () => void;
    getStatusBadge: (status: string) => string;
}

export function BackupRestoreSection({
    backupPoints,
    onManualBackup,
    onExportConfig,
    onImportConfig,
    onRestore,
    getStatusBadge,
}: BackupRestoreProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Backup & Restore</CardTitle>
                <CardDescription>Manage system backups and restoration points</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button className="bg-[#2563EB] hover:bg-[#1E40AF]" onClick={onManualBackup}>
                        <Database className="w-4 h-4 mr-2" />
                        Manual Backup
                    </Button>
                    <Button variant="outline" onClick={onExportConfig}>
                        <Download className="w-4 h-4 mr-2" />
                        Export Config
                    </Button>
                    <Button variant="outline" onClick={onImportConfig}>
                        <Upload className="w-4 h-4 mr-2" />
                        Import Config
                    </Button>
                </div>

                <Separator />

                <div>
                    <h4 className="mb-4">Backup History</h4>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date & Time</TableHead>
                                    <TableHead>Size</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {backupPoints.map((backup) => (
                                    <TableRow key={backup.id}>
                                        <TableCell className="font-medium">{backup.date}</TableCell>
                                        <TableCell>{backup.size}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="secondary"
                                                className={
                                                    backup.type === 'auto' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                                }
                                            >
                                                {backup.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className={getStatusBadge(backup.status)}>
                                                {backup.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" size="sm">
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Download
                                                </Button>
                                                {backup.status === 'success' && (
                                                    <Button variant="outline" size="sm" onClick={onRestore}>
                                                        <RefreshCw className="w-4 h-4 mr-2" />
                                                        Restore
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
