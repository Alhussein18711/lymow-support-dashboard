import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, BookOpen, Eye, Calendar } from "lucide-react";
import { Topbar } from "@/components/Topbar";
import { Input } from "@/components/ui/input";
import { getArticles, type Article } from "@/lib/mock-data";
import { format } from "date-fns";

export const Route = createFileRoute("/_app/knowledge")({
  head: () => ({ meta: [{ title: "Knowledge Base — Helpdesk" }] }),
  component: KnowledgePage,
});

const categories: ("All" | Article["category"])[] = ["All", "Getting Started", "Troubleshooting", "Billing", "Account"];

const catColor: Record<Article["category"], string> = {
  "Getting Started": "text-chart-1 bg-chart-1/10 ring-chart-1/30",
  Troubleshooting:   "text-chart-4 bg-chart-4/10 ring-chart-4/30",
  Billing:           "text-chart-2 bg-chart-2/10 ring-chart-2/30",
  Account:           "text-chart-3 bg-chart-3/10 ring-chart-3/30",
};

function KnowledgePage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof categories)[number]>("All");

  const articles = getArticles().filter((a) => {
    if (cat !== "All" && a.category !== cat) return false;
    if (q && !`${a.title} ${a.excerpt}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <Topbar title="Knowledge Base" subtitle="Articles, guides and troubleshooting" />
      <main className="flex-1 space-y-5 p-6">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-lg font-semibold tracking-tight">Find the answer in seconds</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Search the entire support library — from onboarding to advanced troubleshooting.
          </p>
          <div className="relative mt-4 max-w-2xl">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search articles..."
              className="h-10 pl-10 text-sm border-border bg-background"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  cat === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card/40 p-16 text-center">
            <BookOpen className="mx-auto h-7 w-7 text-muted-foreground" />
            <div className="mt-3 font-medium">No articles found</div>
            <p className="mt-1 text-sm text-muted-foreground">Try a different search or category.</p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {articles.map((a) => (
              <article
                key={a.id}
                className="group cursor-pointer rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40"
              >
                <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${catColor[a.category]}`}>
                  {a.category}
                </span>
                <h3 className="mt-3 text-[15px] font-semibold group-hover:text-primary transition-colors">
                  {a.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{a.excerpt}</p>
                <div className="mt-3 flex items-center gap-4 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{a.views.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{format(new Date(a.updatedAt), "MMM d, yyyy")}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
