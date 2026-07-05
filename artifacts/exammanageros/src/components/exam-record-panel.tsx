import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight } from "lucide-react";
import type { ExamRow } from "@/data/mock-data";
import { getStatusColor } from "@/lib/status";

export function ExamRecordPanel({ record, onOpenFull }: { record: ExamRow; onOpenFull?: () => void }) {
  return (
    <Card className="shadow-lg border-border bg-white rounded-2xl overflow-hidden" data-testid="panel-exam-record">
      <div className="bg-gradient-to-r from-[#07184A] to-[#246BFE] p-5 text-white">
        <div className="flex justify-between items-start mb-4">
          <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm shadow-none">Exam Record</Badge>
          <Badge variant="outline" className={`border ${getStatusColor(record.status)}`}>{record.status}</Badge>
        </div>
        <h3 className="text-xl font-bold leading-tight" data-testid="text-record-client">{record.client}</h3>
        <p className="text-white/80 text-sm mt-1">{record.license} • {record.state}</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <div className="px-5 pt-4 border-b border-border">
          <TabsList className="w-full bg-muted/50 h-10">
            <TabsTrigger value="overview" className="flex-1 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">Overview</TabsTrigger>
            <TabsTrigger value="notes" className="flex-1 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">Notes</TabsTrigger>
            <TabsTrigger value="history" className="flex-1 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm">History</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="p-5 space-y-6 m-0 focus-visible:outline-none">
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Client Details</h4>
            <div className="bg-[#F7FAFF] rounded-xl p-3 border border-blue-100/50">
              <p className="text-sm font-semibold text-[#07184A]">{record.contact}</p>
              <p className="text-sm text-muted-foreground mt-1">{record.email}</p>
              <p className="text-sm text-muted-foreground">{record.phone}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Exam Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Date / Time</span><span className="font-medium text-[#07184A] text-right">{record.scheduledDate}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Exam</span><span className="font-medium text-[#07184A]">{record.examType}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Vendor</span><span className="font-medium text-[#07184A]">{record.vendor}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Conf #</span><span className="font-medium text-[#07184A]">{record.confirmation}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">App Status</span><span className="font-medium text-[#07184A]">{record.appStatus}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Deadline</span><span className="font-medium text-[#07184A]">{record.deadline}</span></div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Timeline</h4>
            <div className="relative border-l-2 border-muted ml-2 space-y-4 pb-2">
              {record.timeline.map((item, i) => (
                <div key={i} className="relative pl-4">
                  <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${i === record.timeline.length - 1 ? "bg-[#7C3AED] ring-4 ring-[#7C3AED]/20" : "bg-muted-foreground"}`}></div>
                  <p className="text-xs text-muted-foreground font-medium">{item.date}</p>
                  <p className="text-sm font-medium text-[#07184A]">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Next Steps</h4>
            <div className="space-y-2">
              {record.nextSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className="w-4 h-4 rounded border border-[#7C3AED]/40 flex-shrink-0" />
                  <span className="text-[#07184A]">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={onOpenFull}
              className="w-full bg-[#F7FAFF] text-[#246BFE] hover:bg-blue-50 border border-blue-100 shadow-sm font-semibold"
              variant="outline"
              data-testid="button-open-full-record"
            >
              Open Full Record <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="p-5 space-y-3 m-0 focus-visible:outline-none">
          {record.notes.map((note, i) => (
            <div key={i} className="bg-[#F7FAFF] rounded-xl p-3 border border-blue-100/50">
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-semibold text-[#07184A]">{note.author}</p>
                <p className="text-xs text-muted-foreground">{note.date}</p>
              </div>
              <p className="text-sm text-muted-foreground">{note.text}</p>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="history" className="p-5 space-y-4 m-0 focus-visible:outline-none">
          <div className="relative border-l-2 border-muted ml-2 space-y-4 pb-2">
            {record.timeline.map((item, i) => (
              <div key={i} className="relative pl-4">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white bg-muted-foreground" />
                <p className="text-xs text-muted-foreground font-medium">{item.date}</p>
                <p className="text-sm font-medium text-[#07184A]">{item.text}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
