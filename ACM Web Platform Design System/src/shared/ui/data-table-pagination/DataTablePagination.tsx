import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select";
import { cn } from "@/shared/lib";

export interface DataTablePaginationProps {
    /** Current page number (0-indexed) */
    currentPage: number;
    /** Total number of pages */
    totalPages: number;
    /** Total number of items */
    totalItems: number;
    /** Number of items per page */
    pageSize: number;
    /** Callback when page changes */
    onPageChange: (page: number) => void;
    /** Callback when page size changes */
    onPageSizeChange?: (size: number) => void;
    /** Available page size options */
    pageSizeOptions?: number[];
    /** Additional className */
    className?: string;
}

/**
 * DataTablePagination Component
 * 
 * Consistent pagination controls for data tables.
 * Displays page info and navigation controls.
 * 
 * @example
 * ```tsx
 * <DataTablePagination
 *   currentPage={0}
 *   totalPages={10}
 *   totalItems={100}
 *   pageSize={10}
 *   onPageChange={(page) => setFilters({ ...filters, page })}
 *   onPageSizeChange={(size) => setFilters({ ...filters, size, page: 0 })}
 * />
 * ```
 */
export function DataTablePagination({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [10, 20, 50, 100],
    className,
}: DataTablePaginationProps) {
    const startItem = currentPage * pageSize + 1;
    const endItem = Math.min((currentPage + 1) * pageSize, totalItems);

    return (
        <div
            className={cn(
                "flex flex-col sm:flex-row items-center justify-between gap-4 py-4",
                className
            )}
        >
            <div className="text-sm text-[#777777]">
                {totalItems > 0 ? (
                    <>
                        Showing <span className="font-medium text-[#333333]">{startItem}</span> to{" "}
                        <span className="font-medium text-[#333333]">{endItem}</span> of{" "}
                        <span className="font-medium text-[#333333]">{totalItems}</span> results
                    </>
                ) : (
                    "No results"
                )}
            </div>

            <div className="flex items-center gap-4">
                {onPageSizeChange && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-[#777777]">Rows per page</span>
                        <Select
                            value={pageSize.toString()}
                            onValueChange={(value) => onPageSizeChange(Number(value))}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={pageSize.toString()} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {pageSizeOptions.map((size) => (
                                    <SelectItem key={size} value={size.toString()}>
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className="h-8 w-8 p-0"
                        aria-label="Previous page"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    
                    <div className="text-sm text-[#777777] min-w-[100px] text-center">
                        Page <span className="font-medium text-[#333333]">{currentPage + 1}</span> of{" "}
                        <span className="font-medium text-[#333333]">{totalPages || 1}</span>
                    </div>
                    
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages - 1}
                        className="h-8 w-8 p-0"
                        aria-label="Next page"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

DataTablePagination.displayName = "DataTablePagination";
