import Link from "next/link";
import { Activity, ArrowLeft, ChartNoAxesColumn, ClipboardList } from "lucide-react";

import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { Shell } from "@/components/layout/shell";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

const adminHighlights = [
  {
    title: "See the full visitor picture",
    description: "Track all visitor movement from pending to exited in one clean operational view.",
    icon: ClipboardList,
  },
  {
    title: "Search and filter instantly",
    description: "Use quick search and status filters to isolate the exact visitor record you need during a demo.",
    icon: Activity,
  },
  {
    title: "Built for presentation",
    description: "The dashboard balances live operational data with polished summary cards for judges and stakeholders.",
    icon: ChartNoAxesColumn,
  },
];

export default function AdminPage() {
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
              <Badge>Admin Dashboard</Badge>
              <SectionHeading
                eyebrow="Operations Overview"
                title="Monitor visitor flow with live counts, searchable logs, and status tracking"
                description="The admin view presents the entire visitor pipeline in a polished command center with high-level metrics and detailed logs fetched through the API."
              />

              <div className="mt-5 rounded-[1.45rem] border border-white/80 bg-white/75 px-4 py-4 text-sm leading-7 text-[var(--color-text-muted)] shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                Use this screen to show end-to-end operational visibility after creating and verifying a few visitor passes during your demo.
              </div>

              <div className="mt-8 space-y-4">
                {adminHighlights.map((item) => {
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

            <AdminDashboard />
          </div>
        </section>
      </main>

      <SiteFooter />
    </Shell>
  );
}
