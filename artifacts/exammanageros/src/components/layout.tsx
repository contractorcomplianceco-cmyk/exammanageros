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
        <div className="h-16 flex items-center px-6 border-b border-border">
          <img src={logoPath} alt="ExamManagerOS Logo" className="h-9 object-contain" />
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
        <div className="p-4 rounded-xl border border-border bg-card/50 shadow-sm">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">ComplianceConnect</h4>
          <p className="text-sm font-medium mb-1">Atlantic Mechanical</p>
          <div className="text-xs text-muted-foreground mb-3 space-y-1">
            <p>• 2 Missing Items</p>
            <p>• 1 Upcoming Exam</p>
          </div>
          <Link href="/compliance-connect" onClick={onNavigate}>
            <Button variant="outline" size="sm" className="w-full text-xs font-medium bg-white">Open Portal</Button>
          </Link>
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
