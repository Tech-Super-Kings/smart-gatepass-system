import { cn } from "@/lib/utils";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200/90 shadow-[0_8px_18px_rgba(245,158,11,0.12)]",
  approved: "bg-teal-50 text-teal-700 ring-1 ring-teal-200/90 shadow-[0_8px_18px_rgba(20,184,166,0.12)]",
  rejected: "bg-rose-50 text-rose-700 ring-1 ring-rose-200/90 shadow-[0_8px_18px_rgba(244,63,94,0.12)]",
  verified: "bg-sky-50 text-sky-700 ring-1 ring-sky-200/90 shadow-[0_8px_18px_rgba(14,165,233,0.12)]",
  entered: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/90 shadow-[0_8px_18px_rgba(34,197,94,0.12)]",
  exited: "bg-slate-100 text-slate-700 ring-1 ring-slate-200 shadow-[0_8px_18px_rgba(100,116,139,0.1)]",
} as const;

export function StatusBadge({ status, className }: { status: keyof typeof statusStyles; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em]",
        statusStyles[status],
        className,
      )}
    >
      {status}
    </span>
  );
}
