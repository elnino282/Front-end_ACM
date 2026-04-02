import { CheckCircle2, Clock, Moon, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PlotStatus } from "../types";

interface PlotStatusChipProps {
    status: PlotStatus;
    className?: string;
}

/**
 * PlotStatusChip Component
 * 
 * Enhanced status badge with icons for better accessibility and visual clarity.
 * Uses color + icon combination to ensure status is clear even in grayscale.
 * Updated with standardized WCAG-compliant color tokens.
 */
export function PlotStatusChip({ status, className = "" }: PlotStatusChipProps) {
    const statusConfig = {
        active: {
            icon: CheckCircle2,
            label: "Active",
            className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        },
        dormant: {
            icon: Moon,
            label: "Dormant",
            className: "bg-slate-50 text-slate-600 border border-slate-200",
        },
        planned: {
            icon: Clock,
            label: "Planned",
            className: "bg-blue-50 text-blue-600 border border-blue-200",
        },
        "at-risk": {
            icon: AlertTriangle,
            label: "At Risk",
            className: "bg-amber-50 text-amber-700 border border-amber-200",
        },
    };

    const config = statusConfig[status] || statusConfig.planned;
    const Icon = config.icon;

    return (
        <Badge className={`${config.className} ${className} inline-flex items-center gap-1.5 py-1 rounded-md text-xs font-semibold`} style={{ paddingLeft: '10px', paddingRight: '10px' }}>
            <Icon className="w-3.5 h-3.5" />
            <span>{config.label}</span>
        </Badge>
    );
}



