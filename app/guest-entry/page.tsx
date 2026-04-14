import Link from "next/link";
import { ArrowLeft, Building2, ShieldCheck, UserRoundPlus } from "lucide-react";

import { GuestEntryForm } from "@/components/guest/guest-entry-form";
import { Shell } from "@/components/layout/shell";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

const guestNotes = [
  {
    title: "No pre-registration needed",
    description: "Walk-in visitors can quickly submit their request from the gate without waiting for manual paperwork.",
    icon: UserRoundPlus,
  },
  {
    title: "Host approval before entry",
    description: "The host receives a pending request view and can approve or reject the visitor before access is granted.",
    icon: ShieldCheck,
  },
  {
    title: "Works for flats and offices",
    description: "Use a host name, flat number, or unit reference so the request reaches the right destination fast.",
    icon: Building2,
  },
];

export default function GuestEntryPage() {
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
              <Badge>Guest Entry</Badge>
              <SectionHeading
                eyebrow="Walk-In Visitor Request"
                title="Walk-In Visitor Request"
                description="Visitors who were not pre-registered can submit their details here from the gate and wait for the host to approve or reject the request."
              />

              <div className="mt-5 rounded-[1.45rem] border border-white/80 bg-white/75 px-4 py-4 text-sm leading-7 text-[var(--color-text-muted)] shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                This is a dedicated walk-in visitor flow. Submit your request here, wait for host approval, and then continue through the normal security verification process.
              </div>
              <div className="mt-8 space-y-4">
                {guestNotes.map((item) => {
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

            <GuestEntryForm />
          </div>
        </section>
      </main>

      <SiteFooter />
    </Shell>
  );
}
