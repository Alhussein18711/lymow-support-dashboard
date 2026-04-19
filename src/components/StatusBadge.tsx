import { cn } from "@/lib/utils";
import type { TicketPriority, TicketStatus, TicketCategory } from "@/lib/mock-data";

const statusStyles: Record<TicketStatus, string> = {
  open:        "bg-info/15 text-info ring-info/30",
  in_progress: "bg-warning/15 text-warning ring-warning/30",
  pending:     "bg-muted text-muted-foreground ring-border",
  resolved:    "bg-success/15 text-success ring-success/30",
};

const statusLabel: Record<TicketStatus, string> = {
  open:        "Open",
  in_progress: "In Progress",
  pending:     "Pending",
  resolved:    "Resolved",
};

const statusDot: Record<TicketStatus, string> = {
  open:        "bg-info",
  in_progress: "bg-warning",
  pending:     "bg-muted-foreground",
  resolved:    "bg-success",
};

const priorityStyles: Record<TicketPriority, string> = {
  low:    "bg-muted text-muted-foreground ring-border",
  medium: "bg-info/15 text-info ring-info/30",
  high:   "bg-warning/15 text-warning ring-warning/30",
  urgent: "bg-destructive/15 text-destructive ring-destructive/30",
};

const categoryStyles: Record<TicketCategory, string> = {
  Technical:         "bg-chart-1/15 text-chart-1 ring-chart-1/30",
  Billing:           "bg-chart-2/15 text-chart-2 ring-chart-2/30",
  Account:           "bg-chart-3/15 text-chart-3 ring-chart-3/30",
  General:           "bg-muted text-muted-foreground ring-border",
  "Feature Request": "bg-chart-5/15 text-chart-5 ring-chart-5/30",
};

const base =
  "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset whitespace-nowrap";

export function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span className={cn(base, statusStyles[status])}>
      <span className={cn("h-1.5 w-1.5 rounded-full", statusDot[status])} />
      {statusLabel[status]}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return (
    <span className={cn(base, priorityStyles[priority])}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}

export function CategoryBadge({ category }: { category: TicketCategory }) {
  return <span className={cn(base, categoryStyles[category])}>{category}</span>;
}
