import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Building2, Calendar, Mail, CreditCard } from "lucide-react";
import { Topbar } from "@/components/Topbar";
import { getCustomer, getTickets, type Customer, type Ticket } from "@/lib/mock-data";
import { StatusBadge, PriorityBadge, CategoryBadge } from "@/components/StatusBadge";
import { format } from "date-fns";

export const Route = createFileRoute("/_app/customers/$customerId")({
  loader: ({ params }) => {
    const c = getCustomer(params.customerId);
    if (!c) throw notFound();
    const tk = getTickets().filter((t) => t.customerId === c.id);
    return { customer: c, tickets: tk } as { customer: Customer; tickets: Ticket[] };
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.customer.name} — Helpdesk` }] }),
  notFoundComponent: () => (
    <main className="flex flex-1 items-center justify-center p-12 text-sm text-muted-foreground">
      Customer not found.
    </main>
  ),
  errorComponent: ({ error }) => (
    <main className="flex flex-1 items-center justify-center p-12 text-sm text-destructive">
      {error.message}
    </main>
  ),
  component: CustomerDetail,
});

function CustomerDetail() {
  const { customer, tickets } = Route.useLoaderData() as { customer: Customer; tickets: Ticket[] };

  return (
    <>
      <Topbar title={customer.name} subtitle={customer.email} />
      <main className="flex-1 p-6">
        <Link to="/customers" className="mb-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3 w-3" /> All customers
        </Link>

        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-base font-semibold">
              {customer.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="flex-1 min-w-[200px]">
              <h2 className="text-lg font-semibold">{customer.name}</h2>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{customer.company}</span>
                <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{customer.email}</span>
                <span className="flex items-center gap-1"><CreditCard className="h-3 w-3" />{customer.plan}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Joined {format(new Date(customer.joinedAt), "MMM yyyy")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Stat label="Total tickets" value={String(customer.totalTickets)} />
          <Stat label="Open tickets"  value={String(customer.openTickets)} />
          <Stat label="Plan"          value={customer.plan} />
        </div>

        <div className="mt-4 rounded-lg border border-border bg-card">
          <div className="border-b border-border p-4">
            <h3 className="text-sm font-semibold">Ticket history</h3>
          </div>
          {tickets.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">
              No tickets from this customer.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {tickets.map((t) => (
                <li key={t.id}>
                  <Link
                    to="/tickets/$ticketId"
                    params={{ ticketId: t.id }}
                    className="block p-4 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs text-primary">{t.id}</span>
                      <StatusBadge status={t.status} />
                    </div>
                    <div className="mt-1 truncate text-sm font-medium">{t.subject}</div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <CategoryBadge category={t.category} />
                      <PriorityBadge priority={t.priority} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}
