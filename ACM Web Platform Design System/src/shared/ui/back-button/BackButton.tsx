import { cn } from "@/shared/lib/utils";
import { ArrowLeft } from "lucide-react";
import { forwardRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../button";

type ButtonProps = React.ComponentProps<typeof Button>;

export interface BackButtonProps extends Omit<ButtonProps, "asChild"> {
  /** Navigation path. If provided, renders as Link */
  to?: string;
  /** Custom label. Default: "Quay về" */
  label?: string;
  /** Show icon only (no label) */
  iconOnly?: boolean;
}

/**
 * Standardized Back Button component for consistent navigation across the app.
 *
 * @example
 * // With navigation path
 * <BackButton to="/farmer/farms" label="Quay về Trang trại" />
 *
 * // With onClick handler
 * <BackButton onClick={onBack} />
 *
 * // Icon only
 * <BackButton iconOnly onClick={onBack} />
 *
 * // Go back in history (default behavior if no `to` or `onClick`)
 * <BackButton />
 */
export const BackButton = forwardRef<HTMLButtonElement, BackButtonProps>(
  (
    {
      to,
      label = "Quay về",
      iconOnly = false,
      variant = "ghost",
      size,
      className,
      onClick,
      ...props
    },
    ref,
  ) => {
    const navigate = useNavigate();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onClick) {
        onClick(e);
      } else if (!to) {
        navigate(-1);
      }
    };

    const buttonSize = iconOnly ? "icon" : size;
    const buttonContent = (
      <>
        <ArrowLeft className={cn("w-4 h-4", !iconOnly && "mr-2")} />
        {!iconOnly && label}
      </>
    );

    if (to) {
      return (
        <Button
          ref={ref}
          variant={variant}
          size={buttonSize}
          className={cn("pl-0", className)}
          asChild
          {...props}
        >
          <Link to={to}>{buttonContent}</Link>
        </Button>
      );
    }

    return (
      <Button
        ref={ref}
        variant={variant}
        size={buttonSize}
        className={cn(!iconOnly && "pl-0", className)}
        onClick={handleClick}
        {...props}
      >
        {buttonContent}
      </Button>
    );
  },
);

BackButton.displayName = "BackButton";
