import * as React from "react";
import { cn } from "@/shared/lib";

export interface PageContainerProps {
    /** Page content */
    children: React.ReactNode;
    /** Additional className for the container */
    className?: string;
    /** Max width variant */
    maxWidth?: "default" | "full" | "narrow";
}

/**
 * PageContainer Component
 * 
 * Consistent page wrapper that provides:
 * - Max width constraint
 * - Consistent padding
 * - Background color
 * 
 * @example
 * ```tsx
 * <PageContainer>
 *   <PageHeader ... />
 *   <Card>...</Card>
 * </PageContainer>
 * ```
 */
export function PageContainer({
    children,
    className,
    maxWidth = "default",
}: PageContainerProps) {
    return (
        <div className={cn("min-h-screen bg-background pb-20", className)}>
            <div
                className={cn(
                    "mx-auto p-6",
                    {
                        "max-w-[1920px]": maxWidth === "default",
                        "max-w-[1200px]": maxWidth === "narrow",
                        // full has no max-width
                    }
                )}
            >
                {children}
            </div>
        </div>
    );
}

PageContainer.displayName = "PageContainer";
