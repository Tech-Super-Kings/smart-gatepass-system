import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-teal-200/80 bg-white/85 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-brand)] shadow-[0_8px_20px_rgba(15,23,42,0.05)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
