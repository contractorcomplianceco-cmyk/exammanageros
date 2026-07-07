import { useState } from "react";
import { useStore } from "@/store/useStore";
import { PageHeader, Card, Badge, PreviewBanner } from "@/components/shared";
import { useToast } from "@/hooks/use-toast";
import { Plug, RotateCcw, Users } from "lucide-react";
import integrationDiagram from "@assets/ChatGPT_Image_Jul_5,_2026,_03_39_00_PM_(5)_1783455444784.png";

const INTEGRATIONS = [
  { name: "CRM / Zoho", desc: "Client, candidate, and application records", status: "Sync-ready preview" },
  { name: "ComplianceConnect (client portal)", desc: "Publishes approved client-facing status updates", status: "Sync-ready preview" },
  { name: "Doc Collection", desc: "Eligibility, ID, and score-report documents", status: "Sync-ready preview" },
  { name: "WorkDrive", desc: "Transcript and document file storage", status: "Sync-ready preview" },
  { name: "Email / notifications", desc: "Candidate reminders and client notifications", status: "Disabled in preview" },
];

const TEAM = ["Rose", "Carmen", "Emily", "Skylar", "Alyssa", "Christin"];

export default function Settings() {
  const s = useStore();
  const { toast } = useToast();
  const [confirming, setConfirming] = useState(false);

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Integration status, team, and demo data controls. This build is a protected preview — no external systems are contacted."
      />
      <PreviewBanner className="mb-8" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-8 flex flex-col">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 shadow-sm border border-purple-100">
              <Plug className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-purple-950">Integrations</h3>
          </div>
          
          <div className="mb-6 rounded-2xl overflow-hidden border border-purple-100/50 shadow-sm bg-white/50">
            <img src={integrationDiagram} alt="Integration Flow" className="w-full h-auto object-cover opacity-90" />
          </div>

          <div className="space-y-3 flex-1">
            {INTEGRATIONS.map((i) => (
              <div key={i.name} className="flex items-center justify-between gap-4 rounded-xl border border-white bg-white/60 px-4 py-3 shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <div className="text-sm font-bold text-purple-900">{i.name}</div>
                  <div className="text-[13px] font-medium text-slate-500 mt-0.5">{i.desc}</div>
                </div>
                <Badge className={i.status === "Sync-ready preview" ? "bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-purple-200" : "bg-slate-50 text-slate-600 border-slate-200"}>{i.status}</Badge>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[13px] font-medium text-slate-500 bg-white/40 p-3 rounded-xl border border-purple-100/50">All actions in this build update local representative data only. Connecting live integrations would enable real syncing.</p>
        </Card>

        <div className="space-y-6">
          <Card className="p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 shadow-sm border border-purple-100">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-purple-950">Team owners</h3>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {TEAM.map((t) => (
                <span key={t} className="inline-flex items-center gap-2 rounded-full border border-purple-100 bg-white/80 px-3.5 py-1.5 text-sm font-bold text-purple-900 shadow-sm">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-[10px] text-white font-black shadow-sm">{t[0]}</span>
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-5 text-[13px] font-medium text-slate-500">Current user: <span className="font-bold text-purple-700">Rose Taylor</span></p>
          </Card>

          <Card className="p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 shadow-sm border border-rose-100">
                <RotateCcw className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-purple-950">Demo data</h3>
            </div>
            <p className="mb-6 text-[13px] font-medium text-slate-500 leading-relaxed bg-white/40 p-4 rounded-xl border border-rose-100/50">Reset all exams, transcripts, tasks, applications, client updates, and audit history back to the original seeded scenarios. This clears any changes you've made in this preview.</p>
            {!confirming ? (
              <button onClick={() => setConfirming(true)} data-testid="btn-reset" className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-2.5 text-sm font-bold text-rose-700 hover:bg-rose-100 transition-colors shadow-sm">Reset demo data</button>
            ) : (
              <div className="flex items-center gap-3 bg-rose-50 p-4 rounded-xl border border-rose-200">
                <button onClick={() => { s.resetDemoData(); setConfirming(false); toast({ title: "Demo data reset", description: "All records restored to the seeded scenarios." }); }} className="rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-rose-700 transition-colors shadow-sm shadow-rose-600/20">Confirm reset</button>
                <button onClick={() => setConfirming(false)} className="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
