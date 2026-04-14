import type { ComponentType } from "react";
import { CalendarDays, Clock3, LoaderCircle, LogIn, LogOut, MapPin, Phone, ShieldCheck, UserRound } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDateLabel, formatDateTimeLabel, formatTimeLabel } from "@/lib/visitor-format";
import type { SecurityAction, VisitorRecord } from "@/lib/visitor-types";

export function SecurityVisitorCard({
  visitor,
  isUpdating,
  onAction,
}: {
  visitor: VisitorRecord;
  isUpdating: boolean;
  onAction: (action: SecurityAction) => void;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <Card className="mesh-card overflow-hidden p-0">
        <div className="border-b border-black/5 bg-slate-950 px-6 py-6 text-white md:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-teal-300">Security Checkpoint</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">{visitor.visitorName}</h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
                Review the pass details below, then update the checkpoint status using the quick action buttons.
              </p>
            </div>
            <StatusBadge status={visitor.status} />
          </div>
        </div>

        <div className="grid gap-4 px-6 py-6 md:px-8 sm:grid-cols-2">
          <InfoTile icon={UserRound} label="Host" value={visitor.hostName} />
          <InfoTile icon={Phone} label="Phone" value={visitor.phone} />
          <InfoTile icon={CalendarDays} label="Visit date" value={formatDateLabel(visitor.visitDate)} />
          <InfoTile icon={Clock3} label="Visit time" value={formatTimeLabel(visitor.visitTime)} />
          <InfoTile icon={MapPin} label="Location / Unit" value={visitor.locationUnit} className="sm:col-span-2" />
          <InfoTile icon={ShieldCheck} label="Pass code" value={visitor.passCode || "Pending approval"} />
          <InfoTile icon={ShieldCheck} label="Purpose" value={visitor.purpose} />
        </div>
      </Card>

      <Card className="h-fit">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--color-brand)]">Security actions</p>
          <p className="text-sm leading-7 text-[var(--color-text-muted)]">Use these controls to move the visitor through verification and gate activity.</p>

          <div className="grid gap-3">
            <Button size="lg" onClick={() => onAction("verify")} disabled={isUpdating || visitor.status === "rejected"}>
              {isUpdating ? <LoaderCircle className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
              Verify
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => onAction("entry")}
              disabled={isUpdating || visitor.status === "exited" || visitor.status === "rejected"}
            >
              {isUpdating ? <LoaderCircle className="size-4 animate-spin" /> : <LogIn className="size-4" />}
              Mark Entry
            </Button>
            <Button size="lg" variant="secondary" onClick={() => onAction("exit")} disabled={isUpdating || visitor.status !== "entered"}>
              {isUpdating ? <LoaderCircle className="size-4 animate-spin" /> : <LogOut className="size-4" />}
              Mark Exit
            </Button>
          </div>

          <TimelineItem label="Created" value={formatDateTimeLabel(visitor.createdAt)} />
          <TimelineItem label="Entry time" value={visitor.entryTime ? formatDateTimeLabel(visitor.entryTime) : "Not marked yet"} />
          <TimelineItem label="Exit time" value={visitor.exitTime ? formatDateTimeLabel(visitor.exitTime) : "Not marked yet"} />
          <TimelineItem label="QR payload" value={visitor.qrValue || "QR not generated yet"} mono />
        </div>
      </Card>
    </div>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`rounded-[1.5rem] border border-black/5 bg-white/85 p-4 shadow-[0_8px_18px_rgba(15,23,42,0.03)] ${className ?? ""}`}>
      <div className="flex items-center gap-3">
        <div className="inline-flex size-10 items-center justify-center rounded-[1rem] bg-slate-100 text-slate-700">
          <Icon className="size-4" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-text-muted)]">{label}</p>
          <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-[1.4rem] border border-black/5 bg-white/85 p-4 shadow-[0_8px_18px_rgba(15,23,42,0.03)]">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-text-muted)]">{label}</p>
      <p className={`mt-2 text-sm font-semibold text-slate-950 ${mono ? "break-all font-mono text-xs" : ""}`}>{value}</p>
    </div>
  );
}
