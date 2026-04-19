import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Send, Bot, User as UserIcon, Loader2 } from "lucide-react";
import { Topbar } from "@/components/Topbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_app/assistant")({
  head: () => ({ meta: [{ title: "AI Assistant — Helpdesk" }] }),
  component: AssistantPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const seed: Msg[] = [
  {
    role: "assistant",
    content:
      "Hey Elena — I'm your ops copilot. Ask about agent performance, ticket trends, SLA risk, or get a draft reply for any open ticket.",
  },
];

const quickPrompts = [
  "Why is the Technical queue slow today?",
  "Suggest a reply for ticket TCK-2901",
  "Summarize the top 3 issues this week",
  "Which agents are at risk of missing SLA?",
];

const canned: Record<string, string> = {
  "Why is the Technical queue slow today?":
    "**Bottleneck:** Tier 2 Technical has 3 agents handling 41 active tickets — 38% above capacity. Diego Alvarez is the slowest (avg 92m response, ~2× team avg). **Suggested action:** temporarily reroute new SSO/webhook tickets to Aisha Bello (avg 31m, 98% SLA).",
  "Suggest a reply for ticket TCK-2901":
    "**Draft reply:**\n\nHi Marcus — sorry about the export issue. We just shipped a fix on the Reports service that resolves the PDF generation timeout for invoices > 50 line items. Could you try the export again and let me know? If it still fails, please share the invoice ID and I'll generate it manually within the hour.",
  "Summarize the top 3 issues this week":
    "**This week's hotspots:**\n\n1. **SSO redirect loops** — 27 tickets, +320% wow. Affects Okta v3 customers.\n2. **Webhook 500 errors** — 18 tickets, +140%. 3 enterprise accounts impacted.\n3. **PDF invoice export** — 14 tickets, +85%. Started after Tuesday's deploy.",
  "Which agents are at risk of missing SLA?":
    "**At risk:** Tom Becker (72% SLA, 118m avg response) and Diego Alvarez (78% SLA). **Recommended:** pair Tom with Sara for shadow this week, and offload Diego's queue by ~30%.",
};

function AssistantPage() {
  const [messages, setMessages] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((p) => [...p, { role: "user", content: text }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      const reply =
        canned[text] ??
        "Here's what I'd suggest: cross-check the queue's current load against its capacity, then look at first-response distribution by agent. Want me to draft a reroute plan or pull the SLA-risk list?";
      setMessages((p) => [...p, { role: "assistant", content: reply }]);
      setThinking(false);
    }, 700);
  };

  return (
    <>
      <Topbar title="AI Assistant" subtitle="Trained on your knowledge base & ticket history" />
      <main className="flex flex-1 flex-col p-6">
        <div className="flex flex-1 flex-col rounded-lg border border-border bg-card overflow-hidden">
          <div className="flex items-center gap-3 border-b border-border bg-card/60 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <div className="text-sm font-semibold">Ops Copilot</div>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                Online
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                    m.role === "user" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"
                  }`}
                >
                  {m.role === "user" ? <UserIcon className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                </div>
                <div
                  className={`max-w-[80%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-muted text-foreground rounded-tl-sm"
                  }`}
                >
                  {m.content.split("**").map((part, idx) =>
                    idx % 2 === 1 ? <strong key={idx}>{part}</strong> : part,
                  )}
                </div>
              </div>
            ))}
            {thinking && (
              <div className="flex gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="rounded-lg bg-muted px-3.5 py-2.5 text-sm text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" /> Thinking...
                </div>
              </div>
            )}
          </div>

          {messages.length <= 1 && (
            <div className="border-t border-border px-4 py-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                Try asking
              </div>
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="rounded-md border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-border p-3">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder="Ask about tickets, agents or SLA..."
                className="min-h-[44px] max-h-32 resize-none border-border bg-background"
              />
              <Button onClick={() => send(input)} disabled={!input.trim() || thinking} className="self-end h-[44px]">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
