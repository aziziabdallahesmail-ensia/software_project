import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/toaster";
import { Toaster as SonnerToaster } from "sonner";
import "./globals.css";

const defaultUrl = "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Plateforme de Rendez-vous Médicaux",
  description:
    "Prenez des rendez-vous, consultez par vidéo et gérez votre parcours de santé sur une seule plateforme sécurisée.",
};

// Display + body share one family (single-family discipline, modern-minimal).
const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  display: "swap",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
});

// Outlier register — machine-readable values only: times, dates, IDs.
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  display: "swap",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${plexSans.variable} ${plexMono.variable} bg-background text-foreground antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          {/* Two toast libraries are in use: react-hot-toast (admin lists,
              video call) and sonner (booking, availability, appointments).
              Both need mounting — sonner's was missing, so its toasts were
              silently dropped. */}
          <Toaster />
          <SonnerToaster
            position="top-right"
            toastOptions={{
              classNames: {
                toast:
                  "!bg-card !text-card-foreground !border !border-border !rounded-[var(--radius-card)]",
                description: "!text-muted-foreground",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
