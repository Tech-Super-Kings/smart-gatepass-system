import { LoadingDots } from "@/components/ui/loading-dots";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="glass-panel rounded-3xl px-8 py-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-brand)]">
          Smart GatePass
        </p>
        <div className="mt-4 flex items-center justify-center gap-3 text-slate-700">
          <LoadingDots />
          <span>Loading experience</span>
        </div>
      </div>
    </div>
  );
}
