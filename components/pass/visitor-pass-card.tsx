import Image from "next/image";
import type { ComponentType } from "react";
import { CalendarDays, Clock3, MapPin, Phone, QrCode, ShieldCheck, UserRound } from "lucide-react";

import { StatusBadge } from "@/components/ui/status-badge";
import { Card } from "@/components/ui/card";
import { formatDateLabel, formatDateTimeLabel, formatTimeLabel } from "@/lib/visitor-format";
import type { VisitorRecord } from "@/lib/visitor-types";

type VisitorPassCardProps = {
  visitor: VisitorRecord;
  qrImage: string;
};

export function VisitorPassCard({ visitor, qrImage }: VisitorPassCardProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <Card className="mesh-card overflow-hidden p-0">
        <div className="border-b border-black/5 bg-slate-950 px-6 py-6 text-white md:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-teal-300">Digital Gate Pass</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight">Welcome, {visitor.visitorName}</h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
                Present this digital pass at the gate for quick contactless verification by security personnel.
              </p>
            </div>
            <StatusBadge status={visitor.status} />
          </div>
        </div>

        <div className="grid gap-6 px-6 py-6 md:px-8 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoTile icon={UserRound} label="Host" value={visitor.hostName} />
              <InfoTile icon={Phone} label="Phone" value={visitor.phone} />
              <InfoTile icon={CalendarDays} label="Visit date" value={formatDateLabel(visitor.visitDate)} />
              <InfoTile icon={Clock3} label="Visit time" value={formatTimeLabel(visitor.visitTime)} />
              <InfoTile icon={MapPin} label="Location / Unit" value={visitor.locationUnit} className="sm:col-span-2" />
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-black/5 bg-white/85 p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-brand)]">Visit purpose</p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">{visitor.purpose}</p>
            </div>
          </div>

          <div className="rounded-[1.9rem] border border-black/5 bg-white/95 p-5 shadow-[var(--shadow-floating)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-brand)]">Pass code</p>
                <p className="mt-2 text-3xl font-semibold tracking-[0.18em] text-slate-950">{visitor.passCode}</p>
              </div>
              <div className="rounded-[1.2rem] bg-teal-50 p-3.5 text-[var(--color-brand)] shadow-[0_12px_24px_rgba(15,118,110,0.1)]">
                <QrCode className="size-7" />
              </div>
            </div>

            <div className="mt-5 flex justify-center rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/90 p-5">
              <Image src={qrImage} alt={`QR code for pass ${visitor.passCode}`} width={240} height={240} className="h-60 w-60 rounded-[1.4rem] bg-white p-2 shadow-[0_12px_24px_rgba(15,23,42,0.08)]" />
            </div>

            <div className="mt-5 rounded-[1.35rem] bg-emerald-50 px-4 py-4 text-sm text-emerald-800 shadow-[0_10px_24px_rgba(34,197,94,0.08)]">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 size-4 shrink-0" />
                <div>
                  <p className="font-semibold">Ready for verification</p>
                  <p className="mt-1 leading-6">Security can verify this pass using the QR code or the pass code shown above.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="h-fit">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--color-brand)]">Pass timeline</p>
          <TimelineItem label="Created" value={formatDateTimeLabel(visitor.createdAt)} />
          <TimelineItem label="Scheduled date" value={formatDateLabel(visitor.visitDate)} />
          <TimelineItem label="Scheduled time" value={formatTimeLabel(visitor.visitTime)} />
          <TimelineItem label="Current status" value={visitor.status} />
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
