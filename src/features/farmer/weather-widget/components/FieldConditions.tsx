import React from "react";
import { Sprout } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SprayConditions } from "../types";

interface FieldConditionsProps {
    sprayConditions: SprayConditions;
}

/**
 * Field Conditions Component
 * Displays farming-specific conditions like spray suitability
 */
export const FieldConditions = React.memo<FieldConditionsProps>(
    ({ sprayConditions }) => {
        return (
            <div
                className="mb-4 p-3 rounded-xl border border-primary/20"
                style={{
                    background:
                        "linear-gradient(to right, color-mix(in oklab, var(--primary) 10%, transparent), color-mix(in oklab, var(--secondary) 10%, transparent))",
                }}
            >
                <div className="flex items-center gap-1.5 mb-2">
                    <Sprout className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground">Field Conditions</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Spray Conditions</span>
                    <Badge
                        className={`${sprayConditions.color} bg-transparent border-0 px-0`}
                    >
                        {sprayConditions.label}
                    </Badge>
                </div>
            </div>
        );
    }
);

FieldConditions.displayName = "FieldConditions";



