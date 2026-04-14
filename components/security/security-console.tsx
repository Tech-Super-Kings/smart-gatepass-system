"use client";

import { useState, useTransition, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, LoaderCircle, QrCode, Search, ShieldCheck } from "lucide-react";

import { SecurityVisitorCard } from "@/components/security/security-visitor-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, Input } from "@/components/ui/form-controls";
import type { SecurityAction, VisitorRecord } from "@/lib/visitor-types";

type SearchState = {
  passCode: string;
  qrValue: string;
};

const initialSearchState: SearchState = {
  passCode: "",
  qrValue: "",
};

export function SecurityConsole() {
  const [search, setSearch] = useState(initialSearchState);
  const [visitor, setVisitor] = useState<VisitorRecord | null>(null);
  const [message, setMessage] = useState<string>("Search for a visitor pass to verify or update gate activity.");
  const [messageTone, setMessageTone] = useState<"neutral" | "success" | "error">("neutral");
  const [isSearching, startSearchTransition] = useTransition();
  const [isUpdating, startUpdateTransition] = useTransition();

  const updateMessage = (nextMessage: string, tone: "neutral" | "success" | "error") => {
    setMessage(nextMessage);
    setMessageTone(tone);
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startSearchTransition(async () => {
      try {
        if (!search.passCode.trim() && !search.qrValue.trim()) {
          throw new Error("Enter a pass code or QR value to search.");
        }

        const params = new URLSearchParams();

        if (search.passCode.trim()) {
          params.set("passCode", search.passCode.trim().toUpperCase());
        }

        if (search.qrValue.trim()) {
          params.set("qrValue", search.qrValue.trim());
        }

        const response = await fetch(`/api/security/search?${params.toString()}`, {
          method: "GET",
        });

        const result = (await response.json()) as {
          success: boolean;
          error?: string;
          data?: VisitorRecord;
        };

        if (!response.ok || !result.success || !result.data) {
          throw new Error(result.error || "Unable to fetch visitor details.");
        }

        setVisitor(result.data);
        updateMessage("Visitor found. You can verify the pass or update entry and exit right away.", "success");
      } catch (error) {
        setVisitor(null);
        updateMessage(error instanceof Error ? error.message : "Unable to fetch visitor details.", "error");
      }
    });
  };

  const handleAction = (action: SecurityAction) => {
    if (!visitor) return;

    startUpdateTransition(async () => {
      try {
        const response = await fetch(`/api/visitors/${visitor.passCode}`, {
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
          throw new Error(result.error || "Unable to update visitor status.");
        }

        setVisitor(result.data);

        const actionLabel = {
          verify: "Pass verified successfully.",
          entry: "Visitor marked as entered.",
          exit: "Visitor marked as exited.",
        } satisfies Record<SecurityAction, string>;

        updateMessage(actionLabel[action], "success");
      } catch (error) {
        updateMessage(error instanceof Error ? error.message : "Unable to update visitor status.", "error");
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
          <CardTitle className="mt-5 text-2xl">Security verification panel</CardTitle>
          <p className="max-w-2xl text-sm leading-7 text-[var(--color-text-muted)]">
            Fetch a visitor record in seconds, optionally confirm with the QR payload, then update the checkpoint status.
          </p>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={handleSearch}>
            <div className="grid gap-5 md:grid-cols-2">
              <FormField label="Pass code">
                <Input
                  placeholder="VP-8K31ZQ"
                  value={search.passCode}
                  onChange={(event) => setSearch((current) => ({ ...current, passCode: event.target.value }))}
                />
              </FormField>

              <FormField label="QR value (optional)">
                <Input
                  placeholder="Paste scanned QR payload"
                  value={search.qrValue}
                  onChange={(event) => setSearch((current) => ({ ...current, qrValue: event.target.value }))}
                />
              </FormField>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="submit" size="lg" disabled={isSearching}>
                {isSearching ? (
                  <>
                    <LoaderCircle className="size-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="size-4" />
                    Find visitor pass
                  </>
                )}
              </Button>

              <Button
                type="button"
                size="lg"
                variant="secondary"
                onClick={() => {
                  setSearch(initialSearchState);
                  setVisitor(null);
                  updateMessage("Search for a visitor pass to verify or update gate activity.", "neutral");
                }}
              >
                <QrCode className="size-4" />
                Clear search
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="mt-0">
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
                <ShieldCheck className="mt-0.5 size-4 shrink-0" />
              )}
              <div>
                <p className="font-semibold">Checkpoint status</p>
                <p className="mt-1 leading-6">{message}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {visitor ? (
        <SecurityVisitorCard visitor={visitor} isUpdating={isUpdating} onAction={handleAction} />
      ) : (
        <Card>
          <CardContent className="mt-0">
            <div className="rounded-[1.6rem] border border-dashed border-slate-200 bg-white/70 p-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--color-brand)]">Awaiting search</p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">
                Search by pass code for the fastest flow, and add the QR value when you want stronger verification confidence.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
