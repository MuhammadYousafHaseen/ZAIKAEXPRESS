
import * as React from "react";

import { cn } from "@/src/lib/utils";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function FormField({
  label,
  htmlFor,
  error,
  hint,
  required = false,
  className,
  children,
}: FormFieldProps) {
  const messageId = `${htmlFor}-message`;
  const hasMessage = Boolean(error || hint);

  return (
    <div className={cn("grid w-full gap-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-foreground"
      >
        {label}
        {required && (
          <>
            <span aria-hidden="true" className="ml-1 text-red-600">
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        )}
      </label>

      {React.isValidElement<{ id?: string; "aria-describedby"?: string; "aria-invalid"?: boolean }>(children)
        ? React.cloneElement(children, {
            id: children.props.id ?? htmlFor,
            "aria-invalid": error ? true : undefined,
            "aria-describedby": hasMessage ? messageId : undefined,
          })
        : children}

      {hasMessage && (
        <p
          id={messageId}
          role={error ? "alert" : undefined}
          className={cn(
            "text-sm",
            error ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
          )}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}
