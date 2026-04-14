export function SiteFooter() {
  return (
    <footer className="premium-divider mt-10 border-t py-8 sm:py-10">
      <div className="flex flex-col gap-3 text-sm text-[var(--color-text-muted)] md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-medium text-slate-800">Smart GatePass</p>
          <p className="mt-1">Pre-registration, secure verification, and visitor tracking for modern entry points.</p>
        </div>
        <p className="text-sm">Built with Next.js, TypeScript, Tailwind CSS, and MongoDB-ready APIs. by TSK</p>
      </div>
    </footer>
  );
}
