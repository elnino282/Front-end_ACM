import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CATEGORY_OPTIONS, STATUS_OPTIONS } from "../constants";

interface ExpenseFiltersProps {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    selectedSeason: string;
    setSelectedSeason: (value: string) => void;
    seasonOptions: { value: string; label: string }[];
    selectedCategory: string;
    setSelectedCategory: (value: string) => void;
    selectedStatus: string;
    setSelectedStatus: (value: string) => void;
    isSeasonLocked?: boolean;
    lockedSeasonLabel?: string;
}

export function ExpenseFilters({
    searchQuery,
    setSearchQuery,
    selectedSeason,
    setSelectedSeason,
    seasonOptions,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    isSeasonLocked = false,
    lockedSeasonLabel,
}: ExpenseFiltersProps) {
    return (
        <div className="flex flex-wrap items-center justify-start gap-4">
            <div className="relative w-[260px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Tìm chi phí..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-xl border-border focus:border-primary"
                />
            </div>

            {isSeasonLocked ? (
                <div className="rounded-xl border border-border px-3 py-2 text-sm bg-card">
                    Mùa vụ: <span className="font-medium">{lockedSeasonLabel ?? "Đang chọn"}</span>
                </div>
            ) : (
                <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                    <SelectTrigger className="rounded-xl border-border w-[180px]">
                        <SelectValue placeholder="Chọn mùa vụ" />
                    </SelectTrigger>
                    <SelectContent>
                        {seasonOptions.length === 0 ? (
                            <SelectItem value="none" disabled>
                                Chưa có mùa vụ
                            </SelectItem>
                        ) : (
                            seasonOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))
                        )}
                    </SelectContent>
                </Select>
            )}

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="rounded-xl border-border w-[150px]">
                    <SelectValue placeholder="Tất cả danh mục" />
                </SelectTrigger>
                <SelectContent>
                    {CATEGORY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="rounded-xl border-border w-[150px]">
                    <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}



