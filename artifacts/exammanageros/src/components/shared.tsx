import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

export function Badge({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border border-purple-100 bg-purple-50/50 px-2.5 py-0.5 text-xs font-semibold text-purple-800 whitespace-nowrap shadow-sm", className)}>
      {children}
    </span>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-purple-950 tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-purple-900/60 mt-1.5 max-w-2xl font-medium">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-[24px] border border-white/60 bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]", className)}>{children}</div>;
}

export function SectionCard({ title, action, children, className }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <Card className={cn("overflow-hidden flex flex-col", className)}>
      <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-purple-100/50 bg-white/40">
        <h2 className="text-base font-bold text-purple-950">{title}</h2>
        {action}
      </div>
      <div className="p-6 flex-1">{children}</div>
    </Card>
  );
}

const KPI_TONE: Record<string, string> = {
  blue: "border-blue-200/50 hover:border-blue-300 [&_.kpi-val]:text-blue-700 [&_.kpi-dot]:bg-blue-500",
  teal: "border-teal-200/50 hover:border-teal-300 [&_.kpi-val]:text-teal-700 [&_.kpi-dot]:bg-teal-500",
  amber: "border-amber-200/50 hover:border-amber-300 [&_.kpi-val]:text-amber-700 [&_.kpi-dot]:bg-amber-500",
  coral: "border-rose-200/50 hover:border-rose-300 [&_.kpi-val]:text-rose-700 [&_.kpi-dot]:bg-rose-500",
  purple: "border-purple-200/50 hover:border-purple-300 [&_.kpi-val]:text-purple-700 [&_.kpi-dot]:bg-purple-500",
  slate: "border-slate-200/50 hover:border-purple-300 [&_.kpi-val]:text-slate-700 [&_.kpi-dot]:bg-slate-400",
};

export function KpiCard({ label, value, tone, href }: { label: string; value: number; tone: string; href: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col justify-between rounded-[20px] border border-white bg-white/60 backdrop-blur-lg p-5 shadow-[0_8px_20px_rgb(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_12px_25px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 cursor-pointer relative overflow-hidden",
        KPI_TONE[tone] ?? KPI_TONE.slate
      )}
      data-testid={`kpi-${label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-10"></div>
      <div className="flex items-center justify-between">
        <span className="kpi-dot h-2.5 w-2.5 rounded-full shadow-sm" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-purple-500 transition-colors">View →</span>
      </div>
      <div className="mt-4">
        <div className="kpi-val text-4xl font-black tabular-nums tracking-tight">{value}</div>
        <div className="text-sm font-semibold text-slate-500 mt-1 leading-tight">{label}</div>
      </div>
    </Link>
  );
}

export function EmptyState({ message }: { message: string }) {
  return <div className="py-12 px-6 text-center text-sm font-medium text-slate-400 bg-white/30 rounded-[20px] border border-dashed border-purple-200/60 backdrop-blur-sm">{message}</div>;
}

export function PreviewBanner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-start gap-3 rounded-2xl border border-pink-200 bg-gradient-to-r from-pink-50/80 to-purple-50/80 px-5 py-4 text-sm text-pink-900 shadow-sm backdrop-blur-md", className)}>
      <ShieldCheck className="h-5 w-5 shrink-0 mt-0.5 text-pink-500" />
      <p className="leading-relaxed">
        <span className="font-bold">Protected Preview.</span> External sending, live CRM/Zoho updates, ComplianceConnect
        publishing, Doc Collection sync, and WorkDrive updates are disabled in this build. Actions update local
        representative data only.
      </p>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="group">
      <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400/80 group-hover:text-purple-400 transition-colors">{label}</div>
      <div className="text-[15px] font-medium text-slate-800 mt-1 leading-snug">{children ?? <span className="text-slate-300">—</span>}</div>
    </div>
  );
}

export function fmtDate(d: string | null): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
