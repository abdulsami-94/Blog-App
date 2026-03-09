import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline";
}

const variantClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-zinc-800 text-zinc-100 dark:bg-zinc-200 dark:text-zinc-900",
  secondary: "bg-zinc-200 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200",
  outline: "border border-zinc-300 dark:border-zinc-600",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps): JSX.Element {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
