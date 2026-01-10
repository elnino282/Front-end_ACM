import { History, Filter, Download, Plus, Edit, Trash2, User, Lock, AlertCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { AuditLogType } from '../types';
import { AUDIT_LOGS } from '../constants';

interface AuditHistoryDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AuditHistoryDrawer({
    open,
    onOpenChange,
}: AuditHistoryDrawerProps) {
    const getAuditIcon = (type: AuditLogType) => {
        switch (type) {
            case 'create':
                return <Plus className="w-4 h-4 text-green-600" />;
            case 'update':
                return <Edit className="w-4 h-4 text-blue-600" />;
            case 'delete':
                return <Trash2 className="w-4 h-4 text-red-600" />;
            case 'login':
                return <User className="w-4 h-4 text-cyan-600" />;
            case 'lock':
                return <Lock className="w-4 h-4 text-orange-600" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-600" />;
        }
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:w-[600px]">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <History className="w-5 h-5" />
                        Account Change History
                    </SheetTitle>
                    <SheetDescription>
                        View all changes and activities for this account
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                            <Filter className="w-4 h-4 mr-2" />
                            Filter by Type
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                            <Download className="w-4 h-4 mr-2" />
                            Export CSV
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {AUDIT_LOGS.map((log) => (
                            <div
                                key={log.id}
                                className="flex gap-3 p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                    {getAuditIcon(log.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h4 className="font-medium text-sm">{log.action}</h4>
                                        <span className="text-xs text-muted-foreground shrink-0">
                                            {log.timestamp}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-1">{log.details}</p>
                                    <p className="text-xs text-muted-foreground">By: {log.user}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
