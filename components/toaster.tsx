"use client";

import { Toaster as HotToaster } from "react-hot-toast";

/* Hallmark · design-system: design.md
 * Colours compose from the OKLCH channel triplets in tokens.css. The previous
 * hsl(var(--card)) form broke when the palette moved to OKLCH. */

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "oklch(var(--card))",
          color: "oklch(var(--card-foreground))",
          border: "1px solid oklch(var(--border))",
          borderRadius: "var(--radius-card)",
          fontSize: "0.875rem",
        },
        success: {
          iconTheme: {
            primary: "oklch(var(--success))",
            secondary: "oklch(var(--card))",
          },
        },
        error: {
          iconTheme: {
            primary: "oklch(var(--destructive))",
            secondary: "oklch(var(--card))",
          },
        },
      }}
    />
  );
}
