"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  User,
  LogOut,
  Calendar,
  Stethoscope,
  Home,
  Clock,
  ChevronDown,
  Activity,
} from "lucide-react";

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

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleString("fr-FR", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
      setCurrentTime(formattedTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

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
        { href: "/admin/pending-verification", label: "Vérifications", icon: Stethoscope },
        { href: "/list_doctors", label: "Médecins", icon: Calendar },
      ];
    }

    if (user.role === "doctor") {
      const isVerified = user.verificationStatus === "verified";
      if (isVerified) {
        return [
          { href: "/doctor", label: "Mon espace", icon: Stethoscope },
          { href: "/appointments", label: "Rendez-vous", icon: Calendar },
        ];
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

  const getRoleBadge = () => {
    if (!user?.role) return null;

    const roleConfig: Record<string, { label: string; className: string }> = {
      admin: {
        label: "Admin",
        className: "bg-primary/10 text-primary border-primary/20",
      },
      doctor: {
        label: "Médecin",
        className: "bg-accent/10 text-accent border-accent/20",
      },
      patient: {
        label: "Patient",
        className: "bg-success/10 text-success border-success/20",
      },
    };

    const config = roleConfig[user.role];
    if (!config) return null;

    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const navLinks = getNavigationLinks();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-card/80 backdrop-blur-md supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/home" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-sm">
              <Stethoscope className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground">
              MédiConnect
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {mounted && (
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-lg">
                <Clock className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{currentTime}</span>
              </div>
            )}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 h-auto py-1.5 px-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="hidden sm:flex flex-col items-start">
                      <span className="text-sm font-medium leading-tight">
                        {user.full_name || user.email?.split("@")[0] || "Utilisateur"}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 rounded-xl border-border/60 shadow-lg">
                  <div className="flex flex-col gap-2 p-3">
                    <p className="text-sm font-medium">
                      {user.full_name || "Utilisateur"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                    <div className="mt-1">{getRoleBadge()}</div>
                  </div>
                  <DropdownMenuSeparator className="bg-border/60" />
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <DropdownMenuItem key={link.href} asChild>
                        <Link href={link.href} className="flex items-center gap-2 rounded-lg cursor-pointer">
                          <Icon className="h-4 w-4" />
                          {link.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                  <DropdownMenuSeparator className="bg-border/60" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive focus:bg-destructive/10 rounded-lg cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    Connexion
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary-hover">
                    S'inscrire
                  </Button>
                </Link>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-border/60">
            <div className="flex flex-col space-y-1">
              {mounted && (
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">{currentTime}</span>
                </div>
              )}
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
              {user && (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  Se déconnecter
                </button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
