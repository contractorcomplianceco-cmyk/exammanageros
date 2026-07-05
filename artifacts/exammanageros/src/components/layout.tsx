import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  ListTodo, 
  Files, 
  Mail, 
  MonitorPlay, 
  FolderSync, 
  BarChart3, 
  Settings,
  Bell,
  Search,
  Menu
} from "lucide-react";
import logoPath from "@assets/ExamManagerOS_1783275986154.png";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/queue", label: "Exam Queue", icon: ListTodo, badge: 16 },
  { href: "/records", label: "Records", icon: Files },
  { href: "/emails", label: "Email Drafts", icon: Mail, badge: 12 },
  { href: "/compliance-connect", label: "ComplianceConnect", icon: MonitorPlay },
  { href: "/doc-collect", label: "DocCollect", icon: FolderSync },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const [location] = useLocation();
  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center px-2 py-2 border-b border-border">
          <img src={logoPath} alt="ExamManagerOS Logo" className="w-full max-w-[220px] object-contain" />
        </div>
        <nav className="p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={onNavigate}>
                <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${isActive ? 'bg-gradient-to-r from-[#FF4FA3]/10 to-[#7C3AED]/10 text-primary font-medium shadow-sm' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'}`}>
                  <div className="flex items-center gap-3">
                    <item.icon className={`h-5 w-5 ${isActive ? 'text-[#E633FF]' : ''}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge variant={isActive ? "default" : "secondary"} className={isActive ? "bg-gradient-to-r from-[#FF4FA3] to-[#7C3AED]" : ""}>
                      {item.badge}
                    </Badge>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4">
        <div className="relative rounded-2xl p-4 overflow-hidden bg-gradient-to-br from-[#07184A] via-[#3B2B8F] to-[#7C3AED] shadow-[0_12px_28px_-14px_rgba(124,58,237,0.6)]">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#E633FF]/40 blur-2xl rounded-full pointer-events-none" />
          <div className="absolute -bottom-8 -left-4 w-24 h-24 bg-[#38A3FF]/30 blur-2xl rounded-full pointer-events-none" />
          <div className="relative z-10 text-white">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/60">Client Portal</p>
                <p className="text-sm font-bold leading-tight">Atlantic Mechanical</p>
              </div>
              <div className="relative w-11 h-11 flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
                  <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
                  <circle cx="22" cy="22" r="18" fill="none" stroke="#20C7C7" strokeWidth="4" strokeLinecap="round" strokeDasharray={2 * Math.PI * 18} strokeDashoffset={2 * Math.PI * 18 * (1 - 0.75)} />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">75%</span>
              </div>
            </div>
            <div className="space-y-1.5 mb-3">
              {[
                { label: "Document Requests", value: 3 },
                { label: "Missing Items", value: 2 },
                { label: "Upcoming Exams", value: 4 },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between text-[11px]">
                  <span className="text-white/70">{row.label}</span>
                  <span className="font-semibold bg-white/15 rounded-md px-1.5 py-0.5 backdrop-blur-sm">{row.value}</span>
                </div>
              ))}
            </div>
            <Link href="/compliance-connect" onClick={onNavigate}>
              <Button size="sm" className="w-full text-xs font-semibold bg-white/95 text-[#07184A] hover:bg-white border-0 shadow-sm">Open Portal</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <aside className="hidden md:flex w-64 flex-shrink-0 border-r border-border bg-sidebar flex-col">
        <SidebarContent />
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#F7FAFF]">
        <header className="h-16 flex-shrink-0 border-b border-border bg-white px-4 sm:px-6 flex items-center justify-between gap-3">
          <div className="flex items-center flex-1 min-w-0 gap-3">
            <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden flex-shrink-0" data-testid="button-mobile-nav">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 bg-sidebar">
                <SidebarContent onNavigate={() => setMobileNavOpen(false)} />
              </SheetContent>
            </Sheet>
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pl-9 bg-muted/50 border-transparent focus-visible:ring-primary/20 rounded-full w-full"
                placeholder="Search exams, clients, contacts..."
              />
              <div className="hidden sm:block absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground border border-border rounded px-1.5 py-0.5 bg-background">
                ⌘ K
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <Button variant="ghost" size="icon" className="relative rounded-full hidden sm:inline-flex">
              <Mail className="h-5 w-5 text-foreground/70" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full hidden sm:inline-flex">
              <Bell className="h-5 w-5 text-foreground/70" />
            </Button>
            <div className="flex items-center gap-3 sm:pl-4 sm:border-l border-border">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">Rose Taylor</p>
                <p className="text-xs text-muted-foreground">CEO</p>
              </div>
              <Avatar className="h-9 w-9 ring-2 ring-primary/10">
                <AvatarFallback className="bg-gradient-to-tr from-[#246BFE] to-[#E633FF] text-white">RT</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
