import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

export function Badge({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap", className)}>
      {children}
    </span>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1 max-w-2xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-2xl border border-slate-200 bg-white shadow-sm", className)}>{children}</div>;
}

export function SectionCard({ title, action, children, className }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="flex items-center justify-between gap-2 px-5 py-3.5 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </Card>
  );
}

const KPI_TONE: Record<string, string> = {
  blue: "border-sky-200 hover:border-sky-300 [&_.kpi-val]:text-sky-700 [&_.kpi-dot]:bg-sky-500",
  teal: "border-teal-200 hover:border-teal-300 [&_.kpi-val]:text-teal-700 [&_.kpi-dot]:bg-teal-500",
  amber: "border-amber-200 hover:border-amber-300 [&_.kpi-val]:text-amber-700 [&_.kpi-dot]:bg-amber-500",
  coral: "border-rose-200 hover:border-rose-300 [&_.kpi-val]:text-rose-700 [&_.kpi-dot]:bg-rose-500",
  purple: "border-violet-200 hover:border-violet-300 [&_.kpi-val]:text-violet-700 [&_.kpi-dot]:bg-violet-500",
  slate: "border-slate-200 hover:border-slate-300 [&_.kpi-val]:text-slate-700 [&_.kpi-dot]:bg-slate-400",
};

export function KpiCard({ label, value, tone, href }: { label: string; value: number; tone: string; href: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col justify-between rounded-2xl border bg-white p-4 shadow-sm transition-all hover:shadow-md cursor-pointer",
        KPI_TONE[tone] ?? KPI_TONE.slate
      )}
      data-testid={`kpi-${label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
    >
      <div className="flex items-center justify-between">
        <span className="kpi-dot h-2 w-2 rounded-full" />
        <span className="text-[10px] font-medium uppercase tracking-wide text-slate-400 group-hover:text-slate-500">View →</span>
      </div>
      <div className="mt-3">
        <div className="kpi-val text-3xl font-semibold tabular-nums">{value}</div>
        <div className="text-xs font-medium text-slate-500 mt-0.5 leading-tight">{label}</div>
      </div>
    </Link>
  );
}

export function EmptyState({ message }: { message: string }) {
  return <div className="py-10 text-center text-sm text-slate-400">{message}</div>;
}

export function PreviewBanner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-start gap-2 rounded-xl border border-violet-200 bg-violet-50/70 px-4 py-3 text-xs text-violet-800", className)}>
      <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
      <p>
        <span className="font-semibold">Protected Preview.</span> External sending, live CRM/Zoho updates, ComplianceConnect
        publishing, Doc Collection sync, and WorkDrive updates are disabled in this build. Actions update local
        representative data only.
      </p>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</div>
      <div className="text-sm text-slate-800 mt-0.5">{children ?? <span className="text-slate-300">—</span>}</div>
    </div>
  );
}

export function fmtDate(d: string | null): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
