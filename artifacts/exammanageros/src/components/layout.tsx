import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, ListChecks, FileStack, ScrollText, ListTodo,
  MessageSquareText, FolderInput, BarChart3, Settings as SettingsIcon,
  Menu, X, GraduationCap,
} from "lucide-react";

const NAV = [
  { href: "/", label: "Command Desk", icon: LayoutDashboard },
  { href: "/queue", label: "Exam Queue", icon: ListChecks },
  { href: "/applications", label: "Applications Blocked", icon: FileStack },
  { href: "/transcripts", label: "Transcripts", icon: ScrollText },
  { href: "/tasks", label: "Tasks & Escalations", icon: ListTodo },
  { href: "/client-updates", label: "Client Updates", icon: MessageSquareText },
  { href: "/doc-collect", label: "Doc Collection", icon: FolderInput },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

function isActive(current: string, href: string) {
  if (href === "/") return current === "/" || current === "";
  return current === href || current.startsWith(href + "/");
}

function SidebarContent({ current, onNavigate }: { current: string; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-violet-500 text-white shadow-sm">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[15px] font-semibold text-slate-900 leading-tight">ExamsManagerOS</div>
            <div className="text-[10px] font-medium text-slate-400">Manage · Prepare · Succeed</div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-sky-700 border border-sky-200">RoseOS Ecosystem App</span>
          <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-medium text-violet-700 border border-violet-200">Protected Preview</span>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
        {NAV.map((item) => {
          const active = isActive(current, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              data-testid={`nav-${item.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-sky-50 text-sky-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className={cn("h-4.5 w-4.5 shrink-0", active ? "text-sky-600" : "text-slate-400")} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-5 py-4 border-t border-slate-100">
        <p className="text-[10px] leading-relaxed text-slate-400">
          Representative data. External sending, live CRM updates, ComplianceConnect publishing, Doc Collection sync,
          and WorkDrive updates are disabled unless connected integrations are enabled.
        </p>
      </div>
    </div>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white lg:block">
        <SidebarContent current={location} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/30" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl">
            <button
              className="absolute right-3 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent current={location} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:px-8">
          <button
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="hidden sm:inline">Contractor Compliance Authority</span>
            <span className="hidden sm:inline text-slate-300">/</span>
            <span className="font-medium text-slate-700">Exam Lifecycle Operations</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700 sm:inline">
              External sending disabled
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-violet-500 text-xs font-semibold text-white">
              RT
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1400px] px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
