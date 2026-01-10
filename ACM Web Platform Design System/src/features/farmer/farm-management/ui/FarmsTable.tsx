import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Badge, Button, AddressDisplay } from '@/shared/ui';
import type { Farm } from '@/entities/farm';
import { Eye, Pencil, Trash2 } from 'lucide-react';

interface FarmsTableProps {
    farms: Farm[];
    onView: (farmId: number) => void;
    onEdit: (farmId: number) => void;
    onDelete: (farmId: number, farmName: string) => void;
}

/**
 * Farms table component
 */
export function FarmsTable({ farms, onView, onEdit, onDelete }: FarmsTableProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Area (ha)</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {farms.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                                No farms found
                            </TableCell>
                        </TableRow>
                    ) : (
                        farms.map((farm) => (
                            <TableRow key={farm.id}>
                                <TableCell className="font-medium">{farm.name}</TableCell>
                                <TableCell className="text-right font-mono">
                                    {farm.area ? farm.area : '—'}
                                </TableCell>
                                <TableCell>
                                    <AddressDisplay
                                        wardCode={farm.wardId}
                                        variant="compact"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Badge variant={farm.active ? 'default' : 'secondary'}>
                                        {farm.active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onView(farm.id)}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEdit(farm.id)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onDelete(farm.id, farm.name)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}



