import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps): JSX.Element {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-700", className)}
      aria-hidden
      {...props}
    />
  );
}
