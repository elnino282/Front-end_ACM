import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib";

// Typography variants using the established design tokens
const typographyVariants = cva("", {
    variants: {
        variant: {
            h1: "font-semibold leading-[1.3] tracking-tight",
            h2: "font-semibold leading-[1.4]",
            h3: "font-semibold leading-[1.4]",
            h4: "font-semibold leading-[1.5]",
            body: "font-normal leading-[1.6]",
            sm: "font-normal leading-[1.5]",
            xs: "font-normal leading-[1.5]",
            caption: "font-medium leading-[1.5] text-muted-foreground",
            label: "font-medium leading-[1.5]",
        },
        textColor: {
            default: "text-foreground",
            muted: "text-muted-foreground",
            primary: "text-primary",
            success: "text-success",
            warning: "text-warning-foreground",
            destructive: "text-destructive",
            info: "text-info",
        },
    },
    defaultVariants: {
        variant: "body",
        textColor: "default",
    },
});

type TypographyVariant = NonNullable<VariantProps<typeof typographyVariants>["variant"]>;

const typographySizes: Record<TypographyVariant, React.CSSProperties> = {
    h1: { fontSize: "var(--text-page-title)" },
    h2: { fontSize: "var(--text-section-title)" },
    h3: { fontSize: "var(--text-section-title)" },
    h4: { fontSize: "var(--text-body)" },
    body: { fontSize: "var(--text-body)" },
    sm: { fontSize: "var(--text-body-sm)" },
    xs: { fontSize: "var(--text-body-xs)" },
    caption: { fontSize: "var(--text-body-xs)" },
    label: { fontSize: "var(--text-body-xs)" },
};

type TypographyElement = "h1" | "h2" | "h3" | "h4" | "p" | "span" | "label";

interface TypographyProps
    extends Omit<React.HTMLAttributes<HTMLElement>, "color">,
        VariantProps<typeof typographyVariants> {
    as?: TypographyElement;
}

function Typography({
    className,
    variant,
    textColor,
    as,
    children,
    style,
    ...props
}: TypographyProps) {
    // Determine the default element based on variant
    const getDefaultElement = (): TypographyElement => {
        switch (variant) {
            case "h1":
                return "h1";
            case "h2":
                return "h2";
            case "h3":
                return "h3";
            case "h4":
                return "h4";
            case "label":
                return "label";
            case "caption":
            case "xs":
            case "sm":
                return "span";
            default:
                return "p";
        }
    };

    const Comp = as || getDefaultElement();
    const resolvedVariant = (variant ?? "body") as TypographyVariant;

    return (
        <Comp
            className={cn(
                typographyVariants({ variant: resolvedVariant, textColor }),
                className,
            )}
            style={{ ...typographySizes[resolvedVariant], ...style }}
            {...props}
        >
            {children}
        </Comp>
    );
}

// Convenience components for common use cases
function H1({ className, ...props }: Omit<TypographyProps, "variant" | "as">) {
    return <Typography variant="h1" as="h1" className={className} {...props} />;
}

function H2({ className, ...props }: Omit<TypographyProps, "variant" | "as">) {
    return <Typography variant="h2" as="h2" className={className} {...props} />;
}

function H3({ className, ...props }: Omit<TypographyProps, "variant" | "as">) {
    return <Typography variant="h3" as="h3" className={className} {...props} />;
}

function H4({ className, ...props }: Omit<TypographyProps, "variant" | "as">) {
    return <Typography variant="h4" as="h4" className={className} {...props} />;
}

function Text({ className, ...props }: Omit<TypographyProps, "variant" | "as">) {
    return <Typography variant="body" as="p" className={className} {...props} />;
}

function Small({ className, ...props }: Omit<TypographyProps, "variant" | "as">) {
    return <Typography variant="sm" as="span" className={className} {...props} />;
}

function Caption({ className, ...props }: Omit<TypographyProps, "variant" | "as">) {
    return <Typography variant="caption" as="span" className={className} {...props} />;
}

export { Typography, typographyVariants, H1, H2, H3, H4, Text, Small, Caption };
export type { TypographyProps };
