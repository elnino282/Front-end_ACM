// System logs table with search and pagination

import { Terminal, Search, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { LogEntry, LogLevel } from '../types';

interface LogsTableProps {
    paginatedLogs: LogEntry[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    logLevelFilter: LogLevel;
    setLogLevelFilter: (level: LogLevel) => void;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    totalPages: number;
    filteredLogs: LogEntry[];
    itemsPerPage: number;
    setSelectedLog: (log: LogEntry) => void;
    setLogDetailOpen: (open: boolean) => void;
    handleCopyLog: (log: LogEntry) => void;
    getLogLevelBadge: (level: LogLevel) => string;
}

export function LogsTable({
    paginatedLogs,
    searchQuery,
    setSearchQuery,
    logLevelFilter,
    setLogLevelFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    filteredLogs,
    itemsPerPage,
    setSelectedLog,
    setLogDetailOpen,
    handleCopyLog,
    getLogLevelBadge,
}: LogsTableProps) {
    return (
        <Card className="lg:col-span-2">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Terminal className="w-5 h-5" />
                            System Logs
                        </CardTitle>
                        <CardDescription>Search and filter application logs</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Search Bar */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search logs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select value={logLevelFilter} onValueChange={(v: string) => setLogLevelFilter(v as LogLevel)}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Levels</SelectItem>
                            <SelectItem value="info">Info</SelectItem>
                            <SelectItem value="warning">Warning</SelectItem>
                            <SelectItem value="error">Error</SelectItem>
                            <SelectItem value="security">Security</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Log Entries */}
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {paginatedLogs.map((log) => (
                        <div
                            key={log.id}
                            className="p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors cursor-pointer"
                            onClick={() => {
                                setSelectedLog(log);
                                setLogDetailOpen(true);
                            }}
                        >
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className={getLogLevelBadge(log.level)}>
                                        {log.level}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">{log.service}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">{log.time}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={(e: React.MouseEvent) => {
                                            e.stopPropagation();
                                            handleCopyLog(log);
                                        }}
                                    >
                                        <Copy className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                            <p className="text-sm mb-1">{log.message}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>User: {log.user}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between pt-4 border-t">
                    <span className="text-sm text-muted-foreground">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                        {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of{' '}
                        {filteredLogs.length} logs
                    </span>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
