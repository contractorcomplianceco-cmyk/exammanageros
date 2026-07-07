import { Link } from "wouter";
import { useStore } from "@/store/useStore";
import { lookup, isOverdue } from "@/domain/derive";
import { transcriptTone } from "@/domain/status";
import { PageHeader, Card, Badge, PreviewBanner, fmtDate, EmptyState } from "@/components/shared";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

export default function Transcripts() {
  const s = useStore();
  const { toast } = useToast();
  const rows = s.transcripts.filter((t) => t.transcriptRequired);

  return (
    <div>
      <PageHeader
        title="Transcripts & Score Reports"
        subtitle="Official transcript pipeline. Applications stay blocked until transcripts are confirmed received by the board — even after a pass."
      />
      <PreviewBanner className="mb-8" />
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-sm">
            <thead><tr className="border-b border-purple-100/50 bg-white/40 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400">
              {["Client", "Candidate", "Exam", "Provider", "Status", "Ordered", "Received", "Follow-up due", "Confirmation", "Actions"].map((c) => <th key={c} className="px-5 py-4 whitespace-nowrap">{c}</th>)}
            </tr></thead>
            <tbody>
              {rows.map((t) => {
                const exam = lookup.exam(s, t.examId);
                if (!exam) return null;
                const cli = lookup.client(s, exam.clientId);
                const cand = lookup.candidate(s, exam.candidateId);
                const overdue = isOverdue(t.followUpDueDate) && t.transcriptStatus !== "Received by board";
                return (
                  <tr key={t.id} className="border-b border-white/50 bg-white/20 hover:bg-purple-50/40 transition-colors group">
                    <td className="px-5 py-4"><Link href={`/exam/${exam.id}`} className="font-bold text-purple-900 group-hover:text-purple-600 transition-colors">{cli?.name}</Link></td>
                    <td className="px-5 py-4 text-slate-600 font-medium">{cand?.fullName}</td>
                    <td className="px-5 py-4 max-w-[220px] truncate text-slate-700 font-semibold" title={exam.examName}>{exam.examName}</td>
                    <td className="px-5 py-4 text-slate-600 font-medium">{t.provider}</td>
                    <td className="px-5 py-4"><Badge className={transcriptTone(t.transcriptStatus)}>{t.transcriptStatus}</Badge></td>
                    <td className="px-5 py-4 text-slate-600 font-medium">{fmtDate(t.orderedDate)}</td>
                    <td className="px-5 py-4 text-slate-600 font-medium">{fmtDate(t.receivedDate)}</td>
                    <td className={`px-5 py-4 font-semibold ${overdue ? "text-rose-600" : "text-slate-600"}`}>{fmtDate(t.followUpDueDate)}</td>
                    <td className="px-5 py-4 text-[13px] font-medium text-slate-400">{t.confirmationNumber || "—"}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        {t.transcriptStatus === "Needs to be ordered" && <button onClick={() => { s.markTranscriptOrdered(exam.id); toast({ title: "Transcript ordered" }); }} className="inline-flex items-center rounded-xl border border-purple-200 bg-white/80 px-3 py-1.5 text-[12px] font-bold text-purple-900 hover:bg-purple-50 hover:border-purple-300 shadow-sm transition-all">Mark ordered</button>}
                        {t.transcriptStatus !== "Received by board" && <button onClick={() => { s.markTranscriptReceived(exam.id); toast({ title: "Transcript received" }); }} className="inline-flex items-center rounded-xl border border-purple-200 bg-white/80 px-3 py-1.5 text-[12px] font-bold text-purple-900 hover:bg-purple-50 hover:border-purple-300 shadow-sm transition-all">Mark received</button>}
                        <button onClick={() => { s.addTask({ title: `Transcript follow-up — ${exam.examName}`, type: "Confirm transcript received", relatedType: "transcript", relatedId: exam.id, owner: exam.owner }); toast({ title: "Follow-up created" }); }} className="inline-flex items-center gap-1 rounded-xl border border-white bg-white/60 px-3 py-1.5 text-[12px] font-bold text-slate-600 hover:bg-white hover:text-purple-700 shadow-sm transition-all"><Plus className="h-3 w-3" /> Follow up</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {rows.length === 0 && <EmptyState message="No transcripts required." />}
        </div>
      </Card>
    </div>
  );
}
