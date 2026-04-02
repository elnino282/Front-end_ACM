import {
    MoreVertical,
    Eye,
    Ban,
    Key,
    Trash2,
    ChevronDown,
    Building2,
    FileText,
    Mail,
    Phone,
    Calendar,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import type { Buyer, BuyerRole, KYCStatus, AccountStatus } from '../types';

interface BuyerTableProps {
    buyers: Buyer[];
    selectedBuyers: string[];
    allSelected: boolean;
    sortColumn: keyof Buyer;
    sortDirection: 'asc' | 'desc';
    onSelectAll: () => void;
    onSelectBuyer: (id: string) => void;
    onSort: (column: keyof Buyer) => void;
    onViewEdit: (buyer: Buyer) => void;
    onToggleSuspend: (id: string) => void;
    onResetPassword: () => void;
    onDelete: (id: string) => void;
    getRoleBadge: (role: BuyerRole) => string;
    getKYCBadge: (status: KYCStatus) => string;
    getStatusBadge: (status: AccountStatus) => string;
}

export function BuyerTable({
    buyers,
    selectedBuyers,
    allSelected,
    sortColumn,
    sortDirection,
    onSelectAll,
    onSelectBuyer,
    onSort,
    onViewEdit,
    onToggleSuspend,
    onResetPassword,
    onDelete,
    getRoleBadge,
    getKYCBadge,
    getStatusBadge,
}: BuyerTableProps) {
    return (
        <Card>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={allSelected && buyers.length > 0}
                                        onCheckedChange={onSelectAll}
                                    />
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => onSort('companyName')}
                                >
                                    <div className="flex items-center gap-2">
                                        Company Name
                                        <ChevronDown
                                            className={`w-4 h-4 transition-transform ${sortColumn === 'companyName' && sortDirection === 'asc' ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </div>
                                </TableHead>
                                <TableHead>Tax/VAT ID</TableHead>
                                <TableHead>Primary Contact</TableHead>
                                <TableHead
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => onSort('role')}
                                >
                                    <div className="flex items-center gap-2">
                                        Role
                                        <ChevronDown
                                            className={`w-4 h-4 transition-transform ${sortColumn === 'role' && sortDirection === 'asc' ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => onSort('kycStatus')}
                                >
                                    <div className="flex items-center gap-2">
                                        KYC Status
                                        <ChevronDown
                                            className={`w-4 h-4 transition-transform ${sortColumn === 'kycStatus' && sortDirection === 'asc' ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => onSort('accountStatus')}
                                >
                                    <div className="flex items-center gap-2">
                                        Account Status
                                        <ChevronDown
                                            className={`w-4 h-4 transition-transform ${sortColumn === 'accountStatus' && sortDirection === 'asc' ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => onSort('createdAt')}
                                >
                                    <div className="flex items-center gap-2">
                                        Created Date
                                        <ChevronDown
                                            className={`w-4 h-4 transition-transform ${sortColumn === 'createdAt' && sortDirection === 'asc' ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </div>
                                </TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {buyers.map((buyer) => (
                                <TableRow key={buyer.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedBuyers.includes(buyer.id)}
                                            onCheckedChange={() => onSelectBuyer(buyer.id)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-9 h-9">
                                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-sm">
                                                    <Building2 className="w-5 h-5" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="font-medium text-sm">{buyer.companyName}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <FileText className="w-3 h-3" />
                                            {buyer.taxId}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="text-sm font-medium">{buyer.contactName}</div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Mail className="w-3 h-3" />
                                                {buyer.email}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Phone className="w-3 h-3" />
                                                {buyer.phone}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={getRoleBadge(buyer.role)}>
                                            {buyer.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={getKYCBadge(buyer.kycStatus)}>
                                            {buyer.kycStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className={getStatusBadge(buyer.accountStatus)}>
                                            {buyer.accountStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="w-3 h-3" />
                                            {buyer.createdAt}
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
                                                <DropdownMenuItem onClick={() => onViewEdit(buyer)}>
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View/Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onToggleSuspend(buyer.id)}>
                                                    <Ban className="w-4 h-4 mr-2" />
                                                    {buyer.accountStatus === 'suspended' ? 'Activate' : 'Suspend'}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={onResetPassword}>
                                                    <Key className="w-4 h-4 mr-2" />
                                                    Reset Password
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                    onClick={() => onDelete(buyer.id)}
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
