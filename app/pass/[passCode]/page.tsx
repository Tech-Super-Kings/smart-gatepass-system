import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { ArrowLeft } from "lucide-react";

import { VisitorPassCard } from "@/components/pass/visitor-pass-card";
import { Shell } from "@/components/layout/shell";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { findVisitorByPassCode } from "@/lib/visitor-service";

type PageProps = {
  params: Promise<{
    passCode: string;
  }>;
};

export default async function VisitorPassPage({ params }: PageProps) {
  const { passCode } = await params;
  const visitor = await findVisitorByPassCode(passCode);

  if (!visitor) {
    notFound();
  }

  const qrImage = await QRCode.toDataURL(visitor.qrValue, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 280,
    color: {
      dark: "#0f172a",
      light: "#ffffff",
    },
  });

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
            Create another pass
          </Link>

          <div className="mt-5 rounded-[1.45rem] border border-white/80 bg-white/75 px-4 py-4 text-sm leading-7 text-[var(--color-text-muted)] shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
            This digital pass is designed for quick on-site verification. Present the QR code or pass code to security at the gate.
          </div>

          <div className="mt-6">
            <VisitorPassCard visitor={visitor} qrImage={qrImage} />
          </div>
        </section>
      </main>

      <SiteFooter />
    </Shell>
  );
}
