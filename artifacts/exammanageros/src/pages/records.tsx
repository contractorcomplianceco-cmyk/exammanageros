import { useState, useMemo } from "react";
import { AppLayout } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, FileText, CheckCircle2, ShieldCheck, DollarSign } from "lucide-react";
import { MOCK_EXAM_QUEUE } from "@/data/mock-data";
import { getStatusColor } from "@/lib/status";
import type { ExamRow } from "@/data/mock-data";

export default function Records() {
  const [search, setSearch] = useState("");
  const [openRecord, setOpenRecord] = useState<ExamRow | null>(null);

  const filtered = useMemo(
    () =>
      MOCK_EXAM_QUEUE.filter(
        (r) =>
          !search ||
          r.client.toLowerCase().includes(search.toLowerCase()) ||
          r.license.toLowerCase().includes(search.toLowerCase()) ||
          r.state.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  );

  return (
    <AppLayout>
      <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-[#07184A] tracking-tight">Records</h1>
          <p className="text-muted-foreground mt-1">Every exam record across all clients and licenses.</p>
        </div>

        <Card className="border-border/50 shadow-sm overflow-hidden bg-white">
          <div className="p-4 border-b border-border/50 flex items-center justify-between bg-white/50">
            <h2 className="text-lg font-bold text-[#07184A]">All Records</h2>
            <div className="relative w-72">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="h-9 pl-9 bg-muted/30" placeholder="Search records..." value={search} onChange={(e) => setSearch(e.target.value)} data-testid="input-search-records" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#F7FAFF]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs uppercase font-semibold text-[#07184A]/60 tracking-wider">Client</TableHead>
                  <TableHead className="text-xs uppercase font-semibold text-[#07184A]/60 tracking-wider">License</TableHead>
                  <TableHead className="text-xs uppercase font-semibold text-[#07184A]/60 tracking-wider">State</TableHead>
                  <TableHead className="text-xs uppercase font-semibold text-[#07184A]/60 tracking-wider">Vendor</TableHead>
                  <TableHead className="text-xs uppercase font-semibold text-[#07184A]/60 tracking-wider">Status</TableHead>
                  <TableHead className="text-xs uppercase font-semibold text-[#07184A]/60 tracking-wider">Owner</TableHead>
                  <TableHead className="text-right text-xs uppercase font-semibold text-[#07184A]/60 tracking-wider">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((row) => (
                  <TableRow key={row.id} className="hover:bg-muted/30 transition-colors" data-testid={`row-record-${row.id}`}>
                    <TableCell className="font-medium text-[#07184A]">{row.client}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{row.license}</TableCell>
                    <TableCell><Badge variant="outline" className="bg-muted/50">{row.state}</Badge></TableCell>
                    <TableCell className="text-sm">{row.vendor}</TableCell>
                    <TableCell><Badge variant="outline" className={`font-medium border ${getStatusColor(row.status)}`}>{row.status}</Badge></TableCell>
                    <TableCell className="text-sm font-medium text-[#07184A]">{row.owner}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => setOpenRecord(row)} data-testid={`button-view-record-${row.id}`}>View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <Dialog open={!!openRecord} onOpenChange={(o) => !o && setOpenRecord(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          {openRecord && (
            <>
              <DialogHeader>
                <DialogTitle className="text-[#07184A] flex items-center gap-3">
                  {openRecord.client}
                  <Badge variant="outline" className={`font-medium border ${getStatusColor(openRecord.status)}`}>{openRecord.status}</Badge>
                </DialogTitle>
                <p className="text-sm text-muted-foreground">{openRecord.license} • {openRecord.state} • {openRecord.vendor}</p>
              </DialogHeader>
              <Tabs defaultValue="details" className="mt-2">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="prep">Prep & Docs</TabsTrigger>
                  <TabsTrigger value="financials">Financials</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <InfoCard icon={FileText} label="Applicant" value={openRecord.applicant} />
                    <InfoCard icon={ShieldCheck} label="App Status" value={openRecord.appStatus} />
                    <InfoCard icon={CheckCircle2} label="Exam Type" value={openRecord.examType} />
                    <InfoCard icon={FileText} label="Confirmation #" value={openRecord.confirmation} />
                    <InfoCard icon={FileText} label="Location" value={openRecord.location} />
                    <InfoCard icon={CheckCircle2} label="Passing Score" value={openRecord.passingScore} />
                  </div>
                </TabsContent>
                <TabsContent value="prep" className="pt-4 space-y-3">
                  <InfoCard icon={FileText} label="Prep Status" value={openRecord.prepStatus} />
                  <InfoCard icon={ShieldCheck} label="Pre-Approval Required" value={openRecord.preApproval ? "Yes" : "No"} />
                  <InfoCard icon={CheckCircle2} label="Risk Level" value={openRecord.risk} />
                  <InfoCard icon={CheckCircle2} label="Client Response" value={openRecord.clientResponse} />
                </TabsContent>
                <TabsContent value="financials" className="pt-4 grid grid-cols-2 gap-4">
                  <InfoCard icon={DollarSign} label="Exam Cost" value={openRecord.examCost} />
                  <InfoCard icon={DollarSign} label="Retest Cost" value={openRecord.retestCost} />
                </TabsContent>
                <TabsContent value="timeline" className="pt-4">
                  <div className="relative border-l-2 border-muted ml-2 space-y-4 pb-2">
                    {openRecord.timeline.map((item, i) => (
                      <div key={i} className="relative pl-4">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white bg-[#7C3AED]" />
                        <p className="text-xs text-muted-foreground font-medium">{item.date}</p>
                        <p className="text-sm font-medium text-[#07184A]">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

function InfoCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <Card className="border-border/50 bg-[#F7FAFF]">
      <CardContent className="p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center flex-shrink-0">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
          <p className="text-sm font-semibold text-[#07184A]">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
