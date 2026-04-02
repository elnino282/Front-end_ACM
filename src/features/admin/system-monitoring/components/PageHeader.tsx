// Page header with date range selector and action buttons

import { Calendar, Filter, Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { DateRange } from '../types';

interface PageHeaderProps {
    dateRange: DateRange;
    setDateRange: (value: DateRange) => void;
    setFilterOpen: (open: boolean) => void;
    setDownloadLogsOpen: (open: boolean) => void;
    setIncidentModalOpen: (open: boolean) => void;
}

export function PageHeader({
    dateRange,
    setDateRange,
    setFilterOpen,
    setDownloadLogsOpen,
    setIncidentModalOpen,
}: PageHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <h1 className="mb-1">System Monitoring</h1>
                <p className="text-sm text-muted-foreground">
                    Real-time platform health and performance metrics
                </p>
            </div>
            <div className="flex items-center gap-3">
                <Select value={dateRange} onValueChange={(v: string) => setDateRange(v as DateRange)}>
                    <SelectTrigger className="w-[140px]">
                        <Calendar className="w-4 h-4 mr-2" />
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="24h">Last 24h</SelectItem>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                    </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => setFilterOpen(true)}>
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                </Button>
                <Button variant="outline" onClick={() => setDownloadLogsOpen(true)}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Logs
                </Button>
                <Button className="bg-[#2563EB] hover:bg-[#1E40AF]" onClick={() => setIncidentModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Incident
                </Button>
            </div>
        </div>
    );
}
