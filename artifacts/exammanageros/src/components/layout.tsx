import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth";
import {
  LayoutDashboard, ListChecks, FileStack, ScrollText, ListTodo,
  MessageSquareText, FolderInput, BarChart3, Settings as SettingsIcon,
  Menu, X, GraduationCap,
} from "lucide-react";
import logoPng from "@/assets/logo.png";
import waveBg from "@assets/ChatGPT_Image_Jul_5,_2026,_03_38_59_PM_(1)_1783455444784.png";
import floralCorner from "@assets/ChatGPT_Image_Jul_5,_2026,_03_38_59_PM_(2)_1783455444784.png";

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
    <div className="flex h-full flex-col relative overflow-hidden bg-white/80 backdrop-blur-xl border-r border-white/40">
      <div className="px-5 pt-8 pb-6 relative z-10">
        <div className="flex flex-col gap-3">
          <img src={logoPng} alt="ExamManagerOS Logo" className="h-12 w-auto object-contain object-left" />
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <span className="inline-flex w-fit rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-2.5 py-1 text-[10px] font-semibold text-purple-800 border border-purple-200 shadow-sm">RoseOS Ecosystem App</span>
          <span className="inline-flex w-fit rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-teal-700 border border-teal-100 shadow-sm">Operator workspace</span>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 relative z-10 pb-20">
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
                "flex items-center gap-3 rounded-[14px] px-3.5 py-3 text-sm font-semibold transition-all duration-300",
                active 
                  ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md shadow-purple-500/20 translate-x-1" 
                  : "text-slate-600 hover:bg-purple-50 hover:text-purple-900"
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0 transition-colors", active ? "text-white" : "text-purple-400 group-hover:text-purple-600")} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-5 py-5 border-t border-purple-100/50 relative z-10 bg-white/50 backdrop-blur-sm">
        <p className="text-[10px] leading-relaxed text-slate-500 font-medium">
          Server-backed operator workspace. Integration adapters are feature-flagged and disabled until credentials are configured.
        </p>
      </div>
      <img src={floralCorner} alt="" className="absolute bottom-0 left-0 w-48 opacity-40 pointer-events-none mix-blend-multiply" />
    </div>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const initials = user?.name?.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase() ?? "??";

  return (
    <div className="min-h-screen text-foreground relative selection:bg-purple-200 selection:text-purple-900">
      {/* Background layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src={waveBg} alt="" className="absolute top-0 left-0 w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-purple-50/60 to-pink-50/40 backdrop-blur-[2px]" />
      </div>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[280px] lg:block shadow-2xl shadow-purple-900/5">
        <SidebarContent current={location} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-purple-900/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[280px] bg-white shadow-2xl">
            <button
              className="absolute right-4 top-5 rounded-full p-1.5 text-slate-400 hover:bg-purple-50 hover:text-purple-600 transition-colors z-20 bg-white shadow-sm border border-purple-100"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent current={location} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-[280px] relative z-10 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-white/40 bg-white/60 px-5 py-4 backdrop-blur-xl shadow-sm lg:px-8">
          <button
            className="rounded-xl p-2 text-slate-500 hover:bg-purple-50 hover:text-purple-600 lg:hidden transition-colors bg-white shadow-sm border border-purple-100"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2.5 text-sm">
            <span className="hidden sm:inline font-medium text-slate-500">Contractor Compliance Authority</span>
            <span className="hidden sm:inline text-purple-200 font-bold">/</span>
            <span className="font-semibold text-purple-900">Exam Lifecycle Operations</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden rounded-full border border-purple-200 bg-purple-50/80 px-3 py-1 text-[11px] font-bold text-purple-700 sm:inline shadow-sm backdrop-blur-md">
              {user?.role ?? "operator"}
            </span>
            <button type="button" onClick={() => void logout()} className="hidden sm:inline text-[11px] font-semibold text-slate-500 hover:text-purple-700">Sign out</button>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-bold text-white shadow-md shadow-pink-500/20 ring-2 ring-white" title={user?.name}>
              {initials}
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1400px] px-4 py-8 lg:px-8 lg:py-10 flex-1">{children}</main>
      </div>
    </div>
  );
}
