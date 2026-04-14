import Link from "next/link";
import { ArrowLeft, Building2, QrCode, ShieldCheck } from "lucide-react";

import { HostRegistrationForm } from "@/components/host/host-registration-form";
import { Shell } from "@/components/layout/shell";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

const quickNotes = [
  {
    title: "Pre-register visitors fast",
    description: "Create a digital pass in under a minute for residents, employees, or event guests.",
    icon: Building2,
  },
  {
    title: "Generate secure pass credentials",
    description: "Each submission creates a unique pass code and QR value that security can verify instantly.",
    icon: QrCode,
  },
  {
    title: "Stay demo-safe",
    description: "If MongoDB is unavailable, the flow still works locally using a safe in-memory fallback.",
    icon: ShieldCheck,
  },
];

export default function HostPage() {
  return (
    <Shell>
      <SiteHeader />

      <main className="section-shell pb-16">
        <section className="pt-8 md:pt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)] transition hover:text-slate-950"
          >
            <ArrowLeft className="size-4" />
            Back to landing page
          </Link>

          <div className="mt-6 grid gap-10 lg:grid-cols-[0.88fr_1.12fr]">
            <div>
              <Badge>Host Workspace</Badge>
              <SectionHeading
                eyebrow="Visitor Registration"
                title="Create a secure visitor pass before your guest arrives"
                description="Fill in the visit details once, generate a polished digital pass instantly, and give security everything they need for fast contactless verification."
              />

              <div className="mt-5 rounded-[1.45rem] border border-white/80 bg-white/75 px-4 py-4 text-sm leading-7 text-[var(--color-text-muted)] shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                Best for demo flow: register a visitor here, open the digital pass next, then validate it from the security console.
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="secondary">
                  <Link href="/host/approvals">Open Host Approvals</Link>
                </Button>
              </div>

              <div className="mt-8 space-y-4">
                {quickNotes.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Card key={item.title} className="mesh-card">
                      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                        <div className="inline-flex size-12 shrink-0 items-center justify-center rounded-[1.1rem] bg-teal-50 text-[var(--color-brand)]">
                          <Icon className="size-6" />
                        </div>
                        <div>
                          <CardTitle>{item.title}</CardTitle>
                          <CardContent className="mt-2 px-0 pb-0">
                            <p className="text-sm leading-7 text-[var(--color-text-muted)]">{item.description}</p>
                          </CardContent>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </div>

            <HostRegistrationForm />
          </div>
        </section>
      </main>

      <SiteFooter />
    </Shell>
  );
}
