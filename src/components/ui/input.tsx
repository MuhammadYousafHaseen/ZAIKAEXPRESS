
import * as React from "react";

import { cn } from "@/src/lib/utils";

export type InputProps = React.ComponentProps<"input">;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        ref={ref}
        data-slot="input"
        type={type}
        className={cn(
          [
            "flex h-10 w-full min-w-0 rounded-lg border border-input",
            "bg-background px-3 py-2 text-base text-foreground",
            "placeholder:text-muted-foreground",
            "transition-colors duration-150",
            "file:mr-3 file:border-0 file:bg-transparent",
            "file:text-sm file:font-medium file:text-foreground",
            "focus-visible:outline-2 focus-visible:outline-offset-2",
            "focus-visible:outline-ring",
            "disabled:pointer-events-none disabled:cursor-not-allowed",
            "disabled:opacity-50",
            "aria-invalid:border-red-500",
            "aria-invalid:focus-visible:outline-red-500",
            "md:text-sm",
          ].join(" "),
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
