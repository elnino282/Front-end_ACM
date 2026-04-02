import { Search, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { FarmerRole, FarmerStatus } from '../types';

interface FarmerFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    filterOpen: boolean;
    onFilterOpenChange: (open: boolean) => void;
    roleFilter: FarmerRole | 'all';
    statusFilter: FarmerStatus | 'all';
    onRoleFilterChange: (role: FarmerRole | 'all') => void;
    onStatusFilterChange: (status: FarmerStatus | 'all') => void;
    onClearFilters: () => void;
}

export function FarmerFilters({
    searchQuery,
    onSearchChange,
    filterOpen,
    onFilterOpenChange,
    roleFilter,
    statusFilter,
    onRoleFilterChange,
    onStatusFilterChange,
    onClearFilters,
}: FarmerFiltersProps) {
    const activeFiltersCount =
        (roleFilter !== 'all' ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0);

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, email, or phone..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Sheet open={filterOpen} onOpenChange={onFilterOpenChange}>
                        <Button
                            variant="outline"
                            onClick={() => onFilterOpenChange(true)}
                            className="w-full md:w-auto"
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            Filters
                            {activeFiltersCount > 0 && (
                                <Badge variant="secondary" className="ml-2">
                                    {activeFiltersCount}
                                </Badge>
                            )}
                        </Button>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Filter Farmers</SheetTitle>
                                <SheetDescription>
                                    Apply filters to refine your farmer list
                                </SheetDescription>
                            </SheetHeader>
                            <div className="mt-6 space-y-6">
                                <div className="space-y-2">
                                    <Label>Role</Label>
                                    <Select value={roleFilter} onValueChange={(v) => onRoleFilterChange(v as FarmerRole | 'all')}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Roles</SelectItem>
                                            <SelectItem value="owner">Owner</SelectItem>
                                            <SelectItem value="manager">Manager</SelectItem>
                                            <SelectItem value="farmer">Farmer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select value={statusFilter} onValueChange={(v) => onStatusFilterChange(v as FarmerStatus | 'all')}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Statuses</SelectItem>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="locked">Locked</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Separator />
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={onClearFilters}
                                    >
                                        Clear All
                                    </Button>
                                    <Button
                                        className="flex-1 bg-[#2563EB] hover:bg-[#1E40AF]"
                                        onClick={() => onFilterOpenChange(false)}
                                    >
                                        Apply
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </CardContent>
        </Card>
    );
}
