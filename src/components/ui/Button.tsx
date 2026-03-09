import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-foreground text-background hover:opacity-90",
  secondary: "bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-600",
  ghost: "hover:bg-zinc-100 dark:hover:bg-zinc-800",
  danger: "bg-red-600 text-white hover:bg-red-700",
  outline: "border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 dark:focus:ring-zinc-500 dark:focus:ring-offset-zinc-900 disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={disabled ?? isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
            <span>Loading…</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
