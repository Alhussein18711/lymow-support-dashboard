import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, User, LogOut, Users } from "lucide-react";
import { Topbar } from "@/components/Topbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — Helpdesk Operations" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"profile" | "notifications" | "team">("profile");

  const logout = () => {
    localStorage.removeItem("lymow_auth");
    navigate({ to: "/login" });
  };

  return (
    <>
      <Topbar title="Settings" subtitle="Manage your profile, notifications, and team" />
      <main className="flex-1 p-6">
        <div className="grid gap-5 lg:grid-cols-[200px_1fr]">
          <nav className="flex flex-row gap-1 lg:flex-col rounded-lg border border-border bg-card p-2 h-fit">
            <TabBtn active={tab === "profile"}       onClick={() => setTab("profile")}       icon={User}>Profile</TabBtn>
            <TabBtn active={tab === "notifications"} onClick={() => setTab("notifications")} icon={Bell}>Notifications</TabBtn>
            <TabBtn active={tab === "team"}          onClick={() => setTab("team")}          icon={Users}>Team</TabBtn>
          </nav>

          <div className="space-y-4">
            {tab === "profile"       && <ProfileTab />}
            {tab === "notifications" && <NotificationsTab />}
            {tab === "team"          && <TeamTab />}

            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold">Sign out</h3>
                  <p className="text-xs text-muted-foreground">End your current session.</p>
                </div>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="mr-1.5 h-3.5 w-3.5" />
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function TabBtn({
  active, onClick, icon: Icon, children,
}: { active: boolean; onClick: () => void; icon: typeof User; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors text-left ${
        active ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className={`h-3.5 w-3.5 ${active ? "text-primary" : ""}`} />
      {children}
    </button>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="text-sm font-semibold">{title}</h3>
      {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

function ProfileTab() {
  return (
    <Section title="Profile" description="How you appear to teammates">
      <div className="flex items-center gap-4 mb-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-base font-semibold text-primary-foreground">
          EC
        </div>
        <Button variant="outline" size="sm">Change avatar</Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="First name"   defaultValue="Elena" />
        <Field label="Last name"    defaultValue="Cruz" />
        <Field label="Email"        defaultValue="elena@helpdesk.io" wide />
        <Field label="Role"         defaultValue="Team Lead" />
        <Field label="Timezone"     defaultValue="Europe/Madrid (UTC+2)" />
      </div>
      <div className="mt-5 flex justify-end">
        <Button size="sm">Save changes</Button>
      </div>
    </Section>
  );
}

function Field({ label, defaultValue, wide }: { label: string; defaultValue: string; wide?: boolean }) {
  return (
    <div className={`space-y-1.5 ${wide ? "sm:col-span-2" : ""}`}>
      <Label className="text-xs">{label}</Label>
      <Input defaultValue={defaultValue} className="h-9 border-border bg-background" />
    </div>
  );
}

function NotificationsTab() {
  const items = [
    { title: "SLA breach alerts",            desc: "Notify me when any ticket breaches SLA.",                 on: true },
    { title: "Backlog threshold",            desc: "Alert when open tickets cross 150.",                      on: true },
    { title: "Slow response warnings",       desc: "Daily flag for agents above 2× the team avg response.",   on: true },
    { title: "Negative CSAT replies",        desc: "Forward CSAT scores ≤ 3 to my inbox immediately.",        on: true },
    { title: "Daily ops digest",             desc: "Summary email each morning at 8am.",                      on: false },
    { title: "Weekly team report",           desc: "Performance recap every Monday.",                         on: true },
  ];
  return (
    <Section title="Notifications" description="Choose what reaches your inbox.">
      <ul className="divide-y divide-border">
        {items.map((i) => (
          <li key={i.title} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
            <div className="flex-1">
              <div className="text-[13px] font-medium">{i.title}</div>
              <div className="text-xs text-muted-foreground">{i.desc}</div>
            </div>
            <Switch defaultChecked={i.on} />
          </li>
        ))}
      </ul>
    </Section>
  );
}

function TeamTab() {
  return (
    <>
      <Section title="Team configuration" description="Routing, SLAs and working hours.">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Team name"               defaultValue="Customer Support — EU" />
          <Field label="Default SLA (minutes)"   defaultValue="60" />
          <Field label="Business hours"          defaultValue="09:00 – 18:00 CET" wide />
          <Field label="Auto-assignment"         defaultValue="Round-robin (skill-weighted)" wide />
        </div>
      </Section>

      <Section title="Escalation rules" description="When a ticket should be escalated automatically.">
        <ul className="divide-y divide-border text-[13px]">
          <li className="flex items-center justify-between py-3 first:pt-0">
            <span>Urgent ticket unanswered for 30m</span>
            <Switch defaultChecked />
          </li>
          <li className="flex items-center justify-between py-3">
            <span>Customer reply with negative sentiment</span>
            <Switch defaultChecked />
          </li>
          <li className="flex items-center justify-between py-3 last:pb-0">
            <span>SLA breached on Enterprise account</span>
            <Switch defaultChecked />
          </li>
        </ul>
      </Section>
    </>
  );
}
