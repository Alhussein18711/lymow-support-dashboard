import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Filter, Clock } from "lucide-react";
import { Topbar } from "@/components/Topbar";
import { Input } from "@/components/ui/input";
import { getTickets, getAgents, type TicketStatus, type TicketPriority } from "@/lib/mock-data";
import { StatusBadge, PriorityBadge, CategoryBadge } from "@/components/StatusBadge";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_app/tickets/")({
  head: () => ({ meta: [{ title: "Tickets — Helpdesk Operations" }] }),
  component: TicketsPage,
});

const statuses: TicketStatus[] = ["open", "in_progress", "pending", "resolved"];
const priorities: TicketPriority[] = ["urgent", "high", "medium", "low"];

function TicketsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<TicketStatus | "all">("all");
  const [priority, setPriority] = useState<TicketPriority | "all">("all");
  const [agentId, setAgentId] = useState<string>("all");

  const agents = getAgents();
  const all = getTickets();
  const filtered = all.filter((t) => {
    if (status !== "all" && t.status !== status) return false;
    if (priority !== "all" && t.priority !== priority) return false;
    if (agentId !== "all" && t.assignedAgentId !== agentId) return false;
    if (q && !`${t.id} ${t.subject} ${t.customerName} ${t.assignedAgentName}`.toLowerCase().includes(q.toLowerCase()))
      return false;
    return true;
  });

  const breaching = all.filter((t) => t.slaBreached).length;

  return (
    <>
      <Topbar
        title="Tickets"
        subtitle={`${all.length} total · ${all.filter((t) => t.status !== "resolved").length} open · ${breaching} SLA breaches`}
      />
      <main className="flex-1 space-y-3 p-6">
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by ID, subject, customer, or agent..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="h-9 pl-9 border-border bg-background"
            />
          </div>

          <div className="flex items-center gap-1 text-xs">
            <Filter className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
            <Pill label="All" active={status === "all"} onClick={() => setStatus("all")} />
            {statuses.map((s) => (
              <Pill
                key={s}
                label={s === "in_progress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1)}
                active={status === s}
                onClick={() => setStatus(s)}
              />
            ))}
          </div>

          <div className="flex items-center gap-1 text-xs">
            <Pill label="Any priority" active={priority === "all"} onClick={() => setPriority("all")} />
            {priorities.map((p) => (
              <Pill
                key={p}
                label={p.charAt(0).toUpperCase() + p.slice(1)}
                active={priority === p}
                onClick={() => setPriority(p)}
              />
            ))}
          </div>

          <select
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
            className="h-8 rounded-md border border-border bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="all">All agents</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Ticket</th>
                <th className="px-4 py-2.5 font-medium">Customer</th>
                <th className="px-4 py-2.5 font-medium">Category</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Priority</th>
                <th className="px-4 py-2.5 font-medium">Agent</th>
                <th className="px-4 py-2.5 font-medium">Last update</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-sm text-muted-foreground">
                    No tickets match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr
                    key={t.id}
                    className={`group border-b border-border last:border-0 transition-colors hover:bg-muted/40 ${
                      t.slaBreached ? "bg-destructive/[0.04]" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <Link
                        to="/tickets/$ticketId"
                        params={{ ticketId: t.id }}
                        className="block"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[11px] text-primary group-hover:underline">{t.id}</span>
                          {t.slaBreached && (
                            <span className="inline-flex items-center gap-1 rounded bg-destructive/15 px-1.5 py-0 text-[10px] font-medium text-destructive ring-1 ring-inset ring-destructive/30">
                              SLA
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 max-w-md truncate text-[13px] font-medium text-foreground">
                          {t.subject}
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[13px]">{t.customerName}</td>
                    <td className="px-4 py-3"><CategoryBadge category={t.category} /></td>
                    <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                    <td className="px-4 py-3"><PriorityBadge priority={t.priority} /></td>
                    <td className="px-4 py-3 text-[12px] text-muted-foreground">{t.assignedAgentName}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(t.updatedAt), { addSuffix: true })}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}

function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
        active
          ? "bg-primary/15 text-primary ring-1 ring-inset ring-primary/30"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      }`}
    >
      {label}
    </button>
  );
}
