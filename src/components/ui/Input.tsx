import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | undefined;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id: idProp, ...props }, ref) => {
    const id = idProp ?? props.name ?? label?.toLowerCase().replace(/\s/g, "-");
    return (
      <div className="w-full">
        {label ? (
          <label htmlFor={id} className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-500 transition-colors focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400 dark:focus:border-zinc-500 dark:focus:ring-zinc-500",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:ring-red-500",
            className
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        {error ? (
          <p id={`${id}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
