import { Link } from "wouter";
import { useStore } from "@/store/useStore";
import { lookup } from "@/domain/derive";
import { PageHeader, Card, Badge, PreviewBanner, EmptyState } from "@/components/shared";
import { FileText, FolderInput } from "lucide-react";
import folderImg from "@assets/ChatGPT_Image_Jul_5,_2026,_03_39_00_PM_(4)_1783455444784.png";

const STATUS_TONE: Record<string, string> = {
  "Received": "bg-teal-50/80 text-teal-700 border-teal-200",
  "Missing": "bg-rose-50/80 text-rose-700 border-rose-200",
  "Preview only": "bg-white text-slate-600 border-slate-200",
  "Requested": "bg-amber-50/80 text-amber-700 border-amber-200",
};

export default function DocCollect() {
  const s = useStore();

  const refLabel = (relatedType: string, relatedId: string) => {
    if (relatedType === "candidate") return lookup.candidate(s, relatedId)?.fullName ?? relatedId;
    const exam = lookup.exam(s, relatedId);
    if (exam) return `${lookup.client(s, exam.clientId)?.name} · ${exam.examName}`;
    const tr = s.transcripts.find((t) => t.examId === relatedId);
    if (tr) { const e = lookup.exam(s, tr.examId); return e ? `${lookup.client(s, e.clientId)?.name} · transcript` : relatedId; }
    return relatedId;
  };
  const refHref = (relatedId: string) => {
    const exam = lookup.exam(s, relatedId);
    return exam ? `/exam/${exam.id}` : "/queue";
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
        <div className="flex-1">
          <PageHeader
            title="Doc Collection"
            subtitle="Documents tied to eligibility, exams, and transcripts. This is a sync-ready preview — live Doc Collection and WorkDrive sync are disabled in this build."
          />
        </div>
        <div className="shrink-0 hidden md:block">
          <img src={folderImg} alt="Folders" className="h-32 w-auto object-contain drop-shadow-xl" />
        </div>
      </div>
      <PreviewBanner className="mb-8" />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Received", count: s.documents.filter((d) => d.status === "Received").length, tone: "teal" },
          { label: "Missing", count: s.documents.filter((d) => d.status === "Missing").length, tone: "rose" },
          { label: "Preview only", count: s.documents.filter((d) => d.status === "Preview only").length, tone: "slate" },
        ].map((c) => (
          <Card key={c.label} className="flex items-center gap-4 p-6 hover:shadow-md transition-shadow">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm border ${c.tone === "teal" ? "bg-teal-50 text-teal-600 border-teal-100" : c.tone === "rose" ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-white text-slate-500 border-white"}`}><FolderInput className="h-6 w-6" /></div>
            <div><div className="text-3xl font-black text-purple-950 tracking-tight">{c.count}</div><div className="text-[13px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">{c.label}</div></div>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead><tr className="border-b border-purple-100/50 bg-white/40 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">
              {["Document", "Type", "Linked to", "Source system", "Status", "Notes"].map((c) => <th key={c} className="px-5 py-4 whitespace-nowrap">{c}</th>)}
            </tr></thead>
            <tbody>
              {s.documents.map((d) => (
                <tr key={d.id} className="border-b border-white/50 bg-white/20 hover:bg-purple-50/40 transition-colors group">
                  <td className="px-5 py-4"><div className="flex items-center gap-3 font-bold text-purple-900 group-hover:text-purple-600 transition-colors"><FileText className="h-4 w-4 text-purple-300" />{d.documentName}</div></td>
                  <td className="px-5 py-4 text-slate-600 font-medium">{d.documentType}</td>
                  <td className="px-5 py-4"><Link href={refHref(d.relatedId)} className="text-slate-600 hover:text-purple-700 font-bold transition-colors">{refLabel(d.relatedType, d.relatedId)}</Link></td>
                  <td className="px-5 py-4"><Badge className="bg-white text-slate-600 border-slate-200">{d.sourceSystem}</Badge></td>
                  <td className="px-5 py-4"><Badge className={STATUS_TONE[d.status] ?? STATUS_TONE["Preview only"]}>{d.status}</Badge></td>
                  <td className="px-5 py-4 text-[13px] font-medium text-slate-500">{d.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {s.documents.length === 0 && <EmptyState message="No documents." />}
        </div>
      </Card>
    </div>
  );
}
