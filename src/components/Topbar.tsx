import { Bell, Search, Command } from "lucide-react";

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b border-border bg-background/80 px-6 backdrop-blur-md">
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[15px] font-semibold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="hidden md:flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground w-72">
        <Search className="h-3.5 w-3.5" />
        <span className="flex-1 text-xs">Search tickets, customers, agents...</span>
        <kbd className="inline-flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono">
          <Command className="h-2.5 w-2.5" />K
        </kbd>
      </div>

      <button className="relative rounded-md border border-border bg-card p-1.5 text-muted-foreground hover:text-foreground transition-colors">
        <Bell className="h-3.5 w-3.5" />
        <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-destructive" />
      </button>
    </header>
  );
}
