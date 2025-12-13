"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
      icon: <span className="material-icons-round text-xl">pending_actions</span>,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    {
      label: "Médecins",
      href: "/admin",
      icon: <span className="material-icons-round text-xl">people_alt</span>,
    },
    {
      label: "Configuration",
      href: "/admin/configuration",
      icon: <span className="material-icons-round text-xl">settings</span>,
    },
  ];

  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      <nav className="bg-card rounded-xl border shadow-sm overflow-hidden sticky top-8">
        <div className="p-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all group text-sm font-medium",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "transition-colors",
                    isActive
                      ? "text-primary"
                      : "group-hover:text-primary"
                  )}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {item.badge && (
                  <Badge
                    variant="destructive"
                    className="ml-auto text-xs font-bold"
                  >
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
