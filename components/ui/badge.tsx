import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/* Hallmark · design-system: design.md
 * One status vocabulary. Soft tinted ground + hairline border, never a solid
 * accent fill — a list of solid chips would blow the accent's 5% budget.
 * Colour is never the only signal: each badge carries a dot. */
const badgeVariants = cva(
  [
    "inline-flex items-center gap-1.5 rounded-[var(--radius-chip)] border",
    "px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
    "before:h-1.5 before:w-1.5 before:rounded-full before:bg-current before:opacity-70",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "border-primary/25 bg-primary-soft text-primary",
        secondary: "border-border bg-muted text-muted-foreground",
        outline: "border-border text-foreground",
        destructive: "border-destructive/25 bg-destructive-soft text-destructive",
        success: "border-success/25 bg-success-soft text-success",
        warning: "border-warning/30 bg-warning-soft text-warning",
        info: "border-primary/25 bg-primary-soft text-primary",
      },
      dot: {
        false: "before:hidden",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, dot, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, dot }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
