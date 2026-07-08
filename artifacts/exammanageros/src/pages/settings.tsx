import { useAuth } from "@/context/auth";
import { PageHeader, Card, Badge } from "@/components/shared";
import { Plug, Users } from "lucide-react";
import integrationDiagram from "@assets/ChatGPT_Image_Jul_5,_2026,_03_39_00_PM_(5)_1783455444784.png";

const INTEGRATIONS = [
  { key: "zoho", name: "CRM / Zoho", desc: "Client, candidate, and application records" },
  { key: "complianceConnect", name: "ComplianceConnect (client portal)", desc: "Publishes approved client-facing status updates" },
  { key: "docCollect", name: "Doc Collection", desc: "Eligibility, ID, and score-report documents" },
  { key: "workdrive", name: "WorkDrive", desc: "Transcript and document file storage" },
];

const TEAM = ["Rose", "Carmen", "Emily", "Skylar", "Alyssa", "Christin"];

export default function Settings() {
  const { user } = useAuth();

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Integration status, team, and operator workspace configuration."
      />

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
                <Badge className="bg-slate-50 text-slate-600 border-slate-200">Disabled</Badge>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[13px] font-medium text-slate-500 bg-white/40 p-3 rounded-xl border border-purple-100/50">Enable integrations via server env flags after Rose approval. Credentials are never stored in the browser.</p>
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
            <p className="mt-5 text-[13px] font-medium text-slate-500">Signed in as <span className="font-bold text-purple-700">{user?.name}</span> ({user?.role})</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
