import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Headphones, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Helpdesk Operations" },
      { name: "description", content: "Manager sign in for the Helpdesk Operations dashboard." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("elena@helpdesk.io");
  const [password, setPassword] = useState("••••••••");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("lymow_auth", "1");
      navigate({ to: "/dashboard" });
    }, 500);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <div className="relative w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Headphones className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <div className="text-base font-semibold tracking-tight">Helpdesk</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Operations
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-7">
          <h1 className="text-xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to your team leader dashboard.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">Work email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-9" />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs">Password</Label>
                <a className="text-xs text-primary hover:underline" href="#">Forgot?</a>
              </div>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="h-9" />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</>
              ) : (
                "Sign in to dashboard"
              )}
            </Button>
          </form>

          <div className="mt-5 border-t border-border pt-3 text-center text-xs text-muted-foreground">
            Demo mode — use any credentials to enter
          </div>
        </div>
      </div>
    </div>
  );
}
