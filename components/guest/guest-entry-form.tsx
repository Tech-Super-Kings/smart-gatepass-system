"use client";

import { useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, LoaderCircle, Send, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, Input, Textarea } from "@/components/ui/form-controls";
import { formatDateTimeLabel } from "@/lib/visitor-format";
import { cn } from "@/lib/utils";
import type { VisitorRecord, WalkInRequestPayload } from "@/lib/visitor-types";

type ValidationErrors = Partial<Record<keyof WalkInRequestPayload, string>>;

const defaultValues: WalkInRequestPayload = {
  visitorName: "",
  phone: "",
  purpose: "",
  hostReference: "",
};

function validate(values: WalkInRequestPayload) {
  const errors: ValidationErrors = {};
  const phoneDigits = values.phone.replace(/\D/g, "");

  if (!values.visitorName.trim()) errors.visitorName = "Visitor name is required.";
  if (phoneDigits.length < 10) errors.phone = "Enter a valid phone number.";
  if (!values.purpose.trim()) errors.purpose = "Purpose is required.";
  if (!values.hostReference.trim()) errors.hostReference = "Host name or flat / unit is required.";

  return errors;
}

export function GuestEntryForm() {
  const [values, setValues] = useState(defaultValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [serverError, setServerError] = useState("");
  const [createdRequest, setCreatedRequest] = useState<VisitorRecord | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleChange =
    (field: keyof WalkInRequestPayload) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((current) => ({
        ...current,
        [field]: event.target.value,
      }));

      setErrors((current) => ({
        ...current,
        [field]: undefined,
      }));

      setServerError("");
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate(values);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/guest-entry", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const result = (await response.json()) as {
          success: boolean;
          error?: string;
          data?: VisitorRecord;
        };

        if (!response.ok || !result.success || !result.data) {
          throw new Error(result.error || "Unable to submit walk-in request.");
        }

        setCreatedRequest(result.data);
        setValues(defaultValues);
      } catch (error) {
        setServerError(error instanceof Error ? error.message : "Unable to submit walk-in request.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card className="mesh-card">
        <CardHeader>
          <div className="inline-flex size-12 items-center justify-center rounded-[1.1rem] bg-slate-950 text-white shadow-[0_14px_28px_rgba(15,23,42,0.16)]">
            <Send className="size-6" />
          </div>
          <CardTitle className="mt-5 text-2xl">Submit walk-in request</CardTitle>
          <p className="max-w-2xl text-sm leading-7 text-[var(--color-text-muted)]">
            Fill in your details and wait for the host to approve your request before security proceeds with entry.
          </p>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-5 md:grid-cols-2">
              <FormField label="Visitor name" error={errors.visitorName}>
                <Input
                  placeholder="Enter your full name"
                  value={values.visitorName}
                  onChange={handleChange("visitorName")}
                  aria-invalid={Boolean(errors.visitorName)}
                />
              </FormField>

              <FormField label="Phone number" error={errors.phone}>
                <Input
                  type="tel"
                  inputMode="numeric"
                  placeholder="Enter your phone number"
                  value={values.phone}
                  onChange={handleChange("phone")}
                  aria-invalid={Boolean(errors.phone)}
                />
              </FormField>
            </div>

            <FormField label="Host name or flat / unit" error={errors.hostReference}>
              <Input
                placeholder="For example: Rahul Menon or Tower B / 904"
                value={values.hostReference}
                onChange={handleChange("hostReference")}
                aria-invalid={Boolean(errors.hostReference)}
              />
            </FormField>

            <FormField label="Purpose of visit" error={errors.purpose}>
              <Textarea
                rows={4}
                placeholder="Meeting, guest visit, delivery, service call..."
                value={values.purpose}
                onChange={handleChange("purpose")}
                aria-invalid={Boolean(errors.purpose)}
              />
            </FormField>

            <div
              className={cn(
                "rounded-[1.35rem] border px-4 py-4 text-sm shadow-[0_10px_24px_rgba(15,23,42,0.04)]",
                serverError
                  ? "border-rose-200 bg-rose-50 text-rose-700"
                  : "border-teal-100 bg-teal-50 text-teal-800",
              )}
            >
              <div className="flex items-start gap-3">
                {serverError ? <AlertCircle className="mt-0.5 size-4 shrink-0" /> : <ShieldCheck className="mt-0.5 size-4 shrink-0" />}
                <div>
                  <p className="font-semibold">{serverError ? "Unable to submit request" : "Approval required"}</p>
                  <p className="mt-1 leading-6">
                    {serverError
                      ? serverError
                      : "Your request stays pending until the host approves it from the Host Approvals page."}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[var(--color-text-muted)]">Designed for fast mobile entry at the gate.</p>
              <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isPending}>
                {isPending ? (
                  <>
                    <LoaderCircle className="size-4 animate-spin" />
                    Submitting request...
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    Submit request
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {createdRequest ? (
        <Card>
          <CardContent className="mt-0">
            <div className="rounded-[1.6rem] border border-emerald-200 bg-emerald-50 px-5 py-5 text-sm text-emerald-800 shadow-[0_12px_24px_rgba(34,197,94,0.08)]">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                <div>
                  <p className="font-semibold">Walk-in request submitted</p>
                  <p className="mt-1 leading-6">
                    Your request was submitted at {formatDateTimeLabel(createdRequest.createdAt)} and is waiting for host approval.
                  </p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <Button asChild variant="secondary" size="sm">
                      <Link href="/host/approvals">Open Host Approvals</Link>
                    </Button>
                    <p className="text-sm text-emerald-700">Status: {createdRequest.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
