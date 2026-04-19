import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  AlertTriangle, ArrowDownRight, ArrowUpRight, CheckCircle2, Clock, Inbox,
  ShieldCheck, Info,
} from "lucide-react";
import { Topbar } from "@/components/Topbar";
import { alerts, stats, ticketsOverTime, getTickets } from "@/lib/mock-data";
import { StatusBadge, PriorityBadge, CategoryBadge } from "@/components/StatusBadge";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Overview — Helpdesk Operations" }] }),
  component: Overview,
});

type MetricKey = "open" | "resolved" | "response" | "sla";

const metrics: { key: MetricKey; label: string; value: string | number; delta: string; good: boolean; icon: typeof Inbox; tip: string }[] = [
  { key: "open",     label: "Open tickets",      value: stats.openTickets,            delta: "+12 vs yesterday", good: false, icon: Inbox,        tip: "All tickets not yet resolved, including pending and in-progress." },
  { key: "resolved", label: "Resolved today",    value: stats.resolvedToday,          delta: "+8% vs yesterday", good: true,  icon: CheckCircle2, tip: "Tickets marked resolved today across all agents." },
  { key: "response", label: "Avg response time", value: stats.avgResponse,            delta: "−14m vs avg",      good: true,  icon: Clock,        tip: "Average time to first agent response on tickets opened in the last 7d." },
  { key: "sla",      label: "SLA compliance",    value: `${stats.slaCompliance}%`,    delta: `${stats.slaBreaches} breaches`, good: stats.slaCompliance >= 90, icon: ShieldCheck, tip: "Percent of tickets where first response met the contractual SLA." },
];

function Overview() {
  const [drill, setDrill] = useState<MetricKey | null>(null);
  const tickets = getTickets();

  const drillTickets =
    drill === "open"     ? tickets.filter((t) => t.status !== "resolved") :
    drill === "resolved" ? tickets.filter((t) => t.status === "resolved") :
    drill === "response" ? tickets.filter((t) => (t.firstResponseMinutes ?? 0) > 60) :
    drill === "sla"      ? tickets.filter((t) => t.slaBreached) :
    [];

  const drillTitle =
    drill === "open"     ? "Open tickets"           :
    drill === "resolved" ? "Resolved tickets"       :
    drill === "response" ? "Slow first responses"   :
    drill === "sla"      ? "SLA breaches"           : "";

  return (
    <TooltipProvider delayDuration={150}>
      <Topbar title="Overview" subtitle="Live operational view across the team" />
      <main className="flex-1 space-y-5 p-6">
        {/* KPIs */}
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.key}
                onClick={() => setDrill(m.key)}
                className="group text-left rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-card/80"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                    {m.label}
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-xs">
                        {m.tip}
                      </TooltipContent>
                    </UITooltip>
                  </div>
                  <Icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
                </div>
                <div className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">
                  {m.value}
                </div>
                <div className="mt-1 flex items-center gap-1 text-[11px]">
                  {m.good ? (
                    <ArrowDownRight className="h-3 w-3 text-success" />
                  ) : (
                    <ArrowUpRight className="h-3 w-3 text-destructive" />
                  )}
                  <span className={m.good ? "text-success" : "text-destructive"}>{m.delta}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Trend + Alerts */}
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-lg border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold">Ticket volume — last 7 days</h2>
                <p className="text-xs text-muted-foreground">Opened vs resolved</p>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <Legend dot="bg-chart-1" label="Opened" />
                <Legend dot="bg-chart-2" label="Resolved" />
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ticketsOverTime} margin={{ left: -20, right: 8, top: 8 }}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                  />
                  <Area type="monotone" dataKey="opened"   stroke="var(--color-chart-1)" strokeWidth={2} fill="url(#g1)" />
                  <Area type="monotone" dataKey="resolved" stroke="var(--color-chart-2)" strokeWidth={2} fill="url(#g2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border p-4">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                Operational alerts
              </h2>
              <p className="text-xs text-muted-foreground">SLA, backlog & performance</p>
            </div>
            <ul className="divide-y divide-border">
              {alerts.map((a) => (
                <li key={a.id} className="flex gap-3 p-3.5">
                  <div
                    className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                      a.severity === "high"
                        ? "bg-destructive"
                        : a.severity === "medium"
                          ? "bg-warning"
                          : "bg-muted-foreground"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium">{a.title}</div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{a.description}</p>
                    <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                      {a.time}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recent activity */}
        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <div>
              <h2 className="text-sm font-semibold">Recent activity</h2>
              <p className="text-xs text-muted-foreground">Latest ticket updates</p>
            </div>
            <Link to="/tickets" className="text-xs font-medium text-primary hover:underline">
              View all tickets →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-2.5 font-medium">Ticket</th>
                  <th className="px-4 py-2.5 font-medium">Customer</th>
                  <th className="px-4 py-2.5 font-medium">Category</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 font-medium">Priority</th>
                  <th className="px-4 py-2.5 font-medium">Agent</th>
                </tr>
              </thead>
              <tbody>
                {tickets.slice(0, 6).map((t) => (
                  <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                    <td className="px-4 py-2.5">
                      <Link
                        to="/tickets/$ticketId"
                        params={{ ticketId: t.id }}
                        className="font-mono text-xs text-primary hover:underline"
                      >
                        {t.id}
                      </Link>
                      <div className="mt-0.5 max-w-xs truncate text-xs text-muted-foreground">
                        {t.subject}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-[13px]">{t.customerName}</td>
                    <td className="px-4 py-2.5"><CategoryBadge category={t.category} /></td>
                    <td className="px-4 py-2.5"><StatusBadge status={t.status} /></td>
                    <td className="px-4 py-2.5"><PriorityBadge priority={t.priority} /></td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{t.assignedAgentName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Drill-down side panel */}
      <Sheet open={drill !== null} onOpenChange={(o) => !o && setDrill(null)}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{drillTitle}</SheetTitle>
            <SheetDescription>
              {drillTickets.length} ticket{drillTickets.length === 1 ? "" : "s"} match this metric.
            </SheetDescription>
          </SheetHeader>
          <ul className="mt-6 space-y-2">
            {drillTickets.map((t) => (
              <li key={t.id}>
                <Link
                  to="/tickets/$ticketId"
                  params={{ ticketId: t.id }}
                  className="block rounded-md border border-border bg-card p-3 hover:border-primary/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-primary">{t.id}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(t.updatedAt), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="mt-1 truncate text-sm font-medium">{t.subject}</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <StatusBadge status={t.status} />
                    <PriorityBadge priority={t.priority} />
                    <CategoryBadge category={t.category} />
                  </div>
                </Link>
              </li>
            ))}
            {drillTickets.length === 0 && (
              <li className="rounded-md border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
                Nothing here. Good news.
              </li>
            )}
          </ul>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-muted-foreground">
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
