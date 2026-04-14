"use client";

import { useEffect, useState, useTransition } from "react";
import { AlertCircle, CheckCircle2, Clock3, LoaderCircle, ShieldCheck, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDateTimeLabel } from "@/lib/visitor-format";
import type { ApprovalAction, VisitorRecord } from "@/lib/visitor-types";

export function HostApprovalsBoard() {
  const [requests, setRequests] = useState<VisitorRecord[]>([]);
  const [message, setMessage] = useState("Loading pending walk-in requests...");
  const [messageTone, setMessageTone] = useState<"neutral" | "success" | "error">("neutral");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, startTransition] = useTransition();

  useEffect(() => {
    let isMounted = true;

    async function loadRequests() {
      try {
        setIsLoading(true);

        const response = await fetch("/api/host/approvals");
        const result = (await response.json()) as {
          success: boolean;
          error?: string;
          data?: VisitorRecord[];
        };

        if (!response.ok || !result.success || !result.data) {
          throw new Error(result.error || "Unable to fetch pending walk-in requests.");
        }

        if (isMounted) {
          setRequests(result.data);
          setMessage(result.data.length > 0 ? "Pending walk-in requests are ready for review." : "No pending walk-in requests right now.");
          setMessageTone("neutral");
        }
      } catch (error) {
        if (isMounted) {
          setMessage(error instanceof Error ? error.message : "Unable to fetch pending walk-in requests.");
          setMessageTone("error");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadRequests();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleReview = (requestId: string, action: ApprovalAction) => {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/host/approvals/${requestId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action }),
        });

        const result = (await response.json()) as {
          success: boolean;
          error?: string;
          data?: VisitorRecord;
        };

        if (!response.ok || !result.success || !result.data) {
          throw new Error(result.error || "Unable to review walk-in request.");
        }

        setRequests((current) => current.filter((request) => request.id !== requestId));
        setMessage(
          action === "approve"
            ? `Request approved. Pass code ${result.data.passCode} is ready for security verification.`
            : "Request rejected successfully.",
        );
        setMessageTone("success");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to review walk-in request.");
        setMessageTone("error");
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card className="mesh-card">
        <CardHeader>
          <div className="inline-flex size-12 items-center justify-center rounded-[1.1rem] bg-slate-950 text-white shadow-[0_14px_28px_rgba(15,23,42,0.16)]">
            <ShieldCheck className="size-6" />
          </div>
          <CardTitle className="mt-5 text-2xl">Pending visitor approvals</CardTitle>
          <p className="max-w-2xl text-sm leading-7 text-[var(--color-text-muted)]">
            Review walk-in requests, then approve to generate a pass or reject to block the entry attempt.
          </p>
        </CardHeader>

        <CardContent>
          <div
            className={[
              "rounded-[1.35rem] border px-4 py-4 text-sm shadow-[0_10px_24px_rgba(15,23,42,0.04)]",
              messageTone === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : messageTone === "error"
                  ? "border-rose-200 bg-rose-50 text-rose-700"
                  : "border-teal-100 bg-teal-50 text-teal-800",
            ].join(" ")}
          >
            <div className="flex items-start gap-3">
              {messageTone === "error" ? (
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
              ) : messageTone === "success" ? (
                <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
              ) : (
                <Clock3 className="mt-0.5 size-4 shrink-0" />
              )}
              <div>
                <p className="font-semibold">Approval queue</p>
                <p className="mt-1 leading-6">{message}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="mt-0 py-10">
            <div className="flex items-center justify-center gap-3 text-sm text-[var(--color-text-muted)]">
              <LoaderCircle className="size-4 animate-spin" />
              Loading pending requests...
            </div>
          </CardContent>
        </Card>
      ) : requests.length === 0 ? (
        <Card>
          <CardContent className="mt-0">
            <div className="rounded-[1.6rem] border border-dashed border-slate-200 bg-white/70 p-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--color-brand)]">Queue clear</p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">
                There are no pending walk-in visitor requests to review right now.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id} className="mesh-card">
              <CardContent className="mt-0">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-lg font-semibold text-slate-950">{request.visitorName}</p>
                      <StatusBadge status={request.status} />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <DetailTile label="Phone" value={request.phone} />
                      <DetailTile label="Host / Flat / Unit" value={request.hostName} />
                      <DetailTile label="Purpose" value={request.purpose} className="sm:col-span-2" />
                      <DetailTile label="Request time" value={formatDateTimeLabel(request.createdAt)} className="sm:col-span-2" />
                    </div>
                  </div>

                  <div className="flex w-full flex-col gap-3 lg:w-auto">
                    <Button size="lg" onClick={() => handleReview(request.id, "approve")} disabled={isUpdating}>
                      {isUpdating ? <LoaderCircle className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                      Approve
                    </Button>
                    <Button size="lg" variant="secondary" onClick={() => handleReview(request.id, "reject")} disabled={isUpdating}>
                      {isUpdating ? <LoaderCircle className="size-4 animate-spin" /> : <XCircle className="size-4" />}
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function DetailTile({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={`rounded-[1.4rem] border border-black/5 bg-white/85 p-4 shadow-[0_8px_18px_rgba(15,23,42,0.03)] ${className ?? ""}`}>
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-text-muted)]">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}
