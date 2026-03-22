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
      label: "En attente",
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
    <aside className="w-full lg:w-72 flex-shrink-0">
      <nav className="card-clinical p-4">
        <div className="mb-3 px-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Navigation
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
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <Badge variant="destructive" className="ml-auto h-5 min-w-5 justify-center rounded-full px-1.5 text-xs">
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
