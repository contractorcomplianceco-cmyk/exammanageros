import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Download, Plus, Search, Users, X } from "lucide-react";
import { MOCK_EXAM_QUEUE, EXAM_STATUSES, APP_STATUSES, STATES, VENDORS, OWNERS } from "@/data/mock-data";
import { getStatusColor, getRiskColor, getResponseColor } from "@/lib/status";
import { ExamRecordPanel } from "@/components/exam-record-panel";

export default function Queue() {
  const [selectedId, setSelectedId] = useState<string>(MOCK_EXAM_QUEUE[2].id);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [newExamOpen, setNewExamOpen] = useState(false);

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

  const selected = MOCK_EXAM_QUEUE.find((r) => r.id === selectedId) ?? MOCK_EXAM_QUEUE[0];
  const activeFilters = [statusFilter !== "all", stateFilter !== "all"].filter(Boolean).length;

  return (
    <AppLayout>
      <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#07184A] tracking-tight">Exam Queue</h1>
            <p className="text-muted-foreground mt-1">Track every exam from invoice paid to complete.</p>
          </div>
          <Dialog open={newExamOpen} onOpenChange={setNewExamOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#FF4FA3] to-[#7C3AED] hover:opacity-90 border-0 shadow-md" data-testid="button-new-exam">
                <Plus className="h-4 w-4 mr-1" /> New Exam
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-[#07184A]">Create New Exam Record</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-2">
                <div className="col-span-2 space-y-1.5">
                  <Label>Client / Company</Label>
                  <Input placeholder="Acme Contracting" data-testid="input-new-client" />
                </div>
                <div className="space-y-1.5">
                  <Label>State</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Vendor</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{VENDORS.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label>License / Application</Label>
                  <Input placeholder="General Contractor" />
                </div>
                <div className="space-y-1.5">
                  <Label>Exam Status</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{EXAM_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Owner</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>{OWNERS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewExamOpen(false)}>Cancel</Button>
                <Button className="bg-gradient-to-r from-[#FF4FA3] to-[#7C3AED] border-0" onClick={() => setNewExamOpen(false)} data-testid="button-save-new-exam">Create Record</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col xl:flex-row gap-6 items-start">
          <div className="flex-1 min-w-0 w-full">
            <Card className="border-border/50 shadow-sm overflow-hidden bg-white">
              <div className="p-4 border-b border-border/50 flex flex-wrap items-center gap-3 justify-between bg-white/50">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-[#07184A]">All Exams</h2>
                  <Badge className="bg-[#E633FF] hover:bg-[#E633FF]/90">{filtered.length}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative w-full sm:w-56">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input className="h-9 pl-9 bg-muted/30" placeholder="Search queue..." value={search} onChange={(e) => setSearch(e.target.value)} data-testid="input-search-queue" />
                  </div>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="h-9" data-testid="button-filters">
                        <Filter className="h-4 w-4 mr-2" /> Filters
                        {activeFilters > 0 && <Badge className="ml-2 bg-[#7C3AED] h-5 px-1.5">{activeFilters}</Badge>}
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Filter Exams</SheetTitle>
                      </SheetHeader>
                      <div className="space-y-5 py-6">
                        <div className="space-y-1.5">
                          <Label>Exam Status</Label>
                          <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger data-testid="select-filter-status"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All statuses</SelectItem>
                              {EXAM_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
                  <Button variant="outline" size="sm" className="h-9" data-testid="button-export">
                    <Download className="h-4 w-4 mr-2" /> Export
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-[#F7FAFF]">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs uppercase font-semibold text-[#07184A]/60 tracking-wider">Client / Company</TableHead>
                      <TableHead className="text-xs uppercase font-semibold text-[#07184A]/60 tracking-wider">State</TableHead>
                      <TableHead className="text-xs uppercase font-semibold text-[#07184A]/60 tracking-wider">License</TableHead>
                      <TableHead className="text-xs uppercase font-semibold text-[#07184A]/60 tracking-wider">Status</TableHead>
                      <TableHead className="text-xs uppercase font-semibold text-[#07184A]/60 tracking-wider">App Status</TableHead>
                      <TableHead className="text-xs uppercase font-semibold text-[#07184A]/60 tracking-wider">Client</TableHead>
                      <TableHead className="text-xs uppercase font-semibold text-[#07184A]/60 tracking-wider">Owner</TableHead>
                      <TableHead className="text-xs uppercase font-semibold text-[#07184A]/60 tracking-wider">Deadline</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((row) => (
                      <TableRow
                        key={row.id}
                        onClick={() => setSelectedId(row.id)}
                        className={`cursor-pointer transition-colors ${selectedId === row.id ? "bg-[#EEE7FF]/60 hover:bg-[#EEE7FF]/60" : "hover:bg-muted/30"}`}
                        data-testid={`row-exam-${row.id}`}
                      >
                        <TableCell className="font-medium text-[#07184A]">{row.client}</TableCell>
                        <TableCell><Badge variant="outline" className="bg-muted/50">{row.state}</Badge></TableCell>
                        <TableCell className="text-muted-foreground">
                          <div className="text-sm">{row.license}</div>
                          <div className="text-xs opacity-70">{row.examType}</div>
                        </TableCell>
                        <TableCell><Badge variant="outline" className={`font-medium border ${getStatusColor(row.status)}`}>{row.status}</Badge></TableCell>
                        <TableCell><Badge variant="outline" className={`font-medium border ${getStatusColor(row.appStatus)}`}>{row.appStatus}</Badge></TableCell>
                        <TableCell><Badge variant="outline" className={`font-medium border ${getResponseColor(row.clientResponse)}`}>{row.clientResponse}</Badge></TableCell>
                        <TableCell className="text-sm font-medium text-[#07184A]">{row.owner}</TableCell>
                        <TableCell className="text-sm font-medium">{row.deadline}</TableCell>
                      </TableRow>
                    ))}
                    {filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">No exams match your filters.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="p-4 border-t border-border/50 flex justify-between items-center text-sm text-muted-foreground bg-gray-50/50">
                <span className="flex items-center gap-2"><Users className="h-4 w-4" /> Showing {filtered.length} of 16 exams</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
            </Card>
          </div>

          <div className="w-full xl:w-[380px] flex-shrink-0 xl:sticky xl:top-4">
            <ExamRecordPanel record={selected} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
