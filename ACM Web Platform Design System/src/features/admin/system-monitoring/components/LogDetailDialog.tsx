// Detailed log entry viewer

import { FileText, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { LogEntry, LogLevel } from '../types';

interface LogDetailDialogProps {
    logDetailOpen: boolean;
    setLogDetailOpen: (open: boolean) => void;
    selectedLog: LogEntry | null;
    handleCopyLog: (log: LogEntry) => void;
    getLogLevelBadge: (level: LogLevel) => string;
}

export function LogDetailDialog({
    logDetailOpen,
    setLogDetailOpen,
    selectedLog,
    handleCopyLog,
    getLogLevelBadge,
}: LogDetailDialogProps) {
    return (
        <Dialog open={logDetailOpen} onOpenChange={setLogDetailOpen}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Log Details
                    </DialogTitle>
                    <DialogDescription>
                        Full log entry and trace information
                    </DialogDescription>
                </DialogHeader>

                {selectedLog && (
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-xs text-muted-foreground">Timestamp</Label>
                                <p className="text-sm mt-1">{selectedLog.time}</p>
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground">Service</Label>
                                <p className="text-sm mt-1">{selectedLog.service}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-xs text-muted-foreground">Level</Label>
                                <div className="mt-1">
                                    <Badge variant="secondary" className={getLogLevelBadge(selectedLog.level)}>
                                        {selectedLog.level}
                                    </Badge>
                                </div>
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground">User</Label>
                                <p className="text-sm mt-1">{selectedLog.user}</p>
                            </div>
                        </div>

                        <div>
                            <Label className="text-xs text-muted-foreground">Message</Label>
                            <p className="text-sm mt-1 p-3 rounded-lg bg-muted">{selectedLog.message}</p>
                        </div>

                        <div>
                            <Label className="text-xs text-muted-foreground">Stack Trace (simulated)</Label>
                            <pre className="text-xs mt-1 p-3 rounded-lg bg-muted overflow-x-auto">
                                {`at Database.connect (database.js:142)
at async processRequest (server.js:89)
at async handleHTTPRequest (router.js:45)`}
                            </pre>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={() => selectedLog && handleCopyLog(selectedLog)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Log
                    </Button>
                    <Button variant="outline" onClick={() => setLogDetailOpen(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
