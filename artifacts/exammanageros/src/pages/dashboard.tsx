import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_EXAM_QUEUE, EXAM_STATUSES, STATES, VENDORS, OWNERS, type ExamRow } from "@/data/mock-data";
import { getStatusColor } from "@/lib/status";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";
import { useToast } from "@/hooks/use-toast";
import heroFloral from "@assets/hero-floral.png";
import {
  Filter, Download, Plus, ArrowUpRight, TrendingUp, TrendingDown, AlertCircle, Clock,
  CalendarDays, UserX, FileWarning, ListTodo, Search, CheckCircle2, Circle, X,
  Mail, FileCheck, CreditCard, CalendarCheck, ExternalLink, Zap, Pencil, MapPin,
} from "lucide-react";

const KPIS = [
  { label: "Exams Needing Scheduling", value: "32", trend: "5", up: true, icon: ListTodo, hex: "#7C3AED", from: "from-[#7C3AED]/10", ring: "ring-[#7C3AED]/20" },
  { label: "Exams Coming Up", value: "18", trend: "4", up: true, icon: CalendarDays, hex: "#246BFE", from: "from-[#246BFE]/10", ring: "ring-[#246BFE]/20" },
  { label: "Missed Exams", value: "3", trend: "1", up: true, icon: AlertCircle, hex: "#FF7C7C", from: "from-[#FF7C7C]/15", ring: "ring-[#FF7C7C]/20" },
  { label: "Approaching Deadlines", value: "21", trend: "6", up: true, icon: Clock, hex: "#FF9A5C", from: "from-[#FF9A5C]/15", ring: "ring-[#FF9A5C]/20" },
  { label: "Client Not Responding", value: "14", trend: "2", up: false, icon: UserX, hex: "#20C7C7", from: "from-[#20C7C7]/12", ring: "ring-[#20C7C7]/20" },
  { label: "Prep Not Delivered", value: "7", trend: "2", up: true, icon: FileWarning, hex: "#FF4FA3", from: "from-[#FF4FA3]/12", ring: "ring-[#FF4FA3]/20" },
];

const pipelineData = [
  { name: "Wk1", value: 320 }, { name: "Wk2", value: 480 }, { name: "Wk3", value: 420 },
  { name: "Wk4", value: 640 }, { name: "Wk5", value: 580 }, { name: "Wk6", value: 760 }, { name: "Wk7", value: 820 },
];

const pipelineStages = [
  { label: "Qualification", value: "$480K", color: "#38A3FF" },
  { label: "Proposal", value: "$760K", color: "#7C3AED" },
  { label: "Negotiation", value: "$820K", color: "#E633FF" },
  { label: "Closed Won", value: "$420K", color: "#20C7C7" },
];

const activityFeed = [
  { icon: CalendarCheck, color: "#246BFE", text: "New exam scheduled for", who: "Blue Ridge Partners", time: "2m ago" },
  { icon: FileCheck, color: "#7C3AED", text: "Prep documents received from", who: "Pinnacle Mechanical", time: "15m ago" },
  { icon: Mail, color: "#E633FF", text: "Email sent to", who: "Summit Builders LLC", time: "32m ago" },
  { icon: CreditCard, color: "#20C7C7", text: "Payment confirmed from", who: "Coastal Plumbing Pros", time: "1h ago" },
];

const strategicFocus = [
  { label: "Increase on-time exam rate", value: 92, color: "#20C7C7" },
  { label: "Reduce client response time", value: 68, color: "#246BFE" },
  { label: "Improve prep delivery", value: 85, color: "#FF4FA3" },
  { label: "Expand vendor partnerships", value: 55, color: "#7C3AED" },
];

function ownerGradient(owner: string) {
  const map: Record<string, string> = {
    RT: "from-[#246BFE] to-[#E633FF]", LK: "from-[#7C3AED] to-[#38A3FF]", PS: "from-[#FF4FA3] to-[#7C3AED]",
    TE: "from-[#20C7C7] to-[#246BFE]", EL: "from-[#FF9A5C] to-[#FF4FA3]", ME: "from-[#38A3FF] to-[#20C7C7]",
    KC: "from-[#E633FF] to-[#FF4FA3]",
  };
  return map[owner] ?? "from-[#246BFE] to-[#7C3AED]";
}

export default function Dashboard() {
  const { toast } = useToast();
  const [selected, setSelected] = useState<ExamRow>(
    MOCK_EXAM_QUEUE.find((r) => r.client === "Pinnacle Mechanical") ?? MOCK_EXAM_QUEUE[0]
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [newExamOpen, setNewExamOpen] = useState(false);
  const [fullRecordOpen, setFullRecordOpen] = useState(false);

  const filtered = useMemo(() => {
    return MOCK_EXAM_QUEUE.filter((row) => {
      const matchesSearch =
        !search ||
        row.client.toLowerCase().includes(search.toLowerCase()) ||
        row.contact.toLowerCase().includes(search.toLowerCase()) ||
        row.license.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || row.status === statusFilter;
      const matchesState = stateFilter === "all" || row.state === stateFilter;
      return matchesSearch && matchesStatus && matchesState;
    });
  }, [search, statusFilter, stateFilter]);

  const activeFilters = [statusFilter !== "all", stateFilter !== "all"].filter(Boolean).length;
  const rowStatuses = Array.from(new Set(MOCK_EXAM_QUEUE.map((r) => r.status)));
  const dateTime = selected.scheduledDate === "Not Scheduled" ? "Not Scheduled" : `${selected.scheduledDate}, 9:00 AM EDT`;

  const capacity = 78;
  const ringCirc = 2 * Math.PI * 40;

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 max-w-[1600px] mx-auto">

        {/* Hero */}
        <div className="relative rounded-[28px] overflow-hidden bg-gradient-to-br from-white via-[#FBF4FF] to-[#EEE7FF] p-6 sm:p-9 border border-white shadow-[0_10px_40px_-12px_rgba(124,58,237,0.25)]">
          <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/4 w-[28rem] h-[28rem] bg-[#FF4FA3]/12 blur-[90px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 translate-y-1/2 w-72 h-72 bg-[#38A3FF]/12 blur-[80px] rounded-full pointer-events-none" />
          <img
            src={heroFloral}
            alt=""
            aria-hidden="true"
            className="absolute -top-6 -right-8 w-64 sm:w-80 lg:w-[26rem] opacity-70 mix-blend-multiply pointer-events-none select-none"
          />

          <div className="relative z-10">
            <p className="text-sm font-semibold text-[#7C3AED] mb-3 tracking-wide">Good morning, Rose 👋</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#07184A] tracking-tight leading-[1.05]">
              Lead with clarity.<br className="hidden sm:block" /> Deliver with confidence.
            </h1>
            <p className="mt-4 text-xl sm:text-2xl italic font-medium bg-gradient-to-r from-[#FF4FA3] via-[#E633FF] to-[#7C3AED] bg-clip-text text-transparent w-fit" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
              Excellence is scheduled.
            </p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {KPIS.map((k) => (
            <Card
              key={k.label}
              className={`group relative overflow-hidden rounded-[22px] border-white/60 shadow-[0_8px_24px_-12px_rgba(7,24,74,0.18)] bg-gradient-to-b ${k.from} to-white hover:-translate-y-1 hover:shadow-[0_16px_36px_-14px_rgba(7,24,74,0.28)] transition-all duration-300`}
              data-testid={`card-kpi-${k.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
            >
              <CardContent className="p-4 sm:p-5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ring-4 ${k.ring} shadow-sm`} style={{ backgroundColor: `${k.hex}1a`, color: k.hex }}>
                  <k.icon className="h-[18px] w-[18px]" />
                </div>
                <p className="text-[13px] font-medium text-[#07184A]/60 leading-snug min-h-[34px]">{k.label}</p>
                <div className="mt-1.5 flex items-end justify-between">
                  <h3 className="text-[28px] font-bold text-[#07184A] leading-none">{k.value}</h3>
                  <span className={`text-xs font-semibold flex items-center gap-0.5 ${k.up ? "text-emerald-600" : "text-rose-500"}`}>
                    {k.up ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}{k.trend}
                  </span>
                </div>
                <p className="text-[10px] text-[#07184A]/40 mt-1 font-medium">vs last 7 days</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col xl:flex-row gap-6 items-start">

          {/* Left column */}
          <div className="flex-1 w-full min-w-0 space-y-6">

            {/* Exam Queue table */}
            <Card className="rounded-[24px] border-white/60 shadow-[0_10px_30px_-14px_rgba(7,24,74,0.2)] overflow-hidden bg-white">
              <div className="p-4 sm:p-5 border-b border-border/50 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-[#07184A]">Exam Queue</h2>
                  <Badge className="bg-gradient-to-r from-[#E633FF] to-[#7C3AED] border-0 shadow-sm">{filtered.length}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <div className="relative w-full sm:w-56">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input className="h-9 pl-9 bg-muted/30 rounded-full" placeholder="Search queue..." value={search} onChange={(e) => setSearch(e.target.value)} data-testid="input-search-queue" />
                  </div>

                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9 rounded-full" data-testid="button-filters">
                        <Filter className="h-4 w-4 mr-2" /> Filters
                        {activeFilters > 0 && <Badge className="ml-2 bg-[#7C3AED] h-5 px-1.5 border-0">{activeFilters}</Badge>}
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader><SheetTitle>Filter Exams</SheetTitle></SheetHeader>
                      <div className="space-y-5 py-6">
                        <div className="space-y-1.5">
                          <Label>Exam Status</Label>
                          <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger data-testid="select-filter-status"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All statuses</SelectItem>
                              {rowStatuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label>State</Label>
                          <Select value={stateFilter} onValueChange={setStateFilter}>
                            <SelectTrigger data-testid="select-filter-state"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All states</SelectItem>
                              {STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <SheetFooter>
                        <Button variant="outline" onClick={() => { setStatusFilter("all"); setStateFilter("all"); }}>
                          <X className="h-4 w-4 mr-1" /> Clear all
                        </Button>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>

                  <Button
                    variant="outline" size="sm" className="h-9 rounded-full" data-testid="button-export"
                    onClick={() => toast({ title: "Prototype export generated", description: "A sample CSV would download in the live app." })}
                  >
                    <Download className="h-4 w-4 mr-2" /> Export
                  </Button>

                  <Dialog open={newExamOpen} onOpenChange={setNewExamOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="h-9 rounded-full bg-gradient-to-r from-[#FF4FA3] to-[#7C3AED] hover:opacity-90 border-0 shadow-md" data-testid="button-new-exam">
                        <Plus className="h-4 w-4 mr-1" /> New Exam
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader><DialogTitle className="text-[#07184A]">Create New Exam Record</DialogTitle></DialogHeader>
                      <div className="grid grid-cols-2 gap-4 py-2">
                        <div className="col-span-2 space-y-1.5">
                          <Label>Client / Company</Label>
                          <Input placeholder="Acme Contracting" data-testid="input-new-client" />
                        </div>
                        <div className="space-y-1.5">
                          <Label>State</Label>
                          <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>{STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label>Vendor</Label>
                          <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>{VENDORS.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select>
                        </div>
                        <div className="col-span-2 space-y-1.5">
                          <Label>License / Application</Label>
                          <Input placeholder="General Contractor" />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Exam Status</Label>
                          <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>{EXAM_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
                        </div>
                        <div className="space-y-1.5">
                          <Label>Owner</Label>
                          <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>{OWNERS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setNewExamOpen(false)}>Cancel</Button>
                        <Button className="bg-gradient-to-r from-[#FF4FA3] to-[#7C3AED] border-0" data-testid="button-save-new-exam"
                          onClick={() => { setNewExamOpen(false); toast({ title: "Prototype record created", description: "No data is persisted in this prototype." }); }}>
                          Create Record
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-border/50 bg-[#F7FAFF]">
                      {["Client / Company", "State", "License / Application", "Exam Type", "Exam Status", "App Status", "Scheduled", "Deadline", "Vendor", "Owner"].map((h) => (
                        <TableHead key={h} className="text-[11px] uppercase font-semibold text-[#07184A]/50 tracking-wider whitespace-nowrap">{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((row) => {
                      const active = selected.id === row.id;
                      return (
                        <TableRow
                          key={row.id}
                          onClick={() => setSelected(row)}
                          data-testid={`row-exam-${row.id}`}
                          className={`cursor-pointer transition-colors border-border/40 ${active ? "bg-gradient-to-r from-[#FF4FA3]/[0.06] to-[#7C3AED]/[0.06]" : "hover:bg-[#F7FAFF]"}`}
                        >
                          <TableCell className="font-semibold text-[#07184A] whitespace-nowrap">{row.client}</TableCell>
                          <TableCell><Badge variant="outline" className="bg-muted/40 font-medium">{row.state}</Badge></TableCell>
                          <TableCell className="text-sm text-[#07184A]/70 whitespace-nowrap">{row.license}</TableCell>
                          <TableCell className="text-sm text-[#07184A]/60 whitespace-nowrap">{row.examType}</TableCell>
                          <TableCell><Badge variant="outline" className={`font-medium border whitespace-nowrap ${getStatusColor(row.status)}`}>{row.status}</Badge></TableCell>
                          <TableCell><Badge variant="outline" className={`font-medium border whitespace-nowrap ${getStatusColor(row.appStatus)}`}>{row.appStatus}</Badge></TableCell>
                          <TableCell className="text-sm font-medium text-[#07184A]/70 whitespace-nowrap">{row.scheduledDate}</TableCell>
                          <TableCell className="text-sm font-medium text-[#07184A]/70 whitespace-nowrap">{row.deadline}</TableCell>
                          <TableCell className="text-sm text-[#07184A]/60 whitespace-nowrap">{row.vendor}</TableCell>
                          <TableCell>
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${ownerGradient(row.owner)} text-white text-[11px] font-bold flex items-center justify-center shadow-sm`} title={row.ownerName}>
                              {row.owner}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {filtered.length === 0 && (
                      <TableRow><TableCell colSpan={10} className="text-center py-12 text-muted-foreground">No exams match your filters.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="p-4 border-t border-border/50 flex justify-between items-center text-sm text-muted-foreground">
                <span>Showing {filtered.length} of {MOCK_EXAM_QUEUE.length} results</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-full" disabled>Previous</Button>
                  <Button variant="outline" size="sm" className="rounded-full">Next</Button>
                </div>
              </div>
            </Card>

            {/* Bottom Widgets Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* Activity Feed */}
              <Card className="rounded-[22px] border-white/60 shadow-[0_8px_24px_-14px_rgba(7,24,74,0.18)] bg-white">
                <CardHeader className="flex-row items-center justify-between pb-3">
                  <CardTitle className="text-sm font-bold text-[#07184A]">Activity Feed</CardTitle>
                  <button className="text-xs font-medium text-[#7C3AED] hover:underline">View all</button>
                </CardHeader>
                <CardContent className="space-y-3.5">
                  {activityFeed.map((a, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${a.color}1a`, color: a.color }}>
                        <a.icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-[#07184A]/80 leading-snug">{a.text} <span className="font-semibold text-[#07184A]">{a.who}</span></p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Strategic Focus */}
              <Card className="rounded-[22px] border-white/60 shadow-[0_8px_24px_-14px_rgba(7,24,74,0.18)] bg-white">
                <CardHeader className="flex-row items-center justify-between pb-3">
                  <CardTitle className="text-sm font-bold text-[#07184A]">Strategic Focus</CardTitle>
                  <button className="text-xs font-medium text-[#7C3AED] hover:underline">View all</button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {strategicFocus.map((s) => (
                    <div key={s.label}>
                      <div className="flex justify-between text-xs mb-1.5 font-medium">
                        <span className="text-[#07184A]/70">{s.label}</span>
                        <span className="text-[#07184A] font-semibold">{s.value}%</span>
                      </div>
                      <div className="h-2 w-full bg-muted/60 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${s.value}%`, backgroundColor: s.color }} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Team Pulse */}
              <Card className="rounded-[22px] border-white/60 shadow-[0_8px_24px_-14px_rgba(7,24,74,0.18)] bg-white">
                <CardHeader className="flex-row items-center justify-between pb-3">
                  <CardTitle className="text-sm font-bold text-[#07184A]">Team Pulse</CardTitle>
                  <span className="text-[11px] text-muted-foreground font-medium">This Week</span>
                </CardHeader>
                <CardContent className="flex items-center gap-5">
                  <div className="relative w-[104px] h-[104px] flex-shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#EEE7FF" strokeWidth="10" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="url(#pulseGrad)" strokeWidth="10" strokeLinecap="round"
                        strokeDasharray={ringCirc} strokeDashoffset={ringCirc * (1 - capacity / 100)} />
                      <defs>
                        <linearGradient id="pulseGrad" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#7C3AED" /><stop offset="100%" stopColor="#E633FF" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-[#07184A] leading-none">{capacity}%</span>
                      <span className="text-[10px] text-muted-foreground font-medium mt-0.5">Capacity</span>
                    </div>
                  </div>
                  <div className="text-sm space-y-1.5 flex-1">
                    <div className="flex items-center justify-between"><span className="text-[#07184A]/60 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" />On Track</span><span className="font-semibold text-[#07184A]">26</span></div>
                    <div className="flex items-center justify-between"><span className="text-[#07184A]/60 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#FF7C7C]" />At Risk</span><span className="font-semibold text-[#07184A]">6</span></div>
                    <div className="flex items-center justify-between"><span className="text-[#07184A]/60 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#7C3AED]" />Overloaded</span><span className="font-semibold text-[#07184A]">3</span></div>
                    <div className="flex items-center justify-between"><span className="text-[#07184A]/60 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#20C7C7]" />Available</span><span className="font-semibold text-[#07184A]">5</span></div>
                  </div>
                </CardContent>
              </Card>

              {/* Pipeline Overview */}
              <Card className="rounded-[22px] border-white/60 shadow-[0_8px_24px_-14px_rgba(7,24,74,0.18)] bg-white">
                <CardHeader className="flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-bold text-[#07184A]">Pipeline Overview</CardTitle>
                  <span className="text-[11px] text-muted-foreground font-medium">This Month</span>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2 mb-1">
                    <p className="text-2xl font-bold text-[#07184A] leading-none">$2.48M</p>
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5 mb-0.5"><TrendingUp className="h-3.5 w-3.5" /> 23%</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mb-1">Total pipeline value</p>
                  <div className="h-[64px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={pipelineData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="pipeGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.35} /><stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Tooltip cursor={{ stroke: "#7C3AED", strokeWidth: 1 }} contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.12)", fontSize: "12px" }} formatter={(v: number) => [`$${v}K`, "Value"]} />
                        <Area type="monotone" dataKey="value" stroke="#7C3AED" strokeWidth={2.5} fill="url(#pipeGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3">
                    {pipelineStages.map((s) => (
                      <div key={s.label} className="flex items-center justify-between text-xs">
                        <span className="text-[#07184A]/60 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />{s.label}</span>
                        <span className="font-semibold text-[#07184A]">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Integration placeholder */}
            <Card className="rounded-[22px] border-white/60 shadow-[0_8px_24px_-14px_rgba(7,24,74,0.18)] bg-gradient-to-br from-white to-[#EAF3FF] overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#246BFE]/10 text-[#246BFE] flex items-center justify-center"><Zap className="h-4 w-4" /></div>
                    <h3 className="text-sm font-bold text-[#07184A]">Automation Flow</h3>
                  </div>
                  <Badge variant="outline" className="bg-white/70 text-[#07184A]/60 font-medium">Prototype</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                  <span className="px-3 py-2 rounded-xl bg-white border border-border/50 shadow-sm text-[#07184A]">Zoho Books · Invoice Paid</span>
                  <ArrowUpRight className="h-4 w-4 text-[#7C3AED] rotate-45" />
                  <span className="px-3 py-2 rounded-xl bg-white border border-border/50 shadow-sm text-[#07184A]">QA Queue Created</span>
                  <ArrowUpRight className="h-4 w-4 text-[#7C3AED] rotate-45" />
                  <span className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#FF4FA3] to-[#7C3AED] text-white shadow-sm">Record in ExamManagerOS</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-3">Default owner: Skylar · AuditEngine connection coming soon. No live integration is active in this prototype.</p>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel */}
          <div className="w-full xl:w-[400px] flex-shrink-0 xl:sticky xl:top-4">
            <Card className="shadow-[0_16px_44px_-18px_rgba(7,24,74,0.4)] border-white/60 bg-white rounded-[24px] overflow-hidden">
              <div className="relative bg-gradient-to-br from-[#07184A] via-[#246BFE] to-[#7C3AED] p-6 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#E633FF]/30 blur-3xl rounded-full -translate-y-1/3 translate-x-1/4" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <Badge className="bg-white/20 hover:bg-white/25 text-white border-white/20 backdrop-blur-sm">Exam Record</Badge>
                    <button className="text-xs font-medium text-white/80 hover:text-white flex items-center gap-1"><Pencil className="h-3 w-3" /> Edit</button>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold leading-tight">{selected.client}</h3>
                    <Badge className={`border ${getStatusColor(selected.status)}`}>{selected.status}</Badge>
                  </div>
                  <p className="text-white/75 text-sm">{selected.license} License • {selected.state}</p>
                </div>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <div className="px-5 pt-4 border-b border-border">
                  <TabsList className="w-full bg-muted/50 h-10">
                    <TabsTrigger value="overview" className="flex-1 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">Overview</TabsTrigger>
                    <TabsTrigger value="notes" className="flex-1 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">Notes</TabsTrigger>
                    <TabsTrigger value="history" className="flex-1 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">History</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="overview" className="p-5 space-y-5 m-0 focus-visible:outline-none">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Client Details</h4>
                    <div className="bg-[#F7FAFF] rounded-xl p-3.5 border border-blue-100/60">
                      <p className="text-sm font-semibold text-[#07184A]">{selected.contact}</p>
                      <p className="text-sm text-[#246BFE] mt-1">{selected.email}</p>
                      <p className="text-sm text-muted-foreground">{selected.phone}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Exam Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between gap-3"><span className="text-muted-foreground">Date / Time</span><span className="font-medium text-[#07184A] text-right">{dateTime}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-muted-foreground">Exam</span><span className="font-medium text-[#07184A] text-right">{selected.examType}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-muted-foreground">Vendor</span><span className="font-medium text-[#07184A]">{selected.vendor}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-muted-foreground">Confirmation #</span><span className="font-medium text-[#07184A]">{selected.confirmation}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-muted-foreground">Application</span><Badge variant="outline" className={`border ${getStatusColor(selected.appStatus)}`}>{selected.appStatus}</Badge></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Timeline</h4>
                    <div className="relative border-l-2 border-[#EEE7FF] ml-2 space-y-4 pb-1">
                      {selected.timeline.map((item, i) => (
                        <div key={i} className="relative pl-4">
                          <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${i === selected.timeline.length - 1 ? "bg-[#7C3AED] ring-4 ring-[#7C3AED]/20" : "bg-[#38A3FF]"}`} />
                          <p className="text-xs text-muted-foreground font-medium">{item.date}</p>
                          <p className="text-sm font-medium text-[#07184A]">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Next Steps</h4>
                    <div className="space-y-2">
                      {selected.nextSteps.map((step, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-sm">
                          {i === 0 ? <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" /> : <Circle className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />}
                          <span className={i === 0 ? "text-muted-foreground line-through" : "text-[#07184A]"}>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Dialog open={fullRecordOpen} onOpenChange={setFullRecordOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-gradient-to-r from-[#FF4FA3] via-[#E633FF] to-[#7C3AED] hover:opacity-90 border-0 shadow-md font-semibold text-white" data-testid="button-open-full-record">
                        Open Full Record <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-[#07184A]">
                          {selected.client}
                          <Badge variant="outline" className={`border ${getStatusColor(selected.status)}`}>{selected.status}</Badge>
                        </DialogTitle>
                      </DialogHeader>
                      <div className="grid sm:grid-cols-2 gap-5 py-2">
                        <div className="space-y-1.5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Client</h4>
                          <p className="text-sm font-semibold text-[#07184A]">{selected.contact}</p>
                          <p className="text-sm text-[#246BFE]">{selected.email}</p>
                          <p className="text-sm text-muted-foreground">{selected.phone}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {selected.location}</p>
                        </div>
                        <div className="space-y-2 text-sm">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Exam</h4>
                          <div className="flex justify-between"><span className="text-muted-foreground">License</span><span className="font-medium text-[#07184A]">{selected.license}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Exam Type</span><span className="font-medium text-[#07184A]">{selected.examType}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Date / Time</span><span className="font-medium text-[#07184A]">{dateTime}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Vendor</span><span className="font-medium text-[#07184A]">{selected.vendor}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Cost</span><span className="font-medium text-[#07184A]">{selected.examCost}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Passing Score</span><span className="font-medium text-[#07184A]">{selected.passingScore}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Deadline</span><span className="font-medium text-[#07184A]">{selected.deadline}</span></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Timeline</h4>
                        <div className="relative border-l-2 border-[#EEE7FF] ml-2 space-y-3">
                          {selected.timeline.map((item, i) => (
                            <div key={i} className="relative pl-4">
                              <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white bg-[#38A3FF]" />
                              <p className="text-xs text-muted-foreground font-medium">{item.date}</p>
                              <p className="text-sm font-medium text-[#07184A]">{item.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <p className="text-[11px] text-muted-foreground pt-1">Prototype view — no data is persisted.</p>
                    </DialogContent>
                  </Dialog>
                </TabsContent>

                <TabsContent value="notes" className="p-5 space-y-3 m-0 focus-visible:outline-none">
                  {selected.notes.map((n, i) => (
                    <div key={i} className="bg-[#F7FAFF] rounded-xl p-3.5 border border-blue-100/60">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-semibold text-[#07184A]">{n.author}</span>
                        <span className="text-xs text-muted-foreground">{n.date}</span>
                      </div>
                      <p className="text-sm text-[#07184A]/70">{n.text}</p>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="history" className="p-5 m-0 focus-visible:outline-none">
                  <div className="relative border-l-2 border-[#EEE7FF] ml-2 space-y-4">
                    {selected.timeline.map((item, i) => (
                      <div key={i} className="relative pl-4">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white bg-[#38A3FF]" />
                        <p className="text-xs text-muted-foreground font-medium">{item.date}</p>
                        <p className="text-sm font-medium text-[#07184A]">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
