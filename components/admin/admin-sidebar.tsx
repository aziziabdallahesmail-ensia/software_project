"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ShieldAlert, Users, Settings } from "lucide-react";

/* Hallmark · design-system: design.md
 * Sub-navigation for the admin area. Active state is a drawn marker, not a
 * filled pill. Scrolls horizontally on mobile rather than stacking tall. */

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
      label: "En attente",
      href: "/admin/pending-verification",
      icon: <ShieldAlert className="h-4 w-4" />,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    {
      label: "Praticiens",
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
    <aside className="w-full shrink-0 lg:w-56">
      <p className="label-meta mb-3 hidden lg:block">Administration</p>
      <nav
        className="scrollbar-thin -mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
        aria-label="Navigation administration"
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-[var(--radius-control)] px-3 py-2 text-sm transition-colors duration-fast ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:shrink",
                isActive
                  ? "bg-primary-soft font-medium text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="tabular ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-[var(--radius-chip)] border border-destructive/25 bg-destructive-soft px-1.5 text-[0.6875rem] font-medium text-destructive">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
