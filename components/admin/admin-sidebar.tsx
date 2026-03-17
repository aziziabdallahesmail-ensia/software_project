"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Users, Settings } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

interface AdminSidebarProps {
  pendingCount?: number;
}

export function AdminSidebar({ pendingCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      label: "Vérification en attente",
      href: "/admin/pending-verification",
      icon: <ShieldAlert className="h-4 w-4" />,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    {
      label: "Médecins",
      href: "/admin",
      icon: <Users className="h-4 w-4" />,
    },
    {
      label: "Configuration",
      href: "/admin/configuration",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  return (
    <aside className="w-full lg:w-80 flex-shrink-0">
      <nav className="sticky top-8 rounded-[1.75rem] border border-emerald-100/80 bg-white/90 p-3 shadow-sm backdrop-blur dark:border-emerald-900/40 dark:bg-slate-950/70">
        <div className="mb-3 px-3 pt-3">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
            Navigation admin
          </p>
        </div>
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-[1.25rem] px-4 py-3 text-sm font-medium transition",
                  isActive
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900/80 dark:hover:text-slate-50"
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-xl",
                    isActive
                      ? "bg-white text-emerald-700 shadow-sm dark:bg-slate-900 dark:text-emerald-300"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400"
                  )}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {item.badge && (
                  <Badge className="ml-auto rounded-full bg-red-500 text-white hover:bg-red-500">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
