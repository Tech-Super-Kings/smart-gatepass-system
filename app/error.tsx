"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-6">
        <div className="glass-panel max-w-lg rounded-3xl p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-brand)]">
            Something went wrong
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-950">
            We hit a snag while loading Smart GatePass.
          </h1>
          <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">
            Refresh the page or try again. The app is set up with fallback-friendly architecture, so we can recover
            cleanly during demos and development.
          </p>
          <div className="mt-6 flex justify-center">
            <Button onClick={reset}>Try again</Button>
          </div>
        </div>
      </body>
    </html>
  );
}
