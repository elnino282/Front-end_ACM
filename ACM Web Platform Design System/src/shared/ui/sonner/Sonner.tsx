import { Toaster as Sonner, ToasterProps } from "sonner";
import { useTheme } from "@/hooks/useTheme";

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme, resolvedTheme } = useTheme();
    const toasterTheme = theme === "system" ? resolvedTheme : theme;

    return (
        <Sonner
            theme={toasterTheme as ToasterProps["theme"]}
            className="toaster group"
            style={
                {
                    "--normal-bg": "var(--popover)",
                    "--normal-text": "var(--popover-foreground)",
                    "--normal-border": "var(--border)",
                } as React.CSSProperties
            }
            {...props}
        />
    );
};

export { Toaster };
