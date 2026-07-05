import { useState } from "react";
import { AppLayout } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FolderSync, CheckCircle2, Clock, AlertCircle, Upload, Bell, Folder } from "lucide-react";
import { MOCK_DOC_CLIENTS } from "@/data/mock-data";
import { getStatusColor } from "@/lib/status";

export default function DocCollect() {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = MOCK_DOC_CLIENTS[activeIdx];

  const totalDocs = MOCK_DOC_CLIENTS.reduce((a, c) => a + c.docs.length, 0);
  const uploadedDocs = MOCK_DOC_CLIENTS.reduce((a, c) => a + c.docs.filter((d) => d.status === "Uploaded").length, 0);
  const missingDocs = MOCK_DOC_CLIENTS.reduce((a, c) => a + c.docs.filter((d) => d.status === "Missing").length, 0);
  const pendingDocs = MOCK_DOC_CLIENTS.reduce((a, c) => a + c.docs.filter((d) => d.status === "Pending Review").length, 0);

  const activeUploaded = active.docs.filter((d) => d.status === "Uploaded").length;
  const activePct = Math.round((activeUploaded / active.docs.length) * 100);

  return (
    <AppLayout>
      <div className="p-8 space-y-6 max-w-[1400px] mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-[#07184A] tracking-tight">DocCollect</h1>
          <p className="text-muted-foreground mt-1">Track document collection across every client folder.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Folder} label="Total Documents" value={totalDocs} color="text-[#246BFE]" bg="bg-[#246BFE]/10" />
          <StatCard icon={CheckCircle2} label="Uploaded" value={uploadedDocs} color="text-emerald-600" bg="bg-emerald-100" />
          <StatCard icon={Clock} label="Pending Review" value={pendingDocs} color="text-amber-600" bg="bg-amber-100" />
          <StatCard icon={AlertCircle} label="Missing" value={missingDocs} color="text-rose-600" bg="bg-rose-100" />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <Card className="w-full lg:w-[320px] flex-shrink-0 border-border/50 shadow-sm bg-white overflow-hidden">
            <div className="p-4 border-b border-border/50"><h2 className="text-lg font-bold text-[#07184A]">Client Folders</h2></div>
            <div className="divide-y divide-border/50">
              {MOCK_DOC_CLIENTS.map((c, i) => {
                const up = c.docs.filter((d) => d.status === "Uploaded").length;
                const complete = up === c.docs.length;
                return (
                  <button
                    key={c.folder}
                    onClick={() => setActiveIdx(i)}
                    className={`w-full text-left p-4 transition-colors ${activeIdx === i ? "bg-[#EEE7FF]/60" : "hover:bg-muted/30"}`}
                    data-testid={`folder-${i}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-sm text-[#07184A]">{c.client}</p>
                      {complete ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <AlertCircle className="h-4 w-4 text-amber-500" />}
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">{c.folder}</p>
                    <p className="text-xs text-muted-foreground mt-1">{up}/{c.docs.length} documents</p>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="flex-1 min-w-0 border-border/50 shadow-sm bg-white overflow-hidden">
            <div className="p-5 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center">
                  <FolderSync className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#07184A]">{active.client}</h3>
                  <p className="text-xs text-muted-foreground font-mono">{active.folder}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" data-testid="button-request-docs"><Bell className="h-4 w-4 mr-2" /> Request Missing Docs</Button>
            </div>
            <CardContent className="p-5 space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground font-medium">Collection progress</span>
                  <span className="font-semibold text-[#07184A]">{activePct}%</span>
                </div>
                <Progress value={activePct} className="h-2" />
              </div>
              <div className="space-y-2">
                {active.docs.map((doc) => (
                  <div key={doc.name} className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-[#F7FAFF]" data-testid={`doc-${doc.name.replace(/\s+/g, "-")}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${doc.status === "Uploaded" ? "bg-emerald-100 text-emerald-600" : doc.status === "Pending Review" ? "bg-amber-100 text-amber-600" : "bg-rose-100 text-rose-600"}`}>
                        {doc.status === "Uploaded" ? <CheckCircle2 className="h-4 w-4" /> : doc.status === "Pending Review" ? <Clock className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#07184A]">{doc.name} {doc.required && <span className="text-rose-500">*</span>}</p>
                        {doc.date ? <p className="text-xs text-muted-foreground">Received {doc.date}</p> : <p className="text-xs text-rose-500">Not received</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`border ${getStatusColor(doc.status)}`}>{doc.status}</Badge>
                      {doc.status === "Missing" && (
                        <Button size="sm" variant="outline" data-testid={`upload-${doc.name.replace(/\s+/g, "-")}`}><Upload className="h-3.5 w-3.5 mr-1" /> Upload</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

function StatCard({ icon: Icon, label, value, color, bg }: { icon: React.ElementType; label: string; value: number; color: string; bg: string }) {
  return (
    <Card className="shadow-sm border-white bg-gradient-to-b from-white to-[#F7FAFF]">
      <CardContent className="p-5">
        <div className={`w-8 h-8 rounded-lg ${bg} ${color} flex items-center justify-center mb-3`}>
          <Icon className="h-4 w-4" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <h3 className="text-2xl font-bold text-[#07184A] mt-1">{value}</h3>
      </CardContent>
    </Card>
  );
}
