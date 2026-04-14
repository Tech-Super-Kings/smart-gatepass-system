"use client";

import { useEffect, useMemo, useState } from "react";
import { ChartNoAxesColumn, CheckCheck, Clock3, LoaderCircle, LogIn, LogOut, Search, ShieldCheck } from "lucide-react";

import { AdminSummaryCard } from "@/components/admin/admin-summary-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, Input } from "@/components/ui/form-controls";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDateLabel, formatDateTimeLabel, formatTimeLabel } from "@/lib/visitor-format";
import type { AdminDashboardData, VisitorRecord, VisitorStatusFilter } from "@/lib/visitor-types";

const statusOptions: VisitorStatusFilter[] = ["all", "pending", "approved", "rejected", "verified", "entered", "exited"];

export function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<VisitorStatusFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch("/api/admin/visitors");
        const result = (await response.json()) as {
          success: boolean;
          error?: string;
          data?: AdminDashboardData;
        };

        if (!response.ok || !result.success || !result.data) {
          throw new Error(result.error || "Unable to fetch admin dashboard data.");
        }

        if (isMounted) {
          setData(result.data);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError instanceof Error ? loadError.message : "Unable to fetch admin dashboard data.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredVisitors = useMemo(() => {
    if (!data) return [];

    const query = search.trim().toLowerCase();

    return data.visitors.filter((visitor) => {
      const matchesStatus = statusFilter === "all" ? true : visitor.status === statusFilter;
      const matchesSearch =
        query.length === 0
          ? true
          : [
              visitor.visitorName,
              visitor.phone,
              visitor.hostName,
              visitor.passCode,
              visitor.locationUnit,
              visitor.purpose,
            ].some((value) => value.toLowerCase().includes(query));

      return matchesStatus && matchesSearch;
    });
  }, [data, search, statusFilter]);

  const summaryCards = data
    ? [
        { title: "Total visitors", value: data.summary.total, icon: ChartNoAxesColumn },
        { title: "Pending", value: data.summary.pending, icon: Clock3 },
        { title: "Verified", value: data.summary.verified, icon: ShieldCheck },
        { title: "Entered", value: data.summary.entered, icon: LogIn },
        { title: "Exited", value: data.summary.exited, icon: LogOut },
      ]
    : [];

  return (
    <div className="space-y-6">
      <Card className="mesh-card">
        <CardHeader>
          <div className="inline-flex size-12 items-center justify-center rounded-[1.1rem] bg-slate-950 text-white shadow-[0_14px_28px_rgba(15,23,42,0.16)]">
            <ChartNoAxesColumn className="size-6" />
          </div>
          <CardTitle className="mt-5 text-2xl">Visitor analytics and logs</CardTitle>
          <p className="max-w-2xl text-sm leading-7 text-[var(--color-text-muted)]">
            Review headline metrics, then search and filter the visitor log for a clean, presentation-ready operations view.
          </p>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Search visitors">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  className="pl-10"
                  placeholder="Search by name, phone, host, pass code..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </FormField>

            <FormField label="Filter by status">
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((status) => (
                  <Button
                    key={status}
                    type="button"
                    size="sm"
                    variant={statusFilter === status ? "primary" : "secondary"}
                    onClick={() => setStatusFilter(status)}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </FormField>
          </div>

          <div className="mt-5 rounded-[1.35rem] border border-teal-100 bg-teal-50 px-4 py-4 text-sm text-teal-800 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
            <div className="flex items-start gap-3">
              <CheckCheck className="mt-0.5 size-4 shrink-0" />
              <div>
                <p className="font-semibold">Dashboard mode</p>
                <p className="mt-1 leading-6">
                  {error
                    ? error
                    : "Metrics and logs are fetched through the admin API and remain compatible with both MongoDB and demo fallback mode."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="mt-0 py-10">
            <div className="flex items-center justify-center gap-3 text-sm text-[var(--color-text-muted)]">
              <LoaderCircle className="size-4 animate-spin" />
              Loading admin dashboard...
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {summaryCards.map((item) => (
              <AdminSummaryCard key={item.title} title={item.title} value={item.value} icon={item.icon} />
            ))}
          </div>

          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--color-brand)]">Visitor logs</p>
                <CardTitle className="mt-3 text-2xl">Operational records</CardTitle>
              </div>
              <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 shadow-[0_8px_18px_rgba(15,23,42,0.06)]">
                {filteredVisitors.length} record{filteredVisitors.length === 1 ? "" : "s"}
              </div>
            </CardHeader>

            <CardContent className="mt-0 overflow-x-auto">
              {filteredVisitors.length === 0 ? (
                <div className="rounded-[1.6rem] border border-dashed border-slate-200 bg-white/70 p-8 text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--color-brand)]">No records found</p>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">
                    Try adjusting the search query or status filter to surface more visitor records.
                  </p>
                </div>
              ) : (
                <table className="min-w-full border-separate border-spacing-y-3">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
                      <th className="px-4 py-2">Visitor</th>
                      <th className="px-4 py-2">Host</th>
                      <th className="px-4 py-2">Purpose</th>
                      <th className="px-4 py-2">Visit</th>
                      <th className="px-4 py-2">Location</th>
                      <th className="px-4 py-2">Pass</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Entry / Exit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVisitors.map((visitor) => (
                      <AdminLogRow key={visitor.id} visitor={visitor} />
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function AdminLogRow({ visitor }: { visitor: VisitorRecord }) {
  return (
    <tr className="glass-panel align-top shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
      <td className="rounded-l-[1.4rem] px-4 py-4">
        <p className="font-semibold text-slate-950">{visitor.visitorName}</p>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">{visitor.phone}</p>
      </td>
      <td className="px-4 py-4">
        <p className="font-medium text-slate-950">{visitor.hostName}</p>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">Created {formatDateTimeLabel(visitor.createdAt)}</p>
      </td>
      <td className="px-4 py-4 text-sm leading-6 text-slate-700">{visitor.purpose}</td>
      <td className="px-4 py-4">
        <p className="font-medium text-slate-950">{formatDateLabel(visitor.visitDate)}</p>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">{formatTimeLabel(visitor.visitTime)}</p>
      </td>
      <td className="px-4 py-4 text-sm text-slate-700">{visitor.locationUnit}</td>
      <td className="px-4 py-4">
        {visitor.passCode ? (
          <p className="inline-flex rounded-full bg-slate-100 px-3 py-1 font-mono text-sm font-semibold text-slate-950">{visitor.passCode}</p>
        ) : (
          <p className="text-sm font-medium text-[var(--color-text-muted)]">Pending approval</p>
        )}
      </td>
      <td className="px-4 py-4">
        <StatusBadge status={visitor.status} />
      </td>
      <td className="rounded-r-[1.4rem] px-4 py-4">
        <p className="text-sm font-medium text-slate-950">
          {visitor.entryTime ? formatDateTimeLabel(visitor.entryTime) : "Entry not marked"}
        </p>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          {visitor.exitTime ? formatDateTimeLabel(visitor.exitTime) : "Exit not marked"}
        </p>
      </td>
    </tr>
  );
}
