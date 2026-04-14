"use client";

import { useState, useTransition, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CalendarClock, CheckCircle2, LoaderCircle, UserRoundPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, Input, Textarea } from "@/components/ui/form-controls";
import { cn } from "@/lib/utils";
import type { CreateVisitorPayload } from "@/lib/visitor-types";

type FormValues = CreateVisitorPayload;
type ValidationErrors = Partial<Record<keyof FormValues, string>>;

const defaultValues: FormValues = {
  visitorName: "",
  phone: "",
  hostName: "",
  purpose: "",
  visitDate: "",
  visitTime: "",
  locationUnit: "",
};

function validate(values: FormValues) {
  const errors: ValidationErrors = {};
  const phoneDigits = values.phone.replace(/\D/g, "");

  if (!values.visitorName.trim()) errors.visitorName = "Visitor name is required.";
  if (phoneDigits.length < 10) errors.phone = "Enter a valid phone number.";
  if (!values.hostName.trim()) errors.hostName = "Host name is required.";
  if (!values.purpose.trim()) errors.purpose = "Purpose is required.";
  if (!values.visitDate) errors.visitDate = "Visit date is required.";
  if (!values.visitTime) errors.visitTime = "Visit time is required.";
  if (!values.locationUnit.trim()) errors.locationUnit = "Location or unit is required.";

  return errors;
}

export function HostRegistrationForm() {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>(defaultValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [serverError, setServerError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleChange =
    (field: keyof FormValues) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate(values);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/visitors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const result = (await response.json()) as {
          success: boolean;
          error?: string;
          data?: { passCode: string };
        };

        if (!response.ok || !result.success || !result.data) {
          throw new Error(result.error || "Unable to create the visitor pass.");
        }

        router.push(`/pass/${result.data.passCode}`);
      } catch (error) {
        setServerError(error instanceof Error ? error.message : "Something went wrong while creating the pass.");
      }
    });
  };

  return (
    <Card className="mesh-card">
      <CardHeader>
        <div className="inline-flex size-12 items-center justify-center rounded-[1.1rem] bg-slate-950 text-white shadow-[0_14px_28px_rgba(15,23,42,0.16)]">
          <UserRoundPlus className="size-6" />
        </div>
        <CardTitle className="mt-5 text-2xl">Visitor registration form</CardTitle>
        <p className="max-w-2xl text-sm leading-7 text-[var(--color-text-muted)]">
          Complete the details below to generate a secure visitor pass that can be verified immediately at the gate.
        </p>
      </CardHeader>

      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="Visitor name" error={errors.visitorName}>
              <Input
                placeholder="Enter visitor name"
                value={values.visitorName}
                onChange={handleChange("visitorName")}
                aria-invalid={Boolean(errors.visitorName)}
              />
            </FormField>

            <FormField label="Phone number" error={errors.phone}>
              <Input
                type="tel"
                inputMode="numeric"
                placeholder="Enter phone number"
                value={values.phone}
                onChange={handleChange("phone")}
                aria-invalid={Boolean(errors.phone)}
              />
            </FormField>

            <FormField label="Host name" error={errors.hostName}>
              <Input
                placeholder="Enter host name"
                value={values.hostName}
                onChange={handleChange("hostName")}
                aria-invalid={Boolean(errors.hostName)}
              />
            </FormField>

            <FormField label="Location / Unit" error={errors.locationUnit}>
              <Input
                placeholder="Tower B, Unit 904"
                value={values.locationUnit}
                onChange={handleChange("locationUnit")}
                aria-invalid={Boolean(errors.locationUnit)}
              />
            </FormField>

            <FormField label="Visit date" error={errors.visitDate}>
              <Input type="date" value={values.visitDate} onChange={handleChange("visitDate")} aria-invalid={Boolean(errors.visitDate)} />
            </FormField>

            <FormField label="Visit time" error={errors.visitTime}>
              <Input type="time" value={values.visitTime} onChange={handleChange("visitTime")} aria-invalid={Boolean(errors.visitTime)} />
            </FormField>
          </div>

          <FormField label="Purpose" error={errors.purpose}>
            <Textarea
              rows={4}
              placeholder="Meeting, delivery, maintenance, guest visit..."
              value={values.purpose}
              onChange={handleChange("purpose")}
              aria-invalid={Boolean(errors.purpose)}
            />
          </FormField>

          <div
            className={cn(
              "rounded-[1.35rem] border px-4 py-3 text-sm shadow-[0_10px_24px_rgba(15,23,42,0.04)]",
              serverError
                ? "border-rose-200 bg-rose-50 text-rose-700"
                : "border-teal-100 bg-teal-50 text-teal-800",
            )}
          >
            <div className="flex items-start gap-3">
              {serverError ? <AlertCircle className="mt-0.5 size-4 shrink-0" /> : <CalendarClock className="mt-0.5 size-4 shrink-0" />}
              <div>
                <p className="font-semibold">{serverError ? "Unable to create pass" : "Demo-friendly setup"}</p>
                <p className="mt-1 leading-6">
                  {serverError
                    ? serverError
                    : "This flow saves to MongoDB when configured and automatically falls back to a safe local demo store when it is not."}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--color-text-muted)]">Digital pass is generated instantly after successful submission.</p>
            <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isPending}>
            {isPending ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Creating visitor pass...
              </>
            ) : (
              <>
                <CheckCircle2 className="size-4" />
                Generate digital pass
              </>
            )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
