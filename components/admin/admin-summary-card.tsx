import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminSummaryCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: LucideIcon;
}) {
  return (
    <Card className="mesh-card">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-brand)]">{title}</p>
          <CardTitle className="mt-3 text-3xl sm:text-[2rem]">{value}</CardTitle>
        </div>
        <div className="inline-flex size-12 items-center justify-center rounded-[1.1rem] bg-teal-50 text-[var(--color-brand)] shadow-[0_12px_24px_rgba(15,118,110,0.08)]">
          <Icon className="size-6" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-7 text-[var(--color-text-muted)]">Live visitor metric from the current admin dataset.</p>
      </CardContent>
    </Card>
  );
}
