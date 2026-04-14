import Link from "next/link";
import { ArrowLeft, CheckCheck, Clock3, UserCheck } from "lucide-react";

import { HostApprovalsBoard } from "@/components/host/host-approvals-board";
import { Shell } from "@/components/layout/shell";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

const approvalNotes = [
  {
    title: "Review walk-in requests quickly",
    description: "See pending guest requests in one place with the key details needed to make a fast decision.",
    icon: Clock3,
  },
  {
    title: "Approve and generate access",
    description: "Approvals instantly generate a pass code and QR value so the visitor can proceed through security.",
    icon: UserCheck,
  },
  {
    title: "Reject when necessary",
    description: "Hosts can reject unwanted walk-ins cleanly, keeping the security team informed of the final status.",
    icon: CheckCheck,
  },
];

export default function HostApprovalsPage() {
  return (
    <Shell>
      <SiteHeader />

      <main className="section-shell pb-16">
        <section className="pt-8 md:pt-12">
          <Link
            href="/host"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)] transition hover:text-slate-950"
          >
            <ArrowLeft className="size-4" />
            Back to Host page
          </Link>

          <div className="mt-6 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <Badge>Host Approvals</Badge>
              <SectionHeading
                eyebrow="Walk-In Reviews"
                title="Approve or reject gate requests before a visitor is allowed through"
                description="This screen gives the host a clean approval queue for walk-in requests so access decisions stay fast and visible."
              />

              <div className="mt-5 rounded-[1.45rem] border border-white/80 bg-white/75 px-4 py-4 text-sm leading-7 text-[var(--color-text-muted)] shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                Approving a walk-in request creates a pass code and QR value instantly. Rejected requests stay blocked from the entry flow.
              </div>

              <div className="mt-8 space-y-4">
                {approvalNotes.map((item) => {
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

            <HostApprovalsBoard />
          </div>
        </section>
      </main>

      <SiteFooter />
    </Shell>
  );
}
