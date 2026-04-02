import {
    MoreVertical, Edit, Trash2, Lock, Key, History,
    ChevronDown, Mail, Phone, Calendar, Clock,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Farmer } from '../types';
import { ROLE_BADGE_COLORS, STATUS_BADGE_COLORS } from '../constants';

interface FarmerTableProps {
    farmers: Farmer[];
    selectedFarmers: string[];
    allSelected: boolean;
    sortColumn: keyof Farmer;
    sortDirection: 'asc' | 'desc';
    onSelectAll: () => void;
    onSelectFarmer: (id: string) => void;
    onSort: (column: keyof Farmer) => void;
    onEdit: (farmer: Farmer) => void;
    onLock: (id: string) => void;
    onDelete: (id: string) => void;
    onResetPassword: () => void;
    onViewHistory: () => void;
}

export function FarmerTable({
    farmers,
    selectedFarmers,
    allSelected,
    sortColumn,
    sortDirection,
    onSelectAll,
    onSelectFarmer,
    onSort,
    onEdit,
    onLock,
    onDelete,
    onResetPassword,
    onViewHistory,
}: FarmerTableProps) {
    const getSortIcon = (column: keyof Farmer) => {
        if (sortColumn !== column) return null;
        return sortDirection === 'asc' ? 'rotate-180' : '';
    };

    return (
        <Card>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={allSelected && farmers.length > 0}
                                        onCheckedChange={onSelectAll}
                                    />
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => onSort('name')}
                                >
                                    <div className="flex items-center gap-2">
                                        Name
                                        <ChevronDown className={`w-4 h-4 transition-transform ${getSortIcon('name')}`} />
                                    </div>
                                </TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => onSort('role')}
                                >
                                    <div className="flex items-center gap-2">
                                        Role
                                        <ChevronDown className={`w-4 h-4 transition-transform ${getSortIcon('role')}`} />
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => onSort('status')}
                                >
                                    <div className="flex items-center gap-2">
                                        Status
                                        <ChevronDown className={`w-4 h-4 transition-transform ${getSortIcon('status')}`} />
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => onSort('lastLogin')}
                                >
                                    <div className="flex items-center gap-2">
                                        Last Login
                                        <ChevronDown className={`w-4 h-4 transition-transform ${getSortIcon('lastLogin')}`} />
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => onSort('createdAt')}
                                >
                                    <div className="flex items-center gap-2">
                                        Created At
                                        <ChevronDown className={`w-4 h-4 transition-transform ${getSortIcon('createdAt')}`} />
                                    </div>
                                </TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {farmers.map((farmer) => (
                                <TableRow key={farmer.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedFarmers.includes(farmer.id)}
                                            onCheckedChange={() => onSelectFarmer(farmer.id)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-9 h-9">
                                                <AvatarImage src={farmer.avatar} />
                                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-sm">
                                                    {farmer.name.split(' ').map(n => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium text-sm">{farmer.name}</div>
                                                {farmer.plotsCount !== undefined && (
                                                    <div className="text-xs text-muted-foreground">
                                                        {farmer.plotsCount} plot{farmer.plotsCount !== 1 ? 's' : ''}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="w-3 h-3 text-muted-foreground" />
                                                {farmer.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Phone className="w-3 h-3" />
                                                {farmer.phone}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={ROLE_BADGE_COLORS[farmer.role]}>
                                            {farmer.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={STATUS_BADGE_COLORS[farmer.status]}>
                                            {farmer.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Clock className="w-3 h-3" />
                                            {farmer.lastLogin}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="w-3 h-3" />
                                            {farmer.createdAt}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => onEdit(farmer)}>
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onLock(farmer.id)}>
                                                    <Lock className="w-4 h-4 mr-2" />
                                                    {farmer.status === 'locked' ? 'Unlock' : 'Lock'}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={onResetPassword}>
                                                    <Key className="w-4 h-4 mr-2" />
                                                    Reset Password
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={onViewHistory}>
                                                    <History className="w-4 h-4 mr-2" />
                                                    View History
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                    onClick={() => onDelete(farmer.id)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
