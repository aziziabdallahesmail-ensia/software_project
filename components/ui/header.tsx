"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  X,
  User,
  LogOut,
  Calendar,
  Stethoscope,
  Home,
  ChevronDown,
  Activity,
} from "lucide-react";

/* Hallmark · nav: N1b (three-section app shell) · design-system: design.md
 * Flush bar, one hairline, solid ground — no blur/glass.
 * Active state is a drawn underline, not a filled pill. */

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
  verificationStatus: string | null;
}

interface HeaderProps {
  user: Profile | null;
}

const roleLabels: Record<string, string> = {
  admin: "Admin",
  doctor: "Médecin",
  patient: "Patient",
};

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const getNavigationLinks = () => {
    if (!user) return [];

    if (user.role === "admin") {
      return [
        { href: "/home", label: "Accueil", icon: Home },
        { href: "/admin", label: "Tableau de bord", icon: Activity },
        {
          href: "/admin/pending-verification",
          label: "Vérifications",
          icon: Stethoscope,
        },
        { href: "/list_doctors", label: "Médecins", icon: Calendar },
      ];
    }

    if (user.role === "doctor") {
      const isVerified = user.verificationStatus === "verified";
      if (isVerified) {
        // No /appointments link: that route is patient-only and bounces
        // doctors to /role_selection. Their appointments live on /doctor.
        return [{ href: "/doctor", label: "Mon espace", icon: Stethoscope }];
      }
    }

    if (user.role === "patient") {
      return [
        { href: "/home", label: "Accueil", icon: Home },
        { href: "/list_doctors", label: "Médecins", icon: Stethoscope },
        { href: "/appointments", label: "Rendez-vous", icon: Calendar },
      ];
    }

    return [];
  };

  const navLinks = getNavigationLinks();
  const displayName =
    user?.full_name || user?.email?.split("@")[0] || "Utilisateur";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto w-full max-w-[88rem] px-4 lg:px-6">
        <div className="flex h-[var(--header-height)] items-center gap-4">
          {/* 1 · wordmark */}
          <Link
            href="/home"
            className="flex shrink-0 items-center gap-2.5 rounded-[var(--radius-control)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-control)] border border-primary/25 bg-primary-soft text-primary">
              <Stethoscope className="h-4 w-4" />
            </span>
            <span className="font-display text-base font-medium tracking-display">
              MédiConnect
            </span>
          </Link>

          {/* 2 · destinations */}
          <nav className="hidden flex-1 items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative whitespace-nowrap rounded-[var(--radius-control)] px-3 py-2 text-sm transition-colors duration-fast ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    isActive
                      ? "font-medium text-foreground after:absolute after:inset-x-3 after:-bottom-[13px] after:h-0.5 after:bg-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* 3 · account */}
          <div className="ml-auto flex items-center gap-2">
            <ThemeSwitcher />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-9 gap-2 px-2"
                    aria-label="Menu du compte"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-control)] border border-border-soft bg-muted text-muted-foreground">
                      <User className="h-3.5 w-3.5" />
                    </span>
                    <span className="hidden max-w-[10rem] truncate text-sm font-medium sm:block">
                      {displayName}
                    </span>
                    <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-64 border-border"
                >
                  <div className="flex flex-col gap-2 p-3">
                    <p className="truncate text-sm font-medium">{displayName}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                    {user.role && roleLabels[user.role] && (
                      <div className="mt-1">
                        <Badge variant="secondary">
                          {roleLabels[user.role]}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <DropdownMenuItem key={link.href} asChild>
                        <Link
                          href={link.href}
                          className="flex cursor-pointer items-center gap-2"
                        >
                          <Icon className="h-4 w-4" />
                          {link.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-destructive focus:bg-destructive-soft focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/login">Connexion</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/sign-up">Créer un compte</Link>
                </Button>
              </div>
            )}

            {navLinks.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            )}
          </div>
        </div>

        {mobileMenuOpen && navLinks.length > 0 && (
          <nav className="border-t border-border-soft py-2 lg:hidden">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-2.5 whitespace-nowrap rounded-[var(--radius-control)] px-3 py-2.5 text-sm transition-colors duration-fast ${
                    isActive
                      ? "bg-primary-soft font-medium text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
