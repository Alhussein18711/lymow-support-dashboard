import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft, CheckCircle2, AlertTriangle, Send, Building2, Mail, User, Clock, ShieldCheck,
} from "lucide-react";
import { Topbar } from "@/components/Topbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getTicket, getCustomer, type Ticket, type Customer } from "@/lib/mock-data";
import { StatusBadge, PriorityBadge, CategoryBadge } from "@/components/StatusBadge";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_app/tickets/$ticketId")({
  loader: ({ params }) => {
    const ticket = getTicket(params.ticketId);
    if (!ticket) throw notFound();
    return { ticket, customer: getCustomer(ticket.customerId)! };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.ticket.id} — Helpdesk` }],
  }),
  notFoundComponent: () => (
    <main className="flex flex-1 items-center justify-center p-12">
      <div className="text-center">
        <div className="text-lg font-semibold">Ticket not found</div>
        <Link to="/tickets" className="mt-3 inline-block text-sm text-primary hover:underline">
          Back to tickets
        </Link>
      </div>
    </main>
  ),
  errorComponent: ({ error }) => (
    <main className="flex flex-1 items-center justify-center p-12">
      <div className="text-center text-sm text-destructive">{error.message}</div>
    </main>
  ),
  component: TicketDetail,
});

function TicketDetail() {
  const { ticket, customer } = Route.useLoaderData() as { ticket: Ticket; customer: Customer };
  const [reply, setReply] = useState("");

  return (
    <>
      <Topbar title={ticket.subject} subtitle={`${ticket.id} · ${ticket.channel}`} />
      <main className="flex-1 p-6">
        <div className="mb-4">
          <Link to="/tickets" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3 w-3" /> Back to tickets
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={ticket.status} />
                <PriorityBadge priority={ticket.priority} />
                <CategoryBadge category={ticket.category} />
                {ticket.slaBreached && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-destructive/15 px-2 py-0.5 text-[11px] font-medium text-destructive ring-1 ring-inset ring-destructive/30">
                    <AlertTriangle className="h-3 w-3" /> SLA breached
                  </span>
                )}
                <span className="ml-auto text-xs text-muted-foreground">
                  Opened {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card">
              <div className="border-b border-border p-4">
                <h2 className="text-sm font-semibold">Conversation</h2>
              </div>
              <div className="space-y-4 p-5">
                {ticket.messages.map((m) => (
                  <div key={m.id} className={`flex gap-3 ${m.from === "agent" ? "flex-row-reverse" : ""}`}>
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
                        m.from === "agent" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                      }`}
                    >
                      {m.author.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className={`max-w-[75%] ${m.from === "agent" ? "text-right" : ""}`}>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="font-medium text-foreground">{m.author}</span>
                        <span>·</span>
                        <span>{formatDistanceToNow(new Date(m.timestamp), { addSuffix: true })}</span>
                      </div>
                      <div
                        className={`mt-1.5 rounded-lg px-3.5 py-2.5 text-sm ${
                          m.from === "agent"
                            ? "bg-primary text-primary-foreground rounded-tr-sm"
                            : "bg-muted text-foreground rounded-tl-sm"
                        }`}
                      >
                        {m.body}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border p-4">
                <Textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Write your reply..."
                  className="min-h-[100px] resize-none border-border bg-background"
                />
                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-success" />
                      Mark resolved
                    </Button>
                    <Button variant="outline" size="sm">
                      <AlertTriangle className="mr-1.5 h-3.5 w-3.5 text-warning" />
                      Escalate
                    </Button>
                  </div>
                  <Button size="sm">
                    <Send className="mr-1.5 h-3.5 w-3.5" />
                    Send reply
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">Customer</h3>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                  {customer.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium">{customer.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{customer.email}</div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Row icon={Building2} label="Company" value={customer.company} />
                <Row icon={Mail}      label="Plan"    value={customer.plan} />
                <Row icon={User}      label="Tickets" value={`${customer.totalTickets} total · ${customer.openTickets} open`} />
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">SLA</h3>
              <div className="space-y-2">
                <Row icon={ShieldCheck} label="Target"    value={`${ticket.slaMinutes}m to first reply`} />
                <Row
                  icon={Clock}
                  label="Actual"
                  value={
                    ticket.firstResponseMinutes !== null
                      ? `${ticket.firstResponseMinutes}m`
                      : "Not yet responded"
                  }
                />
                <Row icon={User} label="Assigned" value={ticket.assignedAgentName} />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

function Row({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="ml-auto text-xs font-medium">{value}</span>
    </div>
  );
}
