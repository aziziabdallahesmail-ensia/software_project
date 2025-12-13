import type { Metadata } from "next";
import { Geist, Sora } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const defaultUrl = "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Plateforme de Rendez-vous Médicaux",
  description: "Prenez des rendez-vous, consultez par vidéo et gérez votre parcours de santé sur une seule plateforme sécurisée.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${sora.variable} font-display bg-background-light dark:bg-background-dark text-zinc-700 dark:text-zinc-300 antialiased transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
