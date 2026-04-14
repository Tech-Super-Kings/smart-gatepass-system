import Link from "next/link";
import { ArrowLeft, SearchCheck, ShieldCheck, TimerReset } from "lucide-react";

import { SecurityConsole } from "@/components/security/security-console";
import { Shell } from "@/components/layout/shell";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

const controlPoints = [
  {
    title: "Search fast by pass code",
    description: "Check in a visitor with a short pass code in just a couple of taps during busy hours.",
    icon: SearchCheck,
  },
  {
    title: "Confirm with QR when needed",
    description: "Optionally compare the QR value for stronger verification at the security desk.",
    icon: ShieldCheck,
  },
  {
    title: "Track live movement",
    description: "Verify, mark entry, and mark exit with timestamp updates that support both MongoDB and demo mode.",
    icon: TimerReset,
  },
];

export default function SecurityPage() {
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

          <div className="mt-6 grid gap-10 lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <Badge>Security Console</Badge>
              <SectionHeading
                eyebrow="Gate Verification"
                title="Validate passes quickly and keep visitor movement updated in real time"
                description="Built for checkpoint speed and hackathon clarity, the security view keeps lookup simple, actions obvious, and verification confidence high."
              />

              <div className="mt-5 rounded-[1.45rem] border border-white/80 bg-white/75 px-4 py-4 text-sm leading-7 text-[var(--color-text-muted)] shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                Demo tip: search by pass code for the fastest flow, then use Verify, Mark Entry, and Mark Exit to show the full visitor journey.
              </div>

              <div className="mt-8 space-y-4">
                {controlPoints.map((item) => {
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

            <SecurityConsole />
          </div>
        </section>
      </main>

      <SiteFooter />
    </Shell>
  );
}
