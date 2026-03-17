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
    <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
      <div className="rounded-[2rem] border border-emerald-100/80 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur dark:border-emerald-900/40 dark:bg-slate-950/70 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-950/60"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à l&apos;accueil
            </Link>

            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 md:text-4xl">
                  Administration
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Gérez les médecins, les vérifications et les paramètres de la
                  plateforme dans une interface sobre et rassurante.
                </p>
              </div>
            </div>
          </div>

          {mounted && (
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full border-emerald-200 bg-white dark:border-emerald-900/50 dark:bg-slate-950/70"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
