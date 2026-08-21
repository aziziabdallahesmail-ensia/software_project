import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/* Hallmark · design-system: design.md
 * CTA voice: solid accent primary, hairline-bordered secondary, danger as
 * text-on-paper (solid red is reserved for the final confirm step).
 * Motion: border/background only, plus a 1px press. Never `transition-all`. */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "text-sm font-medium rounded-[var(--radius-control)]",
    "transition-[background-color,border-color,color,transform] duration-base ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:translate-y-px",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline:
          "border border-border bg-transparent text-foreground hover:border-primary/50 hover:bg-primary-soft/40",
        secondary:
          "border border-border-soft bg-secondary text-secondary-foreground hover:bg-accent",
        ghost: "text-foreground hover:bg-accent",
        link: "text-primary underline-offset-4 hover:underline",
        /* Reversible destructive action — the default for cancel/reject. */
        destructive:
          "border border-destructive/30 bg-transparent text-destructive hover:bg-destructive-soft",
        /* Irreversible confirm only. Use sparingly. */
        destructiveSolid:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        /* On photography / the video stage. The page-ground variants have no
         * contrast there, and the focus ring needs a dark offset to stay visible. */
        onDark:
          "bg-stage-fg text-stage hover:bg-stage-fg/90 focus-visible:ring-stage-accent focus-visible:ring-offset-scrim",
        onDarkOutline:
          "border border-stage-fg/35 bg-transparent text-stage-fg hover:border-stage-fg/60 hover:bg-stage-fg/10 focus-visible:ring-stage-accent focus-visible:ring-offset-scrim",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-6",
        xl: "h-12 px-7 text-base",
        icon: "h-10 w-10",
        iconSm: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
