import * as React from "react";

import { cn } from "@/lib/utils";

/* Hallmark · design-system: design.md
 * Hairline border, no shadow. Focus ring shows instantly. */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full min-w-0 rounded-[var(--radius-control)] border border-input bg-background px-3 py-2 text-sm",
          "transition-[border-color] duration-base ease-out",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-muted-foreground",
          "hover:border-primary/40",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background focus-visible:border-primary",
          "aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
