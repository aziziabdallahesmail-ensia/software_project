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
  Settings,
  Home,
  Clock,
  Users,
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

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedTime = now.toLocaleString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setCurrentTime(formattedTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  // Role-based navigation links
  const getNavigationLinks = () => {
    if (!user) return [];

    const baseLinks = [
      { href: "/home", label: "Accueil", icon: Home },
    ];

    if (user.role === "admin") {
      return [
        ...baseLinks,
        { href: "/admin", label: "Tableau de bord", icon: Settings },
        { href: "/admin/pending-verification", label: "Vérifications", icon: Users },
        { href: "/admin/configuration", label: "Configuration", icon: Settings },
        { href: "/list_doctors", label: "Médecins", icon: Stethoscope },
        { href: "/appointments", label: "Rendez-vous", icon: Calendar },
      ];
    }

    if (user.role === "doctor") {
      const isVerified = user.verificationStatus === "approved";
      if (isVerified) {
        return [
          ...baseLinks,
          { href: "/doctor", label: "Mon espace", icon: Stethoscope },
          { href: "/appointments", label: "Mes rendez-vous", icon: Calendar },
        ];
      }
      return [
        ...baseLinks,
        { href: "/doctor/still-in-verification", label: "Statut vérification", icon: Clock },
      ];
    }

    if (user.role === "patient") {
      return [
        ...baseLinks,
        { href: "/list_doctors", label: "Trouver un médecin", icon: Stethoscope },
        { href: "/appointments", label: "Mes rendez-vous", icon: Calendar },
      ];
    }

    return baseLinks;
  };

  const getRoleBadge = () => {
    if (!user?.role) return null;

    const roleConfig: Record<string, { label: string; className: string }> = {
      admin: {
        label: "Administrateur",
        className: "bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0",
      },
      doctor: {
        label: "Médecin",
        className: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0",
      },
      patient: {
        label: "Patient",
        className: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0",
      },
    };

    const config = roleConfig[user.role];
    if (!config) return null;

    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const navLinks = getNavigationLinks();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/home" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              MédiConnect
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side: Time, User info, Actions */}
          <div className="flex items-center gap-4">
            {/* Current Time */}
            <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="capitalize">{currentTime}</span>
            </div>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="hidden sm:flex flex-col items-start">
                      <span className="text-sm font-medium">
                        {user.full_name || user.email?.split("@")[0] || "Utilisateur"}
                      </span>
                      {getRoleBadge()}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex flex-col gap-1 p-2">
                    <p className="text-sm font-medium">
                      {user.full_name || "Utilisateur"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                    <div className="mt-1">{getRoleBadge()}</div>
                  </div>
                  <DropdownMenuSeparator />
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <DropdownMenuItem key={link.href} asChild>
                        <Link href={link.href} className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {link.label}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 dark:text-red-400 focus:text-red-600"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Connexion
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                  >
                    S'inscrire
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-1">
              {/* Mobile Time */}
              <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="capitalize">{currentTime}</span>
              </div>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
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