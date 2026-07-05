import { Link } from "wouter";
import { useStore } from "@/store/useStore";
import { lookup } from "@/domain/derive";
import { PageHeader, Card, Badge, PreviewBanner } from "@/components/shared";
import { FileText, FolderInput } from "lucide-react";

const STATUS_TONE: Record<string, string> = {
  "Received": "bg-teal-50 text-teal-700 border-teal-200",
  "Missing": "bg-rose-50 text-rose-700 border-rose-200",
  "Preview only": "bg-slate-100 text-slate-600 border-slate-200",
  "Requested": "bg-amber-50 text-amber-700 border-amber-200",
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
      <PageHeader
        title="Doc Collection"
        subtitle="Documents tied to eligibility, exams, and transcripts. This is a sync-ready preview — live Doc Collection and WorkDrive sync are disabled in this build."
      />
      <PreviewBanner className="mb-6" />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Received", count: s.documents.filter((d) => d.status === "Received").length, tone: "teal" },
          { label: "Missing", count: s.documents.filter((d) => d.status === "Missing").length, tone: "rose" },
          { label: "Preview only", count: s.documents.filter((d) => d.status === "Preview only").length, tone: "slate" },
        ].map((c) => (
          <Card key={c.label} className="flex items-center gap-3 p-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.tone === "teal" ? "bg-teal-50 text-teal-600" : c.tone === "rose" ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-500"}`}><FolderInput className="h-5 w-5" /></div>
            <div><div className="text-2xl font-semibold text-slate-800">{c.count}</div><div className="text-xs text-slate-500">{c.label}</div></div>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead><tr className="border-b border-slate-100 bg-slate-50/60 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {["Document", "Type", "Linked to", "Source system", "Status", "Notes"].map((c) => <th key={c} className="px-3 py-2.5 whitespace-nowrap">{c}</th>)}
            </tr></thead>
            <tbody>
              {s.documents.map((d) => (
                <tr key={d.id} className="border-b border-slate-50 hover:bg-sky-50/40">
                  <td className="px-3 py-2.5"><div className="flex items-center gap-2 font-medium text-slate-700"><FileText className="h-4 w-4 text-slate-300" />{d.documentName}</div></td>
                  <td className="px-3 py-2.5 text-slate-600">{d.documentType}</td>
                  <td className="px-3 py-2.5"><Link href={refHref(d.relatedId)} className="text-slate-600 hover:text-sky-600">{refLabel(d.relatedType, d.relatedId)}</Link></td>
                  <td className="px-3 py-2.5"><Badge className="bg-slate-100 text-slate-600 border-slate-200">{d.sourceSystem}</Badge></td>
                  <td className="px-3 py-2.5"><Badge className={STATUS_TONE[d.status] ?? STATUS_TONE["Preview only"]}>{d.status}</Badge></td>
                  <td className="px-3 py-2.5 text-xs text-slate-400">{d.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {s.documents.length === 0 && <div className="py-10 text-center text-sm text-slate-400">No documents.</div>}
        </div>
      </Card>
    </div>
  );
}
