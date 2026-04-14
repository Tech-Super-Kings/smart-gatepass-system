import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Shell } from "@/components/layout/shell";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PassNotFound() {
  return (
    <Shell>
      <SiteHeader />

      <main className="flex flex-1 items-center justify-center py-16">
        <Card className="max-w-xl text-center">
          <CardHeader>
            <CardTitle>Visitor pass not found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-7 text-[var(--color-text-muted)]">
              The pass may have expired from the demo fallback store, or the pass code may be incorrect.
            </p>
            <div className="mt-6 flex justify-center">
              <Button asChild>
                <Link href="/host">
                  <ArrowLeft className="size-4" />
                  Return to Host page
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <SiteFooter />
    </Shell>
  );
}
