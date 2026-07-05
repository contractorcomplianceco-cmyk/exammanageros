import { useState } from "react";
import { AppLayout } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MonitorPlay, Upload, CheckCircle2, Clock, CalendarDays, FileText, ExternalLink, Sparkles } from "lucide-react";
import { MOCK_DOC_CLIENTS, MOCK_EXAM_QUEUE } from "@/data/mock-data";
import { getStatusColor } from "@/lib/status";

const PORTAL_CLIENTS = MOCK_DOC_CLIENTS.map((c) => c.client);

export default function ComplianceConnect() {
  const [activeClient, setActiveClient] = useState(PORTAL_CLIENTS[0]);
  const docClient = MOCK_DOC_CLIENTS.find((c) => c.client === activeClient) ?? MOCK_DOC_CLIENTS[0];
  const uploaded = docClient.docs.filter((d) => d.status === "Uploaded").length;
  const pct = Math.round((uploaded / docClient.docs.length) * 100);
  const upcomingExam = MOCK_EXAM_QUEUE.find((e) => e.client === activeClient);

  return (
    <AppLayout>
      <div className="p-8 space-y-6 max-w-[1400px] mx-auto">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#07184A] tracking-tight">ComplianceConnect</h1>
            <p className="text-muted-foreground mt-1">A preview of the branded client portal — how your clients experience the process.</p>
          </div>
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 py-1.5 px-3">Preview only — no client login in this prototype</Badge>
        </div>

        <div className="flex gap-2 flex-wrap">
          {PORTAL_CLIENTS.map((c) => (
            <Button
              key={c}
              variant={activeClient === c ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveClient(c)}
              className={activeClient === c ? "bg-gradient-to-r from-[#FF4FA3] to-[#7C3AED] border-0" : ""}
              data-testid={`portal-client-${c.replace(/\s+/g, "-")}`}
            >
              {c}
            </Button>
          ))}
        </div>

        {/* Portal mock frame */}
        <div className="rounded-3xl border border-border shadow-lg overflow-hidden bg-white">
          <div className="h-10 bg-[#F7FAFF] border-b border-border flex items-center px-4 gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF7C7C]" />
              <div className="w-3 h-3 rounded-full bg-orange-300" />
              <div className="w-3 h-3 rounded-full bg-emerald-300" />
            </div>
            <div className="mx-auto text-xs text-muted-foreground flex items-center gap-1.5">
              <MonitorPlay className="h-3.5 w-3.5" /> connect.contractorcompliance.com/{activeClient.toLowerCase().replace(/\s+/g, "-")}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#07184A] to-[#246BFE] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/4 w-72 h-72 bg-[#E633FF]/20 blur-3xl rounded-full" />
            <div className="relative">
              <p className="text-white/70 text-sm font-medium">Contractor Compliance Authority</p>
              <h2 className="text-2xl font-bold mt-1">Welcome back, {activeClient}</h2>
              <p className="text-white/80 mt-2">Manage. Prepare. Succeed.</p>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-border/50 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base text-[#07184A]">Document Checklist</CardTitle>
                  <span className="text-sm font-medium text-[#7C3AED]">{uploaded}/{docClient.docs.length} complete</span>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={pct} className="h-2" />
                  <div className="space-y-2">
                    {docClient.docs.map((doc) => (
                      <div key={doc.name} className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-[#F7FAFF]">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${doc.status === "Uploaded" ? "bg-emerald-100 text-emerald-600" : doc.status === "Pending Review" ? "bg-amber-100 text-amber-600" : "bg-rose-100 text-rose-600"}`}>
                            {doc.status === "Uploaded" ? <CheckCircle2 className="h-4 w-4" /> : doc.status === "Pending Review" ? <Clock className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#07184A]">{doc.name} {doc.required && <span className="text-rose-500">*</span>}</p>
                            {doc.date && <p className="text-xs text-muted-foreground">{doc.date}</p>}
                          </div>
                        </div>
                        {doc.status === "Missing" ? (
                          <Button size="sm" variant="outline" data-testid={`portal-upload-${doc.name.replace(/\s+/g, "-")}`}><Upload className="h-3.5 w-3.5 mr-1" /> Upload</Button>
                        ) : (
                          <Badge variant="outline" className={`border ${getStatusColor(doc.status)}`}>{doc.status}</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-2"><CardTitle className="text-base text-[#07184A]">Upcoming Exam</CardTitle></CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-[#EEE7FF] to-[#F7FAFF] border border-blue-100/50">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#7C3AED]">
                      <CalendarDays className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#07184A]">{upcomingExam ? `${upcomingExam.examType} Exam` : "No exam scheduled"}</p>
                      <p className="text-sm text-muted-foreground">
                        {upcomingExam ? `${upcomingExam.scheduledDate} • ${upcomingExam.vendor} • ${upcomingExam.location}` : "Awaiting scheduling"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-border/50 shadow-sm bg-gradient-to-b from-white to-[#F7FAFF]">
                <CardContent className="p-5 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="h-7 w-7" />
                  </div>
                  <p className="text-sm text-muted-foreground">Your compliance is</p>
                  <p className="text-3xl font-bold text-[#07184A]">{pct}% ready</p>
                  <p className="text-xs text-muted-foreground mt-2">Complete remaining items to stay on track.</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-2"><CardTitle className="text-base text-[#07184A]">Need Help?</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">Your dedicated specialist is here for you.</p>
                  <div className="text-sm">
                    <p className="font-medium text-[#07184A]">Rose Taylor</p>
                    <p className="text-muted-foreground">support@contractorcompliance.com</p>
                  </div>
                  <Button variant="outline" className="w-full" data-testid="portal-contact"><ExternalLink className="h-4 w-4 mr-2" /> Message Specialist</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
