import { useState } from "react";
import { useStore } from "@/store/useStore";
import { PageHeader, Card, Badge, PreviewBanner } from "@/components/shared";
import { useToast } from "@/hooks/use-toast";
import { Plug, RotateCcw, Users } from "lucide-react";

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
      <PreviewBanner className="mb-6" />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2"><Plug className="h-4 w-4 text-slate-400" /><h3 className="text-sm font-semibold text-slate-800">Integrations</h3></div>
          <div className="space-y-2">
            {INTEGRATIONS.map((i) => (
              <div key={i.name} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2.5">
                <div><div className="text-sm font-medium text-slate-700">{i.name}</div><div className="text-xs text-slate-400">{i.desc}</div></div>
                <Badge className={i.status === "Sync-ready preview" ? "bg-sky-50 text-sky-700 border-sky-200" : "bg-amber-50 text-amber-700 border-amber-200"}>{i.status}</Badge>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-400">All actions in this build update local representative data only. Connecting live integrations would enable real syncing.</p>
        </Card>

        <div className="space-y-5">
          <Card className="p-5">
            <div className="mb-4 flex items-center gap-2"><Users className="h-4 w-4 text-slate-400" /><h3 className="text-sm font-semibold text-slate-800">Team owners</h3></div>
            <div className="flex flex-wrap gap-2">
              {TEAM.map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-violet-500 text-[9px] text-white">{t[0]}</span>
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-400">Current user: <span className="font-medium text-slate-600">Rose Taylor</span></p>
          </Card>

          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2"><RotateCcw className="h-4 w-4 text-slate-400" /><h3 className="text-sm font-semibold text-slate-800">Demo data</h3></div>
            <p className="mb-3 text-xs text-slate-500">Reset all exams, transcripts, tasks, applications, client updates, and audit history back to the original seeded scenarios. This clears any changes you've made in this preview.</p>
            {!confirming ? (
              <button onClick={() => setConfirming(true)} data-testid="btn-reset" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100">Reset demo data</button>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => { s.resetDemoData(); setConfirming(false); toast({ title: "Demo data reset", description: "All records restored to the seeded scenarios." }); }} className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700">Confirm reset</button>
                <button onClick={() => setConfirming(false)} className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
