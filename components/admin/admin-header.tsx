"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck, Moon, Sun } from "lucide-react";
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
    <header className="max-w-7xl mx-auto px-4 lg:px-6 pt-6 pb-4">
      <div className="section-container">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à l&apos;accueil
            </Link>

            <div className="flex items-center gap-4">
              <div className="icon-container icon-container-lg">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight text-foreground">
                  Administration
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Gérez les médecins, les vérifications et les paramètres de la plateforme.
                </p>
              </div>
            </div>
          </div>

          {mounted && (
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-lg"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
