import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (typeof window === "undefined") {
      throw redirect({ to: "/login" });
    }
    const authed = localStorage.getItem("lymow_auth") === "1";
    throw redirect({ to: authed ? "/dashboard" : "/login" });
  },
  component: () => null,
});
