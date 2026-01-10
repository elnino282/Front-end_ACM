import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BuyerPaginationProps {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalResults: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (items: number) => void;
}

export function BuyerPagination({
    currentPage,
    totalPages,
    itemsPerPage,
    totalResults,
    onPageChange,
    onItemsPerPageChange,
}: BuyerPaginationProps) {
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, totalResults);

    const getPageNumbers = () => {
        const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
        if (totalPages <= 7) return pages;

        return pages.filter((page) => {
            if (page === 1 || page === totalPages) return true;
            if (Math.abs(page - currentPage) <= 1) return true;
            return false;
        });
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex items-center justify-between p-4 border-t">
            <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                    Showing {startIndex} to {endIndex} of {totalResults} results
                </span>
                <Select
                    value={String(itemsPerPage)}
                    onValueChange={(v) => {
                        onItemsPerPageChange(Number(v));
                        onPageChange(1);
                    }}
                >
                    <SelectTrigger className="w-[100px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10 / page</SelectItem>
                        <SelectItem value="25">25 / page</SelectItem>
                        <SelectItem value="50">50 / page</SelectItem>
                        <SelectItem value="100">100 / page</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    Previous
                </Button>
                {pageNumbers.map((page, index, arr) => {
                    const prevPage = arr[index - 1];
                    const showEllipsis = prevPage && page - prevPage > 1;
                    return (
                        <div key={page} className="flex items-center">
                            {showEllipsis && <span className="px-2 text-muted-foreground">...</span>}
                            <Button
                                variant={currentPage === page ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => onPageChange(page)}
                                className={currentPage === page ? 'bg-[#2563EB] hover:bg-[#1E40AF]' : ''}
                            >
                                {page}
                            </Button>
                        </div>
                    );
                })}
                <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
