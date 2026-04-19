import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Ticket,
  Users,
  BarChart3,
  Settings,
  Headphones,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard",   label: "Overview",          icon: LayoutDashboard },
  { to: "/team",        label: "Team Performance",  icon: Users },
  { to: "/tickets",     label: "Tickets",           icon: Ticket, badge: 14 },
  { to: "/insights",    label: "Insights",          icon: BarChart3 },
  { to: "/settings",    label: "Settings",          icon: Settings },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-14 items-center gap-2.5 px-4 border-b border-sidebar-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
          <Headphones className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[13px] font-semibold tracking-tight text-sidebar-foreground">
            Helpdesk
          </span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Operations
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 p-2">
        {nav.map((item) => {
          const active =
            pathname === item.to || (item.to !== "/dashboard" && pathname.startsWith(item.to));
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "group flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  active ? "text-primary" : "text-sidebar-foreground/60 group-hover:text-sidebar-foreground",
                )}
              />
              <span className="flex-1">{item.label}</span>
              {"badge" in item && item.badge ? (
                <span className="inline-flex h-4 min-w-4 items-center justify-center rounded bg-muted px-1 text-[10px] font-semibold text-foreground">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="m-2 rounded-md border border-sidebar-border bg-sidebar-accent/30 p-2.5">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-[10px] font-semibold text-primary-foreground">
            EC
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <div className="truncate text-[12px] font-medium text-sidebar-foreground">Elena Cruz</div>
            <div className="truncate text-[10px] text-muted-foreground">Team Lead · Billing</div>
          </div>
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
        </div>
      </div>
    </aside>
  );
}
