import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Users2,
} from "lucide-react";

import { Shell } from "@/components/layout/shell";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";

const featureCards = [
  {
    title: "Digital pre-registration",
    description: "Hosts create visitor passes ahead of arrival so the gate experience starts before the visitor reaches the entrance.",
    icon: Users2,
  },
  {
    title: "Fast security verification",
    description: "Security teams can validate every pass in seconds with a QR payload or short pass code during busy hours.",
    icon: ShieldCheck,
  },
  {
    title: "Live movement tracking",
    description: "Entry, exit, and verification status stay visible for operations teams through a clear admin command view.",
    icon: TimerReset,
  },
];

const roleCards = [
  {
    id: "host-preview",
    eyebrow: "Host",
    title: "Generate a polished visitor pass in one flow",
    description: "Pre-register a visitor, capture the visit schedule, and instantly create a QR-ready digital pass.",
  },
  {
    id: "security-preview",
    eyebrow: "Security",
    title: "Verify confidently at the gate",
    description: "Search by pass code, confirm with QR when needed, and update the visitor journey with one-tap actions.",
  },
  {
    id: "admin-preview",
    eyebrow: "Admin",
    title: "Present a real operations dashboard",
    description: "Track status counts, search logs, and showcase the full visitor lifecycle during your hackathon demo.",
  },
];

export default function LandingPage() {
  return (
    <Shell>
      <SiteHeader />

      <main className="section-shell pb-16 sm:pb-20">
        <section className="pt-6 md:pt-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1.16fr_0.84fr] lg:gap-12">
            <div>
              <Badge>Visitor operations</Badge>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-brand)] shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                <Sparkles className="size-3.5" />
                Fast, secure, contactless entry
              </div>

              <h1 className="mt-6 max-w-4xl text-balance text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl xl:text-7xl">
                Replace manual gate registers with a modern digital entry experience.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--color-text-muted)] sm:text-xl">
                Smart GatePass helps apartments, malls, and IT parks pre-register visitors, verify identity faster,
                and track movement in real time through role-based workflows built for live demos and real operations.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="!text-white">
                  <Link href="/host" className="!text-white">
                    Open Host Registration
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/guest-entry">Walk-In Guest Entry</Link>
                </Button>
                <Button asChild size="lg" variant="ghost">
                  <Link href="/admin">View Admin Dashboard</Link>
                </Button>
              </div>

              <div className="mt-4">
                <Link href="/security" className="text-sm font-semibold text-[var(--color-brand)] transition hover:text-[var(--color-brand-strong)]">
                  Security team? Open the checkpoint console.
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Best for", value: "Apartments, IT parks, malls" },
                  { label: "Verification", value: "QR code + pass code" },
                  { label: "Deployment", value: "Vercel-ready with MongoDB fallback" },
                ].map((item) => (
                  <div key={item.label} className="glass-panel rounded-[1.6rem] px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-text-muted)]">{item.label}</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-950">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel mesh-card rounded-[2.2rem] p-5 md:p-7">
              <div className="rounded-[1.8rem] border border-white/80 bg-white/95 p-5 shadow-[var(--shadow-floating)]">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--color-brand)]">Live Visitor Pass</p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">VP-8K31ZQ</h2>
                    <p className="mt-2 text-sm text-[var(--color-text-muted)]">Verified in under 10 seconds at the gate</p>
                  </div>
                  <div className="rounded-[1.25rem] bg-emerald-50 p-3.5 text-emerald-700 shadow-[0_12px_24px_rgba(16,185,129,0.12)]">
                    <QrCode className="size-8" />
                  </div>
                </div>

                <div className="mt-6 grid gap-3">
                  {[
                    ["Visitor", "Ananya Rao"],
                    ["Host", "Rahul Menon"],
                    ["Purpose", "Client discussion"],
                    ["Visit slot", "16 Apr 2026, 04:30 PM"],
                    ["Location", "Tower B, Unit 904"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-4 rounded-[1.2rem] border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm"
                    >
                      <span className="font-medium text-[var(--color-text-muted)]">{label}</span>
                      <span className="text-right font-semibold text-slate-950">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-[1.3rem] bg-slate-950 px-4 py-4 text-sm text-white">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                    <div>
                      <p className="font-semibold">Ready for contactless verification</p>
                      <p className="mt-1 text-slate-300">Use the host flow to generate the pass, then verify it from the security console.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pt-20 sm:pt-24">
          <SectionHeading
            eyebrow="Core Product Value"
            title="Built to reduce queue time, remove paperwork, and present clearly in a demo"
            description="The product flow is intentionally simple for judges to understand and operational teams to adopt: create, verify, track."
          />

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {featureCards.map((feature) => {
              const Icon = feature.icon;

              return (
                <Card key={feature.title} className="mesh-card">
                  <CardHeader>
                    <div className="inline-flex size-12 items-center justify-center rounded-[1.1rem] bg-teal-50 text-[var(--color-brand)]">
                      <Icon className="size-6" />
                    </div>
                    <CardTitle className="mt-5">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-7 text-[var(--color-text-muted)]">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="pt-20 sm:pt-24">
          <SectionHeading
            eyebrow="Role-Based Experience"
            title="Every stakeholder gets a focused workflow"
            description="The MVP already demonstrates the full loop for hosts, security teams, and administrators with clear responsibilities and fast actions."
          />

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {roleCards.map((role) => (
              <Card key={role.id} id={role.id} className="mesh-card">
                <CardHeader>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-brand)]">{role.eyebrow}</p>
                  <CardTitle>{role.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-[var(--color-text-muted)]">{role.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </Shell>
  );
}
