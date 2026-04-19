import { createFileRoute } from "@tanstack/react-router";
import {
  Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis, Legend, Line, LineChart,
} from "recharts";
import { TrendingUp, AlertCircle } from "lucide-react";
import { Topbar } from "@/components/Topbar";
import {
  ticketsByCategory, ticketsByPriority, peakHours, trendingIssues,
} from "@/lib/mock-data";

export const Route = createFileRoute("/_app/insights")({
  head: () => ({ meta: [{ title: "Insights — Helpdesk Operations" }] }),
  component: InsightsPage,
});

const PRIORITY_COLORS: Record<string, string> = {
  urgent: "var(--color-destructive)",
  high:   "var(--color-warning)",
  medium: "var(--color-info)",
  low:    "var(--color-muted-foreground)",
};
const CATEGORY_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

const tooltipStyle = {
  background: "var(--color-popover)",
  border: "1px solid var(--color-border)",
  borderRadius: 6,
  fontSize: 12,
};

function InsightsPage() {
  return (
    <>
      <Topbar title="Insights" subtitle="Trends, distribution and recurring problems" />
      <main className="flex-1 space-y-4 p-6">
        <div className="grid gap-4 lg:grid-cols-3">
          <Panel title="Tickets by category" subtitle="Last 30 days" className="lg:col-span-2">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ticketsByCategory} margin={{ left: -10, right: 8, top: 10 }}>
                  <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--color-muted)", opacity: 0.4 }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {ticketsByCategory.map((_, i) => (
                      <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Tickets by priority" subtitle="Distribution today">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                  />
                  <Pie
                    data={ticketsByPriority}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={2}
                  >
                    {ticketsByPriority.map((p, i) => (
                      <Cell key={i} fill={PRIORITY_COLORS[p.name]} stroke="var(--color-card)" strokeWidth={2} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <Panel title="Peak ticket hours" subtitle="When customers reach out most (24h, local time)">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={peakHours} margin={{ left: -10, right: 8, top: 10 }}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="hour" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="tickets"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "var(--color-primary)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel
          title="Trending issues"
          subtitle="Topics with the largest week-over-week increase"
          icon={<TrendingUp className="h-3.5 w-3.5 text-primary" />}
        >
          <ul className="divide-y divide-border">
            {trendingIssues.map((t) => (
              <li key={t.topic} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                    t.severity === "high"
                      ? "bg-destructive/15 text-destructive"
                      : t.severity === "medium"
                        ? "bg-warning/15 text-warning"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium">{t.topic}</div>
                  <div className="text-[11px] text-muted-foreground">{t.note}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold tabular-nums">{t.tickets}</div>
                  <div className={`text-[11px] tabular-nums ${t.change > 100 ? "text-destructive" : "text-warning"}`}>
                    +{t.change}%
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </main>
    </>
  );
}

function Panel({
  title,
  subtitle,
  icon,
  className = "",
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-lg border border-border bg-card p-5 ${className}`}>
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <div>
          <h2 className="text-sm font-semibold">{title}</h2>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}
