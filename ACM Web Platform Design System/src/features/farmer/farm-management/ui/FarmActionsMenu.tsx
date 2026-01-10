import { MoreVertical, Eye, Edit, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { Farm } from "@/entities/farm";

interface FarmActionsMenuProps {
    farm: Farm;
    onView: (farmId: number) => void;
    onEdit: (farmId: number) => void;
    onDelete: (farmId: number, farmName: string) => void;
}

/**
 * FarmActionsMenu Component
 * 
 * Kebab menu (⋮) for farm row actions.
 * Provides cleaner UI than horizontal icon buttons and prevents accidental clicks.
 */
export function FarmActionsMenu({
    farm,
    onView,
    onEdit,
    onDelete,
}: FarmActionsMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 p-0 hover:bg-gray-100"
                    onClick={(e) => {
                        // Prevent row click from triggering
                        e.stopPropagation();
                    }}
                >
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuItem
                    onClick={(e) => {
                        e.stopPropagation();
                        onView(farm.id);
                    }}
                >
                    <Eye className="mr-2 h-4 w-4" />
                    <span>View details</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(farm.id);
                    }}
                >
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(farm.id, farm.name);
                    }}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}



