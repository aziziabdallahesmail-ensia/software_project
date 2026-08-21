import type { Config } from "tailwindcss";

/* Hallmark · design-system: design.md
 * Colours compose from OKLCH channel triplets defined in tokens.css, so
 * Tailwind opacity modifiers (bg-primary/10, border-border/60) keep working.
 * Never hardcode a colour literal here — it silently overrides the token and
 * desynchronises the component from the focus ring. */
const ch = (name: string) => `oklch(var(--${name}) / <alpha-value>)`;

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: ch("background"),
        foreground: ch("foreground"),
        card: {
          DEFAULT: ch("card"),
          foreground: ch("card-foreground"),
        },
        popover: {
          DEFAULT: ch("popover"),
          foreground: ch("popover-foreground"),
        },
        primary: {
          DEFAULT: ch("primary"),
          foreground: ch("primary-foreground"),
          soft: ch("primary-soft"),
        },
        secondary: {
          DEFAULT: ch("secondary"),
          foreground: ch("secondary-foreground"),
        },
        muted: {
          DEFAULT: ch("muted"),
          foreground: ch("muted-foreground"),
        },
        accent: {
          DEFAULT: ch("accent"),
          foreground: ch("accent-foreground"),
        },
        destructive: {
          DEFAULT: ch("destructive"),
          foreground: ch("destructive-foreground"),
          soft: ch("destructive-soft"),
        },
        success: {
          DEFAULT: ch("success"),
          foreground: ch("success-foreground"),
          soft: ch("success-soft"),
        },
        warning: {
          DEFAULT: ch("warning"),
          foreground: ch("warning-foreground"),
          soft: ch("warning-soft"),
        },
        border: {
          DEFAULT: ch("border"),
          soft: ch("border-soft"),
        },
        stage: {
          DEFAULT: ch("ch-stage"),
          2: ch("ch-stage-2"),
          fg: ch("ch-stage-fg"),
          rule: ch("ch-stage-rule"),
          accent: ch("ch-stage-accent"),
        },
        scrim: ch("ch-scrim"),
        input: ch("input"),
        ring: ch("ring"),
      },
      borderRadius: {
        sm: "calc(var(--radius) - 2px)",
        DEFAULT: "var(--radius)",
        md: "var(--radius)",
        lg: "var(--radius-card)",
        xl: "var(--radius-panel)",
      },
      fontFamily: {
        display: ["var(--font-plex-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-plex-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        display: "var(--tracking-display)",
        label: "var(--tracking-label)",
      },
      transitionTimingFunction: {
        out: "var(--ease-out)",
        "in-out": "var(--ease-in-out)",
      },
      transitionDuration: {
        fast: "var(--dur-fast)",
        base: "var(--dur-base)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
