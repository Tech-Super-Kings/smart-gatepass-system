import Link from "next/link";
import { Shield } from "lucide-react";

import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 py-4">
      <div className="glass-panel flex items-center justify-between rounded-[1.6rem] px-4 py-3 sm:px-5">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-[1.15rem] bg-slate-950 text-white shadow-[0_12px_30px_rgba(15,23,42,0.16)]">
            <Shield className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-slate-950">Smart GatePass</p>
            <p className="text-xs text-[var(--color-text-muted)]">Fast, secure, contactless visitor operations</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          <Button asChild variant="ghost" size="sm">
            <Link href="/host">Host</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/guest-entry">Guest Entry</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/security">Security</Link>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin">Admin</Link>
          </Button>
        </nav>

        <div className="hidden rounded-full border border-white/70 bg-white/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-brand)] md:block lg:hidden">
          MVP
        </div>
      </div>
    </header>
  );
}
