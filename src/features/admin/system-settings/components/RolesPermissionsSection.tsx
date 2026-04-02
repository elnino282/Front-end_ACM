import { Save, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Role, Permission } from '../types';

interface RolesPermissionsProps {
    roles: Role[];
    permissions: Record<string, Permission>;
    onPermissionUpdate: (key: string, field: keyof Permission, value: boolean) => void;
    onAddRole: () => void;
}

export function RolesPermissionsSection({
    roles,
    permissions,
    onPermissionUpdate,
    onAddRole,
}: RolesPermissionsProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Role & Permission Matrix</CardTitle>
                        <CardDescription>Manage user roles and module permissions</CardDescription>
                    </div>
                    <Button className="bg-[#2563EB] hover:bg-[#1E40AF]" onClick={onAddRole}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Role
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Current Roles */}
                <div>
                    <h4 className="mb-3">Current Roles</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {roles.map((role) => (
                            <Card key={role.id} className="border-2">
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <h4>{role.name}</h4>
                                        <Badge variant="secondary">{role.userCount} users</Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-3">{role.description}</p>
                                    <Button variant="outline" size="sm" className="w-full">
                                        Edit Permissions
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <Separator />

                {/* Permission Matrix */}
                <div>
                    <h4 className="mb-3">Admin Role Permissions</h4>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Module</TableHead>
                                    <TableHead className="text-center">View</TableHead>
                                    <TableHead className="text-center">Create</TableHead>
                                    <TableHead className="text-center">Edit</TableHead>
                                    <TableHead className="text-center">Delete</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Object.entries(permissions).map(([key, perm]) => (
                                    <TableRow key={key}>
                                        <TableCell className="font-medium">{perm.module}</TableCell>
                                        <TableCell className="text-center">
                                            <Checkbox
                                                checked={perm.view}
                                                onCheckedChange={(checked: boolean) => onPermissionUpdate(key, 'view', checked)}
                                            />
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Checkbox
                                                checked={perm.create}
                                                onCheckedChange={(checked: boolean) => onPermissionUpdate(key, 'create', checked)}
                                            />
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Checkbox
                                                checked={perm.edit}
                                                onCheckedChange={(checked: boolean) => onPermissionUpdate(key, 'edit', checked)}
                                            />
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Checkbox
                                                checked={perm.delete}
                                                onCheckedChange={(checked: boolean) => onPermissionUpdate(key, 'delete', checked)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button className="bg-[#2563EB] hover:bg-[#1E40AF]">
                        <Save className="w-4 h-4 mr-2" />
                        Save Permissions
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
