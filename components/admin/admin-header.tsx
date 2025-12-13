"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function AdminHeader() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
      <div className="flex justify-between items-center mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors gap-2 group"
        >
          <span className="bg-background p-2 rounded-lg border border-border group-hover:border-primary/30 transition-colors shadow-sm">
            <ArrowLeft className="h-4 w-4" />
          </span>
          Retour à l&apos;accueil
        </Link>
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            <span className="material-icons-round text-muted-foreground hover:text-primary transition-colors dark:hidden">
              dark_mode
            </span>
            <span className="material-icons-round text-muted-foreground hover:text-primary transition-colors hidden dark:inline">
              light_mode
            </span>
          </Button>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="p-3 bg-background rounded-xl border border-border shadow-sm">
          <span className="material-icons-round text-primary text-[32px]">
            admin_panel_settings
          </span>
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
            Paramètres Admin
          </h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Gérez les paramètres de votre espace administrateur et les accès.
          </p>
        </div>
      </div>
    </header>
  );
}
