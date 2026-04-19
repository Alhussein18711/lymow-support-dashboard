import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Building2 } from "lucide-react";
import { Topbar } from "@/components/Topbar";
import { Input } from "@/components/ui/input";
import { getCustomers } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/customers/")({
  head: () => ({ meta: [{ title: "Customers — Helpdesk" }] }),
  component: CustomersPage,
});

function CustomersPage() {
  const [q, setQ] = useState("");
  const customers = getCustomers().filter((c) =>
    `${c.name} ${c.email} ${c.company}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <>
      <Topbar title="Customers" subtitle={`${customers.length} accounts`} />
      <main className="flex-1 space-y-4 p-6">
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search customers by name, email or company..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="h-9 pl-9 border-border bg-background"
            />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {customers.map((c) => (
            <Link
              key={c.id}
              to="/customers/$customerId"
              params={{ customerId: c.id }}
              className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                  {c.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold group-hover:text-primary transition-colors">
                    {c.name}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">{c.email}</div>
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Building2 className="h-2.5 w-2.5" />
                    {c.company}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-[11px]">
                <span className="rounded-md bg-muted px-2 py-0.5 text-muted-foreground">{c.plan}</span>
                <span className="rounded-md bg-muted px-2 py-0.5 text-muted-foreground">
                  {c.totalTickets} tickets
                </span>
                {c.openTickets > 0 && (
                  <span className="rounded-md bg-warning/15 px-2 py-0.5 text-warning ring-1 ring-inset ring-warning/30">
                    {c.openTickets} open
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
