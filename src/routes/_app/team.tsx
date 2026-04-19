import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Star, AlertTriangle, Info } from "lucide-react";
import { Topbar } from "@/components/Topbar";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getAgents, getTickets, type Agent } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/team")({
  head: () => ({ meta: [{ title: "Team Performance — Helpdesk Operations" }] }),
  component: TeamPage,
});

function fmtMin(min: number) {
  return min >= 60 ? `${Math.floor(min / 60)}h ${min % 60}m` : `${min}m`;
}

function TeamPage() {
  const [q, setQ] = useState("");
  const [drill, setDrill] = useState<Agent | null>(null);
  const agents = getAgents().filter((a) =>
    `${a.name} ${a.team} ${a.role}`.toLowerCase().includes(q.toLowerCase()),
  );

  const sortedByCsat = [...agents].sort((a, b) => b.csat - a.csat);
  const top = sortedByCsat.slice(0, 1).map((a) => a.id);
  const bottom = [...agents]
    .filter((a) => a.slaCompliance < 80 || a.csat < 4.2)
    .map((a) => a.id);

  const drillTickets = drill
    ? getTickets().filter((t) => t.assignedAgentId === drill.id)
    : [];

  return (
    <TooltipProvider delayDuration={150}>
      <Topbar title="Team Performance" subtitle={`${agents.length} agents · weekly view`} />
      <main className="flex-1 space-y-4 p-6">
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, team, or role..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9 border-border bg-background h-9"
            />
          </div>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5"><Star className="h-3 w-3 text-success" /> Top performer</span>
            <span className="flex items-center gap-1.5"><AlertTriangle className="h-3 w-3 text-destructive" /> Needs attention</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Agent</th>
                <th className="px-4 py-2.5 font-medium">Team</th>
                <th className="px-4 py-2.5 font-medium text-right">Active</th>
                <th className="px-4 py-2.5 font-medium text-right">
                  <span className="inline-flex items-center gap-1">
                    Avg response
                    <UITooltip>
                      <TooltipTrigger asChild><Info className="h-3 w-3 cursor-help" /></TooltipTrigger>
                      <TooltipContent className="text-xs max-w-xs">Mean first-response time across all tickets this week.</TooltipContent>
                    </UITooltip>
                  </span>
                </th>
                <th className="px-4 py-2.5 font-medium text-right">Resolution rate</th>
                <th className="px-4 py-2.5 font-medium text-right">SLA</th>
                <th className="px-4 py-2.5 font-medium text-right">CSAT</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((a) => {
                const isTop = top.includes(a.id);
                const isBottom = bottom.includes(a.id);
                return (
                  <tr
                    key={a.id}
                    onClick={() => setDrill(a)}
                    className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="relative">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-[11px] font-semibold">
                            {a.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full ring-2 ring-card ${
                              a.status === "online" ? "bg-success" : a.status === "away" ? "bg-warning" : "bg-muted-foreground"
                            }`}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 text-[13px] font-medium">
                            {a.name}
                            {isTop && <Star className="h-3 w-3 text-success fill-success" />}
                            {isBottom && <AlertTriangle className="h-3 w-3 text-destructive" />}
                          </div>
                          <div className="text-[11px] text-muted-foreground">{a.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-muted-foreground">{a.team}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{a.activeTickets}</td>
                    <td className={`px-4 py-3 text-right tabular-nums ${a.avgResponseTime > 90 ? "text-destructive" : ""}`}>
                      {fmtMin(a.avgResponseTime)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      <Bar value={a.resolutionRate} />
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      <Bar value={a.slaCompliance} threshold={90} />
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium">{a.csat.toFixed(1)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

      <Sheet open={drill !== null} onOpenChange={(o) => !o && setDrill(null)}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
          {drill && (
            <>
              <SheetHeader>
                <SheetTitle>{drill.name}</SheetTitle>
                <SheetDescription>{drill.role} · {drill.team}</SheetDescription>
              </SheetHeader>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Stat label="Active tickets"   value={String(drill.activeTickets)} />
                <Stat label="Resolved this week" value={String(drill.resolvedThisWeek)} />
                <Stat label="Avg response"     value={fmtMin(drill.avgResponseTime)} />
                <Stat label="Resolution rate"  value={`${drill.resolutionRate}%`} />
                <Stat label="SLA compliance"   value={`${drill.slaCompliance}%`} />
                <Stat label="CSAT"             value={drill.csat.toFixed(1)} />
              </div>
              <h3 className="mt-6 mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                Assigned tickets
              </h3>
              <ul className="space-y-2">
                {drillTickets.map((t) => (
                  <li key={t.id} className="rounded-md border border-border bg-card p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs text-primary">{t.id}</span>
                      <span className="text-[10px] text-muted-foreground">{t.status}</span>
                    </div>
                    <div className="mt-0.5 truncate text-sm">{t.subject}</div>
                  </li>
                ))}
                {drillTickets.length === 0 && (
                  <li className="text-xs text-muted-foreground">No tickets currently assigned.</li>
                )}
              </ul>
            </>
          )}
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
}

function Bar({ value, threshold = 0 }: { value: number; threshold?: number }) {
  const danger = threshold > 0 && value < threshold;
  return (
    <div className="inline-flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full ${danger ? "bg-destructive" : "bg-primary"}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className={`text-[12px] ${danger ? "text-destructive" : ""}`}>{value}%</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-card p-3">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-semibold tabular-nums">{value}</div>
    </div>
  );
}
