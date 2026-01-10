import { Download, Filter, BarChart3 } from "lucide-react";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SEASON_OPTIONS } from "../constants";

interface HeaderBarProps {
    selectedSeason: string;
    onSeasonChange: (season: string) => void;
    onFilterClick: () => void;
    onExportClick: () => void;
}

export function HeaderBar({
    selectedSeason,
    onSeasonChange,
    onFilterClick,
    onExportClick,
}: HeaderBarProps) {
    return (
        <Card className="border border-border rounded-xl shadow-sm mb-6 sticky top-0 z-10 bg-card">
            <CardContent className="px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-shrink-0">
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2 leading-tight">
                            <BarChart3 className="w-6 h-6 text-emerald-600" />
                            Reports Overview
                        </h1>
                        <p className="text-sm text-slate-600 mt-1">
                            Track productivity, costs, and compliance
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
                        <Select value={selectedSeason} onValueChange={onSeasonChange}>
                            <SelectTrigger className="w-[180px] rounded-xl border-border">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {SEASON_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button
                            variant="outline"
                            className="rounded-xl border-primary text-primary hover:bg-primary/5"
                            onClick={onFilterClick}
                        >
                            <Filter className="w-4 h-4 mr-2" />
                            Filter
                        </Button>

                        <Button
                            className="bg-primary hover:bg-primary/90 text-white rounded-xl shadow-sm"
                            onClick={onExportClick}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}



