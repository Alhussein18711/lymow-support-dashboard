export type TicketStatus = "open" | "in_progress" | "pending" | "resolved";
export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type TicketCategory = "Billing" | "Technical" | "Account" | "Feature Request" | "General";
export type TicketChannel = "email" | "chat" | "phone" | "social";

export interface Message {
  id: string;
  from: "customer" | "agent" | "system";
  author: string;
  body: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  subject: string;
  customerId: string;
  customerName: string;
  category: TicketCategory;
  channel: TicketChannel;
  status: TicketStatus;
  priority: TicketPriority;
  assignedAgentId: string;
  assignedAgentName: string;
  createdAt: string;
  updatedAt: string;
  /** SLA target time-to-first-response in minutes */
  slaMinutes: number;
  /** Actual first-response in minutes (null if not yet responded) */
  firstResponseMinutes: number | null;
  /** true if SLA was breached (or will be) */
  slaBreached: boolean;
  messages: Message[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  plan: "Free" | "Pro" | "Business" | "Enterprise";
  joinedAt: string;
  totalTickets: number;
  openTickets: number;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  role: "Agent" | "Senior Agent" | "Team Lead";
  team: "Tier 1" | "Tier 2" | "Billing" | "Technical";
  status: "online" | "away" | "offline";
  activeTickets: number;
  resolvedThisWeek: number;
  /** minutes */
  avgResponseTime: number;
  /** percent 0-100 */
  resolutionRate: number;
  /** percent 0-100 */
  csat: number;
  /** percent 0-100 */
  slaCompliance: number;
}

export interface Article {
  id: string;
  title: string;
  category: "Getting Started" | "Troubleshooting" | "Billing" | "Account";
  excerpt: string;
  body: string;
  views: number;
  updatedAt: string;
}

const agents: Agent[] = [
  { id: "ag-001", name: "Sara Lin",        email: "sara.lin@helpdesk.io",      role: "Senior Agent", team: "Tier 2",     status: "online",  activeTickets: 14, resolvedThisWeek: 47, avgResponseTime: 38, resolutionRate: 94, csat: 4.8, slaCompliance: 97 },
  { id: "ag-002", name: "Marcus Chen",     email: "marcus.chen@helpdesk.io",   role: "Agent",        team: "Tier 1",     status: "online",  activeTickets: 22, resolvedThisWeek: 61, avgResponseTime: 24, resolutionRate: 89, csat: 4.6, slaCompliance: 95 },
  { id: "ag-003", name: "Priya Raman",     email: "priya@helpdesk.io",         role: "Agent",        team: "Billing",    status: "online",  activeTickets: 9,  resolvedThisWeek: 33, avgResponseTime: 45, resolutionRate: 91, csat: 4.7, slaCompliance: 92 },
  { id: "ag-004", name: "Diego Alvarez",   email: "diego@helpdesk.io",         role: "Agent",        team: "Technical",  status: "away",    activeTickets: 18, resolvedThisWeek: 28, avgResponseTime: 92, resolutionRate: 76, csat: 4.1, slaCompliance: 78 },
  { id: "ag-005", name: "Aisha Bello",     email: "aisha@helpdesk.io",         role: "Senior Agent", team: "Technical",  status: "online",  activeTickets: 11, resolvedThisWeek: 52, avgResponseTime: 31, resolutionRate: 96, csat: 4.9, slaCompliance: 98 },
  { id: "ag-006", name: "Tom Becker",      email: "tom@helpdesk.io",           role: "Agent",        team: "Tier 1",     status: "offline", activeTickets: 7,  resolvedThisWeek: 19, avgResponseTime: 118, resolutionRate: 71, csat: 3.9, slaCompliance: 72 },
  { id: "ag-007", name: "Yuki Tanaka",     email: "yuki@helpdesk.io",          role: "Agent",        team: "Tier 2",     status: "online",  activeTickets: 16, resolvedThisWeek: 41, avgResponseTime: 41, resolutionRate: 88, csat: 4.5, slaCompliance: 91 },
  { id: "ag-008", name: "Elena Cruz",      email: "elena@helpdesk.io",         role: "Team Lead",    team: "Billing",    status: "online",  activeTickets: 5,  resolvedThisWeek: 22, avgResponseTime: 28, resolutionRate: 95, csat: 4.8, slaCompliance: 99 },
];

const customers: Customer[] = [
  { id: "c-001", name: "Marcus Hale",     email: "marcus@hale.co",       company: "Hale Holdings",      plan: "Business",   joinedAt: "2024-03-12", totalTickets: 12, openTickets: 2 },
  { id: "c-002", name: "Sofia Bertelli",  email: "sofia@bertelli.it",    company: "Bertelli Studio",    plan: "Pro",        joinedAt: "2024-09-01", totalTickets: 4,  openTickets: 0 },
  { id: "c-003", name: "Yuki Sato",       email: "yuki.s@greenfields.jp",company: "Greenfields KK",     plan: "Enterprise", joinedAt: "2025-01-22", totalTickets: 18, openTickets: 3 },
  { id: "c-004", name: "David Okonkwo",   email: "d.okonkwo@northbay.uk",company: "NorthBay",           plan: "Pro",        joinedAt: "2024-06-08", totalTickets: 7,  openTickets: 1 },
  { id: "c-005", name: "Priya Nair",      email: "priya@nairgroup.in",   company: "Nair Group",         plan: "Business",   joinedAt: "2025-02-14", totalTickets: 5,  openTickets: 1 },
  { id: "c-006", name: "Elena Cruz",      email: "elena@valle.es",       company: "Valle Imports",      plan: "Free",       joinedAt: "2024-11-30", totalTickets: 3,  openTickets: 1 },
];

function mkTicket(
  i: number,
  subject: string,
  customerIdx: number,
  cat: TicketCategory,
  status: TicketStatus,
  priority: TicketPriority,
  agentIdx: number,
  hoursAgoCreated: number,
  hoursAgoUpdated: number,
  slaMinutes: number,
  firstResponseMinutes: number | null,
): Ticket {
  const c = customers[customerIdx];
  const a = agents[agentIdx];
  const now = Date.now();
  const created = new Date(now - hoursAgoCreated * 3600_000).toISOString();
  const updated = new Date(now - hoursAgoUpdated * 3600_000).toISOString();
  const breached =
    status !== "resolved" &&
    (firstResponseMinutes === null
      ? hoursAgoCreated * 60 > slaMinutes
      : firstResponseMinutes > slaMinutes);
  return {
    id: `TCK-${2900 + i}`,
    subject,
    customerId: c.id,
    customerName: c.name,
    category: cat,
    channel: (["email", "chat", "phone", "social"] as TicketChannel[])[i % 4],
    status,
    priority,
    assignedAgentId: a.id,
    assignedAgentName: a.name,
    createdAt: created,
    updatedAt: updated,
    slaMinutes,
    firstResponseMinutes,
    slaBreached: breached,
    messages: [
      { id: `${i}-m1`, from: "customer", author: c.name, body: subject + " — please help asap.", timestamp: created },
      ...(firstResponseMinutes !== null
        ? [{ id: `${i}-m2`, from: "agent" as const, author: a.name, body: "Thanks for reaching out — looking into this now.", timestamp: new Date(new Date(created).getTime() + firstResponseMinutes * 60_000).toISOString() }]
        : []),
    ],
  };
}

const tickets: Ticket[] = [
  mkTicket(1,  "Cannot export invoice as PDF",                0, "Billing",         "open",        "high",   2, 2,    1,    60,  null),
  mkTicket(2,  "Two-factor reset locked me out",              2, "Account",         "in_progress", "urgent", 4, 4,    0.5,  30,  85),
  mkTicket(3,  "API returns 500 on /v2/orders",               3, "Technical",       "open",        "urgent", 4, 0.6,  0.6,  30,  null),
  mkTicket(4,  "How do I add a teammate?",                    4, "General",         "pending",     "low",    1, 26,   8,    480, 240),
  mkTicket(5,  "Discount code applied incorrectly",           5, "Billing",         "open",        "medium", 2, 5,    3,    60,  120),
  mkTicket(6,  "Webhook signature verification failing",      3, "Technical",       "in_progress", "high",   4, 12,   2,    60,  55),
  mkTicket(7,  "Annual plan upgrade question",                1, "Billing",         "resolved",    "low",    7, 50,   30,   240, 90),
  mkTicket(8,  "SSO redirect loop with Okta",                 0, "Technical",       "open",        "high",   3, 18,   18,   60,  null),
  mkTicket(9,  "Refund for duplicate charge",                 5, "Billing",         "in_progress", "medium", 2, 8,    1,    120, 75),
  mkTicket(10, "Mobile app crashes on iOS 17",                2, "Technical",       "open",        "high",   4, 3,    3,    60,  null),
  mkTicket(11, "Request: dark mode for dashboard",            4, "Feature Request", "pending",     "low",    0, 96,   72,   1440,720),
  mkTicket(12, "Email notifications not arriving",            3, "Technical",       "in_progress", "medium", 6, 14,   4,    120, 95),
  mkTicket(13, "Need GDPR data export",                       1, "Account",         "open",        "medium", 7, 6,    2,    240, 180),
  mkTicket(14, "Wrong tax region on invoice",                 0, "Billing",         "open",        "high",   2, 3,    0.5,  60,  45),
  mkTicket(15, "Bulk import CSV failing silently",            3, "Technical",       "in_progress", "high",   4, 22,   6,    60,  150),
  mkTicket(16, "Update billing email",                        5, "Account",         "resolved",    "low",    7, 72,   60,   480, 30),
  mkTicket(17, "Performance slow on Reports page",            2, "Technical",       "open",        "medium", 3, 4,    1,    120, null),
  mkTicket(18, "Cancel subscription request",                 4, "Billing",         "in_progress", "medium", 7, 16,   2,    240, 60),
];

const articles: Article[] = [
  { id: "a-1", title: "Setting up SSO with Okta",                   category: "Getting Started", excerpt: "Step-by-step SAML setup.",                       body: "1) In Okta admin, create a new SAML app...", views: 12_840, updatedAt: "2025-03-20" },
  { id: "a-2", title: "Understanding webhook signatures",           category: "Troubleshooting", excerpt: "How to verify HMAC signatures correctly.",       body: "We sign every webhook with HMAC SHA-256...",  views: 8_421,  updatedAt: "2025-04-02" },
  { id: "a-3", title: "Updating your billing details",              category: "Billing",         excerpt: "Change card, address, and tax ID.",              body: "Go to Settings → Billing...",                  views: 6_300,  updatedAt: "2025-02-18" },
  { id: "a-4", title: "Resetting two-factor authentication",        category: "Account",         excerpt: "Lost your authenticator? Recover here.",         body: "Use a backup code or contact support...",      views: 4_120,  updatedAt: "2025-04-10" },
  { id: "a-5", title: "Inviting and managing teammates",            category: "Getting Started", excerpt: "Roles, seats, and SSO provisioning.",            body: "Open Settings → Team...",                      views: 5_980,  updatedAt: "2025-03-30" },
  { id: "a-6", title: "Common API errors and how to fix them",      category: "Troubleshooting", excerpt: "401, 422, 500 — what each one means.",           body: "401 = bad token. 422 = invalid payload...",    views: 3_210,  updatedAt: "2025-03-12" },
];

// ----------- Aggregates / charts -----------

export const ticketsOverTime = [
  { day: "Mon", opened: 142, resolved: 138, backlog: 32 },
  { day: "Tue", opened: 161, resolved: 144, backlog: 49 },
  { day: "Wed", opened: 138, resolved: 151, backlog: 36 },
  { day: "Thu", opened: 184, resolved: 162, backlog: 58 },
  { day: "Fri", opened: 192, resolved: 168, backlog: 82 },
  { day: "Sat", opened: 71,  resolved: 95,  backlog: 58 },
  { day: "Sun", opened: 58,  resolved: 80,  backlog: 36 },
];

export const ticketsByCategory: { name: TicketCategory; value: number }[] = [
  { name: "Technical",       value: 184 },
  { name: "Billing",         value: 132 },
  { name: "Account",         value: 71  },
  { name: "General",         value: 48  },
  { name: "Feature Request", value: 27  },
];

export const ticketsByPriority: { name: TicketPriority; value: number }[] = [
  { name: "urgent", value: 24  },
  { name: "high",   value: 96  },
  { name: "medium", value: 198 },
  { name: "low",    value: 144 },
];

export const peakHours = [
  { hour: "00", tickets: 4  }, { hour: "02", tickets: 3  },
  { hour: "04", tickets: 2  }, { hour: "06", tickets: 6  },
  { hour: "08", tickets: 22 }, { hour: "09", tickets: 41 },
  { hour: "10", tickets: 58 }, { hour: "11", tickets: 64 },
  { hour: "12", tickets: 49 }, { hour: "13", tickets: 52 },
  { hour: "14", tickets: 71 }, { hour: "15", tickets: 68 },
  { hour: "16", tickets: 54 }, { hour: "17", tickets: 38 },
  { hour: "18", tickets: 22 }, { hour: "20", tickets: 14 },
  { hour: "22", tickets: 8  },
];

export const trendingIssues = [
  { topic: "SSO redirect loops",       tickets: 27, change: +320, severity: "high" as const,   note: "Spike after Okta v3 rollout" },
  { topic: "Webhook 500 errors",       tickets: 18, change: +140, severity: "high" as const,   note: "Affecting 3 enterprise customers" },
  { topic: "PDF invoice export",       tickets: 14, change: +85,  severity: "medium" as const, note: "Started after Tuesday deploy" },
  { topic: "Mobile app crashes (iOS)", tickets: 11, change: +60,  severity: "medium" as const, note: "Pending v4.2.1 patch" },
  { topic: "GDPR export delays",       tickets: 6,  change: +20,  severity: "low" as const,    note: "Queue backlog — within SLA" },
];

export const alerts = [
  { id: "al-1", severity: "high"   as const, title: "12 tickets breaching SLA",            description: "Avg overdue 38m. Mostly Technical / Tier 2.", time: "8 min ago",  type: "sla" },
  { id: "al-2", severity: "high"   as const, title: "Backlog up 64% vs yesterday",         description: "Open tickets crossed 180. Tier 1 capacity is the bottleneck.", time: "32 min ago", type: "backlog" },
  { id: "al-3", severity: "medium" as const, title: "Slow first-response on Tom Becker",   description: "Avg 118m today vs team avg 42m. Consider load-balancing.",       time: "1 hr ago",   type: "agent" },
  { id: "al-4", severity: "low"    as const, title: "CSAT dipped on Billing queue",        description: "4.4 today vs 4.7 weekly. 2 negative replies need follow-up.",     time: "3 hr ago",   type: "csat" },
];

// ----------- Public API -----------

export const getTickets = () => tickets;
export const getTicket = (id: string) => tickets.find((t) => t.id === id);
export const getCustomers = () => customers;
export const getCustomer = (id: string) => customers.find((c) => c.id === id);
export const getAgents = () => agents;
export const getAgent = (id: string) => agents.find((a) => a.id === id);
export const getArticles = () => articles;

const openTickets   = tickets.filter((t) => t.status !== "resolved");
const slaCompliant  = tickets.filter((t) => !t.slaBreached);
const slaCompPct    = Math.round((slaCompliant.length / tickets.length) * 100);
const avgResp       = Math.round(
  tickets
    .filter((t) => t.firstResponseMinutes !== null)
    .reduce((s, t) => s + (t.firstResponseMinutes ?? 0), 0) /
    tickets.filter((t) => t.firstResponseMinutes !== null).length,
);

export const stats = {
  openTickets:    openTickets.length,
  resolvedToday:  47,
  avgResponseMin: avgResp,
  avgResponse:    avgResp >= 60 ? `${Math.floor(avgResp / 60)}h ${avgResp % 60}m` : `${avgResp}m`,
  slaCompliance:  slaCompPct,
  slaBreaches:    tickets.filter((t) => t.slaBreached).length,
  urgent:         tickets.filter((t) => t.priority === "urgent" && t.status !== "resolved").length,
};
